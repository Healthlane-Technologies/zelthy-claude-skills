# Zango AI Agents — Code Reference

Everything the LLM needs to write tools and run agents in Zango app code. Sourced directly from `zango/ai/` source.

---

## Setting Up an AI Provider (ALWAYS do this first)

Every agent needs a provider. Before creating prompts or agents via the API, a provider must exist in the App Panel.

### Step 1 — Check existing providers

Always check first — a compatible provider may already be configured:

```bash
curl -s -b /tmp/zango_cookies \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/providers/" \
  | python3 -c "
import json, sys
data = json.load(sys.stdin)
providers = data['response']['providers']['records']
if providers:
    for p in providers:
        print(f\"id={p['id']}  name={p['name']}  type={p.get('provider_slug','')}  model={p.get('default_model','')}  enabled={p.get('is_enabled','')}\")
else:
    print('No providers configured.')
"
```

### Step 2 — Decide: reuse or create

- **If a provider of the required type already exists and is enabled** → tell the user which one you'll use (name + id) and proceed directly to creating prompts/agents.
- **If no suitable provider exists** → announce the name you'll create (e.g. `doc-ai-openai`) and follow the manual setup steps below.

### Step 3 — Creating a new provider (only if needed)

**Do not ask for or collect API keys.** Instead, give the user these exact steps:

> **Please create the AI provider in the App Panel before I continue:**
>
> 1. Go to `http://localhost:8000/platform` → select your app → **AI → Providers**
> 2. Click **Add Provider**
> 3. Provider type: **`<ProviderType>`** (e.g. `OpenAI`)
> 4. Paste your API key
> 5. Default model: **`<model>`** (e.g. `gpt-4o-mini`)
> 6. Name: **`<provider-name>`** — use this exact name, it is referenced in code
> 7. **Save**
> 8. Reply here once saved and I'll continue.

Wait for the user to confirm, then re-run the list command above to get the new provider's integer `id`.

### Step 4 — Use the provider ID

Use the integer `id` returned from the list as `provider_id` in all agent creation calls.

---

## Defining Tools

### File location

Create `tools.py` inside any module under `backend/`:

```
backend/
└── patients/
    ├── models.py
    ├── views.py
    └── tools.py
```

### Imports

```python
from zango.ai.tools.decorator import ToolParam, ToolSafety, tool
```

### The @tool decorator

```python
@tool(
    name="get_patient_lead_details",
    description="Fetch patient lead details by lead ID. Returns name, DOB, status, and assigned navigator.",
    section="patients",
    safety=ToolSafety.READ_ONLY,
    timeout_seconds=10,
    rate_limit=None,          # calls-per-minute; None = unlimited
)
def get_patient_lead_details(
    lead_id: str = ToolParam(description="The lead ID, e.g. 'PN-0001'"),
) -> dict:
    from .models import PatientLead
    try:
        lead = PatientLead.objects.get(lead_id=lead_id)
    except PatientLead.DoesNotExist:
        return {"error": f"No patient found with lead_id {lead_id}"}
    return {
        "lead_id": lead.lead_id,
        "name": lead.name,
        "status": lead.status,
    }
```

### Decorator parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `str` | Yes | — | Unique tool name. Snake_case. This is what the LLM calls and what you reference in agent config. |
| `description` | `str` | Yes | — | Sent to the LLM to describe what the tool does. Write from the LLM's perspective — be explicit about when to use it. |
| `section` | `str` | No | `"general"` | Groups tools in the App Panel. |
| `safety` | `ToolSafety` | No | `READ_ONLY` | `READ_ONLY`, `WRITE`, or `EXTERNAL`. |
| `timeout_seconds` | `int` | No | `30` | Max execution time before the call is killed. |
| `rate_limit` | `int \| None` | No | `None` | Max calls per minute. `None` = unlimited. |
| `memory_policy` | `str` | No | `"include"` | `"include"` or `"exclude"`. Controls whether this tool's call/result is stored in and replayed from session memory. See [Memory Policy](#memory-policy-on-tools). |

### ToolSafety values

```python
ToolSafety.READ_ONLY    # Only reads data — no side effects
ToolSafety.WRITE        # Creates or modifies records in the database
ToolSafety.EXTERNAL     # Calls external APIs or services
```

**Note:** The API and App Panel display these as `"read_only"`, `"write"`, `"external"` (lowercase strings).

### ToolParam — parameter descriptors

```python
def my_tool(
    patient_id: str = ToolParam(description="The UUID of the patient"),
    days: int = ToolParam(description="Days to look back", default=7),
    status: str = ToolParam(
        description="Filter by status",
        default="active",
        enum=["active", "inactive", "pending"],
    ),
) -> dict:
    ...
```

| Argument | Description |
|----------|-------------|
| `description` | Shown to the LLM. Required. |
| `default` | Makes the param optional (LLM may omit it). Omit for required params. |
| `enum` | Restricts values; sent as JSON Schema `enum`. |

Parameters **without** `ToolParam` as their default are also valid — they use the param name as description and are required unless they have a Python default.

### Supported parameter types

```python
str, int, float, bool          # primitives
list[str], list[int]           # typed arrays
dict                           # freeform object
Optional[str]                  # makes it optional (nullable)
str | None                     # same, Python 3.10+ syntax
```

### Return values

Tools must return data that is JSON-serializable. The executor handles these types automatically:

- `dict`, `list`, `str`, `int`, `float`, `bool` → pass through
- `Decimal` → converted to `float`
- `datetime`, `date` → converted to ISO string
- `set` → converted to `list`
- `bytes` → base64-encoded string
- Anything else → `str(value)[:2000]`

Always return a `dict` for structured results. Return `{"error": "..."}` for expected failures — never raise exceptions for business logic errors.

### Multiple tools in one file

```python
@tool(name="get_item", description="...", section="items", safety=ToolSafety.READ_ONLY)
def get_item(item_id: int = ToolParam(description="Item database ID")) -> dict:
    ...

@tool(name="update_item_qty", description="...", section="items", safety=ToolSafety.WRITE)
def update_item_qty(
    item_id: int = ToolParam(description="Item database ID"),
    qty: int = ToolParam(description="New quantity"),
) -> dict:
    ...
```

### Tenant context in tools

Tools run in the correct tenant schema automatically — no manual schema switching needed:

```python
# Just use the ORM normally
items = Item.objects.filter(is_active=True)
```

### Memory Policy on Tools

When an agent has `short_term_memory` enabled, every tool call and its result are saved to session history and replayed on the next `agent.run()`. `memory_policy` controls whether a specific tool participates in that replay.

| Value | Behaviour |
|-------|-----------|
| `"include"` (default) | Tool call + result stored in session history; sent to LLM on subsequent turns. |
| `"exclude"` | Tool call + result **dropped** from loaded history. Use for irreversible side-effect tools. |

```python
# Side-effect tool — don't replay this in the next turn (notification already sent)
@tool(
    name="send_notification",
    description="Sends a push notification to the user. Call once the response is ready.",
    safety=ToolSafety.EXTERNAL,
    memory_policy="exclude",
)
def send_notification(
    user_id: int = ToolParam(description="The user to notify"),
    message: str = ToolParam(description="Notification body"),
) -> dict:
    ...
    return {"sent": True}
```

**Rule:** use `memory_policy="exclude"` for any tool that triggers an action outside the DB — sending email, SMS, calling a payment API. Replaying those in the next session turn would cause double-sends.

### After defining tools: sync

After writing or modifying any `@tool` function, sync via App Panel → AI → Tools → **Sync Tools**, or via API:

```bash
curl -s -b /tmp/zango_cookies -X POST \
  "http://localhost:8000/api/v1/apps/$APP_UUID/ai/tools/sync/" \
  -H "X-CSRFToken: $CSRF" -H "Referer: http://localhost:8000/platform/" \
  -H "Content-Length: 0"
```

---

## Running Agents

### Import

```python
from zango.ai import get_agent
```

### Basic usage

```python
agent = get_agent("my-agent-name")
response = agent.run(
    variables={"lead_id": "PN-0001", "question": "What is this patient's status?"},
    triggered_by="user",
)
print(response.content)
print(response.cost_usd)
```

### get_agent()

Looks up `AppLLMAgent` by name in the current tenant's schema.

```python
agent = get_agent("agent-name")   # raises AgentNotFound if not found or disabled
```

### agent.run() — all parameters

```python
response = agent.run(
    input=None,               # Plain string message — simplest way to call the agent
    variables=None,           # Dict rendered into the agent's user_prompt template
    messages=None,            # Full LLMMessage list — low-level escape hatch
    files=None,               # List of LLMFile for image/document attachments
    triggered_by="user",      # "user" | "celery" | "cron" | "system"
    max_tool_rounds=10,       # Safety limit on tool-call rounds
    session_id=None,          # Memory session key; auto-generated if short_term_memory=True
    user_ref="",              # Opaque string stored on session for audit (e.g. user PK)
)
```

**Input priority** (first non-None wins):
1. `messages` — caller provides full `LLMMessage` list
2. `input` — plain string; use when the agent has a system prompt but no user prompt template configured
3. `variables` — rendered into the agent's configured `user_prompt` template; standard when the agent's prompt is managed in the App Panel

If all three are `None` and the agent has no user prompt, raises `ValueError`.

**`messages=` — multi-turn / manual history:**

```python
from zango.ai import get_agent, LLMMessage

agent = get_agent("chat-agent")
response = agent.run(
    messages=[
        LLMMessage(role="user", content="What's the capital of France?"),
        LLMMessage(role="assistant", content="Paris."),
        LLMMessage(role="user", content="And what's its population?"),
    ],
    triggered_by="user",
)
```

This bypasses the agent's prompt template entirely. Used for injecting explicit conversation history.

### The response object

```python
response.content              # str — final text from the LLM
response.cost_usd             # float — total cost across all tool rounds
response.usage.input_tokens   # int
response.usage.output_tokens  # int
response.usage.cache_creation_tokens  # int (Anthropic only)
response.usage.cache_read_tokens      # int (Anthropic only)
response.latency_ms           # int — total wall time
response.stop_reason          # "end_turn" | "tool_use" | "max_tokens" | "refusal"
response.model                # str — actual model used
response.session_id           # str | None — set when short_term_memory is enabled
response.parsed_content       # dict | None — set when output_schema=JSON and valid
response.invocation_id        # int | None — DB PK of last invocation record
```

### Calling from a view

```python
from django.http import JsonResponse
from django.views import View
import json

class PatientSummaryView(View):
    def post(self, request, *args, **kwargs):
        from zango.ai import get_agent

        body = json.loads(request.body)
        agent = get_agent("patient-summary-agent")
        response = agent.run(
            variables={
                "lead_id": body.get("lead_id"),
                "question": body.get("question"),
            },
            triggered_by="user",
        )
        return JsonResponse({"content": response.content, "cost_usd": response.cost_usd})
```

### Calling from an async task

```python
from zango.apps.tasks.base import BaseTask

class DailySummaryTask(BaseTask):
    name = "daily_summary"

    def run(self):
        from zango.ai import get_agent
        from .models import PatientLead

        agent = get_agent("summary-agent")
        for lead in PatientLead.objects.filter(status="pending"):
            response = agent.run(
                variables={"lead_id": lead.lead_id, "question": "Should we follow up?"},
                triggered_by="celery",
            )
            # use response.content ...
```

### Memory sessions

Enable `short_term_memory` on the agent in the App Panel. Optionally set `short_term_memory_max_messages` (default 20) to control the sliding window of message pairs loaded per call.

```python
agent = get_agent("chat-agent")  # must have short_term_memory=True in App Panel

# First turn — session_id auto-generated as UUID
response = agent.run(input="Who is PN-0001?", triggered_by="user")
sid = response.session_id   # store this; pass it back on subsequent turns

# Subsequent turns — continue the same conversation
response2 = agent.run(
    input="What was their last screening date?",
    triggered_by="user",
    session_id=sid,
    user_ref=str(request.user.pk),  # optional: stored on session for audit
)

# Clear a session when conversation is complete
agent.clear_session(sid)   # returns True if found, False otherwise
```

Tool call/result rounds from agentic loops are also persisted in session memory and replayed on the next turn — unless the tool has `memory_policy="exclude"` (see above).

---

## File Attachments (Multimodal)

```python
from zango.ai import get_agent, LLMFile

agent = get_agent("prescription-reader")

# From a Django model file field
response = agent.run(
    input="Extract all medications from this prescription.",
    files=[LLMFile.from_django_file(prescription.file)],
    triggered_by="user",
)

# From request upload
response = agent.run(
    input="Analyse this report.",
    files=[LLMFile.from_django_file(request.FILES["report"])],
    triggered_by="user",
)

# From raw bytes
response = agent.run(
    files=[LLMFile.from_bytes(pdf_bytes, media_type="application/pdf")],
    triggered_by="user",
)

# From a public URL
response = agent.run(
    files=[LLMFile.from_url("https://example.com/scan.jpg")],
    triggered_by="user",
)

# From a local file path
response = agent.run(
    files=[LLMFile.from_path("/tmp/report.pdf")],
    triggered_by="system",
)
```

---

## Direct Provider Access (without an agent)

Use `get_provider()` for raw LLM calls when you don't need an agent config:

```python
from zango.ai import get_provider, LLMMessage

provider = get_provider("my-provider-name")
response = provider.complete(
    messages=[LLMMessage(role="user", content="Summarise this in one sentence.")],
    model="gpt-4o-mini",
)
print(response.content)
print(response.cost_usd)
```

---

## Prompt Access (without an agent)

```python
from zango.ai import get_prompt

prompt_version = get_prompt("patient-summary-system")  # raises PromptNotFound if inactive
rendered = prompt_version.render(
    patient_name="Jane Doe",
    screening_date="2024-03-15",
)
# rendered is a str — the prompt with variables substituted
```

---

## Error Handling

All exceptions inherit from `ZangoAIError` (`zango.ai.exceptions`).

| Exception | Raised by | When | Useful attributes |
|-----------|-----------|------|-------------------|
| `AgentNotFound` | `get_agent()` | No agent with that name, or it is inactive | `e.name` |
| `AgentDisabled` | `agent.run()` | Agent exists but is toggled off in the App Panel | `e.name` |
| `PromptRenderError` | `agent.run()` | A `{{variable}}` placeholder was not supplied in `variables=` | `e.missing_vars` (list) |
| `BudgetExceeded` | `agent.run()` | Provider's monthly spend limit reached | `e.provider_name`, `e.budget_limit` |
| `RateLimitExceeded` | `agent.run()` | Provider rate limit hit | `e.retry_after_seconds` |
| `LLMTimeoutError` | `agent.run()` | LLM request timed out | — |
| `LLMAPIError` | `agent.run()` | Provider returned an API-level error | `e.status_code`, `e.original_error` |
| `OutputParseError` | `agent.run()` | Output Schema is JSON but response couldn't be parsed | — |
| `OutputValidationError` | `agent.run()` | Parsed JSON doesn't match the configured JSON Schema | `e.field`, `e.errors` |

```python
from zango.ai import get_agent
from zango.ai.exceptions import (
    AgentNotFound,      # name not found or agent is disabled
    AgentDisabled,      # agent exists but is_enabled=False
    PromptRenderError,  # missing {{variable}} in prompt; .missing_vars
    BudgetExceeded,     # monthly budget for the provider hit
    RateLimitExceeded,  # provider rate limit hit; .retry_after_seconds
    LLMAPIError,        # provider API error; .status_code, .original_error
    LLMTimeoutError,    # LLM request timed out
    OutputParseError,   # output_schema=JSON but LLM returned invalid JSON
    OutputValidationError,  # JSON valid but doesn't match output_json_schema; .field, .errors
)

try:
    agent = get_agent("my-agent")
    response = agent.run(variables={...}, triggered_by="user")
except AgentNotFound as e:
    ...    # e.name
except BudgetExceeded as e:
    ...    # e.provider_name, e.budget_limit
except RateLimitExceeded as e:
    ...    # e.retry_after_seconds (may be None)
except OutputParseError:
    ...    # LLM returned non-JSON when JSON was expected
except OutputValidationError as e:
    ...    # e.field, e.errors
except Exception:
    ...    # LLM API errors, timeouts, etc.
```

---

## Testing an Agent from the App Panel

Every agent has a **Test** button in App Panel → AI → Agents. Use it to run a live invocation without writing code.

- **Agent with a user prompt configured** — test fires immediately using the prompt template. A result modal shows the response, latency (ms), and token counts.
- **Agent with no user prompt** — a modal opens. Type a `user_message` and submit; that string is sent as the user input for the test run.

When telling a user to verify an agent works, direct them to this button first before writing shell/curl test code.

For the full API spec to test via curl, see the `POST …/agents/<agent_id>/test/` entry in **app-panel-api.md → AI Agents**.

---

## Django Shell Testing

```python
from django.db import connection
from zango.apps.shared.tenancy.models import TenantModel

connection.set_tenant(TenantModel.objects.get(name="your-app-name"))

from zango.ai import get_agent

agent = get_agent("my-agent")
response = agent.run(
    variables={"lead_id": "PN-0001", "question": "Summarise this patient."},
    triggered_by="user",
)
print(response.content)
print(f"Cost: ${response.cost_usd}")
```

`connection.set_tenant()` is only needed in the Django shell. Views and tasks set the tenant automatically.

---

## Common Patterns

### Agent action on a CRUD view

```python
class PatientView(BaseCrudView):
    model = PatientLead
    # ... table, form, etc.

    def post(self, request, *args, **kwargs):
        if request.GET.get("action") == "summarise":
            from zango.ai import get_agent
            import json

            body = json.loads(request.body)
            agent = get_agent("patient-summary-agent")
            response = agent.run(
                variables={"lead_id": body.get("lead_id"), "question": body.get("question")},
                triggered_by="user",
            )
            return JsonResponse({"content": response.content})

        return super().post(request, *args, **kwargs)
```

Call at `POST /patients/?action=summarise`.

### Tool that calls another model

```python
@tool(
    name="get_navigator_workload",
    description="Returns the number of active patients assigned to a patient navigator.",
    section="masters",
    safety=ToolSafety.READ_ONLY,
)
def get_navigator_workload(
    navigator_id: int = ToolParam(description="Database ID of the patient navigator"),
) -> dict:
    from ..patients.models import PatientLead   # relative import from sibling module

    count = PatientLead.objects.filter(navigator_id=navigator_id, status="active").count()
    return {"navigator_id": navigator_id, "active_patient_count": count}
```

### Tool with optional parameters

```python
@tool(name="search_patients", description="Search patients by name or status.", section="patients", safety=ToolSafety.READ_ONLY)
def search_patients(
    query: str = ToolParam(description="Name or lead ID to search for"),
    status: str = ToolParam(
        description="Filter by status. Leave blank for all.",
        default="",
        enum=["", "active", "inactive", "pending"],
    ),
    limit: int = ToolParam(description="Max results to return", default=10),
) -> dict:
    from .models import PatientLead

    qs = PatientLead.objects.all()
    if query:
        qs = qs.filter(name__icontains=query)
    if status:
        qs = qs.filter(status=status)

    results = list(qs.values("lead_id", "name", "status")[:limit])
    return {"results": results, "count": len(results)}
```
