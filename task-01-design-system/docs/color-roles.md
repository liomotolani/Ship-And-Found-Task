
# Colour roles

## Brand colour
#0E7C7B. I choose this because it is mostly used by vetclinic products I had other options but it is calmer and more friendly.

## Pinning
Before pinning, Material Theme Builder placed #006A69 at primary 40,
a darker teal than my brand colour, because #0E7C7B naturally sits at
tone 47. My exact brand colour appeared nowhere in the palette. After
pinning, primary 40 is #0E7C7B, so every button and link uses the real
brand colour. The tones around it shifted slightly to stay consistent.

## Tonal palettes
Each palette has 14 tones: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100.

Light mode uses the darker tones (around 40) for colours and the light
tones (90 to 99) for backgrounds. Dark mode flips this, using around 80
for colours and 10 to 20 for backgrounds. 14 steps covers both ends with
enough in between for hover and pressed states.

## Functional colours

Error: #B3261E. I chose this because it is a red tone that sits well with the brand colour.
Warning: #8A5D00. I chose this because it is a yellow-orange tone that sits well with the brand colour.
Success: #146C60. I chose this because it is a teal tone that sits well with the brand colour.

## Roles

## Contrast ratios
| Foreground                     | Background                    | Ratio   | Used for        | Pass?                                     |
|--------------------------------|-------------------------------|---------|-----------------|-------------------------------------------|
| on-primary #FFFFFF             | primary #0E7C7B               | 5.01:1  | button text     | Yes (AA)                                  |
| primary #0E7C7B                | surface #FAFAFA               | 4.80:1  | link text       | Yes (AA)                                  |
| on-surface #171A1A             | surface #FAFAFA               | 16.77:1 | body text       | Yes (AAA)                                 |
| on-surface-variant #434C4C     | surface #FAFAFA               | 8.46:1  | helper text     | Yes (AAA)                                 |
| error #B3261E                  | surface #FAFAFA               | 6.31:1  | error messages  | Yes (AA)                                  |
| on-primary-container #00504F   | primary-container #F1FFFE     | :1 | highlight text  | Yes (AAA)                                 |
| outline #757F7F                | surface #FAFAFA               | 3.94:1  | input borders   | Yes for borders (3:1). Not used for text  |
| warning #8A5D00               | surface #FAFAFA               |  5.51:1       | warnings        | Yes (AA)                                  |
| success #146C60               | surface #FAFAFA               |  6.01:1       | success message | Yes (AA) 

## Contrast ratio reasons 
The brand colour only just passes. White on 
#0E7C7B is 5.01:1, and AA needs 4.5:1. If anyone lightens the brand colour later, button text will fail.
White text beats black on the brand colour. Black on 
#0E7C7B is only 4.19:1, which fails. So on-primary must be white.
The outline colour fails for text. At 3.94:1 it passes as a border but not as text, so it's documented as "not used for text".