# ZangoApp
App Builder

The root component that bootstraps your Zango frontend application.

**Sections:** Import | Props | Basic Usage | With Full Configuration | Accessing App Data | Layout Configuration | What ZangoApp Does

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appInitializerEndpoint` | string | /appbuilder/initializer/ | API endpoint for app initialization data. |
| `customPages` | object | - | Map of component names to React components for custom page routing. |
| `layoutConfig` | object | - | Layout configuration: { showTopbar: boolean (true), showNavbar: boolean (true), layoutType: \'wide\'|\'compact\' (\'wide\') } |
| `topbarConfig` | object | - | Topbar configuration: { showProfile, customLeftContent, customRightContent, customProfileMenu, customTopbar, profileMenuConfig, className, style } |
| `navbarConfig` | object | - | Navbar configuration: { showLogo, showMenu, isCollapsed, collapsible, customLogo, customMenuContent, customBottomContent, customNavbar, customMenu, menuConfig, className, style } |
| `authConfig` | object | - | Authentication configuration: { customComponents, theme, card, logo, login, roleSelection, twoFactor, resetPassword, providers, messages } |
| `config` | object | - | General app configuration. |
| `customComponents` | object | - | Custom component overrides: { Layout, Topbar, Navbar } |
| `showTopbar` | boolean | true | Show/hide the top navigation bar. |
| `showNavbar` | boolean | true | Show/hide the sidebar navigation. |

## Code Examples

### import.jsx
```jsx
import { ZangoApp } from '@zango-core/crm-framework';
```

### basic-usage.jsx
```jsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
  />
);
```

### full-config.jsx
```jsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';
import CustomLogin from './custom/pages/CustomLogin';
import DocsNavbar from './custom/components/DocsNavbar';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
    layoutConfig={{
      showTopbar: false,
      showNavbar: true,
      layoutType: 'wide',
    }}
    navbarConfig={{
      collapsible: true,
      customLogo: <MyLogo />,
    }}
    authConfig={{
      customComponents: { LoginPage: CustomLogin },
    }}
  />
);
```

### use-app-context.jsx
```jsx
import { useAppContext } from '@zango-core/crm-framework';

const MyComponent = () => {
  const {
    appData,      // Raw initializer response
    menu,         // Navigation menu items
    routes,       // Application routes
    profileInfo,  // Current user profile
    appLogo,      // App logo URL
    appName,      // Application name
    theme,        // Theme colors & typography
  } = useAppContext();

  return <div>Hello {profileInfo?.name}</div>;
};
```
