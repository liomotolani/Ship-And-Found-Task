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
| 1. Design system                          | Done          | Colour, type and shadows done in Figma;         |
| 2. Repository and scaffold                | In Progress   |                                                 |
| 3. Client-side validation                 | Not started   |                                                 |
| 4. Server security                        | Not started   |                                                 |
| 5. Sessions, compliance and defence       | Not started   |                                                 |

What works today: A design system in Figma, exported as tokens
and converted to CSS variables, and one static welcome screen that uses
it. 
There is a running application with database and enviroment variables. Get the details in the Get started part of this project.

## 3. Stack

| Choice                         | Why this, rather than the alternative                                   |
|--------------------------------|-------------------------------------------------------------------------|
| Figma + Material Theme Builder | Generates light and dark palettes from one brand colour, instead of picking every colour by hand |
| Source Sans 3                  | Calm, warm and clear at small sizes, instead of Roboto or Inter, which look generic |
| CSS custom properties          | Roles reference palette tones, so one change updates everything, instead of copied hex values |
| Node.js (token script)         | Already installed and enough for a small conversion script, instead of a build tool like Style Dictionary |

## 4. Getting started

Requirements: 

Node.js [version, check with `node -v`]

Git.

# Instructions

git clone https://github.com/liomotolani/Ship-And-Found-Task

cd https://github.com/liomotolani/Ship-And-Found-Task/app

npm install

cp .env.example .env

### edit .env and set DATABASE_URL (see Environment variables)
npx prisma migrate dev

npm run dev

## 5. Environment variables

| Name           | What it is for                     |
|----------------|------------------------------------|
| DATABASE_URL   | Connection string for the database will be added in task 2. |

Values are never committed. Copy `.env.example` to `.env` and fill it in.

## 6. What this deliberately does not do
- It does not send replies automatically. Every draft needs staff
  approval, because a wrong answer to a worried pet owner could cause harm.
- It does not give medical diagnoses. It answers from the clinic's own
  information, such as opening hours and prices

## 7. Known defects

| Defect                         | File                                        | Impact                    |
|--------------------------------|---------------------------------------------|---------------------------|
| Shadows built from a neutral colour instead of the brand colour (found and fixed) | task-01-design-system/demo/tokens.css | It would mean shadows never follow a rebrand, because they are not connected to the brand colour at all. Worse, the docs would have said the shadows were brand-coloured when they were not, so anyone trusting the docs would be misled.|

Full details in each task's docs/defects.md.