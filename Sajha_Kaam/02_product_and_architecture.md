# Product, UX and technical specification

## Audience, jobs and principles

- **Talent:** find realistic paid work, understand total pay and deadline, show evidence, get fairly reviewed and paid.
- **Client / diaspora buyer:** find someone credible for a small job, see scope and fees up front, reduce hiring and delivery risk.
- **Operator:** review first transactions, handle reports, preserve an auditable trail, release no money directly.
- **Mentor (future):** provide scoped feedback on a public or explicitly shared sample, not free labor or private chat access.

Principles: explicit compensation before application; user-controlled proof sharing; no misleading legal badge; human appeal; equal information on mobile; plain Nepali and English; every transaction state has a next action. 18+ pilot; no applicant fee.

## Information architecture

**Talent navigation:** Home / Explore / My work / Passport / Account. Global Help is always visible. **Client navigation:** Dashboard / Projects / Talent / Messages / Account. A client can review only applicants to its project or consenting discoverable profiles. Admin is a separate protected web view. Public landing is informational.

### Screen-by-screen UI and UX

| Screen | Layout and content | Primary action | States and accessibility |
|---|---|---|---|
| 01 Entry | Wordmark, Nepali/English switch, two large role cards, explanation of paid pilots, no location permission | Find work / Hire talent | Guest browse available; sign in when applying; 44px targets; focus order |
| 02 Talent Home | Greeting, small “3 steps to first paid work” panel, 2–3 matched task cards with gross amount, scope, duration, client verification *source* | View task | Empty state invites sample; low-data text view; no streak or leaderboard |
| 03 Task Detail | Pay, fixed scope, required skills, deliverables, date, one revision, ownership and client identity cue; visible total fees and settlement caveat | Apply with proof | Loading; closed; withdrawn; report; clear time zone and currency |
| 04 Application | Select existing sample or upload, 280-character pitch, availability, price confirmation, consent share link | Send application | Save draft offline; no auto-submit; upload progress; errors with recovery |
| 05 Client Review | Applicant cards show relevant sample and source label, not opaque score; shortlist/decline; accessibility alternatives | Offer paid pilot | Decline with reason category; private documents hidden |
| 06 Workroom | Milestone terms, deadline, message thread, upload and revision counter, event timeline; buttons for submit, accept, request revision | Submit deliverable / Accept | Both parties see same state; immutable timestamps, dispute CTA and human channel |
| 07 Earnings | Gross, disclosed platform fee, provider fee estimate where known, net estimate, partner status + reference, receipt download | View payout status | `Awaiting partner`, `Processing`, `Confirmed`, `Failed`; no fake “paid” state |
| 08 Passport | Skills, evidence-backed examples, client-confirmed outcome labels; private/public toggle, revocable share link, JSON/PDF export | Share proof | Redact client confidential content; verification source/date shown; appeal incorrect event |
| 09 Help | Conflict types, support ticket, what happens next, evidence checklist and expected reply time | Start a case | Review SLA published by operator; status and appeal history visible |

Reference drawings: `diagrams/ux_01` through `ux_08`. Prototype condenses the flows into one file but implements the visible states.

**Localization:** Nepali and English content files with short strings, support Devanagari font fallback. Show original currency and a clearly labeled approximate NPR conversion only if a timestamped FX source exists. Dates include `Asia/Kathmandu` or project time zone. Readable on 320px widths; no meaning conveyed by color alone; reduced-motion setting respected; screen-reader labels on icon actions.

## Transaction state machine

`draft → published → applied → offered → accepted → in_progress → submitted → revision_requested → submitted → accepted_by_client → partner_pending → partner_confirmed`.

`offered → declined/expired`; `published → closed`; any active engagement may become `disputed` with an operator-assigned resolution and a return to valid status or cancellation. “Accepted by client” means work accepted, not money received. Partner confirmation requires signed or independently reconciled provider event, with reconciliation exceptions surfaced. Every transition stores actor, UTC time, previous/next state, idempotency key, human note and authorization check.

## System architecture and responsibilities

See `system_architecture.png/svg`.

1. **Mobile web PWA:** TypeScript React or equivalent, service worker caches shell only; sensitive screens require online authorization, drafts encrypted or not cached. Desktop client and admin views can share design tokens.
2. **API/BFF:** authenticated REST, request validation, rate limits, role checks, idempotency for create/transition, audit logs, signed short-lived upload URLs. No secrets in client.
3. **PostgreSQL:** relational source of truth, migrations, row-level authorization enforced in service (and optional database RLS), encrypted sensitive columns as appropriate, backups.
4. **Object storage:** sample and deliverable files with private buckets, MIME/size checks, malware scan, signed access, expiry and retention policy.
5. **Queue/worker:** notifications, safe sample scanning, export jobs, partner reconciliation and event retries. Outbox pattern connects DB commits to worker events.
6. **Identity:** email/phone OTP via auth provider; optional document check by approved provider. Work Passport is an application credential with signed evidence, never an official ID.
7. **Payment partner adapter:** records external invoice and settlement references from a licensed provider; webhook signature validation and daily reconciliation. In hackathon mode, deterministic fixture events are clearly labeled `DEMO`. Do not capture card/bank secrets or hold funds.
8. **Operator console:** assigned case management, document review with restricted permissions, correction and appeal workflow, data export/deletion requests, audit trail.

### Suggested APIs

`POST /v1/auth/otp`, `GET /v1/me`, `PATCH /v1/profile`, `POST /v1/samples`, `GET /v1/projects?skill=&remote=1`, `POST /v1/projects`, `POST /v1/projects/:id/applications`, `POST /v1/applications/:id/offer`, `POST /v1/engagements/:id/accept`, `POST /v1/engagements/:id/deliveries`, `POST /v1/engagements/:id/transitions`, `GET /v1/engagements/:id/timeline`, `POST /v1/cases`, `GET /v1/passport`, `POST /v1/passport/shares`, `DELETE /v1/passport/shares/:id`, `POST /v1/partner/webhook` (server-to-server only). All mutable endpoints specify role, schema and idempotency handling. Use cursor pagination. Do not return national-ID image URLs to public endpoints.

## Data architecture

See `data_architecture.png/svg`. Core tables with `uuid` PK, `created_at`, `updated_at` and explicit foreign keys:

| Entity | Important columns | Access/retention |
|---|---|---|
| `users` | role, locale, contact_verified_at, age_attested_at, status | Self; operator limited; delete per policy/legal hold |
| `profiles` | user_id, display_name, district optional, headline, skills, availability | Public only with consent; no citizenship number exposed |
| `identity_checks` | user_id, provider_ref, result, checked_at, expiry | Operator restricted; store token/ref, not raw images when possible |
| `clients` | owner_user_id, organization, verification_source, status | Public source label; private evidence restricted |
| `projects` | client_id, title, category, fixed_price_minor, currency, scope, deadline, rights_terms, revision_limit, status | Browse published; full buyer terms to applicants |
| `samples` | user_id, title, skill_tags, object_key, disclosure, reviewed_at | User-owned; private until shared |
| `applications` | project_id, talent_user_id, sample_id, pitch, state | Both sides of project and assigned staff |
| `engagements` | project_id, application_id, terms_snapshot, price_minor, currency, state, version | Parties and assigned staff only |
| `milestones` | engagement_id, deliverable, due_at, amount_minor, state | Terms frozen on acceptance; changes need both parties |
| `deliveries` | milestone_id, object_key, submitted_at, revision_number | Parties; private storage |
| `payment_events` | engagement_id, partner_ref, event_type, amount_minor, currency, confirmed_at, source | No client write to confirmed state; auditable |
| `cases` | engagement_id, creator_id, category, status, assigned_operator_id, resolution | Parties see redacted case status; staff details protected |
| `passport_claims` | user_id, engagement_id, type, source, client_ack_at, payout_ref, visibility | Only authenticated events; redact restricted work |
| `share_links` | claim_set, token_hash, scope, expires_at, revoked_at | Bearer link, short expiry, revocable |
| `audit_events` | actor_id, object_type/id, action, timestamp, old/new hashes | Append-only, staff only, retention defined |

Store money as integer minor units with ISO currency, never floating point. Hash share tokens; use UTC in DB and localize display. PII collected only if needed; document retention and deletion windows decided with counsel. No public leaderboard. Data portability in CSV/JSON, optionally PDF. Signed claims include issuer `Sajha Kaam` and evidence references; “verified by platform” has a precise definition.

## Information and money flows

See `information_flow.png/svg` and `user_journey.png/svg`.

**Application:** user chooses a sample → API checks ownership and published project → DB transaction creates application and outbox notification → worker sends alert → client reviews source-labeled sample. A client receives only consented fields. No AI auto-rejection.

**Agreement/delivery:** buyer makes an offer with frozen terms → worker explicitly accepts → storage issues limited upload URL → scan result attaches delivery → buyer accepts or asks for the pre-agreed revision → event stream updates both UIs. Repeated action with same idempotency key returns the same result.

**Settlement:** buyer pays via authorized provider under a documented arrangement; provider sends signed event to adapter → verify signature and unique reference → write `partner_pending` or `partner_confirmed` → reconcile against provider statement → only then expose “confirmed” and generate payout claim. Actual flow varies by partner; prototype uses synthetic fixtures.

**Dispute:** either party opens case with chosen evidence → operator acknowledges, can pause finalization where provider permits, requests both narratives, records decision and appeal path. Never advertise unilateral in-app arbitration as legally binding.

## Matching and safeguards

Phase 1 matching is explainable: required skill overlap, time availability, relevant sample, language and deadline. Sort by match with manual override; do not score gender, caste, district, school brand or social connections. No AI decisions about identity, quality or fraud without staff review and an appeal. Measure completed work and earnings, not hours online. For safety, optional no-contact-until-offer, report/block, moderation, confidential sample watermark, abuse escalation and no late-night messaging expectations.

## Build sequence and acceptance

**Hackathon (24–48 h):** seeded data, role toggle, task list/detail, sample application, offer/workroom, synthetic payout events, passport export, human-help request, accessibility pass, architecture diagram and recorded demo. **Pilot:** real auth, admin review, partner and counsel agreements, signed webhooks, retention and monitoring. **Scale:** repeat buyer tools, university training integration, multi-currency and regulated referrals.

Acceptance: a new user finds task and applies within 4 minutes in a usability test; buyer can explain gross price and worker can explain likely net; no “paid” appears before confirmed event; one user cannot access another user's private work via API; repeated webhook cannot double-create claim; passport share can be revoked; keyboard-only path works; `prefers-reduced-motion` disables nonessential motion; all prototype fees and transaction states are plainly labeled sample data.
