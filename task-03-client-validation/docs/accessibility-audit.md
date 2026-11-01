# Accessibility audit

## Screen reader used
VoiceOver on macOS [version], with [browser].

## Audit table (five criteria per field)
| Field | Colour independence | Keyboard reachable | Focus visible | Screen reader announces | Error linked to field |
|-------|---------------------|--------------------|---------------|-------------------------|-----------------------|
| Full name | Fails: "Full name is required." is red text only, no icon (lines 134 to 138) | Yes, 3rd stop after logo and "Get started" | Yes, blue outline (browser default) | [from your transcript] | Yes, once the error shows: aria-invalid and aria-describedby="name-error" (lines 131 to 132). Not marked as required (no required or aria-required) |
| Email | Fails: "Email is required." is red text only, no icon (lines 160 to 164) | Yes | Yes, blue outline | [from your transcript] | Yes, once the error shows (lines 157 to 158). Not marked as required |
| Password | Fails: "Password is required." is red text only, no icon (lines 187 to 191) | Yes | Yes, blue outline | [from your transcript] | Yes, once the error shows (lines 184 to 185). Not marked as required |
| Membership number | Fails: "Membership number is required." is red text only, no icon (lines 221 to 225) | Yes | Yes, blue outline | [from your transcript] | Yes, once the error shows (lines 216 to 219). Not marked as required |
| Read full terms link | Passes: underlined, not colour alone; external-link icon is aria-hidden | Yes | Yes, outline around the link | [from your transcript] | Not applicable |
| Terms checkbox | Fails: its error would be red text only (lines 610 to 614) | Yes | Yes, outline around the box | [from your transcript] | Linked once the error shows (lines 605 to 606), but the error never appears when you tab past it: validation only runs on change (line 600), not on blur. Not marked as required |
| Sign up button | Not applicable | Yes | Faint: thin dark outline on the teal button, easy to miss in the recording | [from your transcript] | Not applicable. Only disabled while submitting (line 623) |

## Problems found
- Errors rely on colour alone. None of the five errors has a caution icon. (The SVGs in the file are the terms list ticks and the external-link icon.)
- The terms checkbox never shows its error from the keyboard. Its validation is on onChange, so tabbing past it unticked does nothing. You saw this in the video.
- No field is marked as required to assistive technology. There’s no required or aria-required anywhere in the form, so a screen reader can’t tell the user which fields are required before they make a mistake.
- The focus ring on “Sign up” is hard to see. To confirm this as a real failure, check its contrast against the teal: focus indicators need 3:1.

## Fixes
| Problem | Fixed? | Code | Recording |
|---------|--------|------|-----------|
| 1. Errors relied on colour alone | Yes | Every error now has `<ErrorIcon />` (lines 142, 171, 201, 238, 636, 644). The icon is `aria-hidden`, so the screen reader reads only the text | A warning triangle appears beside every error |
| 2. Terms checkbox gave no error from the keyboard | Yes | An `onBlur` was added to the checkbox (line 623) | Tabbing past it shows "Please confirm that you have read and agree to the terms and conditions." with the icon |
| 3. No field marked as required | Yes | `required` and `aria-required="true"` on all five fields (lines 128 to 129, 157 to 158, 187 to 188, 216 to 217, 607 to 608) | Can't be seen; it shows up in what VoiceOver says |
| 4. Faint focus ring on teal buttons | Yes | `:focus-visible` is now a 3px solid outline in `--color-on-background` with a 2px gap (`app/globals.css`, lines 22 to 25). "Sign up" also has an inner ring in the button's text colour (lines 27 to 31) | A thick dark ring now shows clearly on "Get started", "Sign up" and every input |
