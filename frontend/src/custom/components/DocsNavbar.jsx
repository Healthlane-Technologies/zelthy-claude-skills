import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { iconsByUri } from '../../mock/appInitializer';

const menuSections = [
  {
    items: [
      { name: "Overview", uri: "/app/overview" },
    ],
  },
  {
    label: "GETTING STARTED",
    items: [
      { name: "Quick Start", uri: "/app/getting-started" },
      { name: "Project Structure", uri: "/app/project-structure" },
    ],
  },
  {
    label: "APP BUILDER",
    items: [
      { name: "ZangoApp", uri: "/app/zango-app" },
      { name: "App Initializer", uri: "/app/app-initializer" },
      { name: "Navbar & Topbar", uri: "/app/navbar-topbar" },
      { name: "Routing & Pages", uri: "/app/routing-pages" },
      { name: "Authentication", uri: "/app/auth" },
      { name: "Theme & Build", uri: "/app/theme-build" },
      { name: "Additional Info", uri: "/app/backend-info" },
    ],
  },
  {
    label: "CORE",
    items: [
      { name: "CrudHandler", uri: "/app/crud-handler" },
      { name: "Table Styling", uri: "/app/table-styling" },
      { name: "useTable Hook", uri: "/app/use-table" },
      { name: "Detail Views", uri: "/app/detail-views" },
    ],
  },
  {
    label: "COMPONENTS",
    items: [
      { name: "TableBody", uri: "/app/table-body" },
      { name: "TableHeader", uri: "/app/table-header" },
      { name: "TableUtilities", uri: "/app/table-utilities" },
      { name: "TablePagination", uri: "/app/table-pagination" },
      { name: "TableSearch", uri: "/app/table-search" },
      { name: "TableAddButton", uri: "/app/table-add-button" },
    ],
  },
  {
    label: "WORKFLOW & FORMS",
    items: [
      { name: "WorkflowStatus", uri: "/app/workflow-status" },
      { name: "WorkflowTags", uri: "/app/workflow-tags" },
      { name: "FormRenderer", uri: "/app/form-renderer" },
    ],
  },
  {
    label: "ADVANCED",
    items: [
      { name: "Hooks Reference", uri: "/app/workflow-hooks" },
      { name: "Render Props", uri: "/app/render-props" },
      { name: "Enhanced Features", uri: "/app/advanced" },
    ],
  },
  {
    label: "PLAYGROUND",
    items: [
      { name: "CrudHandler", uri: "/app/playground" },
      { name: "FormRenderer", uri: "/app/playground-form" },
      { name: "Workflow", uri: "/app/playground-workflow" },
    ],
  },
];

// Flatten all items for search
const allItems = menuSections.flatMap((s) => s.items);

const DocsNavbar = () => {
  const location = useLocation();

  const isActive = (uri) => {
    const p = location.pathname.replace(/\/$/, '');
    const u = uri.replace(/\/$/, '');
    return p === u;
  };

  return (
    <div style={{ padding: '4px 8px' }}>
      {/* Menu */}
      {menuSections.map((section, sIdx) => (
        <div key={sIdx} style={{ marginTop: section.label ? '12px' : '0' }}>
          {section.label && (
            <div
              style={{
                padding: '6px 10px 4px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--color-gray-400, #94a3b8)',
                pointerEvents: 'none',
              }}
            >
              {section.label}
            </div>
          )}
          {section.items.map((item) => {
            const active = isActive(item.uri);
            return (
              <Link
                key={item.uri}
                to={item.uri}
                onClick={() => setSearch('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  margin: '1px 0',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  backgroundColor: active ? 'var(--color-brand-50, #EAE8FF)' : 'transparent',
                  color: active ? 'var(--color-brand-500, #5048ED)' : 'var(--color-gray-700, #414651)',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    flexShrink: 0,
                  }}
                  dangerouslySetInnerHTML={{ __html: (iconsByUri[item.uri] || '').replace('width="20"', 'width="16"').replace('height="20"', 'height="16"') }}
                />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: active ? 600 : 500,
                    lineHeight: '18px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      ))}

    </div>
  );
};

export default DocsNavbar;
