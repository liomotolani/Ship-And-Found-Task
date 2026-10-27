# Task 1: Design system

## What this task was
Build a design system for VetReply in Figma (colour, typography and
shadows), export it as tokens, convert the tokens to CSS variables, and
prove the AI agent actually used the system instead of its own defaults.

## What I built
- Colour system from brand colour #0E7C7B, pinned as primary 40, with
  13-tone palettes, error, warning and success colours, and colour roles.
  See docs/colour-roles.md.
- Type scale of 15 styles in Source Sans 3, with line height set to
  size x 1.4, 1.5 or 1.6. See docs/type-scale.md.
- Three shadows (soft, medium, hard) built from the brand colour, not
  black. See docs/shadows.md.
- A script the agent wrote that converts tokens.json into tokens.css,
  where colour roles reference palette tones instead of copying hex values.
- One welcome screen built twice: without the system and with it.

## Key decisions
- Brand colour: #0E7C7B. [Where it came from, 1 line.]
- Font: Source Sans 3, because [1 line linking to "calm, empathetic,
  fast, trustworthy"].
- Display Large: 64px with 96px line height instead of Material's 57/64.
  See docs/divergences.md.
- On-primary is white, because white on #0E7C7B is 5.01:1 and black
  is only 4.19:1, which fails WCAG AA.


### The incomplete export
The first export (evidence/05-tokens-incomplete.json)had typography and effects but no colour roles, because Figma variables
weren't included. I noticed when I searched the file for 'primary' and
got no results.


## Evidence

| File                                  | What it shows                                    |
|---------------------------------------|--------------------------------------------------|
| 01-palette-before-pin.png             | Palette before pinning, primary 40 is #006A69    |
| 02-palette-after-pin.png              | Palette after pinning, primary 40 is #0E7C7B     |
| 03-spacing-default.png                | Display Large at default letter spacing          |
| 04-spacing-chosen.png                 | Display Large at my chosen letter spacing        |
| 05-tokens-incomplete.json             | First export, missing colour variables           |
| 06-tokens-complete.json               | Correct export including variables               |
| 07-raw-value-search.txt               | Search command and output for raw colour values  |
| 08-agent-typography-answer.txt        | Agent's answer on which type style it used       |
| 09-screen-without-system.png          | Welcome screen built without the design system   |
| 10-screen-with-system.png             | Same screen built with the design system         |
| 11-broken-referencing.png             | Interface after breaking token referencing       |
| 12-git-log-branch-unmerged.txt        | Git log proving the experiment branch never merged |

## Docs
- docs/business-brief.md
- docs/type-scale.md
- docs/colour-roles.md
- docs/shadows.md
- docs/divergences.md
- docs/prompts.md
- docs/defects.md
- docs/interview-answers.md