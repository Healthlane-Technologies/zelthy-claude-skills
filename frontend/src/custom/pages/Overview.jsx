import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table2, Paintbrush, Eye, GitBranch, FileText, Layers,
  Zap, Play, ArrowRight, Code2, Component, Workflow,
  Box, Plug, RefreshCw, Settings
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, path }) => (
  <Link to={path} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
    <div style={{
      padding: '16px 18px', borderRadius: 10, border: '1px solid #e5e7eb',
      backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.2s',
      display: 'flex', alignItems: 'flex-start', gap: 14, height: '100%', boxSizing: 'border-box',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: 'linear-gradient(135deg, #EAE8FF 0%, #f0efff 100%)',
        border: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} style={{ color: '#5048ED' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{description}</div>
      </div>
      <ArrowRight size={14} style={{ color: '#d1d5db', marginTop: 2, flexShrink: 0 }} />
    </div>
  </Link>
);

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 600, color: '#98a2b3', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 10 }}>
    {children}
  </div>
);

const Overview = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div style={{ padding: '32px 40px 48px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #5048ED 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Table2 size={16} style={{ color: '#fff' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Zango CRUD</div>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#5048ED', backgroundColor: '#EAE8FF', padding: '2px 8px', borderRadius: 20 }}>Composable Architecture</span>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
            Build custom CRUD interfaces with composable components. Use as-is, customize via props, or replace entirely -while keeping state perfectly synchronized.
          </p>
        </div>

        {/* Architecture cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 32 }}>
          {[
            { icon: Box, label: 'CrudHandler', desc: 'Orchestrator with pluggable slots', color: '#5048ED', bg: '#EAE8FF' },
            { icon: Component, label: 'Components', desc: '12+ composable UI pieces', color: '#7c3aed', bg: '#f3f0ff' },
            { icon: RefreshCw, label: 'Workflows', desc: 'Status transitions & tags', color: '#0ea5e9', bg: '#e0f2fe' },
            { icon: FileText, label: 'Forms', desc: 'Server-driven & local RJSF', color: '#12B76A', bg: '#ecfdf5' },
          ].map((item) => (
            <div key={item.label} style={{
              padding: '14px 16px', borderRadius: 10,
              backgroundColor: item.bg, border: `1px solid ${item.color}20`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, backgroundColor: '#fff', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}>
                <item.icon size={15} style={{ color: item.color }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{
          padding: '24px 28px', borderRadius: 12, marginBottom: 48,
          backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 14 }}>How it works</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: Plug, title: 'Plug & Play', desc: 'Drop CrudHandler with an API endpoint. Table, header, search, filters, pagination -all work out of the box.' },
              { icon: Settings, title: 'Customize', desc: 'Override any section with custom components via props. Use hooks like useTable() for full state access.' },
              { icon: Layers, title: 'Compose', desc: 'Mix default and custom components. Combine CrudHandler with WorkflowStatus, FormRenderer, and more.' },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  backgroundColor: '#fff', border: '1px solid #e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <item.icon size={14} style={{ color: '#5048ED' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core */}
        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Core</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FeatureCard icon={Table2} title="CrudHandler" description="Main orchestrator. Table, header, utilities, pagination, detail views -fully customizable." path="/app/crud-handler" />
            <FeatureCard icon={Paintbrush} title="Table Styling" description="CSS classes and dynamic style functions. Professional, dark, gradient themes." path="/app/table-styling" />
            <FeatureCard icon={Code2} title="useTable Hook" description="Shared table context -data, pagination, search, selection, all synchronized." path="/app/use-table" />
            <FeatureCard icon={Eye} title="Detail Views" description="Drawer and route-based detail views with automatic data fetching." path="/app/detail-views" />
          </div>
        </div>

        {/* Components */}
        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Components</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { icon: Component, title: 'TableBody', desc: 'Data display with virtualization', path: '/app/table-body' },
              { icon: Component, title: 'TableHeader', desc: 'Title, count, add button, actions', path: '/app/table-header' },
              { icon: Component, title: 'TableUtilities', desc: 'Search, filters, upload, download', path: '/app/table-utilities' },
              { icon: Component, title: 'TablePagination', desc: 'Page navigation, rows-per-page', path: '/app/table-pagination' },
              { icon: Component, title: 'TableSearch', desc: 'Standalone search, synced', path: '/app/table-search' },
              { icon: Component, title: 'TableAddButton', desc: 'Add button with form drawer', path: '/app/table-add-button' },
            ].map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.desc} path={item.path} />
            ))}
          </div>
        </div>

        {/* Workflow & Forms */}
        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Workflow & Forms</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FeatureCard icon={GitBranch} title="Workflow Components" description="WorkflowStatus, WorkflowTags -lifecycle callbacks, custom rendering." path="/app/workflow-status" />
            <FeatureCard icon={Workflow} title="Hooks Reference" description="12 hooks: useTable, useWorkflow, useDetailView, useTableFilters, and more." path="/app/workflow-hooks" />
            <FeatureCard icon={FileText} title="FormRenderer" description="Server-driven or local RJSF. Multi-step, sync, autocomplete, portal submit." path="/app/form-renderer" />
            <FeatureCard icon={Layers} title="Render Props" description="Custom action, status, and tag column rendering with full state." path="/app/render-props" />
          </div>
        </div>

        {/* Advanced & Playground */}
        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Explore</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <FeatureCard icon={Zap} title="Advanced" description="onFormCancel, portal rendering, error handling, migration." path="/app/advanced" />
            <FeatureCard icon={Play} title="CrudHandler Playground" description="Toggle props, recipes, themes, edit API data -all live." path="/app/playground" />
            <FeatureCard icon={Play} title="Form Playground" description="Visual form builder with 15 field types and live preview." path="/app/playground-form" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;
