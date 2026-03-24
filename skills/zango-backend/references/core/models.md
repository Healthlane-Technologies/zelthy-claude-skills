# Zango Model Reference

Complete guide for creating and managing Zango models.

## What Are Zango Models?

Models define the data structure and database schema for your application. Zango uses a special pattern that enables:
- Dynamic schema management
- Multi-tenancy support
- Automatic audit fields
- Cross-tenant data isolation

---

## Critical Requirements

1. **ALL models MUST inherit from `DynamicModelBase`** (NOT `models.Model`)
2. **Models MUST be defined in `models.py`** within your module
3. **Use `ZForeignKey`** for relationships between Zango models
4. **Use `ZFileField`** for file uploads
5. **NO `ManyToManyField` support** - use intermediary models

---

## Basic Model Structure

```python
from django.db import models
from zango.apps.dynamic_models.models import DynamicModelBase
from zango.apps.dynamic_models.fields import ZForeignKey

class MyModel(DynamicModelBase):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
```

### Essential Imports

```python
# Always required
from django.db import models
from zango.apps.dynamic_models.models import DynamicModelBase

# For relationships between Zango models
from zango.apps.dynamic_models.fields import ZForeignKey

# For file uploads
from zango.core.storage_utils import ZFileField
```

---

## Auto-Inherited Fields

Every Zango model automatically inherits these fields from `DynamicModelBase`:

| Field | Type | Description |
|-------|------|-------------|
| `created_at` | DateTimeField | Timestamp when record was created |
| `created_by` | ForeignKey | User who created the record |
| `modified_at` | DateTimeField | Timestamp of last modification |
| `modified_by` | ForeignKey | User who last modified the record |
| `object_uuid` | UUIDField | Unique identifier for the object |

**You do NOT need to define these fields** - they're automatically available:

```python
patient = Patient.objects.get(id=1)
print(patient.created_at)      # DateTime of creation
print(patient.created_by)      # User who created
print(patient.modified_at)     # DateTime of last modification
print(patient.modified_by)     # User who last modified
print(patient.object_uuid)     # UUID of the object
```

---

## Standard Django Fields

All standard Django model fields are supported:

### Text Fields

```python
# Short text (must specify max_length)
name = models.CharField(max_length=255)
code = models.CharField(max_length=50, unique=True)

# Long text
description = models.TextField(null=True, blank=True)
notes = models.TextField()

# Email addresses
email = models.EmailField(max_length=255, null=True, blank=True)
```

### Numeric Fields

```python
# Integers
quantity = models.IntegerField(default=0)
age = models.IntegerField(null=True, blank=True)

# Precise decimals (for money, measurements)
price = models.DecimalField(max_digits=10, decimal_places=2)
total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

# Floating point numbers
rating = models.FloatField(null=True, blank=True)
percentage = models.FloatField(default=0.0)
```

### Date and Time Fields

```python
# Date only
birth_date = models.DateField(null=True, blank=True)
start_date = models.DateField()
end_date = models.DateField(null=True, blank=True)

# Date and time
appointment = models.DateTimeField(null=True, blank=True)
deadline = models.DateTimeField()

# Auto-populated timestamps
created_at = models.DateTimeField(auto_now_add=True)  # Set once on creation
updated_at = models.DateTimeField(auto_now=True)      # Updated on every save
```

### Boolean Fields

```python
is_active = models.BooleanField(default=True)
is_verified = models.BooleanField(default=False)
is_bms_administered = models.BooleanField(
    default=False,
    help_text="Is this vendor BMS administered?"
)
```

### Choice Fields

```python
STATUS_CHOICES = [
    ('draft', 'Draft'),
    ('active', 'Active'),
    ('closed', 'Closed'),
]

status = models.CharField(
    max_length=20,
    choices=STATUS_CHOICES,
    default='draft'
)
```

```python
RISK_SCORE_CHOICES = [
    ('low', 'Low'),
    ('medium', 'Medium'),
    ('high', 'High'),
]

risk_score = models.CharField(
    max_length=50,
    choices=RISK_SCORE_CHOICES,
    null=True,
    blank=True,
    help_text="Risk assessment level"
)
```

### JSON Fields

For storing structured data, lists, or dictionaries:

```python
# Dictionary data
metadata = models.JSONField(default=dict, blank=True)
settings = models.JSONField(default=dict, blank=True)

# List data
tags = models.JSONField(default=list, blank=True)
categories = models.JSONField(default=list, blank=True)

# Nullable JSON
extra_data = models.JSONField(null=True, blank=True)
```

---

## Zango-Specific Fields

### ZForeignKey - For Relationships

Use `ZForeignKey` to create relationships between Zango models (models inheriting from `DynamicModelBase`).

#### Import

```python
from zango.apps.dynamic_models.fields import ZForeignKey
```

#### Basic Usage

```python
from zango.apps.dynamic_models.fields import ZForeignKey
from ..masters.geography.models import CountryOffice

class Program(DynamicModelBase):
    name = models.CharField(max_length=255)

    # Relationship to another Zango model
    country = ZForeignKey(
        CountryOffice,
        on_delete=models.PROTECT,
        related_name='programs',
        null=True,
        blank=True
    )
```

#### on_delete Options

| Option | Behavior |
|--------|----------|
| `models.CASCADE` | Delete related objects when this object is deleted |
| `models.PROTECT` | Prevent deletion if related objects exist |
| `models.SET_NULL` | Set to NULL when deleted (requires `null=True`) |
| `models.SET_DEFAULT` | Set to default value when deleted (requires `default`) |

#### Complete Example

```python
from zango.apps.dynamic_models.fields import ZForeignKey
from ..masters.geography.models import CountryOffice
from ..masters.product.models import Product

class Program(DynamicModelBase):
    name = models.CharField(max_length=255)

    # PROTECT: Cannot delete country if programs exist
    country = ZForeignKey(
        CountryOffice,
        on_delete=models.PROTECT,
        related_name='programs',
        null=True,
        blank=True
    )

    # CASCADE: Delete programs when product is deleted
    product = ZForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='programs'
    )
```

#### When to Use ZForeignKey vs models.ForeignKey

- **Use `ZForeignKey`**: For relationships to Zango models (inheriting from `DynamicModelBase`)
- **Use `models.ForeignKey`**: ONLY for Django framework models (User, Group, etc.)

```python
from django.contrib.auth.models import User

class AuditLog(DynamicModelBase):
    action = models.CharField(max_length=255)

    # Use models.ForeignKey for Django's built-in User model
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
```

### ZFileField - For File Uploads

Use `ZFileField` for uploading files (documents, images, PDFs, etc.).

#### Import

```python
from zango.core.storage_utils import ZFileField
```

#### Usage

```python
from zango.core.storage_utils import ZFileField

class Vendor(DynamicModelBase):
    name = models.CharField(max_length=255)

    # File upload fields
    logo = ZFileField(blank=True, null=True)
    contract_document = ZFileField(blank=True, null=True)
    certificate = ZFileField()  # Required file
```

#### Features

- Handles file storage automatically (S3 or configured storage)
- Supports all file types (images, PDFs, documents, etc.)
- Optional with `blank=True, null=True`

---

## Many-to-Many Relationships

⚠️ **CRITICAL**: Zango does NOT support `ManyToManyField`.

### ❌ Don't Do This

```python
# This will NOT work in Zango
class Program(DynamicModelBase):
    vendors = models.ManyToManyField(Vendor)  # ❌ Not supported
```

### ✅ Do This Instead

Create an explicit intermediary model:

```python
class Program(DynamicModelBase):
    name = models.CharField(max_length=255)

class Vendor(DynamicModelBase):
    name = models.CharField(max_length=255)

# Explicit mapping model
class ProgramVendorMapping(DynamicModelBase):
    program = ZForeignKey(
        Program,
        on_delete=models.CASCADE,
        related_name='vendor_mappings'
    )
    vendor = ZForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name='program_mappings'
    )
    is_active = models.BooleanField(default=True)
    assigned_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.program.name} - {self.vendor.name}"
```

**Benefits of Intermediary Models**:
- Add extra fields (is_active, assigned_date, etc.)
- More control over the relationship
- Better for audit trails

---

## Complete Model Example

```python
from django.db import models
from zango.apps.dynamic_models.models import DynamicModelBase
from zango.apps.dynamic_models.fields import ZForeignKey
from zango.core.storage_utils import ZFileField

from ..masters.geography.models import CountryOffice

# Define choices
RISK_SCORE_CHOICES = [
    ('low', 'Low'),
    ('medium', 'Medium'),
    ('high', 'High'),
]

TRAINING_TYPE_CHOICES = [
    ('online', 'BMS Managed'),
    ('offline', 'Vendor Managed'),
]

class Vendor(DynamicModelBase):
    # Basic fields
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)

    # Contact information
    primary_contact_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    # Choice fields
    training_type = models.CharField(
        max_length=10,
        choices=TRAINING_TYPE_CHOICES,
        help_text="Training management approach"
    )
    risk_score = models.CharField(
        max_length=50,
        choices=RISK_SCORE_CHOICES,
        null=True,
        blank=True
    )

    # Boolean fields
    is_active = models.BooleanField(default=True)
    is_bms_administered = models.BooleanField(
        default=False,
        help_text="Is this vendor BMS administered?"
    )

    # File field
    logo = ZFileField(blank=True, null=True)

    # Text fields
    parent_organization = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    # JSON field for flexible data
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.name

# Relationship model (instead of ManyToMany)
class VendorCountryMapping(DynamicModelBase):
    vendor = ZForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name='country_mappings'
    )
    country = ZForeignKey(
        CountryOffice,
        on_delete=models.CASCADE,
        related_name='vendor_mappings'
    )
    is_active = models.BooleanField(default=True)
    assigned_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.vendor.name} - {self.country.name}"
```

---

## Cross-Module Imports

When importing models from other modules, use relative imports:

```python
# Import from sibling module (same level)
from ..masters.geography.models import CountryOffice, Region

# Import from nested module
from ..masters.product.models import Product

# Import from parent level
from ...configurations.models import ServiceType
```

**Import Path Rules**:
- `..` = go up one level
- `...` = go up two levels
- Count dots based on your location in directory structure

---

## Field Options Reference

### Common Field Options

| Option | Description | Example |
|--------|-------------|---------|
| `max_length` | Maximum length (required for CharField) | `max_length=255` |
| `null` | Allow NULL in database | `null=True` |
| `blank` | Allow empty in forms | `blank=True` |
| `default` | Default value | `default=True` |
| `unique` | Must be unique | `unique=True` |
| `help_text` | Descriptive help text | `help_text="Enter email"` |
| `choices` | List of valid values | `choices=STATUS_CHOICES` |
| `auto_now` | Update on every save | `auto_now=True` |
| `auto_now_add` | Set once on creation | `auto_now_add=True` |

### null vs blank

```python
# Optional field (both in database and forms)
email = models.EmailField(null=True, blank=True)

# Required field
name = models.CharField(max_length=255)  # No null or blank

# Allow empty string, but not NULL
description = models.CharField(max_length=500, blank=True, default='')
```

**Best Practice**: Use `null=True, blank=True` together for optional fields.

---

## Model Best Practices

### 1. Standard Fields

Include these common fields in most models:

```python
name = models.CharField(max_length=255)
code = models.CharField(max_length=50, unique=True)
is_active = models.BooleanField(default=True)
```

### 2. String Representation

Always define `__str__` method:

```python
def __str__(self):
    return self.name  # Or any meaningful string
```

### 3. Field Naming

- Use lowercase with underscores: `start_date`, `is_active`, `primary_contact_name`
- Be descriptive and clear
- Avoid abbreviations unless commonly understood

```python
# Good
primary_contact_name = models.CharField(max_length=255)
is_active = models.BooleanField(default=True)

# Avoid
pcn = models.CharField(max_length=255)  # Unclear abbreviation
active = models.BooleanField(default=True)  # Not boolean naming convention
```

### 4. Help Text

Add help text for clarity:

```python
field_name = models.CharField(
    max_length=100,
    help_text="Brief description of what this field represents"
)
```

### 5. Choices

Define choices as constants at module level:

```python
STATUS_CHOICES = [
    ('draft', 'Draft'),
    ('active', 'Active'),
    ('closed', 'Closed'),
]

class MyModel(DynamicModelBase):
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
```

---

## Database and Multi-Tenancy

### PostgreSQL with Multi-Tenant Architecture

Zango uses PostgreSQL with a multi-tenant setup:

- Each application has its own isolated database **schema**
- Schemas provide complete data separation between applications/tenants
- All models for an application are created within that application's schema
- Automatic schema management by Zango

**Key Concepts**:
- **Schema**: A namespace within PostgreSQL containing tables and objects
- **Multi-Tenancy**: Each application operates in its own schema
- **Data Isolation**: Complete separation between tenants

---

## Migrations

After creating or modifying models, you MUST create and apply migrations.

### Step 1: Create Migration Files

```bash
python manage.py ws_makemigration <app_name>
```

**Example**:
```bash
python manage.py ws_makemigration myapp
```

**Output**:
```
Migrations for 'myapp':
  migrations/0001_initial.py
    - Create model Patient
```

### Step 2: Apply Migrations

```bash
python manage.py ws_migrate <app_name>
```

**Example**:
```bash
python manage.py ws_migrate myapp
```

**Output**:
```
Running migrations:
  Applying myapp.0001_initial... OK
```

### Migration File Location

All migrations are stored in **one centralized folder**:

```
workspace/
└── myapp/
    ├── migrations/           # All migrations here
    │   ├── __init__.py
    │   ├── 0001_initial.py
    │   ├── 0002_add_vendor_model.py
    │   └── 0003_add_program_model.py
    ├── backend/
    │   ├── patients/
    │   ├── vendors/
    │   └── ...
    ├── settings.json
    └── manifest.json
```

### Complete Migration Workflow

1. **Create/Modify Models** in `models.py`
2. **Generate Migration**: `python manage.py ws_makemigration myapp`
3. **Review Migration** (optional but recommended)
4. **Apply Migration**: `python manage.py ws_migrate myapp`
5. **Verify** model is working

### Common Migration Scenarios

**Adding a New Model**:
```bash
# 1. Create model in models.py
# 2. Generate and apply migration
python manage.py ws_makemigration myapp
python manage.py ws_migrate myapp
```

**Adding a Field**:
```bash
# 1. Add field to model in models.py
# 2. Generate and apply migration
python manage.py ws_makemigration myapp
python manage.py ws_migrate myapp
```

**Modifying Multiple Models**:
```bash
# 1. Make all changes
# 2. Generate single migration with all changes
python manage.py ws_makemigration myapp
python manage.py ws_migrate myapp
```

### Migration Best Practices

1. **Always use migrations** - Never modify database directly
2. **Review before applying** - Check migration files
3. **One migration per logical change** - Don't batch unrelated changes
4. **Test migrations** - Verify in development first
5. **Keep migrations in version control** - Commit migration files

---

## Troubleshooting

### Error: Model must inherit from DynamicModelBase

**Problem**: Using `models.Model` instead of `DynamicModelBase`

**Solution**:
```python
# Wrong
class MyModel(models.Model):  # ❌

# Correct
class MyModel(DynamicModelBase):  # ✅
```

### Error: Cannot use ManyToManyField

**Problem**: Attempting to use `ManyToManyField`

**Solution**: Use intermediary model instead (see Many-to-Many section above)

### Error: Foreign key must be ZForeignKey

**Problem**: Using `models.ForeignKey` for Zango model

**Solution**:
```python
# Wrong (for Zango models)
country = models.ForeignKey(CountryOffice, ...)  # ❌

# Correct (for Zango models)
country = ZForeignKey(CountryOffice, ...)  # ✅
```

### Migration Not Creating Table

**Problem**: Forgot to apply migration

**Solution**:
```bash
python manage.py ws_makemigration myapp
python manage.py ws_migrate myapp
```
