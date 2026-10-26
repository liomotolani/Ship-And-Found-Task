# Shadows

## Shadow colour
All three shadows use the brand colour #0E7C7B (rgb 14, 124, 123),
not black, at different opacities.

## The three shadows

| Shadow | X      | Y      | Blur | Spread | Colour  | Opacity |
|--------|--------|--------|------|--------|---------|---------|
| Soft   | 1.5    | 6      | 30   | 0      | #0E7C7B | 12%    |
| Medium | 4      | 6      | 24   | 0      | #0E7C7B | 18%    |
| Hard   | 6      | 10     | 20   | 0      | #0E7C7B | 20%     |

## What each value does
- X: moves the shadow left or right. Uses positive values (1.5, 4, 6) to
  shift the shadow right, indicating light coming from the top-left,
  shifting further right as elevation increases.
- Y: moves the shadow down. Set to 6 for Soft and Medium, and rises to 10
  for Hard so higher elements look further off the page.
- Blur: softens the edge. Soft uses the highest blur (30) for a diffuse,
  gentle spread, stepping down to 24 (Medium) and 20 (Hard) for sharper
  definition on higher elements.
- Spread: grows or shrinks the shadow before blurring. Kept at 0 for
  all three shadows so they don't artificially expand or shrink beyond
  the element's edges.
- Opacity: how strong the shadow is. It rises with each level (12%, 18%,
  20%) so higher elements look more prominent and cast deeper shadows.

## Where each shadow is used in VetReply

| Shadow | Used for                                     | Why                                                    |
|--------|----------------------------------------------|--------------------------------------------------------|
| Soft   | Message cards in the inbox list              | separates cards without adding visual noise            |
| Medium | the drafted reply panel                      | lifts the reply staff are working on            |
| Hard   | dialogs, such as "approve and send"          | sits above everything, so it demands attention  |

## Why brand colour instead of black
A black shadow looks grey and dirty on a light page, as if the card is smudged. A shadow tinted with the brand teal looks like part of the same light, so cards feel gently lifted, which matches the calm and uncluttered feel VetReply needs.

## When this would be wrong
In dark mode, a teal shadow on a dark background is almost invisible, so dark mode would need lighter surface
colours to show elevation instead of shadows. A teal shadow would also clash if a card had a red error background.

## Evidence
Shadows defined as Figma effect styles: Shadow/Soft, Shadow/Medium, Shadow/Hard. Exported in evidence/06-tokens-complete.json.