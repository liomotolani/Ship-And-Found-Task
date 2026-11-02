# Schema

VetReply's schema lives in `prisma/schema.prisma`. This document covers six
of its tables, chosen to include everything the brief requires: the people
who use the system, their sessions, a money table, a separate money-attempts
table, and the chunks for retrieval.

| Table | What it holds |
|-------|---------------|
| `User` | Everyone who signs in: clients, receptionists, vets and practice managers |
| `Session` | Each signed-in session |
| `Booking` | An appointment with a vet |
| `Payment` | The successful payment record for a booking |
| `PaymentAttempt` | **New.** Every attempt to pay, including ones that failed, were abandoned or dropped on a bad network |
| `Chunk` | Pieces of practice documents, with their embeddings, for retrieval |

## How they relate

```
User 1 ──── * Session          (a user can have many sessions)
User 1 ──── * Booking          (as the vet; also as creator and canceller)
Booking 1 ── 0..1 Payment      (one to one: a booking has at most one payment)
Booking 1 ── * PaymentAttempt  (a booking can have many attempts)
Payment 0..1 ── * PaymentAttempt  (an attempt may or may not be linked to a payment)
Document 1 ── * Chunk          (Document is outside these six; it is created by a User)
```

Every relationship here is one to many, except `Booking` to `Payment`,
which is one to one: `Payment.bookingId` is unique, so a booking can have at
most one payment. VetReply's schema also has a many to many outside these
six tables: `ReplySource` is a join table that links many `Reply` rows to
many `Chunk` rows, recording which chunks each reply was drafted from.

---

## User

| Column | Type | Can be empty? |
|--------|------|---------------|
| id | String | No (primary key) |
| name | String | No |
| email | String | No (unique) |
| emailVerified | Boolean | No (default false) |
| role | Role: CLIENT, RECEPTIONIST, VET, PRACTICE_MANAGER | No (default CLIENT) |
| isActive | Boolean | No (default true) |
| image | String | Yes |
| createdAt | DateTime | No |
| updatedAt | DateTime | No |

**Relationships:** one User to many Sessions, many Bookings (as vet, as
creator, as canceller), many Documents (as creator), and at most one
Membership.

**Indexes:**

| Index | Why this column | Cost on writes |
|-------|-----------------|----------------|
| `email` (unique) | Every sign-in looks a user up by email, and two accounts must never share one | Every insert, and every email change, must also update the index and check for duplicates |

---

## Session

| Column | Type | Can be empty? |
|--------|------|---------------|
| id | String | No (primary key) |
| token | String | No (unique) |
| userId | String | No (references User) |
| expiresAt | DateTime | No |
| ipAddress | String | Yes |
| userAgent | String | Yes |
| createdAt | DateTime | No |
| updatedAt | DateTime | No |

**Relationships:** many Sessions to one User. Deleting a user deletes their
sessions (`onDelete: Cascade`).

**Indexes:**

| Index | Why this column | Cost on writes |
|-------|-----------------|----------------|
| `token` (unique) | Every request from a signed-in user looks its session up by token | Every sign-in inserts into the index. Sessions are created often, so this is the busiest index on this table |
| `userId` | Signing a user out everywhere, or listing their sessions, finds all sessions for one user | One extra index update per sign-in and sign-out |

---

## Booking

| Column | Type | Can be empty? |
|--------|------|---------------|
| id | String | No (primary key) |
| vetId | String | No (references User) |
| startsAt | DateTime | No |
| clientName | String | No |
| clientEmail | String | No |
| reason | String | Yes |
| asMember | Boolean | No (default false) |
| status | BookingStatus | No |
| holdExpiresAt | DateTime | Yes |
| createdById | String | Yes (references User) |
| cancelledById | String | Yes (references User) |
| cancelReason | String | Yes |
| refundDecision | RefundDecision | Yes |
| createdAt | DateTime | No |
| updatedAt | DateTime | No |

**Relationships:** many Bookings to one User (the vet); optionally to one
User who created it and one who cancelled it. One Booking to at most one
Payment, and to many PaymentAttempts.

**Indexes:**

| Index | Why this column | Cost on writes |
|-------|-----------------|----------------|
| `(vetId, startsAt)` | Showing a vet's diary, or checking a slot is free, filters by vet and then by time. Vet first, because every diary query starts with one vet | Every booking created or moved updates this index |
| `clientEmail` | Finding all bookings for a client who books by email | One extra index update per booking |

---

## Payment

| Column | Type | Can be empty? |
|--------|------|---------------|
| id | String | No (primary key) |
| bookingId | String | No (unique, references Booking) |
| feeId | String | No (references Fee) |
| amountPence | Int | No |
| status | PaymentStatus: PENDING, PAID, EXPIRED, REFUND_PENDING, REFUNDED, REFUND_FAILED | No (default PENDING) |
| stripeCheckoutSessionId | String | Yes (unique) |
| stripePaymentIntentId | String | Yes (unique) |
| stripeRefundId | String | Yes (unique) |
| refundAttempts | Int | No (default 0) |
| paidAt | DateTime | Yes |
| refundedAt | DateTime | Yes |
| createdAt | DateTime | No |
| updatedAt | DateTime | No |

**Relationships:** one to one with Booking. Many Payments to one Fee (the
price being paid). One Payment to many PaymentAttempts.

**Indexes:**

| Index | Why this column | Cost on writes |
|-------|-----------------|----------------|
| `bookingId` (unique) | A booking is paid for once, and the database enforces that | One index update per payment |
| `stripeCheckoutSessionId` (unique) | When Stripe reports a result, the payment is found by its Stripe session ID | Updated when the checkout session is created |
| `stripePaymentIntentId` (unique) | Same, for Stripe's payment intent | Updated when the intent is recorded |
| `stripeRefundId` (unique) | Matching Stripe's refund events to the payment | Updated when a refund is made |

---

## PaymentAttempt (new)

```prisma
model PaymentAttempt {
  id                      String         @id @default(cuid())
  bookingId               String
  booking                 Booking        @relation(fields: [bookingId], references: [id])
  paymentId               String?
  payment                 Payment?       @relation(fields: [paymentId], references: [id])
  amountPence             Int
  outcome                 AttemptOutcome @default(STARTED)
  failureReason           String?
  stripeCheckoutSessionId String?
  stripePaymentIntentId   String?
  startedAt               DateTime       @default(now())
  endedAt                 DateTime?

  @@index([bookingId])
  @@index([outcome, startedAt])
}

enum AttemptOutcome {
  STARTED
  SUCCEEDED
  FAILED
  ABANDONED
  NETWORK_ERROR
}
```

Add the back-references too: `attempts PaymentAttempt[]` on both `Booking`
and `Payment`.

| Column | Type | Can be empty? |
|--------|------|---------------|
| id | String | No (primary key) |
| bookingId | String | No (references Booking) |
| paymentId | String | Yes (references Payment; empty if no payment was ever recorded) |
| amountPence | Int | No |
| outcome | AttemptOutcome: STARTED, SUCCEEDED, FAILED, ABANDONED, NETWORK_ERROR | No (default STARTED) |
| failureReason | String | Yes |
| stripeCheckoutSessionId | String | Yes |
| stripePaymentIntentId | String | Yes |
| startedAt | DateTime | No |
| endedAt | DateTime | Yes (empty while still in progress, or if it never finished) |

**Relationships:** many PaymentAttempts to one Booking; many to at most one
Payment.

**Indexes:**

| Index | Why this column | Cost on writes |
|-------|-----------------|----------------|
| `bookingId` | Seeing every attempt for one booking, for example when a client says they were charged twice | One index update per attempt |
| `(outcome, startedAt)` | Drop-off reports, such as "all abandoned attempts last month", filter by outcome and then by date | One index update per attempt, and another each time the outcome changes |

The Stripe IDs are **not** unique here, unlike in `Payment`, because one
checkout session can be retried more than once.

### Why this table exists

`Payment` only shows the outcome that stuck. It can't show a client who
tried three times, failed twice on a bad network, then gave up. This table
records every attempt, for two reasons:
1. **Drop-off data:** it shows the business where it loses people, such as
   how many clients start paying for a booking and never finish.
2. **The record of what happened:** payment logs are what the practice
   relies on in a dispute, a government inquiry or its annual tax return.
   A record of what was attempted, as well as what succeeded, is what lets
   it answer questions later.

### If HMRC asked about a transaction from 14 months ago

I would start from the booking or the amount and date HMRC gave, find the
`Payment` row, and pull every `PaymentAttempt` for the same booking, so I
could show exactly what was attempted and when, what failed and why, and
which attempt succeeded. I would match the Stripe IDs on those rows against
Stripe's own records, check any refund through `refundedAt` and
`stripeRefundId`, and give HMRC the booking, the amount in pence, the
timestamps and the Stripe references. For that to work, an attempt must
never be edited or deleted once it has finished, and these rows must be
kept for as long as UK tax records have to be kept.

---

## Chunk

| Column | Type | Can be empty? |
|--------|------|---------------|
| id | String | No (primary key) |
| documentId | String | No (references Document) |
| version | Int | No |
| position | Int | No |
| content | String | No |
| embedding | vector(1536) | Yes (empty until it has been embedded) |
| createdAt | DateTime | No |

**Relationships:** many Chunks to one Document. Deleting a document deletes
its chunks (`onDelete: Cascade`). Chunks are also linked to Replies through
`ReplySource`, a many to many.

**Indexes:**

| Index | Why this column | Cost on writes |
|-------|-----------------|----------------|
| `(documentId, version)` | Retrieval and re-indexing work on one version of one document at a time | Every chunk inserted updates this index. A document can produce many chunks at once, so re-indexing a long document is the heaviest write |

There is no index on `embedding` yet. A vector index would make similarity
search faster, but it is expensive to build and update, so it isn't worth
it until there are enough chunks for search to be slow.

---

## Where the same fact is stored twice

- **`Booking.clientName` and `Booking.clientEmail`** can repeat what's on a
  client's `User` row. I accepted this because people can book without an
  account, and a booking should still show who it was for even if the user
  later changes their details.
- **`Payment.amountPence`** repeats the price on the `Fee` it points to. I
  accepted this because fees change over time, and a payment must record
  what was actually charged, not today's price.
- **`PaymentAttempt.amountPence` and its Stripe IDs** repeat what ends up on
  `Payment`. I accepted this because an attempt has to be recorded even
  when no payment ever succeeds.