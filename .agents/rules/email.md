---
trigger: model_decision
description: Apply when working on any email, reply sending or retry. Also Glob `server/email/**`.
---

# email.md


Job: control how every email is built, addressed, sent and recorded.

## Rules

1. Send every email through the one send function in server/email/, using Nodemailer with Gmail. No other code sends email.
   Reason: one path means one place for logging, failure handling and tests (PRD 8.5).

2. Write an email_log row for every attempt, with type, recipient, related record and result.
   Reason: failed sends must be visible to the Practice Manager for retry (FR-029).

3. Take every recipient from a stored record: the enquiry, booking or user. Never from request input at send time.
   Reason: a request-supplied recipient turns the app into a spam relay (SEC-019).

4. Send a client reply only after its approval is stored, inside the guarded send action.
   Reason: nothing reaches a client without staff approval.

5. A retry sends the stored approved text again. It never regenerates or edits it.
   Reason: the client must receive exactly what staff approved (FR-029).

6. Keep one template per email type, E1 to E8, in server/email/. Add a new type as a new template. Never change the send function to add one.
   Reason: the send function stays closed to change while email types grow (PRD 8.9).

7. Use plain text emails. Escape all client text placed in a template.
   Reason: client text is untrusted, and PRD 8.5 specifies plain templates.

8. When Gmail rejects a message, mark the related record failed and stop. Never retry automatically.
   Reason: automatic retries can breach Gmail's sending limit and send duplicates.

9. Send real email only to the test inbox address the human gives. All tests use a test double.
   Reason: real addresses in tests send messages to real people.