# Manage Secrets

## What this does
Add/edit app secrets (environment variables) like API keys, URLs, tokens.

## Prerequisites
- Inside an app → App Settings → Secrets tab

## Navigation
`/platform/apps/{uuid}/app-settings/app-configuration/#secrets`

## Steps

### Add secret
1. Click "+ Add Secret" (top right, purple)
2. Enter Key name (e.g., "Chatbot_api_url", "JWT_private_key")
3. Enter Value (masked)
4. Save

### View secret
1. Click eye icon to reveal value

### Edit secret
1. Click edit icon (pencil)
2. Update value
3. Save

## Common secrets
- API URLs for external services
- JWT private/public keys
- Third-party service credentials
- Feature flags
