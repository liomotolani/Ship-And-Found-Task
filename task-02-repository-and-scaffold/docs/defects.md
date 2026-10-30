# Defects

Real defects found in my own Task 2 code, with file, line and production cost.


## Defect 1: Canonical URL and og:url point to localhost

- **File and line:** [file and line where the metadata is set]
- **What I observed:** `evidence/head-after.txt` shows
  `<link rel="canonical" href="http://localhost:3000"/>` and
  `<meta property="og:url" content="http://localhost:3000"/>` on `/`.
- **What is wrong:** both point at my local machine, not a real address.
- **Cost in production:** if deployed like this, search engines would be
  told the real home of the page is `localhost`, and shared links would
  point people to an address that only works on my laptop.
- **Status:** not yet fixed

---

## Defect 2: The header button was below the minimum touch target size

- **File and line:** [file and line of the header button styles]
- **What I observed:** the header "Get started" button had `padding: 8px 16px`.
  With 14px text on a 21px line height, it was about 37px tall.
- **What is wrong:** 37px is below the 44px minimum touch target size.
  The padding was also in px, not rem.
- **Cost in production:** on a phone or tablet, staff tapping quickly are more
  likely to miss the button.
- **Status:** I fixed it by asking the agent to use the rem values.
---
v 