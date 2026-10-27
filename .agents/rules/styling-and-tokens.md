---
trigger: glob
globs: **/*.css, **/*.tsx
---

# styling-and-tokens.md

Job: control where every visual value comes from.

## Rules

1. Use only the CSS variables defined in task-01-design-system/demo/tokens.css. Import that file once, in the root layout.
   Reason: the owner's design system is the only styling source (locked stack).

2. Never hard-code a colour, font, font size, line height, spacing, radius or shadow. This applies to CSS files, inline styles and style props.
   Reason: a hard-coded value breaks the design system and cannot be changed in one place.

3. Values with no design meaning are allowed without a token: `0`, `auto`, `100%`, `inherit`, `currentColor`, and layout percentages.
   Reason: without this line, rule 2 would block ordinary layout code.

4. Use no other styling library or CSS framework, including utility class frameworks and component libraries with their own styles.
   Reason: a second styling source competes with the tokens.

5. Never edit or copy the tokens file. If no token fits a need, stop and ask.
   Reason: the owner maintains the design system. A copied or invented token drifts from it.