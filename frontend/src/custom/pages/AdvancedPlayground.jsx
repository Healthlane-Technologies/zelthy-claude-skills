import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CrudHandler, useTable } from '@zango-core/crud/table';
import CodeBlock from '../components/CodeBlock';

// ─── Shared UI ───

const Panel = ({ title, children, actions, style = {} }) => (
  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', ...style }}>
    <div style={{
      padding: '8px 14px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb',
      fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase',
      letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span>{title}</span>
      {actions}
    </div>
    <div style={{ padding: 12 }}>{children}</div>
  </div>
);

const RecipeTab = ({ active, label, onClick }) => (
  <button onClick={onClick} style={{
    padding: '8px 18px', border: 'none', cursor: 'pointer', fontSize: 13,
    fontWeight: active ? 600 : 400, color: active ? '#fff' : '#6b7280',
    backgroundColor: active ? '#5048ED' : 'transparent',
    borderRadius: 8, transition: 'all 0.2s', fontFamily: 'inherit',
    boxShadow: active ? '0 2px 8px rgba(80, 72, 237, 0.3)' : 'none',
  }}>
    {label}
  </button>
);

// ─── Default mock data ───

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
  utilities_config: { show_search: true, show_filters_button: true, show_column_options: true },
};

const DEFAULT_ROWS = (() => {
  const names = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eva Martinez', 'Frank Garcia', 'Grace Lee', 'Henry Wilson', 'Iris Taylor', 'Jack Anderson'];
  const roles = ['Admin', 'Editor', 'Viewer'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  return names.map((name, i) => ({
    id: i + 1, object_uuid: `uuid-${String(i + 1).padStart(4, '0')}`, name,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    role: roles[i % roles.length],
    workflow_status: {
      status_label: statuses[i % statuses.length],
      status_color: statuses[i % statuses.length] === 'Active' ? '#12B76A' : statuses[i % statuses.length] === 'Inactive' ? '#F04438' : '#F79009',
    },
    created: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    row_actions: [
      { name: 'Edit', key: 'edit', type: 'form' },
      { name: 'Delete', key: 'delete', type: 'simple', confirmation_message: 'Are you sure you want to delete this item?' },
    ],
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
    { name: 'Delete', key: 'delete', type: 'simple', description: 'Delete this record', confirmation_message: 'Are you sure?' },
  ],
  sections: [
    { key: 'overview', name: 'overview', title: 'Overview', data: { Name: 'Alice Johnson', Email: 'alice.johnson@example.com', Role: 'Admin' } },
    { key: 'activity', name: 'activity', title: 'Activity', data: { Status: 'Active', Created: '2024-01-01' } },
  ],
};

// ─── Recipe 1: Card Grid View ───

const CardGridBody = () => {
  const { data, isLoading, handleRowClick } = useTable();

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
        <div style={{ fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
        <div style={{ fontSize: 14 }}>No records found</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: 16,
    }}>
      {data.map((row, idx) => {
        const status = row.workflow_status || {};
        return (
          <div
            key={row.id || idx}
            onClick={() => handleRowClick && handleRowClick(row)}
            style={{
              padding: 20, borderRadius: 12,
              border: '1px solid #e5e7eb', backgroundColor: '#fff',
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(80, 72, 237, 0.12)';
              e.currentTarget.style.borderColor = '#c7d2fe';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                backgroundColor: '#EAE8FF', color: '#5048ED',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700,
              }}>
                {(row.name || '?')[0]}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                backgroundColor: status.status_color ? `${status.status_color}18` : '#f3f4f6',
                color: status.status_color || '#6b7280',
                border: `1px solid ${status.status_color || '#e5e7eb'}30`,
              }}>
                {status.status_label || 'Unknown'}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{row.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{row.email}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: 11, fontWeight: 500, color: '#5048ED',
                backgroundColor: '#EAE8FF', padding: '2px 8px', borderRadius: 4,
              }}>
                {row.role}
              </span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{row.created}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Recipe 2: Kanban Board ───

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

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>;
  }

  if (groups.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No records found</div>;
  }

  return (
    <div style={{
      display: 'flex', gap: 16, padding: 16, overflowX: 'auto', minHeight: 300,
    }}>
      {groups.map((group) => (
        <div key={group.label} style={{
          flex: '1 1 0', minWidth: 220, backgroundColor: '#f9fafb',
          borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: '12px 16px', borderBottom: '2px solid',
            borderBottomColor: group.color, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{group.label}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#fff', backgroundColor: group.color,
              width: 22, height: 22, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              {group.items.length}
            </span>
          </div>
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {group.items.map((row, idx) => (
              <div key={row.id || idx} style={{
                padding: 12, backgroundColor: '#fff', borderRadius: 8,
                border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.15s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'; }}
              >
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

// ─── Recipe 3: Stats Dashboard Header ───

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
          <div key={stat.label} style={{
            padding: 16, borderRadius: 12, backgroundColor: stat.bg,
            border: `1px solid ${stat.color}20`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0', borderBottom: '1px solid #e5e7eb',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Team Members</h2>
        <button style={{
          padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
          backgroundColor: '#5048ED', color: '#fff', fontSize: 13, fontWeight: 600,
          boxShadow: '0 2px 8px rgba(80, 72, 237, 0.3)',
        }}>
          + Add New
        </button>
      </div>
    </div>
  );
};

// ─── Recipe 4: Custom Detail with Tabs ───

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
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 520,
      backgroundColor: '#fff', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
      zIndex: 1000, display: 'flex', flexDirection: 'column',
      animation: 'slideIn 0.25s ease-out',
    }}>
      {/* Drawer header */}
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{data?.title || 'Detail View'}</div>
          {wf.current_status_meta && (
            <span style={{
              display: 'inline-block', marginTop: 6, fontSize: 11, fontWeight: 600,
              padding: '3px 10px', borderRadius: 20,
              backgroundColor: `${wf.current_status_meta.status_color}18`,
              color: wf.current_status_meta.status_color,
              border: `1px solid ${wf.current_status_meta.status_color}30`,
            }}>
              {wf.current_status_meta.status_label}
            </span>
          )}
        </div>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb',
          backgroundColor: '#fff', cursor: 'pointer', fontSize: 16, color: '#6b7280',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          x
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '0 24px', borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={() => setActiveTab('overview')} style={tabStyle('overview')}>Overview</button>
        <button onClick={() => setActiveTab('workflow')} style={tabStyle('workflow')}>Workflow</button>
        <button onClick={() => setActiveTab('sections')} style={tabStyle('sections')}>Sections</button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 0, marginBottom: 16 }}>General Details</h3>
            {gd.fields ? Object.values(gd.fields).map((field) => (
              <div key={field.name} style={{
                display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                borderBottom: '1px solid #f3f4f6',
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#6b7280' }}>{field.display_name}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{field.value}</span>
              </div>
            )) : (
              <div style={{ color: '#9ca3af', fontSize: 13 }}>No general details available</div>
            )}
          </div>
        )}

        {/* Workflow tab */}
        {activeTab === 'workflow' && (
          <div>
            {/* Status badge */}
            {wf.current_status_meta && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 0, marginBottom: 10 }}>Current Status</h3>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                  borderRadius: 10, backgroundColor: `${wf.current_status_meta.status_color}12`,
                  border: `1px solid ${wf.current_status_meta.status_color}30`,
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    backgroundColor: wf.current_status_meta.status_color,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: wf.current_status_meta.status_color }}>
                    {wf.current_status_meta.status_label}
                  </span>
                </div>
              </div>
            )}

            {/* Transitions */}
            {wf.next_transitions && wf.next_transitions.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 0, marginBottom: 10 }}>Available Transitions</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {wf.next_transitions.map((t) => (
                    <button key={t.name} style={{
                      padding: '8px 16px', borderRadius: 8, border: `1px solid ${t.to_state_meta?.status_color || '#d1d5db'}`,
                      backgroundColor: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      color: t.to_state_meta?.status_color || '#374151', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}>
                      {t.display_name} → {t.to_state_meta?.status_label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {wf.tag_details && wf.tag_details.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 0, marginBottom: 10 }}>Tags</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {wf.tag_details.map((tag) => (
                    <span key={tag.name} style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                      backgroundColor: tag.state === 'enabled' ? '#EAE8FF' : '#f3f4f6',
                      color: tag.state === 'enabled' ? '#5048ED' : '#9ca3af',
                      border: `1px solid ${tag.state === 'enabled' ? '#c7d2fe' : '#e5e7eb'}`,
                    }}>
                      {tag.tag_label}: {tag.state}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sections tab */}
        {activeTab === 'sections' && (
          <div>
            {secs.length > 0 ? secs.map((section) => (
              <SectionAccordion key={section.key} section={section} />
            )) : (
              <div style={{ color: '#9ca3af', fontSize: 13 }}>No sections available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SectionAccordion = ({ section }) => {
  const [expanded, setExpanded] = useState(true);
  const sectionData = section.data || {};

  return (
    <div style={{ marginBottom: 12, border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer',
          backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#111827',
          fontFamily: 'inherit',
        }}
      >
        <span>{section.title}</span>
        <span style={{ fontSize: 16, color: '#6b7280', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          v
        </span>
      </button>
      {expanded && (
        <div style={{ padding: 16 }}>
          {Object.entries(sectionData).map(([key, value]) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between', padding: '8px 0',
              borderBottom: '1px solid #f3f4f6',
            }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}>{key}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#111827' }}>{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Recipe 5: Custom Detail Page (route-based full page) ───

const CustomDetailPage = ({ data, workflow_details, general_details, sections, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const fields = general_details?.fields || {};
  const fieldEntries = Object.entries(fields);
  const secs = sections || [];
  const transitions = workflow_details?.next_transitions || [];
  const tags = workflow_details?.tag_details || [];
  const statusLabel = workflow_details?.current_status_meta?.status_label || 'Unknown';
  const statusColor = workflow_details?.current_status_meta?.status_color || '#6b7280';

  const tabs = ['overview', 'workflow', 'sections'];
  const tabStyle = (t) => ({
    padding: '10px 20px', fontSize: 13, fontWeight: activeTab === t ? 600 : 400, cursor: 'pointer',
    color: activeTab === t ? '#5048ED' : '#6b7280', borderBottom: `2px solid ${activeTab === t ? '#5048ED' : 'transparent'}`,
    background: 'none', border: 'none', fontFamily: 'inherit',
  });

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>{data?.title || 'Record Detail'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
              backgroundColor: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30`,
            }}>{statusLabel}</span>
            {tags.filter(t => t.state === 'enabled').map(t => (
              <span key={t.name} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: '#EAE8FF', color: '#5048ED', fontWeight: 500 }}>
                {t.tag_label}
              </span>
            ))}
          </div>
        </div>
        <button onClick={onRefresh} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, cursor: 'pointer', backgroundColor: '#fff', fontFamily: 'inherit' }}>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
        {tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
      </div>

      {/* Content */}
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
              <button key={t.name} style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                border: '1px solid', fontFamily: 'inherit',
                borderColor: t.to_state_meta?.status_color || '#d1d5db',
                backgroundColor: `${t.to_state_meta?.status_color || '#6b7280'}12`,
                color: t.to_state_meta?.status_color || '#374151',
              }}>{t.display_name} → {t.to_state_meta?.status_label}</button>
            ))}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Tags</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <div key={t.name} style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 13,
                backgroundColor: t.state === 'enabled' ? '#EAE8FF' : '#f3f4f6',
                color: t.state === 'enabled' ? '#5048ED' : '#9ca3af',
                fontWeight: 500, border: `1px solid ${t.state === 'enabled' ? '#5048ED30' : '#e5e7eb'}`,
              }}>{t.tag_label}: {t.state}</div>
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

// ─── Recipe 6: Full Custom (composite slots) ───

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
    <div style={{
      padding: '14px 16px', backgroundColor: '#fafafa',
      borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, marginRight: 'auto' }}>Full Custom View</h2>
      {miniStats.map((s) => (
        <div key={s.label} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 8, backgroundColor: `${s.color}10`,
          border: `1px solid ${s.color}20`,
        }}>
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

  const toggleChip = (chip) => {
    setChips((prev) => prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]);
  };

  return (
    <div style={{
      padding: '10px 16px', borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginRight: 4 }}>FILTERS:</span>
      {allChips.map((chip) => {
        const active = chips.includes(chip);
        return (
          <button key={chip} onClick={() => toggleChip(chip)} style={{
            padding: '4px 12px', borderRadius: 20, border: `1px solid ${active ? '#5048ED' : '#d1d5db'}`,
            backgroundColor: active ? '#EAE8FF' : '#fff', color: active ? '#5048ED' : '#6b7280',
            fontSize: 11, fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}>
            {chip}
          </button>
        );
      })}
    </div>
  );
};

const FullCustomCards = () => {
  const { data, isLoading, handleRowClick } = useTable();

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: 16 }}>
      {(data || []).map((row, idx) => {
        const status = row.workflow_status || {};
        return (
          <div key={row.id || idx}
            onClick={() => handleRowClick && handleRowClick(row)}
            style={{
              padding: 16, borderRadius: 10, border: '1px solid #e5e7eb',
              backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c7d2fe';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(80,72,237,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, backgroundColor: '#EAE8FF',
                color: '#5048ED', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
              }}>
                {(row.name || '?')[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{row.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{row.role}</div>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', backgroundColor: status.status_color || '#9ca3af',
              }} />
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
    <div style={{
      padding: '12px 16px', borderTop: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
    }}>
      <span style={{ fontSize: 12, color: '#6b7280' }}>
        Showing {loaded} of {totalCount || loaded} records
      </span>
      {loaded < (totalCount || 0) && (
        <button style={{
          padding: '8px 24px', borderRadius: 8, border: '1px solid #5048ED',
          backgroundColor: '#fff', color: '#5048ED', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Load More
        </button>
      )}
    </div>
  );
};

const FullCustomDetail = (props) => <TabbedDetailDrawer {...props} />;


// ─── Recipe source strings ───

const RECIPE_SOURCES = {
  cardGrid: `// Recipe: Card Grid View
// Custom table body that renders data as responsive cards

const CardGridBody = () => {
  const { data, isLoading, handleRowClick } = useTable();

  if (isLoading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>No records found</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: 16 }}>
      {data.map((row, idx) => {
        const status = row.workflow_status || {};
        return (
          <div key={row.id || idx}
            onClick={() => handleRowClick && handleRowClick(row)}
            style={{
              padding: 20, borderRadius: 12, border: '1px solid #e5e7eb',
              backgroundColor: '#fff', cursor: 'pointer',
              transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
            {/* Avatar + Status badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ /* avatar circle */ }}>{row.name[0]}</div>
              <span style={{ /* status badge */ }}>{status.status_label}</span>
            </div>
            {/* Name + Email */}
            <div style={{ fontSize: 15, fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{row.email}</div>
            {/* Role + Date */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{row.role}</span>
              <span>{row.created}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Usage:
<CrudHandler
  api_endpoint="/api/demo/"
  customTableBody={CardGridBody}
/>`,

  kanban: `// Recipe: Kanban Board
// Groups rows by workflow status into swimlane columns

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
        <div key={group.label} style={{
          flex: '1 1 0', minWidth: 220, backgroundColor: '#f9fafb',
          borderRadius: 12, border: '1px solid #e5e7eb',
        }}>
          {/* Column header with status + count */}
          <div style={{ padding: '12px 16px', borderBottom: '2px solid ' + group.color }}>
            <span>{group.label}</span>
            <span>{group.items.length}</span>
          </div>
          {/* Cards */}
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {group.items.map((row) => (
              <div key={row.id} style={{ padding: 12, backgroundColor: '#fff', borderRadius: 8 }}>
                <div>{row.name}</div>
                <div>{row.email}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Usage:
<CrudHandler
  api_endpoint="/api/demo/"
  customTableBody={KanbanBody}
/>`,

  statsHeader: `// Recipe: Stats Dashboard Header
// Custom header with KPI stat cards above the table

const StatsDashboardHeader = () => {
  const { data, totalCount } = useTable();

  const stats = useMemo(() => {
    const rows = data || [];
    return [
      { label: 'Total Records', value: totalCount || rows.length, icon: '\\u{1F4CA}', bg: '#EAE8FF', color: '#5048ED' },
      { label: 'Active', value: rows.filter(r => r.workflow_status?.status_label === 'Active').length, icon: '\\u2705', bg: '#ECFDF5', color: '#12B76A' },
      { label: 'Inactive', value: rows.filter(r => r.workflow_status?.status_label === 'Inactive').length, icon: '\\u{1F6D1}', bg: '#FEF2F2', color: '#F04438' },
      { label: 'Pending', value: rows.filter(r => r.workflow_status?.status_label === 'Pending').length, icon: '\\u23F3', bg: '#FFFBEB', color: '#F79009' },
    ];
  }, [data, totalCount]);

  return (
    <div style={{ padding: '16px 16px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ padding: 16, borderRadius: 12, backgroundColor: stat.bg }}>
            <div style={{ fontSize: 22 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb' }}>
        <h2>Team Members</h2>
        <button>+ Add New</button>
      </div>
    </div>
  );
};

// Usage:
<CrudHandler
  api_endpoint="/api/demo/"
  customHeader={StatsDashboardHeader}
/>`,

  tabbedDetail: `// Recipe: Custom Detail with Tabs
// Tabbed drawer for detail view with Overview, Workflow, Sections tabs

const TabbedDetailDrawer = ({ data, workflow_details, general_details, sections, onClose, open }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, backgroundColor: '#fff', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)', zIndex: 1000 }}>
      {/* Drawer header with title + close button */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <div>{data?.title || 'Detail View'}</div>
        <button onClick={onClose}>x</button>
      </div>

      {/* Tab buttons */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={() => setActiveTab('overview')}>Overview</button>
        <button onClick={() => setActiveTab('workflow')}>Workflow</button>
        <button onClick={() => setActiveTab('sections')}>Sections</button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {activeTab === 'overview' && (
          /* Render general_details.fields as key-value pairs */
        )}
        {activeTab === 'workflow' && (
          /* Show current status badge, transition buttons, tags */
        )}
        {activeTab === 'sections' && (
          /* Render sections as accordion panels */
        )}
      </div>
    </div>
  );
};

// Usage:
<CrudHandler
  api_endpoint="/api/demo/"
  customDrawerDetail={TabbedDetailDrawer}
/>`,

  fullCustom: `// Recipe: Full Custom - All slots overridden
// Demonstrates composing multiple custom components together

const FullCustomHeader = () => {
  const { data, totalCount } = useTable();
  // Renders inline stat badges + title
  return <div>...</div>;
};

const FullCustomUtilities = () => {
  // Renders clickable filter chips instead of search/filter bar
  const [chips, setChips] = useState(['Active', 'Admin']);
  return <div>{/* chip buttons */}</div>;
};

const FullCustomCards = () => {
  const { data, handleRowClick } = useTable();
  // Compact card grid (3 columns)
  return <div>{/* card grid */}</div>;
};

const FullCustomPagination = () => {
  const { totalCount, data } = useTable();
  // "Load More" button instead of page numbers
  return <div>Showing {data.length} of {totalCount} <button>Load More</button></div>;
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
  {
    id: 'cardGrid',
    label: 'Card Grid',
    description: 'Responsive card grid replacing table rows',
    props: { customTableBody: CardGridBody },
  },
  {
    id: 'kanban',
    label: 'Kanban',
    description: 'Swimlane columns grouped by workflow status',
    props: { customTableBody: KanbanBody },
  },
  {
    id: 'statsHeader',
    label: 'Stats Header',
    description: 'KPI stat cards above the standard table',
    props: { customHeader: StatsDashboardHeader },
  },
  {
    id: 'tabbedDetail',
    label: 'Custom Detail',
    description: 'Tabbed drawer with Overview, Workflow, Sections',
    props: { customDrawerDetail: TabbedDetailDrawer },
  },
  {
    id: 'fullCustom',
    label: 'Full Custom',
    description: 'All 5 slots overridden: header, utilities, body, pagination, detail',
    props: {
      customHeader: FullCustomHeader,
      customUtilities: FullCustomUtilities,
      customTableBody: FullCustomCards,
      customPagination: FullCustomPagination,
      customDrawerDetail: FullCustomDetail,
    },
  },
];


// ─── Main Page Component ───

const AdvancedPlayground = () => {
  const [activeRecipe, setActiveRecipe] = useState('cardGrid');
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedRecipe = useMemo(
    () => RECIPES.find((r) => r.id === activeRecipe) || RECIPES[0],
    [activeRecipe]
  );

  const recipeSource = RECIPE_SOURCES[activeRecipe] || '';

  // Initialize mock data
  useEffect(() => {
    window.__PLAYGROUND_CONFIG__ = {
      metadata: DEFAULT_METADATA,
      rows: DEFAULT_ROWS,
      detailView: DEFAULT_DETAIL_VIEW,
    };
  }, []);

  // Re-mount CrudHandler on recipe change
  useEffect(() => {
    setRefreshKey((k) => k + 1);
  }, [activeRecipe]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div style={{ padding: '32px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: '#4f46e5', backgroundColor: '#eef2ff', border: '1px solid #e0e7ff',
            padding: '4px 10px', borderRadius: 20, marginBottom: 10,
          }}>
            Recipes
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Advanced Playground</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: '#6b7280', maxWidth: 600, lineHeight: 1.5 }}>
            Pre-built recipes showcasing advanced CrudHandler patterns. Select a recipe, view the source, edit it.
          </p>
        </div>

        {/* Recipe tabs */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 24, padding: 6,
          backgroundColor: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb',
          width: 'fit-content',
        }}>
          {RECIPES.map((recipe) => (
            <RecipeTab
              key={recipe.id}
              active={activeRecipe === recipe.id}
              label={recipe.label}
              onClick={() => setActiveRecipe(recipe.id)}
            />
          ))}
        </div>

        {/* Recipe description */}
        <div style={{
          padding: '12px 18px', marginBottom: 20,
          backgroundColor: '#f0efff', borderRadius: 10, border: '1px solid #e0e7ff',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8, backgroundColor: '#5048ED',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, flexShrink: 0,
          }}>
            {RECIPES.findIndex((r) => r.id === activeRecipe) + 1}
          </span>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{selectedRecipe.label}</span>
            <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 8 }}>-- {selectedRecipe.description}</span>
          </div>
        </div>

        {/* Source code panel */}
        <Panel title="Recipe Source Code" style={{ marginBottom: 20 }} actions={
          <span style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'none', letterSpacing: 0 }}>
            Read-only preview
          </span>
        }>
          <div style={{ margin: -12 }}>
            <CodeBlock code={recipeSource} language="jsx" />
          </div>
        </Panel>

        {/* Live Preview */}
        <Panel
          title="Live Preview"
          style={{ minHeight: 400 }}
          actions={
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              style={{
                padding: '2px 10px', borderRadius: 4, border: '1px solid #d1d5db',
                fontSize: 11, cursor: 'pointer', backgroundColor: '#fff',
                color: '#374151', fontFamily: 'inherit',
              }}
            >
              Refresh
            </button>
          }
        >
          <div style={{ margin: -12 }} key={refreshKey}>
            <CrudHandler
              api_endpoint="/api/demo/"
              {...selectedRecipe.props}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default AdvancedPlayground;
