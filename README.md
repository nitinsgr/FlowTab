# FlowTab

Restaurant queue management & analytics SaaS platform.

## Architecture

```
┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Web App   │  │  Queue Service   │  │Analytics Service │
│  (apps/web) │  │ (services/queue) │  │ (services/analytics)
└──────┬──────┘  └────────┬─────────┘  └────────┬─────────┘
       │                  │                      │
       └──────────────────┼──────────────────────┘
                          │
                    ┌─────┴─────┐
                    │  Redis    │
                    │  (cache)  │
                    └─────┬─────┘
                          │
                    ┌─────┴─────┐
                    │PostgreSQL │
                    │ (primary) │
                    └───────────┘
```

| Component | Directory | Role |
|-----------|-----------|------|
| Queue Service | `services/queue-service/` | Waitlist, ETA, table allocation (FOH) |
| Analytics Service | `services/analytics-service/` | Reporting, dashboards, KPIs (BOH) |
| Web App | `apps/web/` | React frontend |
| Shared Types | `packages/shared-types/` | Shared interfaces & types |
| Config | `packages/config/` | Shared env & config helpers |
| DB | `packages/db/` | Database schema, migrations, models |

## Quick Start

```bash
# Docker Compose (recommended)
docker compose up --build

# Or Podman via script
./scripts/run-stack.sh
```

## Development

```bash
# Lint all services
npm run lint

# Format code
npm run format
```

## Production (Kubernetes)

Manifests are in `infra/k8s/` — one deployment + service per component.
