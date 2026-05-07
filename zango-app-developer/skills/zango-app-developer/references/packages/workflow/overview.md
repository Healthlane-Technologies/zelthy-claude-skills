# Zango Workflow Package - Overview

Complete guide for implementing workflows and state management in Zango.

## What Are Workflows?

Workflows in Zango enable status-based lifecycle management for records with controlled state transitions, role-based permissions, and business logic enforcement.

**Key Features**:
- State machines that manage record lifecycles through status transitions
- Control movement between statuses (e.g., Draft → Active → Closed)
- Enforce business rules and validation before allowing transitions
- Support role-based permissions for transitions
- Execute custom logic before and after transitions
- Track complete status history for audit trails

**When to Use Workflows**:
- Records have multiple statuses or lifecycle stages
- Status changes require approval or validation
- Different roles have different permissions for status changes
- Need to track status history and changes
- Business logic needs to execute on status changes
- Additional information is needed during transitions

**Critical Modeling Rule**:
- Do not add manual status fields to your model metadata for entities managed by workflow.
- Attach workflow via CRUD view (`workflow = YourWorkflowClass`) and render status from workflow metadata/components.

---

## Workflow Architecture

```
┌──────────────────────────────────────┐
│      BaseCrudView (views.py)         │
│  - model, form, table, workflow      │
└────────────┬─────────────────────────┘
             │ references
             ▼
┌──────────────────────────────────────┐
│    WorkflowBase (workflow.py)        │
│  - status_transitions[]              │
│  - Meta (statuses, on_create_status) │
│  - condition methods                 │
│  - done methods                      │
└────────────┬─────────────────────────┘
             │ manages
             ▼
┌──────────────────────────────────────┐
│      Model (models.py)               │
│  - Status managed by workflow        │
└──────────────────────────────────────┘
```

---

## Quick Start

For detailed documentation on each component, see:

- [Statuses Reference](statuses.md) - Status definitions, colors, and initial states
- [Transitions Reference](transitions.md) - Simple and form-based transitions
- [Tags Reference](tags.md) - Tag definitions, tag transitions, and tag management
- [Utils Reference](utils.md) - Utility functions for filtering by status and tags
- [Advanced Reference](advanced.md) - Conditions, done methods, system transitions, and complete examples

Integration checklist:
- Workflow class is attached in the corresponding CRUD view.
- Transition permissions are defined in relevant module `policies.json`.
- Table/status UI consumes the workflow metadata shape returned by the API.
