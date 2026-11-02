# Interview answers

## Hashing

### 1. Why should you hash passwords?

Because sooner or later, someone other than the user may see the user
table: an attacker who steals a backup, a developer with database access,
or a log that captured a query. If passwords are stored as they are, every
one of them is exposed at once. Worse, people reuse passwords, so a client's
VetReply password is often also their email or bank password. A leak from
a small vet practice app could hand an attacker those accounts too.

Hashing turns the password into a fixed value that can't be turned back.
To sign someone in, I hash what they typed and compare it with the stored
hash, so VetReply never needs to know the actual password. That's why my
code only ever stores the output of `hashPassword` (`lib/password.ts`).

Hashing doesn't make a stolen table safe on its own, though. An attacker
can't reverse a hash, but they can guess: hash "password123", compare,
repeat. So hashing has to be slow and salted, which is what the next
questions are about. The goal is that a stolen table costs an attacker so
much time per guess that most passwords never get cracked.

### 2. Why use bcrypt instead of SHA-256 for passwords?

Because SHA-256 is designed to be fast, and for passwords fast is exactly
what an attacker wants. On my laptop, one SHA-256 hash took 0.000493 ms,
about 2 million guesses per second on one core
(`evidence/08-timing-argon-vs-sha.txt`). Graphics cards run SHA-256
billions of times a second, so a list of common passwords is tested
against a stolen hash almost instantly.

bcrypt is designed to be slow, and has a cost setting so it can be made
slower as hardware gets faster. Every guess pays that cost, so an attacker
gets far fewer guesses per second.

VetReply goes one step further and uses Argon2id. Like bcrypt, it's slow
and adjustable. Unlike bcrypt, it also requires a set amount of memory for
every hash, 64 MB in my settings. Graphics cards get their speed from
running thousands of calculations side by side, and each of those would
now need its own 64 MB, which removes most of their advantage. On my
machine, one Argon2id hash took 78.46 ms, about 12.7 guesses per second,
159,188 times fewer than SHA-256.

So the answer isn't really "bcrypt". It's "a password hashing algorithm
built to be slow", and of those, Argon2id is the current recommendation.

### 3. What is a salt and why do you need it?

A salt is a random value, different for every password, mixed in before
hashing. It's stored with the hash, so it isn't secret. Its job is to make
the same password hash differently for every user.

Without it, three things go wrong. First, identical passwords give
identical hashes, so cracking one user's password cracks everyone who
uses the same one, and an attacker can see at a glance which passwords are
most common. Second, attackers can use precomputed tables: hash millions
of common passwords once, in advance, and look up every stolen hash
instantly. Third, every guess can be checked against every user at once,
so attacking 10,000 users costs the same as attacking one.

With a salt, each user has to be attacked separately, starting from
scratch.

In VetReply I don't manage salts myself. `@node-rs/argon2` generates a new
random salt for every hash and stores it inside the hash string. My
evidence shows this: hashing the same password twice gave two different
hashes, and both verified (`evidence/07-hash-twice-different.txt`). The
salt is the part between the settings and the result, for example
`$2abBXaMv/7hD+vVJoRFdDA$`.

A salt doesn't slow down guessing at one user. That's the work factor's
job.

### 4. What salt rounds, or what work factor, should you use? Give a number and defend it.

I use Argon2id with 64 MB of memory, 3 passes and 1 thread
(`lib/password.ts`, lines 31 to 36). On my machine, that takes 78.46 ms
per hash (`evidence/08-timing-argon-vs-sha.txt`). If I were using bcrypt,
the number people usually give is a cost of 12, but I haven't measured
bcrypt on my machine, so I'd defend it the same way: by timing it.

The number comes from a trade-off, so I defend it with the two sides.

**What it costs me:** each sign-in, sign-up and password reset hashes once.
78 ms is a delay nobody notices: my whole sign-up takes about 160 ms
(`validation-placement.md`). But it's also server time. Many sign-ins at
once mean many 78 ms, 64 MB hashes at once, which is one more reason
sign-in is rate limited.

**What it costs an attacker:** 12.7 guesses per second per core instead
of 2 million with SHA-256. A list of one million common passwords takes
about 21.8 hours per user instead of half a second.

The right number isn't fixed. It should be as high as your server can
afford at peak sign-in traffic, measured on the real server, not a laptop.
And it should go up over time, because hardware gets faster. The hash
string records its own settings, so older hashes still verify after the
settings change.

### 5. Plain text, SHA-256, AES-256 encryption or adaptive hashing: which is correct, and why are the other three wrong?

Adaptive hashing, such as Argon2id or bcrypt, is correct. It's one-way,
salted, and slow on purpose, with a cost setting that can rise over time.
VetReply uses Argon2id.

**Plain text** is wrong because anyone who sees the table sees every
password, ready to use, including on other sites where users reused it.

**AES-256 encryption** is wrong for the same basic reason as plain text:
it can be reversed. Encryption is built to be undone with a key, and the
key has to be somewhere the app can read it, usually on the same server.
An attacker who gets the database often gets the key too, and then has
every password. A system that only needs to check a password should never
be able to recover it.

**SHA-256** is the one that's wrong for a different reason. It's one-way,
so it can't be decrypted like AES. It's wrong because it's fast. An
attacker doesn't reverse it; they guess, hashing candidate passwords and
comparing. At about 2 million guesses per second on one core of my laptop,
and billions on a graphics card, common passwords fall almost instantly.
Adding a salt stops precomputed tables, but doesn't slow down each guess.

So plain text and AES fail because the password can be read back. SHA-256
fails because it can be guessed too quickly.

## Validation

### 6. Why is client-side validation not enough?

Because the client belongs to the user, not to me. Anything that runs in
the browser can be switched off, edited or skipped completely. Client-side
validation is there to help honest users fix mistakes quickly. It does
nothing to stop someone who wants to break the rules.

I proved this in Task 3. My sign-up form required a name of at least 2
characters, a membership number and accepted terms. I sent a request
straight to Better Auth's sign-up endpoint with `curl`, with a 1-character
name, no membership number and no terms. The server answered `200 OK` and
created a user named "a" (`evidence/12-direct-request-before-and-after.txt`).
The form's rules never ran, because I never used the form.

In Task 4 I closed that gap in two ways. My server action validates
everything with the same Zod schema as the form, before anything else
happens. And I blocked the direct endpoint, so the same request now gets
`404 Not Found` (`app/api/auth/[...all]/route.ts`). Sign-up through the
form goes through the server action, and the server action enforces the
rules.

So the form and the server check the same things, but only the server's
check counts. The form is for speed and clarity; the server is for
correctness.

### 7. What security checks belong in the frontend, and what must the server enforce regardless?

In the frontend, checks that help the user, never ones that protect the
system. That means telling someone their email looks wrong, that their
password is too short, or that a required field is empty, as they type, so
they don't have to submit and wait. Hiding buttons a user can't use
belongs there too, because showing them would just be confusing. None of
these are security: they all assume the person is trying to use the form
properly.

The server must enforce everything that matters, whether or not the
frontend checked it:
- **Who the user is:** a valid session, checked on every request.
- **What they're allowed to do:** their role, for every action, not just
  for what's on screen.
- **That the input is valid:** the full schema, again, on the server.
  VetReply runs the same Zod schemas in the form and in every server action.
- **How often they can do it:** rate limits on sign-up, sign-in and
  password reset are all server side.
- **Business rules:** for example, that an email isn't already registered,
  or that a verification code hasn't been used.

The test I use: if a check would still matter for someone sending requests
with `curl`, it belongs on the server. If it only matters to someone using
the form, it can live in the frontend too.

### 8. The interface hides the delete button for non-administrators. Is that enough? If not, what does an attacker do instead?

No. Hiding the button only changes what the page shows. The action behind
it, the endpoint or server action that does the deleting, is still there,
and anyone can call it.

An attacker doesn't need the button. They sign in with an ordinary
account, open the browser's developer tools, and find the request the
delete button would send, either by reading the page's code or by watching
an administrator's request if they can. Then they send that request
themselves, with `curl` or from the console, using their own session. If
the server doesn't check their role, the delete works.

It's the same mistake I made in Task 3 with sign-up: the form enforced my
rules, but the endpoint behind it didn't, so a direct request created an
account the form would have refused
(`evidence/12-direct-request-before-and-after.txt`).

The fix is that the server checks permission on every request: who is
signed in, and whether their role is allowed to do this. VetReply has four
roles, client, receptionist, vet and practice manager, stored on the
`User` row, so the check must read the role from the session on the
server, never from anything the browser sends. Hiding the button is still worth
doing, but only so users don't see things they can't use.

### 9. What is the difference between validation, encoding and sanitisation?

They solve different problems at different times.

**Validation** decides whether input is acceptable, and rejects it if
not. It happens when the data comes in. VetReply's Zod schemas do this:
an email must look like an email, a password must be at least 12
characters, a verification code must be exactly 6 digits
(`lib/validation/verify-email.ts`). Invalid input is refused before
anything else runs.

**Sanitisation** changes input to make it acceptable, rather than rejecting
it. VetReply does a light version: emails are trimmed and lowercased, and
passwords are trimmed. Heavier sanitisation, like stripping HTML out of a
message, is riskier, because it changes what the user actually wrote and
it's easy to get wrong.

**Encoding** happens when data goes out, not when it comes in. It makes
data safe for wherever it's going: escaping `<` and `&` before putting
text into HTML, or using parameters instead of joining text into a SQL
query. The same text needs different encoding for HTML, for a URL and for
SQL, which is why it's done at the point of output. VetReply's HTML email
has to escape the practice name and code for this reason, and Prisma
handles it for database queries.

Validation can't replace encoding: perfectly valid text can still contain
characters that are dangerous in HTML.

### 10. Why would you replace the incoming request body with the parsed and validated data, rather than leaving both available?

Because if the raw input is still there, someone will eventually use it by
mistake, and then the validation might as well not have happened.

The parsed data is different from the raw input. In VetReply, the parsed
email is trimmed and lowercased, and the parsed password is trimmed. If a
later line reads the raw email instead, it skips that cleaning: the same
person could create two accounts with `Ana@x.com` and `ana@x.com`. The
parsed data also contains only the fields the schema knows about. If the
raw body is passed along, an extra field the schema never checked, such
as `role: "PRACTICE_MANAGER"`, could reach code that trusts it. In
VetReply, Better Auth also refuses `role` from input (`input: false` in
`lib/auth.ts`), but that's a second line of defence, not a reason to pass
raw input along.

So in all four of my auth server actions, the raw `formData` is only read
to pass it into the schema. After that, everything uses `result.data`.
Sign-up passes `result.data.name`, `result.data.email`,
`result.data.password` and `result.data.membershipNumber` to Better Auth
(`server/actions/sign-up.ts`, lines 93 to 100).

Removing the raw input makes the safe choice the only choice. A reviewer
doesn't have to check every line to make sure it used the right variable,
because there's only one to use.

### 11. Why validate route parameters and query strings, not just the body?

Because they're input from the user too, and they're even easier to
change than the body: anyone can edit the address bar. A developer who
validates the form carefully but trusts the URL has left a door open.

The risks are the same as for the body. A record ID in the route can be
changed to someone else's ID, so the server has to check the record
belongs to the signed-in user, not just that the ID looks valid. A query
string value can be any text at all, including something far too long,
the wrong type, or text designed to break a query or a page if it's used
without care. Values from the URL also end up in logs and get shared in
links, so they travel further than a form body.

VetReply reads values from the URL already, for example `?form=signin` on
the auth page and `?reason=unconfirmed` on the verify email page. Those
should go through a schema that only accepts the values the page knows
about, and anything else should be treated as missing.

The rule is simple: every value that arrives with a request is untrusted,
whichever part of the request it arrived in.

## Rate limiting

### 12. How do you rate limit unauthenticated requests, and what is the problem with the header you would reach for first?

Without a signed-in user, the usual key is the client's IP address, often
combined with something from the request, such as the email being tried.
VetReply does both for sign-in: 20 attempts per 15 minutes per IP, and 5
wrong passwords per 15 minutes per email (`server/actions/sign-in.ts`,
lines 50 and 55). The email limit protects one account even when the
attacker changes IP.

The header you reach for first is `X-Forwarded-For`. When an app sits
behind a proxy or load balancer, the real client IP is in that header,
because the connection itself comes from the proxy. The problem is that
the client can send that header too, with any value. If the app trusts
the first value in it, an attacker can send a different made-up IP with
every request and get a new limit each time.

VetReply has exactly this problem: `getClientIp` takes the first value of
`X-Forwarded-For` (`lib/rate-limit.ts`, lines 8 to 17). It's listed in my
`defects.md`. The fix is to only trust the value added by my own proxy,
which depends on where VetReply is hosted.

IP limits also have a natural weakness: when my laptop was blocked, I
could still sign in from my phone, because it had a different IP. That's
why the per-email limit matters.

### 13. Which rate limiting algorithm would you choose for a production API, and what is the boundary burst problem?

The boundary burst problem belongs to the simplest algorithm, the fixed
window. It counts requests in fixed blocks of time, such as 10 per minute
starting on the minute. An attacker can send 10 requests at 12:00:59 and
10 more at 12:01:00. Each window sees 10, so both pass, but the server took
20 requests in two seconds, double the intended limit.

For a production API I'd choose a sliding window counter or a token
bucket. A sliding window counter estimates the count over the last full
minute, at any moment, by weighting the previous window's count, so there
is no edge to exploit, and it only stores two numbers per key. A token
bucket allows short bursts up to a set size and then a steady rate, which
suits APIs where normal clients do send small bursts.

VetReply's own limits use a sliding window log: every attempt is a row in
`RateLimitAttempt`, and the check counts the rows from the last 15
minutes, for example (`lib/rate-limit.ts`, lines 28 to 37). That has no
boundary burst problem, because the window always ends now. Its cost is
one row per attempt, which is fine for login traffic but would be too much
for a busy API, where I'd switch to a sliding window counter.

### 14. Why use a shared store for your counters rather than in-memory counters on each server?

Because with in-memory counters, each copy of the app keeps its own count.
If an app runs on three servers behind a load balancer, an attacker's
requests are spread across all three, and each server only sees a third of
them. A limit of 5 becomes 15. Counters also disappear whenever a server
restarts or a new version is deployed, so an attacker gets a fresh limit
every time.

A shared store, such as the database or Redis, keeps one count that every
server reads and writes, so the limit is the same however many servers
there are, and it survives restarts.

VetReply's own rate limits use the database, the `RateLimitAttempt` table,
so they're shared already. Even on my laptop that matters: restarting the
dev server doesn't reset the limits.

Better Auth's built-in limits, which protect its own endpoints, are
configured in `lib/auth.ts`. As far as I know, Better Auth keeps those in
memory unless you set a storage option, and my config doesn't set one. If
that's right, those limits would reset on every restart and wouldn't be
shared between servers. It's something I'd confirm and change before
running more than one copy of VetReply.

### 15. What HTTP status code should a rate limiter return, and why is 403 the wrong choice?

`429 Too Many Requests`, ideally with a `Retry-After` header saying how
long to wait.

The two codes mean different things. `429` says: you're allowed to do
this, just not this often; wait and try again. `403 Forbidden` says: you
are not allowed to do this at all, and retrying won't help. Clients,
browsers, monitoring and other developers act on that difference. A client
that gets `403` should give up or ask for different permissions, so a
well-behaved app that hit a limit would stop working instead of waiting.
And someone reading the logs would look for a permissions bug that
doesn't exist.

Better Auth's endpoint does this correctly. In my test, attempts 1 to 20
returned `401`, and attempts 21 to 26 returned
`429`, with the header `x-retry-after: 900`, which is the 15-minute window
(`evidence/13a-rate-limit-triggered-http.txt`).

My own limits are less correct. They run inside Next.js server actions,
which answer the form with a normal response, so the page shows "Too many
attempts. Please try again later." (`evidence/13-rate-limit-triggered.png`)
but the HTTP status isn't `429`. A person sees the right message; a script
or a monitoring tool wouldn't.

### 16. What do you do when your rate limit store is unavailable: fail open or fail closed? Answer for your own application.

Fail open means letting requests through without a limit; fail closed means
refusing them.

In VetReply, the rate limit store is the main PostgreSQL database, the
same one that holds users and sessions. So the question mostly answers
itself: if the database is down, nobody can sign in anyway, because there
are no users or sessions to check. Failing open wouldn't let anyone in.

What actually happens in my code: `isLimited` is called outside any
`try`, so if the database can't be reached, the error isn't caught and
the action fails (`server/actions/sign-in.ts`, line 50). That's failing
closed, and for VetReply's sign-in, sign-up and password reset, it's the
right choice. These are the endpoints attackers target, and an outage is
exactly when nobody would be watching for an attack.

It would be different if the store were separate, such as Redis, while the
database still worked. Then failing closed would block every sign-in
because of a counting service. For a vet practice, staff being unable to
sign in during a working day is a real cost, so I'd fail open for staff
sign-in with an alert, and keep failing closed for sign-up and password
reset, which can wait.

## About my work

### 17. You have two timing numbers for hashing, from your own machine. Walk me through what they mean for an attacker who has stolen your user table.

On my Mac (Apple silicon, Node v26.11.1), one Argon2id hash with my
settings took 78.46 ms, averaged over 20 hashes. One SHA-256 hash took
0.000493 ms, averaged over a million (`evidence/08-timing-argon-vs-sha.txt`).

An attacker with my user table can't reverse the hashes, so they guess:
hash a candidate password with the stored salt and compare. Every guess
costs one hash. On one core of my laptop, that's 12.7 guesses per second
with Argon2id, against about 2,028,890 with SHA-256, 159,188 times more.

Made concrete: testing a list of one million common passwords against one
user would take about 21.8 hours with Argon2id, and about half a second
with SHA-256. Because every user has their own salt, the attacker has to
repeat that for each user separately.

The real gap is bigger than my numbers. Attackers use graphics cards,
which run SHA-256 billions of times a second. Argon2id needs 64 MB of
memory per hash, so a graphics card can run far fewer at once, and most
of its advantage disappears.

What it doesn't mean: a user with a very common password is still at
risk, because it would be near the top of the list. Slow hashing buys
time for the rest; a breached password check is what stops the worst
passwords being chosen in the first place.

### 18. How does a breached password check avoid sending the password anywhere? Explain the mechanism, then say what the naive version would leak.

The check uses a method called k-anonymity, as used by the Have I Been
Pwned passwords service.

My server hashes the password with SHA-1 and takes the first 5
characters of the hash, for example `21BD1`. Only those 5 characters are
sent. The service replies with every hash suffix it knows that starts with
those 5 characters, usually hundreds of them, each with a count of how
many breaches it appeared in. My server then checks, locally, whether the
rest of my hash is in that list. If it is, the password has appeared in a
breach, and VetReply refuses the sign-up. In my test, the only thing that
left my server was `98A16`; the service sent back 2,100 lines, including
padding, and the match was found locally.

The service never sees the password, or even the full hash. It only learns
that the password is one of the hundreds that share those 5 characters,
so it can't tell which one I was checking, or whether it was in the list
at all.

The naive version sends the whole password, or its full hash, to the
service. Sending the password gives a third party every user's password
as they choose it, and anyone who can see that traffic or the service's
logs gets them too. Sending the full SHA-1 hash is barely better: an
unsalted SHA-1 hash of a common password can be looked up instantly, so
it is the password in another form.

### 19. Wrong-answer analysis

"I hash passwords with SHA-256 plus a random salt per user, which means
even if the database is stolen the passwords cannot be reversed, because
hashing is one-way. I also rate limit login attempts by IP, so brute force
is not possible."

In order of severity:

**1. SHA-256 is the wrong algorithm.** It's fast, which is what an
attacker wants. On my laptop, it allows about 2 million guesses per second
on one core, against 12.7 for my Argon2id settings. With a graphics card,
billions.

**2. "Cannot be reversed" misunderstands the attack.** True, but attackers
don't reverse hashes; they guess. They hash candidate passwords and
compare. The salt stops precomputed tables and forces them to attack each
user separately, but it doesn't slow down a single guess, so weak
passwords still fall quickly.

**3. Rate limiting doesn't apply to this attack at all.** This is the
threat model error. A rate limit protects the login form, which is an
online attack. Once the database is stolen, the attacker guesses offline,
on their own machine, without ever touching the login. The candidate has
used a defence for one attack to answer a different one.

**4. Even online, IP limits don't stop brute force.** Attackers spread
guesses across many IP addresses, and `X-Forwarded-For` can often be
faked, as it can in VetReply. A per-account limit is also needed.

The misunderstanding: they treat "the database is stolen" and "someone is
attacking the login" as the same threat. They need different defences.