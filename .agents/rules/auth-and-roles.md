---
trigger: always_on
---

# auth-and-roles.md

Job: control sign-in, sessions, role checks and record ownership.

## Rules

1. Use Better Auth for sign-up, sign-in, sessions, email confirmation and password reset. Write no custom password or session code.
   Reason: custom auth code is where most account breaches start (SEC-001).

2. The first line of every server action and route handler calls `requireRole(allowedRoles)`. It reads the session on the server and rejects inactive users.
   Reason: server actions are the security boundary. Page redirects are a convenience only (PRD 8.3, SEC-006).

3. Encode the PRD 4.2 permissions matrix once, in config/. Every role check reads from it.
   Reason: one encoded matrix cannot drift from itself. Scattered checks can.

4. Decide roles, access levels and approval rights only from the session. Never from request parameters, form fields or model output.
   Reason: anything in a request can be forged.

5. Load client-owned records with the session's confirmed email in the query, never by id alone (PRD 8.4).
   Reason: changing an id in a request must never show another client's records (SEC-007).

6. Only clients sign up. Build no staff sign-up page. Staff accounts come only from the Practice Manager (FR-005). The first Practice Manager comes only from the setup script in scripts/, which refuses to run if one exists (FR-004).
   Reason: a staff sign-up path would let anyone grant themselves staff access.

7. Block sign-in until the email is confirmed. Deactivating a user ends all their sessions at once (FR-002, FR-006).
   Reason: ownership depends on confirmed email, and a deactivated user must lose access immediately.

8. Test every server action as every role, including signed-out.
   Reason: SEC-006 is proven only by calling each action as each role.