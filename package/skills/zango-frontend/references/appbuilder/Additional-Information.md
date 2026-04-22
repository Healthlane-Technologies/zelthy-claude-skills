# Additional Information
App Builder

Backend app views, URL routing, redirects, and deployment patterns.

**Sections:** App View (HTML Shell) | URL Configuration | Redirect Flow | Security | Authentication Flow | Reserved Routes | settings.json Reference | Standalone Pages | Root URL Redirect | Extending the App Initializer | Custom App View

## Code Examples

### appbuilder/backend/app/views.py
```python
class AppView(TemplateView):
    template_name = "appbuilder/app.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["app_initializer_endpoint"] = "/app/initializer/"
        context["build_version"] = packages_json.get("version", "0.1.0")
        return context
```

### appbuilder/backend/app/urls.py
```python
urlpatterns = [
    re_path(r'^initializer/$', AppInitializeAPI.as_view()),  # Reserved
    re_path(r'/', AppView.as_view()),                         # Catch-all SPA
]
```

### settings.json
```json
{
  "version": "1.0.0",
  "package_routes": [
    { "re_path": "^appbuilder/", "package": "appbuilder", "url": "urls" },
    { "re_path": "^crud/", "package": "crud", "url": "urls" }
  ],
  "app_routes": [
    { "module": "app", "re_path": "^", "url": "urls" }
  ]
}
```

### backend/app/views.py
```python
from django.shortcuts import redirect
from django.views.generic import View

class RedirectAppView(View):
    def get(self, request, *args, **kwargs):
        return redirect("/app")
```

### backend/app/urls.py
```python
from django.urls import re_path
from .views import AppView, RedirectAppView, ExtendedAppInitializeAPI

urlpatterns = [
    re_path(r'^app/initializer/$', ExtendedAppInitializeAPI.as_view()),
    re_path(r'^app/', AppView.as_view()),
    re_path(r'^/', RedirectAppView.as_view()),     # Root -> /app
    re_path(r'^login/', RedirectAppView.as_view()), # Legacy login -> /app
]
```

### backend/app/views.py
```python
import json
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
        )
```

### backend/app/views.py
```python
from django.views.generic import TemplateView
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

        return context
```

