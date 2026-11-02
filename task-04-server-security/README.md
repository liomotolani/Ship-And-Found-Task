# Task 4: Server security

## What this task was
Move VetReply's security to the server: design and migrate the schema,
hash passwords properly, validate every request on the server, rate limit
the endpoints attackers target, and verify email addresses with a code
sent from a background job.

## What I built
- **A `PaymentAttempt` table** recording every attempt to pay, not just
  the one that succeeded, so failed and abandoned payments can be traced.
  See `docs/schema.md`.
- **Argon2id password hashing** (64 MB, 3 passes, 1 thread) through
  `@node-rs/argon2`, replacing Better Auth's default
  (`lib/password.ts`). See `do# Task 4: Server security

## What this task was
Move VetReply's security to the server: design and migrate the schema,
hash passwords properly, validate every request on the server, rate limit
the endpoints attackers target, and verify email addresses with a code
sent from a background job.

## What I built
- **A `PaymentAttempt` table** recording every attempt to pay, not just
  the one that succeeded, so failed and abandoned payments can be traced.
  See `docs/schema.md`.
- **Argon2id password hashing** (64 MB, 3 passes, 1 thread) through
  `@node-rs/argon2`, replacing Better Auth's default
  (`lib/password.ts`). See `docs/hashing.md`.
- **Server-side validation before anything else runs,** with the same Zod
  schemas as the forms. Emails are trimmed and lowercased; passwords are
  trimmed but never lowercased. See `docs/validation-placement.md`.
- **The direct sign-up endpoint blocked.** `POST /api/auth/sign-up/email`
  now returns `404`, so sign-up has to go through my server action
  (`app/api/auth/[...all]/route.ts`).
- **Membership number and terms acceptance saved** with the user
  (`User.membershipNumber` and `User.termsAcceptedAt`), fixing two of my
  Task 3 defects.
- **Rate limits** stored in the database (`RateLimitAttempt`,
  `lib/rate-limit.ts`):

  | Action | Limit |
  |--------|-------|
  | Sign up | 5 per hour per IP |
  | Sign in | 20 per 15 minutes per IP, and 5 wrong passwords per 15 minutes per email |
  | Forgot password | 3 per hour per email, and 10 per hour per IP |
  | Reset password | 10 per 15 minutes per IP |

  Better Auth's own endpoints have separate limits in `lib/auth.ts`.
- **Email verification with a 6-digit code** from `crypto.randomInt`,
  stored hashed, valid for 10 minutes, with 3 attempts per code. A used
  code is rejected if entered again. See `docs/verification-design.md`.
- **A breached password check on sign-up,** using the Have I Been Pwned
  range API. Only the first 5 characters of the password's SHA-1 hash
  leave the server. See `docs/breach-check.md`.
- **Email sent from a background job.** Sign-up adds a row to `EmailJob`
  and returns; a separate worker (`scripts/email-worker.ts`) sends it,
  checking every 5 seconds and retrying failed sends.

## Key numbers
- **Hashing, on my machine:** Argon2id took **78.46 ms** per hash, SHA-256
  **0.000493 ms**. That's 12.7 guesses per second for an attacker against
  2,028,890: SHA-256 gives them **159,188 times** more. A list of one
  million common passwords takes about 21.8 hours per user with Argon2id,
  and half a second with SHA-256.
- **Validation:** Zod takes about **0.4 ms** of a sign-up that takes about
  **160 ms** once the server is warm.
- **Sign-up with the email in a background job:** **163.9 ms** and
  **141.8 ms**, after a first run of 328.7 ms. The number with the email
  sent inside the request is not captured yet.

## Key decisions
- **Argon2id over bcrypt,** because it needs 64 MB of memory per hash,
  which takes away most of a graphics card's advantage for an attacker.
- **Migrations run by me, never the agent,** because some can't be undone
  and I want to read what Prisma is about to do. See `docs/migrations.md`.
- **A required column added in three steps** (optional, filled with
  `LEGACY-UNKNOWN`, then required), because the one-step version failed on
  a table with 3 rows.
- **10-minute verification codes,** long enough to find the email on
  another device, short enough to limit how long a leaked code works.
- **My own rate limits in PostgreSQL, not Redis or memory,** so they're
  shared and survive restarts without another service to run. (Better
  Auth's built-in limits are configured separately, in `lib/auth.ts`.)
- **Email delivery:** Gmail SMTP through nodemailer's `gmail` preset
  (`smtp.gmail.com`, port 465), with a Gmail app password. Using my
  ordinary Gmail password instead, Gmail rejects the login
  (`evidence/16-smtp-failure.txt`); with the app password, it sends
  (`evidence/17-smtp-success.txt`).

## What I got wrong
- **A script couldn't reach the database** because scripts run with `tsx`
  don't load `.env` on their own. Fixed with `--env-file=.env`.
- **The drift error** gave a `500` with no reason, because my enquiry route
  swallowed the error. I added logging. See `docs/migrations.md`.
- **The sign-up form hid the breach check's rejection.** The server
  refused the password, but the form only shows server errors for fields
  the user hasn't typed in, so nothing appeared
  (`evidence/15b-breach-detected-but-hidden.txt`). The bug has been there
  since Task 3.
- **The background worker can send the same email twice, and can stop for
  good on one database error.** These and six other defects, with file and
  line, are in `docs/defects.md`.

## How to run it
1. Set these in `.env` (names only; never commit the values):
   `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GMAIL_USER`,
   `GMAIL_APP_PASSWORD`.
2. Apply the migrations: `npx prisma migrate dev`, then
   `npx prisma generate`.
3. Start the app: `npm run dev`.
4. In a second terminal, start the email worker:
   `npx tsx --env-file=.env scripts/email-worker.ts`. Without it,
   verification emails are queued but never sent.

## Not finished yet
- Fixing the form so the breach check's message shows, then
  `evidence/15-breach-check-rejection.png`.
- `docs/rate-limiting.md` and `evidence/14-rate-limit-defeated.txt`. I
  got past my own limit using my phone, but didn't record it.
- The sign-up timing with the email sent inside the request, for
  `evidence/18-registration-timing-sync-vs-job.txt`.
- `evidence/20-verification-expired.png`.
- The branded HTML email (Part 11) and `evidence/23-rendered-email.png`.

## Evidence

| File | What it shows |
|------|---------------|
| 01-schema-drawing.jpeg | My hand-drawn schema |
| 02-database-state-before.png | The database before this task's migrations |
| 03-initial-migration.txt | The `PaymentAttempt` migration |
| 04-required-column-failure.txt | Adding a required column to a table with 3 rows failing |
| 05-required-column-three-steps.txt | The same change done in three steps |
| 06-drift-error.txt | The `P2022` error from a client ahead of the database |
| 07-hash-twice-different.txt | One password hashed twice, giving two different hashes |
| 08-timing-argon-vs-sha.txt | Argon2id and SHA-256 timed on my machine |
| 09-email-case-normalised.png | Email case normalisation test |
| 10-password-trim-working.png | Password trimming test |
| 11-validation-timing.txt | Sign-up timed with and without validation |
| 12-direct-request-before-and-after.txt | The Task 3 direct request: `200` before, `404` now |
| 13-rate-limit-triggered.png | The sign-in form's rate limit message |
| 13a-rate-limit-triggered-http.txt | Better Auth's endpoint returning `429` after 20 attempts |
| 15b-breach-detected-but-hidden.txt | The server rejecting a breached password while the form showed nothing |
| 16-smtp-failure.txt | Gmail rejecting an ordinary password |
| 17-smtp-success.txt | The test email sent with the app password |
| 18-registration-timing-sync-vs-job.txt | Sign-up timing with the email in a background job |
| 19-verification-row.png | `Verification` rows, with the code stored hashed |
| 21-verification-wrong-code.png | A wrong code rejected |
| 22-verification-code-reused.png | A used code rejected the second time |

## Docs
- `docs/schema.md`
- `docs/migrations.md`
- `docs/hashing.md`
- `docs/validation-placement.md`
- `docs/breach-check.md`
- `docs/verification-design.md`
- `docs/email-copy.md`
- `docs/not-implemented.md`
- `docs/defects.md`
- `docs/interview-answers.md`cs/hashing.md`.
- **Server-side validation before anything else runs,** with the same Zod
  schemas as the forms. Emails are trimmed and lowercased; passwords are
  trimmed but never lowercased. See `docs/validation-placement.md`.
- **The direct sign-up endpoint blocked.** `POST /api/auth/sign-up/email`
  now returns `404`, so sign-up has to go through my server action
  (`app/api/auth/[...all]/route.ts`).
- **Membership number and terms acceptance saved** with the user
  (`User.membershipNumber` and `User.termsAcceptedAt`), fixing two of my
  Task 3 defects.
- **Rate limits** stored in the database (`RateLimitAttempt`,
  `lib/rate-limit.ts`):

  | Action | Limit |
  |--------|-------|
  | Sign up | 5 per hour per IP |
  | Sign in | 20 per 15 minutes per IP, and 5 wrong passwords per 15 minutes per email |
  | Forgot password | 3 per hour per email, and 10 per hour per IP |
  | Reset password | 10 per 15 minutes per IP |

  Better Auth's own endpoints have separate limits in `lib/auth.ts`.
- **Email verification with a 6-digit code** from `crypto.randomInt`,
  stored hashed, valid for 10 minutes, with 3 attempts per code. A used
  code is rejected if entered again. See `docs/verification-design.md`.
- **Email sent from a background job.** Sign-up adds a row to `EmailJob`
  and returns; a separate worker (`scripts/email-worker.ts`) sends it,
  checking every 5 seconds and retrying failed sends.

## Key numbers
- **Hashing, on my machine:** Argon2id took **78.46 ms** per hash, SHA-256
  **0.000493 ms**. That's 12.7 guesses per second for an attacker against
  2,028,890: SHA-256 gives them **159,188 times** more. A list of one
  million common passwords takes about 21.8 hours per user with Argon2id,
  and half a second with SHA-256.
- **Validation:** Zod takes about **0.4 ms** of a sign-up that takes about
  **160 ms** once the server is warm.
- **Sign-up with the email in a background job:** **163.9 ms** and
  **141.8 ms**, after a first run of 328.7 ms. The number with the email
  sent inside the request is not captured yet.

## Key decisions
- **Argon2id over bcrypt,** because it needs 64 MB of memory per hash,
  which takes away most of a graphics card's advantage for an attacker.
- **Migrations run by me, never the agent,** because some can't be undone
  and I want to read what Prisma is about to do. See `docs/migrations.md`.
- **A required column added in three steps** (optional, filled with
  `LEGACY-UNKNOWN`, then required), because the one-step version failed on
  a table with 3 rows.
- **10-minute verification codes,** long enough to find the email on
  another device, short enough to limit how long a leaked code works.
- **My own rate limits in PostgreSQL, not Redis or memory,** so they're
  shared and survive restarts without another service to run. (Better
  Auth's built-in limits are configured separately, in `lib/auth.ts`.)
- **Email delivery:** Gmail SMTP through nodemailer's `gmail` preset
  (`smtp.gmail.com`, port 465), with a Gmail app password. Using my
  ordinary Gmail password instead, Gmail rejects the login
  (`evidence/16-smtp-failure.txt`); with the app password, it sends
  (`evidence/17-smtp-success.txt`).

## What I got wrong
- **A script couldn't reach the database** because scripts run with `tsx`
  don't load `.env` on their own. Fixed with `--env-file=.env`.
- **The drift error** gave a `500` with no reason, because my enquiry route
  swallowed the error. I added logging. See `docs/migrations.md`.
- **The background worker can send the same email twice, and can stop for
  good on one database error.** These and six other defects, with file and
  line, are in `docs/defects.md`.

## How to run it
1. Set these in `.env` (names only; never commit the values):
   `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GMAIL_USER`,
   `GMAIL_APP_PASSWORD`.
2. Apply the migrations: `npx prisma migrate dev`, then
   `npx prisma generate`.
3. Start the app: `npm run dev`.
4. In a second terminal, start the email worker:
   `npx tsx --env-file=.env scripts/email-worker.ts`. Without it,
   verification emails are queued but never sent.

## Not finished yet
- The breach password check (Part 9), `docs/breach-check.md` and
  `evidence/15-breach-check-rejection.png`.
- `docs/rate-limiting.md` and `evidence/14-rate-limit-defeated.txt`.
- The sign-up timing with the email sent inside the request, for
  `evidence/18-registration-timing-sync-vs-job.txt`.
- `evidence/20-verification-expired.png`.
- The branded HTML email (Part 11) and `evidence/23-rendered-email.png`.

## Evidence

| File | What it shows |
|------|---------------|
| 01-schema-drawing.jpeg | My hand-drawn schema |
| 02-database-state-before.png | The database before this task's migrations |
| 03-initial-migration.txt | The `PaymentAttempt` migration |
| 04-required-column-failure.txt | Adding a required column to a table with 3 rows failing |
| 05-required-column-three-steps.txt | The same change done in three steps |
| 06-drift-error.txt | The `P2022` error from a client ahead of the database |
| 07-hash-twice-different.txt | One password hashed twice, giving two different hashes |
| 08-timing-argon-vs-sha.txt | Argon2id and SHA-256 timed on my machine |
| 09-email-case-normalised.png | Email case normalisation test |
| 10-password-trim-working.png | Password trimming test |
| 11-validation-timing.txt | Sign-up timed with and without validation |
| 12-direct-request-before-and-after.txt | The Task 3 direct request: `200` before, `404` now |
| 13-rate-limit-triggered.png | The sign-in form's rate limit message |
| 13a-rate-limit-triggered-http.txt | Better Auth's endpoint returning `429` after 20 attempts |
| 16-smtp-failure.txt | Gmail rejecting an ordinary password |
| 17-smtp-success.txt | The test email sent with the app password |
| 18-registration-timing-sync-vs-job.txt | Sign-up timing with the email in a background job |
| 19-verification-row.png | `Verification` rows, with the code stored hashed |
| 21-verification-wrong-code.png | A wrong code rejected |
| 22-verification-code-reused.png | A used code rejected the second time |

## Docs
- `docs/schema.md`
- `docs/migrations.md`
- `docs/hashing.md`
- `docs/validation-placement.md`
- `docs/verification-design.md`
- `docs/email-copy.md`
- `docs/not-implemented.md`
- `docs/defects.md`
- `docs/interview-answers.md`