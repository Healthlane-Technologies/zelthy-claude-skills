# Project Structure
Getting Started

Understanding the file structure of a Zango frontend app.

**Sections:** Directory Overview | Key Files Explained | Where to Add Code | App.tsx Deep Dive

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `New pages` | string | - | src/custom/pages/YourPage.jsx + export in index.js |
| `Custom components` | string | - | src/custom/components/ |
| `Custom hooks` | string | - | src/custom/hooks/ |
| `Constants / config` | string | - | src/custom/constants/ |
| `Utilities` | string | - | src/custom/utils/ |
| `Assets (images/fonts)` | string | - | src/assets/ |

## Code Examples

### my-app/
```bash
my-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── custom/
│   │   └── pages/              # Your custom pages go here
│   │       ├── Dashboard.jsx
│   │       └── index.js        # Export all custom pages
│   ├── App.tsx                  # Main app - ZangoApp configuration
│   ├── index.tsx                # Dev entry point
│   ├── index.zango.tsx          # Zango platform entry point
│   └── index.css                # Global styles + Tailwind
├── .env                         # Environment config (create from .env.example)
├── .env.example                 # Environment template
├── index.html                   # HTML template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts               # Dev/production build config
└── vite.config.zango.ts         # Zango single-file build config
```

### src/App.tsx
```tsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

const App = () => {
  return (
    <ZangoApp
      appInitializerEndpoint="/appbuilder/initializer/"
      customPages={customPages}
```

