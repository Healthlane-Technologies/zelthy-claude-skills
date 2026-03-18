# Sync & Manage Async Tasks

## What this does
Syncs background tasks (Celery) from code and manages their schedules.

## Prerequisites
- Inside an app → Code → Async Tasks tab

## Navigation
`/platform/apps/{uuid}/code/#asynctasks`

## Steps

### Sync tasks
1. Click "Sync Tasks" button (top right, purple)
2. Wait for sync
3. New tasks from code appear in the list

### Edit task schedule
1. Find task in list
2. Click "Edit" button
3. Set cron schedule (5 fields: minute hour day month weekday)
4. Activate/deactivate
5. Save

### View task history
1. Click "History" button
2. See past executions with status and timestamps

## Task list columns
- Task Name (full Python path, e.g., "backend.module.tasks.task_name")
- ID
- Edit / History buttons
- Status (Active/Inactive)
- Schedule (cron expression: * * * * *)

## Important
- Run "Sync Tasks" after adding new @shared_task functions in backend code
- Celery must be running for tasks to execute (check "Celery Status" in header)
- Schedule uses standard cron format
