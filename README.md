# VetReply

## 1. What this is
VetReply helps vet clinic receptionists reply to client messages quickly
by drafting answers from the clinic's own information, and nothing is
sent without staff approval.

This repository holds all five Ship and Found tasks as five top-level
folders in one repository, rather than five separate repositories,
so the design system, app and documentation stay together and each
task builds on the last.

## 2. Status

| Task                                      | Status        | Notes                                           |
|-------------------------------------------|---------------|-------------------------------------------------|
| 1. Design system                          | In progress   | Colour, type and shadows done in Figma; [update] |
| 2. Repository and scaffold                | Not started   |                                                 |
| 3. Client-side validation                 | Not started   |                                                 |
| 4. Server security                        | Not started   |                                                 |
| 5. Sessions, compliance and defence       | Not started   |                                                 |

What works today: [e.g. "A design system in Figma, exported as tokens
and converted to CSS variables, and one static welcome screen that uses
it. There is no running application, database or login yet."]

## 3. Stack

| Choice                         | Why this, rather than the alternative                                   |
|--------------------------------|-------------------------------------------------------------------------|
| Figma + Material Theme Builder | Generates light and dark palettes from one brand colour, instead of picking every colour by hand |
| Source Sans 3                  | Calm, warm and clear at small sizes, instead of Roboto or Inter, which look generic |
| CSS custom properties          | Roles reference palette tones, so one change updates everything, instead of copied hex values |
| Node.js (token script)         | Already installed and enough for a small conversion script, instead of a build tool like Style Dictionary |
| [Framework, from Task 2]       | [why]                                                                   |
| [Database, from Task 2]        | [why]                                                                   |

## 4. Getting started

Requirements: Node.js [version, check with `node -v`], Git.

```
git clone [your repo URL]
cd [repo folder name]
cd task-01-design-system
```

Then open `demo/with-system/index.html` in a browser.

[From Task 2, replace this with the commands to install and run the app.]

## 5. Environment variables
None yet. The app has no database, email or secrets until Task 2.

[From Task 2, list names only, for example:]

| Name           | What it is for                     |
|----------------|------------------------------------|
| DATABASE_URL   | Connection string for the database |

Values are never committed. Copy `.env.example` to `.env` and fill it in.

## 6. What this deliberately does not do
- It does not send replies automatically. Every draft needs staff
  approval, because a wrong answer to a worried pet owner could cause harm.
- It does not give medical diagnoses. It answers from the clinic's own
  information, such as opening hours and prices.
- [Add others as you decide them, e.g. "No dark mode yet, because..."]

## 7. Known defects

| Defect                         | File                                        | Impact                    |
|--------------------------------|---------------------------------------------|---------------------------|
| [e.g. Brand colour only passes contrast by a small margin, 5.01:1 vs 4.5:1] | task-01-design-system/demo/tokens.css, line [x] | Lightening the brand colour later would make button text fail WCAG AA |

Full details in each task's docs/defects.md.