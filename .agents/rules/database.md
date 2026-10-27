---
trigger: always_on
---

# database.md

Job: control which database the agent touches and how data and schema change.

## Rules

1. The development database is the local Docker PostgreSQL with pgvector. Use it only with made-up data. Run migrations, seeds and tests only against it. Never connect to, migrate or change production.
   Reason: production holds data the agent must never alter, and Neon is configured by the human.

2. Never add, rename or remove a table, column, enum value, index or constraint that PRD section 9 does not list. Better Auth tables come only from its schema generator (PRD 9.2). If a change seems needed, stop and ask.
   Reason: the schema is part of the reviewed design. An unreviewed column is an unreviewed feature.

3. Change the schema only through Prisma migration files. Never use `prisma db push`. Never edit a migration that has already been applied.
   Reason: migrations are the only record of how the database got to its shape. Push and edits make that record false.

4. Keep the hand-written migration parts in PRD 9.3 to 9.5: the vector extension, the HNSW index, the partial unique index on bookings, and the check constraints. After every migration, confirm each still exists.
   Reason: Prisma cannot express these. A generated migration can drop them without warning, and the booking index is the only guard against double booking.

5. Raw SQL lives only in server/data/, only for chunk inserts and retrieval, and only with bound parameters. Never build SQL by joining strings.
   Reason: the embedding column needs raw SQL, and string-built SQL is open to injection (SEC-010).

6. Run every multi-step change in one transaction. This includes any change that also checks a status first.
   Reason: a half-finished change leaves records that contradict each other (PRD 8.9).

7. Every action that sends email, charges or refunds checks the record's current status inside its transaction and does nothing if the action already happened.
   Reason: double clicks and retried requests must never send, charge or refund twice (SEC-022).

8. Store times in UTC, money as integer pence and emails in lower case (PRD 9.1).
   Reason: mixed formats break ownership matching, totals and slot times.

9. Never delete a booking, enquiry or staff user. Change their status instead (PRD 9.6).
   Reason: payments, replies and audit history point at these records.