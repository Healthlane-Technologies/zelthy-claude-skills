# Zango App Builder Reference


## Quick Start
```bash
npx @zango-core/create-zango-app my-app
cd my-app
cp .env.example .env
npm run dev
```

## Key Imports
```js
import { ZangoApp, useAppContext } from '@zango-core/crm-framework';
import { CrudHandler } from '@zango-core/crud/table';
import { FormRenderer } from '@zango-core/crud/form';
```

## Backend Models
```python
from packages.appbuilder.backend.configure.models import AppRoutesModel, AppMenuModel
from zango.apps.appauth.models import UserRoleModel
```

---

## Components & Hooks

| Name | Type | Description | Reference |
|------|------|-------------|----------|
| App Initializer | App Builder | The backend API that configures your entire frontend - routes, menu, theme, and user profile. | [App-Initializer.md](App-Initializer.md) |
| Authentication | App Builder | Complete authentication system with password, OTP, OAuth, 2FA, role selection, and full customization. | [Authentication.md](Authentication.md) |
| Quick Start | Getting Started | Create and launch a new Zango frontend app in minutes. | [Quick-Start.md](Quick-Start.md) |
| Navbar & Topbar | App Builder | Customize the sidebar navigation and top bar with custom components, logos, and menus. | [Navbar-&-Topbar.md](Navbar-&-Topbar.md) |
| Project Structure | Getting Started | Understanding the file structure of a Zango frontend app. | [Project-Structure.md](Project-Structure.md) |
| Routing & Pages | App Builder | How routes, page types, and custom pages work together in Zango. | [Routing-&-Pages.md](Routing-&-Pages.md) |
| Theme & Build | App Builder | Configure colors, typography, and build your app for development and production deployment. | [Theme-&-Build.md](Theme-&-Build.md) |
| ZangoApp | App Builder | The root component that bootstraps your Zango frontend application. | [ZangoApp.md](ZangoApp.md) |

