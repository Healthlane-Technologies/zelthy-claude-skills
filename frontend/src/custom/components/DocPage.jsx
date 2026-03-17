import React, { useState, useEffect, useRef } from 'react';

const DocPage = ({ title, subtitle, badge, children }) => {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const contentRef = useRef(null);

  // Extract section titles from children for the right-side nav
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = contentRef.current.querySelectorAll('section[id]');
    const items = Array.from(headings).map((el) => ({
      id: el.id,
      title: el.getAttribute('data-title') || el.id,
    }));
    setSections(items);
  }, [children]);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    const el = contentRef.current;
    if (!el) return;
    el.querySelectorAll('section[id]').forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [children]);

  return (
    <div className="min-h-screen bg-white" style={{ display: 'flex' }}>
      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, padding: '40px 48px', overflowY: 'auto' }}>
        {/* Page header */}
        <div style={{ marginBottom: '40px' }}>
          {badge && (
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#4f46e5',
                backgroundColor: '#eef2ff',
                border: '1px solid #e0e7ff',
                padding: '4px 10px',
                borderRadius: '20px',
                marginBottom: '12px',
              }}
            >
              {badge}
            </span>
          )}
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ marginTop: '12px', fontSize: '16px', color: '#6b7280', lineHeight: 1.6, maxWidth: '640px' }}>
              {subtitle}
            </p>
          )}
          <div style={{
            marginTop: '24px',
            height: '1px',
            background: 'linear-gradient(to right, #c7d2fe, #e9d5ff, transparent)',
          }} />
        </div>

        {/* Content */}
        <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {children}
        </div>
      </div>

      {/* Right-side sub-navigation */}
      {sections.length > 0 && (
        <div
          style={{
            width: '200px',
            flexShrink: 0,
            padding: '40px 16px 40px 0',
            position: 'sticky',
            top: 0,
            height: 'fit-content',
            maxHeight: '100vh',
            overflowY: 'auto',
          }}
        >
          <div style={{
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#9ca3af',
            padding: '0 12px',
            marginBottom: '8px',
          }}>
            On this page
          </div>
          <nav>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  display: 'block',
                  fontSize: '12px',
                  lineHeight: '20px',
                  padding: '4px 12px',
                  borderLeft: `2px solid ${activeSection === s.id ? '#6366f1' : 'transparent'}`,
                  color: activeSection === s.id ? '#4f46e5' : '#6b7280',
                  fontWeight: activeSection === s.id ? 500 : 400,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, id, children }) => {
  const sectionId = id || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined);

  return (
    <section id={sectionId} data-title={title} className="doc-section scroll-mt-20">
      {title && (
        <h2 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#111827',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ width: '3px', height: '22px', backgroundColor: '#6366f1', borderRadius: '2px' }} />
          {title}
        </h2>
      )}
      <div style={{ color: '#4b5563', lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  );
};

const Callout = ({ type = 'info', title, children }) => {
  const styles = {
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
    tip: { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' },
    important: { bg: '#f5f3ff', border: '#ddd6fe', text: '#5b21b6' },
  };
  const s = styles[type] || styles.info;

  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      border: `1px solid ${s.border}`,
      backgroundColor: s.bg,
      color: s.text,
      margin: '16px 0',
    }}>
      {title && <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{title}</p>}
      <div style={{ fontSize: '13px', lineHeight: 1.6, opacity: 0.9 }}>{children}</div>
    </div>
  );
};

const InlineCode = ({ children }) => (
  <code style={{
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    backgroundColor: '#f3f4f6',
    color: '#4338ca',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
  }}>
    {children}
  </code>
);

DocPage.Section = Section;
DocPage.Callout = Callout;
DocPage.InlineCode = InlineCode;

export default DocPage;
