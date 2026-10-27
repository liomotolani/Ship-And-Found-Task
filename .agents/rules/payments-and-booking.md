---
trigger: model_decision
description: Apply when working on fees, availability, slots, bookings, payments, refunds, membership or Stripe. Also Glob `server/payments/**`.
---

# payments-and-booking.md


Job: control money, membership and slot integrity.

## Rules

1. Use Stripe only through server/payments/, and only Checkout and the customer portal for collecting payment. Never collect or store card details.
   Reason: card data in the app brings payment-security duties Version 1 cannot meet.

2. Take every amount from the database: the consultation fee and the membership price. Never from the request.
   Reason: a client can edit any request (SEC-016).

3. Change payment, refund and membership status only in the webhook handler, after verifying the Stripe signature on the raw request body. The success page never confirms anything.
   Reason: only a signed event proves Stripe took the money (SEC-014, FR-036).

4. Insert each event id into stripe_event before processing it, and run the handler in one transaction. A duplicate insert returns 200 and changes nothing.
   Reason: Stripe can deliver the same event more than once (SEC-015).

5. Create a booking in this order: booking and payment rows in one transaction, then the Checkout session, then save its id. If Stripe fails, release the booking and expire the payment.
   Reason: the session needs the booking id, and a failed session must not hold a slot (PRD 8.6).

6. Set each Checkout session's expiry to the booking's hold time in PRD 8.6.
   Reason: the slot hold and the payment link must end together.

7. Before cancelling or releasing a Pending payment booking, call Stripe's expire endpoint for its session. If Stripe reports it completed, process the payment as paid.
   Reason: otherwise a client can pay for a cancelled or released booking (FR-037, FR-040, FR-041).

8. If a completed payment arrives for a booking that is not Pending payment, refund it in full automatically.
   Reason: money must never be kept for a booking that does not exist (FR-036).

9. Build each refund's idempotency key from the payment id and refund_attempts. Increase refund_attempts only on "Retry refund". Show a refund as done only after Stripe's refund event.
   Reason: double clicks must not refund twice, and failed refunds must be retryable (FR-043).

10. Follow the refund rules in FR-040 to FR-042 for who may cancel and when. Issue full refunds only.
    Reason: the refund rules are owner decisions (D12).

11. Rely on the partial unique index to stop two active bookings on one slot. Catch its violation and show the "slot has just been taken" message.
    Reason: only the database can stop two simultaneous bookings (PRD 9.5).

12. Block appointment length changes while any future booking is Pending payment or Confirmed (FR-008).
    Reason: different lengths create overlapping bookings the unique index cannot catch.

13. Allow one membership per client. Reuse the client's Stripe customer. Show "Join" and create a session only under the FR-046 rules. Cancel any second active subscription. Treat only the Stripe status active as a member.
    Reason: two checkouts would bill a client twice, and other statuses are not paid membership (FR-046, FR-049).