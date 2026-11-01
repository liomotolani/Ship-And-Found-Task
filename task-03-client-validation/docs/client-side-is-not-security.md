# Client-side is not security

## The request I sent

I skipped the form completely and sent a sign-up request straight to the
Better Auth sign-up endpoint, which my app exposes through
`app/api/auth/[...all]/route.ts`. The body deliberately broke my rules:
a 1-character name, no membership number, and no terms acceptance.

```
curl -i -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"name":"a","email":"direct-test-1@example.com","password":"abcdefghijkl"}'
```

Full command and response: `evidence/16-direct-request-command-and-response.txt`

## What the server did with it

**The server accepted it.** It returned `200 OK` and created a user:

```
{"token":null,"user":{"name":"a","email":"direct-test-1@example.com",
"emailVerified":false,"image":null,
"createdAt":"2026-11-01T19:08:25.720Z","updatedAt":"2026-11-01T19:08:25.720Z",
"role":"CLIENT","isActive":true,"id":"FkmV6792NZIwt0uNXtPIRKangzKOFNT7"}}
```

- A user named **"a"** now exists, with an ID and a creation time.
- It has the role `CLIENT` and `isActive: true`.
- `emailVerified` is `false` and `token` is `null`, so no session was
  created: the account still needs its email confirmed before it can sign
  in (`requireEmailVerification: true`, `lib/auth.ts`, line 19). That
  limits what this account can do, but it doesn't stop it being created.

## Which of my client-side rules were enforced on that request

| Rule | Enforced on this request? |
|------|---------------------------|
| Full name is required | Not tested (a name was sent) |
| Full name, at least 2 characters | **No.** "a" was accepted |
| Full name, at most 100 characters | Not tested |
| Email is required | Not tested (an email was sent) |
| Email must be a valid format | Not tested (a valid email was sent) |
| Password is required | Not tested (a password was sent) |
| Password, at least 12 characters | Not tested. A 12-character password was sent, because Better Auth has its own 12-character minimum (`lib/auth.ts`, line 20) |
| Membership number is required | **No.** None was sent, and the user was still created |
| Terms must be accepted | **No.** No acceptance was sent, and the user was still created |

Every rule I broke on purpose was ignored.

## What this proves

My rules exist in two places: in the browser, in the sign-up form, and on
the server, in the sign-up server action (`server/actions/sign-up.ts`,
line 55, which runs `signUpSchema`). Both only apply to requests that come
through my form.

The Better Auth endpoint is a separate door to the same user table. A
request sent straight to it never touches my form or my server action, so
none of my rules run. The browser checks only help people who use the form
honestly. Anyone sending requests directly, like a bot, never sees them.

Client-side validation makes the form easier to use. It is not a security
control. Only rules enforced on the server, on every route that can create
a user, actually protect the data.

## What I'll do about it in Task 4

1. **Close the side door.** Make my sign-up server action the only way to
   create an account, by blocking or disabling direct calls to Better
   Auth's sign-up endpoint. Then there is one route that creates users,
   and it is the one that runs my rules.
2. **Enforce my rules on the server regardless.** Run the same
   `signUpSchema` on every route that can create a user, so that if
   another route is ever opened, the rules still apply there. The browser
   checks stay, but only to help honest users.
3. **Make the data itself require the important fields.** Check that the
   membership number and the terms acceptance are saved with the user, and
   that the server refuses to create a user without them, instead of
   relying on the form to send them.
4. **Prove it with the same request.** Send exactly the same `curl`
   command again and save the response next to this one, so the before and
   after can be compared side by side. The expected result after Task 4 is
   a refusal, with no new user created.
5. **Clean up.** Delete the test user "a" (ID
   `FkmV6792NZIwt0uNXtPIRKangzKOFNT7`) created by this test.