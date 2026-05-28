# Zango App Panel API Reference

All endpoints are under `http://localhost:8000/api/v1/` unless otherwise noted. All responses follow `{success: bool, response: {...}}`.

---

## Authentication

Zango uses Django session auth with CSRF protection. All API calls require authentication.

### Before running the login curl — confirm credentials

**Never hardcode or assume platform credentials.** Before executing the login:

1. Check `deploy/.env` for `PLATFORM_USERNAME` / `PLATFORM_USER_PASSWORD`, or check if credentials are already present in the current conversation context.
2. Present what you found to the user: *"I'll use `<email>` — is that correct, or should I use different credentials?"*
3. Wait for confirmation, then URL-encode the values (`@` → `%40`, `#` → `%23`, `!` → `%21`) before substituting.

### Login Flow

```bash
# Step 1: Get CSRF cookie
curl -s -c /tmp/zango_cookies http://localhost:8000/auth/login/ -o /dev/null
CSRF=$(grep csrftoken /tmp/zango_cookies | awk '{print $NF}')

# Step 2: Login — substitute confirmed, URL-encoded credentials
# Do NOT use -L (follow redirects) — the redirect destination may throw a 500
curl -s -c /tmp/zango_cookies -b /tmp/zango_cookies -X POST http://localhost:8000/auth/login/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Origin: http://localhost:8000" \
  -H "Referer: http://localhost:8000/auth/login/" \
  -d "csrfmiddlewaretoken=$CSRF&username=<EMAIL_ENCODED>&password=<PASSWORD_ENCODED>" \
  -o /dev/null -w "%{http_code}"
# Expect: 302 — session cookie is now set

# Step 3: Refresh CSRF for subsequent mutating requests
CSRF=$(grep csrftoken /tmp/zango_cookies | awk '{print $NF}')
# All POST/PUT/DELETE must include: -H "X-CSRFToken: $CSRF" -H "Referer: http://localhost:8000/platform/"
```

Both `SessionAuthentication` and Knox `TokenAuthentication` are accepted.

---

## Apps

### List Apps
```
GET /api/v1/apps/
→ {success, response: {apps: [...], message}}
```

### Create App (async)
```
POST /api/v1/apps/
Body: name=<name>&description=<description>
Headers: X-CSRFToken, Referer
→ {success, response: {message, app_uuid, task_id}}
```

App creation is **async** — poll until complete:
```
GET /api/v1/apps/?action=get_app_creation_status&task_id=<task_id>
→ {success, response: {message, deployed: bool, status}}
```
Wait until `response.deployed == true`.

### Get App Details
```
GET /api/v1/apps/<uuid>/
→ {success, response: {app: {...}}}

GET /api/v1/apps/<uuid>/?include_dropdown_options=true
→ Also returns dropdown_options: {timezones, datetime_formats, date_formats}
```

### Update App
```
PUT /api/v1/apps/<uuid>/
Body: domains=<url-encoded-json>&timezone=<tz>&date_format=<fmt>&datetime_format=<fmt>
Headers: X-CSRFToken, Referer
→ {success, response: {message, app_uuid}}
```

Domain config example: `domains=[{"domain":"myapp.local","is_primary":true}]` — URL-encode when sending as form data.

---

## Roles

Default roles created with every app: `AnonymousUsers` (id=1), `SystemUsers` (id=2).

### List Roles
```
GET /api/v1/apps/<uuid>/roles/
Optional: ?search=<term>&include_dropdown_options=true
→ {success, response: {roles: {total_records, records: [...]}, message[, dropdown_options]}}
```

### Create Role
```
POST /api/v1/apps/<uuid>/roles/
Body: name=<name>&policies=<comma-separated-ids>
→ {success, response: {message, role_id}}
```

### Get / Update Role
```
GET /api/v1/apps/<uuid>/roles/<id>/
→ {success, response: {role: {...}, all_policies: [...]}}

PUT /api/v1/apps/<uuid>/roles/<id>/
Body: name, policies, policy_groups, is_active
→ {success, response: {message, role_id}}
```

---

## Users

### List / Create / Update
```
GET  /api/v1/apps/<uuid>/users/
→ {success, response: {users: {total_records, records: [...]}, pn_country_code, message}}

POST /api/v1/apps/<uuid>/users/
PUT  /api/v1/apps/<uuid>/users/<id>/
```

Create body: `name=<name>&email=<email>&mobile=&password=<password>&roles=<role_id>`

**Note:** `mobile` must be present even if empty. `roles` accepts a single integer role ID.

**Known issue:** `GET /api/v1/apps/<uuid>/users/<id>/` returns `{success: false, response: {message: "'tenant'"}}` — use the list endpoint and filter by ID client-side.

---

## Policies

Policies are defined in `policies.json` in each module and must be synced to take effect.

### Sync Policies
```bash
POST /api/v1/apps/<uuid>/policies/?action=sync_policies
Headers: X-CSRFToken, Referer, Content-Type: multipart/form-data
Body: (empty multipart)
→ {success: true, response: {message: "Policies synced successfully"}}
```

```bash
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/policies/?action=sync_policies" \
  -H "X-CSRFToken: $CSRF" \
  -H "Referer: http://localhost:8000/platform/" \
  -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary" \
  --data-raw '------WebKitFormBoundary--'
```

### List / Read
```
GET /api/v1/apps/<uuid>/policies/
→ {success, response: {policies: {total_records, records: [...]}, message}}
```

**Known issue:** `GET /api/v1/apps/<uuid>/policies/<id>/` returns `{success: false, response: {message: "'tenant'"}}`.

### Update Policy (assign roles)

**CRITICAL:** PUT replaces all roles — include every role ID or they will be removed.

```bash
# Step 1 — get all role IDs
curl -s -b /tmp/zango_cookies "http://localhost:8000/api/v1/apps/<uuid>/roles/" \
  | jq -r '.response.roles.records[] | "\(.id) - \(.name)"'

# Step 2 — PUT with all role IDs
curl "http://localhost:8000/api/v1/apps/<uuid>/policies/<policy_id>/" \
  -X PUT -b /tmp/zango_cookies \
  -H "X-CSRFToken: $CSRF" -H "Referer: http://localhost:8000/platform/" \
  -F "id=<policy_id>" -F "roles=1" -F "roles=2" -F "roles=3"
```

Use `-F` for each role — **not** `--data-raw`. Policy ID for `AllowFromAnywhere` is typically `1`.

---

## Packages

Available: `appbuilder`, `communication`, `crud`, `workflow`.

### List / Install
```
GET  /api/v1/apps/<uuid>/packages/
→ {success, response: {packages: {total_records, records: [{name, versions, status, installed_version, config_url}]}}}

POST /api/v1/apps/<uuid>/packages/
Body: name=<name>&version=<version>
→ {success, response: {message: "Package Installed"}}
```

### Get Config URL
```
GET /api/v1/apps/<uuid>/packages/?action=config_url&package_name=<name>
→ {success, response: {url}}
```
Requires a domain to be configured on the app.

---

## Codebase

```
GET /api/v1/apps/<uuid>/codebase/
→ {success, response: {app_codebase: {app_name, version, modules, package_routes, app_routes,
     route_tree, dot_diagram, total_modules, total_packages, total_routes,
     workspace_path, settings_file_exists, last_modified}, message}}
```

---

## Themes

```
GET /api/v1/apps/<uuid>/themes/
→ {success, response: {themes: [...list, not paginated...], message}}

GET /api/v1/apps/<uuid>/themes/<id>/
→ {success, response: {theme: {...}}}

PUT /api/v1/apps/<uuid>/themes/<id>/
Body: name, config (JSON string), is_active
```

**Note:** Themes list returns `themes` as a plain array (not a paginated `{total_records, records}` object). Theme creation via POST is broken (serializer bug) — use the App Panel UI to create; read/update via API works fine.

Default theme config:
```json
{
  "color": {"primary": "#5048ED", "secondary": "#E1D6AE", "background": "#ffffff"},
  "button": {"color": "#ffffff", "background": "#5048ED", "border_color": "#C7CED3", "border_radius": "10"},
  "typography": {"font_family": "Open Sans"}
}
```

---

## Secrets

Secrets store credentials encrypted. Requires `FIELD_ENCRYPTION_KEY` in `deploy/.env`.

Key naming: `^[A-Z][a-z0-9_]*$` (e.g. `Stripe_secret`, `Sendgrid_api_key`).

```
GET    /api/v1/apps/<uuid>/secrets/?page=1&page_size=20&search=
POST   /api/v1/apps/<uuid>/secrets/           Body (multipart): key, value
GET    /api/v1/apps/<uuid>/secrets/?action=get_secret_value&secret_id=<id>
PUT    /api/v1/apps/<uuid>/secrets/?secret_id=<id>  Body (multipart): key, value
DELETE /api/v1/apps/<uuid>/secrets/?secret_id=<id>  Headers: X-CSRFToken
```

Secret must be inactive before deletion.

---

## Tasks

### List / Sync / Get
```
GET  /api/v1/apps/<uuid>/tasks/
→ {success, response: {tasks: {total_records, records: [...]}, message}}

POST /api/v1/apps/<uuid>/tasks/   (empty body — syncs tasks.py)
→ {success, response: {message: "Tasks synced successfully"}}

GET  /api/v1/apps/<uuid>/tasks/<id>/
→ {success, response: {task: {id, name, crontab, schedule, code, run_history, is_enabled, args, kwargs, ...}}}
```

Sync after creating or changing `tasks.py` to register tasks with the platform.

### Update Task (configure schedule)
```
POST /api/v1/apps/<uuid>/tasks/<id>/
Body (multipart):
  crontab_exp: {"minute":"0","hour":"2","day_of_week":"*","day_of_month":"*","month_of_year":"*"}
  is_enabled: true|false
  kwargs: {}
→ {success, response: {message: "Task updated successfully"}}
```

After changing schedule: `docker compose -f deploy/docker_compose.yml restart celery`

---

## AI Agents

All AI endpoints are under `/api/v1/apps/<app_uuid>/ai/`. Body format is JSON unless noted.

### Base URL pattern
```
http://localhost:8000/api/v1/apps/<APP_UUID>/ai/<resource>/
```

---

### Providers

#### List available provider types (registry metadata)
```
GET /api/v1/apps/<uuid>/ai/providers/available/
→ {success, response: {providers: [{slug, display_name, icon, supported_models, config_fields}]}}
```
Reads from the provider registry — not the database. Use to discover `provider_slug` values and required config fields before creating a provider. Note the key is `display_name`, not `name`.

#### Fetch models (pre-creation preview)
```
POST /api/v1/apps/<uuid>/ai/providers/fetch-models/
Body (JSON): {"provider_slug": "openai", "config": {"api_key": "sk-..."}}
→ {success, response: {models: [{id, name}]}}
```
Tests credentials and returns available models without saving anything. On failure returns `error_type: "auth_error"` or `"unknown_error"`.

#### List providers
```
GET /api/v1/apps/<uuid>/ai/providers/
Optional: ?search=<term>&status=active|inactive&page=1&page_size=10
→ {success, response: {providers: {total_records, records: [...]}, message}}
```

#### Create provider
```
POST /api/v1/apps/<uuid>/ai/providers/
Headers: X-CSRFToken, Referer, Content-Type: application/json
Body (JSON):
{
  "name": "my-openai",
  "description": "",
  "provider_slug": "openai",
  "config": {"api_key": "sk-..."},
  "default_model": "gpt-4o-mini",
  "fetched_models": [{"id": "gpt-4o-mini", "name": "GPT-4o Mini"}, ...],
  "rate_limit_rpm": null,
  "rate_limit_tpm": null,
  "monthly_budget_usd": null,
  "budget_alert_threshold": 80.00
}
→ {success, response: {message: "Provider created successfully", provider_id: <int>}}
```

**Notes:**
- `provider_slug`: `"openai"` or `"anthropic"`
- `config`: for OpenAI — `{"api_key": "...", "organization_id": ""}` (org_id optional); for Anthropic — `{"api_key": "..."}`
- `fetched_models`: pass the list returned by `fetch-models/` to skip a second live API call; omit to let the platform fetch models automatically
- API key is validated before saving — invalid keys return 400

#### Get / Update / Delete provider
```
GET    /api/v1/apps/<uuid>/ai/providers/<provider_id>/
PUT    /api/v1/apps/<uuid>/ai/providers/<provider_id>/
DELETE /api/v1/apps/<uuid>/ai/providers/<provider_id>/
```

Update body (JSON, all fields optional):
```json
{
  "name": "updated-name",
  "description": "",
  "config": {"api_key": "sk-new-..."},
  "default_model": "gpt-4o",
  "rate_limit_rpm": 60,
  "monthly_budget_usd": 50.00
}
```

Delete: hard-deletes if no invocation history; soft-deletes (disables + renames) otherwise. Blocked if active agents reference this provider (returns 409 with agent list).

#### Provider actions
```
POST /api/v1/apps/<uuid>/ai/providers/<provider_id>/validate/
→ Runs validate_config(), stores result on provider record.
  {success, response: {message}}

POST /api/v1/apps/<uuid>/ai/providers/<provider_id>/toggle/
Body (JSON): {"is_enabled": true}
→ On success: {success: true, response: {message}}
→ Blocked (409) if active agents use this provider:
  {success: false, response: {message, error_code: "PROVIDER_IN_USE", agents: [{id, name}]}}

POST /api/v1/apps/<uuid>/ai/providers/<provider_id>/models/<model_id>/toggle/
Body (JSON): {"is_enabled": false}
→ {success, response: {message, model_id: <int>, is_enabled: bool}}
Note: <model_id> is the integer `id` from the provider's `enabled_models` list — NOT the string model slug.

GET  /api/v1/apps/<uuid>/ai/providers/<provider_id>/usage/
→ {success, response: {provider_id, total_invocations, total_input_tokens, total_output_tokens, total_cost_usd, budget_status, model_breakdown: [...]}}

POST /api/v1/apps/<uuid>/ai/providers/<provider_id>/reset-budget/
→ Resets current_month_spend_usd to 0.

GET  /api/v1/apps/<uuid>/ai/providers/<provider_id>/dependencies/
→ {is_mapped: bool, agent_count, agents: [{id, name}], suggested_action}
```

---

### Prompts

#### List prompts
```
GET /api/v1/apps/<uuid>/ai/prompts/
Optional: ?search=<term>&type=system|user&include_inactive=true&page=1&page_size=10
→ {success, response: {prompts: {total_records, records: [
     {id, name, description, type, is_active,
      active_version_number, active_version_id,
      total_versions, created_at}
   ]}, stats: {total_prompts, active_versions, total_versions}}}
```

#### Create prompt
```
POST /api/v1/apps/<uuid>/ai/prompts/
Headers: X-CSRFToken, Referer, Content-Type: application/json
Body (JSON):
{
  "name": "patient-summary-system",
  "description": "",
  "type": "system",
  "content": "You are a clinical assistant. Always fetch patient data before responding.",
  "change_description": "Initial version"
}
→ {success, response: {message: "Prompt created successfully", prompt_id: <int>}}
```

**Notes:**
- `type`: `"system"` (injected before conversation) or `"user"` (sent as a user turn)
- `name` must be unique — used to reference the prompt from agents and code
- `content`: both `system` and `user` type prompts support `{{variable_name}}` syntax — variables are extracted automatically. Pass them at runtime via `system_variables=` (system prompt) or `variables=` (user prompt) in `agent.run()`.
- First version is created and set active automatically

#### Get / Update / Delete prompt
```
GET    /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/
PUT    /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/
DELETE /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/
```

Update body (JSON, all optional): `name`, `description`, `type`, `is_active`

Delete: soft-deletes (sets `is_active=False`) if versions exist. Blocked (409) if active agents use this prompt.

#### Prompt versions
```
GET  /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/versions/
→ {success, response: {versions: [
     {id, version_number, content, status, variables: ["var1", "var2"], change_description, created_at}
   ]}}

POST /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/versions/
Body (JSON): {"content": "Updated instruction...", "change_description": "Refined tone"}
→ {success, response: {message: "Version v2 created", version: {id, version_number, status: "draft", variables: [...]}}}
```
New versions start as `"draft"` — they are not used by agents until promoted.
`variables` is the auto-extracted list of `{{placeholder}}` names from the content.

```
GET  /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/versions/<version_id>/
→ {success, response: {version: {id, version_number, content, status, variables: [...], change_description, created_at}}}
```

#### Promote a version to active
```
POST /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/versions/<version_id>/promote/
→ {success, response: {message: "Version v2 promoted to active"}}
```
Sets the target version to `"active"`, demotes the previous active to `"inactive"`, and updates `prompt.active_version`. This is what "Make Active" does in the UI.

#### Prompt utilities
```
GET /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/compare/?v1=<version_number>&v2=<version_number>
→ {success, response: {version_1: {...}, version_2: {...}}}
```
Note: `v1` and `v2` query params are **version numbers** (e.g. `1`, `2`), not version IDs.

```
POST /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/activate/
→ {success, response: {message: "Prompt activated successfully"}}
```
POST-only — GET returns 405.

```
GET /api/v1/apps/<uuid>/ai/prompts/<prompt_id>/dependencies/
→ {success, response: {is_mapped: bool, agent_count, agents: [{id, name}], suggested_action}}
```

#### Typical prompt workflow (curl)

```bash
# Step 1 — Create prompt (first version auto-created and set active)
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/prompts/" \
  -H "Content-Type: application/json" -H "X-CSRFToken: $CSRF" -H "Referer: http://localhost:8000/platform/" \
  -d '{
    "name": "patient-triage-system",
    "type": "system",
    "content": "You are a clinical assistant in {{department}}. Protocol: {{protocol_version}}",
    "change_description": "Initial version"
  }'
# → {success, response: {prompt_id: 3}}
PROMPT_ID=3

# Step 2 — Add a new version (starts as draft)
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/prompts/$PROMPT_ID/versions/" \
  -H "Content-Type: application/json" -H "X-CSRFToken: $CSRF" -H "Referer: http://localhost:8000/platform/" \
  -d '{"content": "You are a senior clinical assistant in {{department}}. Always follow {{protocol_version}}.", "change_description": "Refined tone"}'
# → {success, response: {message: "Version v2 created", version: {id: 8, version_number: 2, status: "draft", variables: ["department", "protocol_version"]}}}
VERSION_ID=8

# Step 3 — Promote draft to active (takes effect immediately for all agents using this prompt)
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/prompts/$PROMPT_ID/versions/$VERSION_ID/promote/" \
  -H "X-CSRFToken: $CSRF" -H "Referer: http://localhost:8000/platform/" -H "Content-Length: 0"
# → {success, response: {message: "Version v2 promoted to active"}}
```

**Helper — list prompts and versions to find IDs:**

```bash
# List prompts
curl -s -b /tmp/zango_cookies \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/prompts/" \
  | python3 -c "
import json, sys
for p in json.load(sys.stdin)['response']['prompts']['records']:
    print(f\"id={p['id']}  name={p['name']}  type={p['type']}  active_v={p.get('active_version_number','—')}\")
"

# List versions for a specific prompt
curl -s -b /tmp/zango_cookies \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/prompts/$PROMPT_ID/versions/" \
  | python3 -c "
import json, sys
for v in json.load(sys.stdin)['response']['versions']:
    print(f\"id={v['id']}  v{v['version_number']}  status={v['status']}  vars={v.get('variables','[]')}\")
"
```

---

### Agents

#### List agents
```
GET /api/v1/apps/<uuid>/ai/agents/
Optional: ?search=<term>&status=active|disabled&page=1&page_size=10
→ {success, response: {agents: {total_records, records: [...]}, stats: {total_agents, active_agents}, message}}
```

#### Create agent
```
POST /api/v1/apps/<uuid>/ai/agents/
Headers: X-CSRFToken, Referer, Content-Type: application/json
Body (JSON):
{
  "name": "patient-summary-agent",
  "description": "",
  "provider_id": 1,
  "model": "gpt-4o-mini",
  "system_prompt_name": "patient-summary-system",
  "user_prompt_name": "patient-summary-user",
  "temperature": 0.2,
  "max_tokens": 2000,
  "timeout_seconds": 30,
  "output_schema": "Text",
  "tools": ["get_patient_lead_details"],
  "memory_enabled": false,
  "memory_max_messages": 20
}
→ {success, response: {message: "Agent created successfully", agent_id: <int>}}
```

**Notes:**
- `name`: lowercase letters, numbers, hyphens only — must be unique; this is the identifier used in `get_agent("name")`
- `provider_id`: integer ID of an enabled provider
- `system_prompt_name` / `user_prompt_name`: prompt `name` string (not ID) — prompt must be active; omit or pass `""` to leave unset
- `output_schema`: `"Text"` | `"JSON"` | `"Markdown"`
- **`output_json_schema` is REQUIRED when `output_schema` is `"JSON"`** — omitting it will cause agent creation to fail.

  **Schema rules differ by provider:**

  **OpenAI** enforces strict structured outputs — three rules apply:
  1. Every `object` must have `"additionalProperties": false`
  2. Every key listed in `properties` must also appear in `required`
  3. Nullable fields must use `anyOf` syntax — `{"type": ["string", "null"]}` shorthand is **not** accepted

  ```json
  "output_json_schema": {
    "type": "object",
    "additionalProperties": false,
    "required": ["summary", "is_urgent", "priority", "tags", "assigned_to"],
    "properties": {
      "summary":     {"type": "string"},
      "is_urgent":   {"type": "boolean"},
      "priority":    {"type": "integer"},
      "tags":        {"type": "array", "items": {"type": "string"}},
      "assigned_to": {"anyOf": [{"type": "string"}, {"type": "null"}]}
    }
  }
  ```

  For nested objects under OpenAI, apply the same rules recursively:
  ```json
  "address": {
    "anyOf": [
      {
        "type": "object",
        "additionalProperties": false,
        "required": ["street", "city", "pincode"],
        "properties": {
          "street":  {"anyOf": [{"type": "string"}, {"type": "null"}]},
          "city":    {"type": "string"},
          "pincode": {"type": "string"}
        }
      },
      {"type": "null"}
    ]
  }
  ```

  **Anthropic** is lenient — standard JSON Schema works without the strict rules:
  ```json
  "output_json_schema": {
    "type": "object",
    "properties": {
      "summary":     {"type": "string"},
      "is_urgent":   {"type": "boolean"},
      "priority":    {"type": "integer"},
      "tags":        {"type": "array"},
      "assigned_to": {"type": ["string", "null"]}
    }
  }
  ```

  If you don't need schema enforcement, use `"output_schema": "Text"` and parse JSON in code.
- `tools`: list of tool `name` strings (as registered after sync)
- `memory_enabled`: set to `true` to retain conversation history across `agent.run()` calls with the same `session_id`

#### Get / Update / Delete agent
```
GET    /api/v1/apps/<uuid>/ai/agents/<agent_id>/
PUT    /api/v1/apps/<uuid>/ai/agents/<agent_id>/
DELETE /api/v1/apps/<uuid>/ai/agents/<agent_id>/
```

Update body (JSON, all optional): same fields as create. Pass `"system_prompt_name": ""` to unlink a prompt.

Delete: soft-deletes (disables + renames with `-deleted` suffix) if invocation history exists; hard-deletes otherwise.

#### Agent actions
```
POST /api/v1/apps/<uuid>/ai/agents/<agent_id>/toggle/
Body (JSON): {"is_enabled": true}
→ {success, response: {message}}

POST /api/v1/apps/<uuid>/ai/agents/<agent_id>/duplicate/
→ Creates a disabled copy with "-copy" suffix.
  {success, response: {message, agent: {...}}}

POST /api/v1/apps/<uuid>/ai/agents/<agent_id>/test/
Content-Type: application/json  OR  multipart/form-data (when sending files)
Body fields:
  user_message      str           Required when agent has NO user prompt AND no files attached.
  variables         dict|str      Optional. Rendered into the agent's user_prompt template.
  system_variables  dict|str      Optional. Rendered into the agent's system_prompt template (separate from variables).
  files             file upload   Optional. One or more file attachments (multipart only).
Note: when sending files use multipart/form-data; variables/system_variables must be JSON strings in that case.
      When no files, plain JSON body works; variables/system_variables are plain dicts.
→ Runs a live test invocation (triggered_by="system"). Real invocation — logged + costs accrue.
  Returns up to 2000 chars of response content.
  {success, response: {message: "Test successful", result: {content, model, latency_ms, input_tokens, output_tokens, cost_usd}}}
Errors:
  400 — no provider configured
  400 — no user prompt + no user_message + no files: "This agent has no user prompt configured. Provide a 'user_message' or attach files to run a test."
  404 — agent not found
  500 — LLM/runtime error (message contains exception text)

# JSON body example (no files)
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/agents/$AGENT_ID/test/" \
  -H "Content-Type: application/json" -H "X-CSRFToken: $CSRF" -H "Referer: http://localhost:8000/platform/" \
  -d '{"variables": {"patient_id": 1}, "system_variables": {"department": "cardiology"}}'

# Multipart example (with file)
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/agents/$AGENT_ID/test/" \
  -H "X-CSRFToken: $CSRF" -H "Referer: http://localhost:8000/platform/" \
  -F "user_message=Summarise this document" \
  -F "system_variables={\"department\": \"cardiology\"}" \
  -F "files=@/path/to/report.pdf"
```

#### Agent memory sessions
```
GET    /api/v1/apps/<uuid>/ai/agents/<agent_id>/sessions/
Optional: ?search=<session_id_or_user_ref>&is_active=true|false
→ {success, response: {sessions: {total_records, records: [{session_id, user_ref, is_active, message_count, ...}]}}}

GET    /api/v1/apps/<uuid>/ai/agents/<agent_id>/sessions/<session_id>/
→ {success, response: {session: {session_id, messages: [...], ...}}}

DELETE /api/v1/apps/<uuid>/ai/agents/<agent_id>/sessions/<session_id>/
→ Clears all messages in the session.
  {success, response: {message: "Session cleared successfully"}}
```

---

### Tools

#### Sync tools
```
POST /api/v1/apps/<uuid>/ai/tools/sync/
Headers: X-CSRFToken, Referer
Body: (empty)
→ {success, response: {message: "Tool sync complete", stats: {created, updated, deactivated}}}
```
Scans all `tools.py` files in the workspace, registers new tools, and updates existing ones. Run after adding or modifying any `@tool` decorated function.

```bash
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/tools/sync/" \
  -H "X-CSRFToken: $CSRF" \
  -H "Referer: http://localhost:8000/platform/" \
  -H "Content-Length: 0"
```

#### List tools
```
GET /api/v1/apps/<uuid>/ai/tools/
Optional: ?search=<term>&section=<section>&safety=read_only|read_write&is_active=true|false
→ {success, response: {tools: {total_records, records: [...]}, stats: {active_tools, sections}}}
```

#### Get tool detail
```
GET /api/v1/apps/<uuid>/ai/tools/<tool_id>/
→ {success, response: {tool: {id, name, description, section, safety, timeout_seconds,
     rate_limit_rpm, parameters_schema, parameters_display, python_path, return_type,
     is_active, schema_hash, total_calls, total_errors, total_timeouts, avg_execution_ms,
     last_called_at, created_at, modified_at}}}
```

Note: `safety` values are lowercase strings: `"read_only"` or `"read_write"`.

#### List tool sections
```
GET /api/v1/apps/<uuid>/ai/tools/sections/
→ {success, response: {sections: [{section, count, active_count}]}}
```

---

### Invocations

#### Summary stats (header bar)
```
GET /api/v1/apps/<uuid>/ai/invocations/stats/
→ {success, response: {total_runs, today, errors_24h, cost_today}}
```

#### List invocations
```
GET /api/v1/apps/<uuid>/ai/invocations/
Optional:
  ?search=<agent|provider|model>
  &agent_id=<int>
  &provider_id=<int>
  &status=success|failed|timeout
  &triggered_by=user|system|task
  &model=<model_id>
  &session_id=<str>
  &has_session=yes|no
  &start_date=YYYY-MM-DD
  &end_date=YYYY-MM-DD
  &page=1&page_size=10
→ {success, response: {invocations: {total_records, records: [{id, run_id, session_id, round_number,
     provider_name, provider_slug, model, agent_name,
     input_tokens, output_tokens, cost_usd, latency_ms,
     triggered_by, status, error_type, stop_reason, created_at}]}, message}}
```

#### Get invocation detail
```
GET /api/v1/apps/<uuid>/ai/invocations/<invocation_id>/
→ {success, response: {invocation: {
     id, run_id, round_number, session_id,
     provider, provider_name, provider_slug,
     agent, agent_name,
     request_messages, request_system, request_tools, request_params, request_files,
     files: [{id, filename, media_type, size_bytes, sha256,
              source_kind,   # "upload" | "url"
              source_url,    # original URL when source_kind="url", else null
              url}],         # presigned download URL when blob mirrored, else null
     response_content, response_tool_calls, stop_reason,
     input_tokens, output_tokens, cache_creation_tokens, cache_read_tokens,
     cost_usd, latency_ms, time_to_first_token_ms,
     triggered_by, user_id_ref, celery_task_id,
     status, error_message, error_type,
     system_prompt_name, system_prompt_version, user_prompt_name, user_prompt_version,
     rendered_system_prompt, context_snapshot,
     created_at, modified_at,
     prompt_info: {system_prompt_name, system_prompt_version, user_prompt_name, user_prompt_version, rendered_system_prompt},
     cost_breakdown: {input_tokens, output_tokens, cache_creation_tokens, cache_read_tokens, cost_usd, stop_reason, latency_ms}
   }}}
```

---

## Audit Logs

```
GET /api/v1/apps/<uuid>/auditlog/
Optional: ?search=<term>
→ {success, response: {
     audit_logs: {total_records, records: [{id, actor, actor_type, action, object_id, object_uuid, object_type, timestamp, changes}]},
     total_stats: {total_changes, total_created, total_updated, total_deleted},
     message
   }}
```

---

## Access Logs

```
GET /api/v1/apps/<uuid>/access-logs/
Optional: ?search=<term>
→ {success, response: {
     access_logs: {total_records, records: [{id, ip_address, user, username, attempt_type, attempt_time, role, user_agent, is_login_successful, session_expired_at}]},
     total_failed_attempts,
     message
   }}
```

---

## Releases

```
GET  /api/v1/apps/<uuid>/releases/
→ {success, response: {releases: {total_records, records: [...]}, message}}

POST /api/v1/apps/<uuid>/releases/
```

---

## SAML Providers

```
GET  /api/v1/apps/<uuid>/saml-providers/
POST /api/v1/apps/<uuid>/saml-providers/
GET  /api/v1/apps/<uuid>/saml-providers/<id>/
PUT  /api/v1/apps/<uuid>/saml-providers/<id>/
```

---

## Platform Users

```
GET  /api/v1/auth/platform-users/
→ {success, response: {platform_users: {total_records, total_pages, next, previous, records: [{id, name, email, apps, is_superadmin, is_active, last_login, created_at}]}, message}}

POST /api/v1/auth/platform-users/
Body: name=<name>&email=<email>&password=<password>

GET  /api/v1/auth/platform-users/<id>/
→ {success, response: {platform_user: {...}}}

PUT  /api/v1/auth/platform-users/<id>/
```

---

## Health Check

```
GET /api/v1/health/
→ {success, response: {status, timestamp, services: {redis, cache, celery, celery_beat, database}}}
```

`success` is `false` when overall `status` is `"unhealthy"`. Each service object has `{success: bool, message: str}`.

---

## Celery Status

```
GET /platform/celery-status/
→ {success, response: {status: bool, active_workers: {...}}}
```

---

## Pagination

All list endpoints return:
```json
{"total_records": 10, "total_pages": 1, "next": null, "previous": null, "records": [...]}
```
Query params: `?page=1&page_size=10`

## Filtering

Most list endpoints support `?search=<term>` for text search and `?columns[field_name]=value` for column-specific filters.
