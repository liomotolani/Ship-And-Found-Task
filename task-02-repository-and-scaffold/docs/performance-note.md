# Performance note

## Numbers
- First load: 852 ms (curl), status 200
- Reload: 123 ms (curl), status 200
- Target: about 10 ms, the figure used in class
- Gap: 842 ms on first load, 113 ms on reload

## Where the time went

What I can measure (from the server log and curl):
- 483 ms compiling the home page. The log says "Compiled / in 483ms
  (546 modules)". That is 57% of the first load.
- 319 ms rendering and serving the page after compiling (802 - 483).
- 50 ms outside the server, such as opening the connection
  (852 from curl - 802 from the server log).
- On reload, compiling is skipped, so the server takes 83 ms and the
  total drops to 123 ms.

What I'm guessing:
- 546 modules is a lot for a page with a heading, a tagline and one
  button. I think most are framework and React code rather than mine,
  but I haven't checked which.
- Dev mode is slower than production because it isn't optimised and
  includes extra checks. I haven't measured a production build yet
  (npm run build, then npm start).
- curl only fetches the HTML. A real browser also loads CSS, JavaScript
  and the Google font, so a real first visit would be slower than 852 ms.

## How far from the target
Even the reload (123 ms) is about 12 times the 10 ms target. Most of the
first-load gap is compilation, which only happens in development. The
next step would be timing a production build to see what real users get.