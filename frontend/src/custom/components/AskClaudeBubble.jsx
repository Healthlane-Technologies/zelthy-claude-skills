import React, { useState, useRef, useEffect } from 'react';

const DOCS_CONTEXT = `You are an expert on the Zango CRUD composable architecture library (@zango-core/crud). Help the developer with their question. Here's the full documentation context:

## Key Components
- **CrudHandler**: Main orchestrator. Props: api_endpoint (required), showHeader, showUtilities, showBody, showPagination, enableDetailViewRoute, detailDrawerSize, customHeader, customUtilities, customTableBody, customPagination, customDrawerDetail, customMainDetail, headerProps, utilityProps, customClass, customStyle.
- **TableBody**: Row display with defaultDetailView ('drawer'|'navigate'|'custom'), selectedRow, drawerOpen, isLoading, isFetching.
- **TableHeader**: Page header with title, totalCount, showCount, showAddButton, addButtonTitle, onAddClick, extraActions, children, api_endpoint, enableDefaultAddForm.
- **TableUtilities**: Action bar with showSearch, showUpload, showDownload, showFiltersButton, showColumnOptions, searchPlaceholder, children.
- **TablePagination**: showRowsPerPage, rowsPerPageOptions, showPageInfo.
- **TableSearch**: Standalone search with placeholder, leftIcon, rightIcon.
- **TableAddButton**: buttonText, onClick, variant, size, showIcon, icon, iconPosition, onFormSuccess, drawerTitle, drawerSize.

## Styling System
Two approaches: customClass (CSS class strings per element) and customStyle (dynamic style functions with state access).
Elements: container, tableWrapper, table, headerRow, headerCell, headerCellPinned, sortButton, bodyRow, bodyRowSelected, bodyCell, bodyCellPinned, utilitiesContainer, filterButton, searchInput, uploadButton, downloadButton, paginationContainer, paginationButton, filterSidebar, actionsContainer, actionButton, statusBadge, tagsContainer, workflowContainer.
State objects: RowState (rowIndex, isSelected, isHovered, rowData), HeaderCellState (isPinned, canSort, columnId), ActionButtonState (action, isFirst, isInDropdown).

## useTable() Hook
Returns: data, totalCount, isLoading, currentPage, rowsPerPage, totalPages, hasPreviousPage, hasNextPage, setCurrentPage, setRowsPerPage, selectedDetailRow, openDetailDrawer, closeDetailDrawer, navigateToNextEntry, navigateToPreviousEntry, searchTerm, setSearchTerm, activeFilterCount, handleRowClick, refetch, api_endpoint.

## Detail Views
Drawer (side panel) and Main (route-based). Both auto-fetch data. Props provided: data, api_endpoint, loading, error, onRefresh, objectUuid, pk, title, generalDetails, workflowDetails, sections.

## Workflow Components
- **WorkflowStatus**: apiUrl, workflowDetails, formContainerId, onStatusChange, beforeTransition, afterTransition, confirmationAlert, renderTransitions, onFormCancel.
- **WorkflowTags**: apiUrl, tagDetails, formContainerId, onTagChange, beforeTagChange, afterTagChange, renderTags, onFormCancel.
- **DetailViewProvider**: Wraps components for shared context. Usage: <DetailViewProvider apiUrl="..."><WorkflowStatus /><WorkflowTags /></DetailViewProvider>
- **useWorkflow()**: Returns workflowDetails, loading, error, refreshWorkflow, executeTransition, toggleTag.
- **useDetailView()**: Returns data, loading, error, refresh, objectUuid, apiUrl, workflowDetails.

## FormRenderer
Dual-mode: server-driven (api_endpoint) or local RJSF (rjsf_schema). Props: api_endpoint, getParams, postParams, showConfirmAlert, customConfirmAlert, rjsf_schema, onSubmit, onResponse, onError. If api_endpoint provided, rjsf_schema and onSubmit are ignored.

## Render Props
Pass to Table component: renderActions({actions, row, onActionClick, menuOpen, setMenuOpen}), renderStatus({value, statusValue, isObject, isString, isHtml}), renderTags({tags, visibleTags, remainingTags, hasMoreTags, maxVisible}).

## Imports
- Table components: import { CrudHandler, useTable, TableBody, TableHeader, ... } from '@zango-core/crud/table';
- Form: import { FormRenderer } from '@zango-core/crud/form';
- Workflow: import { WorkflowStatus, WorkflowTags, DetailViewProvider } from '@zango-core/crud/table';
`;

const QUICK_QUESTIONS = [
  "How do I customize the table header with extra actions?",
  "How do I create a dark theme for CrudHandler?",
  "How do I use WorkflowStatus with a custom dialog?",
  "How do I build a form with FormRenderer using local schema?",
  "How do I access table data from a custom component?",
];

const AskClaudeBubble = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [copied, setCopied] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const askClaude = async (q) => {
    const prompt = `${DOCS_CONTEXT}\n\n---\n\nDeveloper's question:\n${q}`;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => {
        window.open('https://claude.ai/new', '_blank');
        setCopied(false);
      }, 600);
    } catch {
      // Fallback
      window.open('https://claude.ai/new', '_blank');
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 52, height: 52, borderRadius: 16,
          background: 'linear-gradient(135deg, #5048ED 0%, #7c3aed 100%)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(80, 72, 237, 0.4), 0 2px 8px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          transform: open ? 'scale(0.95)' : 'scale(1)',
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed', bottom: 88, right: 24, zIndex: 9998,
            width: 380, maxHeight: 520, borderRadius: 16,
            backgroundColor: '#fff', border: '1px solid #e5e7eb',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            animation: 'slideUp 0.25s ease-out',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
            background: 'linear-gradient(135deg, #5048ED 0%, #7c3aed 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Ask Claude</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>About Zango CRUD library</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
            <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, margin: '0 0 14px' }}>
              Type your question below. We'll package it with the full CRUD docs context, copy to clipboard, and open Claude for you.
            </p>

            {/* Quick questions */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Quick questions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => askClaude(q)}
                    style={{
                      padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
                      backgroundColor: '#f9fafb', cursor: 'pointer', textAlign: 'left',
                      fontSize: 12, color: '#374151', fontFamily: 'inherit',
                      transition: 'all 0.15s', lineHeight: 1.4,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.backgroundColor = '#EAE8FF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && question.trim()) askClaude(question); }}
                placeholder="Ask anything about Zango CRUD..."
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 10, border: '1px solid #d1d5db',
                  fontSize: 13, color: '#374151', outline: 'none', backgroundColor: '#fff',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#818cf8'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; }}
              />
              <button
                onClick={() => { if (question.trim()) askClaude(question); }}
                disabled={!question.trim()}
                style={{
                  padding: '9px 16px', borderRadius: 10, border: 'none',
                  background: question.trim() ? 'linear-gradient(135deg, #5048ED, #7c3aed)' : '#d1d5db',
                  color: '#fff', fontSize: 13, fontWeight: 600, cursor: question.trim() ? 'pointer' : 'default',
                  fontFamily: 'inherit', transition: 'opacity 0.15s', whiteSpace: 'nowrap',
                }}
              >
                {copied ? '✓ Copied!' : 'Ask →'}
              </button>
            </div>
            <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 6, textAlign: 'center' }}>
              Copies prompt with docs context to clipboard & opens Claude.ai
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default AskClaudeBubble;
