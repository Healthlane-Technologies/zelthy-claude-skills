# Common Flows

Copy-paste recipes for common implementation patterns. Check here before scaffolding.

---

#### Flow 1: Route-Based Detail View

**When:** User wants detail view as a separate page/route, not a drawer.

**Required:**
```jsx
import { CrudHandler } from '@zango-core/crud/table';
import { TableBody } from '@zango-core/crud/table';

const EntityDetail = ({ data, general_details, workflow_details, onRefresh }) => {
  return (
    <div>
      <h2>{data?.title}</h2>
      {Object.entries(general_details?.fields || {}).map(([k, f]) => (
        <div key={k}>{f.display_name}: {f.value}</div>
      ))}
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/entity/"
  customMainDetail={EntityDetail}
  enableDetailViewRoute={true}
  customTableBody={() => <TableBody defaultDetailView="navigate" />}
/>
```

**Gotcha:** All three props required together. Miss any one = detail view won't work. `customMainDetail` (not `customDrawerDetail`) for route-based.

---

#### Flow 2: Drawer-Based Detail View

**When:** User wants detail view as a side drawer overlay.

**Required:**
```jsx
import { CrudHandler } from '@zango-core/crud/table';

const EntityDrawer = ({ selectedRow, open, onClose }) => {
  if (!open) return null;
  return (
    <div>
      <h2>{selectedRow?.name}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/entity/"
  customDrawerDetail={({ selectedRow, open, onClose }) => (
    <EntityDrawer selectedRow={selectedRow} open={open} onClose={onClose} />
  )}
  detailDrawerSize="full"
/>
```

**Gotcha:** Props are `selectedRow`, `open`, `onClose` — not `data`/`general_details`. Different from route-based detail.

---

#### Flow 3: Custom Table Body

**When:** User wants cards, kanban, or custom row click behavior instead of default table.

**Required:**
```jsx
// Variant A: Custom row click handler (open modal, navigate, etc.)
import { CrudHandler } from '@zango-core/crud/table';
import { TableBody } from '@zango-core/crud/table';
import { useNavigate } from 'react-router-dom';

const Page = () => {
  const navigate = useNavigate();
  return (
    <CrudHandler
      api_endpoint="/api/entity/"
      customTableBody={() => (
        <TableBody
          defaultDetailView={{
            action: 'custom',
            customHandler: (row) => navigate(`/app/entity/${row.original.object_uuid}`)
          }}
        />
      )}
    />
  );
};
```

```jsx
// Variant B: Fully custom body using useTable hook
import { CrudHandler, useTable } from '@zango-core/crud/table';

const CardGrid = () => {
  const { data, isLoading, handleRowClick } = useTable();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {data?.map((row) => (
        <div key={row.object_uuid} onClick={() => handleRowClick(row)}>
          {row.name}
        </div>
      ))}
    </div>
  );
};

<CrudHandler api_endpoint="/api/entity/" customTableBody={CardGrid} />
```

**Gotcha:** `row.original.object_uuid` in Variant A (row is wrapped). Direct `row.object_uuid` in Variant B (useTable gives raw data).

---

#### Flow 4: Custom Stats Header

**When:** User wants stats cards or summary above the table.

**Required:**
```jsx
import { CrudHandler, useTable } from '@zango-core/crud/table';

const StatsHeader = () => {
  const tableContext = useTable();
  const stats = tableContext?.rawResponse?.stats || {};

  if (tableContext?.isLoading) return null;
  return (
    <div style={{ display: 'flex', gap: 16, padding: 16 }}>
      <div>Total: {stats.total || 0}</div>
      <div>Active: {stats.active || 0}</div>
      <div>Pending: {stats.pending || 0}</div>
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/entity/"
  customHeader={StatsHeader}
/>
```

**Gotcha:** Stats come from `tableContext.rawResponse.stats` — backend must include `stats` key in response. `useTable()` only works inside CrudHandler's render tree.

---

#### Flow 5: Server-Driven Form in Drawer

**When:** User wants a form that opens in a drawer/dialog, schema loaded from backend.

**Required:**
```jsx
import { FormRenderer } from '@zango-core/crud/form';

const EditDialog = ({ objectUuid, open, onClose, onSuccess }) => {
  if (!open) return null;
  return (
    <Drawer open={open} onClose={onClose}>
      <FormRenderer
        api_endpoint="/api/entity/"
        getParams={{
          action: 'initialize_form',
          action_type: 'row',
          action_key: 'edit',
          object_uuid: objectUuid,
        }}
        postParams={{
          form_type: 'row_action_form',
          action_type: 'row',
          action_key: 'edit',
          object_uuid: objectUuid,
        }}
        onResponse={(r) => { onSuccess(); onClose(); }}
        onError={(e) => console.error(e)}
      />
    </Drawer>
  );
};
```

**Gotcha:** Both `getParams` and `postParams` needed — get loads schema, post submits. Backend returns `{ response: { form: { json_schema, ui_schema, form_data } } }`.

---

#### Flow 6: Custom Page with CrudHandler

**When:** User wants a custom page that includes a CRUD table alongside other UI.

**Required:**
```jsx
// src/custom/pages/DashboardPage.jsx
import { CrudHandler } from '@zango-core/crud/table';

const DashboardPage = () => (
  <div style={{ padding: 32 }}>
    <h1>Dashboard</h1>
    <div>Custom stats or UI here</div>
    <CrudHandler
      api_endpoint="/api/entity/"
      headerProps={{ title: "Recent Items" }}
    />
  </div>
);
export default DashboardPage;

// src/custom/pages/index.js — MUST add export
export { default as DashboardPage } from './DashboardPage';
```

**Gotcha:** Export name in `pages/index.js` MUST match backend route's `component` field exactly. Mismatch = blank page.

---

#### Flow 7: Standalone Workflow

**When:** User wants workflow status/tags outside of CrudHandler (custom page, standalone detail).

**Required:**
```jsx
import { WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';

const EntityDetail = ({ objectUuid }) => (
  <div>
    <WorkflowStatus
      apiUrl={`/api/entity/?object_uuid=${objectUuid}`}
      onStatusChange={() => window.location.reload()}
    />
    <WorkflowTags
      apiUrl={`/api/entity/?object_uuid=${objectUuid}`}
      onTagChange={() => window.location.reload()}
    />
  </div>
);
```

**Gotcha:** `apiUrl` must include `object_uuid` param. For shared fetch, wrap both in `<DetailViewProvider apiUrl="...">` and omit individual `apiUrl` props.

---

#### Flow 8: Nested CRUD in Tabs

**When:** Detail view has tabs, each tab shows a different CRUD table (e.g., Program → Teams tab, Vendors tab).

**Required:**
```jsx
import { CrudHandler, useTable } from '@zango-core/crud/table';
import { TableHeader } from '@zango-core/crud/table';

const MinimalHeader = () => {
  const tableContext = useTable();
  if (tableContext?.isLoading) return null;
  return <TableHeader showAddButton={true} />;
};

const TabCrud = ({ endpoint, DetailComponent }) => (
  <CrudHandler
    api_endpoint={endpoint}
    customHeader={MinimalHeader}
    showUtilities={true}
    enableDetailViewRoute={false}
    customDrawerDetail={DetailComponent ? ({ selectedRow, open, onClose }) => (
      <DetailComponent selectedRow={selectedRow} open={open} onClose={onClose} />
    ) : undefined}
    detailDrawerSize="full"
  />
);

// Usage in parent detail view:
const ProgramDetail = ({ programUUID }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab label="Teams" />
        <Tab label="Vendors" />
      </Tabs>
      {activeTab === 0 && <TabCrud endpoint={`/api/team/?program_uuid=${programUUID}`} />}
      {activeTab === 1 && <TabCrud endpoint={`/api/vendor/?program_uuid=${programUUID}`} />}
    </div>
  );
};
```

**Gotcha:** Each tab's CrudHandler needs its own `api_endpoint` with parent UUID as query param. Set `enableDetailViewRoute={false}` — nested route-based details conflict with parent route.

---

#### Flow 9: Dynamic API Endpoints

**When:** API endpoint depends on a runtime value (parent UUID, filter, user selection).

**Required:**
```jsx
import { CrudHandler } from '@zango-core/crud/table';

const FilteredTable = ({ parentUuid, status }) => (
  <CrudHandler
    api_endpoint={`/api/entity/?parent_uuid=${parentUuid}&status=${status}`}
  />
);
```

**Gotcha:** CrudHandler re-fetches when `api_endpoint` string changes. Use stable references — avoid building the string inline in render if parent re-renders frequently.

---

#### Flow 10: Multi-Tab Detail View

**When:** User wants a full detail page with multiple tabs, each showing different content (overview, timeline, nested CRUD, documents).

**Required:**
```jsx
import { useDetailView } from '@zango-core/crud/table';
import { WorkflowStatus } from '@zango-core/crud/table';

const EntityDetail = () => {
  const uuid = window.location.pathname.split('/').pop();
  const { data, refresh, loading } = useDetailView({
    apiUrl: `/api/entity/?object_uuid=${uuid}`,
  });
  const [activeTab, setActiveTab] = useState(0);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>{data?.name}</h1>
      <WorkflowStatus
        apiUrl={`/api/entity/?object_uuid=${uuid}`}
        onStatusChange={refresh}
      />
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab label="Overview" />
        <Tab label="Items" />
      </Tabs>
      {activeTab === 0 && <Overview data={data} />}
      {activeTab === 1 && (
        <CrudHandler
          api_endpoint={`/api/items/?entity_uuid=${uuid}`}
          enableDetailViewRoute={false}
        />
      )}
    </div>
  );
};
```

**Gotcha:** `useDetailView` is for the parent entity data. Nested CrudHandlers in tabs use their own `api_endpoint`. Extract UUID from URL pathname — not passed as prop in route-based views.

---

#### Flow 11: Status-Dependent Form Action

**When:** Form schema changes based on workflow status (e.g., draft shows "edit_basic", active shows "edit").

**Required:**
```jsx
import { FormRenderer } from '@zango-core/crud/form';

const EditForm = ({ objectUuid, currentStatus, onSuccess }) => {
  const actionKey = currentStatus === 'draft' ? 'edit_basic' : 'edit';
  return (
    <FormRenderer
      api_endpoint="/api/entity/"
      getParams={{
        action: 'initialize_form',
        action_type: 'row',
        action_key: actionKey,
        object_uuid: objectUuid,
      }}
      postParams={{
        form_type: 'row_action_form',
        action_type: 'row',
        action_key: actionKey,
        object_uuid: objectUuid,
      }}
      onResponse={onSuccess}
    />
  );
};
```

**Gotcha:** `action_key` must match backend's registered form actions. Different `action_key` = different form schema from backend.

---

#### Flow 12: PDF Export with Filters

**When:** User wants an export button that respects current table filters and search.

**Required:**
```jsx
import { useTable, useTableFilters } from '@zango-core/crud/table';

const ExportButton = ({ exportEndpoint }) => {
  const tableData = useTable();
  const filterData = useTableFilters();

  const handleExport = async () => {
    const params = new URLSearchParams({
      search: filterData?.debouncedSearchTerm || '',
      ...filterData?.debouncedFilterObj,
      sorting: JSON.stringify(tableData?.sorting || []),
    });
    window.open(`${exportEndpoint}?${params.toString()}`);
  };

  return <button onClick={handleExport}>Export PDF</button>;
};

// Place inside CrudHandler's customHeader or any component within CrudHandler tree
```

**Gotcha:** `useTableFilters()` only works inside CrudHandler's render tree. `debouncedSearchTerm` and `debouncedFilterObj` are debounced — they reflect what the user last committed, not in-progress typing.

---

#### Flow 13: Modal-Within-CRUD

**When:** Row click opens a modal/dialog instead of a drawer or route.

**Required:**
```jsx
import { CrudHandler } from '@zango-core/crud/table';
import { TableBody } from '@zango-core/crud/table';
import { useState } from 'react';

const Page = () => {
  const [selectedUuid, setSelectedUuid] = useState(null);

  return (
    <>
      <CrudHandler
        api_endpoint="/api/entity/"
        customTableBody={() => (
          <TableBody
            defaultDetailView={{
              action: 'custom',
              customHandler: (row) => setSelectedUuid(row.original.object_uuid),
            }}
          />
        )}
      />
      {selectedUuid && (
        <div className="modal-overlay" onClick={() => setSelectedUuid(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <EntityModal uuid={selectedUuid} onClose={() => setSelectedUuid(null)} />
          </div>
        </div>
      )}
    </>
  );
};
```

**Gotcha:** Modal state lives OUTSIDE CrudHandler. `customHandler` sets state, modal renders as sibling. Don't put modal inside CrudHandler tree — it unmounts on re-render.
