# Communication Package — Email Reference

Email in Zango is provided by the Communication package. SMTP/IMAP configuration is managed entirely through the App Panel UI — credentials are **not** stored in app secrets or `.env`.

> **Other channels**: The Communication package also supports SMS, audio calls, and video calls. Those channels follow the same activate-configure-use pattern but are documented separately.

## Essential Import

```python
from ..packages.communication.email.utils import Email
```

> Use relative imports. Count dots based on your file's depth from the app root. A file in `backend/mymodule/views.py` uses `..packages`, while `backend/mymodule/submodule/views.py` uses `...packages`. See [modules.md](../../core/modules.md) for depth rules.

---

## Table of Contents

1. [Setup Checklist](#setup-checklist)
2. [Step 1 — Activate Email Service](#step-1--activate-email-service)
3. [Step 2 — Add SMTP/IMAP Configuration](#step-2--add-smtpimap-configuration)
4. [Sending Email from Code](#sending-email-from-code)
5. [Email Parameters](#email-parameters)
6. [Attachments](#attachments)
7. [Selecting a Config](#selecting-a-config)
8. [Sending Email from Dashboard](#sending-email-from-dashboard)
9. [Sending Email via REST API](#sending-email-via-rest-api)
10. [Sending Email Asynchronously (Recommended)](#sending-email-asynchronously-recommended)
11. [Sending Email on Workflow Transition](#sending-email-on-workflow-transition)
12. [Receiving Email (IMAP Sync Task)](#receiving-email-imap-sync-task)
13. [Complete Examples](#complete-examples)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)
16. [Verification Checklist](#verification-checklist)

---

## Setup Checklist

Before writing any email code, complete these steps in order:

- [ ] Install the Communication package (see [overview.md](overview.md))
- [ ] Activate the Email service in App Panel
- [ ] Add at least one SMTP/IMAP configuration
- [ ] Mark one configuration as **default** (required for dashboard sending and codebased sending without explicit `config` key)
- [ ] (Receiving only) Configure IMAP fields and enable the sync task

---

## Step 1 — Activate Email Service

1. App Panel → Packages → Communication → **View Details**
2. In the communications list, find **Email**
3. Toggle the switch to **activate** it

⚠️ **Critical**: Without activation, `send_email()` calls will create transaction records but will **not** actually deliver emails. No error is raised — messages silently fail to send.

---

## Step 2 — Add SMTP/IMAP Configuration

App Panel → Packages → Communication → View Details → **Email** tab → **New SMTP/IMAP**

### SMTP Fields (for sending)

| Field | Description | Example |
|-------|-------------|---------|
| **From Email** | Sender address | `noreply@myapp.com` |
| **SMTP Host** | Hostname or IP of the SMTP server | `smtp.gmail.com` |
| **SMTP Port** | Port number | `587` (TLS) / `465` (SSL) |
| **SMTP Username** | Auth username | `noreply@myapp.com` |
| **SMTP Password** | Auth password | — |
| **SMTP Encryption** | Encryption type | `TLS` or `SSL` |

### IMAP Fields (for receiving — optional)

| Field | Description | Example |
|-------|-------------|---------|
| **IMAP Host** | Hostname or IP of the IMAP server | `imap.gmail.com` |
| **IMAP Port** | Port number | `993` (SSL) / `143` |
| **IMAP Username** | Auth username | `noreply@myapp.com` |
| **IMAP Password** | Auth password | — |
| **IMAP Encryption** | Encryption type | `SSL` or `TLS` |

After saving, each configuration gets a **Key** visible in the Email tab table. Use this key to select a specific config when sending.

Mark one configuration as **default** so it is used when no `config` key is provided.

---

## Sending Email from Code

```python
from ..packages.communication.email.utils import Email

email = Email(
    to='recipient@example.com',
    subject='Your Subject',
    body='Plain text body content.',
)
email.send_email()
```

---

## Email Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to` | str | **Yes** | Recipient email address |
| `cc` | str | No | CC recipient (single address) |
| `bcc` | str | No | BCC recipient (single address) |
| `subject` | str | No | Email subject line |
| `body` | str | No | Email body content |
| `config` | str | No | SMTP config key — omit to use the default config |

⚠️ **`to` is the only required parameter.** If `config` is omitted and no default configuration is set, an error is raised.

---

## Attachments

Use the `attach()` method before calling `send_email()`:

```python
email = Email(to='recipient@example.com', subject='Report', body='See attached.')
email.attach(file=file_object)
email.send_email()
```

---

## Selecting a Config

Each SMTP/IMAP configuration has a **Key** (visible in the Email tab table in App Panel).

```python
# ✅ Use default config (Key not passed)
email = Email(to='user@example.com', subject='Hi', body='...')
email.send_email()

# ✅ Use a specific named config
email = Email(to='user@example.com', subject='Hi', body='...', config='my_smtp_key')
email.send_email()

# ❌ Wrong — no default set and no config key passed → error
email = Email(to='user@example.com', subject='Hi', body='...')
email.send_email()  # Raises error if no default configuration exists
```

To find a config key: App Panel → Communication → View Details → Email tab → Key column.

---

## Sending Email from Dashboard

Access the email dashboard at:

```
http(s)://<your_domain>/communication/dashboard/email
```

Click **Compose Email** to open the compose form. Fill in recipient, subject, body, and any attachments, then send.

⚠️ A **default configuration must be set** before sending from the dashboard. Without a default, sending returns an error.

---

## Sending Email via REST API

```
POST http(s)://<your_domain>/communication/email/api/?action=send
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `to` | **Yes** | Recipient email address |
| `cc` | No | Comma-separated CC addresses |
| `bcc` | No | Comma-separated BCC addresses |
| `subject` | No | Email subject |
| `body` | No | Email body |
| `attachments` | No | List of file objects |
| `key` | No | SMTP config key (defaults to default config) |

---

## Sending Email Asynchronously (Recommended)

⚠️ **Never call `send_email()` directly inside a request handler.** SMTP delivery blocks the response and degrades user experience. Always offload to an async Celery task.

### Define the task

```python
# backend/notifications/tasks.py
from celery import shared_task
from ..packages.communication.email.utils import Email

@shared_task
def send_welcome_email(to, subject, body):
    email = Email(to=to, subject=subject, body=body)
    email.send_email()
```

### Trigger from a view

```python
from zango.core.tasks import zango_task_executor

zango_task_executor.delay(
    request.tenant.name,
    "backend.notifications.tasks.send_welcome_email",
    to=user.email,
    subject="Welcome!",
    body="Your account is ready.",
)
```

See [async-tasks.md](../../core/async-tasks.md) for full task setup, registration, and syncing.

---

## Sending Email on Workflow Transition

Use a `done_<transition_name>` method in your `workflow.py` to send an email when a status transition completes:

```python
from ..packages.communication.email.utils import Email

def done_approve(self, name, old_status, new_status):
    email = Email(
        to=self.object.owner_email,
        subject="Your request was approved",
        body=f"Status changed from {old_status} to {new_status}.",
    )
    email.send_email()
```

See [workflow/overview.md](../workflow/overview.md) for `done_*` transition hook details.

---

## Receiving Email (IMAP Sync Task)

Incoming emails are retrieved by a built-in periodic Celery task. It must be configured and enabled in the App Panel.

### Prerequisites

IMAP fields must be filled in the SMTP/IMAP configuration (see Step 2).

### Enable the sync task

1. App Panel → **Tasks** → click **Sync Tasks** (scans all `tasks.py` files and loads them)
2. Find the task: `packages.communication.email.tasks.sync_email`
3. Click the three-dot menu → **Update Task**
4. Configure:

| Field | Value |
|-------|-------|
| **Kwargs** | `{ "config_key": "<your_config_key>" }` |
| **Schedule (UTC)** | Set minute/hour/day as needed |
| **Is Enabled** | Toggle ON |

> Without this task enabled, incoming emails are never retrieved. The task polls your IMAP server on the schedule you set.

---

## Complete Examples

### Example 1: Transactional Email (Async)

```python
# backend/accounts/tasks.py
from celery import shared_task
from ..packages.communication.email.utils import Email

@shared_task
def send_password_reset_email(to, reset_link):
    email = Email(
        to=to,
        subject="Reset your password",
        body=f"Click the link to reset your password: {reset_link}",
    )
    email.send_email()
```

```python
# backend/accounts/views.py
from zango.core.tasks import zango_task_executor

class PasswordResetView(View):
    def post(self, request, *args, **kwargs):
        # ... generate reset_link ...
        zango_task_executor.delay(
            request.tenant.name,
            "backend.accounts.tasks.send_password_reset_email",
            to=user.email,
            reset_link=reset_link,
        )
        return JsonResponse({"status": "ok"})
```

### Example 2: Notification on Workflow Transition

```python
# backend/orders/workflow.py
from ...packages.workflow.base.base import BaseWorkflow
from ..packages.communication.email.utils import Email
from .models import Order

class OrderWorkflow(BaseWorkflow):
    class Meta:
        model = Order
        on_create_status = "pending"
        statuses = {
            "pending":   {"label": "Pending",   "color": "#6c757d"},
            "confirmed": {"label": "Confirmed", "color": "#0d6efd"},
            "shipped":   {"label": "Shipped",   "color": "#198754"},
        }
        transitions = [
            {"name": "Confirm", "from_status": "pending",   "to_status": "confirmed"},
            {"name": "Ship",    "from_status": "confirmed", "to_status": "shipped"},
        ]

    def done_confirm(self, name, old_status, new_status):
        email = Email(
            to=self.object.customer_email,
            subject=f"Order #{self.object.order_number} confirmed",
            body=f"Your order has been confirmed and is being processed.",
        )
        email.send_email()

    def done_ship(self, name, old_status, new_status):
        email = Email(
            to=self.object.customer_email,
            subject=f"Order #{self.object.order_number} shipped",
            body=f"Your order is on its way!",
        )
        email.send_email()
```

### Example 3: Email with Specific Config and Attachment

```python
# backend/reports/tasks.py
from celery import shared_task
from ..packages.communication.email.utils import Email

@shared_task
def send_monthly_report(to, report_file):
    email = Email(
        to=to,
        subject="Monthly Report",
        body="Please find the monthly report attached.",
        config="reports_smtp_key",   # Use a specific config
    )
    email.attach(file=report_file)
    email.send_email()
```

---

## Best Practices

1. **Always send via async task** — never call `send_email()` inside a request handler; SMTP calls block the response
2. **Set a default config** — required for dashboard sending and codebase sending without an explicit `config` key
3. **Activate the service first** — sending without activation silently creates records but does not deliver
4. **Use `done_*` hooks for workflow notifications** — cleaner than calling email from views
5. **Keep task signatures simple** — pass primitive values (strings, ints) to tasks, not model instances
6. **One task per email type** — easier to retry, debug, and test independently

---

## Troubleshooting

### Emails not being delivered, no errors raised

**Problem**: Email service is not activated.

**Solution**: App Panel → Packages → Communication → View Details → toggle Email service ON.

---

### `Error: No default email configuration found`

**Problem**: Sending without a `config` key but no default configuration is set.

**Solution**: In App Panel, go to the Email tab in the Communication package detail and mark one configuration as default.

---

### `Error: No configuration found for key '<key>'`

**Problem**: The `config` key passed to `Email(config=...)` does not match any saved configuration.

**Solution**: Verify the key value — App Panel → Communication → View Details → Email tab → Key column.

---

### Dashboard compose form returns an error on send

**Problem**: No default SMTP configuration is set.

**Solution**: Same as above — mark one configuration as default.

---

### IMAP sync task not retrieving emails

**Problem**: Task not enabled or misconfigured.

**Debugging steps**:
1. App Panel → Tasks — confirm the `packages.communication.email.tasks.sync_email` task exists (run Sync Tasks if not)
2. Check the task is set to **Is Enabled: ON**
3. Confirm the `config_key` in Kwargs matches the key of a config that has IMAP fields filled in
4. Check the schedule is not set to a time far in the future

---

### Import error: `cannot import name 'Email'`

**Problem**: Wrong import path or wrong dot depth.

**Solution**:
```python
# ✅ Correct — from a file in backend/mymodule/
from ..packages.communication.email.utils import Email

# ✅ Correct — from a file in backend/mymodule/submodule/
from ...packages.communication.email.utils import Email

# ❌ Wrong — absolute import
from packages.communication.email.utils import Email
```

Count dots: each dot is one level up from the current file toward the app root, then one more dot to reach `packages/`.

---

## Verification Checklist

After setting up email, verify:

- [ ] Communication package is installed
- [ ] Email service is activated (toggle ON in App Panel)
- [ ] At least one SMTP/IMAP configuration exists
- [ ] One configuration is marked as default
- [ ] `Email` imported with correct relative path
- [ ] `send_email()` is called (not `.send()`)
- [ ] Email sending is done inside a Celery task (not directly in a view)
- [ ] Task is registered and synced in App Panel
- [ ] Test email received at the `to` address
- [ ] (Receiving only) IMAP fields are filled in the configuration
- [ ] (Receiving only) `sync_email` task is enabled with correct `config_key` and schedule

---

## Related Documentation

- [overview.md](overview.md) — Communication package installation; SMS and telephony overview
- [async-tasks.md](../../core/async-tasks.md) — Celery task setup, registration, and syncing
- [workflow/overview.md](../workflow/overview.md) — `done_*` transition hooks for notifications
- [app-panel-api.md](../../app-panel-api.md) — Install packages and manage app settings via API
