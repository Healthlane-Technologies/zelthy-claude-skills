# Zango Communication Package - Overview

The Communication package provides built-in messaging channels for Zango apps. It supports **Email** and **SMS**. Each channel is independent and must be activated separately in the App Panel.

> **Email** is documented in full detail in [email.md](email.md).
> **SMS** is available but not yet fully documented — a brief reference is below.

## Installation

### Install via App Panel

1. Navigate to your app in the App Panel (`http://localhost:8000/platform`)
2. Go to "Packages" section
3. Search for "communication"
4. Click "Install" (use latest version)

### Install via API

```bash
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/packages/" \
  -H "X-CSRFToken: $CSRF" \
  -d "name=communication&version=<latest>"
```

> **Install order:** Install `appbuilder` and `crud` before `communication`. See [app-panel-api.md](../../app-panel-api.md) for fetching latest versions.

---

## Email

See [email.md](email.md) for the full reference — setup, sending from code, async patterns, IMAP receive, and troubleshooting.

---

## SMS

SMS is supported by the Communication package. Full documentation will be added separately. At a high level, the pattern mirrors email: install the package, activate the SMS service in App Panel, configure provider credentials, then call the SMS handler class from your code or an async task.

---

## Related Documentation

- [email.md](email.md) — full email reference
- [Async Tasks](../../core/async-tasks.md) — send messages in the background
- [Workflow Overview](../workflow/overview.md) — trigger notifications on transitions
- [App Panel API](../../app-panel-api.md) — install packages and manage settings via API
