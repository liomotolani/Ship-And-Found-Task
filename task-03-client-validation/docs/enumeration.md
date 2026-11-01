# Enumeration

## The field, and why its shape is sensitive

**Field:** Membership number, on the sign-up form (`/auth?form=signup`).

**The hint I removed:** "Enter your 10 digit membership code"

That hint told anyone looking at the form the exact shape of the
membership number: 10 digits. The membership number identifies a member,
so its format is information about the account that the form does not
need to give away.

## What an attacker gains from knowing the shape

- **A smaller search.** Knowing it is exactly 10 digits means an attacker
  only tries 10-digit numbers (10,000,000,000 possibilities) and doesn't
  have to work out the length or whether letters are allowed.
- **A way to check guesses.** Knowing the format lets an attacker generate
  only valid-looking numbers, so every guess they send is a realistic one.

## The trade-off

Removing the hint makes the form harder for legitimate users, because the form no longer tells them what a membership number looks like.

- **How much harder:** If you don't have your membership number, you can check with the receptionist
- **Is it worth it:** It's worth it because the trade-off is minimal and the security benefit is significant.