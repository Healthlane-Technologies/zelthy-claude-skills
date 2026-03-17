---
description: "Generate a custom detail view - drawer or route-based with workflow integration"
---

# Scaffold Detail View

Read the Zango CRUD reference:
**Read:** `@ZANGO-SKILL-REFERENCE.md`

## Task
Generate a custom detail view component. CrudHandler supports two types:

### Type 1: Drawer Detail (side panel)
```jsx
const CustomDrawerDetail = ({ data, workflow_details, general_details, sections, onClose, open }) => {
  if (!open) return null;

  return (
    <div>
      <h2>{data?.title}</h2>

      {/* General Details */}
      {general_details?.fields && Object.entries(general_details.fields).map(([key, field]) => (
        <div key={key}>
          <strong>{field.display_name}</strong>: {field.value}
        </div>
      ))}

      {/* Workflow Status */}
      {workflow_details && (
        <div>
          Status: {workflow_details.current_status_meta?.status_label}
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/users/"
  customDrawerDetail={CustomDrawerDetail}
  detailDrawerSize="lg"
/>
```

### Type 2: Route-based Detail (full page)
```jsx
const CustomMainDetail = ({ data, workflow_details, general_details, sections, onRefresh }) => {
  return (
    <div>
      <h1>{data?.title}</h1>
      {/* ... full page layout ... */}
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/users/"
  customMainDetail={CustomMainDetail}
  enableDetailViewRoute={true}
/>
```

## Data Props (auto-provided, no manual fetching):
- `data` - Complete detail response
- `general_details` - `{ fields: { field_name: { name, display_name, type, value } } }`
- `workflow_details` - `{ current_status, current_status_meta, next_transitions, tag_details }`
- `sections` - `[{ key, title, data, extra_html }]`
- `row_actions` - `[{ name, key, type }]`
- `onClose` (drawer) / `onRefresh` (main) - Callbacks

## Checklist
- [ ] Data is auto-fetched - don't manually fetch from API
- [ ] `general_details.fields` is an object (not array) - use `Object.entries()`
- [ ] Workflow transitions: `workflow_details.next_transitions` (not `transitions`)
- [ ] Workflow tags: `workflow_details.tag_details` (not `tags`)
- [ ] Tag objects have `tag_label` (not `label`), `state` ("enabled"/"disabled")
