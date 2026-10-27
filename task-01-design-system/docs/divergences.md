## Divergence 1: Font family
- Default: Roboto
- My choice: Source Sans 3
- Why: Roboto is a neutral, slightly mechanical font. VetReply needs to
  feel calm and empathetic because staff handle upsetting situations, and
  Source Sans 3's humanist shapes feel warmer while staying professional.
  It also avoids the generic look of AI-built apps that default to
  Roboto or Inter.
- When my choice would be WRONG: If VetReply had to support clinics using
  Arabic, Hindi, Chinese or other non-Latin scripts, Source Sans 3 would
  not cover them and Roboto (or Noto Sans) would be the better choice.
  It would also be wrong if the app needed to feel playful, for example
  a pet owner's social app, where a rounder font like Nunito would fit
  better.

  ## Divergence 2: Display Large font size
- Default: 57px
- My choice: 64px
- Why: VetReply runs on a reception desktop that staff glance at while
  on the phone or talking to a client at the counter, often from further
  back than a normal reading distance. Display Large is only used for one
  short heading per screen (the page title), so making it larger lets
  staff see where they are at a glance without leaning in. 64 is also a
  multiple of 8, so it lines up with an 8px spacing grid.
- When my choice would be WRONG: On a phone screen (375px wide), 64px
  leaves room for only about 8 to 10 characters per line, so most
  headings would wrap or overflow. If VetReply were used mainly on
  phones, or if headings were longer than one or two words, 57px or
  smaller would be the better choice. It also takes up more vertical
  space, which pushes drafted replies further down the screen.

## Divergence 3: Display Large line height
- Default: 64px (a ratio of about 1.12 to the 57px size)
- My choice: 96px (64 x 1.5)
- Why: My type scale uses one rule for every style, line height = size
  x 1.4, 1.5 or 1.6, so the system can be checked and extended without
  guessing. I chose 1.5 for Display Large so it matches the body text
  rhythm and the heading has clear space above and below it, which keeps
  the screen feeling calm and uncluttered.
- When my choice would be WRONG: If a Display Large heading wraps onto
  two lines, the 32px gap between them makes the lines look like two
  separate headings instead of one. For any screen with long headings,
  x1.4 (90px) or a tighter value outside my rule would read better. The
  Material default of 64px is tight because large text needs less space
  between lines, not more.