# Email copy

## Who wrote it

My coding agent wrote the wording of VetReply's verification email, not me.
The template is `server/email/templates/confirm-email-code.ts`. In a real
business, a developer or a marketer would write this, because the copy is
the marketing: for many clients, this email is the first thing VetReply
ever sends them, and it sets what they think of the product.

## The current wording

**Subject:** Confirm your email

```
Your {practice name} verification code is:

{code}

This code expires in 10 minutes.
If you did not create a VetReply account, you can ignore this email.
```

## What I would change before real customers see it

1. **The subject says nothing about who it's from.** "Confirm your email"
   could be from anyone, and that kind of vague subject is what people
   learn to ignore as spam. I'd name the practice: "Your code for
   {practice name}".

2. **It mixes two names.** The first line uses the practice's name, and
   the last line says "VetReply account". A pet owner signs up with their
   vet practice, and may never have heard of VetReply. I'd use the
   practice's name throughout, and mention VetReply at most in the footer.

3. **It doesn't say why the email arrived.** I'd add one line before the
   code: "You're signing up to {practice name}. Enter this code to confirm
   your email address."

4. **"You can ignore this email" is too casual for an email that someone
   didn't ask for.** If someone else used your address, you might want to
   know. I'd say: "If you didn't sign up, you can ignore this email. The
   account can't be used until this code is entered."

5. **There's no way to get help.** A client who is stuck has nowhere to
   go. I'd add the practice's contact details, or a line saying to reply to
   their practice, at the bottom.

6. **The 10 minutes has no time attached.** "Expires in 10 minutes" means
   nothing if the client opens the email 20 minutes later. I'd add what to
   do then: "If it has expired, sign in to get a new code."

I would keep the code on its own line and the email short. Its job is to
get the code in front of the client as fast as possible.