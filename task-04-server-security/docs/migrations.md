# Migrations

VetReply uses Prisma with PostgreSQL. A migration is any instruction to
Prisma that changes the database's structure or data. Every migration in
this task was run by me, by hand, from the terminal.

## Migration history

| Migration | What it did | When |
|-----------|-------------|------|
| `20261028140242_init` | The first schema: 16 tables | 28 Oct 2026 |
| `20261030141350_better_auth` | Better Auth's `session`, `account` and `verification` tables, and `User.image` | 30 Oct 2026 |
| `20261102121308_payment_attempts` | The new `PaymentAttempt` table | 2 Nov 2026 |
| `20261102122206_add_membership_number_optional` | `User.membershipNumber`, as optional | 2 Nov 2026 |
| `20261102122454_make_membership_number_required` | `User.membershipNumber`, made required | 2 Nov 2026 |

The very first migration ran on 28 October, before this task. The migration
captured in `evidence/03-initial-migration.txt` is the first one I ran for
Task 4, for the `PaymentAttempt` table.

---

## What went wrong before the first migration worked

**Wrong folder.** My first attempt failed with "Could not find Prisma
Schema", because I ran it from a folder other than the repository root. `prisma.config.ts` looks for `prisma/schema.prisma`
relative to the folder you run it from. It's the same lesson as the nested
folder in Task 2: commands that depend on where you are fail, or do the
wrong thing, when you're in the wrong place.

**Shadow database permission (P3014).** The next attempt failed with
"Prisma Migrate could not create the shadow database... permission denied
to create database". `prisma migrate dev` creates a temporary shadow
database to check the migrations before applying them, and my database user
didn't have permission to create databases on the server at port 5433.
Once the user was allowed to create databases, the migration ran
(`evidence/03-initial-migration.txt`).

---

## A required column on a table that has rows

I added `membershipNumber String` to `User`, required, with no default. The
table already had 3 rows. The migration failed
(`evidence/04-required-column-failure.txt`):

```
Added the required column `membershipNumber` to the `User` table without a
default value. There are 3 rows in this table, it is not possible to execute
this step.
```

The database can't add a column that must have a value when existing rows
have none. Prisma refused before creating a migration, so nothing was
half-applied.

I then made the same change in three steps
(`evidence/05-required-column-three-steps.txt`):

1. **Added it as optional** (`String?`). The 3 existing users got an empty
   value.
2. **Filled it** with a SQL update:
   `UPDATE "User" SET "membershipNumber" = 'LEGACY-UNKNOWN' WHERE "membershipNumber" IS NULL;`
   These users signed up before VetReply stored membership numbers, so
   they don't have a real one. `LEGACY-UNKNOWN` says exactly that, and is
   easy to find and replace later, instead of a made-up number that looks
   real.
3. **Made it required** (`String`). This time it worked, because every row
   had a value.

The same change that failed in one step succeeded in three, because each
step leaves the database valid.

---

## The drift error

I added `driftTest String?` to the `Enquiry` model, ran `npx prisma
generate`, did **not** migrate, and submitted the enquiry form. It failed
with a `500` and this error (`evidence/06-drift-error.txt`):

```
Invalid `prisma.enquiry.create()` invocation:
The column `Enquiry.driftTest` does not exist in the current database.
code: 'P2022'
```

Two things had gone out of step: **the Prisma client** and **the database**.
`prisma generate` rebuilt the client from the schema file, so the client
now expected an `Enquiry.driftTest` column and asked for it when saving an
enquiry. But generating the client never touches the database. Only a
migration does, and I hadn't run one, so the database still had no such
column.

**The fix** is to remove `driftTest` from the schema and run
`npx prisma generate` again, so the client matches the database. The other
fix would be to migrate and add the column to the database, but `driftTest`
has no purpose, so removing it keeps the schema clean.

**What this exposed:** the first time I triggered the error, the server log
only showed `POST /api/enquiries 500` with no reason, because the enquiry
route caught the error and discarded it. I added
`console.error('Failed to create enquiry:', error)` to the catch block in
`app/api/enquiries/route.ts`. The user still sees the same generic message;
only the server log now shows the real cause.

---

## Why forward-only

A migration that has run is part of the database's history. Every
environment (my laptop, another developer's machine, production) applies
the same migrations in the same order to reach the same state. To undo a
change, you write a new migration that reverses it, rather than going back
and rewriting history. Forward-only keeps every database on the same path.

## Why I never edit a migration that has already run

Prisma records each migration it has applied, with a checksum of its file.
If I edit a migration that has already run, my file no longer matches what
the database actually did. Databases that already ran the old version keep
the old version, and new databases run the new one, so they quietly end up
different. Prisma compares the checksums and flags a migration that was
changed after it was applied, which is the right behaviour. The fix for a mistake in a migration is always a new migration.

## Why I run migrations by hand instead of the agent

A migration changes the real database, and some changes can't be undone,
such as dropping a column and its data, or resetting the database when
Prisma suggests it. An agent runs commands to get a task done, so it could
accept a step like that without anyone reading it first. When I run
migrations myself, I read what Prisma is about to do and decide. It also means I
understand every change, which is what lets me explain the migration
history line by line.

## The cost of doing it by hand

It's slower. It depends on me remembering to run each migration, from the
right folder, against the right database, as the wrong-folder and
shadow-database errors in this task showed. If someone pulls new code and
forgets to migrate, their app hits the same drift error. In a team, this
would need a written process, or a deployment step that runs migrations
automatically and in a controlled way.