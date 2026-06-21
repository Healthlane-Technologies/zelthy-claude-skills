# Zango Workflow Reference


## Import
```js
import { WorkflowStatus, WorkflowTags, DetailViewProvider, useWorkflow, useDetailView, useDetailViewContext } from '@zango-core/crud/table';
```

## Workflow Data Format
- Status: `{ status_label, status_color }`
- Transitions: `{ name, display_name, from, to, is_form_based, confirmation_message, description }`
- Tags: `{ name, state: "enabled"|"disabled", enable: { is_form_based, confirmation_message }, disable: { is_form_based, confirmation_message }, is_enable_allowed, is_disable_allowed }`
- Use `next_transitions` (NOT `transitions`), `tag_details` (NOT `tags`)
- `to_state_meta` only appears on audit-log / workflow-transaction entries, not on `next_transitions[]`.

---

## Components & Hooks

| Name | Type | Description | Reference |
|------|------|-------------|----------|
| Advanced Features | Advanced | Programmatic form control, portal rendering, error handling, and migration guides. | [Advanced-Features.md](Advanced-Features.md) |
| WorkflowStatus | Workflow | Manages workflow status transitions with full lifecycle control and custom rendering options. | [WorkflowStatus.md](WorkflowStatus.md) |
| WorkflowTags | Workflow | Manages workflow tags with toggle functionality and form-based transitions. | [WorkflowTags.md](WorkflowTags.md) |

