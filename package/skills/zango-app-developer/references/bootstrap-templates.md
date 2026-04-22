# Bootstrap Templates

These are the exact file templates to create when bootstrapping a Zango environment in the developer's current working directory.

## File: `deploy/.env`

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

## File: `deploy/Dockerfile`

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

## File: `deploy/init.sh`

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

## File: `deploy/docker_compose.yml`

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

## Bootstrap Commands

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

## Verification

After startup, the platform should be accessible at:
- **URL**: `http://localhost:8000/platform`
- **Username**: Value of PLATFORM_USERNAME from .env
- **Password**: Value of PLATFORM_USER_PASSWORD from .env

## Stopping and Restarting

```bash
# Stop
docker compose -f deploy/docker_compose.yml down

# Restart (data persists in dev_db volume)
export HOST_UID=$(id -u) HOST_GID=$(id -g)
docker compose -f deploy/docker_compose.yml up -d

# Full reset (destroys data)
docker compose -f deploy/docker_compose.yml down -v
```

## Running Management Commands Inside the Container

```bash
# General pattern
docker compose -f deploy/docker_compose.yml exec app bash -c "cd <PROJECT_NAME> && python manage.py <command>"

# Run migrations for an app
docker compose -f deploy/docker_compose.yml exec app bash -c "cd <PROJECT_NAME> && python manage.py ws_migrate <app_name>"

# Sync static files
docker compose -f deploy/docker_compose.yml exec app bash -c "cd <PROJECT_NAME> && python manage.py sync_static <app_name> && python manage.py collectstatic --noinput"

# Update apps (sync policies, tasks, etc.)
docker compose -f deploy/docker_compose.yml exec app bash -c "cd <PROJECT_NAME> && SINGLE_BEAT_REDIS_SERVER=redis://redis:6379/1 single-beat zango update-apps --app_name <app_name>"
```
