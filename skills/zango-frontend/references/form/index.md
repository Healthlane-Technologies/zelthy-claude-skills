# Zango FormRenderer Reference

> Auto-generated from documentation pages. Regenerate with: `node scripts/generate-reference.js`

## Import
```js
import { FormRenderer } from '@zango-core/crud/form';
```

## Server Response Format (snake_case)
```json
{ "success": true, "response": { "is_multistep": false, "form": { "json_schema": { "type": "object", "properties": {} }, "ui_schema": {}, "form_data": {} } } }
```

Note: Server uses `json_schema`, `ui_schema`, `form_data`. Local `rjsf_schema` prop uses camelCase: `schema`, `uiSchema`, `formData`.

---

## Components & Hooks

| Name | Type | Description | Reference |
|------|------|-------------|----------|
| FormRenderer | Forms | Dual-mode form engine with server-driven and local RJSF schema support, multi-step forms, autocomplete, and form sync. | [FormRenderer.md](FormRenderer.md) |

