# Interview answers


## 1. How would you structure design tokens?

In three layers. Primitives are raw values with no meaning, such as `--palette-primary-40: #0E7C7B`. Roles describe a job and reference a primitive, such as `--color-primary: var(--palette-primary-40)` or `--color-on-primary: var(--palette-primary-100)`. Optionally, component tokens sit on top, such as `--button-background: var(--color-primary)`.

Components only ever use roles, never primitives. That separation is the point: a rebrand changes primitives, a dark theme changes which primitive each role points at, and components do not change at all.

Typography and shadows follow the same idea. In VetReply I have 15 named type styles, such as `--type-label-large-size`, and three shadows, rather than sizes typed into components.

The chain matters as much as the structure. My tokens live as Figma variables, are exported to JSON, and a script converts them to CSS. If any step copies a value instead of referencing it, the structure breaks without anyone noticing, which is what my deliberate regression showed.

---

## 2. When is a token change breaking?

When something that uses the token has to change, or looks different in a way nobody intended.

Renaming or removing a token is breaking. In CSS this is dangerous because it fails silently: `var(--color-primary)` pointing at a missing variable does not throw an error, the element just loses its colour.

Changing meaning is breaking, for example pointing the error role at an amber tone.

Changing a value can be breaking too. If someone lightens my brand teal slightly, white on primary drops below 4.5:1 and every button label fails WCAG AA, even though no name changed. My own change of Display Large from 57px to 64px would break any layout that assumed the old size, because headings wrap earlier on phones.

Adding a new token, or adjusting a value while keeping contrast and layout intact, is not breaking.

I would treat tokens like an API: version them, deprecate before removing, and check contrast and layout before releasing a change.

---

## 3. How would you support multiple brands and themes?

Keep the role names fixed and swap what they point at.

A theme decides which tones the roles use. In light mode, `--color-primary` points at primary 40 and `--color-surface` at neutral 99. In dark mode, the same roles point at primary 80 and a very dark neutral tone, around 6 to 10. This works because each palette has 14 tones, so light and dark both come from one source colour.

A brand decides which palette the primitives contain. In CSS I would scope these with attributes, for example `[data-theme="dark"]` redefining the roles and `[data-brand="clinic-b"]` redefining the primitives. Components never change, because they only use roles.

For VetReply this matters if several clinics use it, each with its own brand colour. Each clinic's colour would be pinned as primary 40 and a palette generated around it.

The catch is contrast. White works on my teal at 5.01:1, but a clinic with a lighter brand colour might need dark text on its buttons instead. So every brand needs its role pairs re-checked, not just its colours swapped.

---

## 4. Can tokens guarantee accessible contrast?

No. Tokens store individual colours, but contrast is a property of a pair in a specific place. Tokens can make the accessible choice the easy one. They cannot stop the wrong one.

My own system shows this. My outline colour, `#6F7978` on surface, is 4.38:1. That passes for borders, which need 3:1, but fails for text, which needs 4.5:1. Nothing in the token file stops a developer from using `--color-outline` for helper text.

Values can also drift. White on my brand teal is 5.01:1, only just above AA. If someone lightens the brand colour, the token names stay the same and every button fails.

Tokens also know nothing about context, such as text over images, disabled states or gradients.

What tokens can do is pair roles deliberately (on-primary is designed to sit on primary) and give a script something to check. A contrast check in the build, automated audits, and manual review are what actually get close to a guarantee.

---

## 5. How do you ensure colour contrast guidelines are met?

At three stages: design, build, and review.

In design, I define colours as role pairs, such as on-primary on primary, and check every pair I actually use with a contrast checker, recording the number rather than writing "passes". For VetReply, white on teal is 5.01:1, body text is 16.76:1 and error text is 6.31:1. When a pair fails, I change the tone. I chose white for on-primary because black on my teal is only 4.19:1, which fails AA.

When a colour is never used for text, I document that. My outline colour is 4.38:1, so it is for borders only.

In the build, I would add a contrast check to the token script so a failing pair breaks the build, and run automated tools such as axe or Lighthouse.

In review, I check states automated tools miss: hover, focus, disabled, and text over images. I also never rely on colour alone. Errors get an icon as well as red text.

Any token change means re-checking.

---

## 6. Can you discuss the differences between WCAG levels A, AA and AAA?

They are three levels of the same guidelines, each building on the last.

Level A is the minimum. Without it, some people cannot use the product at all. Examples: text alternatives for images, everything usable by keyboard, and not using colour as the only way to convey information.

Level AA is the standard target, and the one most laws and contracts reference, including UK public sector rules. It adds requirements such as contrast of 4.5:1 for normal text and 3:1 for large text, visible focus, and text that still works when resized to 200%.

Level AAA is the strictest. It raises contrast to 7:1 for normal text and adds requirements like sign language for video. It is not usually required for whole sites, because some content cannot meet every AAA rule.

VetReply targets AA. Some pairs reach AAA anyway, such as body text at 16.76:1, but the button label at 5.01:1 meets AA only. I would call that out honestly rather than claim AAA overall.

---

## 7. Discuss the importance of semantic HTML in the context of accessibility.

Semantic HTML tells assistive technology what each element is, for free.

A `<button>` can be reached with the keyboard, pressed with Enter or Space, and is announced as "button" by a screen reader. A `<div>` with a click handler gets none of that unless you rebuild it by hand, and people usually forget part of it.

Headings let screen reader users jump between sections. Landmarks such as `<main>` and `<nav>` let them skip straight to content. A `<label>` linked to an input means the field name is read out. Lists announce how many items they contain.

ARIA exists to fill gaps, but the first rule of ARIA is not to use it when a native element does the job.

In VetReply, "Approve and send" must be a real button, the draft reply needs a proper label, and the inbox should be a list.

This links to my type scale. Visual style and meaning are separate. A heading styled as Display Small must still be the correct heading level, such as `<h1>`, not a styled `<div>`.

---

## 8. How do you handle design handoff to developers using Figma?

By handing over a system, not a set of values to copy.

Colours, type and shadows live in Figma as variables and styles, named by role. They are exported as JSON, and a script converts them to CSS, so nobody types a hex code by hand.

I check the export itself. My first export was missing all the colour variables because I had not included them. I only noticed when I searched the file for "primary" and found nothing. It also copied my black shadows straight into the CSS. Exporting checks nothing, so review happens in Figma first.

Beyond tokens, I document what a static frame does not show: hover, focus, error, empty and loading states, how layouts behave at different widths, and which type style each element uses.

Dev Mode is useful for inspecting, but it shows values, so I check that elements reference variables rather than hard-coded colours.

With an AI agent as the developer, handoff means giving the agent the files explicitly and telling it the rules, then verifying it followed them, by searching the code for raw colours and asking which styles it used.

---

## 9. Why do AI-generated interfaces tend to look generic, and what specifically do you hand an agent to stop it?

Because without input, an agent produces the most common pattern it has seen: Inter or Roboto, a default blue button, grey shadows and rounded white cards. The average of everything looks like nothing in particular.

The other cause is more practical: the agent never receives the design system. In class, the system existed but the agent ignored it because it was never given it.

For VetReply I hand the agent:
- `tokens.css`, with colour roles, 15 type styles and three shadows
- `type-scale.md`, saying what each style is for
- the business brief, so it knows the app should feel calm, empathetic and uncluttered
- explicit rules: use only role variables, no hex, rgb or hsl values, and a named style for each element, such as Label Large for buttons

I also ask it to summarise what it read and wait for approval before building.

Then I verify. I searched the code for raw colour values and saved the command and output, and asked the agent which style it used for the button. My before and after screenshots show the difference.

---

## 10. Your line height for display large is a specific number. Why that number and not one step either side of it? What would you lose with each?

My Display Large is 64px with a line height of 96px, which is 64 x 1.5.

One step down, 64 x 1.4 is 89.6, rounded to 90. A two-line heading would hold together better, with a 26px gap between lines instead of 32px. But I would lose two things: 90 is not a multiple of 8, so it would not sit on my 8px spacing grid, and the heading would have less space around it, which works against the calm, uncluttered feel the brief asks for.

One step up, 64 x 1.6 is 102.4, rounded to 102. The gap between wrapped lines would grow to 38px, so a two-line heading would read as two separate headings. It would also push the drafted reply, which is what staff actually need, further down the screen.

96 is a multiple of 8 and matches the 1.5 rhythm of my body text.

The honest cost is that a wrapped heading at 96 still looks loose. That is why I keep Display Large for short, one-line page titles.

---

## 11. Point at one place in your own token structure that you would build differently if you started again. Say what you would do instead and what it would cost.

My CSS palette is a static copy. The token script writes out 14 fixed tones per palette from the Figma export. When I changed primary 40 during my regression, only that one tone changed. Primary 90 and primary 10 would have stayed teal. My shadows also hold their colour as copied numbers rather than a reference to the primary token, so they would not follow a rebrand either.

In Figma, changing the brand colour regenerates the whole palette. In code, it does not. So the code is not really a system, it is a snapshot.

Instead, I would store only the source colour in code and generate every tone in the build script, using the same colour library Material Theme Builder uses. Shadows would be built from the primary token too, for example with `color-mix()`.

The costs: a new dependency, a more complex script I would need to explain line by line, and a risk that the code and Figma disagree if they use different versions of the algorithm. Designers would also lose the ability to hand-tweak a single tone, because every tone would be calculated.

---

## 12. Wrong-answer analysis

> "I set up design tokens by exporting the hex values from Figma into a CSS file, so every colour in the codebase comes from one place. That makes it a single source of truth."

What is missing is referencing and meaning.

Exporting hex values copies them once. The CSS file is a snapshot of Figma, not connected to it. Now there are two sources: Figma and the CSS file, and they start drifting the day someone edits either one.

There are also no roles. If the file contains `--teal: #0E7C7B`, components use the colour, not the job. Nothing says which colour is for buttons, which is for text on buttons, or which pairs pass contrast.

By month four: the designer has updated the brand in Figma, but the CSS was never re-exported. Developers have pasted new hex values straight into components because it was faster, so a search finds dozens of raw colours. Dark mode means duplicating every value. A rebrand becomes find-and-replace across the codebase, and some places get missed.

My own regression proves it. I copied the teal into the primary role, changed the brand colour, and the link turned purple while the button stayed teal.

The fix is roles that reference primitives, exported from Figma variables, with a search for raw values to enforce it.