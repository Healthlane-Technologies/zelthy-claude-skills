# Authentication
App Builder

Complete authentication system with password, OTP, OAuth, 2FA, role selection, and full customization.

**Sections:** Overview | Auth Configuration | Custom Login Page | Login Configuration | Theme Customization | Role Selection | Two-Factor Authentication | OAuth/OIDC Providers | Password Reset | Custom Component Overrides | Complete Example

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | ReactNode | Sign In | Login page title. |
| `subtitle` | string | ReactNode | - | Text displayed below the title. |
| `submitButtonText` | string | Sign In | Submit button label. |
| `rememberMeText` | string | Remember me | Remember me checkbox label. |
| `forgotPasswordText` | string | Forgot password? | Forgot password link text. |
| `otpButtonText` | string | Send OTP | OTP button label. |
| `showRememberMe` | boolean | true | Show or hide the remember me checkbox. |
| `enableTabSwitching` | boolean | true | Allow switching between email and mobile tabs. |
| `redirectAfterLogin` | string | - | Custom redirect URL after successful login. |
| `formLabels` | object | - | Custom labels for form fields: { email, mobile, password }. |
| `formPlaceholders` | object | - | Custom placeholders for form fields: { email, mobile, password }. |
| `tabLabels` | object | - | Custom labels for login tabs: { email, mobile }. |
| `customHeader` | ReactNode | - | Custom content rendered above the login form. |
| `customFooter` | ReactNode | - | Custom content rendered below the login form. |
| `customElementsBelowDescription` | ReactNode[] | - | Elements rendered between the description and the form. |
| `background` | object | - | Background configuration: { color, image, gradient } for the login page. |
| `primaryColor` | string | - | Primary brand color used for buttons and accents. |
| `fontFamily` | string | - | Font family for the auth pages. |
| `borderRadius` | string | - | Global border radius for inputs and buttons. |
| `textColor` | string | - | Primary text color. |
| `linkColor` | string | - | Color for links (forgot password, etc.). |
| `backgroundColor` | string | - | Card background color. |
| `borderRadius` | string | - | Card border radius. |
| `boxShadow` | string | - | Card box shadow. |
| `maxWidth` | string | - | Card maximum width. |
| `padding` | string | - | Card inner padding. |
| `url` | string | - | Logo image URL. |
| `width` | string | - | Logo width. |
| `height` | string | - | Logo height. |
| `title` | string | ReactNode | - | Role selection page title. |
| `subtitle` | string | ReactNode | - | Subtitle text below the title. |
| `instructionText` | string | - | Instruction text for the user. |
| `continueButtonText` | string | Continue | Continue button label. |
| `gridColumns` | 2 | 3 | 2 | Number of columns in grid layout. |
| `customRoleCard` | ReactNode | - | Custom component for rendering individual role cards. |
| `customEmptyState` | ReactNode | - | Custom component shown when no roles are available. |
| `title` | string | ReactNode | - | 2FA page title. |
| `subtitle` | string | ReactNode | - | Subtitle text below the title. |
| `codeLength` | number | 6 | Number of digits in the OTP code. |
| `resendCountdown` | number | 60 | Seconds before the resend button becomes available. |
| `submitButtonText` | string | Verify | Submit button label. |
| `resendButtonText` | string | Resend Code | Resend button label. |
| `customCodeInput` | ReactNode | - | Custom OTP input component. |
| `customMethodSelector` | ReactNode | - | Custom method selector component (email/SMS toggle). |
| `showProviderIcons` | boolean | true | Show icons on provider buttons. |
| `separatorText` | string | OR | Text shown in the separator between the login form and provider buttons. |
| `customProviderButtons` | object | - | Custom button components keyed by provider name. |
| `LoginPage` | React.ComponentType | - | Replace the entire login page. |
| `LoginCard` | React.ComponentType | - | Replace just the login card within the page. |
| `RoleSelection` | React.ComponentType | - | Replace the role selection page. |
| `TwoFactorAuth` | React.ComponentType | - | Replace the two-factor authentication page. |
| `ForgotPasswordPage` | React.ComponentType | - | Replace the forgot password page. |
| `ResetPasswordPage` | React.ComponentType | - | Replace the reset password page. |
| `OAuthCallbackPage` | React.ComponentType | - | Replace the OAuth callback handling page. |
| `DynamicLoginForm` | React.ComponentType | - | Replace the login form (within the login card). |
| `OTPForm` | React.ComponentType | - | Replace the OTP input form. |
| `ProviderButton` | React.ComponentType | - | Replace the OAuth provider button component. |

## Code Examples

### auth-config.jsx
```jsx
<ZangoApp
  authConfig={{
    // Theme, custom components, login config, etc.
  }}
```

### custom-login.jsx
```jsx
import CustomLogin from './custom/pages/CustomLogin';

<ZangoApp
  authConfig={{
    customComponents: {
      LoginPage: CustomLogin,
    },
  }}
```

### password-reset-config.jsx
```jsx
<ZangoApp
  authConfig={{
    resetPassword: {
      forgotPassword: {
        title: 'Forgot your password?',
        subtitle: 'Enter your email to receive a reset link.',
        submitButtonText: 'Send Reset Link',
      },
      resetForm: {
        title: 'Set New Password',
        subtitle: 'Choose a strong password for your account.',
        submitButtonText: 'Reset Password',
        passwordRules: 'At least 8 characters with one uppercase and one number.',
      },
    },
  }}
```

### complete-auth-config.jsx
```jsx
<ZangoApp
  authConfig={{
    theme: {
      background: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      primaryColor: '#5048ED',
    },
    logo: { url: '/logo.svg', width: '120px', position: 'center' },
    card: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      defaultTab: 'email',
      showRememberMe: true,
    },
    providers: {
      buttonStyle: 'outline',
      separatorText: 'or continue with',
    },
  }}
```

