---
name: setup-auth
description: "Configure Zango authentication - custom login, theme, OAuth, 2FA, role selection. Use when customizing the login experience."
license: MIT
compatibility: Requires a Zango frontend app with @zango-core/crm-framework.
metadata:
  author: Healthlane Technologies
  version: "1.0"
allowed-tools: Read Write Bash(npm:*)
---

# Setup Authentication

Configure the authentication system in a Zango frontend application.

All configuration is done via the `authConfig` prop on `<ZangoApp>` in `src/App.tsx`.

For complete auth props reference, see the Authentication section in: [App Builder Reference](../zango-frontend/references/APPBUILDER-REFERENCE.md)

## Quick Reference

```tsx
<ZangoApp
  authConfig={{
    theme: {...},         // Background, colors, fonts
    card: {...},          // Login card styling
    logo: {...},          // Logo image and position
    login: {...},         // Form labels, tabs, behavior
    roleSelection: {...}, // Multi-role selection page
    twoFactor: {...},     // 2FA configuration
    providers: {...},     // OAuth/OIDC buttons
    resetPassword: {...}, // Forgot/reset password
    customComponents: {}, // Replace entire pages
  }}
/>
```

## Theme Customization

```jsx
authConfig={{
  theme: {
    background: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    // Also: { color: '#f5f5f5' } or { image: 'url(/bg.jpg)' }
    primaryColor: '#5048ED',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
    textColor: '#101828',
    linkColor: '#5048ED',
    alignTitle: 'center',  // 'left' | 'center' | 'right'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    maxWidth: '420px',
    padding: '40px',
  },
  logo: {
    url: '/logo.svg',
    width: '120px',
    height: '40px',
    position: 'center',  // 'center' | 'left' | 'right'
  }
}}
```

## Login Configuration

```jsx
authConfig={{
  login: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your account',
    submitButtonText: 'Sign In',
    showRememberMe: true,
    enableTabSwitching: true,
    defaultTab: 'email',            // 'email' | 'mobile'
    redirectAfterLogin: '/app/dashboard',
    formLabels: { email: 'Email Address', mobile: 'Phone Number', password: 'Password' },
    formPlaceholders: { email: 'you@company.com', mobile: '+1 (555) 000-0000', password: 'Enter your password' },
    tabLabels: { email: 'Email', mobile: 'Phone' },
    customHeader: <div>Company Logo</div>,
    customFooter: <p>By signing in you agree to our Terms of Service</p>,
  }
}}
```

## Role Selection

When a user has multiple roles, a role selection page appears after login.

```jsx
authConfig={{
  roleSelection: {
    title: 'Select Your Role',
    subtitle: 'Choose how you want to access the application',
    continueButtonText: 'Continue',
    cardLayout: 'grid',     // 'grid' | 'list'
    gridColumns: 2,          // 2 | 3
    customRoleCard: <MyRoleCard />,
    customEmptyState: <NoRolesMessage />,
  }
}}
```

## Two-Factor Authentication

```jsx
authConfig={{
  twoFactor: {
    title: 'Two-Factor Authentication',
    subtitle: 'Enter the code sent to your device',
    codeLength: 6,
    resendCountdown: 60,
    submitButtonText: 'Verify',
    resendButtonText: 'Resend Code',
    customCodeInput: <MyOTPInput />,
  }
}}
```

## OAuth/OIDC Providers

```jsx
authConfig={{
  providers: {
    buttonStyle: 'outline',      // 'outline' | 'filled' | 'minimal'
    showProviderIcons: true,
    separatorText: 'or continue with',
    customProviderButtons: {
      google: <MyGoogleButton />,
      microsoft: <MyMicrosoftButton />,
    },
  }
}}
```

OAuth providers are configured on the backend. The frontend renders buttons based on what the initializer API returns.

## Password Reset

```jsx
authConfig={{
  resetPassword: {
    forgotPassword: {
      title: 'Forgot your password?',
      subtitle: 'Enter your email to receive a reset link.',
      submitButtonText: 'Send Reset Link',
    },
    resetForm: {
      title: 'Set New Password',
      submitButtonText: 'Reset Password',
      passwordRules: 'At least 8 characters with one uppercase and one number.',
    },
  }
}}
```

## Custom Component Overrides

Replace entire auth pages or individual components:

```jsx
authConfig={{
  customComponents: {
    // Replace entire pages
    LoginPage: MyCustomLoginPage,
    RoleSelection: MyCustomRoleSelection,
    TwoFactorAuth: MyCustom2FA,
    ForgotPasswordPage: MyCustomForgotPassword,
    ResetPasswordPage: MyCustomResetPassword,
    OAuthCallbackPage: MyCustomOAuthCallback,
    // Replace parts of login page
    LoginCard: MyCustomLoginCard,
    DynamicLoginForm: MyCustomLoginForm,
    OTPForm: MyCustomOTPForm,
    ProviderButton: MyCustomProviderButton,
  }
}}
```

## Complete Example

```tsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
    authConfig={{
      theme: {
        background: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        primaryColor: '#5048ED',
        fontFamily: 'Inter, sans-serif',
      },
      logo: { url: '/logo.svg', width: '120px', position: 'center' },
      card: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
      login: {
        title: 'Welcome Back',
        defaultTab: 'email',
        showRememberMe: true,
      },
      providers: { buttonStyle: 'outline', separatorText: 'or continue with' },
      roleSelection: { title: 'Choose Your Role', cardLayout: 'grid', gridColumns: 2 },
      twoFactor: { codeLength: 6, resendCountdown: 60 },
    }}
  />
);
```

## Replacing the Entire Login Page

```jsx
import CustomLogin from './custom/pages/CustomLogin';

<ZangoApp
  authConfig={{
    customComponents: { LoginPage: CustomLogin },
  }}
/>
```

## Post-Setup

If a custom login component was generated:
1. Ensure it's exported in `src/custom/pages/index.js`
2. Verify `authConfig.customComponents.LoginPage` points to the correct import
