# Validation rules

Every rule below is in the code. Client-side checks run in the browser;
the same Zod schemas also run on the server in `server/actions/sign-up.ts`
(line 55) and `server/actions/sign-in.ts` (line 51).

## When validation runs

- **On leaving a field (blur):** each field is checked when the user leaves
  it (`lib/use-field-validation.ts`, `handleBlur`, lines 20 to 23). An empty
  field shows its "is required" error.
- **While typing, after the first blur:** once a field has been left once,
  it is re-checked on every change (`handleChange`, lines 25 to 29).
- **On submit:** the whole form is checked with `signUpSchema`, and focus
  moves to the first field with an error (`components/SignUpForm.tsx`).

---

## Category 1: Empty fields

| Field | Message | Where |
|-------|---------|-------|
| Full name | "Full name is required." | `lib/validation/sign-up.ts`, line 9 |
| Email | "Email is required." | line 18 |
| Password | "Password is required." | `lib/validation/password.ts`, line 9 |
| Membership number | "Membership number is required." | `lib/validation/sign-up.ts`, line 24 |
| Terms | "Please confirm that you have read and agree to the terms and conditions." | lines 26 to 31 |

Evidence: `evidence/05-empty-field-error.png`

---

## Category 2: Length and structure

### Rule: Full name, at least 2 characters
- **The rule:** after trimming spaces, the name must be at least 2
  characters (`lib/validation/sign-up.ts`, line 10).
- **What goes wrong without it:** a single character like "a" could be
  entered as a name, which has no meaning and messes up the records.
- **Which legitimate users it wrongly blocks:** anyone whose full name is a
  single character.
- **Accept the cost, or design around it:** designed around. I chose a
  minimum of 2 characters rather than requiring two words, because many
  names are written as two characters, for example Chinese names, and a
  two-word rule would block them.

### Rule: Full name, at most 100 characters
- **The rule:** the name must be under 100 characters (line 11), and the
  input stops typing at 100 (`maxLength={100}` in `SignUpForm.tsx`).
- **What goes wrong without it:** with no limit, people could misuse the
  field by entering huge amounts of text. A maximum sets a boundary.
- **Which legitimate users it wrongly blocks:** anyone whose full name is
  longer than 100 characters.
- **Accept the cost, or design around it:** accept. I don't expect real
  names to be that long, and 100 is generous.

### Rule: Password, at least 12 characters
- **The rule:** at least 12 characters (`lib/validation/password.ts`,
  line 10). Better Auth enforces the same minimum (`lib/auth.ts`, line 20).
- **Why 12:** I think 12 characters is long enough to be hard to guess.
- **What goes wrong without it:** short passwords are easy for attackers
  to guess, so accounts are easy to break into.
- **Which legitimate users it wrongly blocks:** people used to short
  passwords they can remember, and people typing on a phone, for whom 12
  characters is slower to enter.
- **Accept the cost, or design around it:** accept. The show-password
  toggle makes a long password easier to type correctly, and password
  managers can fill it in.

### Removed rule: Password complexity
The password used to need an uppercase letter, a lowercase letter, a
number and a special character. I removed these rules, because length
matters more than complexity. They blocked people who use long passphrases
made of ordinary words, and tend to push people towards predictable
patterns like "Password1!". The password now only needs to be at least 12
characters (`lib/validation/password.ts`, lines 5 to 11).

Evidence: `evidence/06-length-rule-blocking.png`

---

## Category 3: Format

### Rule: Email must be a valid format
- **The rule:** trimmed and lowercased, then checked as an email address,
  with the message "Enter a valid email address."
  (`lib/validation/sign-up.ts`, lines 13 to 19; `lib/validation/sign-in.ts`,
  lines 4 to 11).
- **What goes wrong without it:** a typo such as a missing @ means the
  confirmation link never arrives, so the user can't confirm their account
  or sign in.
- **Which legitimate users it wrongly blocks:** people with unusual but
  valid email addresses, for example addresses with non-Latin characters,
  which the format check may reject.
- **Accept the cost, or design around it:** accept. These addresses are
  rare, and catching common typos helps far more people.

### Real time on sign up, on submit on sign in
- **Sign up:** once the user has left the email field, it is re-checked
  on every keystroke. Evidence: `evidence/07-email-realtime-signup.png`
- **Sign in:** the email format is checked only when the form is
  submitted. Evidence: `evidence/08-email-on-submit-login.png`
- **Why the difference:** on sign up, VetReply is collecting the email for
  the first time, and a mistake means the confirmation link never arrives,
  so it's worth flagging problems as early as possible. On sign in, the
  user already knows their email, so flagging it as wrong while they're
  still typing is just irritating, and checking on submit is enough.

### Why VetReply doesn't check whether an email exists
Even if VetReply could confirm that an email address exists, that would
not show the address belongs to the person signing up, because they
could have mistyped it or entered someone else's. The confirmation link
proves both at once: if the user can open a link sent to that address
within an hour, the address exists and they have access to it.

---

## Password hint and visibility
- **Hint:** "Use at least 12 characters." (`lib/validation/password.ts`,
  line 3). It appears when the password field gets focus and hides when
  the user leaves it (`components/SignUpForm.tsx`, lines 271 to 273).
- **Confirm field or visibility toggle:** a show-password toggle.
- **Why:** it lets users check what they typed without typing it twice. A
  confirm field would be better in a stricter industry such as banking,
  because a toggle shows the password on screen, where someone nearby
  could see it, and a confirm field never does.

---

## The submit button

A hidden button looks tidier, but users expect to see how a form ends, and
with no button on screen they can't tell whether the form is broken, still
loading or waiting on them, and a screen reader user tabbing through finds
no submit control at all. A visible disabled button shows where the form
is going and that something is still missing, and when it's clicked
without the terms ticked, VetReply shows the terms error and moves focus
to the checkbox, so the user knows exactly what to fix.

Evidence: `evidence/13-button-hidden-version.png`,
`evidence/14-button-disabled-version.png`