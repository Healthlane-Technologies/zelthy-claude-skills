---
description: "Customize the Zango sidebar - custom logo, menu, bottom content, collapsible, topbar"
---

# Setup Navbar & Topbar

Read the reference:
**Read:** `@ZANGO-SKILL-REFERENCE.md`

## Task
Customize the sidebar navigation and/or top bar based on user requirements.

## Ask the user:
1. Do you want a custom logo?
2. Do you want custom menu with section headers (like Kardigan pattern)?
3. Do you want a collapsible sidebar?
4. Do you want custom bottom content (profile card, version info)?
5. Do you want to customize the topbar?
6. Do you want to hide the topbar entirely?

## Generate Code

### Custom Logo
```jsx
const MyLogo = () => (
  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src="/logo.svg" width={28} height={28} alt="Logo" />
    <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>App Name</span>
  </div>
);
```

### Custom Menu with Section Headers
```jsx
import { useLocation, Link } from 'react-router-dom';

const CustomMenu = () => {
  const location = useLocation();
  const isActive = (uri) => location.pathname.replace(/\/$/, '') === uri.replace(/\/$/, '');

  const sections = [
    { label: 'SECTION', items: [{ name: 'Page', uri: '/app/page' }] },
  ];

  return (
    <div style={{ padding: '4px 8px' }}>
      {sections.map((section, i) => (
        <div key={i} style={{ marginTop: section.label ? 12 : 0 }}>
          {section.label && (
            <div style={{ padding: '6px 10px 4px', fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#98a2b3' }}>
              {section.label}
            </div>
          )}
          {section.items.map((item) => (
            <Link key={item.uri} to={item.uri} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, margin: '1px 0',
              textDecoration: 'none', fontSize: 13, fontWeight: isActive(item.uri) ? 600 : 500,
              backgroundColor: isActive(item.uri) ? 'var(--color-brand-50)' : 'transparent',
              color: isActive(item.uri) ? 'var(--color-brand-500)' : 'var(--color-gray-700)',
            }}>
              {item.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};
```

### Wire it up in App.tsx
```jsx
<ZangoApp
  navbarConfig={{
    customLogo: <MyLogo />,
    customMenu: <CustomMenu />,
    collapsible: true,
    customBottomContent: <ProfileCard />,
  }}
  layoutConfig={{
    showTopbar: false,  // hide topbar if needed
  }}
/>
```

## Key Rules
- `customMenu` replaces the ENTIRE default menu - you handle all items and active states
- `customBottomContent` is pinned to sidebar bottom via marginTop: auto
- `collapsible: true` adds a toggle button (80px collapsed, 244px expanded)
- Menu item icons: inline SVG strings, emojis, or image URLs
- Use `useLocation()` from react-router-dom for active state detection
- Sidebar width: 244px expanded, 80px collapsed
