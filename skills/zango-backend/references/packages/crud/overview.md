# Zango CRUD Package - Overview

Complete guide for building CRUD (Create, Read, Update, Delete) interfaces using Zango's CRUD package.

## What is the CRUD Package?

The Zango CRUD package provides a powerful framework for creating data management interfaces with minimal code.

**Key Benefits**:
- Rapid development of data management interfaces
- Consistent UI/UX across the application
- Built-in pagination, search, and sorting
- Automatic form validation and error handling
- Customizable actions and permissions

---

## CRUD Architecture

The CRUD pattern consists of **three main components**:

```
┌─────────────────────────────────────────┐
│         BaseCrudView (views.py)         │
│  Orchestrates the entire CRUD interface │
└───────────┬────────────────┬────────────┘
            │                │
     ┌──────▼──────┐  ┌─────▼──────┐
     │  BaseForm   │  │ ModelTable │
     │ (forms.py)  │  │(tables.py) │
     └──────┬──────┘  └─────┬──────┘
            │                │
     ┌──────▼────────────────▼──────┐
     │      Model (models.py)        │
     │    Data Structure Definition  │
     └───────────────────────────────┘
```

1. **Forms** (`forms.py`) - Define how data is input and validated
2. **Tables** (`tables.py`) - Define how data is displayed in list views
3. **Views** (`views.py`) - Connect forms and tables to create complete CRUD interfaces

---

## Quick Start

For detailed documentation on each component, see:

- [Forms Reference](forms.md) - BaseForm, field types, validation, and layouts
- [Tables Reference](tables.md) - ModelTable, columns, row actions, and search
- [Views Reference](views.md) - BaseCrudView, integration, and URL configuration
