# 📋 FlowTab – Work Breakdown Structure (WBS)

**Version:** 1.0 | **Estimated Duration:** ~41 weeks (MVP → GA)

---

## 🔷 Phase Overview

| WBS | Phase | Duration | Key Deliverables |
|-----|-------|----------|------------------|
| 1.0 | Discovery & Planning | 3 wks | PRD, Architecture, Backlog |
| 2.0 | MVP Core Development | 12 wks | Waitlist, Tables, Menu, Basic CRM, UI |
| 3.0 | Integrations & Extensions | 8 wks | POS, Delivery, Accounting, RBAC |
| 4.0 | Advanced Analytics | 6 wks | Dashboards, Forecasting, Reports |
| 5.0 | Security & Compliance | 4 wks | SOC‑2, Pen Testing, Encryption |
| 6.0 | Pilot Launch | 4 wks | Beta with 2–3 partners |
| 7.0 | GA Release | 4 wks | Full launch, pricing, onboarding |
| 8.0 | Post‑Launch Operations | Ongoing | Monitoring, Support, Iteration |

---

## 🔸 1.0 Discovery & Planning (3 Weeks)

### 1.1 Market Research (Week 1)
- **1.1.1** – Interview 5–10 restaurant owners/managers (PM, 3d)
- **1.1.2** – Competitive analysis (PM, 2d) → Competitive matrix
- **1.1.3** – Define user personas (PM+UX, 2d) → Persona cards

### 1.2 Product Requirements (Week 2)
- **1.2.1** – Draft PRD (PM, 3d) → PRD v1.0
- **1.2.2** – Define MVP vs future scope (PM+CTO, 2d) → Scope matrix
- **1.2.3** – User story mapping workshop (PM+UX+Eng, 2d) → Story map

### 1.3 Architecture Design (Weeks 2–3)
- **1.3.1** – High‑level system diagram (CTO, 2d)
- **1.3.2** – Micro‑service decomposition (CTO, 2d)
- **1.3.3** – Final tech stack selection (CTO, 1d)
- **1.3.4** – Database schema design (CTO+BE, 3d) → ERD
- **1.3.5** – API contract design, OpenAPI (BE, 3d)
- **1.3.6** – Security & compliance checklist (CTO, 2d)

### 1.4 Infrastructure & Tooling (Week 3)
- **1.4.1** – Git monorepo setup (DevOps, 1d)
- **1.4.2** – CI/CD pipeline, GitHub Actions (DevOps, 2d)
- **1.4.3** – Dev containers (Podman) (DevOps, 1d)
- **1.4.4** – ESLint, Prettier config (DevOps, 1d)
- **1.4.5** – Cloud sandbox (AWS EKS+RDS) (DevOps, 2d)

### 1.5 Sprint Planning (End Week 3)
- **1.5.1** – Split epics into stories (PM, 2d) → Backlog
- **1.5.2** – Prioritise & estimate (PM+Eng, 1d) → Sprint 1 backlog
- **1.5.3** – Project management board (PM, 1d)

---

## 🔸 2.0 MVP Core Development (12 Weeks – 6 Sprints)

### 2.1 Sprints 1–2: Waitlist CRUD + Queue Engine (Weeks 4–5)
- **2.1.1** – `queue_items` table + migration (BE, 2d)
- **2.1.2** – POST /queue endpoint (BE, 2d)
- **2.1.3** – GET /queue (list/filter) (BE, 2d)
- **2.1.4** – PATCH /queue/{id} (priority/notes) (BE, 2d)
- **2.1.5** – DELETE /queue/{id} (cancel) (BE, 1d)
- **2.1.6** – ETA calculation engine (BE, 4d) → Algorithm + tests
- **2.1.7** – Unit tests (BE, 2d) → ≥ 80% coverage
- **2.1.8** – API integration tests (BE, 2d) → 10+ tests

### 2.2 Sprints 2–3: Host UI – Queue Dashboard (Weeks 5–7)
- **2.2.1** – React + TypeScript + MUI scaffold (FE, 2d)
- **2.2.2** – Queue Dashboard list component (FE, 3d)
- **2.2.3** – Add Party Modal component (FE, 2d)
- **2.2.4** – Wire API calls (React Query) (FE, 3d)
- **2.2.5** – WebSocket real‑time updates (FE+BE, 3d)
- **2.2.6** – Drag‑and‑drop priority re‑order (FE, 3d)
- **2.2.7** – Responsive tablet layout (FE, 2d)
- **2.2.8** – ETA countdown display (FE, 2d)
- **2.2.9** – e2e tests, Cypress (QA, 3d) → 5 tests

### 2.3 Sprints 3–4: Table Management + Floor‑Plan (Weeks 7–9)
- **2.3.1** – `tables` & `allocations` tables (BE, 2d)
- **2.3.2** – GET /tables endpoint (BE, 2d)
- **2.3.3** – POST /allocate (seat party) (BE, 3d)
- **2.3.4** – Auto re‑allocation on `table_free` (BE, 4d)
- **2.3.5** – Floor‑Plan Canvas component (FE, 4d)
- **2.3.6** – Table status color‑coding (FE, 2d)
- **2.3.7** – Allocation dialog (FE, 3d)
- **2.3.8** – VIP seating override (FE+BE, 2d)
- **2.3.9** – Integration tests (QA, 2d) → 5 tests

### 2.4 Sprints 4–5: Menu Builder + Basic CRM (Weeks 9–11)
- **2.4.1** – Menu tables (sections, items, modifiers) (BE, 3d)
- **2.4.2** – Menu CRUD API (BE, 4d)
- **2.4.3** – Price rule engine (BE, 3d)
- **2.4.4** – Menu Builder UI (FE, 5d)
- **2.4.5** – Item editor form (FE, 3d)
- **2.4.6** – Promotion scheduler UI (FE, 3d)
- **2.4.7** – `guest_profile` & `visits` tables (BE, 2d)
- **2.4.8** – Guest CRUD API (BE, 2d)
- **2.4.9** – Auto‑create guest from queue (BE, 2d)
- **2.4.10** – Guest list UI (FE, 2d)

### 2.5 Sprints 5–6: Notifications (Weeks 11–13)
- **2.5.1** – Notification Service abstraction (BE, 3d)
- **2.5.2** – Twilio SMS integration (BE, 2d)
- **2.5.3** – SendGrid email integration (BE, 2d)
- **2.5.4** – Party‑seated notification trigger (BE, 2d)
- **2.5.5** – ETA update notification (BE, 2d)
- **2.5.6** – Notification preference UI (FE, 2d)

### 2.6 Sprint 6: RBAC (Weeks 12–14)
- **2.6.1** – Auth0 tenant setup (DevOps, 2d)
- **2.6.2** – JWT validation middleware (BE, 2d)
- **2.6.3** – Role guard decorators (BE, 2d)
- **2.6.4** – Role assignment API (BE, 2d)
- **2.6.5** – Login/logout UI (FE, 3d)
- **2.6.6** – Admin user management UI (FE, 3d)

### 2.7 Cross‑Cutting (Throughout)
- **2.7.1** – Unit tests (All Eng, ongoing)
- **2.7.2** – e2e tests (QA, 10d)
- **2.7.3** – Code reviews for every PR (All Eng, ongoing)
- **2.7.4** – Documentation updates (PM+Eng, ongoing)

---

## 🔸 3.0 Integrations & Extensions (8 Weeks – 4 Sprints)

### 3.1 POS Integration (Weeks 15–16)
- **3.1.1** – POS adapter micro‑service (BE, 4d)
- **3.1.2** – `table_free` webhook consumer (BE, 3d)
- **3.1.3** – Order‑complete → queue status sync (BE, 3d)
- **3.1.4** – POS integration tests (QA, 2d)
- **3.1.5** – POS config UI (FE, 2d)

### 3.2 Delivery Partner Integration (Weeks 16–17)
- **3.2.1** – Delivery adapter micro‑service (BE, 4d)
- **3.2.2** – DoorDash API integration (BE, 3d)
- **3.2.3** – UberEats API integration (BE, 3d)
- **3.2.4** – Party‑seated → delivery ready signal (BE, 2d)
- **3.2.5** – Delivery partner config UI (FE, 2d)

### 3.3 Accounting Export (Weeks 17–18)
- **3.3.1** – Accounting adapter micro‑service (BE, 3d)
- **3.3.2** – QuickBooks Online integration (BE, 3d)
- **3.3.3** – Xero integration (BE, 3d)
- **3.3.4** – Daily sales aggregation cron job (BE, 2d)
- **3.3.5** – Accounting config & sync UI (FE, 2d)

### 3.4 Guest Portal – Read‑Only (Weeks 18–19)
- **3.4.1** – GuestQueueService extension (BE, 3d)
- **3.4.2** – "Join Waitlist" web page (FE, 4d)
- **3.4.3** – QR code generation API (BE, 1d)
- **3.4.4** – ETA display for guest (FE, 2d)
- **3.4.5** – Guest cancellation flow (FE+BE, 2d)

---

## 🔸 4.0 Advanced Analytics (6 Weeks – 3 Sprints)

### 4.1 Analytics Pipeline (Weeks 23–24)
- **4.1.1** – Analytics Service (Node/Python) (DataEng, 4d)
- **4.1.2** – Kafka consumer for queue events (DataEng, 3d)
- **4.1.3** – Aggregate metrics in Redis cache (DataEng, 3d)
- **4.1.4** – Database views for reporting (DataEng, 2d)
- **4.1.5** – Unit tests (DataEng, 2d)

### 4.2 Operations Dashboard (Weeks 24–25)
- **4.2.1** – Grafana datasource setup (DevOps, 1d)
- **4.2.2** – Queue metrics panels (avg wait, turnover) (FE, 4d)
- **4.2.3** – Abandonment rate panel (FE, 2d)
- **4.2.4** – Real‑time queue length gauge (FE, 2d)
- **4.2.5** – Dashboard layout & responsive design (FE, 3d)

### 4.3 Financial Dashboard (Weeks 25–26)
- **4.3.1** – Revenue per table panel (FE, 2d)
- **4.3.2** – Labor cost panel (FE, 2d)
- **4.3.3** – Menu performance chart (FE, 2d)
- **4.3.4** – CSV/PDF export (BE, 3d)
- **4.3.5** – Scheduled weekly email report (BE, 2d)
- **4.3.6** – Predictive forecasting (linear regression) (DataEng, 5d)

### 4.4 Multi‑Location Views (Weeks 26–28)
- **4.4.1** – Cross‑location aggregation API (BE, 3d)
- **4.4.2** – Owner dashboard (all locations) (FE, 4d)
- **4.4.3** – Location selector component (FE, 2d)
- **4.4.4** – Comparison charts (FE, 3d)

---

## 🔸 5.0 Security & Compliance (4 Weeks)

### 5.1 SOC‑2 Readiness (Weeks 29–30)
- **5.1.1** – Data classification & inventory (Security, 3d)
- **5.1.2** – Access control review (Security, 2d)
- **5.1.3** – Encryption at rest (KMS + RDS) (DevOps, 3d)
- **5.1.4** – TLS certificate management (DevOps, 2d)
- **5.1.5** – Audit logging implementation (BE, 3d)
- **5.1.6** – SOC‑2 control mapping (Security, 5d)

### 5.2 Penetration Testing (Weeks 30–31)
- **5.2.1** – External pen test (Security, 5d) → Report
- **5.2.2** – Vulnerability remediation (BE+DevOps, 5d)
- **5.2.3** – Dependency vulnerability scan (DevOps, 2d)
- **5.2.4** – Secrets management (AWS Secrets Manager) (DevOps, 2d)
- **5.2.5** – DDoS protection (AWS WAF) (DevOps, 2d)

### 5.3 Compliance & Privacy (Weeks 31–32)
- **5.3.1** – GDPR data retention policy (Legal+PM, 3d)
- **5.3.2** – CCPA compliance checks (Legal+PM, 3d)
- **5.3.3** – Privacy policy drafting (Legal, 3d)
- **5.3.4** – Cookie consent implementation (FE, 2d)
- **5.3.5** – Data deletion API (right to be forgotten) (BE, 3d)

---

## 🔸 6.0 Pilot Launch (4 Weeks)

### 6.1 Pilot Selection & Onboarding (Weeks 33–34)
- **6.1.1** – Recruit 2–3 pilot restaurants (CS, 10d)
- **6.1.2** – Onboarding documentation (CS+PM, 5d)
- **6.1.3** – Training sessions (CS, 3d)
- **6.1.4** – POS integration setup per location (IntEng, 5d)
- **6.1.5** – Data migration (existing guests/menus) (BE, 3d)

### 6.2 Monitoring & Feedback (Weeks 34–35)
- **6.2.1** – Real‑time usage monitoring (DevOps, 3d)
- **6.2.2** – Weekly feedback calls (PM+CS, 5d)
- **6.2.3** – Bug tracking & triage (PM, 5d)
- **6.2.4** – Usage metrics collection (DataEng, 3d)

### 6.3 Iterate (Weeks 35–36)
- **6.3.1** – High‑priority bug fixes (BE+FE, 5d)
- **6.3.2** – UX improvements (FE, 5d)
- **6.3.3** – Performance tuning (DevOps, 3d)
- **6.3.4** – Documentation updates (PM, 2d)

---

## 🔸 7.0 GA Release (4 Weeks)

### 7.1 Hardening & Scale (Weeks 37–38)
- **7.1.1** – Load testing (500+ concurrent) (DevOps, 3d)
- **7.1.2** – Auto‑scaling policies (HPA) (DevOps, 3d)
- **7.1.3** – Disaster recovery drill (DevOps, 2d)
- **7.1.4** – DB backup & PITR (DevOps, 2d)

### 7.2 Production Readiness (Weeks 38–39)
- **7.2.1** – Production RDS cluster (DevOps, 2d)
- **7.2.2** – Production EKS namespace (DevOps, 2d)
- **7.2.3** – DNS setup (api.flowtab.com) (DevOps, 1d)
- **7.2.4** – CDN config (CloudFront) (DevOps, 2d)
- **7.2.5** – Monitoring & alerting (PagerDuty) (DevOps, 2d)

### 7.3 Launch Execution (Week 40)
- **7.3.1** – Final QA regression run (QA, 3d) → Sign‑off
- **7.3.2** – Marketing launch (PR, social, email) (Marketing, 5d)
- **7.3.3** – Pricing page & sign‑up flow (FE, 3d)
- **7.3.4** – Support knowledge base (CS+PM, 3d)
- **7.3.5** – Go‑Live! (All, 1d)

---

## 🔸 8.0 Post‑Launch Operations (Ongoing)

### 8.1 Continuous Delivery (2‑Week Sprints)
- **8.1.1** – Feature development (Eng, 10d per sprint)
- **8.1.2** – Bug fixes (Eng, 2d per sprint)
- **8.1.3** – Code reviews (All Eng, ongoing)

### 8.2 Monitoring & Support (Weekly)
- **8.2.1** – Infrastructure monitoring 24/7 (DevOps, 5h/week)
- **8.2.2** – Customer support tickets (CS, 20h/week)
- **8.2.3** – Performance reviews (DevOps+Eng, 4h/week)

### 8.3 Growth & Iteration (Monthly)
- **8.3.1** – OKR reviews (PM, 2d/month)
- **8.3.2** – Customer feedback surveys (CS, 1d/month)
- **8.3.3** – Roadmap prioritisation (PM, 2d/month)
- **8.3.4** – Hiring & team growth (All Leads, ongoing)

---

## 🔷 Summary

| Phase | Weeks | Person‑Days | Milestone |
|-------|-------|-------------|-----------|
| 1.0 Discovery & Planning | 3 | ~45 | Backlog ready |
| 2.0 MVP Core Development | 12 | ~220 | Product demo |
| 3.0 Integrations & Extensions | 8 | ~120 | Integrated stack |
| 4.0 Advanced Analytics | 6 | ~85 | Dashboards live |
| 5.0 Security & Compliance | 4 | ~65 | SOC‑2 ready |
| 6.0 Pilot Launch | 4 | ~60 | Pilot feedback |
| 7.0 GA Release | 4 | ~40 | Live |
| 8.0 Post‑Launch | Ongoing | ~100/mo | Continuous improvements |

**Total to GA:** ~41 weeks (~10 months) | **Total person‑days:** ~635

---

*FlowTab – Work Breakdown Structure v1.0*