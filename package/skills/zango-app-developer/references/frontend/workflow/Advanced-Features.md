# Advanced Features
Advanced

Programmatic form control, portal rendering, error handling, and migration guides.

**Sections:** Programmatic Form Control (onFormCancel) | Glitch-Free Portal Rendering | Error Handling & Timeouts | Migration Guide

## Code Examples

### programmatic-form-control.jsx
```jsx
import { useRef } from "react";
import { WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const statusFormRef = useRef(null);
  const tagFormRef = useRef(null);

  const closeAllForms = () => {
    statusFormRef.current?.();
    tagFormRef.current?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Order Detail</h2>
        <button
          onClick={closeAllForms}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300
                     rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close All Forms
        </button>
      </div>

      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        onFormCancel={statusFormRef}
```

### glitch-free-portal.jsx
```jsx
import { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderWorkflow({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogReady, setDialogReady] = useState(false);
  const cancelRef = useRef(null);

  // When dialog opens, wait for DOM to be ready before enabling portal
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        setDialogReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDialogReady(false);
    }
  }, [showDialog]);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        formContainerId={dialogReady ? "workflow-form-portal" : undefined}
        onFormCancel={cancelRef}
        beforeTransition={async (transition) => {
          setShowDialog(true);
          // Wait for dialog DOM to mount
          await new Promise((resolve) => setTimeout(resolve, 100));
        }}
        afterTransition={async (transition, success) => {
          if (success) {
            setShowDialog(false);
          }
        }}
```

### error-handling.jsx
```jsx
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderWorkflow({ objectUuid }) {
  return (
    <WorkflowStatus
      apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
      afterTransition={async (transition, success) => {
        if (!success) {
          // The component already displays an error message.
          // Use this callback for additional error handling:
          console.error("Transition failed:", transition.label);

          // Send to error tracking
          // errorTracker.capture("workflow_transition_failed", { transition });
        }
      }}
      onStatusChange={() => {
        // Only called on success — safe to refresh data here
        window.location.reload();
      }}
```

### before-migration.jsx
```jsx
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        formContainerId="workflow-form"
        beforeTransition={async () => {
          setShowDialog(true);
        }}
        afterTransition={async (transition, success) => {
          if (success) setShowDialog(false);
        }}
```

### after-migration.jsx
```jsx
import { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogReady, setDialogReady] = useState(false);  // NEW: track DOM readiness
  const cancelRef = useRef(null);                          // NEW: programmatic cancel

  // NEW: delay portal activation until dialog DOM is mounted
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => setDialogReady(true), 100);
      return () => clearTimeout(timer);
    }
    setDialogReady(false);
  }, [showDialog]);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        formContainerId={dialogReady ? "workflow-form" : undefined}  // CHANGED: conditional
        onFormCancel={cancelRef}                                      // NEW: cancel ref
        beforeTransition={async () => {
          setShowDialog(true);
          await new Promise((r) => setTimeout(r, 100));              // NEW: wait for DOM
        }}
        afterTransition={async (transition, success) => {
          if (success) setShowDialog(false);
        }}
```

