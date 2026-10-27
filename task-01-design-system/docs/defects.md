# Defects
 
Real defects in my own Task 1 code, with file, line and production cost.

## Defect 1: Shadows built from a neutral colour instead of the brand colour (found and fixed)
 
- **File and line:** `demo/tokens.css`, lines [x to y] (`--shadow-soft`, `--shadow-medium`, `--shadow-hard`), and the three shadow effect styles in Figma
- **What was wrong:** When I created the shadows in Figma, I left the shadow colour as pure black instead of the brand primary #0E7C7B, which is exactly what the brief said not to do. The token export and the CSS carried the mistake through unchanged:
```css
--shadow-soft: 1.5px 6px 30px 0px rgba(0, 0, 0, 0.12);
--shadow-medium: 4px 6px 24px 0px rgba(0, 0, 0, 0.18);
--shadow-hard: 6px 10px 20px 0px rgba(0, 0, 0, 0.2);
```
- **How I found it:** While writing shadows.md, I went to record the shadow colour and saw it was a neutral tone, not the primary.
- **Cost in production:** Cards and dialogs would have grey, slightly dirty-looking shadows on a teal interface, working against the calm, clean feel in the business brief. It would also mean shadows never follow a rebrand, because they are not connected to the brand colour at all. Worse, the docs would have said the shadows were brand-coloured when they were not, so anyone trusting the docs would be misled.
- **Fix:** Changed all three Figma effect styles to use the primary colour at [8%, 12%, 20%] opacity. Re-exported `evidence/06-tokens-complete.json`, re-ran `node demo/build-tokens.js`, and checked `tokens.css` now shows the primary colour in each shadow. Commit: 4a811e33b0385deb107a8a5d03671f4cafa906c0.
- **What I learned:** The token pipeline faithfully copies whatever Figma holds, including mistakes. Exporting does not check anything. Review in Figma has to happen before export.
---