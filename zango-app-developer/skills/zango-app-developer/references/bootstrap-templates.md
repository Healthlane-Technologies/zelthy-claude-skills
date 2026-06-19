# Bootstrap Templates

These are the exact file templates to create when bootstrapping a Zango environment in the developer's current working directory.

> **Two setup modes are supported.** Docker mode uses the full Docker Compose stack. Venv mode runs Django locally and uses Docker only for Postgres and Redis. Choose the right section below based on the mode selected in Capability 1.

---

## Docker Mode Files

### File: `deploy/.env` (Docker mode)

```env
COMPOSE_PROJECT_NAME=zango-a1b2
PLATFORM_USERNAME=platform_admin@zango.dev
PLATFORM_USER_PASSWORD=Zango@123
PROJECT_NAME=zango_project
POSTGRES_USER=zango_admin
POSTGRES_PASSWORD=zangopass
POSTGRES_DB=zango
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
REDIS_HOST=redis
REDIS_PORT=6379
PLATFORM_DOMAIN_URL=localhost
CSRF_TRUSTED_ORIGINS=http://localhost:3000
FIELD_ENCRYPTION_KEY=<generate-fernet-key>
```

**`FIELD_ENCRYPTION_KEY`** is required for app secrets encryption. Generate a random Fernet key at bootstrap time and store it here:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```
Never change this key after creation — existing encrypted secrets will become unreadable.

Ask the user if they want to customize any of these values before writing. Use these as sensible defaults. `COMPOSE_PROJECT_NAME` controls the Docker Compose project name (container prefix) — generate a unique default like `zango-<random-4-chars>` so containers aren't always prefixed with "deploy-".

### File: `deploy/Dockerfile`

```dockerfile
FROM kczelthy/zango:latest

RUN apt-get update && apt-get install -y net-tools sudo && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ARG HOST_UID=1000
ARG HOST_GID=1000

RUN groupadd -o -g $HOST_GID -r zango_user && \
    adduser --uid $HOST_UID --gid $HOST_GID --disabled-password --gecos "" zango_user && \
    echo 'zango_user ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

USER zango_user

COPY init.sh /zango/
WORKDIR /zango/
CMD ["/bin/sh", "init.sh"]
```

### File: `deploy/init.sh`

```bash
#!/bin/bash

set -a
source /zango/.env
set +a

if [ -z "$PLATFORM_DOMAIN_URL" ]; then
    PLATFORM_DOMAIN_URL="localhost"
fi

cd "$PROJECT_NAME" 2>/dev/null

if [ -d "$PROJECT_NAME" ]; then
    echo "Restarting existing project..."
    if [ "${UPDATE_APPS_ON_STARTUP:-true}" = "true" ]; then
        echo "Updating apps..."
        SINGLE_BEAT_REDIS_SERVER=redis://${REDIS_HOST}:${REDIS_PORT}/1 single-beat zango update-apps
    fi
else
    cd /zango
    zango start-project $PROJECT_NAME \
        --db_name="$POSTGRES_DB" \
        --db_user="$POSTGRES_USER" \
        --db_password="$POSTGRES_PASSWORD" \
        --db_host="$POSTGRES_HOST" \
        --db_port="$POSTGRES_PORT" \
        --platform_username="$PLATFORM_USERNAME" \
        --platform_user_password="$PLATFORM_USER_PASSWORD" \
        --redis_host="$REDIS_HOST" \
        --redis_port="$REDIS_PORT" \
        --platform_domain_url="$PLATFORM_DOMAIN_URL"
    cd "$PROJECT_NAME"
fi

python manage.py runserver 0.0.0.0:8000
```

### File: `deploy/docker_compose.yml`

```yaml
name: ${COMPOSE_PROJECT_NAME}

services:
  postgres:
    image: postgres:15
    env_file:
      - .env
    environment:
      POSTGRES_HOST_AUTH_METHOD: md5  # ensures pg_hba.conf allows host connections from containers and local tools
    ports:
      - "127.0.0.1:5432:5432"  # host port — connect via TablePlus/psql at localhost:5432
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} -p ${POSTGRES_PORT}",
        ]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - dev_db:/var/lib/postgresql/data

  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - HOST_UID=${HOST_UID}
        - HOST_GID=${HOST_GID}
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
    env_file:
      - .env
    environment:
      ENV: dev
    volumes:
      - .:/zango/
    healthcheck:
      test: ["CMD-SHELL", "netstat -ltn | grep -q 8000"]
      timeout: 5s
      retries: 3

  celery:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - HOST_UID=${HOST_UID}
        - HOST_GID=${HOST_GID}
    command: /bin/sh -c "cd ${PROJECT_NAME} && celery -A ${PROJECT_NAME} worker -l info"
    volumes:
      - .:/zango/
    env_file:
      - .env
    depends_on:
      app:
        condition: service_healthy
      redis:
        condition: service_healthy

  redis:
    image: redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  celery_beat:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - HOST_UID=${HOST_UID}
        - HOST_GID=${HOST_GID}
    command: /bin/sh -c "cd ${PROJECT_NAME} && single-beat celery -A ${PROJECT_NAME} beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler"
    volumes:
      - .:/zango/
    env_file:
      - .env
    depends_on:
      app:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  dev_db:
```

### Bootstrap Commands (Docker mode)

After creating all files in `deploy/`:

```bash
# Make init.sh executable
chmod +x deploy/init.sh

# Export host user IDs for file permission alignment
export HOST_UID=$(id -u)
export HOST_GID=$(id -g)

# Build and start all services
docker compose -f deploy/docker_compose.yml up -d --build

# Wait for health checks, then verify
# Poll until the platform responds
curl -s -o /dev/null -w "%{http_code}" -L http://localhost:8000/platform
```

### Verification (Docker mode)

After startup, the platform should be accessible at:
- **URL**: `http://localhost:8000/platform`
- **Username**: Value of PLATFORM_USERNAME from .env
- **Password**: Value of PLATFORM_USER_PASSWORD from .env

### Local DB Access — TablePlus / psql (Docker mode)

The postgres container already binds port `5432` to the host. Connect from TablePlus or any local client using:

| Field    | Value |
|----------|-------|
| Host     | `localhost` (NOT `postgres` — that name is only valid inside Docker) |
| Port     | `5432` |
| User     | Value of `POSTGRES_USER` from `.env` (default: `zango_admin`) |
| Password | Value of `POSTGRES_PASSWORD` from `.env` (default: `zangopass`) |
| Database | Value of `POSTGRES_DB` from `.env` (default: `zango`) |

> If port 5432 is already occupied on your machine, change the host-side mapping in `docker_compose.yml` (e.g. `"5433:5432"`) and connect TablePlus on port `5433`.

### Stopping and Restarting (Docker mode)

```bash
# Stop
docker compose -f deploy/docker_compose.yml down

# Restart (data persists in dev_db volume)
export HOST_UID=$(id -u) HOST_GID=$(id -g)
docker compose -f deploy/docker_compose.yml up -d

# Full reset (destroys data)
docker compose -f deploy/docker_compose.yml down -v
```

### Running Management Commands Inside the Container (Docker mode)

```bash
# General pattern
docker compose -f deploy/docker_compose.yml exec app bash -c "cd <PROJECT_NAME> && python manage.py <command>"

# Run migrations for an app
docker compose -f deploy/docker_compose.yml exec app bash -c "cd <PROJECT_NAME> && python manage.py ws_migrate <app_name>"

# Sync static files
docker compose -f deploy/docker_compose.yml exec app bash -c "cd <PROJECT_NAME> && python manage.py sync_static <app_name> && python manage.py collectstatic --noinput"

# Sync policies / tasks after code changes: use the App Panel APIs (HTTP, mode-independent),
# See SKILL.md STEP 5 and app-panel-api.md (Policies / Tasks sync).
```

---

## Venv Mode

The Django app runs locally in a virtualenv. Only Postgres and Redis run in Docker — there is no app container.

### Step-by-Step

1. **Gather configuration** - Same defaults as Docker mode. *(Requires Python 3.10+ and Docker locally.)*

2. **Venv setup** - Ask for an existing venv path or a new one (default: `./venv`):
   - New: `python3 -m venv <venv_path> && <venv_path>/bin/pip install zango`
   - Existing: verify with `<venv_path>/bin/pip show zango` (the `zango` CLI is a Click command group and has **no** `--version` option — `zango --version` errors with `No such option: --version`; use `zango --help` to list available commands instead)

3. **Save config** - Write `.claude/zango-config.json` (use absolute path for venv). Persist the gathered project name and platform admin credentials here too — they are passed to `start-project` as CLI flags and reported back to the user as access info:
   ```json
   {
     "setup_mode": "venv",
     "venv_path": "/absolute/path/to/venv",
     "project_name": "zango_project",
     "platform_username": "platform_admin@zango.dev",
     "platform_user_password": "Zango@123"
   }
   ```

4. **Create DB-only files** - Use the templates below (`docker_compose_db.yml` and `.env` venv variant).

5. **Start DB services:**
   ```bash
   docker compose -f deploy/docker_compose_db.yml up -d
   ```

6. **Bootstrap project** - Run from project root (see Bootstrap Commands section below for the full `zango start-project` invocation).

6a. **Add `FIELD_ENCRYPTION_KEY` to the server's root `.env`** — **REQUIRED, do this immediately after `start-project`, before adding any secrets provider.**

   `start-project` auto-generates a `.env` in the **project root** (the directory you ran it from, i.e. the parent of `<PROJECT_NAME>/`) containing only `POSTGRES_*`, `REDIS_*`, `PROJECT_NAME`, `UPDATE_APPS_ON_STARTUP`. **This** is the file the dev server reads — Django settings load it via `environ.Env.read_env(BASE_DIR.parent/.env)`. It does **not** read `deploy/.env` (that file is only consumed by `docker_compose_db.yml` for the Postgres container). `FIELD_ENCRYPTION_KEY` is **not** written by `start-project` and defaults to `""`, so adding a secrets provider fails with: `FIELD_ENCRYPTION_KEY defined incorrectly: Fernet key must be 32 url-safe base64-encoded bytes.`

   Generate a key and append it to the root `.env` (run from the project root, the same dir you ran `start-project` from):
   ```bash
   echo "FIELD_ENCRYPTION_KEY=$(<venv_path>/bin/python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())')" >> .env
   ```
   Then (re)start `runserver` and the worker so they pick up the new value. If the server was already running, it must be restarted — env vars are read at startup.

7. **Start the development server** (in a separate terminal):
   ```bash
   cd <PROJECT_NAME> && <venv_path>/bin/python manage.py runserver 0.0.0.0:8000
   ```

8. **Start the Celery worker** (in ANOTHER separate terminal — REQUIRED, not optional):
   ```bash
   cd <PROJECT_NAME> && OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES <venv_path>/bin/celery -A <PROJECT_NAME> worker -l info
   ```
   **Mandatory from the start:** venv mode (unlike Docker) runs no worker unless you start one. Async Celery tasks — app creation, and any in-app `.delay()` task — are never consumed with `runserver` alone; they sit pending forever. Always run the worker alongside `runserver`. If an async operation "hangs", suspect the missing worker first — not the API.

   **macOS fork() crash (apply on darwin):** Celery's default `prefork` pool calls `fork()`, which the macOS Objective-C runtime forbids — the worker crashes (often while processing the first task) with `objc[...]: +[... initialize] may have been in progress in another thread when fork() was called. ... crashing instead`. The `OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES` prefix above prevents this while keeping the prefork pool. If it still crashes, fall back to a non-forking pool: append `--pool=threads` (or `--pool=solo`). On Linux/Docker the env var is harmless, so it is safe to always include it.

8a. **Start Celery beat** (in ANOTHER separate terminal — required if the app uses scheduled/periodic tasks):
   ```bash
   cd <PROJECT_NAME> && OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES <venv_path>/bin/celery -A <PROJECT_NAME> beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
   ```
   The Docker stack always runs a dedicated `celery_beat` service; **Without beat, scheduled tasks never fire** (the worker only consumes tasks that something enqueues; beat is what enqueues them on schedule) Skip this only if the app has no periodic/scheduled tasks.

9. **Wait for health** - Poll `http://localhost:8000/platform` until HTTP 200, then share credentials.

---

### Venv Mode Files

### File: `deploy/docker_compose_db.yml` (Venv mode — DB services only)

```yaml
name: ${COMPOSE_PROJECT_NAME}

services:
  postgres:
    image: postgres:15
    env_file:
      - .env
    ports:
      - "5432:5432"
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} -p ${POSTGRES_PORT}",
        ]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - dev_db:/var/lib/postgresql/data

  redis:
    image: redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  dev_db:
```

### File: `deploy/.env` (Venv mode)

**Important — two different `.env` files in venv mode:**
- **`deploy/.env`** (this file) is read **only** by `docker_compose_db.yml` to provision the Postgres container. Practically only the `POSTGRES_*` values matter here.
- **`<project-root>/.env`** (the parent of `<PROJECT_NAME>/`) is auto-generated by `start-project` and is the file the **Django dev server / Celery worker** actually read (`environ.Env.read_env(BASE_DIR.parent/.env)`). `FIELD_ENCRYPTION_KEY` must live **there** — see Venv Mode Bootstrap Step 6a. Putting it only in `deploy/.env` will NOT fix the Fernet key error.

Where the other gathered values go (so they are **not** needed in `deploy/.env`):
- **`PROJECT_NAME`** — `start-project` auto-writes it into the project-root `.env`; nothing to do.
- **`PLATFORM_USERNAME` / `PLATFORM_USER_PASSWORD`** — passed only as `start-project` CLI flags (`--platform_username` / `--platform_user_password`) to create the platform admin login; they are not read from any `.env` afterward. Persist them in `.claude/zango-config.json` and report them to the user as login credentials.

The key difference from Docker mode: `POSTGRES_HOST=localhost` and `REDIS_HOST=localhost` because the app runs on the host machine, not inside a container.

```env
COMPOSE_PROJECT_NAME=zango-a1b2
POSTGRES_USER=zango_admin
POSTGRES_PASSWORD=zangopass
POSTGRES_DB=zango
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

### File: `.claude/zango-config.json`

Create this file in the project root to persist setup mode and venv path for the current session and future sessions:

```json
{
  "setup_mode": "venv",
  "venv_path": "/absolute/path/to/venv",
  "project_name": "zango_project",
  "platform_username": "platform_admin@zango.dev",
  "platform_user_password": "Zango@123"
}
```

Use the absolute path. Expand `~` and relative paths before writing.

### Bootstrap Commands (Venv mode)

```bash
# 1. Start DB services only
docker compose -f deploy/docker_compose_db.yml up -d

# 2. Wait for postgres to be healthy
docker compose -f deploy/docker_compose_db.yml ps

# 3. Bootstrap the Zango project (replace placeholders with values from .env)
#    IMPORTANT: prepend the venv's bin to PATH. `zango start-project` internally
#    shells out to bare `django-admin startproject ...` (subprocess with shell=True),
#    which resolves `django-admin` from PATH. Calling `<venv_path>/bin/zango` directly
#    does NOT put `<venv_path>/bin` on PATH, so django-admin is not found and bootstrap
#    fails with: `/bin/sh: django-admin: command not found`.
PATH="<venv_path>/bin:$PATH" <venv_path>/bin/zango start-project <PROJECT_NAME> \
  --db_name="<POSTGRES_DB>" \
  --db_user="<POSTGRES_USER>" \
  --db_password="<POSTGRES_PASSWORD>" \
  --db_host="localhost" \
  --db_port="5432" \
  --platform_username="<PLATFORM_USERNAME>" \
  --platform_user_password="<PLATFORM_USER_PASSWORD>" \
  --redis_host="localhost" \
  --redis_port="6379" \
  --platform_domain_url="localhost"

# 4. Start the development server (run in a separate terminal)
cd <PROJECT_NAME> && <venv_path>/bin/python manage.py runserver 0.0.0.0:8000

# 5. Start the Celery worker (run in ANOTHER terminal — REQUIRED for async tasks)
#    macOS: keep the OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES prefix to avoid the fork() crash
#    (see Step 8 in Venv Mode Bootstrap above; add --pool=threads if it still crashes).
cd <PROJECT_NAME> && OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES <venv_path>/bin/celery -A <PROJECT_NAME> worker -l info

# 5b. Start Celery beat (ANOTHER terminal) — REQUIRED if the app has scheduled/periodic tasks.
#     Docker runs a dedicated celery_beat service; venv does not. Without beat, scheduled tasks never fire.
cd <PROJECT_NAME> && OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES <venv_path>/bin/celery -A <PROJECT_NAME> beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler

# 6. Verify the platform is up
curl -s -o /dev/null -w "%{http_code}" -L http://localhost:8000/platform
```

### Running Management Commands (Venv mode)

Run these from the project root (one directory above `<PROJECT_NAME>/`):

```bash
# Migrations
cd <PROJECT_NAME> && <venv_path>/bin/python manage.py ws_makemigration <app_name>
cd <PROJECT_NAME> && <venv_path>/bin/python manage.py ws_migrate <app_name>

# Sync static files
cd <PROJECT_NAME> && <venv_path>/bin/python manage.py sync_static <app_name>
cd <PROJECT_NAME> && <venv_path>/bin/python manage.py collectstatic --noinput

# Sync policies / tasks after code changes: use the App Panel APIs (HTTP, mode-independent),
# See SKILL.md STEP 5 and app-panel-api.md (Policies / Tasks sync).

# Start Celery worker (in a separate terminal)
# macOS: OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES avoids the fork() crash (add --pool=threads if needed).
cd <PROJECT_NAME> && OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES <venv_path>/bin/celery -A <PROJECT_NAME> worker -l info

# Start Celery beat (in a separate terminal)
cd <PROJECT_NAME> && OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES <venv_path>/bin/celery -A <PROJECT_NAME> beat -l info \
  --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

### Stopping and Restarting DB Services (Venv mode)

```bash
# Stop DB containers
docker compose -f deploy/docker_compose_db.yml down

# Restart DB containers (data persists in dev_db volume)
docker compose -f deploy/docker_compose_db.yml up -d

# Full DB reset (destroys all data)
docker compose -f deploy/docker_compose_db.yml down -v
```
