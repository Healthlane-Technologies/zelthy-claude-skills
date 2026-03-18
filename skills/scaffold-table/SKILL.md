---
name: scaffold-table
description: "Add a data table using CrudHandler to a page or create a CRUD route. Handles table customization - custom detail, card view, kanban, header, styling. Use when users need to display data in a table, list, grid, or kanban board."
license: MIT
compatibility: Requires @zango-core/crud package in a Zango frontend project.
metadata:
  author: Healthlane Technologies
  version: "1.0"
allowed-tools: Read Write
---

# Scaffold Table

Add a CrudHandler data table to a Zango app.

## Before Starting

Read: [CRUD Reference](../zango-frontend/references/CRUD-REFERENCE.md)

## Step 1: Understand Requirements

Ask the user:

1. **Where does this table go?**
   - **New page** (doesn't exist yet) → Chain to `/scaffold-page` first, then come back
   - **Existing page** → Which file? We'll add CrudHandler to it
   - **Standard CRUD route** (no custom code) → Backend route only, chain to `/setup-routes`

2. **What's the API endpoint?** (e.g., `/api/patients/`)

3. **Need any customizations?** (or standard table is fine)
   - Custom detail view (tabs, workflow, custom layout)
   - Custom table body (card grid, kanban board)
   - Custom header (stats cards, extra actions)
   - Custom styling (theme, customClass, customStyle)
   - Custom utilities (search, filters)
   - None (use defaults)

## Step 2: Generate Code

### Basic CrudHandler (no customization)

```jsx
import { CrudHandler } from '@zango-core/crud/table';

const {{PageName}} = () => (
  <CrudHandler
    api_endpoint="{{api_endpoint}}"
    headerProps={{ title: "{{Title}}" }}
  />
);

export default {{PageName}};
```

### With Custom Detail Drawer

```jsx
import { CrudHandler } from '@zango-core/crud/table';

const {{EntityName}}Detail = ({ data, workflow_details, general_details, sections, onClose, open }) => {
  if (!open || !data) return null;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 20, borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>{data.title}</h2>
        <button onClick={onClose}>&times;</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {general_details?.fields && Object.entries(general_details.fields).map(([key, field]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280', fontSize: 13 }}>{field.display_name}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{String(field.value)}</span>
          </div>
        ))}
        {workflow_details && (
          <div style={{ marginTop: 16 }}>
            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              backgroundColor: `${workflow_details.current_status_meta?.status_color}18`,
              color: workflow_details.current_status_meta?.status_color }}>
              {workflow_details.current_status_meta?.status_label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const {{PageName}} = () => (
  <CrudHandler
    api_endpoint="{{api_endpoint}}"
    headerProps={{ title: "{{Title}}" }}
    customDrawerDetail={{{EntityName}}Detail}
  />
);
```

### With Card Grid Body

```jsx
import { CrudHandler, useTable } from '@zango-core/crud/table';

const CardGridBody = () => {
  const { data, isLoading, handleRowClick } = useTable();

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  if (!data?.length) return <div style={{ padding: 40, textAlign: 'center' }}>No records</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: 16 }}>
      {data.map((row) => (
        <div key={row.id} onClick={() => handleRowClick(row)}
          style={{ padding: 16, borderRadius: 10, border: '1px solid #e5e7eb', cursor: 'pointer' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{row.name || row.title}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{row.email || row.description}</div>
        </div>
      ))}
    </div>
  );
};

const {{PageName}} = () => (
  <CrudHandler
    api_endpoint="{{api_endpoint}}"
    customTableBody={CardGridBody}
  />
);
```

### With Stats Header

```jsx
import { CrudHandler, useTable } from '@zango-core/crud/table';

const StatsHeader = () => {
  const { data, totalCount } = useTable();
  const rows = data || [];
  // Compute stats from data
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, padding: 16, borderRadius: 10, backgroundColor: '#EAE8FF' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#5048ED' }}>{totalCount}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Total Records</div>
        </div>
        {/* Add more stat cards */}
      </div>
    </div>
  );
};

const {{PageName}} = () => (
  <CrudHandler
    api_endpoint="{{api_endpoint}}"
    customHeader={StatsHeader}
  />
);
```

### With Custom Styling

```jsx
<CrudHandler
  api_endpoint="{{api_endpoint}}"
  customClass={{
    headerCell: 'bg-gray-50 text-gray-700 font-semibold',
    bodyRow: 'hover:bg-gray-25 border-b border-gray-100',
    container: 'bg-white rounded-lg shadow-sm',
  }}
  customStyle={{
    bodyRow: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? '#e0f2fe' : baseStyles.backgroundColor,
    }),
  }}
/>
```

## Step 3: Register and Wire Up

After generating code:
1. Read `src/custom/pages/index.js` and add the export
2. Check `.env` VITE_PROXY_ROUTES - add the API endpoint path if missing
3. If this is a new page, chain to `/setup-routes` for backend route + menu

## Step 4: Follow-up

Ask: "The table is set up. Do you also want to:"
- Customize the detail view? → Chain to `/scaffold-detail`
- Add workflow status/tags? → Chain to `/scaffold-workflow`
- Add a form for creating records? → It's built into CrudHandler's "Add New" button. If custom form needed → Chain to `/scaffold-form`

## Important Notes

- CrudHandler MUST have `api_endpoint` prop
- Custom components rendered inside CrudHandler can use `useTable()` hook
- Detail components auto-receive: data, workflow_details, general_details, sections, onClose
- Import from `@zango-core/crud/table` (NEVER `@zango-core/crud`)
- StatusCol data: `{ status_label, status_color }`
- Row actions: `type: "form"` (opens drawer) or `type: "simple"` (confirmation)
