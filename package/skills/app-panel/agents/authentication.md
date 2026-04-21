# Configure Authentication

## What this does
Configures how users sign in: password, OTP, SSO, OIDC, 2FA, session management, password policies.

## Prerequisites
- Inside an app → App Settings → Authentication tab

## Navigation
`/platform/apps/{uuid}/app-settings/app-configuration/#auth`

## Sub-tabs

### Overview
Shows summary stats: Active Login Methods, 2FA status, Max Sessions, Password Expiry

### Login Methods
Toggle on/off:
- Password Authentication (email/password login)
- One-Time Password (OTP) - SMS/email codes
- Single Sign-On (SSO) - Enterprise SSO
- OpenID Connect (OIDC) - OAuth 2.0

Username Configuration:
- Allowed types: Email, Mobile
- Forgot Password: toggle on/off (reset links expire after 24 hours)

### Security
- Two-Factor Authentication: toggle "Require 2FA for all users", available methods (email)
- Session Management: Maximum concurrent sessions (number or Unlimited)
- Force logout on password change: toggle

### Policies
- Password policy rules: Min length, Uppercase, Lowercase, Numbers, Special chars
- Password expiry: days until forced change

### SAML Providers
- Configure SAML/SSO identity providers

### Role Overrides
- Per-role authentication overrides

## Steps to edit
1. Click "Edit Configuration" button (top right, purple)
2. Navigate to the relevant sub-tab
3. Toggle/fill settings
4. Save
