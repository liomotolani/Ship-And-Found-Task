# Type scale

## Font
- Font family: Source Sans 3
- Source: Google Fonts
- Fallback: system-ui, sans-serif
- Why this font: VetReply is used by receptionists working under pressure
  and handling emotional conversations. Source Sans 3 is a humanist sans
  serif, so its letter shapes feel warmer than geometric fonts, which suits
  empathetic replies. Its open letter shapes stay clear at small sizes, so
  staff can scan drafts and sources quickly while juggling several tasks.
  It looks plain and steady rather than trendy, which supports trust.

## Line height rule
Line height = font size x 1.4, 1.5 or 1.6, rounded to the nearest whole number.

| Role     | Multiplier | Why                                                        |
|----------|------------|------------------------------------------------------------|
| Display  | 1.4        | Big text looks gappy with extra space, so it stays tight   |
| Headline | 1.4        | Short lines, usually one or two, so tight spacing is fine  |
| Title    | 1.5        | Sits between headings and body, needs a little more room   |
| Body     | 1.5 / 1.6  | Long reading text needs breathing room so lines don't blur |
| Label    | 1.4        | Short single lines on buttons and chips, kept compact      |

## The 15 styles

| Style           | Font   | Size (px) | Weight | Letter spacing | Multiplier | Line height (px) |
|-----------------|--------|-----------|--------|----------------|------------|------------------|
| Display Large   | [font] | 64        | 400    | -2.5           | 1.5        | 96               |
| Display Medium  | [font] | 45        | 400    | -1             | 1.4        | 63               |
| Display Small   | [font] | 36        | 400    | 0              | 1.5        | 54               |
| Headline Large  | [font] | 32        | 400    | 0              | 1.5        | 48               |
| Headline Medium | [font] | 28        | 400    | 0              | 1.5        | 42               |
| Headline Small  | [font] | 24        | 400    | 0              | 1.5        | 36               |
| Title Large     | [font] | 22        | 400    | 0              | 1.5        | 33               |
| Title Medium    | [font] | 16        | 500    | 0.15           | 1.5        | 24               |
| Title Small     | [font] | 14        | 500    | 0.1            | 1.5        | 21               |
| Body Large      | [font] | 16        | 400    | 0.5            | 1.5        | 24               |
| Body Medium     | [font] | 14        | 400    | 0.25           | 1.5        | 21               |
| Body Small      | [font] | 12        | 400    | 0.4            | 1.5        | 18               |
| Label Large     | [font] | 14        | 500    | 0.1            | 1.5        | 21               |
| Label Medium    | [font] | 12        | 500    | 0.5            | 1.5        | 18               |
| Label Small     | [font] | 11        | 500    | 0.5            | 1.5        | 16.5             |

## Worked examples
- Display Large: 64 x 1.5 = 96
- Body Large: 16 x 1.5 = 24
- Body Small: 12 x 1.5 = 18

## Why the multiplier changes between roles
Large text has more space inside each letter, so extra line height makes
a two-line heading look like two separate headings. Small body text is
read in long blocks, so it needs more space between lines to stop the
eye jumping to the wrong line.

## Letter spacing test (Display Medium)
- Default spacing: 0 (evidence/03-spacing-default.png)
- Chosen spacing: -1 (evidence/04-spacing-chosen.png)
- What changed: At 0 the letters in the display medium
  looked loose and the word felt wider than it needed to be. At -1 the
  letters sit closer together, the word reads as one shape.

## Where these styles are used
| Style          | Used for                        |
|----------------|---------------------------------|
| Display Small  | welcome screen heading          |
| Headline Small | section headings                |
| Title Medium   | card titles                     |
| Body Large     | main paragraph text             |
| Body Medium    | secondary text, descriptions    |
| Label Large    | button text                     |
| Label Medium   | form field labels               |
| Body Small     | helper text under form fields   |