# Navbar & Topbar
App Builder

Customize the sidebar navigation and top bar with custom components, logos, and menus.

**Sections:** Navbar Configuration | Custom Logo | Custom Menu | Custom Bottom Content | Collapsible Sidebar | Menu Item Format | Topbar Configuration | Hiding Topbar | Custom Topbar Content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showLogo` | boolean | true | Show/hide the logo section at the top of the sidebar. |
| `showMenu` | boolean | true | Show/hide the menu items in the sidebar. |
| `isCollapsed` | boolean | false | Start the sidebar in collapsed mode. |
| `collapsible` | boolean | false | Allow the user to toggle collapse with a button. |
| `customLogo` | ReactNode | - | Replace the default logo with a custom component. |
| `customMenu` | ReactNode | - | Replace the entire menu with a custom component. |
| `customMenuContent` | ReactNode | - | Content appended below the menu items. |
| `customBottomContent` | ReactNode | - | Sticky section pinned to the bottom of the sidebar. |
| `customNavbar` | React.ComponentType | - | Replace the entire navbar component. |
| `menuConfig` | object | - | Menu display options. |
| `className` | string | - | Additional CSS class for the navbar container. |
| `style` | CSSProperties | - | Custom inline styles for the navbar container. |
| `showProfile` | boolean | true | Show the profile section with dropdown menu. |
| `showLeftSection` | boolean | true | Show the left section of the topbar. |
| `showRightSection` | boolean | true | Show the right section of the topbar. |
| `customLeftContent` | ReactNode | - | Custom content rendered on the left side of the topbar. |
| `customRightContent` | ReactNode | - | Custom content rendered on the right side (before the profile section). |
| `customProfileMenu` | ReactNode | - | Replace the default profile dropdown content. |
| `customTopbar` | React.ComponentType | - | Replace the entire topbar component. |
| `className` | string | - | Additional CSS class for the topbar container. |
| `style` | CSSProperties | - | Custom inline styles for the topbar container. |

## Code-Backed Notes

- Default sidebar CSS currently sets a white background in AppBuilder layout styles; avoid custom text/icon colors that assume dark backgrounds.
- Keep menu text/icon colors aligned to theme variables (`--color-gray-*`, `--color-brand-*`) so active/hover states remain visible.
- Before finalizing style overrides, verify contrast for normal, hover, active, and collapsed-sidebar states.

## Code Examples

### custom-logo.jsx
```jsx
const MyLogo = () => (
  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src="/logo.svg" width={28} height={28} alt="Logo" />
  </div>
);
```

### custom-menu.jsx
```jsx
const CustomMenu = () => {
  const location = useLocation();
  const isActive = (uri) => location.pathname.replace(/\/$/, '') === uri.replace(/\/$/, '');

  return (
    <div style={{ padding: '4px 8px' }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#98a2b3', padding: '6px 10px' }}>
        SECTION HEADER
      </div>
      <Link to="/app/dashboard" style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
        borderRadius: 6, backgroundColor: isActive('/app/dashboard') ? '#EAE8FF' : 'transparent',
        color: isActive('/app/dashboard') ? '#5048ED' : '#414651',
        textDecoration: 'none', fontSize: 13, fontWeight: isActive('/app/dashboard') ? 600 : 500,
      }}>
        Dashboard
      </Link>
    </div>
  );
};

<ZangoApp navbarConfig={{ customMenu: <CustomMenu /> }} />
```

### custom-bottom-content.jsx
```jsx
<ZangoApp navbarConfig={{
  customBottomContent: <ProfileCard />
}} />
```

### collapsible-sidebar.jsx
```jsx
<ZangoApp navbarConfig={{ collapsible: true }} />
```

### hide-topbar.jsx
```jsx
<ZangoApp layoutConfig={{ showTopbar: false }} />
```

### custom-topbar-content.jsx
```jsx
<ZangoApp topbarConfig={{
  customLeftContent: <Breadcrumbs />
}} />
```
