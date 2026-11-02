# Hashing

## The algorithm

VetReply hashes passwords with **Argon2id**, using the `@node-rs/argon2`
library (`lib/password.ts`). Better Auth is configured to use it for every
password it stores and checks (`lib/auth.ts`, lines 22 to 24).

| Setting | Value | What it means |
|---------|-------|---------------|
| Memory (`m`) | 65,536 KB (64 MB) | Memory each hash must use |
| Passes (`t`) | 3 | Times the algorithm works through that memory |
| Threads (`p`) | 1 | Parallel lanes |
| Output | 32 bytes | Length of the final hash |

Not SHA-256, SHA-512 or MD5. Those are built to be fast, which is exactly
what an attacker wants.

---

## The same password, hashed twice

`evidence/07-hash-twice-different.txt`, using VetReply's own `hashPassword`:

```
Hash 1: $argon2id$v=19$m=65536,t=3,p=1$2abBXaMv/7hD+vVJoRFdDA$IY6q7LdZv9jZVK4TR1BMzb6yYVWvYKclHAB1VJZ5dxw
Hash 2: $argon2id$v=19$m=65536,t=3,p=1$uoleJkY2L/heLt9YKwJLjw$twCIxMd/o6dF9jdgL/wukntzqXDsbA2Z9D/9btQ4DDA

Same hash?            false
Hash 1 verifies:      true
Hash 2 verifies:      true
Wrong password works? false
```

**Why they differ:** Argon2id generates a new random salt for every hash and
stores it inside the hash, so verifying reads the salt back and recomputes
the hash from the password.

---

## Timing, on my machine

`evidence/08-timing-argon-vs-sha.txt`, run on a Mac (Apple silicon, Node
v26.11.1), using the same password for both:

| Algorithm | Time per hash |
|-----------|---------------|
| Argon2id (m=65536, t=3, p=1), average of 20 hashes | **78.46 ms** |
| SHA-256, average of 1,000,000 hashes | **0.000493 ms** |

## Guesses per second for an attacker

An attacker who has stolen the user table tries a guess by hashing it and
comparing. The number of guesses per second is 1,000 ms divided by the time
for one hash:

```
Argon2id: 1000 / 78.46    = 12.7 guesses per second
SHA-256:  1000 / 0.000493 = 2,028,890 guesses per second

SHA-256 gives an attacker 159,188 times more guesses per second
(2,028,890 divided by 12.745, the unrounded Argon2id figure)
```

To make that concrete: trying a list of **1 million common passwords**
against one user's stolen hash would take:

```
Argon2id: 1,000,000 x 78.46 ms    = 78,460 seconds, about 21.8 hours
SHA-256:  1,000,000 x 0.000493 ms = 493 ms, about half a second
```

And because every user has their own salt, the attacker has to repeat that
for every user separately.

These numbers are for **one core of my laptop**. A real attacker uses
graphics cards, which can run SHA-256 billions of times a second. Argon2id's
64 MB of memory per hash is designed to make that hardware far less
effective, because each guess needs its own 64 MB. So the real gap is much
bigger than my numbers show.

---

## The inversion

I hash a password once each time someone signs in, so 78 milliseconds is a
delay nobody notices. An attacker with a stolen user table has to hash
every guess, millions or billions of times. Slowing the hash down costs me
almost nothing and costs them everything: the same 78 milliseconds that a
user never notices turns a half-second attack into most of a day, for every
user.

---

## Salting

**What it does:** a salt is a random value added to the password before
hashing, different for every hash. Two users with the same password get
completely different hashes.

**Does Argon2id handle it for me?** Yes. `@node-rs/argon2` generates a random
salt for every hash and stores it in the hash string itself, between the
settings and the result (`...$2abBXaMv/7hD+vVJoRFdDA$...`). I don't create,
store or manage salts myself.

**What an attacker could do if I skipped it:**
- **See who shares a password:** identical passwords would give identical
  hashes, so cracking one cracks every user with the same password.
- **Use precomputed tables:** an attacker could hash a list of common
  passwords once, in advance, and look up every stolen hash instantly,
  instead of attacking each user separately.
- **Attack everyone at once:** each guess would be hashed once and compared
  against every user, instead of once per user.

---

## Older passwords

Before this change, Better Auth hashed passwords with its default, scrypt.
`verifyPassword` (`lib/password.ts`, lines 39 to 74) checks whether a stored
hash starts with `$argon2id$`. If it doesn't, it checks it as an old scrypt
hash instead, so existing users can still sign in.

Those older passwords are **not upgraded** to Argon2id when the user signs
in. They stay as scrypt until the user resets their password. A stronger
version would re-hash the password with Argon2id at the next successful
sign-in, while the plain password is briefly available.

## Unicode normalisation

`hashPassword` and `verifyPassword` pass the password through
`normalize('NFKC')` before hashing (`lib/password.ts`, lines 31 and 48).
This makes characters that look the same but are stored differently, such
as an accented letter typed as one character or as a letter plus an accent,
hash the same way. It doesn't change case or remove spaces, so the password
the user chose still has to be typed exactly.