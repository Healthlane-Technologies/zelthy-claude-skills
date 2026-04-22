# Quick Start
Getting Started

Create and launch a new Zango frontend app in minutes.

**Sections:** Create Your App | Configure Environment | Start Development | Create Your First Custom Page | Add CRUD Page | Build for Production | Available Scripts

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `--verbose` | boolean | - | Print additional logs during scaffolding. |
| `--use-pnpm` | boolean | - | Use pnpm as the package manager. |
| `--skip-install` | boolean | - | Skip installing dependencies after project creation. |
| `VITE_API_BASE_URL` | string | http://localhost:8000 | Backend API URL. In dev, the Vite dev server proxies requests here. |
| `VITE_PROXY_ROUTES` | string | /api | Comma-separated routes to proxy to backend. MUST include ALL backend routes your app uses (app initializer, CRUD endpoints, workflow, etc.). |
| `VITE_APP_ENV` | string | development | Environment flag (development / staging / production). |
| `npm run dev` | string | - | Start development server on port 3000 with hot reload and backend proxying. |
| `npm run build` | string | - | Production build to dist/ directory. |
| `npm run build:zango` | string | - | Single-file build for Zango platform deployment (IIFE format). |
| `npm run preview` | string | - | Preview the production build locally. |

## Code Examples

### terminal
```bash
npx @zango-core/create-zango-app my-app
```

### npm
```bash
npm init @zango-core/zango-app my-app
```

### yarn
```bash
yarn create @zango-core/zango-app my-app
```

### pnpm
```bash
pnpm create @zango-core/zango-app my-app
```

### terminal
```bash
cd my-appncp .env.example .env
```

### terminal
```bash
npm run dev
```

### src/custom/pages/Dashboard.jsx
```jsx
const Dashboard = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard</h1>
      <p>Welcome to my app!</p>
    </div>
  );
};

export default Dashboard;
```

### src/custom/pages/index.js
```jsx
export { default as Dashboard } from './Dashboard';
```

### backend-route-config.json
```json
{
  "path": "/app/patients",
  "page_type": "crud",
  "entity": "Patient"
}
```

### terminal
```bash
npm run build          # Standard build to dist/
npm run build:zango    # Single-file build for Zango platform
```

