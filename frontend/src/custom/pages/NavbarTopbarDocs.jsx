import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const NavbarTopbarDocs = () => {
  return (
    <DocPage
      title="Navbar & Topbar"
      category="appbuilder"
      subtitle="Customize the sidebar navigation and top bar with custom components, logos, and menus."
      badge="App Builder"
    >
      <Section title="Navbar Configuration">
        <p className="mb-4">
          The <InlineCode>navbarConfig</InlineCode> prop on <InlineCode>ZangoApp</InlineCode> controls
          the sidebar navigation. All options are optional with sensible defaults.
        </p>
        <PropsTable
          props={[
            { name: 'showLogo', type: 'boolean', default: true, description: 'Show/hide the logo section at the top of the sidebar.' },
            { name: 'showMenu', type: 'boolean', default: true, description: 'Show/hide the menu items in the sidebar.' },
            { name: 'isCollapsed', type: 'boolean', default: false, description: 'Start the sidebar in collapsed mode.' },
            { name: 'collapsible', type: 'boolean', default: false, description: 'Allow the user to toggle collapse with a button.' },
            { name: 'customLogo', type: 'ReactNode', description: 'Replace the default logo with a custom component.' },
            { name: 'customMenu', type: 'ReactNode', description: 'Replace the entire menu with a custom component.' },
            { name: 'customMenuContent', type: 'ReactNode', description: 'Content appended below the menu items.' },
            { name: 'customBottomContent', type: 'ReactNode', description: 'Sticky section pinned to the bottom of the sidebar.' },
            { name: 'customNavbar', type: 'React.ComponentType', description: 'Replace the entire navbar component.' },
            { name: 'menuConfig', type: 'object', description: 'Menu display options.' },
            { name: 'className', type: 'string', description: 'Additional CSS class for the navbar container.' },
            { name: 'style', type: 'CSSProperties', description: 'Custom inline styles for the navbar container.' },
          ]}
        />
      </Section>

      <Section title="Custom Logo">
        <p className="mb-4">
          Replace the default logo with your own branding using <InlineCode>customLogo</InlineCode>.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-logo.jsx"
          code={`const MyLogo = () => (
  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src="/logo.svg" width={28} height={28} />
    <span style={{ fontSize: 16, fontWeight: 700 }}>My App</span>
  </div>
);

<ZangoApp navbarConfig={{ customLogo: <MyLogo /> }} />`}
        />
      </Section>

      <Section title="Custom Menu">
        <p className="mb-4">
          Replace the default menu entirely with <InlineCode>customMenu</InlineCode>. This is useful
          when you need section headers, custom groupings, or a completely different navigation pattern.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-menu.jsx"
          code={`const CustomMenu = () => {
  const location = useLocation();
  const isActive = (uri) => location.pathname.replace(/\\/$/, '') === uri.replace(/\\/$/, '');

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

<ZangoApp navbarConfig={{ customMenu: <CustomMenu /> }} />`}
        />
      </Section>

      <Section title="Custom Bottom Content">
        <p className="mb-4">
          Use <InlineCode>customBottomContent</InlineCode> to pin content at the bottom of the sidebar.
          This is ideal for profile cards, settings links, or help sections. The bottom content is
          pinned via <InlineCode>marginTop: auto</InlineCode>.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-bottom-content.jsx"
          code={`<ZangoApp navbarConfig={{
  customBottomContent: <ProfileCard />,
}} />`}
        />
      </Section>

      <Section title="Collapsible Sidebar">
        <p className="mb-4">
          Enable <InlineCode>collapsible</InlineCode> to add a toggle button that lets users collapse
          and expand the sidebar. When collapsed, the sidebar shows only icons (80px width). When
          expanded, it returns to its full width (244px).
        </p>
        <CodeBlock
          language="jsx"
          title="collapsible-sidebar.jsx"
          code={`<ZangoApp navbarConfig={{ collapsible: true }} />`}
        />
        <Callout type="info" title="Initial State">
          Combine with <InlineCode>isCollapsed: true</InlineCode> to start the sidebar in collapsed
          mode: <InlineCode>{'navbarConfig={{ collapsible: true, isCollapsed: true }}'}</InlineCode>
        </Callout>
      </Section>

      <Section title="Menu Item Format">
        <p className="mb-4">
          Menu items support multiple icon formats. The framework detects the icon type automatically:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <strong>SVG string</strong> (contains <InlineCode>{'<svg'}</InlineCode>) — rendered via{' '}
            <InlineCode>dangerouslySetInnerHTML</InlineCode>
          </li>
          <li>
            <strong>Emoji or short text</strong> (length {'<='} 4) — rendered as text directly
          </li>
          <li>
            <strong>Image URL</strong> — rendered as an <InlineCode>{'<img>'}</InlineCode> tag
          </li>
          <li>
            <strong>No icon</strong> — a default sparkle SVG is shown
          </li>
        </ul>
      </Section>

      <Section title="Topbar Configuration">
        <p className="mb-4">
          The <InlineCode>topbarConfig</InlineCode> prop on <InlineCode>ZangoApp</InlineCode> controls
          the top bar. All options are optional.
        </p>
        <PropsTable
          props={[
            { name: 'showProfile', type: 'boolean', default: true, description: 'Show the profile section with dropdown menu.' },
            { name: 'showLeftSection', type: 'boolean', default: true, description: 'Show the left section of the topbar.' },
            { name: 'showRightSection', type: 'boolean', default: true, description: 'Show the right section of the topbar.' },
            { name: 'customLeftContent', type: 'ReactNode', description: 'Custom content rendered on the left side of the topbar.' },
            { name: 'customRightContent', type: 'ReactNode', description: 'Custom content rendered on the right side (before the profile section).' },
            { name: 'customProfileMenu', type: 'ReactNode', description: 'Replace the default profile dropdown content.' },
            { name: 'customTopbar', type: 'React.ComponentType', description: 'Replace the entire topbar component.' },
            { name: 'className', type: 'string', description: 'Additional CSS class for the topbar container.' },
            { name: 'style', type: 'CSSProperties', description: 'Custom inline styles for the topbar container.' },
          ]}
        />
      </Section>

      <Section title="Hiding Topbar">
        <p className="mb-4">
          To completely hide the topbar, use <InlineCode>layoutConfig</InlineCode> instead of{' '}
          <InlineCode>topbarConfig</InlineCode>:
        </p>
        <CodeBlock
          language="jsx"
          title="hide-topbar.jsx"
          code={`<ZangoApp layoutConfig={{ showTopbar: false }} />`}
        />
      </Section>

      <Section title="Custom Topbar Content">
        <p className="mb-4">
          Add custom content to the left and right sections of the topbar while keeping the default
          layout structure intact.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-topbar-content.jsx"
          code={`<ZangoApp topbarConfig={{
  customLeftContent: <Breadcrumbs />,
  customRightContent: <NotificationBell />,
}} />`}
        />
      </Section>
    </DocPage>
  );
};

export default NavbarTopbarDocs;
