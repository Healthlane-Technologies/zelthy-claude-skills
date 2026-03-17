import { appInitializerData } from './appInitializer';

// Intercept all fetch/XHR calls to serve static data
// This makes the app fully backend-less - no API calls leave the browser

const originalFetch = window.fetch;

window.fetch = function (url, options) {
  const urlStr = typeof url === 'string' ? url : url?.url || '';

  // Intercept app initializer
  if (urlStr.includes('/app/initializer')) {
    const wrappedResponse = {
      response: appInitializerData,
      success: true,
    };
    return Promise.resolve(
      new Response(JSON.stringify(wrappedResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }

  // Intercept demo CRUD API for playground
  if (urlStr.includes('/api/demo')) {
    return handleDemoApi(urlStr, options);
  }

  // Intercept any other /api/ calls with a generic success
  if (urlStr.includes('/api/')) {
    return handleGenericApi(urlStr, options);
  }

  // Let all other requests through (CDN, fonts, etc.)
  return originalFetch.apply(this, arguments);
};

// Also intercept XMLHttpRequest
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  this._interceptedUrl = url;
  this._interceptedMethod = method;
  return originalXHROpen.call(this, method, url, ...rest);
};

XMLHttpRequest.prototype.send = function (body) {
  const url = this._interceptedUrl || '';

  if (url.includes('/app/initializer')) {
    const self = this;
    const data = JSON.stringify({ response: appInitializerData, success: true });
    setTimeout(() => {
      Object.defineProperty(self, 'status', { value: 200, writable: false });
      Object.defineProperty(self, 'responseText', { value: data, writable: false });
      Object.defineProperty(self, 'response', { value: data, writable: false });
      Object.defineProperty(self, 'readyState', { value: 4, writable: false });
      if (self.onreadystatechange) self.onreadystatechange();
      if (self.onload) self.onload();
    }, 0);
    return;
  }

  return originalXHRSend.call(this, body);
};

// ─── Configurable mock data (Playground can mutate these at runtime) ───
window.__PLAYGROUND_CONFIG__ = window.__PLAYGROUND_CONFIG__ || {
  metadata: null,    // override TABLE_METADATA
  rows: null,        // override MOCK_ROWS
  detailView: null,  // override detail view response
  formSchema: null,  // override form schema response
};

// ─── Default mock table data ───
const MOCK_ROWS = (() => {
  const names = [
    'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eva Martinez',
    'Frank Garcia', 'Grace Lee', 'Henry Wilson', 'Iris Taylor', 'Jack Anderson',
    'Karen Thomas', 'Leo Jackson', 'Mia White', 'Noah Harris', 'Olivia Clark',
    'Peter Lewis', 'Quinn Robinson', 'Ruby Walker', 'Sam Young', 'Tina King',
    'Uma Wright', 'Victor Lopez', 'Wendy Hill', 'Xavier Scott', 'Yara Green',
  ];
  const roles = ['Admin', 'Editor', 'Viewer'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  return names.map((name, i) => ({
    id: i + 1,
    object_uuid: `uuid-${String(i + 1).padStart(4, '0')}`,
    name,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    role: roles[i % roles.length],
    workflow_status: {
      status_label: statuses[i % statuses.length],
      status_color: statuses[i % statuses.length] === 'Active' ? '#12B76A' : statuses[i % statuses.length] === 'Inactive' ? '#F04438' : '#F79009',
    },
    created: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    row_actions: [
      { name: 'Edit', key: 'edit', type: 'form' },
      { name: 'Delete', key: 'delete', type: 'simple', confirmation_message: 'Are you sure you want to delete this item? This action cannot be undone.' },
    ],
  }));
})();

const TABLE_METADATA = {
  columns: [
    { name: 'name', display_name: 'Name', type: 'string', sortable: true, filterable: true },
    { name: 'email', display_name: 'Email', type: 'string', sortable: true, filterable: true },
    { name: 'role', display_name: 'Role', type: 'string', sortable: true, filterable: true },
    { name: 'workflow_status', display_name: 'Status', type: 'StatusCol', sortable: true, filterable: true },
    { name: 'created', display_name: 'Created', type: 'string', sortable: true, filterable: false },
    { name: 'row_actions', display_name: 'Actions', type: 'ActionsCol', sortable: false, filterable: false },
  ],
  filters: [
    {
      id: 'role',
      name: 'Role',
      type: 'select',
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Editor', label: 'Editor' },
        { value: 'Viewer', label: 'Viewer' },
      ],
    },
    {
      id: 'status',
      name: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Pending', label: 'Pending' },
      ],
    },
  ],
  page_title: 'Demo Table',
  actions: [
    { name: 'Edit', key: 'edit', type: 'simple' },
    { name: 'Delete', key: 'delete', type: 'danger' },
  ],
};

function handleDemoApi(urlStr, options) {
  const url = new URL(urlStr, window.location.origin);
  const method = options?.method?.toUpperCase() || 'GET';

  if (method === 'POST') {
    return jsonResponse({
      response: { success: true, message: 'Operation completed successfully' },
      success: true,
    });
  }

  const action = url.searchParams.get('action');

  // Metadata request
  if (action === 'get_table_metadata') {
    const meta = window.__PLAYGROUND_CONFIG__?.metadata || TABLE_METADATA;
    return jsonResponse({
      response: { table_metadata: meta },
      success: true,
    });
  }

  // Detail view
  if (action === 'fetch_item_details') {
    const objectUuid = url.searchParams.get('object_uuid');
    const allRows = window.__PLAYGROUND_CONFIG__?.rows || MOCK_ROWS;
    const row = allRows.find((r) => r.object_uuid === objectUuid) || allRows[0] || {};
    const statusLabel = row.workflow_status?.status_label || 'Active';
    const statusColor = row.workflow_status?.status_color || '#12B76A';
    const detail = window.__PLAYGROUND_CONFIG__?.detailView || {
      pk: row.id,
      object_uuid: row.object_uuid,
      title: row.name,
      general_details: {
        fields: {
          name: { name: 'name', display_name: 'Name', type: 'string', value: row.name },
          email: { name: 'email', display_name: 'Email', type: 'email', value: row.email },
          role: { name: 'role', display_name: 'Role', type: 'string', value: row.role },
          created: { name: 'created', display_name: 'Created', type: 'date', value: row.created },
        },
      },
      workflow_details: {
        current_status: statusLabel.toLowerCase(),
        current_status_meta: {
          name: 'current', from: 'previous', to: statusLabel.toLowerCase(),
          status_label: statusLabel, status_color: statusColor,
          is_form_based: false, is_manual: true,
        },
        next_transitions: [
          { name: 'approve', display_name: 'Approve', from: statusLabel.toLowerCase(), to: 'active', status_label: 'Approved', status_color: '#12B76A', is_form_based: false, is_manual: true, to_state_meta: { status_label: 'Approved', status_color: '#12B76A' } },
          { name: 'reject', display_name: 'Reject', from: statusLabel.toLowerCase(), to: 'inactive', status_label: 'Rejected', status_color: '#F04438', is_form_based: true, is_manual: true, to_state_meta: { status_label: 'Rejected', status_color: '#F04438' } },
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
        { key: 'overview', name: 'overview', title: 'Overview', data: { Name: row.name, Email: row.email, Role: row.role } },
        { key: 'activity', name: 'activity', title: 'Activity', data: { Status: statusLabel, Created: row.created } },
      ],
    };
    return jsonResponse({ response: detail, success: true });
  }

  // Form initialization (Add New or Edit form)
  if (action === 'initialize_form') {
    const formSchema = window.__PLAYGROUND_CONFIG__?.formSchema || {
      is_multistep: false,
      form: {
        json_schema: {
          type: 'object',
          title: 'Demo Form',
          required: ['name', 'email'],
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
    return jsonResponse({ response: formSchema, success: true });
  }

  // Workflow transition execution
  if (action === 'execute_transition' || action === 'toggle_tag') {
    return jsonResponse({ response: { success: true, message: 'Transition executed' }, success: true });
  }

  // Table data (default action or action=get_table_data)
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('page_size') || url.searchParams.get('length') || '10');
  const search = url.searchParams.get('search') || url.searchParams.get('search[value]') || '';

  const allRows = window.__PLAYGROUND_CONFIG__?.rows || MOCK_ROWS;
  const filtered = search
    ? allRows.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase())
      )
    : allRows;

  const start = (page - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);
  const meta = window.__PLAYGROUND_CONFIG__?.metadata || TABLE_METADATA;

  // Backend format: { draw, recordsTotal, recordsFiltered, data: [...] }
  // The crud library checks both json.response.table_data and json.data
  return jsonResponse({
    response: {
      table_data: pageData,
      table_metadata: meta,
      recordsTotal: filtered.length,
      recordsFiltered: filtered.length,
    },
    draw: 0,
    recordsTotal: filtered.length,
    recordsFiltered: filtered.length,
    success: true,
  });
}

function handleGenericApi(urlStr, options) {
  return jsonResponse({ response: {}, success: true });
}

function jsonResponse(data) {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}
