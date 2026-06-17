# 📦 FlowTab – Detailed Functional Modules

This document provides a comprehensive breakdown of every functional module in the FlowTab restaurant‑SaaS platform.

---

## Table of Contents

1. [Waitlist & Queue Management](#1-waitlist--queue-management-core-mvp)
2. [Seat & Table Management](#2-seat--table-management)
3. [Menu & Pricing Management](#3-menu--pricing-management)
4. [Customer Relationship Management (CRM) & Marketing](#4-customer-relationship-management-crm--marketing)
5. [Analytics & Reporting](#5-analytics--reporting)
6. [Integrations Layer](#6-integrations-layer)
7. [User Management & Permissions](#7-user-management--permissions)
8. [Self‑Service Guest Portal (Future)](#8-self‑service-guest-portal-future)
9. [Quick Reference Table](#9-quick-reference-table)

---

## 1. Waitlist & Queue Management *(Core MVP)*

### Purpose
Capture every party before seating; calculate ETA; auto‑seat next party when a table frees.

### Primary Actors
Host / Hostess, Server (optional), Guest (via future portal).

### Key UI Screens
1. **Queue Dashboard** – list of waiting parties.
2. **Add‑Party Modal** – name, contact, party size, VIP toggle.
3. **Party Detail Pop‑over** – ETA history, Seating button.

### Functional Flow
1. Host adds party → persisted as `QueueItem` (status `waiting`).
2. System calculates ETA.
3. On `table_free` event, Queue Service picks highest‑priority party, updates status to `seated`.
4. Host UI shows banner "Party ready – Seat Now".

### ETA Formula
`eta_minutes = (available_table_capacity / avg_service_rate) * (party_size / avg_table_size)`

Parameters configured per‑restaurant in Admin/Settings.

### Priority System
- Default: `created_at` (FIFO).
- Manual bump possible (priority = -1, -2, …).
- Re‑allocation sorts by **priority ASC** → **created_at ASC**.

### Status Transitions
`waiting` → `seated` → `completed`<br>
`waiting` → `cancelled` / `no_show`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/restaurants/{id}/queue` | Create queue entry |
| PATCH | `/queue_items/{id}` | Update priority, notes |
| GET | `/api/v1/restaurants/{id}/queue` | List parties (filter) |
| DELETE | `/queue_items/{id}` | Cancel party |
| GET | `/queue/status/{id}` | Party details |

### Data Model
Table `queue_items`: `id` UUID PK, `restaurant_id` FK, `party_name`, `party_size`, `contact_phone`, `contact_email`, `notes`, `priority` (int), `status` (enum), `eta_minutes`, `created_at`, `updated_at`, `seater_id` FK, `resolved_at`.

### Acceptance Tests
| TC ID | Scenario | Expected |
|-------|----------|----------|
| Q‑001 | Add party with ETA | Item appears with non‑null ETA |
| Q‑002 | Auto re‑allocation | Highest‑priority party seated on `table_free` |
| Q‑003 | Priority bump | Party moves to top |
| Q‑004 | Cancel party | Item removed, count updated |
| Q‑005 | Persist after restart | All items retain order/status |

### Dependencies
- POS `table_free` webhook.
- Auth0 for auth.

---

## 2. Seat & Table Management

### Purpose
Visualize and control physical table states; support drag‑and‑drop seating.

### Primary Actors
Host, Manager.

### Key UI Screens
1. **Floor‑Plan Canvas** – color‑coded tables.
2. **Table Detail Panel** – current allocation.
3. **Re‑Allocation Dialog** – select suitable table.

### Key Operations
- **Add/Modify Table** – capacity, zone.
- **Seating** – selects free table; updates `table_occupancy`, triggers KDS.
- **Manual Override** – force‑seat VIPs.

### Data Model
Table `tables`: `id` PK, `restaurant_id` FK, `table_number`, `capacity`, `zone` (Patio/Main/Bar), `status` (available/occupied/reserved/blocked).<br>
Table `table_allocations`: `allocation_id` PK, `party_id`, `table_id`, `start_time`, `end_time`.

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tables` | List tables |
| PATCH | `/tables/{id}` | Edit capacity/zone |
| POST | `/tables/{id}/allocate` | Assign party |
| DELETE | `/tables/{id}/allocate/{party_id}` | Cancel allocation |

### Acceptance Tests
| TC ID | Scenario | Expected |
|-------|----------|----------|
| S‑001 | Add table | Appears on floor‑plan |
| S‑002 | Seat party | Table → occupied, allocation row created |
| S‑003 | Free table | `table_free` triggers queue re‑allocation |
| S‑004 | Table too small | Validation error |

---

## 3. Menu & Pricing Management

### Purpose
Build, edit, price menus; support modifiers, promotions, allergens.

### Primary Actors
Owner, Manager, Marketing.

### Key UI Screens
1. **Menu Builder** – drag‑and‑drop sections.
2. **Item Detail Form** – name, price, modifiers.
3. **Promotion Scheduler** – date‑range discounts.

### Data Structures
- **MenuItem**: id, name, base_price, cost, allergens.
- **ModifierGroup**: linked item with ordered modifiers.
- **PriceRule**: item_id, start/end, discount type/value.

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/menus` | List sections & items |
| POST | `/menus` | Create menu |
| PATCH | `/menus/{id}/items/{item_id}` | Edit item |
| POST | `/menus/{id}/prices/rules` | Create discount |
| GET | `/menus/{id}/average_check` | Current avg check |

### Integration Points
- **Analytics** consumes `average_check`.
- **CRM** tags guests by ordered modifiers.

### Acceptance Tests
| TC ID | Scenario | Expected |
|-------|----------|----------|
| M‑001 | New menu | Sections visible |
| M‑002 | Update price | Reflects immediately |
| M‑005 | Happy‑hour discount | `average_check` adjusts |

---

## 4. Customer Relationship Management (CRM) & Marketing

### Purpose
Store guest profiles, track ordering history, enable loyalty programs, run campaigns.

### Primary Actors
Manager, Marketing, Host (limited view).

### Key UI Screens
1. **Guest Dashboard** – list of known guests, last visit, loyalty tier.
2. **Guest Detail View** – order history, notes, restrictions.
3. **Campaign Builder** – select audience, message, schedule.

### Core Data Entities
- `guest_profile`: id, name, phone, email, loyalty_points, total_spent, created_at.
- `guest_visits`: visit_id, guest_id, timestamp, total_amount, items_ordered.
- `loyalty_tier`: tier_name, points_required, benefits.

### Key Functionalities
- **Profile Creation** – auto‑created when party provides phone/email.
- **Loyalty Engine** – points per dollar; tier upgrades trigger welcome email.
- **Segmentation** – tag guests (VIP, Allergy‑Sensitive).
- **Campaign Execution** – via Twilio (SMS) or SendGrid (email).

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/guests` | List guests (filter by tier, last_visit) |
| POST | `/api/v1/guests` | Add new guest |
| GET | `/api/v1/guests/{id}` | Full profile |
| PATCH | `/api/v1/guests/{id}` | Update notes/loyalty |
| POST | `/api/v1/campaigns` | Launch campaign |

### Security & Privacy
- All PII encrypted at rest.
- Roles scoped to `guest:read`.
- GDPR "right to be forgotten" via soft‑delete + anonymization.

### Acceptance Tests
| TC ID | Scenario | Expected |
|-------|----------|----------|
| CR‑001 | Add guest from queue | Profile created with correct contact info |
| CR‑002 | Award loyalty points | Points field updated |
| CR‑004 | Launch campaign | Row created, status → sent after worker |

---

## 5. Analytics & Reporting

### Purpose
Turn raw data (queue length, seating times, revenue) into actionable dashboards and scheduled reports.

### Primary Actors
Manager, Owner, Data Analyst.

### Key UI Dashboards
1. **Operations Dashboard** – queue length, avg wait, turnover.
2. **Financial Dashboard** – revenue/table, labor cost %, margin.
3. **Performance Trends** – daily/weekly wait‑time trends.
4. **Export** – CSV/PDF of custom date ranges.

### Key Metrics
- Avg Wait Time = avg(eta_minutes) over last N minutes.
- Abandonment Rate = (cancelled + no_show) / total entries.
- Table Turnover = parties seated / total tables.
- Revenue/Table = sum(order_amount) / occupied tables.

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/metrics` | Aggregated KPIs |
| GET | `/analytics/export` | CSV download |
| GET | `/analytics/dashboard-data` | UI widget data |

### Acceptance Tests
| TC ID | Scenario | Expected |
|-------|----------|----------|
| A‑001 | Query KPIs for 24h | Correct average_wait_minutes |
| A‑002 | Export CSV | Expected row count |
| A‑005 | Party seated event | turnover_rate updates within 2s |

---

## 6. Integrations Layer

### Purpose
Connect to POS systems, delivery platforms, accounting software, notification providers.

### Core Integration Types
1. **POS Integration** – consume `table_free` webhooks.
2. **Delivery Sync** – send "ready for delivery" flags.
3. **Accounting Export** – daily sales to QuickBooks/Xero.
4. **Notification Provider** – Twilio (SMS) + SendGrid (email).

### Design
- **Event‑Driven**: All feeds normalized into Kafka events.
- **Adapter Pattern**: Each partner has a dedicated adapter service.

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/integrations/{partner}` | Current config |
| POST | `/api/v1/integrations/{partner}/test` | Test connectivity |

### Security
- API keys in AWS Secrets Manager.
- Keys rotated quarterly.

### Acceptance Tests
| TC ID | Scenario | Expected |
|-------|----------|----------|
| I‑001 | Simulate POS `table_free` | Kafka event emitted |
| I‑002 | Accounting export | Journal entry in sandbox QuickBooks |

---

## 7. User Management & Permissions

### Purpose
Control access with role‑based permissions for Host, Manager, Owner.

### Roles & Scopes
| Role | Scopes |
|------|--------|
| **HOST** | `queue:create`, `queue:update`, `queue:delete` |
| **MANAGER** | All host + `analytics:read`, `tables:allocate`, `menu:edit` |
| **OWNER/ADMIN** | Full `*:*` across all restaurants |

### Authentication
Auth0 (OAuth2 / OIDC) – JWT with scope claims.

### Authorization Flow
1. Frontend obtains JWT via Auth0.
2. API gateway validates token and scope.
3. Route guards enforce permissions; 403 if insufficient.

### Audit Logging
Every privileged action (role_change, menu_update) writes immutable record: `audit_logs` (timestamp, actor, action, resource).

### Acceptance Tests
| TC ID | Scenario | Expected |
|-------|----------|----------|
| U‑001 | Host cannot delete another host's party | 403 Forbidden |
| U‑002 | Manager views analytics | Success |
| U‑003 | Owner adds restaurant & assigns admin | Success |

---

## 8. Self‑Service Guest Portal *(Future Phase)*

### Purpose
Let diners join virtual waitlist from their phone, receive ETA, provide feedback.

### Key Screens
1. **Join Waitlist** – enter phone/email or scan QR code.
2. **My Party** – list of parties, current ETA, Cancel button.
3. **Feedback Form** – post‑dining NPS survey.

### Core Flow
Guest clicks Join Waitlist → provides phone/email → SMS with ETA updates → "Your table is ready" → post‑dining survey.

### Backend Add‑Ons
- **GuestQueueService** extends Queue Service.
- **Notification Worker** sends SMS/Email.
- **Survey Service** writes to `feedback` table.

### Acceptance Tests (Future)
| TC ID | Scenario | Expected |
|-------|----------|----------|
| G‑001 | Guest receives SMS with ETA | SMS sent 5 min after party_added |
| G‑002 | Feedback submission | feedback table updated |

---

## 9. Quick Reference Table

| Module | Core UI | API Prefix | Key Integration | Primary Store | Main Users |
|--------|---------|------------|----------------|---------------|------------|
| **Waitlist & Queue** | Queue Dashboard | `/queue/*` | POS → Kafka | queue_items (PG) | Host, Manager |
| **Seat & Table** | Floor‑Plan | `/tables/*` | Queue ↔ KDS | tables, allocations | Host, Manager |
| **Menu & Pricing** | Menu Builder | `/menus/*` | Accounting | menu_items, price_rules | Owner, Manager |
| **CRM & Marketing** | Guest Dashboard | `/guests/*` | Loyalty, Email | guest_profile | Manager |
| **Analytics** | Ops Dashboard | `/analytics/*` | Kafka consumers | Aggregates + Redis | Manager, Owner |
| **Integrations** | Config UI | `/integrations/*` | POS, Delivery | No new DB | Ops |
| **User Management** | Admin Console | `/users/*` | Auth0 | users, roles | Admin |
| **Guest Portal** (f) | Join Waitlist | `/guest/*` | Twilio, Survey | guest_profiles | Guest |

---

## 10. Glossary

| Term | Definition |
|------|------------|
| **ETA** | Estimated Time of Arrival (minutes) until party is seated |
| **FOH** | Front‑of‑House (hosts, servers) |
| **BOH** | Back‑of‑House (kitchen, operations) |
| **K** | Kafka topic (e.g. `restaurant.queue.events`) |
| **KDS** | Kitchen Display System |
| **NPS** | Net Promoter Score |
| **POS** | Point‑of‑Sale system |
| **RBAC** | Role‑Based Access Control |
| **SLA** | Service‑Level Agreement (99.9% uptime) |
| **SMS** | Short Message Service (Twilio) |
| **PII** | Personally Identifiable Information |

---

*FlowTab – Detailed Module Documentation v1.0*
