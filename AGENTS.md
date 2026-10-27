# VetReply

The PRD is docs/vetreply-prd-v2.md. Its header must read "1, revision 3". If the file is missing or the header differs, stop and ask.
If this file and the PRD disagree, stop and ask. Do not pick one.

## Description

VetReply is a web app for one veterinary practice.
Staff log and answer client enquiries with an assistant that drafts replies only from the practice's approved documents, always with sources, and staff approve every reply before it is emailed.
Clients sign in to submit enquiries, see their history, book and pay for consultations, and join a monthly membership that removes the consultation fee, with payments in Stripe test mode.

## Who uses it

- Client: a pet owner aged 18 or over. Submits enquiries, sees only their own records, books, pays, cancels their own bookings before the cut-off, and manages membership.
- Receptionist: uses quick answers, logs enquiries, sends non-clinical replies, books and cancels for clients before the cut-off.
- Vet: everything a receptionist can, plus reads Clinical documents, generates and approves clinical replies, sets own availability.
- Practice Manager: documents, staff accounts, fees, membership price, settings, any vet's availability, cancelling after the cut-off, and the staff actions PRD 4.2 allows. Clinical drafts: view only.
- The full permissions matrix is PRD section 4.2. Build permission checks from it, not from this summary.

## The one thing the agent must do well

Never let text reach a user or a client email from a document whose access level is not allowed for that flow and role (PRD 7.2).
Never let clinical content reach a client without a vet's approval (PRD FR-024 to FR-027).
The rules that enforce this are in .agents/rules/retrieval-and-access-levels.md and .agents/rules/generation-and-clinical-safety.md.

## Defined scope for the MVP

Build in four slices, in order. Do not start a slice until the human states the previous slice is done (PRD 5.3).
1. Sign-in for four roles, staff accounts, settings, documents and indexing, quick answer.
2. Enquiries from all channels, drafts, approval and email, clinical drafts, vet queue, client portal.
3. Fees, availability, slots, booking, consultation payments, cancellations, refunds.
4. Membership.

Each slice is specified by its requirements in PRD section 6. The requirement decides the behaviour. Scope lines here are summaries.

## Not in scope for the MVP

- More than one practice.
- Anything emailed without staff approval.
- Partial refunds.
- More than one membership plan, and free trials.
- Different appointment lengths or types.
- Reminders.
- Real payments. Stripe runs in test mode only.
- PDF, Word or image documents.
- A practice management system.
- SMS, WhatsApp or phone integration.
- CI/CD and GitHub workflow setup.
- Changing a client's email address.

Do not build, stub or prepare any item on this list.

## Stack

The stack is locked. PRD 8.1 shows how its parts connect. Do not replace any item.
Packages named in this list may be installed. Ask before adding any other package.
- Language: TypeScript.
- Framework: Next.js.
- Styling: the CSS variables in task-01-design-system/demo/tokens.css, inside this project.
- Database: PostgreSQL with pgvector. Docker locally. Neon in production.
- Data access: Prisma.
- Sign-in: Better Auth, email and password, with email confirmation.
- AI: Gemini API, paid tier, for embeddings and generation.
- Email: Nodemailer through Gmail.
- Payments: Stripe in test mode.
- Validation: Zod.
- Tests: Vitest and Playwright, with an axe-based accessibility scanner for Playwright (PRD 8.9). The exact package is confirmed in Step 0.
- Code quality: ESLint and Prettier.
- Hosting: Vercel.
- Package manager: npm.
- Node.js: the latest LTS version that Vercel supports.

Versions: install the latest stable version of each package when the project is created. Then pin the exact versions in package.json and package-lock.json. Never upgrade a major version without asking.

## Folder map

| Folder | Holds |
|---|---|
| app/ | Pages, layouts, route handlers that call services |
| components/ | Presentational components |
| server/actions/ | Server actions that validate input and call one service |
| server/services/ | Business rules, role checks, transactions via server/data |
| server/data/ | Prisma calls, and parameterised raw SQL for chunk inserts and retrieval only |
| server/ai/ | Gemini client, prompts, output schemas |
| server/email/ | The send function and templates |
| server/payments/ | Stripe client wrappers |
| config/ | Every limit, label, notice text and model name |
| lib/validation/ | Zod schemas |
| prisma/ | Schema and migrations |
| prisma/seed/ | The development seed script and its made-up data |
| prisma/seed/documents/ | Synthetic practice documents as .md files |
| scripts/ | The setup script that creates the first Practice Manager (FR-004) |
| tests/unit, tests/integration, tests/e2e, tests/eval | Tests. Evaluation cases live in tests/eval |

## How to work in this codebase

1. Make one change at a time. One requirement ID (FR or SEC) per change. Work with no ID needs the human's go-ahead first.
2. Do not start slice 1 until the human confirms every row of Step 0 in PRD 13.2 is checked.
3. Synthetic practice documents and evaluation cases are drafts until the human approves them (PRD 7.10).
4. Follow every file in .agents/rules/. If a rule there and this file seem to conflict, stop and ask.
5. Stop and ask when the PRD does not state a behaviour, field, limit, message or data rule.
6. End every response with "Assumptions:" and list each one, or write "none".

## Where the detailed rules live

| Topic | PRD section |
|---|---|
| Roles and permissions | 4.2 |
| Requirements and acceptance criteria | 6.1 to 6.4 |
| Screens, forms, messages, empty states | 6.5 to 6.8 |
| Statuses and allowed changes | 6.9 |
| Emails | 6.10 |
| Indexing, retrieval, generation, AI flows | 7.1 to 7.4 |
| Prompt injection | 7.5 |
| Evaluation and pass marks | 7.6 |
| AI failure handling and cost limits | 7.7, 7.8 |
| Model names | 7.9 and config/ |
| Sign-in, sessions, ownership | 8.3, 8.4 |
| Email sending | 8.5 |
| Stripe, slot holds, refunds, webhooks | 8.6 |
| Environment variable names | 8.7 |
| Engineering standards, tests, definition of done | 8.9 |
| Security requirements | 8.10 |
| Database tables, constraints, schema | 9 |
| Open questions, Step 0, assumptions | 13 |

| Rules file in .agents/rules/ | Controls |
|---|---|
| security.md | Attack and data exposure in code |
| environment-and-secrets.md | Environment files, secrets, external accounts |
| database.md | Which database, schema changes, transactions |
| clean-code.md | Layers, naming, config/, SOLID |
| testing-and-done.md | Tests and when work is done |
| styling-and-tokens.md | Where visual values come from |
| forms-and-validation.md | Fields, validation, user-facing wording |
| accessibility.md | WCAG 2.2 AA |
| auth-and-roles.md | Sign-in, role checks, ownership |
| retrieval-and-access-levels.md | What text each flow may search |
| generation-and-clinical-safety.md | Model input, output and clinical safety |
| payments-and-booking.md | Money, membership, slots |
| email.md | Building, addressing and sending email |

## Definitions

- Role: one of client, receptionist, vet, Practice Manager. Stored on the user.
- Access level: Reception, Clinical or Manager only. Set on each document.
- Flow: one of classification, quick answer, non-clinical draft, clinical draft, pre-send check (PRD 7.4).
- Document: practice text added by the Practice Manager. Text only, pasted or from a .txt or .md file.
- Chunk: a piece of a document with its embedding. Only chunks of the document's live version are searched.
- Live version: the chunk version a document answers from. Re-indexing replaces it in one step (PRD 7.1).
- Enquiry: a question from a client, from one channel: online, email, phone or in person.
- Clinical: an enquiry or reply that needs clinical judgement. Set by classification. Only a vet replies to it.
- Classification: the model call that labels an enquiry clinical or non-clinical.
- Pre-send check: classification run on the final text of a non-clinical reply before it is emailed.
- Quick answer: an answer with sources shown only to the staff member who asked. Never sent to a client.
- Draft: model-written reply text with sources, not yet approved.
- Reply: the record for one response to an enquiry, from draft to sent. It is emailed only after staff approve it.
- Vet queue: the list of clinical enquiries waiting for a vet.
- Answered on the spot: a phone or in-person enquiry answered live, with no email.
- Ownership: a client owns a record when its client email equals their confirmed account email.
- Slot: a bookable start time from a vet's availability and the appointment length.
- Booking: a slot taken for a client. One active booking per slot. Active means Pending payment or Confirmed.
- Pending payment: a booking holding its slot while the client pays.
- Cut-off: the hours before an appointment after which a client cannot cancel online.
- Fee: a price in the fee list. One is the consultation fee.
- Payment: a consultation fee paid through Stripe Checkout.
- Refund: a full refund issued by the app through Stripe. No partial refunds.
- Membership: a monthly Stripe subscription. An active member's bookings carry no fee. Only the Stripe status active counts as a member (PRD FR-049).
- Emergency notice: fixed text on the enquiry form and booking page saying online enquiries are not monitored for emergencies.
- Step 0: the checks in PRD 13.2 the human confirms before slice 1.
