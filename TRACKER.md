# Zango CRUD Docs + Playground - Project Tracker

## Project Goal
Interactive documentation + playground for `@zango-core/crud` composable architecture.
Built with Zango appbuilder (Vite + React + Tailwind + Zango CRM Framework).
Both standalone dev server AND `build:zango` single-file output.

---

## Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project Scaffolding | DONE |
| 2 | Core Docs + Sidebar/Layout polish | DONE |
| 3 | Component API Pages (TableBody, Header, Utilities, etc.) | DONE |
| 4 | Workflow & Forms Documentation | DONE |
| 5 | Detail Views & Render Props | DONE |
| 6 | Playground & Polish | DONE |
| 7 | Reconcile documentation with CRUD codebase | DONE |
| 8 | Advanced Playground (Recipes + Editable) | DONE |
| 9 | Playground Split (CrudHandler / FormRenderer / Workflow) | DONE |
| 10 | Skills + Reference Generator | DONE |
| 11 | Getting Started (create-zango-app, project structure, .env) | DONE |
| 12 | ZangoApp & App Initializer | DONE |
| 13 | Navigation (Navbar + Topbar + Menu) | DONE |
| 14 | Routing & Custom Pages | DONE |
| 15 | Authentication | DONE |
| 16 | Theme & Build | DONE |
| 17 | Skill Update (new skills + regenerate reference) | DONE |
| 18 | Skill restructure (Agent Skills Spec + chaining + missing links) | DONE |
| 19 | Backend skills (scaffold-model, scaffold-api, scaffold-backend-workflow) | NOT STARTED |

---

## Phase 1 - Project Scaffolding (DONE)
- [x] Copy frontend from bmspspmonitoring (exclude node_modules, dist, zango-build, api-js)
- [x] Strip all BMS-specific pages, components, assets, config
- [x] Set up documentation app shell (ZangoApp + custom pages)
- [x] Add docs-specific deps (prismjs, react-live)
- [x] Create routing structure for all doc sections
- [x] Create client-side fetch interceptor (fully backend-less)
- [x] Create shared doc components (CodeBlock, PropsTable, DocPage)
- [x] Create all skeleton pages (18 pages)
- [x] Inline SVG icons for all menu items

## Phase 2 - Core Docs + Sidebar/Layout (DONE)
- [x] Sidebar with Kardigan-style section headers (CORE, COMPONENTS, WORKFLOW & FORMS, ADVANCED)
- [x] Custom DocsNavbar component with proper icon+text inline layout
- [x] Zango logo from zango.dev
- [x] Top navbar removed, clean sidebar-only layout
- [x] Inter font, Kardigan typography (13px/500 items, 10px/600 section headers)
- [x] Full-width DocPage with right-side "On this page" sub-navigation
- [x] CrudHandler docs - full props reference + code examples
- [x] Table Styling docs - customClass/customStyle, 30+ elements, 7 themes, TypeScript
- [x] useTable Hook docs - all context values, full signature, 4 usage examples

## Phase 3 - Component API Pages (IN PROGRESS)
- [ ] TableBody - props, row click behaviors
- [ ] TableHeader - props, custom actions
- [ ] TableUtilities - search/filter/upload/download
- [ ] TablePagination - page size options
- [ ] TableSearch - custom icons
- [ ] TableAddButton - form integration
- [ ] **CHECKPOINT: User review**

## Phase 4 - Workflow & Forms Documentation
- [ ] WorkflowStatus - props, lifecycle, custom rendering
- [ ] WorkflowTags - toggle, custom rendering
- [ ] Workflow Hooks (useWorkflow, useDetailView)
- [ ] Integration Patterns (5 patterns)
- [ ] FormRenderer - server-driven + local RJSF modes
- [ ] Enhanced Features - onFormCancel, portal, errors
- [ ] **CHECKPOINT: User review**

## Phase 5 - Detail Views & Render Props
- [ ] Detail Views - Drawer vs Main, auto data fetching
- [ ] Render Props - Actions, Status, Tags columns
- [ ] Complete Examples - full CRUD + Workflows + Forms
- [ ] **CHECKPOINT: User review**

## Phase 6 - Playground & Polish
- [ ] Interactive playground (RJSF-style: toggle props, edit code, live preview)
- [ ] Mock API demos with CrudHandler rendering real data
- [ ] Search across docs
- [ ] Responsive design QA
- [ ] Final visual polish
- [ ] **CHECKPOINT: User review**

## Phase 7 - Reconcile with CRUD Codebase
- [ ] Cross-reference docs with actual @zango-core/crud source code
- [ ] Verify all documented props exist and are accurate
- [ ] Add any undocumented features found in code
- [ ] Fix any inaccuracies in the guide
- [ ] **CHECKPOINT: User review**

## Phase 8 - Real-World Examples
- [ ] Add production-quality examples from real usage patterns
- [ ] Complete CRUD implementation examples
- [ ] Workflow integration examples
- [ ] Form composition examples
- [ ] **CHECKPOINT: User review**

---

## Key Decisions
- **Design**: Kardigan-style sidebar with section headers, Inter font, no top navbar
- **Playground**: Full interactive - toggle props, edit code in-browser, live preview (like RJSF playground)
- **Backend-less**: Client-side fetch interceptor, no API calls ever
- **Build targets**: Both `npm run dev` (standalone) and `npm run build:zango` (single-file)
- **Branding**: Zango logo from zango.dev
- **No auth**: No profile/login section needed

---

## Source Documentation
`/Users/rajat/poc_projects/poc/pkg-zango-crud/crud/frontend/COMPOSABLE-ARCHITECTURE-GUIDE.md`
