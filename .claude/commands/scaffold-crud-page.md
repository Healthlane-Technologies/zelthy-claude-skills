---
description: "Generate a complete CRUD page with CrudHandler - table, detail view, forms, and workflows"
---

# Scaffold CRUD Page

Read the Zango CRUD reference for API details:
**Read:** `@ZANGO-SKILL-REFERENCE.md`

## Task
Generate a complete CRUD page based on the user's requirements. The page should include:
1. A CrudHandler component with the correct API endpoint
2. Custom components as needed (header, detail drawer, etc.)
3. Proper imports from `@zango-core/crud/table`

## Template

```jsx
import { CrudHandler } from '@zango-core/crud/table';

const {PageName}Page = () => {
  return (
    <CrudHandler
      api_endpoint="/api/{endpoint}/"
      headerProps={{
        title: "{Page Title}",
      }}
    />
  );
};

export default {PageName}Page;
```

## When to add custom components:
- **Custom header**: When the user needs stats cards, custom actions, or non-standard layout
- **Custom detail drawer**: When the default detail view needs tabs, workflow integration, or custom layout
- **Custom table body**: When cards/kanban/grid view is needed instead of rows
- **Custom utilities**: When advanced search/filters are needed

## Checklist
- [ ] Import from `@zango-core/crud/table` (NOT `@zango-core/crud`)
- [ ] Use `api_endpoint` prop (required)
- [ ] Add `headerProps.title` for page title
- [ ] If using workflow, data comes from API automatically
- [ ] If using custom detail, component receives `data`, `workflow_details`, `general_details`, `sections`, `onClose`
- [ ] Custom components inside CrudHandler can use `useTable()` hook
- [ ] Export the page component as default

## Common Patterns
Ask the user:
1. What entity/model is this page for?
2. Do they need custom detail view? (tabs, workflow)
3. Do they need custom table body? (cards, kanban)
4. Any custom actions or header elements?

Then generate the appropriate code.
