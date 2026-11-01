# Task 3: Client-side validation

## What this task was
Build VetReply's sign-up form so it collects correct data and works for
someone who can't see colour or use a mouse, then prove that the browser's
checks are a convenience, not security, by sending a request straight to
the server.

## What I built
- **One auth page.** Sign up, sign in and forgot password are one page at
  `/auth`, switched by `?form=signup`, `?form=signin` and `?form=forgot`
  (`app/auth/page.tsx`). The old routes redirect there. Reset password and
  confirm email stay as separate pages, because they are opened from email
  links. See `docs/spa-rationale.md`.
- **A sign-up form** with Full name, Email, Password, Membership number and
  terms acceptance.
- **Client-side validation in four categories:** empty-field errors when a
  field is left, length rules, email format, and accessible errors. The
  same Zod schemas also run in my sign-up server action. See
  `docs/validation-rules.md`.
- **A text input for the membership number,** instead of a number input,
  which showed a default 0 and turned 400 into 0400.
- **Accessibility fixes** from my audit: a warning icon beside every error,
  the terms error showing from the keyboard, every field marked as required
  to assistive technology, and a clear focus ring. See
  `docs/accessibility-audit.md`.
- **A submit button that stays visible** and is marked as disabled
  (`aria-disabled`, dimmed, "not-allowed" cursor) until the form is valid.
  If it's clicked without the terms ticked, it shows the terms error and
  moves focus to the checkbox.

## Key decisions
- **Full name: at least 2 characters, not two words.** Many names are
  written as two characters, for example Chinese names, and a two-word rule
  would block them.
- **Password: length only, at least 12 characters.** I removed the
  uppercase, lowercase, number and special character rules, because length
  matters more than complexity and those rules blocked long passphrases.
- **Show-password toggle rather than a confirm field,** so users can check
  what they typed without typing it twice.
- **Removed the membership number hint** "Enter your 10 digit membership
  code", because it gave away the exact shape of the number. Users who
  don't have their number can check with the receptionist. See
  `docs/enumeration.md`.
- **Sign-up doesn't reveal whether an email is already registered.** It
  shows the same "Check your email to confirm your account." message
  either way.

## The direct request
I sent a request straight to Better Auth's sign-up endpoint,
`POST /api/auth/sign-up/email`, with the name "a", no membership number
and no terms acceptance. **The server returned `200 OK` and created the
user.** None of the rules I broke ran, because they live in my form and my
sign-up server action, and this endpoint skips both. See
`docs/client-side-is-not-security.md` and
`evidence/16-direct-request-command-and-response.txt`.

## What I got wrong
- **My rules don't protect the data.** The direct request created a user
  that breaks three of them.
- **The membership number and terms are validated, then thrown away.** The
  server checks they're present, but doesn't save either with the user.
- **I first added password complexity rules,** then removed them.
- **I removed the sign-up button by mistake** (commit `8d0f41f`), and rolled
  back to the commit before it with
  `git reset --hard dddb7fc24fbfd49d0e4d3e076cdd5ef27f3b723f`. See
  `evidence/17-commit-list-and-rollback.txt`.

All five defects, with file and line, are in `docs/defects.md`.

## Not finished yet
- Writing the screen reader transcripts, before and after, in
  `docs/accessibility-audit.md`, from the two recordings.
- Recording the form attack results in
  `evidence/15-form-attack-results.txt`.
- Writing `docs/rollback.md`.
- Adding where the terms wording came from to `docs/terms-note.md`.
- Adding rows for the membership number and terms to
  `docs/field-justification.md`.
- Changing sign-in to check email format only on submit, and re-taking
  `evidence/08-email-on-submit-login.png`.

## Evidence

| File | What it shows |
|------|---------------|
| 01-page-count-before.txt | Pages before collapsing the auth forms |
| 02-page-count-after.txt | Pages after collapsing them |
| 03-url-states.png | The same `/auth` route with each `?form=` value |
| 04-form-switch-logs.txt | Server log while switching between forms |
| 05-empty-field-error.png | Empty-field error after leaving a field |
| 06-length-rule-blocking.png | A length rule blocking input |
| 07-email-realtime-signup.png | Email format checked while typing on sign up |
| 08-email-on-submit-login.png | Email format on sign in |
| 09-number-input-annoying.png | The number input showing 0 and 0400 |
| 10-text-input-working.png | The text input version of the membership number |
| 11-screenreader-before.mp3 | Screen reader recording before the accessibility fixes |
| 12-screenreader-after.mp3 | Screen reader recording after the fixes |
| 13-button-hidden-version.png | Submit button hidden until the form is valid |
| 14-button-disabled-version.png | Submit button visible but disabled |
| 16-direct-request-command-and-response.txt | The direct request and the server's 200 response |
| 17-commit-list-and-rollback.txt | Commit list, chosen commit and rollback command |

## Docs
- `docs/spa-rationale.md`
- `docs/field-justification.md`
- `docs/validation-rules.md`
- `docs/terms-note.md`
- `docs/enumeration.md`
- `docs/accessibility-audit.md`
- `docs/client-side-is-not-security.md`
- `docs/rollback.md`
- `docs/defects.md`
- `docs/interview-answers.md`