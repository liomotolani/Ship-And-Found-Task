# Interview answers

Fifteen answers, 200 words maximum each.


## 1. What is the difference between Git Flow and trunk-based development, and why have a lot of teams moved toward trunk-based?

Git Flow uses several long-lived branches: `main` for released code, `develop` for integration, plus feature, release and hotfix branches. Work can live on a branch for days or weeks before it is merged, and releases are prepared on their own branch.

Trunk-based development keeps one main branch (the trunk). Developers merge small changes into it at least daily, using short-lived branches if any, and hide unfinished work behind feature flags.

Teams have moved toward trunk-based because long-lived branches drift apart. The longer a branch lives, the bigger and riskier the merge, and the later problems are found. Trunk-based development fits continuous integration and deployment: every change is small, tested automatically and merged quickly, so conflicts stay small and the trunk is always close to releasable.

Git Flow still suits software with formal, versioned releases where several versions are supported at once. For a web app deployed many times a day, its ceremony slows teams down without adding much safety.

---

## 2. What does git push --force actually do, and why is --force-with-lease generally safer?

`git push --force` makes the remote branch match your local branch exactly, whatever is on the remote. If a teammate pushed commits since you last fetched, those commits are thrown away on the remote without warning.

`git push --force-with-lease` only overwrites the remote if it is still where you last saw it. Git checks the remote branch against your remote-tracking reference (for example `origin/main`). If someone has pushed since your last fetch, the push is refused, and you can fetch, look at their work, and decide what to do.

So `--force` says "replace it, whatever is there", and `--force-with-lease` says "replace it, but only if nobody has changed it since I looked".

One catch: if you run `git fetch` without looking at what came in, your tracking reference updates and the lease check can pass even though you never saw the new commits. It is safer, not foolproof.

---

## 3. Why is rewriting history, through rebase, amend or force push, dangerous on a shared branch?

A commit's ID is a hash of its content and its parent. Rebasing or amending creates new commits with new IDs, even if the code looks the same. The old commits still exist in everyone else's copy of the branch.

On a shared branch, teammates have already built on the old commits. When you force push the rewritten history, their branches no longer match the remote. When they pull, Git sees two histories, which leads to duplicate commits, confusing conflicts, or their work being lost if someone else force pushes over it.

It also breaks trust in the record. Pull request links, deployment logs and bug reports may refer to commit IDs that no longer exist on the branch.

On my own unpushed branch, rewriting is fine and often useful for tidying commits. The rule is not to rewrite anything other people may have pulled. To undo a mistake on a shared branch, use `git revert`, which adds a new commit that reverses the change and leaves history intact.

---

## 4. What is the difference between git merge and git rebase, and when would you actually pick one over the other?

Both bring changes from one branch into another, but they record it differently.

`git merge` joins the two histories with a merge commit. Every original commit stays exactly as it was, so the history shows truthfully when work happened in parallel and when it came together. The cost is a busier, non-linear history.

`git rebase` replays your commits on top of the other branch, as if you had started from its latest commit. The result is a straight, linear history, but your commits get new IDs.

I would rebase my own local feature branch onto the latest `main` before opening a pull request, so the branch is up to date and easy to review. Nobody else has those commits, so rewriting them is safe.

I would merge when bringing a finished branch into `main`, or whenever the branch is shared, because merging never rewrites commits other people depend on.

The simple rule: rebase what only you have, merge what others have seen.

---

## 5. What causes a merge conflict, and what is actually happening in the file when you see the conflict markers?

A conflict happens when two branches change the same lines of the same file differently, or when one branch edits a file the other deleted. Git can combine changes to different parts of a file on its own, but when both sides changed the same lines, it cannot know which version is right, so it stops and asks.

Git then writes both versions into the file, between markers:

```
<<<<<<< HEAD
your version (the branch you are on)
=======
their version (the branch being merged in)
>>>>>>> feature-branch
```

These markers are real text written into the file. The file is in a half-merged state and will not compile until they are removed.

Resolving means editing the file to the correct final content, which might be one side, the other, or a combination, deleting all the markers, then running `git add` on the file and finishing the merge or rebase.

The risk is resolving mechanically by picking one side without understanding both changes, which can silently drop a teammate's fix.

---

## 6. What is the difference between the working directory, the staging area and the repository?

They are the three places a change passes through before it is saved in Git.

The working directory is the files on disk that you edit. Changes here are not tracked as saved yet.

The staging area (also called the index) is a draft of the next commit. `git add` copies a change from the working directory into it. It lets you choose exactly what goes into a commit, for example committing one fix while leaving unfinished work out.

The repository is the `.git` folder, holding every commit. `git commit` takes whatever is staged and saves it permanently as a new commit.

`git status` shows all three: what is changed but not staged, what is staged, and what is already committed.

This matters for secrets. A file like `.env` should never be staged. Adding it to `.gitignore` stops `git add` from picking it up, and checking `git status` before each commit confirms it is not in the staging area.

---

## 7. What is branch protection, and what does it typically enforce?

Branch protection is a set of rules on a hosting platform, such as GitHub, that controls how changes reach an important branch, usually `main`.

It typically enforces:
- changes must go through a pull request, so nobody pushes directly
- a minimum number of approving reviews before merging
- status checks, such as tests and linting, must pass first
- the branch must be up to date with `main` before merging
- force pushes and branch deletion are blocked
- sometimes signed commits or a linear history

The point is that the rules do not depend on people remembering. Everyone, often including admins, has to follow the same path, so a rushed or mistaken change cannot skip review or tests.

It does not guarantee the code is good. Reviewers can approve without reading, and tests only catch what they test. It makes the safe path the only path, which is the difference between a policy and a habit.

---

## 8. Walk me through a technical project you built end to end.

VetReply helps vet practice teams reply to client messages, with every reply grounded in the practice's own documents and approved by staff before it is sent.

I started with the design system: a brand colour, #0E7C7B, pinned in Figma, a 15-style type scale in Source Sans 3, and shadows, exported as tokens and converted to CSS variables.

I wrote the scaffold prompt myself, so the agent read the brief and the tokens, produced a plan, and waited for approval before writing code. It built a Next.js 15 app with a home page.

I then tested what was really running. I broke the server three ways: a nested folder, a port conflict (`EADDRINUSE` on port 3000), and a 404. I added a form that writes to the database to take clients enquires, confirmed it with the 201 in the logs and the rows in the database, then broke the database connection and confirmed the user saw an error rather than a false success.


---

## 9. Tell me about a time when something you built broke in production.


- **What I built:** A free mentorship platform for solo mewntors to track their journey as they mentor others and a well tracked public record.
- **What broke:** I tried deploying into production with a missing environment variable. So during deoployment the whole process broke.
- **How we found out:** I found out because the deployment failed.
- **How I diagnosed it:** I read the logs and found out what was missing. 
- **The cause:** I tried deploying into production with a missing environment variable. So during deoployment the whole process broke.
- **The fix:** RThrough the logs I found out what was missing. So I added it in and redeployed, after which the whole process worked fine.
- **What changed afterwards:** I created a run book, that list the steps to deploy into production.

---

## 10. How do you approach learning a new technical platform or codebase quickly when starting a new engagement?


In Task 2 the approach I used was to read the context first and then check what is actually running, rather than trusting how things look.

Reading first: before any code was written, the agent and I worked from the business brief, the design tokens and the type scale, and the agent had to summarise them and plan before building.

Then checking what runs: I started the dev server and read its output, timed the first load against the server log, and confirmed behaviour with `curl` rather than only the browser. I thought my page title already changed between routes, but `curl` showed the server sending `VetReply` on both.

When something failed, I diagnosed it myself before asking for help: for the 404, I checked 

---

## 11. What is the difference between code that is correct and code that is complete?

Correct code does what it was written to do for the cases the author had in mind. Complete code also handles everything around those cases: errors, edge cases, bad input, failure of the things it depends on, and the information the next person needs to run and maintain it.

Code can be correct and still incomplete. A form handler that saves a record and returns success is correct on the happy path. If it never considers the database being unavailable, it is incomplete, and the gap only shows when something goes wrong.

In Task 2 I tested this directly: I broke the database connection on purpose and submitted the form. My app showed the user an error instead of a false success, so that path was handled.

My page title is an example of the opposite. I thought it already changed between routes, but `curl` showed the server sent "VetReply" for every route, so search results and link previews could not tell my pages apart.

Completeness is proven by testing the unhappy paths, not by the happy path working.

---

## 12. How do you design software for a customer who will need to maintain it after you are gone?

By making the system explain itself, so nothing depends on me being there.

The README has to get a stranger from a fresh clone to a running app with exact commands, list every environment variable by name without values, and say honestly what is unfinished and what is deliberately out of scope. 

Decisions are written down with their reasons. My design system records why the brand colour and font were chosen and where each choice would be wrong, so a future maintainer can change them knowingly.

Values have one source. Colours and type live as tokens referenced everywhere, so a rebrand is one change rather than a search across the codebase.

Known defects are listed with file references, so the next person knows where the weak points are.


---

## 13. Your first page load took a specific number of milliseconds. Where did that time go? Name the parts you can measure and the parts you are guessing about.

My first load was 852 ms measured with `curl`, and 123 ms on reload.

What I can measure, from the server log and `curl`:
- 483 ms compiling the home page. The log says "Compiled / in 483ms (546 modules)". That is 57% of the first load.
- 319 ms rendering and serving after compiling. The server logged "GET / 200 in 802ms", and 802 minus 483 is 319.
- 50 ms outside the server, the difference between `curl` (852) and the server log (802).
- On reload, compilation is skipped: the server logged 83 ms and `curl` measured 123 ms.

What I am guessing:
- Which of the 546 modules are mine and which are the framework. I have not broken that down.
- How much dev mode adds compared with a production build. I have not timed one.
- What a real browser adds. `curl` only fetches the HTML, not the CSS, JavaScript or the Source Sans 3 font, so a real first visit would take longer than 852 ms.

Most of the first-load time is compilation, which only happens in development.

---

## 14. Your application reported success to the user while writing nothing to the database. Explain the mechanism that allowed that, and name the one check that would have caught it in thirty seconds.

My application did not do this. When I broke the database connection and submitted the form, the user saw an error and the server logged a 500, and no row was created.

What prevented it in my code: The API returns an error status when the write fails, and the form checks the response before showing success.

The mechanism that allows a false success, as in the class example, is one of two things. Either the server catches the database error but still returns a success status such as 200, or the front end shows "success" as soon as the request finishes, without checking the status code or response body. In both cases the screen is driven by the request completing, not by the record being created.

The thirty-second check: submit the form and look in the server log for a 201. A 201 means a record was created. If there is no 201, nothing was stored, whatever the screen says.

---

## 15. Wrong-answer analysis

The dashboard loading proves the front end can render a page and route to it. It does not prove anything was saved. A redirect can happen whether the signup succeeded or failed, if the code redirects as soon as the request finishes.

What it misses:
- whether a record was created at all
- whether the server returned an error that the front end ignored
- what happens when the database is unavailable
- whether the user can log in again later, which only works if the account really exists

That is how the founder in the brief had a working-looking product and zero signups: every visitor saw a success screen, and nobody was ever stored.

What I would do instead: submit the form and check the server log for a 201, then open the database and find the row with its ID and timestamp. Then break the database connection and submit again, to see what the user is shown when the write fails.

I made the same mistake with my page title: I thought it already changed between routes, but `curl` showed the server sent `VetReply` on both.

