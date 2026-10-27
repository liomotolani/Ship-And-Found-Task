---
trigger: glob
globs: lib/validation/**, server/actions/**, app/**/*.tsx, components/**/*.tsx
---

# forms-and-validation.md

Job: control form fields, input validation and the words users see.

## Rules

1. Build each form with exactly the fields, types and required flags in PRD 6.6. Add or remove none.
   Reason: the tester checks forms against 6.6. An extra field is an unreviewed data collection.

2. Validate every input on the server with a Zod schema from lib/validation/. Validation in the browser may repeat it but never replaces it.
   Reason: browser checks can be bypassed (PRD 8.9).

3. Validate the fields used from every Stripe webhook payload with Zod too.
   Reason: PRD 8.9 includes webhook payloads in server-side validation.

4. Use the exact messages in PRD 6.7 and the exact empty states in PRD 6.8. Write no new user-facing wording.
   Reason: invented wording contradicts the PRD and may promise things the product does not do.

5. A failed validation changes nothing. Unexpected server errors show "Something went wrong. Nothing was changed. Try again."
   Reason: users must be able to trust that a failed form had no effect (PRD 6.7).

6. When a client email is entered on a staff form, require the confirmation field and reject a mismatch (FR-017).
   Reason: a mistyped email sends replies to, and links records for, a stranger.