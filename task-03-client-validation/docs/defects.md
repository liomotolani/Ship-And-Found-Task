# Defects

Real defects in my own Task 3 code, with file, line and production cost.

---

## Defect 1: Better Auth's sign-up endpoint skips every sign-up rule

- **File and line:** `app/api/auth/[...all]/route.ts` (exposes all Better
  Auth endpoints, including sign-up), with my rules only in
  `server/actions/sign-up.ts`, lines 55 to 61.
- **What is wrong:** my sign-up rules run in the form and in my sign-up
  server action. A request sent straight to
  `POST /api/auth/sign-up/email` goes through neither. I sent one with a
  1-character name, no membership number and no terms acceptance, and the
  server returned `200 OK` and created a user named "a"
  (`evidence/16-direct-request-command-and-response.txt`).
- **Cost in production:** bots can create accounts with junk names, no
  membership number, and no record that the user agreed to the terms, while
  the form makes it look as if these are all required.
- **Status:** not fixed. Planned for Task 4 (see
  `client-side-is-not-security.md`).

---

## Defect 2: Membership number and terms are checked, then thrown away

- **File and line:** `server/actions/sign-up.ts`. Lines 55 to 61 validate
  `membershipNumber` and `terms`, but the call that creates the account,
  `auth.api.signUpEmail` (lines 73 to 81), only passes `name`, `email`,
  `password` and `callbackURL`.
- **What is wrong:** the form requires a membership number and terms
  acceptance, and the server checks they are there, but neither is saved
  with the user.
- **Cost in production:** VetReply can't link an account to its
  membership, and has no stored record that the user accepted the terms. If
  that acceptance were ever questioned, there would be nothing to show.
- **Status:** not fixed.

---

## Defect 3: Membership number accepts any text

- **File and line:** `components/SignUpForm.tsx`, lines 316 to 339 (the
  membership number input), and `lib/validation/sign-up.ts`, lines 22 to
  25.
- **What is wrong:** the input is `type="text"` with no digit filter and no
  `inputMode="numeric"`, and the only rule on the server is that it isn't
  empty. Letters, spaces and symbols are all accepted.
- **Cost in production:** invalid membership numbers get through, and
  users on phones get a full keyboard instead of a number pad.
- **Status:** not fixed.

---

## Defect 4: Sign-in checks email format while typing

- **File and line:** `components/SignInForm.tsx`, lines 65 to 66.
- **What is wrong:** after the user first leaves the email field, it is
  re-checked on every keystroke, the same as sign-up. My intended
  behaviour, written in `validation-rules.md`, is to check sign-in email
  format only on submit.
- **Cost in production:** a returning user who goes back to correct their
  email sees "Enter a valid email address." while they are still typing,
  which is the irritation the submit-only rule exists to avoid. The code
  and my documentation also disagree.
- **Status:** not fixed.

---

## Defect 5: Password hint appears on focus, not when typing starts

- **File and line:** `components/SignUpForm.tsx`, line 271
  (`onFocus={() => setShowPasswordHint(true)}`).
- **What is wrong:** the hint shows as soon as the password field gets
  focus, including when a user is only tabbing through the form, rather
  than once they start typing.
- **Cost in production:** small. The hint appears earlier than intended,
  adding text to the screen for users who are just moving through the
  form.
- **Status:** not fixed.