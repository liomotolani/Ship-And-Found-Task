---
name: build-a-requirement
description: Use when implementing or changing any functional requirement (FR-001 to FR-050) from the VetReply PRD.
---

# Build a requirement

Build one functional requirement, from PRD text to tested code, through every layer in order.

## Steps

1. Read the requirement in docs/vetreply-prd-v2.md section 6. Write down its ID, roles and every acceptance criterion.
   Check: you can list each acceptance criterion by number.

2. Find everything the requirement names elsewhere in the PRD: its rows in the 4.2 permissions matrix, and any screen (6.5), form (6.6), message (6.7), empty state (6.8), status change (6.9) or email (6.10).
   Check: each item has a PRD section reference beside it.

3. List anything the requirement needs that the PRD does not state. If the list is not empty, stop and ask the human. Do not continue until it is answered.
   Check: the list is empty, or the human has answered every item.

4. If the requirement makes a model call, use the add-ai-flow skill for that part. If it handles a Stripe event, use the handle-stripe-event skill for that part.
   Check: every model call and Stripe event in the requirement is assigned to the matching skill.

5. Write one failing test for each acceptance criterion, at the level testing-and-done.md sets. Name each test with the requirement ID and criterion number.
   Check: running the tests shows one failure per criterion.

6. Write the Zod schema for every input. Follow forms-and-validation.md.
   Check: each input field from step 2 has a schema field.

7. Write the data functions the requirement needs. Follow database.md.
   Check: every new database call sits in server/data/.

8. Write the service function that applies the business rule. Follow clean-code.md and database.md.
   Check: the service has no Prisma import and no HTTP handling.

9. Write the server action or route handler. Follow auth-and-roles.md. Validate input with the schema from step 6, then call the service from step 8.
   Check: the first line calls `requireRole` with the roles from the 4.2 matrix rows found in step 2.

10. Build the screen or change it. Follow styling-and-tokens.md and accessibility.md.
    Check: the screen matches its row in PRD 6.5, and every field matches 6.6.

11. Run the unit, integration and end to end tests, the axe scan, the linter and the type checker.
    Check: every test from step 5 passes, the scan shows zero violations, and lint and type checks show zero errors.

12. Report to the human: the requirement ID, each acceptance criterion with the test that proves it, the files changed, and your assumptions.
    Check: every acceptance criterion from step 1 appears in the report with a test name.