# Validation placement

## Why Zod

VetReply validates with Zod (version 4.6.7). One schema does two jobs: it
checks the shape of the input, and it cleans it, for example trimming and
lowercasing emails and trimming passwords. The sign-up and sign-in forms in
the browser use the same schemas as the server (`components/SignUpForm.tsx`
and `components/SignInForm.tsx` both check fields against them), so the
rules can't drift apart, and
Zod's output is typed, so the rest of the code knows exactly what it is
working with.

## Where validation sits in each request

| Flow | Server action | Schema | What runs before validation |
|------|---------------|--------|-----------------------------|
| Registration | `server/actions/sign-up.ts` | `signUpSchema` (line 60) | Reads the request headers and looks up the current session (lines 46 to 50) |
| Login | `server/actions/sign-in.ts` | `signInSchema` (line 51) | Reads the request headers and looks up the current session (lines 42 to 46) |
| Forgot password | `server/actions/forgot-password.ts` | `forgotPasswordSchema` (line 18) | Nothing |
| Reset password | `server/actions/reset-password.ts` | `resetPasswordSchema` (line 19) | Nothing |

In every flow, nothing reaches Better Auth, the database writes, password
hashing or email until validation has passed. If it fails, the action
returns an error and stops.

## What runs before validation, and what must never

**Allowed before validation**, because none of it trusts the form data:
- reading the request and its headers
- rate limiting
- checking who is signed in

In sign-up and sign-in, the session lookup runs first, so a user who is
already signed in is redirected without their form being processed. It is
a database read, but it uses the session cookie, not the untrusted form
fields, so it is safe to run first.

**Must never run before validation:**
- **Writing to the database:** unchecked data would be stored.
- **Hashing the password:** it takes about 78 ms on my machine
  (`hashing.md`), so an attacker could send huge or junk passwords to make
  the server do expensive work for nothing.
- **Calling outside services**, such as sending email or the breached
  password check, for the same reason, and because the input could be
  malformed.
- **Logging raw input**, especially passwords.

## The timing

`evidence/11-validation-timing.txt`: five valid sign-ups with Zod
validation, then five with validation temporarily skipped (reverted
afterwards, never committed). Times are from my machine.

| | Validation | Whole sign-up |
|-|------------|---------------|
| With validation, runs 1 and 2 | 2.449 ms, 7.540 ms | 1,011.4 ms, 266.8 ms |
| With validation, runs 3 to 5 (average) | **0.409 ms** | **160.4 ms** |
| Without validation, runs 3 to 5 (average) | 0.064 ms (all 5 runs) | **156.1 ms** |

The first runs in each set were slower, because the dev server was still
compiling and warming up: the first request took 1,288 ms with validation
and 1,155 ms without. I compared the later runs, once the server was warm.

**What the numbers show:** once warm, Zod validation takes about
**0.4 ms**, and a whole sign-up takes about **160 ms** with it and about
**156 ms** without. The 4 ms difference is smaller than the variation
between runs (130.8 ms to 194.7 ms without validation), so validation adds
no delay a user could notice. Most of a sign-up is password hashing (about
78 ms) and database work.

In class, validation added two to three seconds to signup. My number is
much lower. The only delays of that size I saw were on the first requests
after the server started, when the dev server was compiling, so in my app
the cost comes from cold starts, not from validating the data. I can't say
for certain what caused the class's number.

## Why a schema beats checking by hand in the route handler

Hand-written checks look simpler, a few `if` statements, but:
- **They're easy to miss.** Every field needs its own check, and nothing
  warns you when a new field has none. A schema lists every field it
  accepts, so a missing rule is visible.
- **They drift.** The form and the server each get their own copy of the
  rules, and over time they disagree. VetReply's form and server use the
  same schema.
- **They mix checking with cleaning.** Trimming and lowercasing end up
  scattered through the handler. In the schema, cleaning happens in one
  place, before anything else uses the data.
- **They leave the raw input in use.** Hand-written code often checks a
  value, then carries on using the original. With a schema, the rest of the
  code uses only the parsed result.

## Why I use the parsed data, not the raw input

In all four actions, the raw `formData` is only read to pass it into the
schema. After validation, everything uses `result.data`. For example, sign-up passes `result.data.name`,
`result.data.email`, `result.data.password` and
`result.data.membershipNumber` to Better Auth. The parsed data is the
cleaned version: the email trimmed and lowercased, the password trimmed. If
the raw input stayed available, a later line could use it by mistake and
skip the cleaning, or pass through a field the schema never checked.

## Trimming passwords but not lowercasing them

Passwords are trimmed on registration, login and reset
(`lib/validation/password.ts`, line 6, and `lib/validation/sign-in.ts`,
line 13), and never lowercased.

I trim passwords because copying a password often picks up a space at the
start or end, and the user can't see it, so their sign-in fails for a
reason they can't work out. I don't lowercase them, because capital letters
are part of the password the user chose, and lowercasing would both make it
weaker and stop them typing the exact password they remember.

## The limit

All of this runs in my server actions. A request sent straight to Better
Auth's own endpoint, `POST /api/auth/sign-up/email`, skips my server action
and its schema. That gap is closed in Part 7.