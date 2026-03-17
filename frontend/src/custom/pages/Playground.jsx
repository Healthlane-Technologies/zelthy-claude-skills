import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CrudHandler, useTable, TableBody } from '@zango-core/crud/table';
import { useNavigate } from 'react-router-dom';
import { FormRenderer } from '@zango-core/crud/form';
import CodeBlock from '../components/CodeBlock';

// ─── Shared UI ───
const Toggle = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
    <div onClick={() => onChange(!checked)}
      style={{ width: 32, height: 18, borderRadius: 9, backgroundColor: checked ? '#5048ED' : '#d1d5db', position: 'relative', transition: 'background-color 0.2s', cursor: 'pointer', flexShrink: 0 }}>
      <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff', position: 'absolute', top: 2, left: checked ? 16 : 2, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </div>
    <span style={{ color: '#374151', fontWeight: 500 }}>{label}</span>
  </label>
);

const Select = ({ label, value, onChange, options }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
    <span style={{ color: '#374151', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ padding: '3px 6px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 12, backgroundColor: '#fff', color: '#374151', outline: 'none' }}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </label>
);

const Panel = ({ title, children, actions, style = {} }) => (
  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', ...style }}>
    <div style={{ padding: '8px 14px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>{title}</span>
      {actions}
    </div>
    <div style={{ padding: 12 }}>{children}</div>
  </div>
);

const TabBtn = ({ active, label, onClick }) => (
  <button onClick={onClick}
    style={{ padding: '6px 14px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: active ? 600 : 400, color: active ? '#5048ED' : '#6b7280', backgroundColor: active ? '#EAE8FF' : 'transparent', borderRadius: 6, transition: 'all 0.15s', fontFamily: 'inherit' }}>
    {label}
  </button>
);

const ApplyBtn = ({ onClick }) => (
  <button onClick={onClick}
    style={{ padding: '2px 12px', borderRadius: 4, border: 'none', fontSize: 11, cursor: 'pointer', backgroundColor: '#5048ED', color: '#fff', fontWeight: 600, fontFamily: 'inherit' }}>
    Apply & Refresh
  </button>
);

const CodeEditor = ({ value, onChange, minHeight = 200 }) => (
  <textarea value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false}
    style={{ width: '100%', minHeight, padding: 12, borderRadius: 8, border: '1px solid #1e293b', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.6, backgroundColor: '#0f172a', color: '#e2e8f0', resize: 'vertical', outline: 'none', boxSizing: 'border-box', tabSize: 2 }}
  />
);

const RecipePill = ({ active, label, onClick }) => (
  <button onClick={onClick} style={{
    padding: '7px 16px', border: 'none', cursor: 'pointer', fontSize: 12,
    fontWeight: active ? 600 : 400, color: active ? '#fff' : '#6b7280',
    backgroundColor: active ? '#5048ED' : 'transparent',
    borderRadius: 8, transition: 'all 0.2s', fontFamily: 'inherit',
    boxShadow: active ? '0 2px 8px rgba(80, 72, 237, 0.3)' : 'none',
  }}>
    {label}
  </button>
);

// ─── Default data ───
const DEFAULT_METADATA = {
  columns: [
    { name: 'name', display_name: 'Name', type: 'string', sortable: true, filterable: true },
    { name: 'email', display_name: 'Email', type: 'string', sortable: true, filterable: true },
    { name: 'role', display_name: 'Role', type: 'string', sortable: true, filterable: true },
    { name: 'workflow_status', display_name: 'Status', type: 'StatusCol', sortable: true, filterable: true },
    { name: 'created', display_name: 'Created', type: 'string', sortable: true, filterable: false },
    { name: 'row_actions', display_name: 'Actions', type: 'ActionsCol', sortable: false, filterable: false },
  ],
  filters: [
    { id: 'role', name: 'Role', type: 'select', options: [{ value: 'Admin', label: 'Admin' }, { value: 'Editor', label: 'Editor' }, { value: 'Viewer', label: 'Viewer' }] },
    { id: 'status', name: 'Status', type: 'select', options: [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }, { value: 'Pending', label: 'Pending' }] },
  ],
  page_title: 'Demo Table',
  actions: [{ name: 'Edit', key: 'edit', type: 'simple' }, { name: 'Delete', key: 'delete', type: 'danger' }],
  has_add_perm: true,
  has_upload_perm: false,
  has_download_perm: true,
  utilities_config: {
    show_search: true,
    show_filters_button: true,
    show_column_options: true,
  },
  form_config: {
    drawer_size: 'md',
    show_confirm_alert: false,
  },
};

const DEFAULT_ROWS = (() => {
  const names = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eva Martinez', 'Frank Garcia', 'Grace Lee', 'Henry Wilson', 'Iris Taylor', 'Jack Anderson'];
  const roles = ['Admin', 'Editor', 'Viewer'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  return names.map((name, i) => ({
    id: i + 1, object_uuid: `uuid-${String(i + 1).padStart(4, '0')}`, name,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    role: roles[i % roles.length],
    workflow_status: { status_label: statuses[i % statuses.length], status_color: statuses[i % statuses.length] === 'Active' ? '#12B76A' : statuses[i % statuses.length] === 'Inactive' ? '#F04438' : '#F79009' },
    created: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    row_actions: [{ name: 'Edit', key: 'edit', type: 'form' }, { name: 'Delete', key: 'delete', type: 'simple', confirmation_message: 'Are you sure you want to delete this item? This action cannot be undone.' }],
  }));
})();

const DEFAULT_DETAIL_VIEW = {
  pk: 1,
  object_uuid: 'uuid-0001',
  title: 'Alice Johnson',
  general_details: {
    fields: {
      name: { name: 'name', display_name: 'Name', type: 'string', value: 'Alice Johnson' },
      email: { name: 'email', display_name: 'Email', type: 'email', value: 'alice.johnson@example.com' },
      role: { name: 'role', display_name: 'Role', type: 'string', value: 'Admin' },
      created: { name: 'created', display_name: 'Created', type: 'date', value: '2024-01-01' },
    },
  },
  workflow_details: {
    current_status: 'active',
    current_status_meta: {
      name: 'current', from: 'pending', to: 'active',
      status_label: 'Active', status_color: '#12B76A',
      is_form_based: false, is_manual: true,
    },
    next_transitions: [
      { name: 'approve', display_name: 'Approve', from: 'active', to: 'approved', status_label: 'Approved', status_color: '#2196F3', is_form_based: false, is_manual: true, to_state_meta: { status_label: 'Approved', status_color: '#2196F3' } },
      { name: 'reject', display_name: 'Reject', from: 'active', to: 'inactive', status_label: 'Rejected', status_color: '#F04438', is_form_based: true, is_manual: true, to_state_meta: { status_label: 'Rejected', status_color: '#F04438' } },
    ],
    tag_details: [
      { name: 'priority', state: 'enabled', tag_label: 'Priority', enable: { confirmation_message: false, is_form_based: false }, disable: { confirmation_message: false, is_form_based: false }, is_enable_allowed: true, is_disable_allowed: true },
      { name: 'reviewed', state: 'disabled', tag_label: 'Reviewed', enable: { confirmation_message: false, is_form_based: false }, disable: { confirmation_message: false, is_form_based: false }, is_enable_allowed: true, is_disable_allowed: true },
    ],
  },
  row_actions: [
    { name: 'Edit', key: 'edit', type: 'form', description: 'Edit this record' },
    { name: 'Delete', key: 'delete', type: 'simple', description: 'Delete this record', confirmation_message: 'Are you sure you want to delete this item? This action cannot be undone.' },
  ],
  sections: [
    { key: 'overview', name: 'overview', title: 'Overview', data: { Name: 'Alice Johnson', Email: 'alice.johnson@example.com', Role: 'Admin' } },
    { key: 'activity', name: 'activity', title: 'Activity', data: { Status: 'Active', Created: '2024-01-01' } },
  ],
};

const DEFAULT_FORM_SCHEMA = {
  is_multistep: false,
  form: {
    json_schema: {
      type: 'object', title: 'Demo Form', required: ['name', 'email'],
      properties: {
        name: { type: 'string', title: 'Name' },
        email: { type: 'string', title: 'Email', format: 'email' },
        role: { type: 'string', title: 'Role', enum: ['Admin', 'Editor', 'Viewer'] },
        active: { type: 'boolean', title: 'Active', default: true },
      },
    },
    ui_schema: {
      role: { 'ui:widget': 'select' },
      'ui:order': ['name', 'email', 'role', 'active'],
    },
    form_data: {},
  },
};

// ─── Preset themes ───
const themes = {
  none: { label: 'Default', customClass: {} },
  professional: { label: 'Professional', customClass: { container: 'bg-white border border-gray-200 rounded-lg shadow-sm', headerCell: 'bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200', bodyRow: 'hover:bg-gray-25 border-b border-gray-100' } },
  dark: { label: 'Dark', customClass: { container: '!bg-gray-900', headerCell: '!bg-gray-800 !text-gray-200 !border-gray-700 !font-semibold', bodyRow: '!bg-gray-900 hover:!bg-gray-800 !border-gray-700', bodyCell: '!text-gray-200 !border-gray-700', utilitiesContainer: '!bg-gray-800 !border-gray-700', searchInput: '!bg-gray-700 !text-gray-200 !border-gray-600', paginationContainer: '!bg-gray-800 !border-gray-700' } },
  gradient: { label: 'Gradient', customClass: { container: 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50', tableWrapper: 'bg-white/80 backdrop-blur-sm shadow-xl rounded-lg', headerCell: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white' } },
  borderless: { label: 'Borderless', customClass: { table: 'border-0', headerRow: 'border-0', headerCell: 'border-0 bg-gray-50 text-gray-700', bodyRow: 'border-0 hover:bg-gray-25', bodyCell: 'border-0 py-4', utilitiesContainer: 'border-0 bg-transparent', paginationContainer: 'border-0 bg-transparent' } },
};

const allClassElements = ['container', 'tableWrapper', 'table', 'headerRow', 'headerCell', 'bodyRow', 'bodyCell', 'utilitiesContainer', 'searchInput', 'paginationContainer', 'filterButton', 'filterSidebar', 'statusBadge', 'actionButton'];

// ─── Recipe Components ───

// Recipe 1: Card Grid View
const CardGridBody = () => {
  const { data, isLoading, handleRowClick } = useTable();

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}><div style={{ fontSize: 14 }}>Loading...</div></div>;
  }
  if (!data || data.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}><div style={{ fontSize: 14 }}>No records found</div></div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: 16 }}>
      {data.map((row, idx) => {
        const status = row.workflow_status || {};
        return (
          <div key={row.id || idx} onClick={() => handleRowClick && handleRowClick(row)}
            style={{ padding: 20, borderRadius: 12, border: '1px solid #e5e7eb', backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(80, 72, 237, 0.12)'; e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#EAE8FF', color: '#5048ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>
                {(row.name || '?')[0]}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, backgroundColor: status.status_color ? `${status.status_color}18` : '#f3f4f6', color: status.status_color || '#6b7280', border: `1px solid ${status.status_color || '#e5e7eb'}30` }}>
                {status.status_label || 'Unknown'}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{row.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{row.email}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: '#5048ED', backgroundColor: '#EAE8FF', padding: '2px 8px', borderRadius: 4 }}>{row.role}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{row.created}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Recipe 2: Kanban Board
const KanbanBody = () => {
  const { data, isLoading } = useTable();

  const groups = useMemo(() => {
    if (!data) return [];
    const map = {};
    data.forEach((row) => {
      const label = row.workflow_status?.status_label || 'Unknown';
      if (!map[label]) map[label] = { label, color: row.workflow_status?.status_color || '#6b7280', items: [] };
      map[label].items.push(row);
    });
    return Object.values(map);
  }, [data]);

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>;
  if (groups.length === 0) return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No records found</div>;

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, overflowX: 'auto', minHeight: 300 }}>
      {groups.map((group) => (
        <div key={group.label} style={{ flex: '1 1 0', minWidth: 220, backgroundColor: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '2px solid', borderBottomColor: group.color, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{group.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', backgroundColor: group.color, width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{group.items.length}</span>
          </div>
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {group.items.map((row, idx) => (
              <div key={row.id || idx} style={{ padding: 12, backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'; }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{row.name}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{row.email}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Recipe 3: Stats Dashboard Header
const StatsDashboardHeader = () => {
  const { data, totalCount } = useTable();

  const stats = useMemo(() => {
    const rows = data || [];
    const active = rows.filter((r) => r.workflow_status?.status_label === 'Active').length;
    const inactive = rows.filter((r) => r.workflow_status?.status_label === 'Inactive').length;
    const pending = rows.filter((r) => r.workflow_status?.status_label === 'Pending').length;
    return [
      { label: 'Total Records', value: totalCount || rows.length, icon: '\u{1F4CA}', bg: '#EAE8FF', color: '#5048ED' },
      { label: 'Active', value: active, icon: '\u2705', bg: '#ECFDF5', color: '#12B76A' },
      { label: 'Inactive', value: inactive, icon: '\u{1F6D1}', bg: '#FEF2F2', color: '#F04438' },
      { label: 'Pending', value: pending, icon: '\u23F3', bg: '#FFFBEB', color: '#F79009' },
    ];
  }, [data, totalCount]);

  return (
    <div style={{ padding: '16px 16px 0 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ padding: 16, borderRadius: 12, backgroundColor: stat.bg, border: `1px solid ${stat.color}20`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Team Members</h2>
        <button style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', backgroundColor: '#5048ED', color: '#fff', fontSize: 13, fontWeight: 600, boxShadow: '0 2px 8px rgba(80, 72, 237, 0.3)' }}>+ Add New</button>
      </div>
    </div>
  );
};

// Recipe 4: Custom Detail with Tabs (Drawer)
const SectionAccordion = ({ section }) => {
  const [expanded, setExpanded] = useState(true);
  const sectionData = section.data || {};

  return (
    <div style={{ marginBottom: 12, border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <button onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'inherit' }}>
        <span>{section.title}</span>
        <span style={{ fontSize: 16, color: '#6b7280', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>v</span>
      </button>
      {expanded && (
        <div style={{ padding: 16 }}>
          {Object.entries(sectionData).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}>{key}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#111827' }}>{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TabbedDetailDrawer = ({ data, workflow_details, general_details, sections, onClose, open }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!open) return null;

  const tabStyle = (tab) => ({
    padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: 13,
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? '#5048ED' : '#6b7280',
    backgroundColor: activeTab === tab ? '#EAE8FF' : 'transparent',
    borderRadius: '8px 8px 0 0', fontFamily: 'inherit',
    borderBottom: activeTab === tab ? '2px solid #5048ED' : '2px solid transparent',
    transition: 'all 0.15s',
  });

  const wf = workflow_details || {};
  const gd = general_details || {};
  const secs = sections || [];

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, backgroundColor: '#fff', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)', zIndex: 1000, display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease-out' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{data?.title || 'Detail View'}</div>
          {wf.current_status_meta && (
            <span style={{ display: 'inline-block', marginTop: 6, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, backgroundColor: `${wf.current_status_meta.status_color}18`, color: wf.current_status_meta.status_color, border: `1px solid ${wf.current_status_meta.status_color}30` }}>
              {wf.current_status_meta.status_label}
            </span>
          )}
        </div>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb', backgroundColor: '#fff', cursor: 'pointer', fontSize: 16, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
      </div>
      <div style={{ display: 'flex', gap: 0, padding: '0 24px', borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={() => setActiveTab('overview')} style={tabStyle('overview')}>Overview</button>
        <button onClick={() => setActiveTab('workflow')} style={tabStyle('workflow')}>Workflow</button>
        <button onClick={() => setActiveTab('sections')} style={tabStyle('sections')}>Sections</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 0, marginBottom: 16 }}>General Details</h3>
            {gd.fields ? Object.values(gd.fields).map((field) => (
              <div key={field.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#6b7280' }}>{field.display_name}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{field.value}</span>
              </div>
            )) : <div style={{ color: '#9ca3af', fontSize: 13 }}>No general details available</div>}
          </div>
        )}
        {activeTab === 'workflow' && (
          <div>
            {wf.current_status_meta && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 0, marginBottom: 10 }}>Current Status</h3>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, backgroundColor: `${wf.current_status_meta.status_color}12`, border: `1px solid ${wf.current_status_meta.status_color}30` }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: wf.current_status_meta.status_color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: wf.current_status_meta.status_color }}>{wf.current_status_meta.status_label}</span>
                </div>
              </div>
            )}
            {wf.next_transitions && wf.next_transitions.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 0, marginBottom: 10 }}>Available Transitions</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {wf.next_transitions.map((t) => (
                    <button key={t.name} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${t.to_state_meta?.status_color || '#d1d5db'}`, backgroundColor: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: t.to_state_meta?.status_color || '#374151', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                      {t.display_name} &rarr; {t.to_state_meta?.status_label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {wf.tag_details && wf.tag_details.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 0, marginBottom: 10 }}>Tags</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {wf.tag_details.map((tag) => (
                    <span key={tag.name} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, backgroundColor: tag.state === 'enabled' ? '#EAE8FF' : '#f3f4f6', color: tag.state === 'enabled' ? '#5048ED' : '#9ca3af', border: `1px solid ${tag.state === 'enabled' ? '#c7d2fe' : '#e5e7eb'}` }}>
                      {tag.tag_label}: {tag.state}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'sections' && (
          <div>
            {secs.length > 0 ? secs.map((section) => (
              <SectionAccordion key={section.key} section={section} />
            )) : <div style={{ color: '#9ca3af', fontSize: 13 }}>No sections available</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// Recipe 5: Custom Detail Page (route-based full page)
const CustomDetailPage = ({ data, workflow_details, general_details, sections, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const fields = general_details?.fields || {};
  const fieldEntries = Object.entries(fields);
  const secs = sections || [];
  const transitions = workflow_details?.next_transitions || [];
  const tags = workflow_details?.tag_details || [];
  const statusLabel = workflow_details?.current_status_meta?.status_label || 'Unknown';
  const statusColor = workflow_details?.current_status_meta?.status_color || '#6b7280';

  const tabsList = ['overview', 'workflow', 'sections'];
  const tabStyle = (t) => ({
    padding: '10px 20px', fontSize: 13, fontWeight: activeTab === t ? 600 : 400, cursor: 'pointer',
    color: activeTab === t ? '#5048ED' : '#6b7280', borderBottom: `2px solid ${activeTab === t ? '#5048ED' : 'transparent'}`,
    background: 'none', border: 'none', fontFamily: 'inherit',
  });

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>{data?.title || 'Record Detail'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, backgroundColor: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30` }}>{statusLabel}</span>
            {tags.filter(t => t.state === 'enabled').map(t => (
              <span key={t.name} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: '#EAE8FF', color: '#5048ED', fontWeight: 500 }}>{t.tag_label}</span>
            ))}
          </div>
        </div>
        <button onClick={onRefresh} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, cursor: 'pointer', backgroundColor: '#fff', fontFamily: 'inherit' }}>Refresh</button>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
        {tabsList.map(t => <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
      </div>
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {fieldEntries.map(([key, field]) => (
            <div key={key} style={{ padding: 16, backgroundColor: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>{field.display_name || key}</div>
              <div style={{ fontSize: 14, color: '#111827', fontWeight: 500 }}>{String(field.value || '-')}</div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'workflow' && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Available Transitions</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {transitions.map(t => (
              <button key={t.name} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid', fontFamily: 'inherit', borderColor: t.to_state_meta?.status_color || '#d1d5db', backgroundColor: `${t.to_state_meta?.status_color || '#6b7280'}12`, color: t.to_state_meta?.status_color || '#374151' }}>
                {t.display_name} &rarr; {t.to_state_meta?.status_label}
              </button>
            ))}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Tags</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <div key={t.name} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, backgroundColor: t.state === 'enabled' ? '#EAE8FF' : '#f3f4f6', color: t.state === 'enabled' ? '#5048ED' : '#9ca3af', fontWeight: 500, border: `1px solid ${t.state === 'enabled' ? '#5048ED30' : '#e5e7eb'}` }}>
                {t.tag_label}: {t.state}
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {secs.map(s => (
            <div key={s.key} style={{ padding: 16, backgroundColor: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 12px' }}>{s.title}</h3>
              {s.data && Object.entries(s.data).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{k}</span>
                  <span style={{ fontSize: 12, color: '#111827', fontWeight: 500 }}>{String(v)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Recipe 6: Full Custom (composite slots)
const FullCustomHeader = () => {
  const { data, totalCount } = useTable();
  const rows = data || [];
  const active = rows.filter((r) => r.workflow_status?.status_label === 'Active').length;
  const inactive = rows.filter((r) => r.workflow_status?.status_label === 'Inactive').length;
  const miniStats = [
    { label: 'Total', value: totalCount || rows.length, color: '#5048ED' },
    { label: 'Active', value: active, color: '#12B76A' },
    { label: 'Inactive', value: inactive, color: '#F04438' },
  ];

  return (
    <div style={{ padding: '14px 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, marginRight: 'auto' }}>Full Custom View</h2>
      {miniStats.map((s) => (
        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 8, backgroundColor: `${s.color}10`, border: `1px solid ${s.color}20` }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
};

const FullCustomUtilities = () => {
  const [chips, setChips] = useState(['Active', 'Admin']);
  const allChips = ['Active', 'Inactive', 'Pending', 'Admin', 'Editor', 'Viewer'];
  const toggleChip = (chip) => { setChips((prev) => prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]); };

  return (
    <div style={{ padding: '10px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginRight: 4 }}>FILTERS:</span>
      {allChips.map((chip) => {
        const isActive = chips.includes(chip);
        return (
          <button key={chip} onClick={() => toggleChip(chip)} style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${isActive ? '#5048ED' : '#d1d5db'}`, backgroundColor: isActive ? '#EAE8FF' : '#fff', color: isActive ? '#5048ED' : '#6b7280', fontSize: 11, fontWeight: isActive ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            {chip}
          </button>
        );
      })}
    </div>
  );
};

const FullCustomCards = () => {
  const { data, isLoading, handleRowClick } = useTable();
  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: 16 }}>
      {(data || []).map((row, idx) => {
        const status = row.workflow_status || {};
        return (
          <div key={row.id || idx} onClick={() => handleRowClick && handleRowClick(row)}
            style={{ padding: 16, borderRadius: 10, border: '1px solid #e5e7eb', backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(80,72,237,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EAE8FF', color: '#5048ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{(row.name || '?')[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{row.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{row.role}</div>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: status.status_color || '#9ca3af' }} />
            </div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{row.email}</div>
          </div>
        );
      })}
    </div>
  );
};

const FullCustomPagination = () => {
  const { totalCount, data } = useTable();
  const loaded = (data || []).length;

  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <span style={{ fontSize: 12, color: '#6b7280' }}>Showing {loaded} of {totalCount || loaded} records</span>
      {loaded < (totalCount || 0) && (
        <button style={{ padding: '8px 24px', borderRadius: 8, border: '1px solid #5048ED', backgroundColor: '#fff', color: '#5048ED', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Load More</button>
      )}
    </div>
  );
};

const FullCustomDetail = (props) => <TabbedDetailDrawer {...props} />;

// Wraps CustomDetailPage with a back navigation bar for route-based detail
const CustomDetailPageWithBack = ({ data, workflow_details, general_details, sections, onRefresh }) => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Back bar */}
      <div style={{
        padding: '10px 32px', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/app/playground?recipe=customDetailPage')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500,
            color: '#374151', background: 'none', border: '1px solid #e5e7eb',
            cursor: 'pointer', fontFamily: 'inherit', padding: '7px 14px', borderRadius: 8,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5048ED'; e.currentTarget.style.color = '#5048ED'; e.currentTarget.style.backgroundColor = '#EAE8FF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Playground
        </button>
        <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: "'JetBrains Mono', monospace" }}>
          enableDetailViewRoute=true &middot; customMainDetail
        </span>
      </div>
      {/* Detail page content */}
      <CustomDetailPage data={data} workflow_details={workflow_details} general_details={general_details} sections={sections} onRefresh={onRefresh} />
    </div>
  );
};

// TableBody wrapper for navigate detail view
const NavigateTableBody = () => <TableBody defaultDetailView="navigate" />;

// ─── Recipe source strings (editable summaries) ───
const INITIAL_RECIPE_SOURCES = {
  cardGrid: `// Recipe: Card Grid View
// Replaces the default table body with a responsive card grid.
// Uses useTable() hook for data, isLoading, handleRowClick.

const CardGridBody = () => {
  const { data, isLoading, handleRowClick } = useTable();
  if (isLoading) return <Loading />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: 16 }}>
      {data.map((row) => (
        <div key={row.id} onClick={() => handleRowClick(row)}
          style={{ padding: 20, borderRadius: 12, border: '1px solid #e5e7eb', cursor: 'pointer' }}>
          <div>{row.name[0]}</div> {/* Avatar */}
          <span>{row.workflow_status?.status_label}</span>
          <div>{row.name}</div>
          <div>{row.email}</div>
          <span>{row.role}</span>
          <span>{row.created}</span>
        </div>
      ))}
    </div>
  );
};

// Usage:
<CrudHandler api_endpoint="/api/demo/" customTableBody={CardGridBody} />`,

  kanban: `// Recipe: Kanban Board
// Groups rows by workflow_status into swimlane columns.

const KanbanBody = () => {
  const { data, isLoading } = useTable();
  const groups = useMemo(() => {
    const map = {};
    (data || []).forEach((row) => {
      const label = row.workflow_status?.status_label || 'Unknown';
      if (!map[label]) map[label] = { label, color: row.workflow_status?.status_color, items: [] };
      map[label].items.push(row);
    });
    return Object.values(map);
  }, [data]);

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, overflowX: 'auto' }}>
      {groups.map((group) => (
        <div key={group.label} style={{ flex: '1 1 0', minWidth: 220 }}>
          <div>{group.label} ({group.items.length})</div>
          {group.items.map((row) => <div key={row.id}>{row.name}</div>)}
        </div>
      ))}
    </div>
  );
};

// Usage:
<CrudHandler api_endpoint="/api/demo/" customTableBody={KanbanBody} />`,

  statsHeader: `// Recipe: Stats Dashboard Header
// Custom header with KPI stat cards computed from table data.

const StatsDashboardHeader = () => {
  const { data, totalCount } = useTable();
  const stats = useMemo(() => {
    const rows = data || [];
    return [
      { label: 'Total', value: totalCount || rows.length },
      { label: 'Active', value: rows.filter(r => r.workflow_status?.status_label === 'Active').length },
      { label: 'Inactive', value: rows.filter(r => r.workflow_status?.status_label === 'Inactive').length },
      { label: 'Pending', value: rows.filter(r => r.workflow_status?.status_label === 'Pending').length },
    ];
  }, [data, totalCount]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map(s => <div key={s.label}>{s.value} {s.label}</div>)}
      </div>
    </div>
  );
};

// Usage:
<CrudHandler api_endpoint="/api/demo/" customHeader={StatsDashboardHeader} />`,

  tabbedDetail: `// Recipe: Custom Detail Drawer with Tabs
// Tabbed drawer replacing the default detail view.
// Receives: data, workflow_details, general_details, sections, onClose, open

const TabbedDetailDrawer = ({ data, workflow_details, general_details, sections, onClose, open }) => {
  const [activeTab, setActiveTab] = useState('overview');
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, backgroundColor: '#fff', zIndex: 1000 }}>
      <div>{data?.title} <button onClick={onClose}>x</button></div>
      <div>
        <button onClick={() => setActiveTab('overview')}>Overview</button>
        <button onClick={() => setActiveTab('workflow')}>Workflow</button>
        <button onClick={() => setActiveTab('sections')}>Sections</button>
      </div>
      <div>
        {activeTab === 'overview' && /* general_details.fields */}
        {activeTab === 'workflow' && /* status + transitions + tags */}
        {activeTab === 'sections' && /* accordion sections */}
      </div>
    </div>
  );
};

// Usage:
<CrudHandler api_endpoint="/api/demo/" customDrawerDetail={TabbedDetailDrawer} />`,

  customDetailPage: `// Recipe: Custom Detail Page (route-based)
// Full-page detail view instead of a drawer. Uses enableDetailViewRoute
// and customMainDetail for the page component, plus a TableBody with
// defaultDetailView="navigate" to trigger navigation on row click.

const CustomDetailPage = ({ data, workflow_details, general_details, sections, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <h1>{data?.title}</h1>
      {/* Tabs: Overview | Workflow | Sections */}
      {/* Renders fields, transitions, tags, and section data */}
    </div>
  );
};

const NavigateTableBody = () => <TableBody defaultDetailView="navigate" />;

// Usage:
<CrudHandler
  api_endpoint="/api/demo/"
  customMainDetail={CustomDetailPage}
  customTableBody={NavigateTableBody}
  enableDetailViewRoute={true}
/>`,

  fullCustom: `// Recipe: Full Custom - All slots overridden
// Demonstrates composing multiple custom components.

const FullCustomHeader = () => {
  const { data, totalCount } = useTable();
  // Inline stat badges + title
};

const FullCustomUtilities = () => {
  // Clickable filter chips instead of search/filter bar
  const [chips, setChips] = useState(['Active', 'Admin']);
};

const FullCustomCards = () => {
  const { data, handleRowClick } = useTable();
  // Compact 3-column card grid
};

const FullCustomPagination = () => {
  const { totalCount, data } = useTable();
  // "Load More" style pagination
};

const FullCustomDetail = (props) => <TabbedDetailDrawer {...props} />;

// Usage - all 5 slots overridden:
<CrudHandler
  api_endpoint="/api/demo/"
  customHeader={FullCustomHeader}
  customUtilities={FullCustomUtilities}
  customTableBody={FullCustomCards}
  customPagination={FullCustomPagination}
  customDrawerDetail={FullCustomDetail}
/>`,
};

// ─── Recipe definitions ───
const RECIPES = [
  { id: 'none', label: 'None', description: 'Default CrudHandler with no custom components', props: {} },
  { id: 'cardGrid', label: 'Card Grid', description: 'Responsive card grid replacing table rows', props: { customTableBody: CardGridBody } },
  { id: 'kanban', label: 'Kanban', description: 'Swimlane columns grouped by workflow status', props: { customTableBody: KanbanBody } },
  { id: 'statsHeader', label: 'Stats Header', description: 'KPI stat cards above the standard table', props: { customHeader: StatsDashboardHeader } },
  { id: 'tabbedDetail', label: 'Custom Detail Drawer', description: 'Tabbed drawer with Overview, Workflow, Sections', props: { customDrawerDetail: TabbedDetailDrawer } },
  { id: 'customDetailPage', label: 'Custom Detail Page', description: 'Route-based full-page detail (enableDetailViewRoute)', props: { customMainDetail: CustomDetailPageWithBack, customTableBody: NavigateTableBody, enableDetailViewRoute: true } },
  { id: 'fullCustom', label: 'Full Custom', description: 'All 5 slots overridden: header, utilities, body, pagination, detail', props: { customHeader: FullCustomHeader, customUtilities: FullCustomUtilities, customTableBody: FullCustomCards, customPagination: FullCustomPagination, customDrawerDetail: FullCustomDetail } },
];

// ─── CrudHandler Playground (merged with recipes) ───
const CrudPlayground = () => {
  // Props
  const [showHeader, setShowHeader] = useState(true);
  const [showUtilities, setShowUtilities] = useState(true);
  const [showPagination, setShowPagination] = useState(true);
  const [showBody, setShowBody] = useState(true);
  const [drawerSize, setDrawerSize] = useState('lg');
  const [theme, setTheme] = useState('none');

  // Recipe - auto-select from URL: detail route or ?recipe= param
  const isDetailRoute = typeof window !== 'undefined' && window.location.pathname.includes('/detail-view/');
  const urlRecipe = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('recipe') : null;
  const initialRecipe = isDetailRoute ? 'customDetailPage' : (urlRecipe && RECIPES.find(r => r.id === urlRecipe) ? urlRecipe : 'none');
  const [selectedRecipeId, setSelectedRecipeId] = useState(initialRecipe);
  const [recipeSources, setRecipeSources] = useState(INITIAL_RECIPE_SOURCES);

  const selectedRecipe = useMemo(
    () => RECIPES.find((r) => r.id === selectedRecipeId) || RECIPES[0],
    [selectedRecipeId]
  );

  // Custom classes (editable per element)
  const [customClasses, setCustomClasses] = useState({});
  const updateClass = (key, val) => setCustomClasses((p) => ({ ...p, [key]: val }));

  // Custom styles (editable JS code per element)
  const [customStyleCode, setCustomStyleCode] = useState(`{
  // Dynamic style functions with access to component state
  // Each function receives (baseStyles, state) and returns a style object
  //
  // bodyRow: (baseStyles, state) => ({
  //   ...baseStyles,
  //   backgroundColor: state.isSelected ? '#fef3c7' : baseStyles.backgroundColor,
  //   borderLeft: state.rowIndex % 2 === 0 ? '4px solid #3b82f6' : 'none'
  // }),
  // headerCell: (baseStyles, state) => ({
  //   ...baseStyles,
  //   fontWeight: state.canSort ? 'bold' : 'normal'
  // })
}`);

  // Utilities bar (via metadata.utilities_config)
  const [utShowSearch, setUtShowSearch] = useState(true);
  const [utShowFilters, setUtShowFilters] = useState(true);
  const [utShowColumns, setUtShowColumns] = useState(true);
  // Permissions (via metadata top-level)
  const [permAdd, setPermAdd] = useState(true);
  const [permUpload, setPermUpload] = useState(false);
  const [permDownload, setPermDownload] = useState(true);

  // API data
  const [metadataObj, setMetadataObj] = useState(DEFAULT_METADATA);
  const [metadataText, setMetadataText] = useState(JSON.stringify(DEFAULT_METADATA, null, 2));
  const [rowsText, setRowsText] = useState(JSON.stringify(DEFAULT_ROWS, null, 2));
  const [detailText, setDetailText] = useState(JSON.stringify(DEFAULT_DETAIL_VIEW, null, 2));
  const [formText, setFormText] = useState(JSON.stringify(DEFAULT_FORM_SCHEMA, null, 2));
  const [dataError, setDataError] = useState(null);

  // Refresh key for CrudHandler remount
  const [refreshKey, setRefreshKey] = useState(0);

  // Bottom tabs
  const [bottomTab, setBottomTab] = useState('code');

  // Merge theme + custom classes
  const mergedCustomClass = useMemo(() => {
    const base = { ...themes[theme].customClass };
    Object.entries(customClasses).forEach(([k, v]) => {
      if (v && v.trim()) base[k] = v;
    });
    return base;
  }, [theme, customClasses]);

  // Parse customStyle code safely
  const parsedCustomStyle = useMemo(() => {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`"use strict"; return (${customStyleCode})`);
      const result = fn();
      if (typeof result === 'object' && result !== null) return result;
    } catch { /* ignore parse errors */ }
    return {};
  }, [customStyleCode]);

  // Apply theme to custom class inputs
  const applyTheme = (key) => {
    setTheme(key);
    setCustomClasses({ ...themes[key].customClass });
  };

  // Re-mount CrudHandler on recipe change
  useEffect(() => {
    setRefreshKey((k) => k + 1);
  }, [selectedRecipeId]);

  // Generated code from visual mode
  const generatedCode = useMemo(() => {
    const props = [`  api_endpoint="/api/demo/"`];
    if (!showHeader) props.push('  showHeader={false}');
    if (!showUtilities) props.push('  showUtilities={false}');
    if (!showBody) props.push('  showBody={false}');
    if (!showPagination) props.push('  showPagination={false}');
    if (drawerSize !== 'lg') props.push(`  detailDrawerSize="${drawerSize}"`);

    const cc = Object.entries(mergedCustomClass).filter(([, v]) => v);
    if (cc.length > 0) props.push(`  customClass={{\n${cc.map(([k, v]) => `    ${k}: "${v}"`).join(',\n')}\n  }}`);

    const hasCustomStyle = Object.keys(parsedCustomStyle).length > 0;
    if (hasCustomStyle) {
      props.push(`  customStyle={${customStyleCode.trim()}}`);
    }

    // Recipe props
    if (selectedRecipeId !== 'none') {
      const recipeObj = selectedRecipe;
      const recipeProps = recipeObj.props || {};
      Object.keys(recipeProps).forEach((key) => {
        if (key === 'enableDetailViewRoute') {
          props.push(`  enableDetailViewRoute={true}`);
        } else {
          // Show the component name for custom* props
          const compName = typeof recipeProps[key] === 'function' ? recipeProps[key].name || 'CustomComponent' : String(recipeProps[key]);
          props.push(`  ${key}={${compName}}`);
        }
      });
    }

    return `<CrudHandler\n${props.join('\n')}\n/>`;
  }, [showHeader, showUtilities, showBody, showPagination, drawerSize, mergedCustomClass, parsedCustomStyle, customStyleCode, selectedRecipeId, selectedRecipe]);

  // Sync toggle -> metadata -> mock interceptor -> refresh
  const applyMetaChange = useCallback((path, key, value, setter) => {
    setter(value);
    let updated;
    if (path === 'utilities_config') {
      updated = { ...metadataObj, utilities_config: { ...metadataObj.utilities_config, [key]: value } };
    } else {
      updated = { ...metadataObj, [key]: value };
    }
    setMetadataObj(updated);
    setMetadataText(JSON.stringify(updated, null, 2));
    try {
      const rows = JSON.parse(rowsText);
      window.__PLAYGROUND_CONFIG__ = { metadata: updated, rows };
    } catch { /* ignore row parse errors */ }
    setRefreshKey((k) => k + 1);
  }, [metadataObj, rowsText]);

  // Push data changes from text editor to mock interceptor
  const applyDataChanges = useCallback(() => {
    try {
      const meta = JSON.parse(metadataText);
      const rows = JSON.parse(rowsText);
      let detail = null;
      let form = null;
      try { detail = JSON.parse(detailText); } catch {}
      try { form = JSON.parse(formText); } catch {}
      setMetadataObj(meta);
      const uc = meta.utilities_config || {};
      setUtShowSearch(uc.show_search !== false);
      setUtShowFilters(uc.show_filters_button !== false);
      setUtShowColumns(uc.show_column_options !== false);
      setPermAdd(meta.has_add_perm !== false);
      setPermUpload(meta.has_upload_perm === true);
      setPermDownload(meta.has_download_perm !== false);
      window.__PLAYGROUND_CONFIG__ = { metadata: meta, rows, detailView: detail, formSchema: form };
      setDataError(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      setDataError(e.message);
    }
  }, [metadataText, rowsText, detailText, formText]);

  // Ref for live preview scroll
  const previewRef = React.useRef(null);

  // Initialize
  useEffect(() => {
    window.__PLAYGROUND_CONFIG__ = { metadata: DEFAULT_METADATA, rows: DEFAULT_ROWS, detailView: DEFAULT_DETAIL_VIEW, formSchema: DEFAULT_FORM_SCHEMA };
    // Auto-scroll to live preview if on detail route
    if (isDetailRoute && previewRef.current) {
      setTimeout(() => previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Recipe Selector */}
      <Panel title="Recipe" style={{}}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: 4, backgroundColor: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb', width: 'fit-content' }}>
          {RECIPES.map((recipe) => (
            <RecipePill
              key={recipe.id}
              active={selectedRecipeId === recipe.id}
              label={recipe.label}
              onClick={() => setSelectedRecipeId(recipe.id)}
            />
          ))}
        </div>
        {selectedRecipeId !== 'none' && (
          <div style={{ marginTop: 10, padding: '8px 14px', backgroundColor: '#f0efff', borderRadius: 8, border: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: '#5048ED', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {RECIPES.findIndex((r) => r.id === selectedRecipeId)}
            </span>
            <span style={{ fontSize: 12, color: '#374151' }}>
              <strong>{selectedRecipe.label}</strong> -- {selectedRecipe.description}
            </span>
          </div>
        )}
      </Panel>

      {/* Top controls row */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Panel title="Sections" style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Toggle label="Header" checked={showHeader} onChange={setShowHeader} />
            <Toggle label="Utilities" checked={showUtilities} onChange={setShowUtilities} />
            <Toggle label="Body" checked={showBody} onChange={setShowBody} />
            <Toggle label="Pagination" checked={showPagination} onChange={setShowPagination} />
          </div>
        </Panel>
        <Panel title="Utilities (metadata)" style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Toggle label="Search" checked={utShowSearch} onChange={(v) => applyMetaChange('utilities_config', 'show_search', v, setUtShowSearch)} />
            <Toggle label="Filters" checked={utShowFilters} onChange={(v) => applyMetaChange('utilities_config', 'show_filters_button', v, setUtShowFilters)} />
            <Toggle label="Columns" checked={utShowColumns} onChange={(v) => applyMetaChange('utilities_config', 'show_column_options', v, setUtShowColumns)} />
          </div>
        </Panel>
        <Panel title="Permissions (metadata)" style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Toggle label="Add" checked={permAdd} onChange={(v) => applyMetaChange('root', 'has_add_perm', v, setPermAdd)} />
            <Toggle label="Upload" checked={permUpload} onChange={(v) => applyMetaChange('root', 'has_upload_perm', v, setPermUpload)} />
            <Toggle label="Download" checked={permDownload} onChange={(v) => applyMetaChange('root', 'has_download_perm', v, setPermDownload)} />
          </div>
        </Panel>
        <Panel title="Config" style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Select label="Detail Drawer" value={drawerSize} onChange={setDrawerSize}
              options={[{ value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }, { value: 'full', label: 'Full' }]} />
            <Select label="Form Drawer" value={metadataObj?.form_config?.drawer_size || 'md'} onChange={(v) => {
              const updated = { ...metadataObj, form_config: { ...metadataObj.form_config, drawer_size: v } };
              setMetadataObj(updated);
              setMetadataText(JSON.stringify(updated, null, 2));
              try { const rows = JSON.parse(rowsText); window.__PLAYGROUND_CONFIG__ = { ...window.__PLAYGROUND_CONFIG__, metadata: updated }; } catch {}
              setRefreshKey((k) => k + 1);
            }} options={[{ value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }, { value: 'full', label: 'Full' }]} />
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {Object.entries(themes).map(([k, v]) => (
                <button key={k} onClick={() => applyTheme(k)}
                  style={{ padding: '3px 8px', borderRadius: 4, border: '1px solid', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                    borderColor: theme === k ? '#5048ED' : '#d1d5db', backgroundColor: theme === k ? '#EAE8FF' : '#fff', color: theme === k ? '#5048ED' : '#6b7280' }}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Custom class editor */}
      <Panel title="Custom Classes (Tailwind)" style={{}}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
          {allClassElements.map((el) => (
            <div key={el} style={{ fontSize: 11 }}>
              <label style={{ display: 'block', color: '#6b7280', fontWeight: 500, marginBottom: 2 }}>{el}</label>
              <input type="text" value={customClasses[el] || mergedCustomClass[el] || ''} onChange={(e) => updateClass(el, e.target.value)}
                placeholder={`e.g. bg-blue-50 text-sm`}
                style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid #e5e7eb', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#374151', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}
                onFocus={(e) => { e.target.style.borderColor = '#818cf8'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
              />
            </div>
          ))}
        </div>
      </Panel>

      {/* Custom style editor */}
      <Panel title="Custom Styles (dynamic JS functions)">
        <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 8px' }}>
          Define style functions that receive <code style={{ fontSize: 11, background: '#f3f4f6', padding: '1px 4px', borderRadius: 3 }}>(baseStyles, state)</code> and return CSS objects. State includes rowIndex, isSelected, isHovered, rowData for rows; isPinned, canSort, columnId for headers.
        </p>
        <CodeEditor value={customStyleCode} onChange={setCustomStyleCode} minHeight={120} />
      </Panel>

      {/* Code / Recipe Source / API Metadata / API Data */}
      <div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          <TabBtn active={bottomTab === 'code'} label="Generated Code" onClick={() => setBottomTab('code')} />
          <TabBtn active={bottomTab === 'recipe'} label="Recipe Source" onClick={() => setBottomTab('recipe')} />
          <TabBtn active={bottomTab === 'metadata'} label="Table Metadata" onClick={() => setBottomTab('metadata')} />
          <TabBtn active={bottomTab === 'data'} label="Table Data" onClick={() => setBottomTab('data')} />
          <TabBtn active={bottomTab === 'detail'} label="Detail View" onClick={() => setBottomTab('detail')} />
          <TabBtn active={bottomTab === 'form'} label="Form Schema" onClick={() => setBottomTab('form')} />
        </div>

        {bottomTab === 'code' && (
          <CodeBlock language="jsx" title="Generated Code" code={generatedCode} />
        )}

        {bottomTab === 'recipe' && (
          <Panel title={`Recipe Source${selectedRecipeId !== 'none' ? ` - ${selectedRecipe.label}` : ''}`}>
            {selectedRecipeId === 'none' ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                Select a recipe above to view its source code.
              </div>
            ) : (
              <div style={{ margin: -12 }}>
                <CodeBlock language="jsx" title={selectedRecipe.label} code={recipeSources[selectedRecipeId] || '// No source available'} />
              </div>
            )}
          </Panel>
        )}

        {bottomTab === 'metadata' && (
          <Panel title="GET ?action=get_table_metadata -> response.table_metadata"
            actions={<ApplyBtn onClick={applyDataChanges} />}>
            <CodeEditor value={metadataText} onChange={setMetadataText} minHeight={250} />
            {dataError && <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444' }}>Error: {dataError}</div>}
          </Panel>
        )}

        {bottomTab === 'data' && (
          <Panel title="GET ?action=get_table_data -> response.table_data[]"
            actions={<ApplyBtn onClick={applyDataChanges} />}>
            <CodeEditor value={rowsText} onChange={setRowsText} minHeight={250} />
            {dataError && <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444' }}>Error: {dataError}</div>}
          </Panel>
        )}

        {bottomTab === 'detail' && (
          <Panel title="GET ?action=fetch_item_details -> response (click a row to see)"
            actions={<ApplyBtn onClick={applyDataChanges} />}>
            <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 8px' }}>
              This data is returned when a row is clicked and the detail drawer/view opens. Includes general_details, workflow_details (status transitions, tags), sections, and row_actions.
            </p>
            <CodeEditor value={detailText} onChange={setDetailText} minHeight={300} />
            {dataError && <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444' }}>Error: {dataError}</div>}
          </Panel>
        )}

        {bottomTab === 'form' && (
          <Panel title="GET ?action=initialize_form -> response (Add New button)"
            actions={<ApplyBtn onClick={applyDataChanges} />}>
            <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 8px' }}>
              This schema is returned when the "Add New" form is initialized. Includes JSON Schema, UI Schema for RJSF rendering.
            </p>
            <CodeEditor value={formText} onChange={setFormText} minHeight={250} />
            {dataError && <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444' }}>Error: {dataError}</div>}
          </Panel>
        )}
      </div>

      {/* Live Preview */}
      <div ref={previewRef} />
      <Panel title="Live Preview" actions={
        <button onClick={() => setRefreshKey((k) => k + 1)}
          style={{ padding: '2px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 11, cursor: 'pointer', backgroundColor: '#fff', color: '#374151', fontFamily: 'inherit' }}>
          Refresh
        </button>
      } style={{ minHeight: 350 }}>
        <div style={{ margin: -12 }} key={`${refreshKey}-${drawerSize}-${metadataObj?.form_config?.drawer_size || 'md'}`}>
          <CrudHandler
            api_endpoint={`/api/demo/?_v=${refreshKey}`}
            showHeader={showHeader}
            showUtilities={showUtilities}
            showBody={showBody}
            showPagination={showPagination}
            detailDrawerSize={drawerSize}
            customClass={mergedCustomClass}
            customStyle={parsedCustomStyle}
            {...selectedRecipe.props}
          />
        </div>
      </Panel>
    </div>
  );
};

// ─── FormRenderer Playground ───

const FIELD_TEMPLATES = {
  text: { type: 'string', title: 'Text Field' },
  textarea: { type: 'string', title: 'Text Area' },
  email: { type: 'string', title: 'Email', format: 'email' },
  number: { type: 'number', title: 'Number Field' },
  integer: { type: 'integer', title: 'Integer Field' },
  boolean: { type: 'boolean', title: 'Checkbox', default: false },
  date: { type: 'string', title: 'Date', format: 'date' },
  datetime: { type: 'string', title: 'Date & Time', format: 'date-time' },
  select: { type: 'string', title: 'Select', enum: ['option1', 'option2', 'option3'], enumNames: ['Option 1', 'Option 2', 'Option 3'] },
  radio: { type: 'string', title: 'Radio Group', enum: ['option1', 'option2', 'option3'], enumNames: ['Option 1', 'Option 2', 'Option 3'] },
  multiselect: { type: 'array', title: 'Multi Select', items: { type: 'string', enum: ['tag1', 'tag2', 'tag3'] }, uniqueItems: true },
  file: { type: 'string', title: 'File Upload', format: 'data-url' },
  password: { type: 'string', title: 'Password' },
  url: { type: 'string', title: 'URL', format: 'uri' },
  phone: { type: 'string', title: 'Phone Number' },
};

const UI_WIDGET_MAP = {
  textarea: { 'ui:widget': 'textarea', 'ui:options': { rows: 4 } },
  radio: { 'ui:widget': 'radio' },
  password: { 'ui:widget': 'password' },
  file: { 'ui:widget': 'file' },
  phone: { 'ui:widget': 'text', 'ui:placeholder': '+1 (555) 000-0000' },
};

const PRESET_FORMS = {
  registration: {
    label: 'Registration',
    schema: {
      type: 'object', title: 'User Registration', required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', title: 'Full Name', minLength: 2 },
        email: { type: 'string', title: 'Email', format: 'email' },
        password: { type: 'string', title: 'Password', minLength: 8 },
        department: { type: 'string', title: 'Department', enum: ['engineering', 'marketing', 'sales', 'hr'], enumNames: ['Engineering', 'Marketing', 'Sales', 'Human Resources'] },
        active: { type: 'boolean', title: 'Active User', default: true },
      },
    },
    uiSchema: { password: { 'ui:widget': 'password' }, department: { 'ui:widget': 'select' }, 'ui:order': ['name', 'email', 'password', 'department', 'active'] },
  },
  contact: {
    label: 'Contact Form',
    schema: {
      type: 'object', title: 'Contact Us', required: ['name', 'email', 'message'],
      properties: {
        name: { type: 'string', title: 'Your Name' },
        email: { type: 'string', title: 'Email', format: 'email' },
        phone: { type: 'string', title: 'Phone Number' },
        subject: { type: 'string', title: 'Subject', enum: ['support', 'sales', 'feedback', 'other'], enumNames: ['Support', 'Sales', 'Feedback', 'Other'] },
        priority: { type: 'string', title: 'Priority', enum: ['low', 'medium', 'high'], enumNames: ['Low', 'Medium', 'High'] },
        message: { type: 'string', title: 'Message', minLength: 10 },
      },
    },
    uiSchema: { message: { 'ui:widget': 'textarea', 'ui:options': { rows: 5 } }, priority: { 'ui:widget': 'radio' }, 'ui:order': ['name', 'email', 'phone', 'subject', 'priority', 'message'] },
  },
  settings: {
    label: 'Settings',
    schema: {
      type: 'object', title: 'App Settings',
      properties: {
        notifications: { type: 'boolean', title: 'Enable Notifications', default: true },
        theme: { type: 'string', title: 'Theme', enum: ['light', 'dark', 'system'], enumNames: ['Light', 'Dark', 'System'], default: 'system' },
        language: { type: 'string', title: 'Language', enum: ['en', 'es', 'fr', 'de'], enumNames: ['English', 'Spanish', 'French', 'German'], default: 'en' },
        itemsPerPage: { type: 'integer', title: 'Items Per Page', minimum: 5, maximum: 100, default: 25 },
        bio: { type: 'string', title: 'Bio', maxLength: 500 },
        website: { type: 'string', title: 'Website', format: 'uri' },
      },
    },
    uiSchema: { theme: { 'ui:widget': 'radio' }, bio: { 'ui:widget': 'textarea', 'ui:options': { rows: 3 } }, 'ui:order': ['theme', 'language', 'notifications', 'itemsPerPage', 'bio', 'website'] },
  },
  empty: {
    label: 'Empty',
    schema: { type: 'object', title: 'My Form', properties: {} },
    uiSchema: {},
  },
};

const FieldTypeBtn = ({ label, icon, onClick }) => (
  <button onClick={onClick} style={{
    padding: '5px 10px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 11, fontWeight: 500,
    cursor: 'pointer', backgroundColor: '#fff', color: '#374151', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.12s', whiteSpace: 'nowrap',
  }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5048ED'; e.currentTarget.style.backgroundColor = '#EAE8FF'; e.currentTarget.style.color = '#5048ED'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#374151'; }}
  >
    <span style={{ fontSize: 13 }}>{icon}</span> {label}
  </button>
);

const FormPlayground = () => {
  const [schema, setSchema] = useState(PRESET_FORMS.registration.schema);
  const [uiSchema, setUiSchema] = useState(PRESET_FORMS.registration.uiSchema);
  const [schemaText, setSchemaText] = useState(JSON.stringify(PRESET_FORMS.registration.schema, null, 2));
  const [uiSchemaText, setUiSchemaText] = useState(JSON.stringify(PRESET_FORMS.registration.uiSchema, null, 2));
  const [submittedData, setSubmittedData] = useState(null);
  const [schemaError, setSchemaError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [enableAddAnother, setEnableAddAnother] = useState(false);
  const [skipAutoRefresh, setSkipAutoRefresh] = useState(false);
  const [useExternalSubmit, setUseExternalSubmit] = useState(false);
  const [formTitle, setFormTitle] = useState('User Registration');
  const [bottomTab, setBottomTab] = useState('schema');
  const [fieldCounter, setFieldCounter] = useState(1);
  const [eventLog, setEventLog] = useState([]);
  const logEvent = (msg) => setEventLog((prev) => [{ time: new Date().toLocaleTimeString(), msg }, ...prev].slice(0, 15));

  // Sync text → parsed
  const syncFromText = useCallback(() => {
    try {
      const s = JSON.parse(schemaText);
      const u = JSON.parse(uiSchemaText);
      setSchema(s);
      setUiSchema(u);
      setFormTitle(s.title || 'My Form');
      setSchemaError(null);
    } catch (e) {
      setSchemaError(e.message);
    }
  }, [schemaText, uiSchemaText]);

  // Sync parsed → text
  const syncToText = useCallback((s, u) => {
    setSchemaText(JSON.stringify(s, null, 2));
    setUiSchemaText(JSON.stringify(u, null, 2));
    setSchema(s);
    setUiSchema(u);
    setSchemaError(null);
  }, []);

  // Add field
  const addField = useCallback((type) => {
    const template = { ...FIELD_TEMPLATES[type] };
    const fieldName = `${type}_field_${fieldCounter}`;
    setFieldCounter((c) => c + 1);
    const newSchema = {
      ...schema,
      properties: { ...schema.properties, [fieldName]: template },
    };
    const newUi = { ...uiSchema };
    if (UI_WIDGET_MAP[type]) {
      newUi[fieldName] = UI_WIDGET_MAP[type];
    }
    // Add to ui:order if it exists
    if (newUi['ui:order']) {
      newUi['ui:order'] = [...newUi['ui:order'], fieldName];
    }
    syncToText(newSchema, newUi);
  }, [schema, uiSchema, fieldCounter, syncToText]);

  // Remove field
  const removeField = useCallback((fieldName) => {
    const newProps = { ...schema.properties };
    delete newProps[fieldName];
    const newRequired = (schema.required || []).filter((r) => r !== fieldName);
    const newSchema = { ...schema, properties: newProps, required: newRequired.length > 0 ? newRequired : undefined };
    const newUi = { ...uiSchema };
    delete newUi[fieldName];
    if (newUi['ui:order']) {
      newUi['ui:order'] = newUi['ui:order'].filter((f) => f !== fieldName);
    }
    syncToText(newSchema, newUi);
  }, [schema, uiSchema, syncToText]);

  // Toggle required
  const toggleRequired = useCallback((fieldName) => {
    const req = schema.required || [];
    const isReq = req.includes(fieldName);
    const newReq = isReq ? req.filter((r) => r !== fieldName) : [...req, fieldName];
    const newSchema = { ...schema, required: newReq.length > 0 ? newReq : undefined };
    syncToText(newSchema, uiSchema);
  }, [schema, uiSchema, syncToText]);

  // Load preset
  const loadPreset = useCallback((key) => {
    const preset = PRESET_FORMS[key];
    setFormTitle(preset.schema.title || 'My Form');
    syncToText(preset.schema, preset.uiSchema);
    setSubmittedData(null);
  }, [syncToText]);

  // Current fields
  const fields = Object.entries(schema.properties || {});
  const requiredFields = schema.required || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Presets + Config */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Panel title="Form Presets" style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.entries(PRESET_FORMS).map(([key, preset]) => (
              <button key={key} onClick={() => loadPreset(key)}
                style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 11, fontWeight: 500, cursor: 'pointer', backgroundColor: '#fff', color: '#374151', fontFamily: 'inherit', transition: 'all 0.12s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5048ED'; e.currentTarget.style.color = '#5048ED'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'; }}
              >{preset.label}</button>
            ))}
          </div>
        </Panel>
        <Panel title="Form Config" style={{ flex: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ color: '#6b7280', fontWeight: 500, width: 50 }}>Title</span>
              <input type="text" value={formTitle} onChange={(e) => {
                setFormTitle(e.target.value);
                const s = { ...schema, title: e.target.value };
                syncToText(s, uiSchema);
              }} style={{ flex: 1, padding: '4px 8px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Toggle label="Confirm on Submit" checked={showConfirm} onChange={setShowConfirm} />
              <Toggle label="Add Another" checked={enableAddAnother} onChange={setEnableAddAnother} />
              <Toggle label="Skip Auto Refresh" checked={skipAutoRefresh} onChange={setSkipAutoRefresh} />
              <Toggle label="External Submit Btn" checked={useExternalSubmit} onChange={setUseExternalSubmit} />
            </div>
          </div>
        </Panel>
      </div>

      {/* Add Fields */}
      <Panel title="Add Field (click to add to form)">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <FieldTypeBtn label="Text" icon="Aa" onClick={() => addField('text')} />
          <FieldTypeBtn label="Text Area" icon="¶" onClick={() => addField('textarea')} />
          <FieldTypeBtn label="Email" icon="@" onClick={() => addField('email')} />
          <FieldTypeBtn label="Number" icon="#" onClick={() => addField('number')} />
          <FieldTypeBtn label="Integer" icon="1" onClick={() => addField('integer')} />
          <FieldTypeBtn label="Checkbox" icon="☑" onClick={() => addField('boolean')} />
          <FieldTypeBtn label="Date" icon="📅" onClick={() => addField('date')} />
          <FieldTypeBtn label="Date Time" icon="🕐" onClick={() => addField('datetime')} />
          <FieldTypeBtn label="Select" icon="▾" onClick={() => addField('select')} />
          <FieldTypeBtn label="Radio" icon="◉" onClick={() => addField('radio')} />
          <FieldTypeBtn label="Multi Select" icon="☰" onClick={() => addField('multiselect')} />
          <FieldTypeBtn label="File" icon="📎" onClick={() => addField('file')} />
          <FieldTypeBtn label="Password" icon="🔒" onClick={() => addField('password')} />
          <FieldTypeBtn label="URL" icon="🔗" onClick={() => addField('url')} />
          <FieldTypeBtn label="Phone" icon="📞" onClick={() => addField('phone')} />
        </div>
      </Panel>

      {/* Field List with inline editing */}
      {fields.length > 0 && (
        <Panel title={`Fields (${fields.length})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {fields.map(([name, field]) => {
              const isReq = requiredFields.includes(name);
              const isString = field.type === 'string';
              const isNumeric = field.type === 'number' || field.type === 'integer';

              const updateField = (key, value) => {
                const newField = { ...field };
                if (value === '' || value === undefined) { delete newField[key]; }
                else { newField[key] = value; }
                const newSchema = { ...schema, properties: { ...schema.properties, [name]: newField } };
                syncToText(newSchema, uiSchema);
              };

              const updateUiField = (key, value) => {
                const newUi = { ...uiSchema };
                if (!newUi[name]) newUi[name] = {};
                if (value === '' || value === undefined) { delete newUi[name][key]; }
                else { newUi[name][key] = value; }
                if (Object.keys(newUi[name]).length === 0) delete newUi[name];
                syncToText(schema, newUi);
              };

              const miniInput = (label, value, onChange, placeholder, mono) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
                  <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value || undefined)}
                    placeholder={placeholder}
                    style={{ width: 100, padding: '2px 6px', borderRadius: 4, border: '1px solid #e5e7eb', fontSize: 10, outline: 'none', fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit', color: '#374151', backgroundColor: '#fff' }}
                    onFocus={(e) => { e.target.style.borderColor = '#818cf8'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
                  />
                </div>
              );

              return (
                <div key={name} style={{ borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  {/* Header row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
                    backgroundColor: '#f9fafb',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111827', fontFamily: "'JetBrains Mono', monospace", minWidth: 100 }}>{name}</span>
                    <span style={{ fontSize: 10, color: '#6b7280', backgroundColor: '#e5e7eb', padding: '1px 6px', borderRadius: 4 }}>{field.type}{field.format ? `:${field.format}` : ''}</span>
                    <input type="text" value={field.title || ''} onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Field title" style={{ flex: 1, padding: '2px 6px', borderRadius: 4, border: '1px solid #e5e7eb', fontSize: 11, outline: 'none', color: '#374151', backgroundColor: '#fff' }}
                      onFocus={(e) => { e.target.style.borderColor = '#818cf8'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
                    />
                    <button onClick={() => toggleRequired(name)} title="Toggle required"
                      style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, border: '1px solid', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                        borderColor: isReq ? '#5048ED' : '#d1d5db', backgroundColor: isReq ? '#EAE8FF' : '#fff', color: isReq ? '#5048ED' : '#9ca3af' }}>
                      {isReq ? 'Req' : 'Opt'}
                    </button>
                    <button onClick={() => removeField(name)} title="Remove field"
                      style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, border: '1px solid #fecaca', cursor: 'pointer', backgroundColor: '#fef2f2', color: '#ef4444', fontFamily: 'inherit' }}>
                      ✕
                    </button>
                  </div>
                  {/* Validation row */}
                  <div style={{ display: 'flex', gap: 8, padding: '5px 10px', flexWrap: 'wrap', borderTop: '1px solid #f3f4f6' }}>
                    {miniInput('placeholder', uiSchema[name]?.['ui:placeholder'], (v) => updateUiField('ui:placeholder', v), 'Enter value...', false)}
                    {isString && miniInput('pattern', field.pattern, (v) => updateField('pattern', v), '^[A-Za-z]+$', true)}
                    {isString && miniInput('minLen', field.minLength, (v) => updateField('minLength', v ? parseInt(v) || undefined : undefined), '0')}
                    {isString && miniInput('maxLen', field.maxLength, (v) => updateField('maxLength', v ? parseInt(v) || undefined : undefined), '100')}
                    {isNumeric && miniInput('min', field.minimum, (v) => updateField('minimum', v ? Number(v) : undefined), '0')}
                    {isNumeric && miniInput('max', field.maximum, (v) => updateField('maximum', v ? Number(v) : undefined), '100')}
                    {isString && miniInput('default', field.default, (v) => updateField('default', v), '')}
                    {isNumeric && miniInput('default', field.default, (v) => updateField('default', v ? Number(v) : undefined), '0')}
                    {(isString || field.enum) && (() => {
                      const applyOptions = (v) => {
                        const opts = v ? v.split(',').map(s => s.trim()).filter(Boolean) : [];
                        const newField = { ...field };
                        if (opts.length > 0) {
                          newField.enum = opts;
                          newField.enumNames = opts.map(o => o.charAt(0).toUpperCase() + o.slice(1));
                        } else {
                          newField.enum = [];
                          newField.enumNames = [];
                        }
                        const newSchema = { ...schema, properties: { ...schema.properties, [name]: newField } };
                        syncToText(newSchema, uiSchema);
                      };
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, whiteSpace: 'nowrap' }}>options</span>
                          <input type="text"
                            defaultValue={(field.enum || []).join(', ')}
                            key={name + '-opts-' + (field.enum || []).length}
                            onBlur={(e) => applyOptions(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyOptions(e.target.value); } }}
                            placeholder="opt1, opt2, opt3"
                            style={{ width: 140, padding: '2px 6px', borderRadius: 4, border: '1px solid #e5e7eb', fontSize: 10, outline: 'none', fontFamily: 'inherit', color: '#374151', backgroundColor: '#fff' }}
                            onFocus={(e) => { e.target.style.borderColor = '#818cf8'; }}
                          />
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Schema tabs + Live Preview side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left: Schema editor */}
        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <TabBtn active={bottomTab === 'code'} label="Generated Code" onClick={() => setBottomTab('code')} />
            <TabBtn active={bottomTab === 'schema'} label="JSON Schema" onClick={() => setBottomTab('schema')} />
            <TabBtn active={bottomTab === 'uischema'} label="UI Schema" onClick={() => setBottomTab('uischema')} />
          </div>
          {bottomTab === 'code' && (() => {
            const codeLines = ['<FormRenderer'];
            codeLines.push(`  rjsf_schema={{`);
            codeLines.push(`    schema: ${JSON.stringify(schema, null, 2).split('\n').join('\n    ')},`);
            if (Object.keys(uiSchema).length > 0) codeLines.push(`    uiSchema: ${JSON.stringify(uiSchema, null, 2).split('\n').join('\n    ')},`);
            codeLines.push(`    formData: {}`);
            codeLines.push(`  }}`);
            if (showConfirm) codeLines.push(`  showConfirmAlert={true}`);
            if (skipAutoRefresh) codeLines.push(`  skipAutoRefresh={true}`);
            if (useExternalSubmit) codeLines.push(`  submitButtonContainerId="my-submit-container"`);
            codeLines.push(`  onSubmit={async (formData) => {`);
            codeLines.push(`    await saveData(formData);`);
            codeLines.push(`    return { success: true${!enableAddAnother ? ', hide_add_another_btn: true' : ''} };`);
            codeLines.push(`  }}`);
            codeLines.push(`  onResponse={(response) => console.log("Saved:", response)}`);
            if (enableAddAnother) codeLines.push(`  onAddAnother={() => console.log("Add another clicked")}`);
            codeLines.push(`  onError={(error) => console.error("Error:", error)}`);
            codeLines.push(`/>`);
            return <CodeBlock language="jsx" title="Generated FormRenderer Code" code={codeLines.join('\n')} />;
          })()}
          {bottomTab === 'schema' && (
            <Panel title="JSON Schema" actions={<ApplyBtn onClick={syncFromText} />}>
              <CodeEditor value={schemaText} onChange={(v) => { setSchemaText(v); setSchemaError(null); }} minHeight={350} />
              {schemaError && <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444' }}>Error: {schemaError}</div>}
            </Panel>
          )}
          {bottomTab === 'uischema' && (
            <Panel title="UI Schema" actions={<ApplyBtn onClick={syncFromText} />}>
              <CodeEditor value={uiSchemaText} onChange={(v) => { setUiSchemaText(v); setSchemaError(null); }} minHeight={350} />
              {schemaError && <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444' }}>Error: {schemaError}</div>}
            </Panel>
          )}
        </div>

        {/* Right: Live preview + submitted data + event log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Live Form Preview" style={{ minHeight: 350 }}>
            {schema && !schemaError ? (
              <div key={schemaText + uiSchemaText + showConfirm + enableAddAnother + useExternalSubmit}>
                <FormRenderer
                  rjsf_schema={{ schema, uiSchema, formData: {} }}
                  showConfirmAlert={showConfirm}
                  skipAutoRefresh={skipAutoRefresh}
                  submitButtonContainerId={useExternalSubmit ? 'playground-submit-portal' : undefined}
                  onSubmit={async (formData) => {
                    logEvent('onSubmit fired');
                    setSubmittedData(formData);
                    return { success: true, hide_add_another_btn: !enableAddAnother };
                  }}
                  onResponse={(response) => {
                    logEvent('onResponse: ' + JSON.stringify(response || {}).slice(0, 80));
                  }}
                  onAddAnother={enableAddAnother ? () => {
                    logEvent('onAddAnother fired - form reset for new entry');
                  } : undefined}
                  onError={(error) => {
                    logEvent('onError: ' + (error?.message || String(error)));
                  }}
                />
                {useExternalSubmit && (
                  <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6 }}>External Submit Button (submitButtonContainerId)</div>
                    <div id="playground-submit-portal" />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Fix the JSON schema to see the form preview</div>
            )}
          </Panel>

          {submittedData && (
            <Panel title="Submitted Data" actions={
              <button onClick={() => setSubmittedData(null)} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, border: '1px solid #d1d5db', cursor: 'pointer', backgroundColor: '#fff', color: '#6b7280', fontFamily: 'inherit' }}>Clear</button>
            }>
              <pre style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#374151', whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(submittedData, null, 2)}</pre>
            </Panel>
          )}

          {eventLog.length > 0 && (
            <Panel title="Event Log" actions={
              <button onClick={() => setEventLog([])} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, border: '1px solid #d1d5db', cursor: 'pointer', backgroundColor: '#fff', color: '#6b7280', fontFamily: 'inherit' }}>Clear</button>
            }>
              <div style={{ maxHeight: 120, overflowY: 'auto' }}>
                {eventLog.map((entry, i) => (
                  <div key={i} style={{ fontSize: 11, padding: '3px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#9ca3af', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, flexShrink: 0 }}>{entry.time}</span>
                    <span style={{ color: '#374151' }}>{entry.msg}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main ───
const PlaygroundHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 24 }}>
    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4f46e5', backgroundColor: '#eef2ff', border: '1px solid #e0e7ff', padding: '4px 10px', borderRadius: 20, marginBottom: 10 }}>Playground</span>
    <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h1>
    <p style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>{subtitle}</p>
  </div>
);

const Playground = () => (
  <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
    <div style={{ padding: '32px 40px' }}>
      <PlaygroundHeader
        title="CrudHandler Playground"
        subtitle="Toggle props, edit custom classes, modify API data, switch themes, try recipe components — all live."
      />
      <CrudPlayground />
    </div>
  </div>
);

// Exported separately for the FormRenderer playground page
export const PlaygroundForm = () => (
  <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
    <div style={{ padding: '32px 40px' }}>
      <PlaygroundHeader
        title="FormRenderer Playground"
        subtitle="Build forms visually — add fields, configure schemas, preview live, test submissions."
      />
      <FormPlayground />
    </div>
  </div>
);

export default Playground;
