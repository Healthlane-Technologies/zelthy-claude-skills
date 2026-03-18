---
name: setup-navbar
description: "Customize Zango sidebar and topbar - custom logo, menu sections, bottom content, collapsible mode. Use when customizing navigation UI."
license: MIT
compatibility: Requires a Zango frontend app with @zango-core/crm-framework.
metadata:
  author: Healthlane Technologies
  version: "1.0"
allowed-tools: Read Write Bash(npm:*)
---

# Setup Navbar & Topbar

Customize the sidebar navigation and top bar in a Zango frontend application.

All configuration is done via props on `<ZangoApp>` in `src/App.tsx`.

## Quick Reference

```tsx
<ZangoApp
  appInitializerEndpoint="/appbuilder/initializer/"
  customPages={customPages}
  layoutConfig={{...}}    // Show/hide topbar & navbar, layout type
  navbarConfig={{...}}    // Sidebar: logo, menu, bottom, collapse
  topbarConfig={{...}}    // Top bar: profile, custom content
/>
```

## Navbar Configuration

### All navbarConfig Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showLogo` | `boolean` | `true` | Show/hide logo section |
| `showMenu` | `boolean` | `true` | Show/hide menu items |
| `isCollapsed` | `boolean` | `false` | Start in collapsed mode |
| `collapsible` | `boolean` | `false` | Allow user to toggle collapse |
| `customLogo` | `ReactNode` | -- | Replace default logo |
| `customMenu` | `ReactNode` | -- | Replace entire menu |
| `customMenuContent` | `ReactNode` | -- | Content appended below menu |
| `customBottomContent` | `ReactNode` | -- | Sticky bottom section |
| `customNavbar` | `ComponentType` | -- | Replace entire navbar component |
| `menuConfig` | `object` | -- | Menu display options |
| `className` | `string` | -- | CSS class for navbar container |
| `style` | `CSSProperties` | -- | Inline styles for navbar |

## Custom Logo

```jsx
const MyLogo = () => (
  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src="/logo.svg" width={28} height={28} />
    <span style={{ fontSize: 16, fontWeight: 700 }}>My App</span>
  </div>
);

<ZangoApp navbarConfig={{ customLogo: <MyLogo /> }} />
```

## Custom Menu with Section Headers (Kardigan Pattern)

This pattern creates a menu with uppercase section headers, active state highlighting, and the Kardigan design language used in production Zango apps.

```jsx
import { Link, useLocation } from 'react-router-dom';

const CustomMenu = () => {
  const location = useLocation();
  const isActive = (uri) =>
    location.pathname.replace(/\/$/, '') === uri.replace(/\/$/, '');

  const sectionHeaderStyle = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: '#98a2b3',
    padding: '6px 10px',
    marginTop: 12,
  };

  const menuItemStyle = (uri) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 10px',
    borderRadius: 6,
    backgroundColor: isActive(uri) ? '#EAE8FF' : 'transparent',
    color: isActive(uri) ? '#5048ED' : '#414651',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: isActive(uri) ? 600 : 500,
  });

  return (
    <div style={{ padding: '4px 8px' }}>
      <div style={sectionHeaderStyle}>OVERVIEW</div>
      <Link to="/app/dashboard" style={menuItemStyle('/app/dashboard')}>
        Dashboard
      </Link>

      <div style={sectionHeaderStyle}>MANAGEMENT</div>
      <Link to="/app/patients" style={menuItemStyle('/app/patients')}>
        Patients
      </Link>
      <Link to="/app/orders" style={menuItemStyle('/app/orders')}>
        Orders
      </Link>

      <div style={sectionHeaderStyle}>SETTINGS</div>
      <Link to="/app/settings" style={menuItemStyle('/app/settings')}>
        Configuration
      </Link>
    </div>
  );
};

<ZangoApp navbarConfig={{ customMenu: <CustomMenu /> }} />
```

Key Kardigan design tokens:
- Section headers: `10px`, `font-weight: 600`, `letter-spacing: 1.2px`, `uppercase`, color `#98a2b3`
- Menu items: `13px`, `font-weight: 500` (normal) / `600` (active)
- Active background: `#EAE8FF`, active text: `#5048ED`
- Item padding: `7px 10px`, border-radius: `6px`
- Container padding: `4px 8px`

## Custom Bottom Content

Pin content (like a profile card or version info) to the bottom of the sidebar:

```jsx
const ProfileCard = () => (
  <div style={{
    padding: '12px 16px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      backgroundColor: '#EAE8FF', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 600, color: '#5048ED',
    }}>
      JD
    </div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>John Doe</div>
      <div style={{ fontSize: 11, color: '#667085' }}>Admin</div>
    </div>
  </div>
);

<ZangoApp navbarConfig={{ customBottomContent: <ProfileCard /> }} />
```

## Collapsible Sidebar

```jsx
<ZangoApp navbarConfig={{ collapsible: true }} />
```

When `collapsible: true`, a toggle button appears. The sidebar collapses to icon-only mode.

To start collapsed:
```jsx
<ZangoApp navbarConfig={{ collapsible: true, isCollapsed: true }} />
```

## Topbar Configuration

### All topbarConfig Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showProfile` | `boolean` | `true` | Show profile dropdown |
| `showLeftSection` | `boolean` | `true` | Show left section |
| `showRightSection` | `boolean` | `true` | Show right section |
| `customLeftContent` | `ReactNode` | -- | Custom left content |
| `customRightContent` | `ReactNode` | -- | Custom right content (before profile) |
| `customProfileMenu` | `ReactNode` | -- | Replace profile dropdown |
| `customTopbar` | `ComponentType` | -- | Replace entire topbar |
| `className` | `string` | -- | CSS class for topbar |
| `style` | `CSSProperties` | -- | Inline styles for topbar |

## Hiding the Topbar

```jsx
<ZangoApp layoutConfig={{ showTopbar: false }} />
```

This is common for documentation sites and apps that use the sidebar for all navigation.

## Custom Topbar Content

```jsx
<ZangoApp topbarConfig={{
  customLeftContent: <Breadcrumbs />,
  customRightContent: <NotificationBell />,
}} />
```

## Layout Configuration

### All layoutConfig Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showTopbar` | `boolean` | `true` | Show/hide top navigation bar |
| `showNavbar` | `boolean` | `true` | Show/hide sidebar navigation |
| `layoutType` | `'wide' \| 'compact'` | `'wide'` | Layout mode |

## Replacing Entire Components

For full control, replace entire layout components:

```jsx
<ZangoApp
  navbarConfig={{ customNavbar: MyEntireNavbar }}
  topbarConfig={{ customTopbar: MyEntireTopbar }}
/>
```

Or via `customComponents`:
```jsx
<ZangoApp
  customComponents={{
    Layout: MyLayout,
    Topbar: MyTopbar,
    Navbar: MyNavbar,
  }}
/>
```

## Complete Example

```tsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

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
      customMenu: <CustomMenu />,
      customBottomContent: <ProfileCard />,
    }}
  />
);
```

## Accessing App Data in Navbar Components

Use `useAppContext` to access menu items, profile info, theme, etc.:

```jsx
import { useAppContext } from '@zango-core/crm-framework';

const MyNavbar = () => {
  const { menu, profileInfo, appLogo, appName, theme } = useAppContext();

  return (
    <nav>
      <img src={appLogo} alt={appName} />
      {menu.map(item => (
        <Link key={item.uri} to={item.uri}>{item.name}</Link>
      ))}
    </nav>
  );
};
```

For the complete props reference, see: [App Builder Reference](../zango-frontend/references/APPBUILDER-REFERENCE.md)
