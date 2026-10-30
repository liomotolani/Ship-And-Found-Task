# Task 2: Repository and scaffold

## What this task was
Scaffold VetReply with an agent from my own context files, get it running,
break the server three ways and recover, then prove whether the app really
stores data, rather than trusting what the interface shows.

## What I built
- **The app scaffold**, at the root of this repository (`app/`, `components/`,
  `server/`, `lib/`, `prisma/`), built by Antigravity from my scaffold prompt.
  The full list of what it created is in `evidence/02-files-created.txt`.
- **An enquiry form** at `/enquiries/new` that posts to `/api/enquiries` and
  writes to PostgreSQL through Prisma.
- **Head and body changes** to the home page (`/`): per-route titles, a
  description, SEO, Open Graph and Twitter tags, a favicon, a simplified
  navigation, a heading max-width and `clamp()` for responsive sizing.

| Part | Choice |
|------|--------|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Database | PostgreSQL in Docker (`pgvector/pgvector:pg17`, see `docker-compose.yml`) |
| Database access | Prisma 7 with the `pg` adapter |
| Validation | Zod (`enquirySchema`, used in `app/api/enquiries/route.ts`) |

## Key decisions

### Scaffold prompt
I wrote the first draft myself, then tightened it. The final version makes
the agent read the context files, summarise them, write an implementation
plan (stack, setup commands, folder structure, files, tokens, home screen,
verification, assumptions, risks) and stop until I reply "approved". It
also limits the build to setup, folder structure, tokens and a minimal home
screen. Both versions are in `docs/scaffold-prompt.md`, and the plan I
captured before approving is in `evidence/01-agent-plan.txt`.

The context files the agent read (`docs/vetreply-prd-v2.md`, `AGENTS.md`,
`.agents/`) are excluded from this repository by `.gitignore`.

### Models
Antigravity for the scaffold, because it reads and plans before acting.
OpenCode with DeepSeek for the hero and card sections on the home page. See
`docs/model-choices.md`.

### Where the app lives
The app is at the repository root, not inside this task folder, because
Tasks 3 to 5 keep building the same app. This folder holds only Task 2's
docs and evidence.

## Getting it running and first load
- Server start: `evidence/03-server-start.txt` (Next.js 15.5.28 on port 3000)
- First load: **852 ms** (curl), of which **483 ms** was compiling 546
  modules. Reload: **123 ms**. See `evidence/04-first-load.txt` and
  `docs/performance-note.md`.

## The three breakages

### 1. Nested folder
- Error: `evidence/05-nested-folder-error.txt`
- Fixed: `evidence/06-nested-folder-fixed.txt` (both ways)
- My first attempt, inside this repository, did not fail: npm found no
  `package.json` in the nested folder, searched upward, found the repo's
  `package.json` and started my real app. I recreated it in
  `~/Desktop/nested-demo`, outside the repository, where `npm run dev` failed
  with `ENOENT: Could not read package.json`.
- Fix 1 (change directory into `vetreply/`) fixed my terminal. Fix 2 (the
  agent deleted the subfolder and rescaffolded into `nested-demo` itself)
  fixed the structure. `npm prefix` in the evidence shows which folder npm
  used each time.

### 2. Port conflict
- Error: `evidence/07-port-conflict.txt` (`EADDRINUSE` on port 3000)
- Fixed: `evidence/08-port-conflict-resolved.txt`
- Found the process with `lsof -i :3000`: PID **62576**. Ended it with
  `kill 62576`, then the server started cleanly.

### 3. 404
- Error: `evidence/09-404-error.txt` (`curl` on `/home`: 404 in 19 ms)
- Fixed: `evidence/10-404-resolved.txt` (`curl` on `/home`: 200 in 23 ms)

**What I checked, in order, before asking the agent:**
1. The URL I requested: `/home`.
2. The server log: `GET /home 404`. So the server was running and received
   the request. It wasn't a crash or a connection problem.
3. [CONFIRM: what you checked in `app/`, and what you found]
4. [CONFIRM: your conclusion]

**Fix:** [CONFIRM: what you changed]

**Did I need the agent?** No. The log and the folder check were enough.

## Is anything actually being stored?

**Write succeeded** (`evidence/11-write-succeeded-logs.txt`,
`evidence/12-database-rows.png`): on the first try, the form returned a
**303** redirect and nothing was saved where I expected; the enquiry had gone
to a different Docker database. After fixing it, two submissions returned
**201**, and both rows are in the database.

**Write failed on purpose** (`evidence/13-write-failed-logs.txt`,
`evidence/13-write-failed-ui.png`): I pointed `DATABASE_URL` at a server that
doesn't exist and submitted again. The server returned **500**, no row was
created, and the user saw: "Something went wrong. Nothing was changed. Try
again."

**No false success.** In `app/api/enquiries/route.ts`, the 201 is only
returned after `createOnlineEnquiry` succeeds (lines 32 to 33), and if it
throws, the catch returns 500 (lines 34 to 35). The form checks `res.ok`
before showing success. Full write-up: `docs/false-success.md`.

## README test
Oluwatomisin, a technical product engineer who had never seen the project,
followed the root README on 29/10/2026. They got stuck because the Getting
started section was unclear and Docker installation was missing. I added
both, and they got it running. See `docs/readme-test.md`.

## Working tree and branches
- Hand-drawn working tree: `evidence/14-working-tree-drawing.jpeg`, notes in
  `docs/working-tree.md`
- Git graph: `evidence/15-git-log-graph.txt`
- Information design branch: `information-design`, merged through
  [PR #7](https://github.com/liomotolani/Ship-And-Found-Task/pull/7)
- Branch deleted without merging: [CONFIRM: branch name]
- Commits: 38 across 4 days (26, 27, 28 and 30 October 2026)

## Information design
Full details in `docs/information-design.md`.
- Head: `evidence/head-before.txt`, `evidence/head-after.txt`,
  `evidence/16-head-route-one.png`, `evidence/17-head-route-two.png`
- Heading wrap: `evidence/18-heading-wrap-bad.png`,
  `evidence/19-heading-wrap-good.png` (`max-width: 24ch`,
  `text-wrap: balance`)
- Responsive: `evidence/Before-clamping.png`,
  `evidence/20-responsive-three-widths.png`

## What I got wrong
- My first enquiry write returned a 303 and saved to a different Docker
  database, while the form looked like it had worked.
- My first nested-folder attempt silently ran the wrong app instead of
  failing.
- The header button was 37px tall, below the 44px minimum touch target.
  Fixed with rem padding.
- The canonical URL and `og:url` point to `http://localhost:3000`. Not yet
  fixed. See `docs/defects.md`.

## Evidence

| File | What it shows |
|------|---------------|
| 01-agent-plan.txt | The agent's plan and assumptions, captured before approving |
| 02-files-created.txt | Every file and folder the scaffold created |
| 03-server-start.txt | Dev server starting on port 3000 |
| 04-first-load.txt | First load and reload timings, with server log |
| 05-nested-folder-error.txt | `ENOENT` running from the nested folder |
| 06-nested-folder-fixed.txt | Both fixes: change directory, and rescaffold in place |
| 07-port-conflict.txt | `EADDRINUSE` on port 3000 |
| 08-port-conflict-resolved.txt | `lsof`, PID 62576, `kill`, clean restart |
| 09-404-error.txt | 404 on `/home` |
| 10-404-resolved.txt | 200 on `/home` |
| 11-write-succeeded-logs.txt | 303 on the first try, then two 201s |
| 12-database-rows.png | Two rows in the database with IDs and timestamps |
| 13-write-failed-logs.txt | 500 with the database connection broken |
| 13-write-failed-ui.png | What the user saw with the database down |
| 14-working-tree-drawing.jpeg | Hand-drawn working tree, dated |
| 15-git-log-graph.txt | Branch structure and commit days |
| 16-head-route-one.png | Rendered head on `/` |
| 17-head-route-two.png | Rendered head on `/enquiries` |
| 18-heading-wrap-bad.png | Heading wrapping badly |
| 19-heading-wrap-good.png | Heading wrapping with max-width |
| 20-responsive-three-widths.png | Home page at 375px, 768px and 1280px |
| Before-clamping.png | Heading at 375px before `clamp()` |
| head-before.txt | Head tags before information design |
| head-after.txt | Head tags after information design |

## Docs
- `docs/scaffold-prompt.md`
- `docs/model-choices.md`
- `docs/performance-note.md`
- `docs/false-success.md`
- `docs/readme-test.md`
- `docs/working-tree.md`
- `docs/information-design.md`
- `docs/defects.md`
- `docs/interview-answers.md`