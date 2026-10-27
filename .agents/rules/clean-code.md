---
trigger: glob
globs: **/*.ts, **/*.tsx
---

# clean-code.md

Job: control how code is structured, named and layered.

## Rules

1. Respect the layer boundaries. Never put in a folder what this table forbids.

   | Folder | Never holds |
   |---|---|
   | app/ | Prisma, business rules, direct API clients |
   | components/ | Data access, secrets |
   | server/actions/ | Business rules, Prisma |
   | server/services/ | Prisma imports, HTTP handling |
   | server/data/ | Business rules |
   | server/ai/ | Database access |
   | server/email/ | Business rules |
   | server/payments/ | Database access |
   | config/ | Logic |
   | lib/validation/ | Side effects |
   | prisma/, tests/ | App code |
   | prisma/seed/, prisma/seed/documents/ | Real data, real practice documents, production credentials |
   | scripts/ | App code, seed data |

   Reason: these boundaries keep role checks and business rules in one tested layer (PRD 8.9).

2. Put every limit, label, notice text, message text and model name in config/ once, taking the value from the PRD. Import it everywhere else.
   Reason: a value copied into two files will drift, and the tester checks against the PRD value.

3. Name code with the PRD's terms: client, receptionist, vet, Practice Manager, enquiry, reply, draft, quick answer, document, chunk, access level, booking, slot, fee, payment, refund, membership.
   Reason: one word per concept lets the agent and the human search the code by the PRD's language.

4. Keep one service per area: documents, retrieval, enquiries, replies, booking, payments, membership.
   Reason: single responsibility keeps each rule in one place (PRD 8.9).

5. Services receive the AI client, email sender and payment client as dependencies, typed by narrow interfaces such as "send email".
   Reason: tests can replace them fully, and no service depends on a whole vendor client (PRD 8.9).

6. Return expected failures as result values. Throw only for unexpected errors.
   Reason: callers must handle "slot taken" or "no approved information" every time. A thrown error is easy to miss.

7. Write small, single-purpose functions. Leave no dead code and no commented-out code.
   Reason: PRD 8.9 sets this standard, and dead code misleads the next session.