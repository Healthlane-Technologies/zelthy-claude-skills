---
name: zango-backend
description: "Complete Zango backend development - creates modules, models, CRUD views, policies, and workflows. Use when creating Django models, CRUD interfaces, or backend logic for Zango apps. Handles end-to-end backend scaffolding from module creation to workflow implementation."
license: MIT
compatibility: Designed for Claude Code. Requires a Zango project in workspace/ directory.
metadata:
  author: Healthlane Technologies
  version: "2.0"
---

# Zango Backend Development

Single skill for all Zango backend development. Orchestrates complete backend creation from modules to workflows.

## Step 1: Understand the Task

Determine what the user wants and read the relevant references:

| User wants | References to read | Action |
|------------|-------------------|--------|
| Create CRUD for entity | core/modules.md, core/models.md, packages/crud/*.md | Full CRUD Setup |
| Create module | core/modules.md | Module Creation |
| Create model | core/models.md | Model Creation |
| Add workflow | packages/workflow/*.md | Workflow Creation |
| Add policies | core/policies.md | Policy Creation |
| Add field to model | core/models.md | Model Update |
| Initialize app | (internal logic) | App Initialization |

---

## Critical Rules (always apply)

1. **Package Check**: BEFORE creating CRUD/Workflow, verify `crud`, `appbuilder`, `workflow` packages installed
2. **Inheritance**: Models use `DynamicModelBase`, Forms use `BaseForm`, Tables use `ModelTable`, Views use `BaseCrudView`
3. **Relationships**: Use `ZForeignKey` for Zango models, `models.ForeignKey` ONLY for Django models (User, Group)
4. **No M2M**: NEVER use `ManyToManyField` - create intermediary models instead
5. **Migrations**: Use `ws_makemigration` / `ws_migrate` (NOT standard Django commands)
6. **Imports**: Always use relative imports (`from ..module.models import X`)
7. **Naming**: Folders use `underscores`, URLs use `hyphens`, Classes use `PascalCase`
8. **Views**: MUST have `add_btn_title` attribute

---

## Phase 1: Prerequisites Check

### Check App Initialization

```
Look for: workspace/<app_name>/.claude/zango-config.json
If missing: Run first-time setup
If exists: Load config and proceed
```

**First-Time Setup**:
1. Ask for virtual environment path
2. Get app_name from settings.json
3. Check/create domain mapping
4. Update /etc/hosts
5. Save to `.claude/zango-config.json`

### Check Required Packages

**For CRUD operations**, verify:
1. Read `workspace/<app_name>/manifest.json`
2. Check for `crud` and `appbuilder` packages
3. Verify `workspace/<app_name>/packages/crud/` exists

**For Workflow operations**, verify:
1. Check for `workflow` package in manifest
2. Verify `workspace/<app_name>/packages/workflow/` exists

**If packages MISSING**:
```
❌ ERROR: Required package '<package_name>' is NOT INSTALLED

CANNOT proceed. Install from App Panel:
1. Open browser → App Panel
2. Navigate to your app
3. Click "Packages" section
4. Install: crud (latest)
5. Install: appbuilder (latest)
6. Retry your request

STOP: Cannot create CRUD without these packages.
```

---

## Phase 2: Gather Requirements

**ONLY after packages verified**, gather:

1. **Entity name** (e.g., "patient", "appointment")
2. **Module structure** (flat or hierarchical)
3. **Fields** (or use defaults below)
4. **Access roles** - Which roles should access the view? (e.g., Admin, Manager, Doctor) - REQUIRED
5. **Optional**: Workflow states?

### Intelligent Defaults

| Entity | Fields |
|--------|--------|
| patient | name, code, email, phone, date_of_birth, is_active |
| appointment | title, patient (FK), doctor (FK), date_time, status, notes |
| product | name, code, description, price, is_active |
| order | order_number, customer (FK), total_amount, status, order_date |
| vendor | name, code, email, phone, is_active |

---

## Phase 3: Execute Operations

Follow dependency chain: **Module → Model → CRUD → Policies → Workflow**

### Create Module

**Read**: `references/core/modules.md`

**Actions**:
1. Create folder structure with `__init__.py`
2. Register in `settings.json`:
   - `modules` array: `{"name": "X", "path": "backend.X"}`
   - `app_routes` array: `{"module": "X", "re_path": "^x/", "url": "urls"}`

### Create Model

**Read**: `references/core/models.md`

**Actions**:
1. Create in `backend/<module>/models.py`:
   - Inherit from `DynamicModelBase`
   - Use `ZForeignKey` for relationships
   - Standard fields: name, code, is_active
2. Run migrations:
   ```bash
   python manage.py ws_makemigration <app_name>
   python manage.py ws_migrate <app_name>
   ```

### Create CRUD

**Read**:
- `references/packages/crud/forms.md`
- `references/packages/crud/tables.md`
- `references/packages/crud/views.md`

**Actions**:

1. **Form** (`forms.py`):
   - Inherit from `BaseForm`
   - Fields with `ModelField`
   - `__init__` and `save` methods
   - Meta: model, title, layout, order

2. **Table** (`tables.py`):
   - Inherit from `ModelTable`
   - Columns: ModelCol, StringCol
   - `row_actions` list
   - `_getval` methods for custom display
   - `process_row_action_*` methods

3. **View** (`views.py`):
   - Inherit from `BaseCrudView`
   - Set: `page_title`, `add_btn_title` (REQUIRED), `model`, `form`, `table`

4. **URLs** (`urls.py`):
   ```python
   path('<entity>/', EntityCrudView.as_view(), name='entity_crud')
   ```

5. **Policy** (REQUIRED for all views):
   - Read `references/core/policies.md` for structure
   - Create/update `backend/<module>/policies.json`
   - Add view policy with user-specified roles and package features
   - Sync from App Panel: Code → Policies → "Sync Policies"

### Create Workflow (Optional)

**Read**:
- `references/packages/workflow/statuses.md`
- `references/packages/workflow/transitions.md`
- `references/packages/workflow/advanced.md`

**Actions**:
1. Create `workflow.py`:
   - Inherit from `WorkflowBase`
   - Define `Meta.statuses` with colors
   - Set `Meta.on_create_status`
   - Define `status_transitions`
   - Add condition/done methods
2. Update view: `workflow = EntityWorkflow`

---

## Verification Checklist

**Prerequisites**:
- [ ] Required packages installed

**Module & Model**:
- [ ] Module folder exists
- [ ] Module in settings.json (modules + app_routes)
- [ ] Model inherits DynamicModelBase
- [ ] Migrations applied

**CRUD**:
- [ ] Form: BaseForm, Meta, __init__, save
- [ ] Table: ModelTable, Meta, row_actions
- [ ] View: BaseCrudView, add_btn_title (REQUIRED!)
- [ ] URLs registered
- [ ] Policy created and synced (REQUIRED!)
- [ ] CRUD accessible

**Optional**:
- [ ] Workflow transitions work

---

## Common Operations

### Full CRUD Creation

User: "Create CRUD for Patient"

**Steps**:
1. ✅ Check prerequisites (app init, packages)
2. ✅ Gather requirements (fields, roles, workflow)
3. ✅ Create module (if needed)
4. ✅ Create model + migrations
5. ✅ Create form + table + view
6. ✅ Register URLs
7. ✅ Create policy + sync (REQUIRED)
8. ✅ Create workflow (if requested)

### Add Field to Model

User: "Add address to Patient"

**Steps**:
1. Edit `backend/patients/models.py`
2. Add field
3. Run migrations
4. Update form
5. Update table

### Add Workflow

User: "Add workflow to Order"

**Steps**:
1. Check workflow package installed
2. Create `workflow.py`
3. Define statuses and transitions
4. Update view

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| Packages missing | Install from App Panel |
| `ImportError: BaseForm` | crud package not installed |
| `AttributeError: add_btn_title` | Add to view class |
| `ModuleNotFoundError` | Check __init__.py, settings.json |
| `Must inherit DynamicModelBase` | Fix model inheritance |
| `ManyToManyField not supported` | Create intermediary model |
| Migration fails | Check model syntax |
| 404 on URL | Check app_routes |

---

## Reference Files

### Core Zango
- `references/core/modules.md` - Module creation & registration
- `references/core/models.md` - DynamicModelBase, fields, relationships
- `references/core/policies.md` - Access control

### CRUD Package
- `references/packages/crud/overview.md` - Architecture
- `references/packages/crud/forms.md` - BaseForm, validation
- `references/packages/crud/tables.md` - ModelTable, actions
- `references/packages/crud/views.md` - BaseCrudView

### Workflow Package
- `references/packages/workflow/overview.md` - Architecture
- `references/packages/workflow/statuses.md` - Status definitions
- `references/packages/workflow/transitions.md` - Transitions
- `references/packages/workflow/advanced.md` - Conditions, done methods

---

## Safety Rules

- ALWAYS read relevant reference files before executing
- ALWAYS ask user before running migrations
- ALWAYS verify packages before creating CRUD/Workflow
- NEVER use standard Django commands (use ws_*)
- NEVER use models.Model (use DynamicModelBase)
- NEVER use ManyToManyField (use intermediary model)
