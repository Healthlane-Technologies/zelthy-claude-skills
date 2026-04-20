#!/usr/bin/env node

/**
 * Reference Generator for Zango Skills
 *
 * Scans frontend/src/custom/pages/*.jsx for <DocPage category="..."> props.
 * Generates per-category directories in skills/zango-frontend/references/:
 *   - <category>/index.md  — imports, API shapes, component listing
 *   - <category>/<Title>.md — props + code examples per component
 *
 * Usage: node scripts/generate-reference.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'frontend', 'src', 'custom', 'pages');
const REFS_DIR = path.join(ROOT, 'skills', 'zango-frontend', 'references');

const VALID_CATEGORIES = ['crud', 'workflow', 'form', 'appbuilder'];

// ─── Parsers ───

function extractMeta(src) {
  const title = src.match(/title\s*=\s*"([^"]+)"/)?.[1] || null;
  const category = src.match(/category\s*=\s*"([^"]+)"/)?.[1] || null;
  const subtitle = src.match(/subtitle\s*=\s*"([^"]+)"/)?.[1] || null;
  const badge = src.match(/badge\s*=\s*"([^"]+)"/)?.[1] || null;
  return { title, category, subtitle, badge };
}

function extractSections(src) {
  const sections = [];
  const re = /<Section\s+title\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    sections.push(m[1]);
  }
  return sections;
}

function extractProps(src) {
  const allProps = [];
  const blockRe = /props\s*=\s*\{\s*\[/g;
  let blockMatch;

  while ((blockMatch = blockRe.exec(src)) !== null) {
    let depth = 1;
    let i = blockMatch.index + blockMatch[0].length;
    let blockContent = '';

    while (i < src.length && depth > 0) {
      if (src[i] === '[') depth++;
      if (src[i] === ']') depth--;
      if (depth > 0) blockContent += src[i];
      i++;
    }

    const propRe = /\{\s*name:\s*['"]([^'"]+)['"]\s*,\s*type:\s*['"]([^'"]+)['"]/g;
    const propStarts = [];
    let pm;
    while ((pm = propRe.exec(blockContent)) !== null) {
      propStarts.push({ index: pm.index, name: pm[1], type: pm[2] });
    }
    for (let k = 0; k < propStarts.length; k++) {
      const start = propStarts[k].index;
      const end = k + 1 < propStarts.length ? propStarts[k + 1].index : blockContent.length;
      const slice = blockContent.slice(start, end);

      const defMatch = slice.match(/default:\s*([^,}\n]+)/);
      const descMatch = slice.match(/description:\s*['"](.+?)['"]\s*[,}]/s);

      allProps.push({
        name: propStarts[k].name,
        type: propStarts[k].type,
        default: defMatch ? defMatch[1].trim().replace(/['"]/g, '') : '',
        description: descMatch ? descMatch[1].replace(/\n\s*/g, ' ') : '',
      });
    }
  }
  return allProps;
}

function extractCodeBlocks(src) {
  const blocks = [];
  const tagRe = /<CodeBlock\b/g;
  let tagMatch;

  while ((tagMatch = tagRe.exec(src)) !== null) {
    let searchStart = tagMatch.index;
    let tagEnd = src.indexOf('/>', searchStart);
    const closingTag = src.indexOf('</CodeBlock>', searchStart);
    if (closingTag !== -1 && (tagEnd === -1 || closingTag < tagEnd)) {
      tagEnd = closingTag;
    }
    if (tagEnd === -1) continue;

    const tagContent = src.slice(searchStart, tagEnd);

    const lang = tagContent.match(/language\s*=\s*"([^"]+)"/)?.[1] || 'jsx';
    const title = tagContent.match(/title\s*=\s*"([^"]+)"/)?.[1] || '';

    const codeStart = tagContent.indexOf('code={`');
    if (codeStart === -1) continue;

    let i = codeStart + 'code={`'.length;
    let code = '';
    let escaped = false;

    while (i < tagContent.length) {
      const ch = tagContent[i];
      if (escaped) {
        code += ch;
        escaped = false;
        i++;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        i++;
        continue;
      }
      if (ch === '`' && tagContent[i + 1] === '}') {
        break;
      }
      code += ch;
      i++;
    }

    if (code.trim()) {
      blocks.push({
        language: lang,
        title: title,
        code: code.replace(/\\`/g, '`').replace(/\\\$/g, '$'),
      });
    }
  }
  return blocks;
}

// ─── Index Headers (imports + API shapes per category) ───

const INDEX_HEADERS = {
  crud: `# Zango CRUD Reference

> Auto-generated from documentation pages. Regenerate with: \`node scripts/generate-reference.js\`

## Quick Import Reference
\`\`\`js
// Main CRUD component + unified hook
import { CrudHandler, useTable, Table } from '@zango-core/crud/table';

// Context / provider
import { TableProvider, useTableContext, DetailViewProvider } from '@zango-core/crud/table';

// Specialized hooks
import {
  useTableSearch, useTableFilters, useTablePagination, useTableSelection,
  useTableColumns, useTableActions, useTableRowActions, useTableData,
  useDetailView, useDetailViewContext, useWorkflow,
} from '@zango-core/crud/table';

// Composable components
import {
  TableSearch, TablePagination, TableBody, TableDrawer,
  TableHeader, TableUtilities, TableAddButton, TableFilters,
} from '@zango-core/crud/table';

// Individual control buttons
import {
  TableSearchField, TableFilterButton, TableUploadButton, TableDownloadButton,
  TableColumnOptionsButton, TableClearFiltersButton,
} from '@zango-core/crud/table';

// Layout helpers
import { TableLayout, TableToolbar, TableContainer } from '@zango-core/crud/table';

// Cell components
import { ActionsCell, StatusCell, WorkflowTransitionsCell } from '@zango-core/crud/table';

// Workflow (standalone, context-aware)
import {
  WorkflowStatus, WorkflowTags, StandaloneDetailView, WorkflowFormRenderer,
  StatusBadge, StatusButton, TagSwitch,
} from '@zango-core/crud/table';

// Detail wrappers
import { DetailWrapper, DrawerDetailWrapper } from '@zango-core/crud/table';

// Types
import type {
  CrudHandlerProps, RowClickAction, RowClickConfig,
  UseTableProps, UseTableReturn, TableConfig,
  TableAddButtonProps, TableHeaderProps, TableUtilitiesProps,
  TableSearchFieldProps, TableFilterButtonProps, TableUploadButtonProps,
  TableDownloadButtonProps, TableColumnOptionsButtonProps, TableClearFiltersButtonProps,
  WorkflowDetails, Transition, TagDetail, DetailViewData,
  ConfirmationAlertProps, WorkflowStatusRenderTransitionsParams,
  WorkflowStatusProps, WorkflowTagsProps,
} from '@zango-core/crud/table';
\`\`\`

## API Response Formats

### Table Metadata (GET ?action=get_table_metadata)
\`\`\`json
{ "success": true, "response": { "table_metadata": { "pagination": 10, "scrollMode": "pagination", "page_title": "Title", "add_btn_title": "Add Record", "has_add_perm": true, "has_download_perm": true, "has_upload_perm": true, "show_header": true, "show_utilities": true, "show_body": true, "show_pagination": true, "show_count": true, "show_add_button": true, "enable_empty_state_create": true, "columns": [{ "name": "field", "display_name": "Field", "type": "string", "sortable": true, "searchable": true }], "filters": [], "utilities_config": { "show_search": true, "show_filters_button": true, "show_column_options": true }, "pagination_config": { "show_rows_per_page": true, "rows_per_page_options": [10, 25, 50, 100], "show_page_info": true }, "detail_config": { "enable_route": false, "default_view": "drawer", "drawer_size": "lg" }, "table_features_config": { "enable_column_pinning": true, "enable_sorting": true, "enable_hiding": true, "enable_column_ordering": true }, "form_config": { "show_confirm_alert": false, "show_icon": true } } } }
\`\`\`

### Table Data (GET ?action=get_table_data)
\`\`\`json
{ "success": true, "response": { "table_data": [{ "id": 1, "object_uuid": "uuid", "workflow_status": { "status_label": "Active", "status_color": "#12B76A" }, "row_actions": [{ "name": "Edit", "key": "edit", "type": "form" }] }], "recordsTotal": 25 } }
\`\`\`

### Detail View (GET ?action=fetch_item_details&object_uuid=UUID)
\`\`\`json
{ "success": true, "response": { "pk": 1, "object_uuid": "uuid", "title": "Title", "general_details": { "fields": { "name": { "display_name": "Name", "value": "val" } } }, "workflow_details": { "current_status": "active", "current_status_meta": { "status_label": "Active", "status_color": "#12B76A" }, "next_transitions": [{ "name": "approve", "display_name": "Approve", "is_form_based": false, "confirmation_message": "Approve this record?", "description": "Moves record to approved state", "from": "pending", "to": "approved" }], "tag_details": [{ "name": "urgent", "state": "enabled", "enable": { "is_form_based": false, "confirmation_message": "Enable urgent tag?" }, "disable": { "is_form_based": false, "confirmation_message": "Disable urgent tag?" }, "is_enable_allowed": true, "is_disable_allowed": true }] }, "sections": [{ "key": "overview", "title": "Overview", "data": {} }] } }
\`\`\`

Note: \`to_state_meta\` only appears on audit-log / workflow-transaction entries, NOT on \`next_transitions[]\`.

## Column Types
- \`string\`, \`number\`, \`date\` - primitive column types
- \`StatusCol\` - data: \`{ status_label, status_color }\`
- \`TagsCol\` - workflow tags
- \`ActionsCol\` - row actions: \`[{ name, key, type: "form"|"simple", confirmation_message }]\`
- \`WorkflowTransitionsCol\` - available transitions
- \`select\` - choice-backed column with \`choices: [{ id, label }]\`

---

`,
  workflow: `# Zango Workflow Reference

> Auto-generated from documentation pages. Regenerate with: \`node scripts/generate-reference.js\`

## Import
\`\`\`js
import { WorkflowStatus, WorkflowTags, DetailViewProvider, useWorkflow, useDetailView, useDetailViewContext } from '@zango-core/crud/table';
\`\`\`

## Workflow Data Format
- Status: \`{ status_label, status_color }\`
- Transitions: \`{ name, display_name, from, to, is_form_based, confirmation_message, description }\`
- Tags: \`{ name, state: "enabled"|"disabled", enable: { is_form_based, confirmation_message }, disable: { is_form_based, confirmation_message }, is_enable_allowed, is_disable_allowed }\`
- Use \`next_transitions\` (NOT \`transitions\`), \`tag_details\` (NOT \`tags\`)
- \`to_state_meta\` only appears on audit-log / workflow-transaction entries, not on \`next_transitions[]\`.

---

`,
  form: `# Zango FormRenderer Reference

> Auto-generated from documentation pages. Regenerate with: \`node scripts/generate-reference.js\`

## Import
\`\`\`js
import { FormRenderer } from '@zango-core/crud/form';
\`\`\`

## Server Response Format (snake_case)
\`\`\`json
{ "success": true, "response": { "is_multistep": false, "form": { "json_schema": { "type": "object", "properties": {} }, "ui_schema": {}, "form_data": {} } } }
\`\`\`

Note: Server uses \`json_schema\`, \`ui_schema\`, \`form_data\`. Local \`rjsf_schema\` prop uses camelCase: \`schema\`, \`uiSchema\`, \`formData\`.

---

`,
  appbuilder: `# Zango App Builder Reference

> Auto-generated from documentation pages. Regenerate with: \`node scripts/generate-reference.js\`

## Quick Start
\`\`\`bash
npx @zango-core/create-zango-app my-app
cd my-app
cp .env.example .env
npm run dev
\`\`\`

## Key Imports
\`\`\`js
import { ZangoApp, useAppContext } from '@zango-core/crm-framework';
import { CrudHandler } from '@zango-core/crud/table';
import { FormRenderer } from '@zango-core/crud/form';
\`\`\`

## Backend Models
\`\`\`python
from packages.appbuilder.backend.configure.models import AppRoutesModel, AppMenuModel
from zango.apps.appauth.models import UserRoleModel
\`\`\`

---

`,
};

// ─── Markdown Generators ───

function titleToFilename(title) {
  return title.replace(/\s+/g, '-').replace(/[()]/g, '') + '.md';
}

function generateComponentMd(meta, sections, props, codeBlocks) {
  let md = `# ${meta.title}\n`;
  if (meta.badge) md += `${meta.badge}\n`;
  md += '\n';
  if (meta.subtitle) md += `${meta.subtitle}\n\n`;

  if (sections.length > 0) {
    md += '**Sections:** ' + sections.join(' | ') + '\n\n';
  }

  if (props.length > 0) {
    md += '## Props\n\n';
    md += '| Prop | Type | Default | Description |\n';
    md += '|------|------|---------|-------------|\n';
    for (const p of props) {
      md += `| \`${p.name}\` | ${p.type} | ${p.default || '-'} | ${p.description} |\n`;
    }
    md += '\n';
  }

  if (codeBlocks.length > 0) {
    md += '## Code Examples\n\n';
    for (const block of codeBlocks) {
      if (block.title) {
        md += `### ${block.title}\n`;
      }
      md += `\`\`\`${block.language}\n${block.code.trim()}\n\`\`\`\n\n`;
    }
  }

  return md;
}

function generateIndexMd(category, pages) {
  let md = INDEX_HEADERS[category] || `# Zango ${category} Reference\n\n`;

  md += '## Components & Hooks\n\n';
  md += '| Name | Type | Description | Reference |\n';
  md += '|------|------|-------------|----------|\n';

  for (const page of pages) {
    const filename = titleToFilename(page.meta.title);
    const badge = page.meta.badge || '';
    const desc = page.meta.subtitle || '';
    md += `| ${page.meta.title} | ${badge} | ${desc} | [${filename}](${filename}) |\n`;
  }

  md += '\n';
  return md;
}

// ─── Main ───

console.log('Generating split reference files...');
console.log(`  Source: ${PAGES_DIR}`);
console.log(`  Output: ${REFS_DIR}`);
console.log('');

// Clean old flat reference files
const oldFiles = ['CRUD-REFERENCE.md', 'WORKFLOW-REFERENCE.md', 'FORM-REFERENCE.md', 'APPBUILDER-REFERENCE.md'];
for (const f of oldFiles) {
  const p = path.join(REFS_DIR, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`  Removed old file: ${f}`);
  }
}

// Clean existing category subdirectories
for (const cat of VALID_CATEGORIES) {
  const catDir = path.join(REFS_DIR, cat);
  if (fs.existsSync(catDir)) {
    fs.rmSync(catDir, { recursive: true });
  }
}

// Scan all .jsx pages
const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.jsx'));
const categoryPages = { crud: [], workflow: [], form: [], appbuilder: [] };
const stats = { pages: 0, props: 0, codeBlocks: 0, sections: 0, skipped: 0 };

for (const file of files) {
  const filePath = path.join(PAGES_DIR, file);
  const src = fs.readFileSync(filePath, 'utf8');
  const meta = extractMeta(src);

  if (!meta.category) {
    console.log(`  Skip (no category): ${file}`);
    stats.skipped++;
    continue;
  }

  if (!VALID_CATEGORIES.includes(meta.category)) {
    console.log(`  Skip (invalid category "${meta.category}"): ${file}`);
    stats.skipped++;
    continue;
  }

  const sections = extractSections(src);
  const props = extractProps(src);
  const codeBlocks = extractCodeBlocks(src);

  stats.pages++;
  stats.props += props.length;
  stats.codeBlocks += codeBlocks.length;
  stats.sections += sections.length;

  const componentFilename = titleToFilename(meta.title);
  console.log(`  ${file} -> ${meta.category}/${componentFilename}: ${sections.length} sections, ${props.length} props, ${codeBlocks.length} code blocks`);

  categoryPages[meta.category].push({ meta, sections, props, codeBlocks });
}

// Write output
for (const [category, pages] of Object.entries(categoryPages)) {
  if (pages.length === 0) continue;

  const catDir = path.join(REFS_DIR, category);
  fs.mkdirSync(catDir, { recursive: true });

  // Write index.md
  const indexContent = generateIndexMd(category, pages);
  fs.writeFileSync(path.join(catDir, 'index.md'), indexContent, 'utf8');

  // Write individual component files
  for (const page of pages) {
    const filename = titleToFilename(page.meta.title);
    const content = generateComponentMd(page.meta, page.sections, page.props, page.codeBlocks);
    fs.writeFileSync(path.join(catDir, filename), content, 'utf8');
  }

  console.log(`\n  Written: ${category}/ (index.md + ${pages.length} component files)`);
}

console.log(`\nDone!`);
console.log(`  Pages processed: ${stats.pages}`);
console.log(`  Pages skipped: ${stats.skipped}`);
console.log(`  Total Props: ${stats.props}`);
console.log(`  Total Code Blocks: ${stats.codeBlocks}`);
console.log(`  Total Sections: ${stats.sections}`);
