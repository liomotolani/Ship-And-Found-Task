---
trigger: always_on
---



# security.md

Job: keep application code safe against attack and data exposure.

## Rules

1. Treat every requirement in PRD 8.10 (SEC-001 to SEC-028) as part of every change that touches its area.
   Reason: the security requirements are only listed once, in the PRD. A change that ignores one reopens a hole the review closed.

2. Render all user-supplied text as plain text. Never pass it to `dangerouslySetInnerHTML`, a Markdown renderer or an HTML email body without escaping.
   Reason: client enquiries are untrusted. Rendering them as HTML lets a client run script in a staff member's browser (SEC-012).

3. Set the Content Security Policy required by SEC-013. Never loosen it to make an error go away. Stop and report the error instead.
   Reason: a loosened policy removes the second line of defence against injected script.

4. Show the "Not allowed" page (S-20) for every refused request. It must not reveal whether the record exists, its title or its owner.
   Reason: different refusal pages let an attacker discover which records exist (SEC-023).

5. Sign-up, sign-in and password reset messages must be identical whether or not the email has an account.
   Reason: different messages reveal who is a client of the practice (SEC-004).

6. Apply every rate limit in the PRD (sign-in, sign-up, reset, enquiries, bookings, AI calls). Never remove a limit to make a test pass.
   Reason: limits stop brute force, slot hoarding and runaway AI cost (SEC-002, SEC-020).

7. Never write passwords, tokens, API keys, card data or full client text to logs. Log record ids instead.
   Reason: logs are read by more people and tools than the database, and are rarely access-controlled (PRD 8.9, SEC-026).

8. Before asking to add a package, run `npm audit` on it in a scratch install and report known vulnerabilities in the request.
   Reason: SEC-025 requires a known-vulnerability check before any new package.

9. Never disable, silence or weaken a lint rule, type check, audit finding or security test to make a change pass. Stop and report it.
   Reason: a silenced check hides the problem it exists to catch.