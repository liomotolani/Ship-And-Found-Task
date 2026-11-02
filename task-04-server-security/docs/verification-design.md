# Verification design

After signing up, a user must confirm their email address by entering a
6-digit code that VetReply emails to them. Until they do, they can't sign
in (`requireEmailVerification: true`, `lib/auth.ts` line 24). The code is
handled by Better Auth's `emailOTP` plugin, configured in `lib/auth.ts`,
lines 88 to 115.

## How the code is generated

```ts
generateOTP: () =>
  randomInt(0, 1_000_000).toString().padStart(6, '0'),
```

(`lib/auth.ts`, lines 94 and 95)

`randomInt` comes from Node's `node:crypto` module (line 1), which uses the
operating system's cryptographically secure random number generator. It
gives a whole number from 0 to 999,999. `padStart(6, '0')` adds leading
zeros, so 4,821 becomes `004821`. That gives 1,000,000 possible codes, each
equally likely.

I didn't use `Math.random()`. It's built to be fast, not unpredictable: its
output comes from an internal state that can be worked out from enough
previous outputs, after which the next values can be predicted.

## Where the code is stored

| Place | What is stored | For how long |
|-------|----------------|--------------|
| `Verification` table | A **hash** of the code, never the code itself (`storeOTP: 'hashed'`, line 93) | Until it expires or is used |
| `EmailJob` table | The email text, which **includes the code in plain text** | Until the worker sends the email. The worker then replaces the text with an empty string (`scripts/email-worker.ts`, line 74) |
| The user's inbox | The code | Not under my control |

`evidence/19-verification-row.png` shows `Verification` rows. The `value`
column holds a hash, not a 6-digit code, so the code can't simply be read
off the row.

**Hashing a 6-digit code protects less than hashing a password.** There are
only 1,000,000 possible codes. Someone who has a copy of the database could
hash all 1,000,000 and see which one matches. If the hash is a fast one
like SHA-256, my own timing (`hashing.md`) puts that at about half a
second. I haven't checked which hash Better Auth uses for `storeOTP:
'hashed'`, so I can't say exactly how long it would take. What protects a
live code is mainly that it expires after 10 minutes and allows only 3
attempts, not the hashing.

The brief says to retrieve the code from the database. Because it is
hashed, the row doesn't show it. The row shows that a code exists and when
it expires. I took the code itself from the email.

**The weak point is `EmailJob`.** Between sign-up and the worker sending
the email, normally a few seconds, the code sits in plain text in the
database. If the worker is stopped, it stays there until the worker runs
again. I accepted this because the window is short and the code expires
after 10 minutes anyway. A stronger version would keep the code out of the
job row altogether and only add it when the email is sent.

## Expiry: 10 minutes

```ts
export const VERIFICATION_CODE_TTL_SECONDS = 10 * 60;
```

(`config/verification.ts`, line 2, used by `lib/auth.ts` line 91 and in the
email text through `confirmEmailCodeTemplate`)

The rows in `evidence/19-verification-row.png` confirm it: each `expiresAt`
is 10 minutes after its `createdAt`.

**How long users need.** A user may sign up on one device and then have to
find the email on another, such as their phone, and it may land in spam or
a promotions tab. The email also doesn't leave straight away: the worker
picks it up within about 5 seconds, and Gmail then has to deliver it. Two
minutes, which the brief tried first, is too short for that. Ten minutes
allows for a slow email and a user who has to go looking for it, without
making them request another code.

**What the window costs.** A longer window gives an attacker longer to use
a code. But my limit on guesses is per code, not per minute: each code
allows 3 wrong attempts (`allowedAttempts: 3`, line 92), and then it stops
working, however much of the 10 minutes is left. So a longer window doesn't
give an attacker more guesses at the same code. What it does extend is how
long a leaked code stays usable, for example one read from the `EmailJob`
row or from the user's inbox. Ten minutes keeps that short.

## What an attacker could do against predictable codes

The realistic attack is someone signing up with an email address they don't
own, then guessing the code to make VetReply treat that address as
verified. With my codes, each guess has a 1 in 1,000,000 chance, and each
code allows only 3 guesses before it stops working, so each code gives the
attacker a 3 in 1,000,000 chance. To expect one success they would need
about 333,000 fresh codes, and every new code sends a real email to the
real owner of that address, who would notice. If the codes were
predictable, for example generated with `Math.random()`, none of that would
matter: an attacker who had seen enough earlier codes, from accounts they
created themselves, could work out the next one and get it right on the
first guess. The 10-minute expiry wouldn't help, because they wouldn't need
10 minutes, and the 3-attempt limit wouldn't help, because they'd need one.
My rate limits only slow down guessing; they assume guessing is the only way
in. A predictable code removes the need to guess, which is why the code has
to come from `crypto.randomInt`.

**What limits how fast new codes can be requested:**
- Signing up: 5 per hour per IP address (`server/actions/sign-up.ts`,
  line 50).
- Signing in to an unverified account sends a new code
  (`sendOnSignIn: true`, line 85). Sign-in is limited to 20 per 15 minutes
  per IP address (`server/actions/sign-in.ts`, line 50). The per-email
  limit (line 55) only counts wrong passwords (line 104), so it doesn't
  slow down someone who knows the password and keeps signing in to get new
  codes.
- Better Auth's own endpoints for sending and checking codes
  (`/api/auth/email-otp/...`) can still be called directly: my route
  handler only blocks `/sign-up/email`
  (`app/api/auth/[...all]/route.ts`). My config has no custom rule for
  them (`lib/auth.ts`, lines 74 to 83). I haven't tested what limit Better
  Auth applies to them.

My own IP-based limits trust the `X-Forwarded-For` header
(`lib/rate-limit.ts`, lines 7 to 17), which a client can forge, so a
determined attacker could get around them. That is why the per-code limit
of 3 attempts and the unpredictable code matter most: they hold even when
the IP limits don't.

## What happens on failure

`server/actions/verify-email.ts` turns Better Auth's error codes into
messages the user can act on:

| Situation | Message | Evidence |
|-----------|---------|----------|
| Wrong code | "That code is incorrect. Check the email and try again." | `evidence/21-verification-wrong-code.png` |
| Expired code | "That code has expired. Request a new code." | `evidence/20-verification-expired.png` |
| 3 wrong attempts | "Too many attempts. Request a new code." | |
| Code already used | "That code has already been used. Request a new code." | `evidence/22-verification-code-reused.png` |

## Using the same code twice

After a code works, `verify-email.ts` saves a SHA-256 hash of the email and
code in the `UsedVerificationCode` table (lines 107 to 110). Before
checking any code, it looks for that hash first (lines 67 to 78), and if it
finds it, it rejects the code as already used. The unique index on
`(email, codeHash)` stops the same pair being recorded twice.

**Two weaknesses in this:**
- If saving to `UsedVerificationCode` fails, the error is ignored
  (`catch {}`, lines 111 and 112). The user is still told their email is
  confirmed, but the code isn't recorded as used, and nothing is logged, so
  nobody would know.
- The hash is plain SHA-256 of the email and code, with no salt
  (`hashCode`, lines 37 to 39). With only 1,000,000 possible codes, anyone
  with the database and the email can recover a used code in about half a
  second. The codes in this table have already been used, so recovering one
  doesn't let anyone verify an account, but the table shouldn't be read as
  hiding them.

## How the email is sent

The code is emailed through Gmail's SMTP server, using nodemailer's
`service: 'gmail'` setting (`server/email/send-email.ts`) and a Gmail app
password. The request that creates the code doesn't send the email itself:
it adds a row to the `EmailJob` table (`server/email/enqueue-email.ts`),
and a separate worker (`scripts/email-worker.ts`) sends it, checking for
new jobs every 5 seconds. If sending fails, the worker tries again after 1
and then 5 minutes, and marks the job `FAILED` after 3 attempts.