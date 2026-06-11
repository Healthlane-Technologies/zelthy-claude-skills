# Async Tasks in Zango

Async tasks in Zango enable non-blocking execution and improve the overall responsiveness and scalability of your application. They allow you to offload time-consuming operations like database queries, API calls, and file processing to run in the background.

## Overview

Zango provides two primary ways to execute async tasks:

1. **Direct Invocation** — Trigger tasks programmatically from anywhere in your code
2. **Scheduled Execution** — Configure tasks to run automatically at predetermined intervals

## Creating Async Tasks

### File Location

Create a `tasks.py` file in your module directory:
```
workspaces/<app_name>/backend/<module_name>/tasks.py
```

### Task Definition

Tasks are regular Python functions decorated with `@shared_task` from Celery:

```python
from celery import shared_task

@shared_task
def my_async_task(param1, param2):
    # Task logic here
    # Perform database operations, API calls, file processing, etc.
    pass

@shared_task
def send_email_notification(user_id, message):
    # Email sending logic
    pass

@shared_task
def process_data():
    # Data processing logic
    pass
```

**Key Points:**
- Multiple tasks can be defined in a single `tasks.py` file
- Each task must use the `@shared_task` decorator
- Tasks are regular Python functions that can accept parameters
- Suitable for time-consuming operations that shouldn't block the main application

## Manually Triggering Async Tasks

You can trigger async tasks programmatically from views, forms, or any other part of your code.

### Import the Executor

```python
from zango.core.tasks import zango_task_executor
```

### Execute the Task

```python
zango_task_executor.delay(
    request.tenant.name,
    "backend.module_name.tasks.task_function_name",
    # Optional: pass keyword arguments to the task
    param1="value1",
    param2="value2"
)
```

**IMPORTANT:** Use the full path from app root (e.g., `backend.notifications.tasks.send_email`, not just `notifications.tasks.send_email`).

### Example: Triggering from a View

```python
from zango.core.tasks import zango_task_executor
from django.http import JsonResponse

def trigger_notification(request):
    # Trigger async task
    zango_task_executor.delay(
        request.tenant.name,
        "backend.notifications.tasks.send_email_notification",
        user_id=request.user.id,
        message="Your report is ready"
    )

    return JsonResponse({"status": "Task triggered"})
```

### Parameters

- **Tenant name** (required): `request.tenant.name` — specifies which tenant the task belongs to
- **Task path** (required): Full path string to the task function from app root (e.g., `"backend.module_name.tasks.function_name"`)
- **Keyword arguments** (optional): Any parameters the task function expects

### Running a task synchronously (manual trigger / debugging)

`zango_task_executor.delay(...)` enqueues the task for the Celery worker. If the worker is slow, stuck, or you just want to run a task **right now and see errors inline**, call the executor **without `.delay()`** — it runs synchronously in the current process (no worker involved):

```python
# Synchronous, in-process — bypasses Celery entirely
zango_task_executor("<app_name>", "backend.<module>.tasks.<task_function>", param1="value1")
```

This is handy when a `.delay()` task seems to hang (in venv mode the usual cause is no running worker — see bootstrap-templates.md). One-liner from the shell (non-interactive):

```bash
cd <PROJECT_NAME> && PATH="<venv_path>/bin:$PATH" python manage.py shell -c \
  "from zango.core.tasks import zango_task_executor; zango_task_executor('<app_name>', 'backend.<module>.tasks.<task_function>', log_id=<id>)"
```

- `<app_name>` = the workspace/tenant name. `zango_task_executor(tenant_name, task_name, *args, **kwargs)` switches into that tenant before running.
- The task path must match how the task is registered (full path from app root, e.g. `backend.document_ai.tasks.validate_document_ai`).
- Pass whatever args/kwargs the task expects (e.g. some tasks take a `log_id` / record id to update). Running it synchronously surfaces the traceback directly instead of it disappearing into the worker log.

> **AI agent flows:** when an agent is invoked (including from a task), each run is recorded as an **invocation log** viewable in the **App Panel UI → AI → (agent) → Invocations/Logs**. Check there for the prompt, response, token usage, latency, tool calls, and any error for a given run — it's usually faster than digging through Celery/worker output.

## Scheduling Async Tasks

Tasks can be configured to run automatically at specified intervals or times.

> **Scheduled tasks require a running Celery *beat* process** (separate from the worker). Beat is what enqueues scheduled tasks at their due time; the worker then executes them. Without beat, a scheduled task is configured but **never fires**. In **Docker** mode the `celery_beat` service runs it automatically. In **venv** mode you must start beat yourself — see bootstrap-templates.md → Venv Mode Bootstrap **Step 8a** (`celery -A <PROJECT_NAME> beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler`). This is the scheduling analogue of the "missing worker" trap.

### Configuration via App Panel UI

1. Navigate to **Tasks** menu in the App Panel
2. Click **Sync** button to load latest tasks from codebase
3. Find your task in the list
4. Click the three-dot menu icon next to the task
5. Select **Update Task**
6. Configure:
   - **Frequency** — how often the task runs
   - **Timing** — when the task should execute
   - **Enable/Disable** — activate or deactivate the task
7. Save your configuration

### Configuration via API

See [app-panel-api.md](../app-panel-api.md) for programmatic task scheduling using the Tasks API endpoints.

## Syncing Async Tasks

After creating or modifying tasks in your codebase, you must sync them to make them available in the platform.

### Via API (use this)

This is the "Sync Tasks" button in the platform UI. It's a plain HTTP call — identical in Docker and venv mode:

```bash
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/tasks/" \
  -H "X-CSRFToken: $CSRF" \
  -H "Referer: http://localhost:8000/platform/"
```

See [app-panel-api.md](../app-panel-api.md) → Tasks (sync async tasks) for full details.

### Via App Panel UI (manual alternative)

1. Navigate to **Tasks** menu → click **Sync** → wait for it to complete; new tasks appear in the list.

## Restarting Celery Service

**CRITICAL:** After creating or modifying async tasks, you must restart the Celery service for changes to take effect.

> **Setup mode:** Docker syntax shown. For venv mode, use the venv variant from SKILL.md STEP 5.

```bash
docker compose -f deploy/docker_compose.yml restart celery
```

## Viewing Async Tasks

Access async tasks through the App Panel:

1. Navigate to **Tasks** menu
2. View table with task details:
   - Task name
   - Status (enabled/disabled)
   - Execution frequency
   - Last run time
   - Other relevant information

If recently added tasks don't appear, click the **Sync** button to refresh the list.

## Common Use Cases

- **Background data synchronization** — sync data with external APIs
- **Cleanup processes** — remove old records, clear caches
- **Periodic calculations** — generate reports, aggregate statistics
- **Email/SMS notifications** — send communications without blocking requests
- **File processing** — handle uploads, generate PDFs, process images
- **Database maintenance** — optimize tables, update denormalized data

## Best Practices

1. **Keep tasks idempotent** — tasks should be safe to retry if they fail
2. **Handle errors gracefully** — use try/except blocks and log errors
3. **Avoid long-running tasks** — break large tasks into smaller chunks
4. **Use task parameters** — make tasks reusable with different inputs
5. **Sync after changes** — always sync and restart celery after modifying tasks
6. **Monitor task execution** — check logs and task status regularly

## Workflow Summary

```
1. Create tasks.py in your module
   └─> Define functions with @shared_task decorator

2. Sync tasks
   └─> Call Sync Tasks API: POST /api/v1/apps/<uuid>/tasks/
       (see app-panel-api.md → Tasks → Sync Tasks)

3. Restart Celery
   └─> docker compose restart celery

4. Trigger tasks
   ├─> Manually: use zango_task_executor.delay() with full path
   └─> Scheduled: configure via App Panel or API

5. Monitor tasks
   └─> View in App Panel Tasks menu
```
