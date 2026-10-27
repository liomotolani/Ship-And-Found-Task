# Prompts

Every prompt I gave the agent during Task 1, copied word for word, in the
order I sent them. Failed attempts are kept, with what went wrong and
what I changed.


## Prompt 1: JSON to CSS script

**Goal:** Convert demo/tokens.json into CSS variables, with colour roles
referencing palette tones instead of copying hex values.

**Prompt (verbatim):**
```
Read demo/tokens.json. Write a Node script at demo/build-tokens.js that
converts it into demo/tokens.css.

Rules:
1. Output CSS custom properties on :root.
2. Create primitive variables for palette tones, named like --palette-primary-40.
3. Create role variables that REFERENCE the primitives, for example
   --color-primary: var(--palette-primary-40);
   Never copy a hex value into a role variable.
4. Create typography variables for all 15 styles: font family, size,
   weight, line height, letter spacing, named like --type-body-large-size.
5. Create shadow variables --shadow-soft, --shadow-medium, --shadow-hard.
6. Components must only ever use role, type and shadow variables.
   Primitive palette variables exist only for roles to point at.
7. After writing it, list every variable you created and confirm no role
   contains a raw hex value.
```

**What happened:**
It wrote a script, the role in tokens.css had no hex value
copied in, for example it had --color-primary: var(--palette-primary-40) , instead of #0E7C7B. It worked perfectly.

**Did it work?** Yes  

**What I changed and why:**
Nothing

---

## Prompt 2: Welcome screen WITHOUT the design system

**Goal:** Build a baseline screen with no design files, to show what the
agent produces by default.

**Prompt (verbatim):**
```
Build a single HTML page at demo/without-system/index.html for VetReply  ignore any token.css, just build something:
a welcome screen with a heading, short description, and a "Get started" button.
```

**What happened:**
"Generic look: default blue button, system font, grey shadows."
See evidence/09-screen-without-system.png.

**Did it work?** Yes

---

## Prompt 3: Welcome screen WITH the design system

**Goal:** Build the same screen using only role, type and shadow
variables from tokens.css.

**Prompt (verbatim):**
```
[Read demo/tokens.css and docs/type-scale.md first. Summarise what you read
and wait for my approval.
Then build demo/with-system/index.html: the same welcome screen.
Use ONLY role, type and shadow variables from tokens.css.
No hex, rgb or hsl values anywhere outside tokens.css.
Heading uses Display Small, description uses Body Large,
button text uses Label Large.]
```

**What happened:**
It summarised tokens.css and waited for approval, then built the
screen. See evidence/10-screen-with-system.png.

**Did it work?** Yes

**What I changed and why:**
Nothing

---