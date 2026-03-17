#!/usr/bin/env node

/**
 * generate-reference.js
 *
 * Reads all documentation page JSX files from the frontend docs directory and
 * generates a compact ZANGO-SKILL-REFERENCE.md at the project root.
 *
 * Usage:  node scripts/generate-reference.js
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────

const PAGES_DIR = path.resolve(
  __dirname,
  '../frontend/src/custom/pages'
);

const OUTPUT_FILE = path.resolve(__dirname, '../ZANGO-SKILL-REFERENCE.md');

const DOC_FILES = [
  'CrudHandlerDocs.jsx',
  'TableStylingDocs.jsx',
  'UseTableDocs.jsx',
  'DetailViewsDocs.jsx',
  'TableBodyDocs.jsx',
  'TableHeaderDocs.jsx',
  'TableUtilitiesDocs.jsx',
  'TablePaginationDocs.jsx',
  'TableSearchDocs.jsx',
  'TableAddButtonDocs.jsx',
  'WorkflowStatusDocs.jsx',
  'WorkflowTagsDocs.jsx',
  'WorkflowHooksDocs.jsx',
  'FormRendererDocs.jsx',
  'RenderPropsDocs.jsx',
  'AdvancedDocs.jsx',
  'GettingStarted.jsx',
  'ProjectStructure.jsx',
  'ZangoAppDocs.jsx',
  'AppInitializerDocs.jsx',
  'NavbarTopbarDocs.jsx',
  'RoutingPagesDocs.jsx',
  'AuthDocs.jsx',
  'ThemeBuildDocs.jsx',
  'BackendInfoDocs.jsx',
];

// ─── Parsers ────────────────────────────────────────────────────────────────

/**
 * Extract the DocPage title attribute.
 */
function extractTitle(src) {
  const m = src.match(/<DocPage[\s\S]*?title="([^"]+)"/);
  return m ? m[1] : null;
}

/**
 * Extract the DocPage subtitle attribute.
 */
function extractSubtitle(src) {
  const m = src.match(/<DocPage[\s\S]*?subtitle="([^"]+)"/);
  return m ? m[1] : null;
}

/**
 * Extract the DocPage badge attribute.
 */
function extractBadge(src) {
  const m = src.match(/<DocPage[\s\S]*?badge="([^"]+)"/);
  return m ? m[1] : null;
}

/**
 * Extract all <Section title="..."> titles in order.
 */
function extractSections(src) {
  const sections = [];
  const re = /<Section\s+title="([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    sections.push(m[1]);
  }
  return sections;
}

/**
 * Parse a single JS object literal for a prop entry.
 * Handles nested quotes, escaped characters, and multi-line values.
 */
function parsePropObject(objStr) {
  const prop = {};

  // name
  const nameMatch = objStr.match(/name:\s*'([^']*)'/) || objStr.match(/name:\s*"([^"]*)"/);
  if (nameMatch) prop.name = nameMatch[1];

  // type — may contain single-quoted strings with pipes
  const typeMatch = objStr.match(/type:\s*'((?:[^'\\]|\\.)*)'/) || objStr.match(/type:\s*"((?:[^"\\]|\\.)*)"/);
  if (typeMatch) prop.type = typeMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"');

  // required
  const reqMatch = objStr.match(/required:\s*(true|false)/);
  if (reqMatch) prop.required = reqMatch[1] === 'true';

  // default — can be boolean, number, string, or quoted string
  const defMatchBool = objStr.match(/default:\s*(true|false)(?:\s*[,}])/);
  const defMatchStr = objStr.match(/default:\s*'((?:[^'\\]|\\.)*)'/) || objStr.match(/default:\s*"((?:[^"\\]|\\.)*)"/);
  const defMatchNum = objStr.match(/default:\s*(\d+)(?:\s*[,}])/);
  if (defMatchStr) {
    prop.default = defMatchStr[1];
  } else if (defMatchBool) {
    prop.default = defMatchBool[1];
  } else if (defMatchNum) {
    prop.default = defMatchNum[1];
  }

  // description — grab everything after description: and the opening quote
  const descMatch = objStr.match(/description:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/s);
  if (descMatch) {
    prop.description = (descMatch[1] || descMatch[2] || '').replace(/\\'/g, "'").replace(/\\"/g, '"');
  }

  return prop.name ? prop : null;
}

/**
 * Extract all props arrays from PropsTable components in the source.
 * Returns an array of { props: [...] } objects, one per PropsTable.
 */
function extractAllPropsTables(src) {
  const results = [];

  // Find each props={[...]} block
  // We need to handle nested brackets carefully
  const propsStartRe = /props=\{\[/g;
  let startMatch;

  while ((startMatch = propsStartRe.exec(src)) !== null) {
    const startIdx = startMatch.index + startMatch[0].length;
    let depth = 1;
    let i = startIdx;

    while (i < src.length && depth > 0) {
      if (src[i] === '[') depth++;
      else if (src[i] === ']') depth--;
      i++;
    }

    if (depth === 0) {
      const arrayContent = src.substring(startIdx, i - 1);

      // Split into individual object literals
      const props = [];
      let objDepth = 0;
      let objStart = -1;

      for (let j = 0; j < arrayContent.length; j++) {
        const ch = arrayContent[j];
        if (ch === '{') {
          if (objDepth === 0) objStart = j;
          objDepth++;
        } else if (ch === '}') {
          objDepth--;
          if (objDepth === 0 && objStart >= 0) {
            const objStr = arrayContent.substring(objStart, j + 1);
            const parsed = parsePropObject(objStr);
            if (parsed) props.push(parsed);
            objStart = -1;
          }
        }
      }

      if (props.length > 0) {
        results.push(props);
      }
    }
  }

  return results;
}

/**
 * Extract all code blocks from CodeBlock components.
 * Works by finding each `<CodeBlock` tag, then scanning forward character by
 * character to properly handle backtick template literals inside the code
 * attribute (which may themselves contain `/>` sequences).
 *
 * Returns an array of { language, title, code } objects.
 */
function extractCodeBlocks(src) {
  const blocks = [];
  const tagStartRe = /<CodeBlock\b/g;
  let tagMatch;

  while ((tagMatch = tagStartRe.exec(src)) !== null) {
    // Starting after "<CodeBlock", scan forward to find the end of the
    // component.  We track whether we are inside a backtick template
    // literal so that `/>` inside code content does not prematurely
    // terminate the match.

    let pos = tagMatch.index + tagMatch[0].length;
    let inBacktick = false;
    let componentEnd = -1;

    while (pos < src.length) {
      const ch = src[pos];

      if (inBacktick) {
        // Inside a template literal: look for the unescaped closing backtick
        if (ch === '\\') {
          pos += 2; // skip escaped character
          continue;
        }
        if (ch === '`') {
          inBacktick = false;
        }
        pos++;
        continue;
      }

      // Outside template literal
      if (ch === '`') {
        inBacktick = true;
        pos++;
        continue;
      }

      // Self-closing end
      if (ch === '/' && src[pos + 1] === '>') {
        componentEnd = pos + 2;
        break;
      }

      pos++;
    }

    if (componentEnd < 0) continue;

    const fullTag = src.substring(tagMatch.index, componentEnd);
    const block = {};

    // language
    const langMatch = fullTag.match(/language="([^"]+)"/);
    if (langMatch) block.language = langMatch[1];

    // title
    const titleMatch = fullTag.match(/title="([^"]+)"/);
    if (titleMatch) block.title = titleMatch[1];

    // code — extract the template literal between code={` and `}
    const codeMarker = 'code={`';
    const codeIdx = fullTag.indexOf(codeMarker);
    if (codeIdx >= 0) {
      const codeStart = codeIdx + codeMarker.length;
      // Scan forward for the closing `}
      let cp = codeStart;
      let foundEnd = false;

      while (cp < fullTag.length) {
        if (fullTag[cp] === '\\') {
          cp += 2; // skip escaped char
          continue;
        }
        if (fullTag[cp] === '`' && fullTag[cp + 1] === '}') {
          foundEnd = true;
          break;
        }
        cp++;
      }

      if (foundEnd) {
        let codeStr = fullTag.substring(codeStart, cp);
        // Unescape template literal escapes
        codeStr = codeStr.replace(/\\`/g, '`').replace(/\\\$/g, '$');
        block.code = codeStr;
      }
    }

    if (block.code) {
      blocks.push(block);
    }
  }

  return blocks;
}

/**
 * Extract unique import statements from code blocks.
 */
function extractImports(codeBlocks) {
  const imports = new Set();

  for (const block of codeBlocks) {
    if (!block.code) continue;
    const lines = block.code.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('import ') && (trimmed.includes(' from ') || trimmed.includes('require('))) {
        // Normalize: remove trailing semicolons for dedup, then re-add
        const normalized = trimmed.replace(/;$/, '').trim();
        if (normalized.includes('@zango-core/') ||
            normalized.includes('@/components/') ||
            normalized.includes('react-router-dom') ||
            normalized.includes('lucide-react')) {
          imports.add(normalized + ';');
        }
      }
    }
  }

  return Array.from(imports).sort();
}

// ─── Markdown Generators ────────────────────────────────────────────────────

function propsToMarkdownTable(props) {
  if (!props || props.length === 0) return '';

  let md = '| Prop | Type | Default | Description |\n';
  md += '|------|------|---------|-------------|\n';

  for (const p of props) {
    const name = p.required ? `**${p.name}** *` : p.name;
    const type = `\`${(p.type || '').replace(/\|/g, '\\|')}\``;
    const def = p.default !== undefined ? `\`${p.default}\`` : '—';
    const desc = (p.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    md += `| ${name} | ${type} | ${def} | ${desc} |\n`;
  }

  return md;
}

function codeBlockToMarkdown(block) {
  const lang = block.language || 'jsx';
  const header = block.title ? `<!-- ${block.title} -->\n` : '';
  return `${header}\`\`\`${lang}\n${block.code}\n\`\`\``;
}

// ─── Hardcoded Sections ─────────────────────────────────────────────────────

const HARDCODED_SECTIONS = `## API Response Formats

### Table Metadata (GET ?action=get_table_metadata)
\`\`\`json
{
  "success": true,
  "response": {
    "table_metadata": {
      "columns": [{ "name": "field", "display_name": "Field", "type": "string", "sortable": true, "filterable": true }],
      "filters": [{ "id": "field", "name": "Field", "type": "select", "options": [{ "value": "v", "label": "L" }] }],
      "page_title": "Page Title",
      "has_add_perm": true,
      "has_upload_perm": false,
      "has_download_perm": true,
      "utilities_config": { "show_search": true, "show_filters_button": true, "show_column_options": true },
      "form_config": { "drawer_size": "md", "show_confirm_alert": false },
      "actions": [{ "name": "Edit", "key": "edit", "type": "form" }]
    }
  }
}
\`\`\`

### Table Data (GET ?action=get_table_data)
\`\`\`json
{
  "success": true,
  "response": {
    "table_data": [{ "id": 1, "object_uuid": "uuid", "field": "value", "workflow_status": { "status_label": "Active", "status_color": "#12B76A" }, "row_actions": [{ "name": "Edit", "key": "edit", "type": "form" }] }],
    "table_metadata": { "..." : "..." },
    "recordsTotal": 25,
    "recordsFiltered": 25
  }
}
\`\`\`

### Detail View (GET ?action=fetch_item_details&object_uuid=UUID)
\`\`\`json
{
  "success": true,
  "response": {
    "pk": 1, "object_uuid": "uuid", "title": "Record Title",
    "general_details": { "fields": { "field_name": { "name": "field_name", "display_name": "Field", "type": "string", "value": "val" } } },
    "workflow_details": {
      "current_status": "active",
      "current_status_meta": { "status_label": "Active", "status_color": "#12B76A" },
      "next_transitions": [{ "name": "approve", "display_name": "Approve", "from": "active", "to": "approved", "is_form_based": false, "to_state_meta": { "status_label": "Approved", "status_color": "#12B76A" } }],
      "tag_details": [{ "name": "urgent", "state": "enabled", "tag_label": "Urgent", "enable": { "is_form_based": false }, "disable": { "is_form_based": false } }]
    },
    "row_actions": [{ "name": "Edit", "key": "edit", "type": "form" }],
    "sections": [{ "key": "overview", "title": "Overview", "data": {} }]
  }
}
\`\`\`

### Form Schema (GET ?action=initialize_form)
\`\`\`json
{
  "success": true,
  "response": {
    "is_multistep": false,
    "form": {
      "json_schema": { "type": "object", "title": "Form", "required": ["name"], "properties": { "name": { "type": "string", "title": "Name" } } },
      "ui_schema": { "name": { "ui:placeholder": "Enter name" } },
      "form_data": {}
    }
  }
}
\`\`\`

## Column Types
- \`string\`, \`integer\`, \`float\`, \`boolean\`, \`date\`, \`datetime\`, \`email\`, \`file\`, \`url\`, \`uuid\`, \`json\`
- \`StatusCol\` - workflow status badge (data: \`{ status_label, status_color }\`)
- \`TagsCol\` - workflow tags
- \`ActionsCol\` - row action buttons (data: \`[{ name, key, type: "form"|"simple", confirmation_message }]\`)
- \`WorkflowTransitionsCol\` - available transitions

## Row Action Types
- \`type: "form"\` - opens form drawer
- \`type: "simple"\` - shows confirmation dialog (uses \`confirmation_message\` field)
`;

// ─── Main ───────────────────────────────────────────────────────────────────

function processFile(filename) {
  const filepath = path.join(PAGES_DIR, filename);

  let src;
  try {
    src = fs.readFileSync(filepath, 'utf-8');
  } catch (err) {
    console.warn(`  SKIP: Could not read ${filename}: ${err.message}`);
    return null;
  }

  const title = extractTitle(src);
  const subtitle = extractSubtitle(src);
  const badge = extractBadge(src);
  const sections = extractSections(src);
  const allProps = extractAllPropsTables(src);
  const codeBlocks = extractCodeBlocks(src);

  return { filename, title, subtitle, badge, sections, allProps, codeBlocks };
}

function buildMarkdown(pages) {
  const allCodeBlocks = pages.flatMap((p) => p.codeBlocks);
  const imports = extractImports(allCodeBlocks);

  let md = '';

  // Header
  md += '# Zango CRUD - Complete Reference\n\n';
  md += '> Auto-generated from documentation source files. Do not edit directly.\n';
  md += '> Regenerate with: `node scripts/generate-reference.js`\n\n';

  // Quick Import Reference
  md += '## Quick Import Reference\n\n';
  md += '```jsx\n';
  md += imports.join('\n');
  md += '\n```\n\n';

  // Hardcoded sections
  md += HARDCODED_SECTIONS;
  md += '\n---\n\n';

  // Per-page sections
  for (const page of pages) {
    if (!page) continue;

    md += `## ${page.title || page.filename}\n\n`;

    if (page.badge) {
      md += `**${page.badge}**`;
    }
    if (page.subtitle) {
      md += (page.badge ? ' | ' : '') + page.subtitle;
    }
    if (page.badge || page.subtitle) {
      md += '\n\n';
    }

    // Sections
    if (page.sections.length > 0) {
      md += '### Sections\n';
      for (const s of page.sections) {
        md += `- ${s}\n`;
      }
      md += '\n';
    }

    // Props tables
    if (page.allProps.length > 0) {
      md += '### Props\n\n';
      for (let i = 0; i < page.allProps.length; i++) {
        if (page.allProps.length > 1) {
          md += `#### Props Table ${i + 1}\n\n`;
        }
        md += propsToMarkdownTable(page.allProps[i]);
        md += '\n';
      }
    }

    // Code examples
    if (page.codeBlocks.length > 0) {
      md += '### Code Examples\n\n';
      for (const block of page.codeBlocks) {
        md += codeBlockToMarkdown(block);
        md += '\n\n';
      }
    }

    md += '---\n\n';
  }

  return md;
}

function main() {
  console.log('Generating ZANGO-SKILL-REFERENCE.md ...');
  console.log(`  Source: ${PAGES_DIR}`);
  console.log(`  Output: ${OUTPUT_FILE}`);
  console.log('');

  const pages = [];

  for (const file of DOC_FILES) {
    console.log(`  Processing: ${file}`);
    const result = processFile(file);
    if (result) {
      const propCount = result.allProps.reduce((sum, arr) => sum + arr.length, 0);
      console.log(`    -> Title: "${result.title}", Badge: "${result.badge}", Sections: ${result.sections.length}, Props: ${propCount}, Code Blocks: ${result.codeBlocks.length}`);
      pages.push(result);
    }
  }

  console.log('');

  const markdown = buildMarkdown(pages);
  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf-8');

  const stats = {
    pages: pages.length,
    totalProps: pages.reduce((sum, p) => sum + p.allProps.reduce((s, arr) => s + arr.length, 0), 0),
    totalCodeBlocks: pages.reduce((sum, p) => sum + p.codeBlocks.length, 0),
    totalSections: pages.reduce((sum, p) => sum + p.sections.length, 0),
    fileSize: (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1),
  };

  console.log('  Done!');
  console.log(`  Pages: ${stats.pages}`);
  console.log(`  Total Props: ${stats.totalProps}`);
  console.log(`  Total Code Blocks: ${stats.totalCodeBlocks}`);
  console.log(`  Total Sections: ${stats.totalSections}`);
  console.log(`  Output Size: ${stats.fileSize} KB`);
}

main();
