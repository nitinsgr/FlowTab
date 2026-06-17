# 🍽️ FlowTab – SaaS Platform for Restaurants

FlowTab is a **cloud‑native, multi‑tenant SaaS** that delivers an integrated **front‑of‑house (FOH) wait‑list & queue manager**, **back‑of‑house (BOH) operational insights**, and **owner‑level analytics**.

---

## 📋 Table of Contents

1. [Vision & Mission](#vision--mission)
2. [Project Structure](#-project-structure)
3. [Architecture Overview](#-architecture-overview)
4. [Core Services](#-core-services)
5. [Technology Stack](#-technology-stack)
6. [Getting Started](#-getting-started)
7. [Development Workflow](#-development-workflow)
8. [API Documentation](#-api-documentation)
9. [Testing](#-testing)
10. [Deployment](#-deployment)
11. [Contributing](#-contributing)
12. [License](#-license)

---

## Vision & Mission

| | Description |
|---|-------------|
| **Vision** | *"Every restaurant can orchestrate its floor‑plan and guest flow as seamlessly as its kitchen."* |
| **Mission** | Deliver a reliable, scalable, and data‑driven platform that reduces table‑turn waste, improves guest experience, and gives owners actionable intelligence. |

**Target audience:** Hosts (FOH), Managers, Kitchen staff (BOH), Restaurant Owners.

---

## 🗂 Project Structure

```
FlowTab/project
├── frontend/                    # React UI
├── services/
│   ├── queue-service/           # FOH – waitlist, ETA, tables
│   └── analytics-service/       # BOH – dashboards, reports
├── infra/
│   ├── docker/                  # Dockerfiles (future)
│   └── k8s/                     # Kubernetes manifests
├── docs/                        # API specs
├── tests/                       # Tests
├── run-stack.sh                 # One‑click dev launcher (Podman)
├── podman-compose.yml           # Compose file
├── .env                         # Environment variables
└── README.md                    # This file
```

---

## 🏛 Architecture Overview

Micro‑service architecture with independent, event‑driven services.

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Frontend UI │◄──►│ Queue Srv.   │◄──►│ Analytics    │
│  (React)     │    │ (FOH) :3000  │    │ (BOH) :3002  │
└──────────────┘    └──────┬───────┘    └──────┬───────┘
                           │                   │
                           ▼                   ▼
                     ┌──────────┐      ┌──────────┐
                     │PostgreSQL│      │  Redis   │
                     │ :5432    │      │ :6379    │
                     └──────────┘      └──────────┘
```

**Key principles:**
- **Stateless services** – easy horizontal scaling.
- **Event‑driven** via Kafka (planned) for loose coupling.
- **Shared state** in PostgreSQL; Redis for caching.
- **Role‑Based Access Control** via Auth0 (future).

---

## 🔧 Core Services

### 1️⃣ Queue Service (FOH)
- **Role:** Manage wait‑list, calculate ETA, handle real‑time seat allocation.
- **Actors:** Host/Hostess, Server, Guest (via future portal).
- **Port:** `3000` (host) → `3000` (container).

### 2️⃣ Analytics Service (BOH)
- **Role:** Aggregate KPIs, serve dashboards, export reports.
- **Actors:** Manager, Owner, Corporate Admin.
- **Port:** `3002` (host) → `3001` (container).

### 3️⃣ Frontend
- **Role:** Host dashboard (FOH), Manager console (BOH), Owner views.
- **Tech:** React + TypeScript + Material‑UI (planned).
- **Port:** `3001` (host) → `80` (container).

### 4️⃣ PostgreSQL
- **Image:** `postgres:15-alpine`, **Port:** `5432`, **DB:** `restaurantdb`.

### 5️⃣ Redis (optional)
- **Image:** `redis:7-alpine` with AOF persistence, **Port:** `6379`.

---

## 💻 Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + MUI 6 (planned) |
| **Backend** | Node.js 20 + Express (NestJS / FastAPI future) |
| **Database** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **Messaging** | Apache Kafka (Planned) |
| **Container** | Podman (dev) / Kubernetes (prod) |
| **CI/CD** | GitHub Actions + Argo CD (planned) |
| **IaC** | Terraform + Helm (planned) |
| **Monitoring** | Prometheus + Grafana (planned) |
| **Auth** | Auth0 / Cognito (planned) |

---

## 🚀 Getting Started

### Prerequisites

- **Podman** 4.0+ (`podman version` to verify)
- **Git**

### Quick Start

```bash
cd /var/home/w4windu/FlowTab/project
./run-stack.sh
```

The script launches all 5 containers and installs dependencies automatically. After completion you'll see:

```
✅✅✅  Your FlowTab development stack is now RUNNING!
   • Frontend          : http://localhost:3001
   • Queue Service     : http://localhost:3000
   • Analytics Service : http://localhost:3002
   • PostgreSQL        : postgres://localhost:5432/restaurantdb
   • Redis             : redis-cli -h localhost -p 6379
```

Verify health:

```bash
curl http://localhost:3000/health
curl http://localhost:3002/health
```

### Using podman-compose

```bash
podman-compose --no-interactive up -d
```

---

## 🔄 Development Workflow

1. **Edit source code** in `services/*/src/` or `frontend/src/` – files are mounted live.
2. **Restart a container** when needed: `podman restart queue-service`.
3. **View logs**: `podman logs -f queue-service`.
4. **Stop the stack**: `podman stop queue-service analytics-service frontend postgres redis`.
5. **Full cleanup**: `podman stop queue-service analytics-service frontend postgres redis && podman volume rm pg_data`.

---

## 📖 API Documentation

### Queue Service (`:3000`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `POST` | `/api/v1/restaurants/{id}/queue` | Add party to wait‑list |
| `GET` | `/api/v1/restaurants/{id}/queue` | List waiting parties |
| `PATCH` | `/queue_items/{id}` | Update party priority |
| `DELETE` | `/queue_items/{id}` | Cancel party |

### Analytics Service (`:3002`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `GET` | `/analytics/metrics` | Current KPIs |
| `GET` | `/analytics/export` | Export report |

Detailed OpenAPI specs will be added in `docs/`.

---

## 🧪 Testing

```bash
cd services/queue-service && npm test
cd services/analytics-service && npm test
cd frontend && npm test
```

Each service uses **Jest** (unit), **SuperTest** (API), and **Cypress** (e2e) when configured.

---

## 🚢 Deployment

1. **Development** – Local Podman stack (this guide).
2. **Staging** – Single‑node K3s or Docker Compose.
3. **Production** – AWS EKS with RDS Aurora + ElastiCache + MSK + HPA auto‑scaling.

Kubernetes manifests are located in `infra/k8s/`.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Commit changes: `git commit -m 'Add my feature'`.
4. Push: `git push origin feature/my-feature`.
5. Open a pull request.

---

## 📄 License

Proprietary software. All rights reserved.

---

## 🙋 Support

For questions or issues, open a GitHub issue or contact `devops@example.com`.

---

*FlowTab – Built with ❤️ for restaurants.*
