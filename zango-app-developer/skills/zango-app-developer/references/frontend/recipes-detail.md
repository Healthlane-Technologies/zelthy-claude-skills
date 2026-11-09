# Recipes — detail views, workflow and forms

Recipes for the single-record side of a Zango page. Written against
`@zango-core/crud` **2.1.1**. List pages: [recipes-headless.md](recipes-headless.md).

| # | Recipe |
|---|--------|
| D1 | [Route-based detail page](#d1-route-based-detail-page) |
| D2 | [Drawer detail](#d2-drawer-detail) |
| D3 | [Multi-tab detail page](#d3-multi-tab-detail-page) |
| D4 | [Workflow status and tags](#d4-workflow-status-and-tags) |
| D5 | [Server-driven form in a drawer](#d5-server-driven-form-in-a-drawer) |
| D6 | [Related records in a tab](#d6-related-records-in-a-tab) |
| D7 | [Page-key routing](#d7-page-key-routing) |

---

## D1. Route-based detail page

Mount the package's `DetailWrapper` on the detail route **by itself**. It
fetches the record and provides `DetailViewContext`; nothing else.

```tsx
import { useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { DetailWrapper } from '@zango-core/crud/table';

export default function OrdersResource({ apiUrl = '/api/orders/' }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // DetailWrapper renders this as a component TYPE: a new identity per render
  // remounts the whole detail subtree. Keep it stable.
  const Detail = useCallback((props) => <OrderDetail {...props} />, []);

  if (pathname.includes('detail-view/')) {
    return (
      <Routes>
        <Route path="detail-view/:object_uuid"
               element={<DetailWrapper apiUrl={apiUrl} customComponent={Detail} />} />
      </Routes>
    );
  }
  return <OrdersList apiUrl={apiUrl}
                     onRowClick={(row) => navigate(`detail-view/${row.object_uuid}`)} />;
}

/* Props are camelCase, injected by DetailWrapper. */
function OrderDetail({ data, loading, error, generalDetails, workflowDetails, sections, rowActions, objectUuid, onRefresh }) {
  if (!data && !error) return <DetailSkeleton />;   // not `loading` — see gotchas
  if (error) return <ErrorState onRetry={onRefresh} />;
  return (
    <article>
      <h1>{data.title}</h1>
      {Object.entries(generalDetails?.fields ?? {}).map(([k, f]) => (
        <div key={k}>{f.display_name}: {f.value}</div>
      ))}
    </article>
  );
}
```

**Why not `CrudHandler enableDetailViewRoute`:** inside `CrudHandler` the detail
route sits under a `TableProvider` that fetches the list's
`get_table_metadata` on every direct load of a detail URL, which the detail
never reads.

**Gotchas:**
- Gate the first paint on `!data && !error`, **not** `loading`: the first
  render has `loading: false` and `data: null`, so a `loading` gate renders a
  blank page for a frame (or for good, on paths where `loading` never flips).
- Props are camelCase (`generalDetails`, `workflowDetails`, `rowActions`,
  `onRefresh`). The snake_case names exist only inside `data`.
- The parent route must allow nested paths (`/orders/*`) so
  `detail-view/:object_uuid` matches.
- To link to a detail from elsewhere, build the absolute path from route
  config (D7), not from the API endpoint.

---

## D2. Drawer detail

### Variant A — the package drawer (`CrudHandler`)

`CrudHandler` already wraps `customDrawerDetail` in a `DetailViewProvider` for
the clicked row and **calls it as a function** with
`{ selectedRow, open: true, onClose, onCloseDrawer, ... }`. Read the record from
the context; do not add a provider.

```tsx
import { CrudHandler, useDetailViewContext } from '@zango-core/crud/table';

function OrderDrawer({ onClose }) {
  const ctx = useDetailViewContext();
  const { data, workflowDetails } = ctx ?? {};
  if (!data) return <p>Loading…</p>;
  return (
    <section>
      <h2>{data.title}</h2>
      <p>{workflowDetails?.current_status_meta?.status_label}</p>
      <button onClick={onClose}>Close</button>
    </section>
  );
}

<CrudHandler api_endpoint="/api/orders/" customDrawerDetail={OrderDrawer} />
```

- Wrapping it in another `DetailViewProvider` fetches the record twice.
- Because it is called, not mounted, its hooks belong to the package's
  `DetailContent`. Keep the same component for the drawer's lifetime.
- Opening the drawer from a custom body: `useTableContext().openDetailDrawer(row)`
  with a `Row<T>` from `crud.table.getRowModel().rows`.

### Variant B — a page-owned drawer (headless pages)

Keep the uuid in page state and fetch with the standalone `useDetailView`.

```tsx
import { useDetailView } from '@zango-core/crud/table';

function EntityDetailDrawer({ apiUrl, uuid, onClose, onChanged }) {
  const sep = apiUrl.includes('?') ? '&' : '?';
  const { data, error, workflowDetails, refresh } = useDetailView({
    apiUrl: `${apiUrl}${sep}object_uuid=${uuid}`,     // uuid MUST be in the URL
  });
  const hasWorkflow = workflowDetails && Object.keys(workflowDetails).length > 0;
  return (
    <Drawer open onClose={onClose} position="right" size="lg">   {/* your app's drawer */}
      {!data && !error ? <DetailSkeleton /> : (
        <>
          <h2>{data?.title}</h2>
          {hasWorkflow && (
            <WorkflowStatus staticData={workflowDetails}
                            onStatusChange={async () => { await refresh(); onChanged?.(); }} />
          )}
        </>
      )}
    </Drawer>
  );
}
```

- `useDetailView` adds `action=fetch_item_details&view=detail` itself.
- Guard `workflow_details: {}`: an empty object is truthy, and a workflow
  control mounted on it falls back to whatever `DetailViewContext` surrounds it
  — inside a detail page, the **page's** record status.
- After a change, `refresh()` the drawer and tell the list (`onChanged`) so it
  refetches.

---

## D3. Multi-tab detail page

```tsx
import { useSearchParams } from 'react-router-dom';

function OrderDetail(props) {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? 'overview';
  const selectTab = (next) => {
    if (next === tab) return;                                   // no reload on the active tab
    const p = new URLSearchParams(params); p.set('tab', next);
    setParams(p, { replace: true });                            // tabs are not history entries
  };
  /* … header, tab bar, tab bodies … */
}
```

**Keep local reads in step with package refreshes.** Child tabs that fetch their
own data (documents, notes) do not see the package refreshing the record after a
workflow transition. Derive a version from the record and bump a tick when it
changes:

```tsx
const recordVersion = `${props.data?.workflow_details?.current_status}|${props.data?.modified_at}`;
const [tick, setTick] = useState(0);
const first = useRef(true);
useEffect(() => { if (first.current) { first.current = false; return; } setTick((t) => t + 1); }, [recordVersion]);
// pass `tick` into tab fetch keys
```

- Bump from user actions and record-version changes only — never from "data
  arrived", or it loops.
- One-shot user actions: `const refreshAll = () => { props.onRefresh(); setTick((t) => t + 1); }`.

---

## D4. Workflow status and tags

```tsx
import { useDetailViewContext, WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';

function WorkflowControls({ workflowDetails, apiUrl, objectUuid, onChanged }) {
  const ctx = useDetailViewContext();
  if (!workflowDetails || Object.keys(workflowDetails).length === 0) return null;   // gate the mount
  const forward = ctx?.refreshDetail ? undefined : onChanged;     // provider refreshes already
  const url = `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}object_uuid=${objectUuid}`;
  return (
    <>
      <WorkflowStatus apiUrl={url} staticData={workflowDetails} onStatusChange={forward} />
      <WorkflowTags   apiUrl={url} staticData={workflowDetails} onTagChange={forward} />
    </>
  );
}
```

- Mount only when `workflowDetails` exists — otherwise the internal
  `useWorkflow` does its own `fetch_item_details`. With `staticData` present it
  never fetches. `staticData` accepts the `workflow_details` object itself or a
  payload wrapping it.
- Inside a `DetailViewProvider`, the hook already awaits `refreshDetail()` before
  your callback. Forwarding your own refresh too reloads the record twice.
- Transition forms read the record from the **`apiUrl` query string** — put
  `object_uuid` there. On crud ≤ 2.1.1 `objectUuid` does not reach the form;
  the query param works on every version.
- On crud ≤ 2.1.1 `beforeTransition` / `afterTransition` fire **twice** for a
  transition without a form (fixed after 2.1.1, unreleased). Make them
  idempotent (a `pending` ref) before doing anything with side effects.
- Prop reference, `confirmationAlert`, `formContainerId`, custom renderers:
  [workflow.md](workflow.md).

---

## D5. Server-driven form in a drawer

```tsx
import { useState } from 'react';
import { FormRenderer } from '@zango-core/crud/form';

const withSlash = (url) => {                    // Django: /x/?a=1 resolves, /x?a=1 does not
  const [path, ...q] = url.split('?');
  const p = path.endsWith('/') ? path : `${path}/`;
  return q.length ? `${p}?${q.join('?')}` : p;
};

export function EntityFormDrawer({ open, onClose, apiUrl, objectUuid, actionKey = 'edit', endpointParams = {}, onSaved }) {
  const [ready, setReady] = useState(false);
  const isEdit = !!objectUuid;
  let endpoint = withSlash(apiUrl);
  const add = (k, v) => { endpoint += `${endpoint.includes('?') ? '&' : '?'}${k}=${encodeURIComponent(v)}`; };
  if (isEdit) add('object_uuid', objectUuid);
  Object.entries(endpointParams).forEach(([k, v]) => v && add(k, v));   // URL only — never also in the bags

  const getParams  = isEdit
    ? { action: 'initialize_form', action_type: 'row', action_key: actionKey, object_uuid: objectUuid }
    : { action: 'initialize_form' };
  const postParams = isEdit
    ? { form_type: 'row_action_form', action_type: 'row', action_key: actionKey, object_uuid: objectUuid }
    : { form_type: 'create_form' };

  return (
    <Drawer open={open} onClose={onClose} position="right" size="lg"   // your app's drawer
            footer={<div id="entity-form-submit" />}>
      {!ready && <p>Loading form…</p>}
      {open && (
        <FormRenderer
          api_endpoint={endpoint}
          getParams={getParams}
          postParams={postParams}
          submitButtonContainerId="entity-form-submit"
          onFormLoad={() => setReady(true)}
          onResponse={() => { onSaved?.(); onClose(); }}
        />
      )}
    </Drawer>
  );
}
```

**Gotchas:**
- Extra endpoint params go on the URL **only**. Also merging them into
  `getParams` / `postParams` sends each one twice.
- Drop empty params: `order_type=` is a different request from no `order_type`.
- Autocomplete requests drop the endpoint's query string — repeat those params
  in `autocompleteParams`.
- `FormRenderer` reloads the form when `api_endpoint` or `getParams` change; no
  `key` needed. `templates` is **not** passed through by `FormRenderer` in 2.1.1.
- Keep the drawer mounted when closed so it can slide out; mount
  `FormRenderer` only while open.
- Status-dependent forms: pick `actionKey` from the record's status — a different
  `action_key` gets a different schema. It must match a form the backend
  registered.
- Full prop list: [form.md](form.md).

---

## D6. Related records in a tab

Two options:

| Want | Use |
|------|-----|
| Same look as your list pages | Your headless list component with a scoped `apiUrl` ([H11](recipes-headless.md#h11-embedded-table-in-a-detail-tab)) |
| A quick drop-in | `CrudHandler` with a scoped endpoint |

```tsx
// Module scope — not inline in the tab body
function ModuleTab({ endpoint, parentKey, parentUuid }) {
  return <CrudHandler api_endpoint={`${endpoint}?${parentKey}=${parentUuid}`} enableDetailViewRoute={false} />;
}
```

- Set `enableDetailViewRoute={false}` on nested handlers — a nested detail route
  fights the page's own.
- Each table is a separate engine keyed by its endpoint; the parent uuid goes in
  the query string.

---

## D7. Page-key routing

Zango apps get two different URLs per page from the app-init config:

| Need | Source | Example |
|------|--------|---------|
| The CRUD **API** endpoint | `page_config[pageKey].url` | `/orders/foc/` |
| The **router** path to a page or detail | the routes table entry for that page key | `/app/orders/detail-view/<uuid>` |

```ts
const detailUrlForRow = (routes, pageKey, uuid) => {
  const base = routes.find((r) => r.extra_params?.page_key === pageKey)?.path;
  return base ? `${base.replace(/\/$/, '')}/detail-view/${uuid}` : null;
};
```

- Never navigate to the API endpoint (or a row's `crud_url`). It is not a router
  path, and joining it onto `/app/` builds a URL that matches no route.
- Routes that share a component tell themselves apart with
  `extra_params.page_key`.
