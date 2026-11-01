# Interview answers

Fourteen answers, 200 words maximum each, plus the extra question on user
enumeration.

---

## 1. Why is client-side validation not enough?

Because the browser belongs to the user, not to me. Anyone can turn off JavaScript, edit the page in developer tools, or skip the page entirely and send a request straight to the server with a tool like `curl`. None of that runs my client-side code.

I tested this in VetReply. My sign-up form requires a name of at least 2 characters, a membership number and terms acceptance. I sent a request straight to Better Auth's sign-up endpoint with the name "a", no membership number and no terms. The server returned `200 OK` and created the user.

Client-side validation is still worth having. It gives honest users instant feedback, so they fix mistakes before submitting. But it only applies to people who use the form the way I intended. Bots and attackers don't. The rules that protect the data have to be enforced on the server, on every route that can create or change it.

---

## 2. What security checks belong in the frontend, and what must the server enforce regardless?

The frontend should only do checks that make the form easier to use: required fields, length and format hints, showing errors next to the right field, and not sending obviously broken data. These are convenience. Nothing should rely on them.

The server must enforce everything that matters, whatever the frontend did: that required fields are present, lengths and formats, who is allowed to do what, authentication, rate limits, and anything to do with money or personal data.

In VetReply, my sign-up server action runs the same Zod schema as the form, which is the right idea. But my direct request showed a gap: Better Auth's own sign-up endpoint creates users without running that schema at all. So the rule is not just "validate on the server", but "validate on every server route that can reach the data". A check that exists on one route and not another is not enforced.

---

## 3. The user interface hides the delete button for non-administrators. Is that enough?

No. Hiding the button only changes what the page shows. The delete endpoint behind it still exists, and anyone who knows or guesses its URL can call it directly, from developer tools or `curl`, without ever seeing the button.

The server has to check, on every delete request, that the person making it is signed in and is an administrator, and refuse otherwise. Hiding the button is still good design, because ordinary users shouldn't be offered actions they can't take, but it is not access control.

It is the same lesson as my sign-up test. My form hid the problem: it wouldn't let anyone submit without a membership number or terms. But a request sent straight to the server bypassed the form, and the server created the account anyway. Whatever the interface hides or blocks, the server must enforce independently.

---

## 4. What is the difference between validation, encoding and sanitisation?

**Validation** checks whether input is acceptable, and rejects it if not. For example, VetReply rejects a full name shorter than 2 characters or an email without a valid format. It answers "should I accept this at all?"

**Encoding** changes how data is represented when it is output into a particular context, so it is treated as data rather than code. For example, turning `<` into `&lt;` when showing user text in HTML, so a name containing `<script>` is displayed as text instead of run. It answers "how do I output this safely here?"

**Sanitisation** changes the input itself, removing or altering parts of it. For example, VetReply trims spaces from names and emails and lowercases emails before saving them. It answers "how do I clean this?"

They are not interchangeable. Validation happens on the way in, encoding on the way out and depends on where the data is going (HTML, SQL, a URL). Sanitising input is not a substitute for encoding output, because the same data can be safe in one context and dangerous in another.

---

## 5. Why should you validate route parameters and query strings, not just the body?

Because they are input too, and the user controls them completely. Anyone can type a different value into the address bar, or change it in a request, and the server receives it exactly like a form field.

VetReply uses query strings in exactly this way. My auth page reads `?form=` to decide which form to show. `resolveForm` in `app/auth/page.tsx` only accepts `signup`, `signin` or `forgot`, and falls back to sign-in for anything else, so a made-up value can't break the page. My reset password page reads a `token` from the query string, and shows "This reset link is invalid or has expired." if it's missing or rejected.

If route parameters and query strings aren't validated, they can be used to reach records that belong to someone else, for example by changing an ID in the URL, or to inject values into queries or pages. Validating only the body leaves those doors open.

---

## 6. Explain what a single page application is, and how you make one discoverable by search engines.

A single page application loads once, then updates what's on screen without loading a whole new page from the server each time the user moves around. Navigation happens in the browser, using JavaScript.

VetReply uses this idea for authentication. Sign up, sign in and forgot password are one page at `/auth`, switched by `?form=signup`, `?form=signin` and `?form=forgot`, with Next.js `<Link>` so switching doesn't reload the page.

The search engine problem is that a pure single page application can send an almost empty HTML page and build the content with JavaScript, which crawlers may not run fully. The fixes are to render pages on the server so the HTML already contains the content, give each view its own URL, and set titles and meta tags per view.

VetReply does this through Next.js: pages are rendered on the server, and my auth page sets a different title for each form through `generateMetadata`. My home page has its own description, Open Graph tags and `index, follow`, while `/enquiries` is set to `noindex` because it's for signed-in users.

---

## 7. What are the advantages and disadvantages of a single page application against a multi-page application?

**Advantages of a single page application:** faster movement between views after the first load, because only the changed part updates; state can be kept as the user moves around; and it feels more like an app. In VetReply, switching between sign up, sign in and forgot password is instant, and there is one auth page to maintain instead of three.

**Disadvantages:** a heavier first load, because more code is sent up front; more work for search engines and for accessibility, since focus and page announcements have to be handled deliberately; and the browser's back button, deep links and errors need more care.

**Multi-page applications** are simpler: each URL is a separate page, search engines and screen readers handle them naturally, and one broken page doesn't affect the others. The cost is a full reload on every navigation.

The choice depends on the flow. I kept VetReply's reset password and confirm email pages separate, because they are reached from email links, not by switching from another form, so instant switching gives them nothing.

---

## 8. Can you explain the four principles of the Web Content Accessibility Guidelines, with examples from your own work?

WCAG's four principles are that content must be perceivable, operable, understandable and robust.

**Perceivable:** users must be able to perceive information whatever their senses. My VetReply form errors were red text only, which colour-blind users may not notice. I added a warning icon beside every error, so the meaning doesn't depend on colour.

**Operable:** everything must work by keyboard, with visible focus. All my sign-up fields and buttons are reachable by Tab, but the focus ring on the teal buttons was faint. I made it a 3px outline with a gap, so it's clear on every control.

**Understandable:** users must be able to understand the content and how to fix mistakes. My errors say exactly what's wrong, such as "Full name is required.", and appear next to the field. The terms checkbox now shows its error when you tab past it, not only on submit.

**Robust:** content must work with assistive technology. I added `required` and `aria-required="true"` to every field, and linked each error to its field with `aria-describedby`, so a screen reader announces both.

---

## 9. Discuss the importance of semantic HTML in the context of accessibility.

Semantic HTML means using the element that matches what something is: a `<button>` for a button, a `<label>` for a field's name, headings for headings. Assistive technology reads those elements to tell users what each thing is and how to use it, and the browser gives them keyboard behaviour for free.

In my VetReply sign-up form, every input has a `<label>` linked with `htmlFor`, so a screen reader announces "Full name" when the field gets focus. The submit control is a real `<button type="submit">`, so it's reachable by Tab and works with Enter. The terms checkbox is a real `<input type="checkbox">` inside its label, so clicking the text ticks it.

The alternative, building controls from `<div>` elements with click handlers, means rebuilding all of that by hand with ARIA and keyboard code, and it's easy to miss something.

ARIA adds what HTML can't express on its own. I used `aria-describedby` to link each error to its field, `aria-invalid` to mark a field with an error, and `aria-required`. But ARIA only works well on top of the right elements, not instead of them.

---

## 10. Tell me about a time when you disagreed with what a customer wanted to build.

I haven't yet had a customer disagreement on VetReply, which is still in development, so I'll describe how I would handle one, using decisions from this project.

I would start by understanding what the customer actually needs, because a feature request is usually a proposed solution to a problem. Then I would explain my concern in terms of its cost to them, not as a technical preference, and offer an alternative that meets the same need.

For example, in VetReply a membership number hint saying "Enter your 10 digit membership code" would help users, so a clinic might ask for it. I would explain that it also tells anyone looking at the form the exact shape of the number, which makes guessing easier, and suggest telling users where to find their number instead, such as asking the receptionist.

If they still wanted it after understanding the trade-off, I would record the decision and the risk in writing, then build it. It's their business and their decision. My job is to make sure they make it knowing the cost.

---

## 11. How would you explain to a non-technical executive why their AI implementation is not performing as expected?

I would start with what they care about, the outcome, not the technology: what it was supposed to do, what it is doing, and the cost of the gap.

Then I would explain the cause in plain terms, with one concrete example they can see, not a list of metrics. For an AI system like VetReply, which drafts replies from a practice's approved documents, the most likely causes are simple: the documents it relies on are missing, out of date or contradictory; it is being asked things the documents don't cover; or nobody measured what "good" looks like before launch, so "not performing" is a feeling rather than a number.

I would be honest about what is known and what is still a guess, and avoid blaming the model as if it were a mystery.

Then I would give options, each with its cost and time: fix the source documents, narrow what it's allowed to answer, add a human review step, or measure properly first. I'd recommend one, and say what result they should expect and by when, so they can judge whether it worked.

---

## 12. One of your validation rules wrongly blocks a category of legitimate user. Name the rule, name the users, and defend the trade-off or say you got it wrong.

The rule: VetReply requires a full name of at least 2 characters after trimming spaces (`lib/validation/sign-up.ts`, line 10).

It wrongly blocks anyone whose full name is a single character. Those people exist, and the form would tell them their real name is not good enough.

I accept that cost, because the alternative was worse. Without a minimum, a single character like "a" could be entered as a name, which has no meaning and messes up the records. And I deliberately chose 2 characters rather than the class's rule of two words, because many names are written as two characters, for example Chinese names, and a two-word rule would block them.

So the trade-off is: a very small group blocked, in exchange for catching meaningless one-character entries. If VetReply's users included people with one-character names, the right fix would be to remove the minimum and rely on other signals, rather than make real people fail a form.

The bigger issue is that this rule isn't enforced everywhere: my direct request to Better Auth created a user named "a".

---

## 13. You sent a request directly to your own endpoint. Say exactly what happened and what it tells you about the eight rules you spent two days writing.

I sent a `curl` request straight to `POST /api/auth/sign-up/email`, Better Auth's sign-up endpoint, skipping my form completely. The body had the name "a", a test email and a 12-character password, with no membership number and no terms acceptance.

The server returned `200 OK` and created a user: name "a", role `CLIENT`, `emailVerified: false`, with an ID and creation time. No session was created, because VetReply requires email confirmation, but the account exists.

Every rule I broke on purpose was ignored: name of at least 2 characters, membership number required, and terms accepted.

It tells me my rules protect the form, not the data. They run in the browser and in my sign-up server action, but Better Auth's endpoint is a separate route to the same user table, and none of my rules run on it.

The rules aren't wasted. They make the form clear and accessible for honest users. But they are not security. In Task 4, I'll make my server action the only route that creates users, enforce the same schema on the server, and send the same request again to prove it's refused.

---

## 14. Wrong-answer analysis

> "I use strong client-side validation with regex on every field, disable the submit button until everything is valid, and sanitise all inputs in the browser before sending them. That covers the main injection and bad-data risks."

**Useless as security:** all three run in the browser. An attacker skips the page and sends a request straight to the server, so none of it runs. My own test proved this: my form required a membership number and terms, but a direct request created a user without either.

**Actively misleading:** "sanitise all inputs in the browser". It gives the candidate confidence that injection is handled, when the server will accept whatever arrives. Disabling the submit button is the same: it looks like enforcement, but it only stops honest users.

**What they've confused:** convenience with security, and sanitising input with encoding output. Injection is prevented on the server, with parameterised queries and output encoding for the context the data is used in, not by cleaning strings in the browser.

**What they should do:** keep client-side checks for user experience, and enforce every rule on the server, on every route that can reach the data, with the server treating all input as untrusted.

---

## Extra: what is user enumeration, and how do error messages contribute to it?

User enumeration is when an attacker can find out which accounts exist on a system, usually by trying email addresses or usernames and watching how the system responds. A list of real accounts makes targeted attacks easier, such as password guessing or phishing that mentions the service by name.

Error messages are the most common leak. If sign-in says "No account with this email" for one address and "Wrong password" for another, the attacker knows the second address has an account. The same applies to sign-up ("This email is already registered") and to password reset ("We couldn't find that email").

VetReply avoids this on sign-up. If the email is already registered, the server action still returns "Check your email to confirm your account." (`server/actions/sign-up.ts`), the same message as a new sign-up, so the response doesn't reveal whether the account exists.

The same idea applies to hints about data. I removed the membership number hint "Enter your 10 digit membership code", because it gave away the exact shape of the number, which makes guessing easier.