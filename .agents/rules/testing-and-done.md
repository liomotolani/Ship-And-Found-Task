---
trigger: always_on
---

# testing-and-done.md

Job: control what is tested, how, and when work counts as done.

## Rules

1. Write a test for every acceptance criterion you implement, in the same change.
   Reason: acceptance criteria are how the PRD is checked. An untested criterion is unproven.

2. Put each test at the level PRD 8.9 sets: unit (Vitest), integration (Vitest with the local Docker database), end to end (Playwright), evaluation (script in tests/eval).
   Reason: retrieval filters, transactions and double booking can only be proven against a real database.

3. Never call real Gemini, Gmail or Stripe from unit, integration or end to end tests. Use the test doubles the services accept. Stripe webhook tests use recorded event payloads signed with a test secret.
   Reason: real calls cost money, send real email and make tests depend on the network.

4. Run the evaluation script against Gemini only after the human approves the run.
   Reason: each run makes paid model calls.

5. Role isolation tests cover every role and every flow, and must show 0 leaks before any slice is done (PRD 7.6).
   Reason: a single leak means restricted text can reach the wrong person.

6. Never skip, delete or weaken a test or an assertion to make a change pass. Stop and report the failure.
   Reason: a weakened test hides the defect it was written to catch.

7. When you believe a slice meets the definition of done in PRD 8.9, report the evidence and stop. Only the human marks a slice done.
   Reason: the definition includes using the deployed app, which only the human can do.