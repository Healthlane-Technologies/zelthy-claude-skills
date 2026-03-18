---
name: setup-theme
description: "Configure Zango theme colors, typography, and CSS variables. Use when changing app appearance or brand colors."
license: MIT
compatibility: Requires a Zango frontend app with @zango-core/crm-framework. Backend path requires Django shell access.
metadata:
  author: Healthlane Technologies
  version: "1.0"
allowed-tools: Read Write Bash(python:*) Bash(docker:*) Bash(npm:*)
---

# Setup Theme

Configure colors, typography, and CSS variables for a Zango frontend application.

## Two Paths

| Path | When to Use | Rebuild Needed? |
|------|-------------|-----------------|
| **App Panel** | Quick changes via browser UI | No |
| **Backend (Django shell)** | Programmatic / automated setup | No |

Both paths modify the same data. The theme is served via the `/appbuilder/initializer/` API and applied at runtime as CSS variables. No frontend rebuild is needed for either path.

## Path A: App Panel (No Code)

1. Navigate to `/appbuilder/configure/` in the browser
2. Go to the **Theme** section
3. Set colors, typography, background
4. Save -- changes take effect on next page load

## Path B: Backend (Django Shell)

```python
# Enter shell
# e.g., source /path/to/venv/bin/activate && python manage.py shell

from packages.appbuilder.backend.configure.models import ThemesModel

# Get or create theme
theme_obj, created = ThemesModel.objects.get_or_create(
    defaults={
        "colors": {
            "primary": "#5048ED",
            "secondary": "#6d7280",
            "success": "#10b981",
            "warning": "#f59e0b",
            "error": "#f04438",
            "gray": "#717680",
        },
        "typography": {
            "font_family": "Inter, sans-serif",
            "font_size_base": "14px",
            "line_height": 1.5,
        },
    }
)

# Update existing theme
if not created:
    theme_obj.colors = {
        "primary": "#2563eb",
        "secondary": "#6d7280",
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#f04438",
        "gray": "#717680",
    }
    theme_obj.typography = {
        "font_family": "Inter, sans-serif",
        "font_size_base": "14px",
        "line_height": 1.5,
    }
    theme_obj.save()

print("Theme saved:", theme_obj.colors)
```

### Via Docker

```bash
docker exec -it <container> python manage.py shell -c "
from packages.appbuilder.backend.configure.models import ThemesModel
theme_obj = ThemesModel.objects.first()
if theme_obj:
    theme_obj.colors['primary'] = '#2563eb'
    theme_obj.save()
    print('Updated primary to', theme_obj.colors['primary'])
else:
    print('No theme found')
"
```

## Color Configuration

| Key | CSS Variable | Description |
|-----|-------------|-------------|
| `primary` | `--color-brand-*` | Brand color, generates full palette (50-950) |
| `secondary` | `--color-secondary-*` | Secondary color |
| `success` | `--color-success-*` | Success/positive states |
| `warning` | `--color-warning-*` | Warning states |
| `error` | `--color-error-*` | Error/danger states |
| `gray` | `--color-gray-*` | Neutral palette |
| `background` | -- | Page background |
| `text` | -- | Default text color |

### Generated CSS Variables

Setting `primary: "#5048ED"` generates a full shade palette:

```css
:root {
  --color-brand-50: #EAE8FF;
  --color-brand-100: #D4D0FF;
  --color-brand-200: #A9A1FF;
  --color-brand-300: #7E72FF;
  --color-brand-400: #6A5FF0;
  --color-brand-500: #5048ED;   /* primary */
  --color-brand-600: #4038D4;
  --color-brand-700: #302AA8;
  --color-brand-800: #201C7D;
  --color-brand-900: #151263;
  --color-brand-950: #0A0932;

  --color-gray-50: #F9FAFB;
  --color-gray-500: #667085;
  --color-gray-900: #101828;

  --color-success-500: #10B981;
  --color-error-500: #F04438;
  --color-warning-500: #F59E0B;
}
```

## Typography Configuration

| Key | Description |
|-----|-------------|
| `font_family` | Font family (loaded via Google Fonts or local) |
| `font_size_base` | Base font size (e.g., `"14px"`) |
| `line_height` | Base line height (e.g., `1.5`) |

## Using Theme in Custom Components

### Option 1: CSS Variables (Recommended)

Use the generated CSS variables directly in styles:

```jsx
const MyComponent = () => (
  <div style={{
    color: 'var(--color-brand-500)',
    backgroundColor: 'var(--color-gray-50)',
    borderColor: 'var(--color-gray-200)',
  }}>
    Themed content
  </div>
);
```

### Option 2: Tailwind Classes (With @theme Setup)

After configuring `@theme` in your CSS (see below), use Tailwind classes:

```jsx
const MyComponent = () => (
  <div className="text-brand-500 bg-gray-50 border-gray-200">
    Themed content
  </div>
);
```

### Option 3: useAppContext Hook

Access the raw theme object programmatically:

```jsx
import { useAppContext } from '@zango-core/crm-framework';

const MyComponent = () => {
  const { theme } = useAppContext();
  // theme.colors.primary, theme.typography.font_family, etc.

  return (
    <div style={{ color: theme.colors.primary }}>
      Brand colored text
    </div>
  );
};
```

## Tailwind CSS v4 @theme Setup

To use theme CSS variables as Tailwind utility classes, configure the `@theme` block in `src/index.css`:

```css
@import 'tailwindcss';

@theme {
  /* Map CSS variables to Tailwind color names */
  --color-brand-50: var(--color-brand-50, #EAE8FF);
  --color-brand-100: var(--color-brand-100, #D4D0FF);
  --color-brand-200: var(--color-brand-200, #A9A1FF);
  --color-brand-300: var(--color-brand-300, #7E72FF);
  --color-brand-400: var(--color-brand-400, #6A5FF0);
  --color-brand-500: var(--color-brand-500, #5048ED);
  --color-brand-600: var(--color-brand-600, #4038D4);
  --color-brand-700: var(--color-brand-700, #302AA8);
  --color-brand-800: var(--color-brand-800, #201C7D);
  --color-brand-900: var(--color-brand-900, #151263);

  --color-gray-50: var(--color-gray-50, #F9FAFB);
  --color-gray-100: var(--color-gray-100, #F2F4F7);
  --color-gray-200: var(--color-gray-200, #E4E7EC);
  --color-gray-300: var(--color-gray-300, #D0D5DD);
  --color-gray-400: var(--color-gray-400, #98A2B3);
  --color-gray-500: var(--color-gray-500, #667085);
  --color-gray-600: var(--color-gray-600, #475467);
  --color-gray-700: var(--color-gray-700, #344054);
  --color-gray-800: var(--color-gray-800, #1D2939);
  --color-gray-900: var(--color-gray-900, #101828);

  --color-success-500: var(--color-success-500, #10B981);
  --color-error-500: var(--color-error-500, #F04438);
  --color-warning-500: var(--color-warning-500, #F59E0B);
}
```

After this, Tailwind classes like `text-brand-500`, `bg-gray-50`, `border-error-500` work and automatically pick up the runtime theme values.

**Important**: The fallback values (e.g., `#EAE8FF`) in the `var()` functions are defaults used during build. At runtime, the CSS variables injected by ZangoApp override them. This means Tailwind classes respond to theme changes without rebuilding.

## Theme in the Initializer Response

The theme is part of the `/appbuilder/initializer/` API response:

```json
{
  "response": {
    "theme": {
      "colors": {
        "primary": "#5048ed",
        "secondary": "#6d7280",
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#f04438",
        "gray": "#717680"
      },
      "typography": {
        "font_family": "Inter, sans-serif",
        "font_size_base": "14px",
        "line_height": 1.5
      }
    }
  }
}
```

ZangoApp reads this response and injects the CSS variables into `:root` at runtime.

## Common Patterns

```python
# Dark Mode
theme_obj.colors = {
    "primary": "#818cf8", "secondary": "#9ca3af", "success": "#34d399",
    "warning": "#fbbf24", "error": "#f87171", "gray": "#9ca3af",
    "background": "#111827", "text": "#f9fafb",
}
theme_obj.save()

# Corporate Blue
theme_obj.colors = {
    "primary": "#2563eb", "secondary": "#64748b", "success": "#16a34a",
    "warning": "#d97706", "error": "#dc2626", "gray": "#64748b",
}
theme_obj.save()

# Custom Font (ensure font is loaded in index.html or via @import in CSS)
theme_obj.typography = { "font_family": "Poppins, sans-serif", "font_size_base": "15px", "line_height": 1.6 }
theme_obj.save()
```

The theme system is runtime-based -- no frontend rebuild needed for theme changes.

For the complete theme reference, see: [App Builder Reference](../zango-frontend/references/APPBUILDER-REFERENCE.md)
