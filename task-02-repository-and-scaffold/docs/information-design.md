# Information design

Routes checked: `/` (home, the marketing page) and `/enquiries`

---

## The head

I recorded the head before changing anything, using `curl` against the
running server on 30 Oct 2026 at 13:46 (`evidence/head-before.txt`), then
ran the same check after (`evidence/head-after.txt`).

| Item | Before | After |
|------|--------|-------|
| Title | `VetReply` on both `/` and `/enquiries` | `/`: `VetReply — Veterinary replies with sources`. `/enquiries`: `VetReply` |
| Tagline (description) | "AI-assisted reply workflow for veterinary clinics" on both `/` and `/enquiries` | `/`: "Grounded veterinary reply assistant" (4 words). `/enquiries`: none |
| SEO tags | `/`: none. `/enquiries`: `robots: noindex` | `/`: `robots: index, follow` and `canonical: http://localhost:3000`. `/enquiries`: `robots: noindex` (unchanged) |
| Favicon | None on either route | `/icon.svg` on both routes: a green rectangle with a paw inside it. I asked the agent to create it to that description. |
| Open Graph | None | `/` only: `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale` (`en_GB`), `og:type` (`website`) |
| Twitter card | None | `/` only: `twitter:card` (`summary`), `twitter:title`, `twitter:description` |

Evidence: `evidence/16-head-route-one.png` and
`evidence/17-head-route-two.png` [TO FILL: confirm saved].

### Title
Before, the server sent the same title, `VetReply`, on every route. After,
`/` has its own title and `/enquiries` keeps `VetReply`, so the title now
changes between routes.

### SEO only on the marketing page
Before, `/` had a description but nothing telling search engines how to
treat it, and `/enquiries` was already `noindex` but carried the same
description as the home page.

After, `/` is indexable (`index, follow`) and has the description,
canonical URL, Open Graph and Twitter tags. `/enquiries` stays `noindex`
and no longer has a description, Open Graph or Twitter tags.

The canonical and `og:url` currently point to `http://localhost:3000`,
which will need changing to the real domain when the app is deployed.

---

## The body

### 1. What I removed, and why
Removed the Home, About and Enquiries links from the navigation and
replaced them with a single "Get started" button.

Why: It wasn't suppose to be there as the home page is meant to be the entry point of the application.

### 2. What choice I collapsed, and the growth reasoning
The choice I collapsed was the nav-links.

### 3. Heading max-width
- Heading: "Every reply grounded in your practice's own documents."
- Before: `max-width: none`. Where it wrapped depended on the width of the
  hero column. At about 800px wide it wrapped as "Every reply grounded in /
  your practice's own / documents.", leaving "documents." alone on the last
  line.
- After: `max-width: 24ch` and `text-wrap: balance`.
- Evidence: `evidence/18-heading-wrap-bad.png` and
  `evidence/19-heading-wrap-good.png` [TO FILL: confirm saved].
- Why 24ch: It ensured a word is not left alone on a line, I tried 18ch and 20ch but didn't get the right output.

### 4. Buttons

| Button | Before | After |
|--------|--------|-------|
| Hero "Get started" | `14px 32px` padding, 8px radius | `0.875rem 2rem` padding, `0.5rem` radius |
| "See how it works" | `14px 24px` padding, 8px radius | [TO FILL] |
| Header "Get started" | `8px 16px` padding, 8px radius | `0.75rem 1.25rem` padding, `0.5rem` radius |

With Label Large text (21px line height), the hero button is
21 + 14 + 14 = 49px tall and the header button is 21 + 12 + 12 = 45px tall.
Before, the header button was 21 + 8 + 8 = 37px tall.

Why rem: rem padding scales with the user's base text size, so the button
grows with its label if the user enlarges text.


### 5. Label style on every button

I asked the agent:
```
what typography style are you using for the buttons
```

It answered:
```
All buttons use the label-large type style:
- Font: Source Sans 3
- Size: 14px
- Weight: 500
- Line height: 21px
- Letter spacing: 0.1px
Defined at app/tokens.css:262, used by the hero buttons
(components/Hero.tsx:3), nav Get started, sign-up submit and enquiry submit.
```

Checked against the code: I checked the style prop in the components.tsx file and it was as described, I also checked the nav Get started, Get started submit.

---

## Interaction

- Every clickable element has a pointer cursor and hover feedback.
  Hover effect: The buttons, and card 
- The logo links to `/`.

---

## Responsiveness

- Before: `evidence/20a-heading-broken-before-clamp.png`. At 375px (iPhone
  SE) the heading took four lines ("Every reply / grounded in / your
  practice's / own documents.") and pushed the "Get started" button to the
  bottom edge of the screen. The hero section had a fixed
  `padding: 4rem 1.5rem`.
- After: `evidence/20-responsive-three-widths.png`, at 375px, 768px and
  1280px. At 375px the heading takes three lines.
- Hero section padding: `clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 1.5rem)`
- Heading font size: [TO FILL: which clamp() value]
- `clamp()` values used in the app:
  ```
  clamp(0.75rem, 2vw, 1.25rem)
  clamp(0.75rem, 2vw, 1rem)
  clamp(1.25rem, 2.2vw, var(--type-title-large-size))
  clamp(1.25rem, 3vw, 1.75rem)
  clamp(1.5rem, 4vw, 2.5rem)
  clamp(1.5rem, 4vw, 2rem)
  clamp(1.5rem, 5vw, 3rem)
  clamp(1.75rem, 3.5vw, var(--type-headline-large-size))
  ```
