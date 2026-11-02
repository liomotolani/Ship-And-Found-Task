# What I decided not to do

Security controls I considered for VetReply and left out at this stage.
VetReply so far runs only on my machine, with no real practices or clients
using it. Each decision below would change once that does.

---

## 1. Two-factor authentication for staff

**What it is:** after the password, staff enter a second code, usually
from an app on their phone, so a stolen password alone isn't enough to sign
in.

**Why not now:** VetReply already makes a stolen password harder to use
and slower to guess: Argon2id hashing (`hashing.md`), sign-in rate limits
per IP and per email (`server/actions/sign-in.ts`, lines 50 and 55), and
email verification. Two-factor sign-in also adds setup and support work for
every receptionist and vet, and a lost phone becomes a locked-out member of
staff during a working day. With no real practice using VetReply yet, that
cost buys protection for accounts that don't exist.

**What would change it:** a real practice going live, especially once
staff accounts can see client enquiries, bookings and payments. At that
point the people most worth attacking are staff, and I'd add it for the
receptionist, vet and practice manager roles first.

---

## 2. CAPTCHA on sign-up and sign-in

**What it is:** a challenge, such as picking images or a hidden browser
check, meant to stop bots from submitting forms.

**Why not now:** VetReply already slows bots down without one. Sign-up is
limited to 5 per hour per IP (`server/actions/sign-up.ts`, line 50), sign-in
to 20 per 15 minutes per IP, and an account does nothing until its email is
verified. CAPTCHAs also make forms harder for real people to use,
especially people using screen readers, which I tested VetReply with in
Task 3. Most also load a script from a third party, which sends that
company data about every visitor.

**What would change it:** evidence of bots, such as a sudden rise in
unverified sign-ups or rows in `RateLimitAttempt` from many different IP
addresses. I'd add it to sign-up first, since that is where bots create
accounts.

---

## 3. Locking an account after repeated wrong passwords

**What it is:** after a set number of wrong passwords, the account is
locked until someone unlocks it.

**Why not now:** a permanent lockout lets anyone lock out a vet or
receptionist just by typing their email with wrong passwords, which would
stop a practice working. Instead, VetReply limits wrong passwords to 5 per
email per 15 minutes (`server/actions/sign-in.ts`, lines 55 and 104). That
slows guessing at one account to a crawl, and the account opens again by
itself.

That limit is still a short lockout, and it has the same weakness on a
smaller scale: someone who types 5 wrong passwords for a receptionist's
email every 15 minutes keeps them out for as long as they keep doing it. I
accepted that because it needs an attacker to keep going, and it ends the
moment they stop, whereas a permanent lock needs someone to undo it.

**What would change it:** if attackers were spreading guesses slowly
enough to stay under the limit, or a client required it. I'd still unlock
accounts automatically after a time, and email the owner, rather than
leave them locked.

---

## 4. A pepper on password hashes

**What it is:** a secret value added to every password before hashing,
kept outside the database (for example in an environment variable). If
someone steals only the database, they can't test guesses without also
stealing the pepper.

**Why not now:** Argon2id with a random salt for every password already
makes each guess slow and forces an attacker to attack each user
separately (`hashing.md`). A pepper adds a secret that has to be stored,
backed up and never lost: if the pepper is lost, every password stops
working. VetReply's database and its environment variables are on the same
machine at the moment, so an attacker who gets one probably gets the
other, and the pepper adds little.

**What would change it:** the database moving to a separate host or a
managed service, or backups being held by someone else, so that a stolen
database no longer means stolen environment variables.

---

## 5. A fast shared store, such as Redis, for rate limiting

**What it is:** keeping rate limit counts in an in-memory store built for
counting quickly, instead of in the main database.

**Why not now:** VetReply's own rate limits are stored in the
`RateLimitAttempt` table in PostgreSQL (`lib/rate-limit.ts`). That is
already shared, so the limits hold however many copies of the app are
running, and it needs no new service to run, pay for or secure. Each check
adds a database query, which at VetReply's traffic costs nothing a user
would notice.

**What would change it:** enough traffic that the extra queries slow down
sign-in, or the `RateLimitAttempt` table growing large enough to be a
problem. Both are measurable before they hurt.