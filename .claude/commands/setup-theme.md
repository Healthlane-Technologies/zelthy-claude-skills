---
description: "Configure Zango theme - colors, typography, CSS variables, Tailwind v4 integration"
---

# Setup Theme

Read the reference:
**Read:** `@ZANGO-SKILL-REFERENCE.md`

## Ask the user:
1. What is their primary brand color?
2. Do they need custom success/warning/error colors?
3. Do they need custom typography (font family)?
4. Are they using Tailwind CSS v4?

## Two Ways to Set Theme

### Option A: Via Zango App Panel (no code)
1. Go to the Zango App Panel (admin UI)
2. Navigate to Configuration > Themes
3. Set colors using the color picker
4. Save and mark as active
5. No frontend rebuild needed - takes effect on next page load

### Option B: Via Backend (programmatic)
```python
# In Django shell
from packages.appbuilder.backend.configure.models import ThemesModel

ThemesModel.objects.create(
    is_active=True,
    theme={
        "colors": {
            "primary": "#5048ed",
            "gray": "#717680",
            "success": "#10b981",
            "warning": "#f59e0b",
            "error": "#f04438",
        },
        "typography": {
            "font_family": "Inter, sans-serif",
            "font_size_base": "14px",
            "line_height": 1.5
        }
    }
)
```

## CSS Variables Generated
The primary color generates a full palette:
```
--color-brand-25 through --color-brand-950
--color-gray-25 through --color-gray-950
--color-success-500, --color-error-500, --color-warning-500
```

## Using in Custom Components
```jsx
// Inline styles
<div style={{ color: 'var(--color-brand-500)', backgroundColor: 'var(--color-gray-50)' }}>

// Tailwind (requires @theme in CSS)
<div className="text-brand-500 bg-gray-50">
```

## Tailwind v4 Setup
Add to index.css:
```css
@import 'tailwindcss';

@theme {
  --color-brand-50: var(--color-brand-50, #EAE8FF);
  --color-brand-500: var(--color-brand-500, #5048ED);
  --color-gray-50: var(--color-gray-50, #F9FAFB);
  --color-gray-500: var(--color-gray-500, #667085);
}
```

Do NOT use tailwind.config.js - Tailwind v4 uses CSS-based config.

## Key Rules
- Only set base colors - the framework generates all shades
- Theme changes via App Panel don't need rebuilds
- All @zango-core components read from CSS variables
- Use var(--color-*) in custom components to stay theme-aware
