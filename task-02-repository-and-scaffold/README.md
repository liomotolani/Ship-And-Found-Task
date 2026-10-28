## The three breakages

### 1. Nested folder
- Error: `evidence/05-nested-folder-error.txt`
- Fixed: `evidence/06-nested-folder-fixed.txt` (both ways)
- What happened: [1 to 2 lines. Include the first attempt, where npm
  searched upward, found the repo's package.json and started my real
  app instead of failing.]
- Fix 1 (change directory) fixed my terminal. Fix 2 (rescaffold in
  place) fixed the structure, so nobody else hits it.

### 2. Port conflict
- Error: `evidence/07-port-conflict.txt` (`EADDRINUSE` on port 3000)
- Fixed: `evidence/08-port-conflict-resolved.txt`
- Found the process with `lsof -ti:3000 | xargs kill -9`, PID 62576,
  ended with `kill 62576`, then the server started cleanly.

### 3. 404
- Error: `evidence/09-404-error.txt` (404 on /home in 413ms)
- Fixed: `evidence/10-404-resolved.txt` (200 on /home)

**What I checked, in order, before asking the agent:**
1. The URL I requested: `/home`.
2. The server log: `GET /home 404 in 413ms`. So the server was running and received the request. It wasn't a crash or a connection problem.
3. `src/app/` for a `home` folder with a `page.tsx` inside it. There wasn't one.
4. Conclusion: the route was never created. In the App Router, a page only exists if `src/app/[route]/page.tsx` exists.

**Fix:** 
Created src/app/home/page.tsx with home
content. The same curl now returns 200."

**Did I need the agent?** 
No. The log and the folder check were enough.