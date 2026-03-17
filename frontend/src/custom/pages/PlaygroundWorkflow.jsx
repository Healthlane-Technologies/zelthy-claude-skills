import React, { useState, useCallback } from 'react';
import { FileText, AlertTriangle, Zap } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

const Panel = ({ title, children, actions, style = {} }) => (
  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', ...style }}>
    <div style={{ padding: '8px 14px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>{title}</span>
      {actions}
    </div>
    <div style={{ padding: 12 }}>{children}</div>
  </div>
);

const CodeEditor = ({ value, onChange, minHeight = 200 }) => (
  <textarea value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false}
    style={{ width: '100%', minHeight, padding: 12, borderRadius: 8, border: '1px solid #1e293b', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.6, backgroundColor: '#0f172a', color: '#e2e8f0', resize: 'vertical', outline: 'none', boxSizing: 'border-box', tabSize: 2 }}
  />
);

const DEFAULT_WORKFLOW = {
  current_status: 'draft',
  current_status_meta: {
    name: 'submit', from: 'new', to: 'draft',
    status_label: 'Draft', status_color: '#F79009',
    is_form_based: false, is_manual: true,
  },
  next_transitions: [
    { name: 'submit', display_name: 'Submit for Review', from: 'draft', to: 'submitted', status_label: 'Submitted', status_color: '#2196F3', is_form_based: false, is_manual: true, confirmation_message: 'Are you sure you want to submit this for review?', to_state_meta: { status_label: 'Submitted', status_color: '#2196F3' } },
    { name: 'approve', display_name: 'Approve', from: 'draft', to: 'approved', status_label: 'Approved', status_color: '#12B76A', is_form_based: true, is_manual: true, to_state_meta: { status_label: 'Approved', status_color: '#12B76A' } },
    { name: 'reject', display_name: 'Reject', from: 'draft', to: 'rejected', status_label: 'Rejected', status_color: '#F04438', is_form_based: true, is_manual: true, to_state_meta: { status_label: 'Rejected', status_color: '#F04438' } },
    { name: 'hold', display_name: 'Put on Hold', from: 'draft', to: 'on_hold', status_label: 'On Hold', status_color: '#98A2B3', is_form_based: false, is_manual: true, confirmation_message: 'This will pause all processing. Continue?', to_state_meta: { status_label: 'On Hold', status_color: '#98A2B3' } },
  ],
  tag_details: [
    { name: 'urgent', state: 'disabled', tag_label: 'Urgent', enable: { confirmation_message: 'Mark as urgent? This will notify all stakeholders.', is_form_based: false }, disable: { confirmation_message: 'Remove urgent flag?', is_form_based: false }, is_enable_allowed: true, is_disable_allowed: true },
    { name: 'reviewed', state: 'enabled', tag_label: 'Reviewed', enable: { confirmation_message: false, is_form_based: false }, disable: { confirmation_message: false, is_form_based: false }, is_enable_allowed: true, is_disable_allowed: true },
    { name: 'flagged', state: 'disabled', tag_label: 'Flagged for Follow-up', enable: { confirmation_message: false, is_form_based: true }, disable: { confirmation_message: false, is_form_based: false }, is_enable_allowed: true, is_disable_allowed: true },
    { name: 'compliance', state: 'disabled', tag_label: 'Compliance Check', enable: { confirmation_message: false, is_form_based: true }, disable: { confirmation_message: 'Removing compliance check requires manager approval. Proceed?', is_form_based: true }, is_enable_allowed: true, is_disable_allowed: true },
  ],
};

const Toggle = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
    <div onClick={() => onChange(!checked)}
      style={{ width: 32, height: 18, borderRadius: 9, backgroundColor: checked ? '#5048ED' : '#d1d5db', position: 'relative', transition: 'background-color 0.2s', cursor: 'pointer', flexShrink: 0 }}>
      <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff', position: 'absolute', top: 2, left: checked ? 16 : 2, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </div>
    <span style={{ color: '#374151', fontWeight: 500 }}>{label}</span>
  </label>
);

const PlaygroundWorkflow = () => {
  const [workflowText, setWorkflowText] = useState(JSON.stringify(DEFAULT_WORKFLOW, null, 2));
  const [workflow, setWorkflow] = useState(DEFAULT_WORKFLOW);
  const [error, setError] = useState(null);
  const [actionLog, setActionLog] = useState([]);

  // WorkflowStatus config
  const [statusBeforeTransition, setStatusBeforeTransition] = useState(true);
  const [statusAfterTransition, setStatusAfterTransition] = useState(true);
  const [statusFormContainer, setStatusFormContainer] = useState(false);
  const [statusOnFormCancel, setStatusOnFormCancel] = useState(false);
  const [statusCustomRendering, setStatusCustomRendering] = useState(false);

  // WorkflowTags config
  const [tagBeforeChange, setTagBeforeChange] = useState(true);
  const [tagAfterChange, setTagAfterChange] = useState(true);
  const [tagFormContainer, setTagFormContainer] = useState(false);
  const [tagOnFormCancel, setTagOnFormCancel] = useState(false);

  const applyChanges = useCallback(() => {
    try {
      const parsed = JSON.parse(workflowText);
      setWorkflow(parsed);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [workflowText]);

  // Modal state
  const [modal, setModal] = useState(null); // { type: 'form'|'confirm', title, message, onConfirm }

  const logAction = (msg) => setActionLog((prev) => [{ time: new Date().toLocaleTimeString(), msg }, ...prev].slice(0, 20));

  const commitTransition = (t) => {
    logAction(`Transition executed: ${t.display_name} (${t.from} → ${t.to})`);
    const newWorkflow = {
      ...workflow,
      current_status: t.to,
      current_status_meta: { ...t.to_state_meta, name: t.name, from: t.from, to: t.to, is_form_based: t.is_form_based, is_manual: t.is_manual },
    };
    setWorkflow(newWorkflow);
    setWorkflowText(JSON.stringify(newWorkflow, null, 2));
    setModal(null);
  };

  const executeTransition = (t) => {
    if (t.is_form_based) {
      logAction(`Form opened for: ${t.display_name}`);
      setModal({ type: 'form', title: t.display_name, transition: t, onConfirm: () => commitTransition(t) });
    } else if (t.confirmation_message) {
      logAction(`Confirmation shown for: ${t.display_name}`);
      setModal({ type: 'confirm', title: t.display_name, message: t.confirmation_message, onConfirm: () => commitTransition(t) });
    } else {
      commitTransition(t);
    }
  };

  const commitTagToggle = (tag) => {
    const newState = tag.state === 'enabled' ? 'disabled' : 'enabled';
    logAction(`Tag toggled: ${tag.tag_label} → ${newState}`);
    const newTags = workflow.tag_details.map((t) =>
      t.name === tag.name ? { ...t, state: newState } : t
    );
    const newWorkflow = { ...workflow, tag_details: newTags };
    setWorkflow(newWorkflow);
    setWorkflowText(JSON.stringify(newWorkflow, null, 2));
    setModal(null);
  };

  const toggleTag = (tag) => {
    const action = tag.state === 'enabled' ? tag.disable : tag.enable;
    if (action?.is_form_based) {
      logAction(`Form opened for tag: ${tag.tag_label}`);
      setModal({ type: 'form', title: `${tag.state === 'enabled' ? 'Disable' : 'Enable'} ${tag.tag_label}`, tag, onConfirm: () => commitTagToggle(tag) });
    } else if (action?.confirmation_message) {
      logAction(`Confirmation shown for tag: ${tag.tag_label}`);
      setModal({ type: 'confirm', title: tag.tag_label, message: action.confirmation_message, onConfirm: () => commitTagToggle(tag) });
    } else {
      commitTagToggle(tag);
    }
  };

  const cancelModal = () => {
    logAction(`Modal cancelled: ${modal?.title}`);
    setModal(null);
  };

  const statusColor = workflow.current_status_meta?.status_color || '#6b7280';
  const statusLabel = workflow.current_status_meta?.status_label || workflow.current_status;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div style={{ padding: '32px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4f46e5', backgroundColor: '#eef2ff', border: '1px solid #e0e7ff', padding: '4px 10px', borderRadius: 20, marginBottom: 10 }}>Playground</span>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Workflow Playground</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>Simulate workflow transitions, toggle tags, edit workflow state — see how WorkflowStatus and WorkflowTags behave.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Config */}
          <div style={{ display: 'flex', gap: 12 }}>
            <Panel title="WorkflowStatus Props" style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Toggle label="beforeTransition" checked={statusBeforeTransition} onChange={setStatusBeforeTransition} />
                <Toggle label="afterTransition" checked={statusAfterTransition} onChange={setStatusAfterTransition} />
                <Toggle label="formContainerId" checked={statusFormContainer} onChange={setStatusFormContainer} />
                <Toggle label="onFormCancel (ref)" checked={statusOnFormCancel} onChange={setStatusOnFormCancel} />
                <Toggle label="renderTransitions" checked={statusCustomRendering} onChange={setStatusCustomRendering} />
              </div>
            </Panel>
            <Panel title="WorkflowTags Props" style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Toggle label="beforeTagChange" checked={tagBeforeChange} onChange={setTagBeforeChange} />
                <Toggle label="afterTagChange" checked={tagAfterChange} onChange={setTagAfterChange} />
                <Toggle label="formContainerId" checked={tagFormContainer} onChange={setTagFormContainer} />
                <Toggle label="onFormCancel (ref)" checked={tagOnFormCancel} onChange={setTagOnFormCancel} />
              </div>
            </Panel>
          </div>

          {/* Live Workflow Simulation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Status + Transitions */}
            <Panel title="Current Status & Transitions">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, marginBottom: 6 }}>Current Status</div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600,
                  padding: '8px 16px', borderRadius: 10,
                  backgroundColor: `${statusColor}15`, color: statusColor,
                  border: `1px solid ${statusColor}30`,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColor }} />
                  {statusLabel}
                </span>
              </div>

              <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, marginBottom: 6 }}>Available Transitions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(workflow.next_transitions || []).map((t) => (
                  <button key={t.name} onClick={() => executeTransition(t)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb',
                      cursor: 'pointer', backgroundColor: '#fff', fontFamily: 'inherit',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.to_state_meta?.status_color || '#5048ED'; e.currentTarget.style.backgroundColor = `${t.to_state_meta?.status_color || '#5048ED'}08`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#fff'; }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{t.display_name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>
                        {t.from} → {t.to}
                        {' · '}
                        <span style={{ fontWeight: 500, color: t.is_form_based ? '#5048ED' : t.confirmation_message ? '#F79009' : '#12B76A', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          {t.is_form_based ? <><FileText size={10} /> form</> : t.confirmation_message ? <><AlertTriangle size={10} /> confirmation</> : <><Zap size={10} /> direct</>}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                      backgroundColor: `${t.to_state_meta?.status_color || '#6b7280'}15`,
                      color: t.to_state_meta?.status_color || '#6b7280',
                    }}>{t.to_state_meta?.status_label}</span>
                  </button>
                ))}
                {(!workflow.next_transitions || workflow.next_transitions.length === 0) && (
                  <div style={{ padding: 16, textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>No transitions available from this status</div>
                )}
              </div>
            </Panel>

            {/* Tags */}
            <Panel title="Tags">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(workflow.tag_details || []).map((tag) => (
                  <div key={tag.name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 8,
                    backgroundColor: tag.state === 'enabled' ? '#EAE8FF' : '#f9fafb',
                    border: `1px solid ${tag.state === 'enabled' ? '#5048ED30' : '#e5e7eb'}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: tag.state === 'enabled' ? '#5048ED' : '#374151' }}>{tag.tag_label}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <span>{tag.state === 'enabled' ? 'Enabled' : 'Disabled'}</span>
                        <span>·</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 500, color: tag.enable?.is_form_based ? '#5048ED' : tag.enable?.confirmation_message ? '#F79009' : '#12B76A' }}>
                          {tag.enable?.is_form_based ? <FileText size={9} /> : tag.enable?.confirmation_message ? <AlertTriangle size={9} /> : <Zap size={9} />}
                          en:{tag.enable?.is_form_based ? 'form' : tag.enable?.confirmation_message ? 'confirm' : 'direct'}
                        </span>
                        <span>·</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 500, color: tag.disable?.is_form_based ? '#5048ED' : tag.disable?.confirmation_message ? '#F79009' : '#12B76A' }}>
                          {tag.disable?.is_form_based ? <FileText size={9} /> : tag.disable?.confirmation_message ? <AlertTriangle size={9} /> : <Zap size={9} />}
                          dis:{tag.disable?.is_form_based ? 'form' : tag.disable?.confirmation_message ? 'confirm' : 'direct'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => toggleTag(tag)}
                      style={{
                        padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        border: 'none', transition: 'all 0.12s',
                        backgroundColor: tag.state === 'enabled' ? '#5048ED' : '#e5e7eb',
                        color: tag.state === 'enabled' ? '#fff' : '#374151',
                      }}>
                      {tag.state === 'enabled' ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Action Log */}
          {actionLog.length > 0 && (
            <Panel title="Action Log" actions={
              <button onClick={() => setActionLog([])} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, border: '1px solid #d1d5db', cursor: 'pointer', backgroundColor: '#fff', color: '#6b7280', fontFamily: 'inherit' }}>Clear</button>
            }>
              <div style={{ maxHeight: 150, overflowY: 'auto' }}>
                {actionLog.map((entry, i) => (
                  <div key={i} style={{ fontSize: 11, padding: '4px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#9ca3af', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, flexShrink: 0 }}>{entry.time}</span>
                    <span style={{ color: '#374151' }}>{entry.msg}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Editable Workflow JSON */}
          <Panel title="Workflow Details JSON (editable)" actions={
            <button onClick={applyChanges} style={{ padding: '2px 12px', borderRadius: 4, border: 'none', fontSize: 11, cursor: 'pointer', backgroundColor: '#5048ED', color: '#fff', fontWeight: 600, fontFamily: 'inherit' }}>Apply</button>
          }>
            <CodeEditor value={workflowText} onChange={setWorkflowText} minHeight={250} />
            {error && <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444' }}>Error: {error}</div>}
          </Panel>

          {/* Generated Code */}
          {/* Generated Code */}
          <CodeBlock language="jsx" title="Generated Code" code={(() => {
            const hasFormCancel = statusOnFormCancel || tagOnFormCancel;
            const hasFormContainer = statusFormContainer || tagFormContainer;
            const lines = [
              `import { WorkflowStatus, WorkflowTags, DetailViewProvider } from "@zango-core/crud/table";`,
              hasFormCancel ? `import { useRef } from "react";` : null,
              hasFormContainer ? `import { useState } from "react";` : null,
              ``,
              statusOnFormCancel ? `const statusCancelRef = useRef(null);` : null,
              tagOnFormCancel ? `const tagCancelRef = useRef(null);` : null,
              hasFormContainer ? `const [showDialog, setShowDialog] = useState(false);` : null,
              ``,
              `<DetailViewProvider apiUrl="/api/demo/?object_uuid=uuid-0001">`,
              `  <WorkflowStatus`,
              `    onStatusChange={() => refetch()}`,
              statusBeforeTransition ? `    beforeTransition={async (transition) => {\n      console.log("Starting:", transition.display_name);${statusFormContainer ? '\n      if (transition.is_form_based) setShowDialog(true);' : ''}\n    }}` : null,
              statusAfterTransition ? `    afterTransition={async (transition, success) => {\n      console.log("Done:", transition.display_name, success);${statusFormContainer ? '\n      if (success) setShowDialog(false);' : ''}\n    }}` : null,
              statusFormContainer ? `    formContainerId="status-form-container"` : null,
              statusOnFormCancel ? `    onFormCancel={statusCancelRef}` : null,
              statusCustomRendering ? `    renderTransitions={({ transitions, onTransitionClick, statusLabel }) => (\n      <div className="flex gap-2">\n        <span>{statusLabel}</span>\n        {transitions.map(t => (\n          <button key={t.name} onClick={() => onTransitionClick(t)}>\n            {t.display_name}\n          </button>\n        ))}\n      </div>\n    )}` : null,
              `  />`,
              ``,
              `  <WorkflowTags`,
              `    onTagChange={() => refetch()}`,
              tagBeforeChange ? `    beforeTagChange={async (tag, newState) => {\n      console.log("Tag changing:", tag.tag_label, "→", newState);\n    }}` : null,
              tagAfterChange ? `    afterTagChange={async (tag, success) => {\n      console.log("Tag changed:", tag.tag_label, success);\n    }}` : null,
              tagFormContainer ? `    formContainerId="tag-form-container"` : null,
              tagOnFormCancel ? `    onFormCancel={tagCancelRef}` : null,
              `  />`,
              `</DetailViewProvider>`,
              hasFormContainer ? `\n{/* Form container for portal rendering */}\n<Dialog open={showDialog} onOpenChange={setShowDialog}>` : null,
              statusFormContainer ? `  <div id="status-form-container" />` : null,
              tagFormContainer ? `  <div id="tag-form-container" />` : null,
              hasFormContainer ? `</Dialog>` : null,
              hasFormCancel ? `\n{/* Programmatic cancel */}\n<button onClick={() => {${statusOnFormCancel ? '\n  statusCancelRef.current?.();' : ''}${tagOnFormCancel ? '\n  tagCancelRef.current?.();' : ''}\n}}>Cancel Form</button>` : null,
            ].filter(Boolean).join('\n');
            return lines;
          })()} />
        </div>
      </div>

      {/* Modal overlay for form/confirmation */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={cancelModal}>
          <div style={{
            backgroundColor: '#fff', borderRadius: 16, width: modal.type === 'form' ? 480 : 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
          }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: modal.type === 'form' ? '#EAE8FF' : '#FEF3C7',
                  color: modal.type === 'form' ? '#5048ED' : '#D97706',
                }}>
                  {modal.type === 'form' ? <FileText size={16} /> : <AlertTriangle size={16} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{modal.title}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{modal.type === 'form' ? 'Form-based transition' : 'Confirmation required'}</div>
                </div>
              </div>
              <button onClick={cancelModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18 }}>×</button>
            </div>

            {/* Body */}
            <div style={{ padding: 20 }}>
              {modal.type === 'confirm' && (
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>{modal.message}</p>
              )}
              {modal.type === 'form' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Reason / Comments *</label>
                    <textarea rows={3} placeholder="Enter reason for this transition..."
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      onFocus={(e) => { e.target.style.borderColor = '#818cf8'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Attachment (optional)</label>
                    <input type="file" style={{ fontSize: 12, color: '#6b7280' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: 8, backgroundColor: '#f9fafb' }}>
              <button onClick={cancelModal}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, cursor: 'pointer', backgroundColor: '#fff', color: '#374151', fontFamily: 'inherit', fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={modal.onConfirm}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 13, cursor: 'pointer', backgroundColor: '#5048ED', color: '#fff', fontFamily: 'inherit', fontWeight: 600 }}>
                {modal.type === 'form' ? 'Submit' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaygroundWorkflow;
