---
description: "Configure Zango authentication - custom login page, theme, OAuth, 2FA, role selection"
---

# Setup Authentication

Read the reference:
**Read:** `@ZANGO-SKILL-REFERENCE.md`

## Ask the user:
1. Do you want to customize the login page appearance (colors, logo, background)?
2. Do you want a completely custom login component?
3. Do you need OAuth/SSO providers?
4. Do you need two-factor authentication?
5. Do you need role selection after login?
6. Any custom text (title, subtitle, button labels)?

## Generate authConfig

### Theme-only customization (most common)
```jsx
<ZangoApp
  authConfig={{
    theme: {
      background: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      primaryColor: '#5048ED',
      fontFamily: 'Inter, sans-serif',
    },
    logo: {
      url: '/logo.svg',
      width: '120px',
      position: 'center',
    },
    card: {
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      maxWidth: '420px',
    },
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue',
      submitButtonText: 'Sign In',
      defaultTab: 'email',
      showRememberMe: true,
    },
  }}
/>
```

### Full custom login page
```jsx
import CustomLogin from './custom/pages/CustomLogin';

<ZangoApp
  authConfig={{
    customComponents: {
      LoginPage: CustomLogin,
    },
  }}
/>
```

### With OAuth providers
```jsx
authConfig={{
  providers: {
    buttonStyle: 'outline',
    separatorText: 'or continue with',
    showProviderIcons: true,
  },
}}
```

## Replaceable Components
- LoginPage - entire page
- LoginCard - card only
- RoleSelection - role picker
- TwoFactorAuth - 2FA page
- ForgotPasswordPage
- ResetPasswordPage
- DynamicLoginForm - form only
- OTPForm - OTP input
- ProviderButton - SSO button

## Key Rules
- Auth pages are standalone (no sidebar/topbar)
- Session security only applies to authenticated users
- Default session: warn at 28 min, expire at 30 min
- After login, redirects to: ?next param > server redirect > first menu item > /app
