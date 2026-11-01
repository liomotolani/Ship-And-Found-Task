# Accessibility audit

## Screen reader used
VoiceOver on macOS, with Google Chrome.

Recordings:
- `evidence/11-screenreader-before.mp3`: before the fixes
- `evidence/12-screenreader-after.mp3`: after the fixes

## Audit BEFORE fixes (five criteria per field)

The "Exposed to the screen reader" column is what the code gave assistive
technology at the time. VoiceOver's exact words are in the transcripts
below.

| Field | Colour independence | Keyboard reachable | Focus visible | Exposed to the screen reader | Error linked to field |
|-------|---------------------|--------------------|---------------|------------------------------|-----------------------|
| Full name | Fails: "Full name is required." was red text only, no icon | Yes, 3rd stop after the logo and "Get started" | Yes, blue outline (browser default) | Label "Full name". Not marked as required | Yes, once the error showed: `aria-invalid` and `aria-describedby="name-error"` |
| Email | Fails: "Email is required." was red text only, no icon | Yes | Yes, blue outline | Label "Email". Not marked as required | Yes, once the error showed |
| Password | Fails: "Password is required." was red text only, no icon | Yes | Yes, blue outline | Label "Password". Not marked as required | Yes, once the error showed |
| Membership number | Fails: "Membership number is required." was red text only, no icon | Yes | Yes, blue outline | Label "Membership number". Not marked as required | Yes, once the error showed |
| Read full terms link | Passes: underlined, not colour alone; the external-link icon is `aria-hidden` | Yes | Yes, outline around the link | Link text "Read full terms and conditions (opens in a new tab)" | Not applicable |
| Terms checkbox | Fails: its error would have been red text only | Yes | Yes, outline around the box | Label "I have read and agree to the terms and conditions." Not marked as required | Linked once the error showed, but the error never appeared when tabbing past it, because validation only ran on change, not on blur |
| Sign up button | Not applicable | Yes | Faint: a thin dark outline on the teal button, easy to miss | Button "Sign up" | Not applicable |

## Problems found

1. **Errors relied on colour alone.** None of the five errors had a caution
   icon, so a user who can't see red got no warning signal.
2. **The terms checkbox never showed its error from the keyboard.** Its
   validation only ran on change, so tabbing past it unticked did nothing.
3. **No field was marked as required to assistive technology.** There was no
   `required` or `aria-required` anywhere in the form, so a screen reader
   couldn't tell the user which fields were required before they made a
   mistake.
4. **The focus ring on the teal buttons was hard to see.** On "Get started"
   and "Sign up" it was a thin dark outline on dark teal.

## Fixes

| Problem | Fixed? | Code (`components/SignUpForm.tsx` unless stated) | Recording |
|---------|--------|------|-----------|
| 1. Errors relied on colour alone | Yes | Every error now starts with `<ErrorIcon />` (lines 222, 251, 305, 342, 740, 748). The icon is `aria-hidden` (`components/ErrorIcon.tsx`, line 8), so the screen reader reads only the text | A warning triangle appears beside every error |
| 2. Terms checkbox gave no error from the keyboard | Yes | The checkbox now also validates on blur (line 727) | Tabbing past it shows "Please confirm that you have read and agree to the terms and conditions." with the icon |
| 3. No field marked as required | Yes | `required` and `aria-required="true"` on all five fields (lines 209, 238, 269, 321, 712) | Not visible; it changes what VoiceOver says |
| 4. Faint focus ring on teal buttons | Yes | `:focus-visible` is now a 3px solid outline in `--color-on-background` with a 2px gap (`app/globals.css`, lines 22 to 25). "Sign up" also has an inner ring in the button's text colour (lines 27 to 31) | A thick dark ring now shows clearly on "Get started", "Sign up" and every input |

## Audit AFTER fixes (five criteria per field)

| Field | Colour independence | Keyboard reachable | Focus visible | Exposed to the screen reader | Error linked to field |
|-------|---------------------|--------------------|---------------|------------------------------|-----------------------|
| Full name | Passes: error has a warning icon and text | Yes | Yes, 3px dark outline | Label "Full name", required | Yes: `aria-invalid` and `aria-describedby="name-error"` (lines 217 to 218) |
| Email | Passes: icon and text | Yes | Yes, 3px dark outline | Label "Email", required | Yes (lines 246 to 247) |
| Password | Passes: icon and text | Yes | Yes, 3px dark outline | Label "Password", required. The hint "Use at least 12 characters." is linked with `aria-describedby` while the field has focus (lines 114 to 120, 280) | Yes, the error is added to the same `aria-describedby` (lines 114 to 120) |
| Membership number | Passes: icon and text | Yes | Yes, 3px dark outline | Label "Membership number", required | Yes (lines 335 to 338) |
| Read full terms link | Passes | Yes | Yes, 3px dark outline | Link text "Read full terms and conditions (opens in a new tab)" | Not applicable |
| Terms checkbox | Passes: icon and text | Yes | Yes, 3px dark outline | Label "I have read and agree to the terms and conditions.", required | Yes, and the error now appears on blur (lines 727, 733 to 734) |
| Sign up button | Not applicable | Yes | Yes, outer dark ring and inner ring | Button "Sign up", with `aria-disabled` while the form isn't valid (line 762) | Not applicable |

## Still to check
Every error uses `role="alert"`, so each one is announced the moment it
appears. Tabbing through an empty form makes several errors appear in a
row. Listen to `12-screenreader-after.mp3` for whether VoiceOver interrupts
itself, and if it does, record it below as a remaining problem.

## Transcript BEFORE fixes (exact words, from 11-screenreader-before.mp3)

| Focus on | What VoiceOver said |
|----------|---------------------|
| VetReply logo | |
| "Get started" (header) | |
| Full name | |
| Email | |
| Password | |
| Membership number | |
| "Read full terms and conditions" link | |
| Terms checkbox | |
| "Sign up" button | |
| "Sign in" link | |

## Transcript AFTER fixes (exact words, from 12-screenreader-after.mp3)

| Focus on | What VoiceOver said |
|----------|---------------------|
| VetReply logo | |
| "Get started" (header) | |
| Full name | |
| Email | |
| Password | |
| Membership number | |
| "Read full terms and conditions" link | |
| Terms checkbox | |
| "Sign up" button | |
| "Sign in" link | |