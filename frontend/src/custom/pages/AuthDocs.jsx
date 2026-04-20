import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const AuthDocs = () => {
  return (
    <DocPage
      title="Authentication"
      category="appbuilder"
      subtitle="Complete authentication system with password, OTP, OAuth, 2FA, role selection, and full customization."
      badge="App Builder"
    >
      <Section title="Overview">
        <p className="mb-4">
          Zango provides a built-in authentication system that handles login
          (email/mobile + password/OTP), role selection, two-factor authentication,
          OAuth/OIDC providers, password reset, and session security. Everything is
          configurable via the <InlineCode>authConfig</InlineCode> prop on{' '}
          <InlineCode>ZangoApp</InlineCode>.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
          <li>Email and mobile login with password or OTP</li>
          <li>Role selection for users with multiple roles</li>
          <li>Two-factor authentication (email/SMS)</li>
          <li>OAuth/OIDC provider integration</li>
          <li>Password reset flow</li>
          <li>Session security with idle timeout and auto-logout</li>
          <li>Fully customizable UI via theme, custom components, and render overrides</li>
        </ul>
      </Section>

      <Section title="Auth Configuration">
        <p className="mb-4">
          Pass the <InlineCode>authConfig</InlineCode> prop to{' '}
          <InlineCode>ZangoApp</InlineCode> to configure the authentication system.
        </p>
        <CodeBlock
          language="jsx"
          title="auth-config.jsx"
          code={`<ZangoApp
  authConfig={{
    // Theme, custom components, login config, etc.
  }}
/>`}
        />
      </Section>

      <Section title="Custom Login Page">
        <p className="mb-4">
          The most common customization is replacing the entire login page with your
          own component. Use <InlineCode>authConfig.customComponents.LoginPage</InlineCode> to
          provide a custom login page.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-login.jsx"
          code={`import CustomLogin from './custom/pages/CustomLogin';

<ZangoApp
  authConfig={{
    customComponents: {
      LoginPage: CustomLogin,
    },
  }}
/>`}
        />
      </Section>

      <Section title="Login Configuration">
        <p className="mb-4">
          Configure the login page behavior and labels via{' '}
          <InlineCode>authConfig.login</InlineCode>.
        </p>
        <PropsTable
          props={[
            { name: 'title', type: 'string | ReactNode', default: '"Sign In"', description: 'Login page title.' },
            { name: 'subtitle', type: 'string | ReactNode', description: 'Text displayed below the title.' },
            { name: 'submitButtonText', type: 'string', default: '"Sign In"', description: 'Submit button label.' },
            { name: 'rememberMeText', type: 'string', default: '"Remember me"', description: 'Remember me checkbox label.' },
            { name: 'forgotPasswordText', type: 'string', default: '"Forgot password?"', description: 'Forgot password link text.' },
            { name: 'otpButtonText', type: 'string', default: '"Send OTP"', description: 'OTP button label.' },
            { name: 'showRememberMe', type: 'boolean', default: true, description: 'Show or hide the remember me checkbox.' },
            { name: 'enableTabSwitching', type: 'boolean', default: true, description: 'Allow switching between email and mobile tabs.' },
            { name: 'defaultTab', type: "'email' | 'mobile'", default: "'email'", description: 'Default active login tab.' },
            { name: 'redirectAfterLogin', type: 'string', description: 'Custom redirect URL after successful login.' },
            { name: 'formLabels', type: 'object', description: 'Custom labels for form fields: { email, mobile, password }.' },
            { name: 'formPlaceholders', type: 'object', description: 'Custom placeholders for form fields: { email, mobile, password }.' },
            { name: 'tabLabels', type: 'object', description: 'Custom labels for login tabs: { email, mobile }.' },
            { name: 'customHeader', type: 'ReactNode', description: 'Custom content rendered above the login form.' },
            { name: 'customFooter', type: 'ReactNode', description: 'Custom content rendered below the login form.' },
            { name: 'customElementsBelowDescription', type: 'ReactNode[]', description: 'Elements rendered between the description and the form.' },
          ]}
        />
      </Section>

      <Section title="Theme Customization">
        <p className="mb-4">
          Customize the visual appearance of the authentication pages via{' '}
          <InlineCode>authConfig.theme</InlineCode>.
        </p>
        <PropsTable
          props={[
            { name: 'background', type: 'object', description: 'Background configuration: { color, image, gradient } for the login page.' },
            { name: 'primaryColor', type: 'string', description: 'Primary brand color used for buttons and accents.' },
            { name: 'fontFamily', type: 'string', description: 'Font family for the auth pages.' },
            { name: 'borderRadius', type: 'string', description: 'Global border radius for inputs and buttons.' },
            { name: 'textColor', type: 'string', description: 'Primary text color.' },
            { name: 'linkColor', type: 'string', description: 'Color for links (forgot password, etc.).' },
            { name: 'alignTitle', type: "'left' | 'center' | 'right'", description: 'Title text alignment.' },
          ]}
        />

        <h4 className="text-sm font-semibold text-gray-900 mt-6 mb-3">Card Options (<InlineCode>authConfig.card</InlineCode>)</h4>
        <PropsTable
          props={[
            { name: 'backgroundColor', type: 'string', description: 'Card background color.' },
            { name: 'borderRadius', type: 'string', description: 'Card border radius.' },
            { name: 'boxShadow', type: 'string', description: 'Card box shadow.' },
            { name: 'maxWidth', type: 'string', description: 'Card maximum width.' },
            { name: 'padding', type: 'string', description: 'Card inner padding.' },
          ]}
        />

        <h4 className="text-sm font-semibold text-gray-900 mt-6 mb-3">Logo Options (<InlineCode>authConfig.logo</InlineCode>)</h4>
        <PropsTable
          props={[
            { name: 'url', type: 'string', description: 'Logo image URL.' },
            { name: 'width', type: 'string', description: 'Logo width.' },
            { name: 'height', type: 'string', description: 'Logo height.' },
            { name: 'position', type: "'center' | 'left' | 'right'", description: 'Logo alignment within the card.' },
          ]}
        />
      </Section>

      <Section title="Role Selection">
        <p className="mb-4">
          After login, if a user has multiple roles, the role selection screen is
          displayed. Configure it via <InlineCode>authConfig.roleSelection</InlineCode>.
        </p>
        <PropsTable
          props={[
            { name: 'title', type: 'string | ReactNode', description: 'Role selection page title.' },
            { name: 'subtitle', type: 'string | ReactNode', description: 'Subtitle text below the title.' },
            { name: 'instructionText', type: 'string', description: 'Instruction text for the user.' },
            { name: 'continueButtonText', type: 'string', default: '"Continue"', description: 'Continue button label.' },
            { name: 'cardLayout', type: "'grid' | 'list'", default: "'grid'", description: 'Layout mode for role cards.' },
            { name: 'gridColumns', type: '2 | 3', default: '2', description: 'Number of columns in grid layout.' },
            { name: 'customRoleCard', type: 'ReactNode', description: 'Custom component for rendering individual role cards.' },
            { name: 'customEmptyState', type: 'ReactNode', description: 'Custom component shown when no roles are available.' },
          ]}
        />
      </Section>

      <Section title="Two-Factor Authentication">
        <p className="mb-4">
          Configure the two-factor authentication screen via{' '}
          <InlineCode>authConfig.twoFactor</InlineCode>.
        </p>
        <PropsTable
          props={[
            { name: 'title', type: 'string | ReactNode', description: '2FA page title.' },
            { name: 'subtitle', type: 'string | ReactNode', description: 'Subtitle text below the title.' },
            { name: 'codeLength', type: 'number', default: '6', description: 'Number of digits in the OTP code.' },
            { name: 'resendCountdown', type: 'number', default: '60', description: 'Seconds before the resend button becomes available.' },
            { name: 'submitButtonText', type: 'string', default: '"Verify"', description: 'Submit button label.' },
            { name: 'resendButtonText', type: 'string', default: '"Resend Code"', description: 'Resend button label.' },
            { name: 'customCodeInput', type: 'ReactNode', description: 'Custom OTP input component.' },
            { name: 'customMethodSelector', type: 'ReactNode', description: 'Custom method selector component (email/SMS toggle).' },
          ]}
        />
      </Section>

      <Section title="OAuth/OIDC Providers">
        <p className="mb-4">
          Configure social login and OAuth/OIDC provider buttons via{' '}
          <InlineCode>authConfig.providers</InlineCode>.
        </p>
        <PropsTable
          props={[
            { name: 'buttonStyle', type: "'outline' | 'filled' | 'minimal'", default: "'outline'", description: 'Visual style of provider buttons.' },
            { name: 'showProviderIcons', type: 'boolean', default: true, description: 'Show icons on provider buttons.' },
            { name: 'separatorText', type: 'string', default: '"OR"', description: 'Text shown in the separator between the login form and provider buttons.' },
            { name: 'customProviderButtons', type: 'object', description: 'Custom button components keyed by provider name.' },
          ]}
        />
      </Section>

      <Section title="Password Reset">
        <p className="mb-4">
          Configure the password reset flow via{' '}
          <InlineCode>authConfig.resetPassword</InlineCode>. This includes both the
          forgot password page and the reset form.
        </p>
        <CodeBlock
          language="jsx"
          title="password-reset-config.jsx"
          code={`<ZangoApp
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
/>`}
        />
      </Section>

      <Section title="Custom Component Overrides">
        <p className="mb-4">
          Replace any part of the authentication UI with your own components via{' '}
          <InlineCode>authConfig.customComponents</InlineCode>. Each component receives
          the relevant props and handlers from the auth system.
        </p>
        <PropsTable
          props={[
            { name: 'LoginPage', type: 'React.ComponentType', description: 'Replace the entire login page.' },
            { name: 'LoginCard', type: 'React.ComponentType', description: 'Replace just the login card within the page.' },
            { name: 'RoleSelection', type: 'React.ComponentType', description: 'Replace the role selection page.' },
            { name: 'TwoFactorAuth', type: 'React.ComponentType', description: 'Replace the two-factor authentication page.' },
            { name: 'ForgotPasswordPage', type: 'React.ComponentType', description: 'Replace the forgot password page.' },
            { name: 'ResetPasswordPage', type: 'React.ComponentType', description: 'Replace the reset password page.' },
            { name: 'OAuthCallbackPage', type: 'React.ComponentType', description: 'Replace the OAuth callback handling page.' },
            { name: 'DynamicLoginForm', type: 'React.ComponentType', description: 'Replace the login form (within the login card).' },
            { name: 'OTPForm', type: 'React.ComponentType', description: 'Replace the OTP input form.' },
            { name: 'ProviderButton', type: 'React.ComponentType', description: 'Replace the OAuth provider button component.' },
          ]}
        />
      </Section>

      <Section title="Complete Example">
        <p className="mb-4">
          A full <InlineCode>authConfig</InlineCode> example combining theme, logo, card,
          login, and provider customization.
        </p>
        <CodeBlock
          language="jsx"
          title="complete-auth-config.jsx"
          code={`<ZangoApp
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
/>`}
        />
      </Section>
    </DocPage>
  );
};

export default AuthDocs;
