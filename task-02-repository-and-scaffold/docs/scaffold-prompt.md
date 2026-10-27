# Scaffold prompt

## First draft (written by me)
You are scaffolding VetReply, a reply assistant for vet clinic receptionists.
Read these files before writing any code:
- docs/vetreply-prd-v2.md
- AGENTS.md
- task-01-design-system/demo/tokens.css
- .agents/rules/*.md
- .agents/skills/*.md

Tell me what you understood and wait for me to approve before you start.These files are the source of truth. If two of them disagree, ask me. Use only the CSS variables in tokens.css for colour, type and shadow.Before building kindly share the implementation plan. Only set up the project and a simple home screen. Don't build features. When done, list the files you made and any assumptions. Then check your work against these instructions.

## Final version
You are scaffolding VetReply, a reply assistant for vet clinic receptionists.
This is the FOUNDATION ONLY. Do not build product features.

## STEP 1: READ FIRST
Read these files in full before planning or writing any code:
- docs/vetreply-prd-v2.md
- AGENTS.md
- task-01-design-system/demo/tokens.css
- .agents/rules/*.md
- .agents/skills/*.md

## STEP 2: SUMMARISE YOUR UNDERSTANDING
In under 200 words, tell me:
- what VetReply is and who uses it
- how the interface should feel, and why
- how the design tokens are structured (primitives, roles, type, shadows)

## STEP 3: WRITE AN IMPLEMENTATION PLAN
Before creating any files, give me a plan with these sections:

1. Stack: framework, language and package manager, with exact versions
   and one line on why each.
2. Project setup: the exact commands you will run, in order, and the
   folder you will run them in.
3. Folder structure: the full tree you will create, with one line on
   what each folder is for.
4. Files: every file you will create or change.
5. Design tokens: how tokens.css will be brought in and loaded globally.
6. Home screen: what will be on it, and which type style and colour
   role each element will use.
7. Verification: how you will check it works (server starts, page
   returns 200, no raw colour values in the code).
8. Assumptions: every assumption you are making, as a numbered list.
9. Risks: anything you are unsure about or that could go wrong.

Then STOP. Do not create any files until I reply "approved".

## STEP 4: RULES
- The files in Step 1 are the only source of truth. Do not invent
  features, colours, fonts or copy that are not in them.
- If two files disagree, stop and ask me which is right. Do not guess.
- Styling uses ONLY the CSS variables from tokens.css. No hex, rgb, hsl,
  pixel font sizes or shadows written directly in components.
- Create the project in [PROJECT FOLDER PATH] itself, not in a new
  subfolder inside it.

## STEP 5: SCOPE, BUILD ONLY THIS
1. Project setup: Using the tech stack from the PRD project in the root folder, with
   the dev server running on port 3000.
2. Folder structure: create the folders from your plan, ready for later
   features. Folders for future features stay empty (use a .gitkeep
   file). Do not put feature code in them.
3. Design tokens: tokens.css copied into the project and loaded
   globally.
4. A minimal home screen with only:
   - the VetReply name (Display Small)
   - a one-line tagline (Body Large)
   - one primary button labelled "Get started" (Label Large), which does nothing yet on the surface background, using colour roles only.

Do NOT build: login, signup, a database, an API, environment variables,
navigation, a footer, or any VetReply feature.

## STEP 6: REPORT
When finished, give me:
1. Every file and folder you created, as a list of paths.
2. Every assumption you made, as a numbered list. If you made none,
   say so and explain why.
3. The command to start the dev server, and the URL to open.

## STEP 7: SELF-AUDIT
Go through Steps 4 and 5 one by one. For each rule, say whether you
followed it, and point to the file that proves it. Flag anything you
did not follow, and anything you built that was not in scope.