---
name: handle-stripe-event
description: Use when adding or changing the handling of any Stripe webhook event in VetReply.
---

# Handle a Stripe event

Add one Stripe event type to the single webhook handler and prove it is safe to receive twice.

## Steps

1. Find the event name in the Step 0 results for PRD 13.2. If the name is not confirmed there, stop and ask.
   Check: the event name is written down with its Step 0 confirmation.

2. Find the requirement that names this event (FR-036, FR-037, FR-043, FR-046 or FR-048). Write down the record it changes, the status change it makes (PRD 6.9) and any email it sends (PRD 6.10).
   Check: record, status change and email are each written down or marked "none".

3. Write a Zod schema for only the payload fields the handler reads. Follow forms-and-validation.md.
   Check: the schema lists no field the handler does not use.

4. Register the handler in the event map of the one webhook route. Follow payments-and-booking.md.
   Check: the route has one entry for this event name and no second webhook route exists.

5. Write the handler. Inside one transaction, record the event id first, then load the record by its Stripe id, check the current status allows the change from step 2, and apply it.
   Check: the handler returns without changes when the event id is already recorded.

6. Send the email from step 2, if any, through the send function. Follow email.md.
   Check: the email is triggered only after the status change is applied.

7. Save a recorded payload for the event. If no folder for test payloads exists, stop and ask where to put it.
   Check: the payload file exists and contains no live keys or real customer data.

8. Write four integration tests that sign the payload with the test secret: first delivery, the same event again, a bad signature, and a record in a status that does not allow the change.
   Check: four tests exist and pass. The replay test shows one change. The bad signature test returns 400 and changes nothing.