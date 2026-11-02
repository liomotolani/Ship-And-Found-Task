# Defects

Real defects in my own Task 4 code, with file, line and what each would
cost in production. None of these has been fixed.

---

## Defect 1: A verification email can be sent twice

- **File and line:** `server/email/send-email.ts`, lines 60 to 98, and
  `scripts/email-worker.ts`, lines 55 to 103.
- **What is wrong:** `sendEmail` sends the email (line 60), then writes a
  `SENT` row to the email log (line 67). Both are inside the same `try`. If
  the email goes out but the log write fails, for example because the
  database briefly drops, the `catch` runs and `sendEmail` returns `false`.
  The worker then treats a sent email as a failed one and sends it again
  later, up to 3 times.
- **Cost in production:** the client gets the same email two or three
  times, and the log says it failed when it didn't. For the verification
  email it's confusing; for any future email that matters more, like a
  booking confirmation, it looks broken.

## Defect 2: An email job can get stuck forever

- **File and line:** `scripts/email-worker.ts`, lines 13 to 47 and 105
  to 127.
- **What is wrong:** the worker claims a job by changing its status from
  `PENDING` to `SENDING`, and only ever looks for `PENDING` jobs. If the
  worker stops after claiming a job but before finishing it (a crash, a
  restart, me pressing Ctrl+C), that job stays `SENDING` and nothing ever
  picks it up again. There is no timeout that puts it back. Stopping is
  also easy: `runOnce` and `main` have no `try`/`catch`, so a single
  database error while updating a job ends the whole worker, not just that
  job.
- **Cost in production:** the user never gets their verification code,
  and no error is logged anywhere. The only sign is a row stuck in
  `SENDING`, which nobody is watching.

## Defect 3: The worker breaks my own email rule

- **File and line:** `scripts/email-worker.ts`, lines 83 to 96, against
  `.agents/rules/email.md`, rule 8.
- **What is wrong:** rule 8 says "When Gmail rejects a message, mark the
  related record failed and stop. Never retry automatically", because
  retries can breach Gmail's sending limit and send duplicates. The worker
  retries automatically, after 1 and then 5 minutes. Defect 1 is exactly
  the duplicate the rule warns about.
- **Cost in production:** the rules file and the code disagree, so the
  next agent working on email gets told one thing and finds another. I
  have to either change the rule (retrying a verification code is
  reasonable) or change the worker.

## Defect 4: The verification code sits in the database in plain text

- **File and line:** `server/email/enqueue-email.ts`, lines 11 to 20.
- **What is wrong:** Better Auth stores the code hashed in `Verification`
  (`storeOTP: 'hashed'`, `lib/auth.ts` line 93). But the email text,
  which includes the code, is saved as it is in `EmailJob.text` until the
  worker sends it. If the worker is stopped, or a job is stuck as in
  Defect 2, the code stays there in plain text.
- **Cost in production:** anyone who can read the database can read live
  codes, which undoes the point of hashing them.

## Defect 5: A used code can fail to be recorded, silently

- **File and line:** `server/actions/verify-email.ts`, lines 107 to 112.
- **What is wrong:** after a code works, the action saves it to
  `UsedVerificationCode` so it can't be used again. If that save fails, the
  error is caught and ignored (`catch {}`), with nothing logged. The user is
  still told their email is confirmed.
- **Cost in production:** the reuse protection can stop working without
  anyone knowing, because the failure leaves no trace.

## Defect 6: Rate limits can be beaten by sending requests at the same time

- **File and line:** `lib/rate-limit.ts`, lines 45 to 47, used by
  `server/actions/sign-up.ts` (lines 50 to 55) and
  `server/actions/sign-in.ts` (lines 50 to 60).
- **What is wrong:** each action first counts recent attempts
  (`isLimited`), and only afterwards records the new one
  (`recordAttempt`). Requests that arrive at the same moment all count
  before any of them records, so they all see the same number and all get
  through.
- **Cost in production:** a script that sends many requests at once can
  get past a limit that holds for requests sent one after another.

## Defect 7: Rate limits trust a header the client controls

- **File and line:** `lib/rate-limit.ts`, lines 8 to 26.
- **What is wrong:** `getClientIp` takes the IP address from the
  `X-Forwarded-For` header, which anyone can set to any value. An attacker
  can send a different made-up IP with every request and get a fresh limit
  each time. If neither header is present, every request gets the same key,
  `unknown`, so all those users share one limit.
- **Cost in production:** the per-IP limits on sign-up, sign-in and
  forgot password can be bypassed by anyone who knows to set the header.
  The comment on line 7 says so, but the code doesn't do anything about it.

## Defect 8: Older passwords are never upgraded to Argon2id

- **File and line:** `lib/password.ts`, lines 54 to 73.
- **What is wrong:** passwords hashed before I switched to Argon2id are
  still checked with scrypt, which is correct, but they are never
  re-hashed with Argon2id when the user signs in successfully. They stay on
  the old algorithm until the user resets their password.
- **Cost in production:** some users stay on the old algorithm and
  settings indefinitely, not the ones I chose and measured
  (`hashing.md`), and the scrypt code has to be kept forever because
  nothing ever moves them off it.