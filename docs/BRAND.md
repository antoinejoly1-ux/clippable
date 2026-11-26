# Clippable brand guide (working)

## Colour

| Token      | Hex       | Role                                                         |
| ---------- | --------- | ------------------------------------------------------------ |
| `royal`    | `#204FCE` | Primary buttons with white labels (6.84:1 with white)        |
| `blue`     | `#3574EF` | Core brand blue, large headings, gradients, dark-mode accent |
| `sky`      | `#6DAFF8` | Highlights, links on dark, selection                         |
| `white`    | `#FFFFFF` | Light background, text on blue                               |
| `midnight` | `#01082B` | Dark background, deep sections                               |
| `ink`      | `#1A191E` | Body text on light                                           |

**Gradients** (sampled from the supplied assets):

- App icon: `#57B2FD → #024FD5` (135°)
- Banner: `#75D0FC → #3574EF → #0039EC` (120°)

**Contrast pairs:** white/royal 6.84 ✓ · white/blue 4.29 (large text only) · sky/midnight 8.53 ✓ · blue/midnight 4.57 ✓ · white/midnight 19.61 ✓ · ink/white 17.47 ✓

## Logo

- **Mark:** rounded "C" plus a camera-viewfinder triangle (a "clip" / video camera).
- `public/brand/clippable-mark.svg` and `src/components/logo.tsx` hold a vector **traced from the 200 px PNG**. It's good enough for development, but the official vector is still needed.
- `src/app/icon.svg`: favicon (gradient tile plus white mark). `src/app/apple-icon.png`: 180 px.
- Originals: `public/brand/clippable-app-icon.png`, `clippable-banner.png`, `clippable-mark-white.png`.

## Typography

- **Geist** (sans), with **Geist Mono** for numbers and timestamps only. The reference board recommends keeping Geist alone.

## Still needed from the client

- [ ] Official logo files (SVG): mark, wordmark, horizontal lockup, mono versions
- [x] Typeface: Geist (recommended on the reference board)
- [ ] Confirm the primary conversion for each path (Clipper sign-up and Streamer sign-up?)
- [ ] Target keywords and the questions customers ask
- [ ] Production domain, social profiles, contact and security email
- [ ] Product screenshots or video for the site
