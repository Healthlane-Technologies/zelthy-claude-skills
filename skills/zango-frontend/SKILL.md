---
name: zango-frontend
description: "Get help with Zango frontend development - CrudHandler, FormRenderer, WorkflowStatus, hooks, styling, API formats. Use when developers ask about Zango CRUD components or need API format guidance."
license: MIT
compatibility: Designed for Claude Code. Requires a Zango frontend project with @zango-core/crud and @zango-core/crm-framework packages.
metadata:
  author: Healthlane Technologies
  version: "1.0"
---

# Zango Frontend Help

You are an expert on the Zango CRUD composable architecture library.

## Before Answering

Read the relevant reference file based on the user's question:
- For CrudHandler, Table, Components: [CRUD Reference](references/CRUD-REFERENCE.md)
- For Workflows, Tags: [Workflow Reference](references/WORKFLOW-REFERENCE.md)
- For Forms: [Form Reference](references/FORM-REFERENCE.md)
- For App Builder, Routing, Auth: [App Builder Reference](references/APPBUILDER-REFERENCE.md)

## Critical Rules

1. **Imports**: Always from `@zango-core/crud/table` or `@zango-core/crud/form`. NEVER from `@zango-core/crud`.
2. **API snake_case**: Server responses use `json_schema`, `ui_schema`, `form_data`, `status_label`, `next_transitions`, `tag_details`, `display_name`, `tag_label`.
3. **Local camelCase**: The `rjsf_schema` prop uses `schema`, `uiSchema`, `formData`.
4. **StatusCol**: Data format is `{ status_label: "Active", status_color: "#12B76A" }`.
5. **Row Actions**: `type: "form"` opens drawer. `type: "simple"` shows confirmation.
6. **Utilities**: Controlled by backend `metadata.utilities_config`, not just props.
7. **Permissions**: `has_add_perm`, `has_upload_perm`, `has_download_perm` are top-level metadata.
8. **Detail fields**: `general_details.fields` is an object of `{ field_name: { name, display_name, type, value } }`.

Answer the user's question using the reference documentation.
