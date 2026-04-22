import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';

const { Section, Callout, InlineCode } = DocPage;

const BackendInfoDocs = () => {
  return (
    <DocPage
      title="Additional Information"
      category="appbuilder"
      subtitle="Backend app views, URL routing, redirects, and deployment patterns."
      badge="App Builder"
    >
      <Section title="App View (HTML Shell)">
        <p className="mb-4">
          The backend renders a minimal HTML shell that loads the frontend. All routing
          is handled by the frontend (SPA) — the backend simply serves the entry point.
        </p>
        <CodeBlock
          language="python"
          title="appbuilder/backend/app/views.py"
          code={`class AppView(TemplateView):
    template_name = "appbuilder/app.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["app_initializer_endpoint"] = "/app/initializer/"
        context["build_version"] = packages_json.get("version", "0.1.0")
        return context`}
        />
        <p className="mt-4 text-sm text-gray-700">
          The template renders <InlineCode>{'<div id="zango-app">'}</InlineCode> and loads the
          JS bundle. All routing is handled by the frontend (SPA).
        </p>
      </Section>

      <Section title="URL Configuration">
        <p className="mb-4">
          How URLs are structured in the backend:
        </p>
        <CodeBlock
          language="python"
          title="appbuilder/backend/app/urls.py"
          code={`urlpatterns = [
    re_path(r'^initializer/$', AppInitializeAPI.as_view()),  # Reserved
    re_path(r'/', AppView.as_view()),                         # Catch-all SPA
]`}
        />
        <p className="mt-4 text-sm text-gray-700">
          The <InlineCode>initializer/</InlineCode> route is reserved and cannot be used as
          an app route. Everything else is caught by <InlineCode>AppView</InlineCode> and
          handled by frontend routing.
        </p>
      </Section>

      <Section title="Redirect Flow">
        <p className="mb-4">
          How the app handles navigation when a user visits <InlineCode>/app/</InlineCode>:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 mb-4">
          <li>
            <strong>Anonymous user, no menu</strong> — Redirect to{' '}
            <InlineCode>/app/login</InlineCode> with <InlineCode>next</InlineCode> param.
          </li>
          <li>
            <strong>Authenticated, no menu</strong> — Redirect to{' '}
            <InlineCode>/app/configuration-error</InlineCode>.
          </li>
          <li>
            <strong>Authenticated, has menu</strong> — Redirect to first menu item.
          </li>
          <li>
            <strong><InlineCode>?next=</InlineCode> param</strong> — After login, redirect to
            the saved destination (security validated).
          </li>
        </ul>

        <h4 className="text-sm font-semibold text-gray-900 mt-6 mb-3">Redirect Priority</h4>
        <ol className="list-decimal pl-6 space-y-1 text-sm text-gray-700 mb-4">
          <li><InlineCode>next</InlineCode> URL parameter (highest priority)</li>
          <li>Server redirect URL (from auth response)</li>
          <li>First menu item (fallback)</li>
          <li><InlineCode>/app</InlineCode> (ultimate fallback)</li>
        </ol>
      </Section>

      <Section title="Security">
        <p className="mb-4">
          URL redirect validation ensures users cannot be redirected to malicious destinations:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 mb-4">
          <li>Must start with <InlineCode>/</InlineCode></li>
          <li>Blocks <InlineCode>//</InlineCode> (protocol-relative URLs)</li>
          <li>Blocks <InlineCode>javascript:</InlineCode> and <InlineCode>data:</InlineCode> protocols</li>
          <li>Blocks <InlineCode>://</InlineCode> in path (external URLs)</li>
          <li>Won't redirect to <InlineCode>/app/login</InlineCode> (prevents circular redirects)</li>
        </ul>
      </Section>

      <Section title="Authentication Flow">
        <p className="mb-4">
          How the backend determines the user's role and menu:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 mb-4">
          <li>
            Backend: <InlineCode>request.user.is_authenticated</InlineCode> determines anonymous
            status.
          </li>
          <li>
            <strong>Anonymous</strong> — served "AnonymousUsers" role menu.
          </li>
          <li>
            <strong>Authenticated</strong> — <InlineCode>get_current_role()</InlineCode> returns
            the user's role.
          </li>
          <li>
            Role determines which <InlineCode>AppMenuModel</InlineCode> config to use.
          </li>
          <li>
            Session security is only enabled for authenticated users.
          </li>
        </ul>
      </Section>

      <Section title="Reserved Routes">
        <p className="mb-4">
          These paths are hardcoded and cannot be used as app routes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 mb-4">
          <li><InlineCode>/app/login/*</InlineCode> — Authentication pages</li>
          <li><InlineCode>/app/logout</InlineCode> — Logout handler</li>
          <li><InlineCode>/app/configuration-error</InlineCode> — Error page when no menu configured</li>
          <li><InlineCode>/app/initializer/</InlineCode> — App initialization API</li>
        </ul>
      </Section>

      <Section title="settings.json Reference">
        <p className="mb-4">
          Complete settings structure for workspace routing:
        </p>
        <CodeBlock
          language="json"
          title="settings.json"
          code={`{
  "version": "1.0.0",
  "package_routes": [
    { "re_path": "^appbuilder/", "package": "appbuilder", "url": "urls" },
    { "re_path": "^crud/", "package": "crud", "url": "urls" }
  ],
  "app_routes": [
    { "module": "app", "re_path": "^", "url": "urls" }
  ]
}`}
        />
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 mt-4 mb-4">
          <li>
            <InlineCode>version</InlineCode> — App version shown in profile/footer.
          </li>
          <li>
            <InlineCode>package_routes</InlineCode> — Mount package URL patterns. Each entry:{' '}
            <InlineCode>re_path</InlineCode> (regex), <InlineCode>package</InlineCode> (package
            name), <InlineCode>url</InlineCode> (urls module name).
          </li>
          <li>
            <InlineCode>app_routes</InlineCode> — Mount app-level URL patterns. The catch-all{' '}
            <InlineCode>^</InlineCode> must be last.
          </li>
        </ul>
        <Callout type="important" title="Route Processing Order">
          <InlineCode>package_routes</InlineCode> are processed BEFORE{' '}
          <InlineCode>app_routes</InlineCode>. The appbuilder catch-all route should be in{' '}
          <InlineCode>app_routes</InlineCode> with the <InlineCode>^</InlineCode> pattern.
        </Callout>
      </Section>

      <Section title="Standalone Pages">
        <p className="mb-4">
          Standalone pages are rendered WITHOUT the layout (sidebar/topbar), giving them
          the full viewport. This is useful for public forms, embeds, or kiosk mode.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 mb-4">
          <li>Login pages are standalone by default.</li>
          <li>
            Custom pages can be standalone via{' '}
            <InlineCode>extra_params.standalone: true</InlineCode> in route config.
          </li>
          <li>Standalone pages get full viewport — useful for public forms, embeds, kiosk mode.</li>
        </ul>
      </Section>

      <Section title="Root URL Redirect">
        <p className="mb-4">
          The root URL (<InlineCode>/</InlineCode>) and legacy login URL (<InlineCode>/login/</InlineCode>) should
          redirect to <InlineCode>/app</InlineCode>. This is handled by a simple redirect view in your app's backend:
        </p>
        <CodeBlock
          language="python"
          title="backend/app/views.py"
          code={`from django.shortcuts import redirect
from django.views.generic import View

class RedirectAppView(View):
    def get(self, request, *args, **kwargs):
        return redirect("/app")`}
        />
        <p className="mt-4 mb-4">Wire it up in your app's URL config:</p>
        <CodeBlock
          language="python"
          title="backend/app/urls.py"
          code={`from django.urls import re_path
from .views import AppView, RedirectAppView, ExtendedAppInitializeAPI

urlpatterns = [
    re_path(r'^app/initializer/$', ExtendedAppInitializeAPI.as_view()),
    re_path(r'^app/', AppView.as_view()),
    re_path(r'^/', RedirectAppView.as_view()),     # Root -> /app
    re_path(r'^login/', RedirectAppView.as_view()), # Legacy login -> /app
]`}
        />
      </Section>

      <Section title="Extending the App Initializer">
        <p className="mb-4">
          You can extend <InlineCode>AppInitializeAPI</InlineCode> to add custom data to the initializer response.
          For example, adding chatbot URLs or feature flags:
        </p>
        <CodeBlock
          language="python"
          title="backend/app/views.py"
          code={`import json
from django.http import HttpResponse
from ...packages.appbuilder.backend.app.views import AppInitializeAPI

class ExtendedAppInitializeAPI(AppInitializeAPI):
    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)

        # Add custom data to the response
        response_data = json.loads(response.content)
        response_data["response"]["feature_flags"] = {
            "enable_chat": True,
            "enable_analytics": False,
        }

        return HttpResponse(
            json.dumps(response_data),
            status=response.status_code,
            content_type="application/json",
        )`}
        />
        <Callout type="tip" title="Access in Frontend">
          Custom data added to the initializer response is available via <InlineCode>useAppContext().appData</InlineCode> in
          any component.
        </Callout>
      </Section>

      <Section title="Custom App View">
        <p className="mb-4">
          You can extend <InlineCode>AppView</InlineCode> to pass additional context to the HTML template.
          Useful for server-rendered data, feature flags, or third-party widget configuration:
        </p>
        <CodeBlock
          language="python"
          title="backend/app/views.py"
          code={`from django.views.generic import TemplateView
from zango.core.utils import get_current_role

class AppView(TemplateView):
    template_name = "app.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        user = self.request.user
        if user.is_authenticated:
            context["user_authenticated"] = True
            context["user_name"] = user.name
            context["user_email"] = user.email
            context["role_name"] = get_current_role().name

        return context`}
        />
      </Section>
    </DocPage>
  );
};

export default BackendInfoDocs;
