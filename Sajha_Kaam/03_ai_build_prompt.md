# Copy-paste prompt for an AI coding agent

Build a production-shaped hackathon prototype called **Sajha Kaam (साझा काम)**, “Local talent. Global work. Clear terms.” Read every file in this package first. Follow `02_product_and_architecture.md` as the specification, `diagrams/*.svg` as reference drawings, and `prototype/index.html` as a visual reference, while improving responsiveness and accessibility. Produce **working source code, static UI drawings, system/data/information flow diagrams in SVG and PNG, a README with local run instructions, and a clearly marked simulated demo**. Do not invent partner agreements or claim legal/financial integrations are live.

## Product frame

Two-sided mobile-first PWA connecting Nepali remote talent (18+) with diaspora and international SMEs for **small fixed-scope paid pilots**. The key innovation is the verified first-work pathway and portable, consent-controlled Work Passport, not a generic job board. A municipality or university may later recruit and train workers, but it does not create a legal zone. Diaspora purchases a service in MVP; no securities, investments, lending, pooled funds or escrow. A platform profile is not an international ID.

## Stack and deliverables

- Use React + TypeScript + Vite, semantic HTML, CSS variables and accessible primitives. Mobile reference 390×844, still usable 320px and desktop. No dependency on paid design assets; provide simple plain shapes and copy.
- Demo mode: local mock repository seeded with two users, three tasks and one workroom; deterministic state transitions persisted to localStorage, explicit `DEMO · simulated payment` on payment UI. Include reset demo button. Never store real IDs, bank data or passwords in localStorage.
- API-ready boundaries: typed contracts for auth, project, sample, application, engagement, delivery, payment event, case and passport. Include SQL migrations/schema for PostgreSQL and skeleton server endpoints or detailed adapter interfaces; clearly separate mock repository from future real implementation.
- Draw eight distinct mobile screens and export SVG/PNG for Entry, Home, Task, Apply, Client, Workroom, Payout, Passport/Help. Draw separate context/system, data relationship, user journey and information flow diagrams as SVG + PNG at legible resolution. Diagram labels must match implementation and distinguish simulated from external systems.
- Ship a 120-second standalone JavaScript Canvas animation project with controls and WebM recording, plus three-speaker voice script and timed storyboard. Do not synthesize a person's likeness or voice. User can record real speakers and replace placeholders.
- Include unit tests for state machine and permissions, an end-to-end happy path plus dispute path, and meaningful accessibility checks. Document exact commands and demo credentials if any.

## Visual system — mandatory

Light theme only. Off-white `#F6F4EE`, ink `#252A25`, brick `#A64C32`, sage `#6B7561`, clay `#EAE5DB`, line `#D5D1C7`, white `#FFFFFF`. Flat colors; **no gradients, neon, glowing effects, purple/cyan AI palette, glassmorphism, floating orb, cartoon robot, synthetic portraits, confetti or point explosions.** Plain typography; use a Nepali-capable local/system fallback. Comfortable line height; restrained 1px borders; 8–12px corners; clear form labels. Real task information dominates decorative elements. Motion is informative (progress/transition), subtle, under 250ms except video; honor reduced motion.

## Exact interactive flows

1. Entry has language switch Nepali/English and role choice Talent or Client. Guest can browse public tasks, then signs in only on apply/hire. For demo sign-in is a role toggle visibly labeled sample identity.
2. Talent Home has private three-step checklist: make relevant work sample, complete paid pilot, gain repeat client. No leaderboards/streaks. Show a task card with pay, fixed scope, deadline, currency and buyer verification **source**.
3. Task Detail shows deliverable, included revision count, IP/rights note, buyer identity, gross pay, all known fees and payout-process disclaimer before Apply.
4. Application requires selected proof or new sample, short text, availability and explicit consent to share. Show confirmation and client-side queue. Allow withdraw before offer.
5. Client Review shows proof and evidence source, not a magic AI trust score. Client offers a milestone; talent accepts fixed terms explicitly. Creating a milestone is not payment escrow.
6. Workroom shows deadline, terms snapshot, messages, upload, submit, revision request/acceptance, event timeline, human dispute CTA. Require both parties for material changes and retain prior terms.
7. Earnings shows gross, known fees, estimated net, external partner state. Only server-verified partner event can mark paid in a deployed version; demo synthetic fixture states must say DEMO. Do not pretend a client button settles money.
8. Passport presents source-labeled sample/completed/client-confirmed/partner-confirmed claims; revoke share link, export JSON and PDF. Hide private client artifacts by default.
9. Help lets either party open a case, attach evidence and see acknowledgment/resolution/appeal states; no promise of binding arbitration.

## Engineering constraints

Use a finite state machine defined in one shared module. Mutations check actor ownership and allowed transition. Version engagement records to prevent conflicting acceptance; idempotency keys for uploads/offer and partner event. Store money in integer minor units with currency code. Store UTC and display time zone. Use signed short-lived private file URLs in a real backend. Restrict admin by least privilege. Verify provider webhook signature and reconcile daily before a payout claim. Retain immutable audit metadata; protect deletion/export rights. Support poor connectivity: save only non-sensitive drafts locally and show retry state. No automated employment classification or tax advice. Add a moderation and appeal pathway.

## Suggested implementation order

First create design tokens and typed models. Then complete role-specific routing with seeded transactions. Add mutually consistent state and permissions. Add the eight UI views and keyboard/320px checks. Draw architecture diagrams directly from code. Add video project and 2-minute script. Finally run tests and review the demo for misleading labels, overflowing Nepali text, false paid/verified states, missing error and empty states, and disallowed gradients.

## Acceptance test script

`talent` opens task → applies using a consented sample → `client` sees application and makes $60 sample offer → `talent` accepts → submits a sample file → `client` accepts delivery → **DEMO** partner fixture changes `partner_pending` to `partner_confirmed` → `talent` sees a source-labeled passport claim and exports it → a user opens Help and creates a case. Deny access to another person's private work, duplicate claim from duplicate event, and invalid state transition. README states that no money moves in demo.

## Output quality bar

Return a ZIP with working source, diagrams, annotated screenshots, tests, video animation source, exact speaker script and setup directions. State which interactions are interactive, which integrations are simulated and which require reviewed partnerships. Deliver a concise demo narration and the file tree. If a browser/export utility is unavailable, preserve editable SVG and functional HTML; do not falsely claim an MP4 or integration exists.
