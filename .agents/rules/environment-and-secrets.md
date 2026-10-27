---
trigger: always_on
---

# environment-and-secrets.md

Job: control configuration, environment files and secrets.

## Rules

1. Use only the environment variable names in PRD 8.7. If a new one seems needed, stop and ask.
   Reason: the human sets these values in Vercel and locally. An unknown name has no value and fails in production.

2. Keep a committed `.env.example` that lists every name from PRD 8.7 with no values. Never commit any other `.env` file. Make sure `.gitignore` excludes them.
   Reason: the example tells the human what to set. A committed real file leaks every key at once.

3. Read secrets only in server code. Never prefix a secret with `NEXT_PUBLIC_` and never pass one to a client component.
   Reason: anything public is shipped to every browser (SEC-018, SEC-027).

4. Validate all environment variables with Zod at server start. A missing or malformed value stops the app with a message naming the variable, never its value.
   Reason: failing at start is clearer than failing on the first payment or email.

5. Local environment files point only at the local Docker database and Stripe test keys. If any key starts with `sk_live_` or `rk_live_`, or any database address is not local, stop and tell the human.
   Reason: Version 1 runs in Stripe test mode only, and the agent never touches production.

6. Never create external service accounts, API keys or billing settings (Google Cloud, Gmail, Stripe, Neon, Vercel). Test users in the development database are allowed.
   Reason: PRD 7.10 gives these tasks to the human. They involve payment details and legal terms.

7. Never print a secret value in a response, log, test, snapshot or error message. Refer to it by name.
   Reason: chat transcripts and test output are not secret stores.