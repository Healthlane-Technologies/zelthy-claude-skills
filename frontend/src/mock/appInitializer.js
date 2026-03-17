// Mock app initializer data for the documentation site
// Icons must be inline SVG strings (the CRM framework renders them via dangerouslySetInnerHTML)

const svg = (d) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

const icons = {
  home: svg('<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  table: svg('<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>'),
  palette: svg('<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>'),
  code: svg('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
  panelRight: svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/>'),
  rows: svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>'),
  panelTop: svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/>'),
  settings: svg('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
  pagination: svg('<polyline points="7 8 3 12 7 16"/><line x1="21" x2="11" y1="12" y2="12"/><polyline points="17 8 21 12 17 16"/><line x1="3" x2="13" y1="12" y2="12"/>'),
  search: svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
  plusCircle: svg('<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>'),
  gitBranch: svg('<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>'),
  tags: svg('<path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8 18.014"/><circle cx="6.5" cy="9.5" r=".5" fill="currentColor"/>'),
  anchor: svg('<path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="5" r="3"/>'),
  fileText: svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'),
  layers: svg('<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22.4 10.08-8.58 3.91a2 2 0 0 1-1.66 0l-8.58-3.9"/><path d="m22.4 14.08-8.58 3.91a2 2 0 0 1-1.66 0l-8.58-3.9"/>'),
  zap: svg('<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'),
  play: svg('<polygon points="6 3 20 12 6 21 6 3"/>'),
};

// Icon lookup by URI (used by DocsNavbar component)
export const iconsByUri = {
  "/app/overview": icons.home,
  "/app/crud-handler": icons.table,
  "/app/table-styling": icons.palette,
  "/app/use-table": icons.code,
  "/app/detail-views": icons.panelRight,
  "/app/table-body": icons.rows,
  "/app/table-header": icons.panelTop,
  "/app/table-utilities": icons.settings,
  "/app/table-pagination": icons.pagination,
  "/app/table-search": icons.search,
  "/app/table-add-button": icons.plusCircle,
  "/app/workflow-status": icons.gitBranch,
  "/app/workflow-tags": icons.tags,
  "/app/workflow-hooks": icons.anchor,
  "/app/form-renderer": icons.fileText,
  "/app/render-props": icons.layers,
  "/app/advanced": icons.zap,
  "/app/playground": icons.play,
  "/app/playground-form": icons.fileText,
  "/app/playground-workflow": icons.gitBranch,
  "/app/getting-started": icons.zap,
  "/app/project-structure": icons.layers,
  "/app/zango-app": icons.home,
  "/app/app-initializer": icons.settings,
  "/app/navbar-topbar": icons.panelTop,
  "/app/routing-pages": icons.rows,
  "/app/auth": icons.search,
  "/app/theme-build": icons.palette,
  "/app/backend-info": icons.code,
};

// All pages for route registration
const allPages = [
  { path: "/app/overview", component: "Overview" },
  { path: "/app/crud-handler", component: "CrudHandlerDocs" },
  { path: "/app/table-styling", component: "TableStylingDocs" },
  { path: "/app/use-table", component: "UseTableDocs" },
  { path: "/app/detail-views", component: "DetailViewsDocs" },
  { path: "/app/table-body", component: "TableBodyDocs" },
  { path: "/app/table-header", component: "TableHeaderDocs" },
  { path: "/app/table-utilities", component: "TableUtilitiesDocs" },
  { path: "/app/table-pagination", component: "TablePaginationDocs" },
  { path: "/app/table-search", component: "TableSearchDocs" },
  { path: "/app/table-add-button", component: "TableAddButtonDocs" },
  { path: "/app/workflow-status", component: "WorkflowStatusDocs" },
  { path: "/app/workflow-tags", component: "WorkflowTagsDocs" },
  { path: "/app/workflow-hooks", component: "WorkflowHooksDocs" },
  { path: "/app/form-renderer", component: "FormRendererDocs" },
  { path: "/app/render-props", component: "RenderPropsDocs" },
  { path: "/app/advanced", component: "AdvancedDocs" },
  { path: "/app/playground", component: "Playground" },
  { path: "/app/playground-form", component: "PlaygroundForm" },
  { path: "/app/getting-started", component: "GettingStarted" },
  { path: "/app/project-structure", component: "ProjectStructure" },
  { path: "/app/zango-app", component: "ZangoAppDocs" },
  { path: "/app/app-initializer", component: "AppInitializerDocs" },
  { path: "/app/navbar-topbar", component: "NavbarTopbarDocs" },
  { path: "/app/routing-pages", component: "RoutingPagesDocs" },
  { path: "/app/auth", component: "AuthDocs" },
  { path: "/app/theme-build", component: "ThemeBuildDocs" },
  { path: "/app/backend-info", component: "BackendInfoDocs" },
  { path: "/app/playground-workflow", component: "PlaygroundWorkflow" },
];

export const appInitializerData = {
  // Flat menu (needed for framework's internal routing/active detection)
  menu: allPages.map(({ path, component }) => ({
    name: component,
    uri: path,
    page_type: "custom",
    component,
  })),
  routes: allPages.map(({ path, component }) => ({
    path,
    page_type: "custom",
    component,
  })),
  profile_info: {
    name: "Developer",
    user_role: "Docs",
  },
  theme: {
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
    },
  },
};
