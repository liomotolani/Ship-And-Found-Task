# Breach check

## What it does

When someone signs up, VetReply checks whether their password has
appeared in a known data breach, using the Have I Been Pwned Pwned
Passwords service. If it has, the sign-up is refused with "This password
has appeared in a data breach. Choose a different password."

- **The check:** `server/security/breach-check.ts`
- **Where it runs:** `server/actions/sign-up.ts`, after Zod validation has
  passed and before Better Auth creates the account. It uses the parsed,
  trimmed password, `result.data.password`.
- **Registration only,** as the brief asks. Sign-in and reset password
  don't run it.

## How it works without sending the password

1. VetReply hashes the password with SHA-1 and turns it into 40 hex
   characters (`breach-check.ts`, line 21).
2. It splits the hash in two: the first 5 characters (the prefix) and the
   other 35 (the suffix) (lines 22 and 23).
3. It sends **only the prefix** to
   `https://api.pwnedpasswords.com/range/{prefix}` (line 28).
4. The service replies with every breached-password hash suffix it has
   that starts with that prefix, each with the number of breaches it was
   seen in.
5. VetReply looks for its own suffix in that list, **on my server**
   (lines 41 to 59). If it's there with a count above 0, the password is
   breached.

The service never sees the password or the full hash. All it learns is the
5-character prefix, and thousands of different passwords share any given
prefix, so it can't tell which one I checked, or whether it was in the
list at all.

**From my test:** I signed up with a password I knew was in the breach
list. The log showed exactly what left my server:

```
[breach-check] prefix 98A16, 2100 suffixes returned, breached: true
```

Only `98A16` was sent. The service returned 2,100 lines, and the match was
found locally (`evidence/15b-breach-detected-but-hidden.txt`).

**Padding.** The request sends the header `Add-Padding: true` (line 29),
so the service adds fake lines with a count of 0, making every response a
similar size. Without it, someone watching the encrypted traffic could
guess the prefix from the size of the reply. The 2,100 lines in my test
include these, so they aren't all real breached passwords. My code only
treats a match with a count above 0 as breached (lines 54 and 61).

## Why the naive version would be unacceptable

The naive version sends the password itself, or its full hash, and asks
"is this breached?"

**Sending the password** hands every new user's password to a third
party, at the exact moment they choose it, linked to my server. I'd be
trusting that service, everyone who can read its logs, and everyone who
could ever break into it, with every password VetReply's users create.
Many of those passwords are reused for email and banking. The whole point
of hashing passwords with Argon2id is that VetReply itself never keeps
them; sending them out would undo that.

**Sending the full SHA-1 hash** is barely better. SHA-1 is fast and
unsalted, and the same password always gives the same hash, so anyone who
sees it can look it up in a list of common passwords' hashes instantly.
For exactly the passwords this check is meant to catch, the full hash is
the password in another form.

## Why SHA-1 is acceptable here

SHA-1 would be the wrong choice for storing passwords, for the reasons in
`hashing.md`. Here it isn't used to store anything. It's only the format
the service uses to look passwords up, and only 5 characters of it leave
my server. The password VetReply stores is still hashed with Argon2id.

## Decisions

**Threshold: any breach rejects.** A count of 1 is enough. A password that
has appeared in a breach even once is in the lists attackers try first,
so there is no safe number above zero.

**When the service can't be reached, sign-up continues.** The request has
a 3-second timeout (line 4). If the service is down, slow or returns an
error, the check logs `[breach-check] unavailable: <reason>` and lets the
sign-up through (lines 68 to 71). Otherwise an outage at a service I don't
control would stop anyone signing up to VetReply. The cost is that a
breached password can get through during an outage. The log line is how I
would notice that happening.

**Registration only.** That's what the brief asks for, but it leaves a
gap: someone could sign up with a safe password, then change it to a
breached one through reset password. Adding the same check to reset
password would close that.

## What went wrong

**The rejection didn't show on the form.** The server rejected the
password, but the sign-up form showed nothing. `showError` in
`components/SignUpForm.tsx` only shows a server error for a field the user
hasn't touched, and nobody can submit a password without typing one. See
`defects.md`.

**The check and the stored hash can see slightly different passwords.**
`hashPassword` normalises the password with `normalize('NFKC')` before
hashing (`lib/password.ts`, line 31), but the breach check doesn't
(`breach-check.ts`, line 21). For a password with certain accented or
special characters, the two could be checking different versions of it.
This is unlikely to matter in practice, but the two should use the same
version.