# Zango Backend Skill

Complete backend development assistant for Zango applications.

## Quick Start

### 1. Install the Skill

From your Zango project directory:

```bash
bash /path/to/pkg-zango-skills/scripts/setup-skills.sh .
```

Restart Claude Code.

### 2. Test It

In Claude Code:

```
/zango-backend

"Create a CRUD view for patient"
```

Answer the prompts and watch it create:
- ✅ Module (`backend/patients/`)
- ✅ Model with fields
- ✅ Form + Table + View
- ✅ URLs and registration
- ✅ Migrations

### 3. Access Your CRUD

```bash
python manage.py runserver
# Visit: http://localhost:8000/patients/
```

---

## What It Creates

| Component | Files | Example |
|-----------|-------|---------|
| **Module** | Folder structure, `__init__.py` | `backend/patients/` |
| **Model** | `models.py`, migrations | `class Patient(DynamicModelBase)` |
| **Form** | `forms.py` | `class PatientForm(BaseForm)` |
| **Table** | `tables.py` | `class PatientTable(ModelTable)` |
| **View** | `views.py` | `class PatientCrudView(BaseCrudView)` |
| **URLs** | `urls.py` | `path('patients/', ...)` |
| **Policies** | `policies.json` | Role-based access control |
| **Workflow** | `workflow.py` | State management |

---

## Example Commands

### Create Simple CRUD
```
Create a CRUD view for product
```

### Create with Workflow
```
Create a CRUD view for order with draft/processing/completed statuses
```

### Create with Policies
```
Create a CRUD view for patient with Admin (full access) and Doctor (view-only) policies
```

### Add to Existing
```
Add address field to Patient model
Add workflow to Product model
Create policies for Order CRUD
```

### Many-to-Many
```
Create a many-to-many relationship between Doctor and Patient
```

---

## File Structure

```
skills/zango-backend/
├── skill.md              # Main orchestrator
└── references/           # Implementation guides
    ├── core/             # Core Zango features
    │   ├── modules.md    # Module creation & registration
    │   ├── models.md     # DynamicModelBase, fields
    │   └── policies.md   # Access control
    └── packages/         # Zango packages
        ├── crud/         # CRUD package
        │   ├── overview.md
        │   ├── forms.md
        │   ├── tables.md
        │   └── views.md
        ├── workflow/     # Workflow package
        │   ├── overview.md
        │   ├── statuses.md
        │   ├── transitions.md
        │   └── advanced.md
        └── appbuilder/
            └── overview.md
```

---

## Key Rules (Auto-Enforced)

✅ **Models**: Inherit from `DynamicModelBase` (NOT `models.Model`)
✅ **Relationships**: Use `ZForeignKey` for Zango models
✅ **No M2M**: Use intermediary models instead
✅ **Migrations**: Use `ws_makemigration` / `ws_migrate`
✅ **Views**: Must have `add_btn_title` attribute
✅ **Imports**: Use relative imports (`from ..module.models`)

---

## Common Patterns

### Standard Model Fields
```python
name = models.CharField(max_length=255)
code = models.CharField(max_length=50, unique=True)
is_active = models.BooleanField(default=True)
```

### ZForeignKey Relationship
```python
from zango.apps.dynamic_models.fields import ZForeignKey

class Order(DynamicModelBase):
    customer = ZForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name='orders'
    )
```

### Workflow Statuses
```python
class Meta:
    on_create_status = "draft"
    statuses = {
        "draft": {"color": "gray", "label": "Draft"},
        "active": {"color": "green", "label": "Active"},
        "closed": {"color": "blue", "label": "Closed"}
    }
```

---

## Testing

See [TESTING.md](../../TESTING.md) for comprehensive test guide.

**Quick Test**:
```bash
# 1. Create CRUD
/zango-backend
"Create a CRUD view for test_entity"

# 2. Verify files
ls workspace/<app>/backend/test_entity/

# 3. Check it works
python manage.py runserver
# Visit: http://localhost:8000/test-entity/
```

---

## Reference Documentation

All reference documentation is organized by topic:

### Core Zango Features
- **modules.md** - Module structure, registration, naming conventions
- **models.md** - DynamicModelBase, fields, relationships, migrations
- **policies.md** - Access control, role-based permissions

### CRUD Package
- **crud/overview.md** - Architecture and quick start
- **crud/forms.md** - BaseForm, field types, validation
- **crud/tables.md** - ModelTable, columns, row actions
- **crud/views.md** - BaseCrudView, integration

### Workflow Package
- **workflow/overview.md** - Architecture and quick start
- **workflow/statuses.md** - Status definitions and colors
- **workflow/transitions.md** - Simple and form-based transitions
- **workflow/advanced.md** - Conditions, done methods, examples

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `add_btn_title not found` | Auto-added by skill |
| `ModuleNotFoundError` | Check `__init__.py` exists |
| `Must inherit DynamicModelBase` | Auto-enforced by skill |
| `ManyToManyField not supported` | Skill creates intermediary model |
| Migration fails | Check model syntax |
| Packages missing | Install crud/appbuilder from App Panel |

---

## Support

- **Documentation**: See `references/` folder for detailed guides
- **Issues**: https://github.com/anthropics/claude-code/issues
- **Examples**: See `TESTING.md` for complete examples

---

## Version

**v2.0** - Single-skill orchestrator with organized references
- ✅ Single skill (no agents)
- ✅ Organized reference structure (core + packages)
- ✅ Full CRUD, workflow, and policy support
- ✅ Package validation
- ✅ Intelligent defaults
