# Single page rationale

## Before
Sign up, sign in and forgot password were three separate pages, each with
its own route:

```
/sign-up
/sign-in
/forgot-password
```

The full page list before the change was seven pages
(`evidence/01-page-count-before.txt`).

What switching between them was like for the user: [TO FILL]

## After
The three forms are one page, `app/auth/page.tsx`, at a single route. A query parameter decides which form is shown:

```
/auth?form=signup
/auth?form=signin
/auth?form=forgot
```

- `resolveForm()` (lines 16 to 22) reads the parameter. If it's missing or
  not one of the three values, the page shows the sign-in form.
- The page renders only the active form (lines 77 to 79).
- The page title changes with the form, through `generateMetadata()`
  (lines 36 to 44): "Sign up", "Sign in" or "Forgot password".
- The links between the forms use Next.js `<Link>`
  (`SignInForm.tsx` lines 83 and 86, `SignUpForm.tsx` line 199,
  `ForgotPasswordForm.tsx` line 62), so switching forms is a client-side
  navigation, not a full page reload.
- The old routes still exist, but only to redirect: `/sign-in`, `/sign-up`
  and `/forgot-password` each send the user to the matching
  `/auth?form=...`, so old links and bookmarks still work.

Evidence:
- `evidence/02-page-count-after.txt`: the page list after the change
- `evidence/03-url-states.png`: the same `/auth` route with each of the
  three parameters
- `evidence/04-form-switch-logs.txt`: the server log while switching

## What the server log shows

```
GET /auth?form=signup 200 in 1413ms
GET /auth?form=signin 200 in 121ms
GET /auth?form=forgot 200 in 73ms
```

The browser does not reload the page when switching, but the server still
receives one request per switch. That is because `app/auth/page.tsx` is a
server component: it reads the `form` parameter and, for sign up and sign
in, looks up the current session (lines 50 to 58) so a signed-in user is
redirected instead of seeing the form. Looking up the session reads it; it
does not create a new one. The first request took 1413 ms because the page
was being compiled; the next two took 121 ms and 73 ms.

## Why instant form switching matters
- A user who opens sign in but needs to sign up, or who has forgotten
  their password, gets the other form straight away, without a full page
  load.
- The URL still says which form is open, so it can be linked to directly,
  bookmarked, and the browser's back button returns to the previous form.
- There is one auth page to maintain instead of three.

[TO FILL: anything specific to VetReply's users]

## One case where separate pages are the better choice
`/reset-password` and `/confirm-email` stayed as separate pages.

Both are opened from a link in an email, not by switching from another form:
- `/reset-password` needs a `token` from the email link (`app/reset-password/page.tsx`,
  lines 10 and 16). Without a valid token it shows "This reset link is
  invalid or has expired." instead of the form.
- `/confirm-email` shows the result of confirming an email address, based
  on an `error` parameter from the link (`app/confirm-email/page.tsx`,
  lines 13 and 19).

Nobody switches to these from sign in or sign up, so the benefit of
instant switching doesn't apply. Each page does one job and is reached from
one link, so a separate page is simpler here.