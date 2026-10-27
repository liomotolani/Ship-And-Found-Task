---
trigger: glob
globs: app/**/*.tsx, components/**/*.tsx
---

# accessibility.md

Job: make every screen usable to WCAG 2.2 level AA.

## Rules

1. Every screen meets WCAG 2.2 level AA (PRD 8.9).
   Reason: owner decision. Clients use phones and computers with varying skills and connections (business brief).

2. Use native HTML elements (`button`, `a`, `input`, `select`, `label`) before ARIA roles. Use ARIA only when no native element fits.
   Reason: native elements come with keyboard and screen reader behaviour that ARIA must rebuild by hand.

3. Every action works with a keyboard alone, in a logical tab order, with no keyboard traps.
   Reason: keyboard access is a WCAG AA requirement.

4. Every focusable element shows a visible focus indicator.
   Reason: users must see where they are on the page.

5. Every input has a visible label tied to it in code. Every error message is tied to its field and announced when it appears.
   Reason: screen reader users must know what a field is and what went wrong with it.

6. Announce status changes in a live region. This includes quick answer results, "No approved information found." and send or payment results.
   Reason: results that appear without a page load are otherwise silent to screen readers.

7. Give non-text content a text alternative. Decorative images get an empty `alt`.
   Reason: WCAG AA requires text alternatives.

8. Text contrast is at least 4.5 to 1, large text and interface parts at least 3 to 1. If a token pair fails, stop and tell the human.
   Reason: these are the AA contrast minimums, and the tokens are the only colour source.

9. Every page works at 320 CSS pixels wide with no sideways scrolling, sets `lang="en-GB"`, has a unique title and one `h1`.
   Reason: clients use phones, and the pages are written in British English.

10. Every screen in PRD 6.5 gets an automated axe-based scan in Playwright with zero violations, plus a keyboard-only check of each new screen.
    Reason: PRD 8.9 makes both part of the definition of done.