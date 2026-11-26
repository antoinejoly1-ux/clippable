# Creative direction (working)

Source: `inspiration/clippable-reference-board.html` (round 2).

## What Clippable is

A **tool, not an agency**. Pick streamers, and Clippable auto-clips all of them **live, at the same time**. You download and post.
Two audiences: **Clippers** (who clip and earn) and **Streamers** (who get clipped and grow).

**The loop, understood within five seconds:** Pick streamers → Auto-clips → Download → Post

## Positioning in the category

- No competitor makes the Clipper / Streamer split a first-class choice (Cutline hides it in the nav, ClipMe in a menu). **We own it.**
- Competitors show _detection_. Nobody shows the full loop through to posting. **That's the opening.**
- Avoid the generic "glowing globe on navy" AI hero.

## Chosen direction: 1 · Live Board (recommended)

The hero **is the product, running**.

- **Headline (draft):** "Clips from every stream, the second they happen."
- **Sub:** pick your streamers, Clippable clips all of them live at the same time, you download and post.
- **App window:** streamer list (LIVE badges, clip counts), vertical clip feed sliding in, a "clips in the last hour" counter, and a download button on each clip. Status toasts float over it.
- **Two paths:** "I clip / I stream" tabs above the headline swap the headline, the app window and the CTA.
- **Look:** midnight navy, soft blue glow at the top, the blue gradient on one headline phrase and the primary button. Geist throughout, Geist Mono for numbers and timestamps only.

Parked: **2 · Type a Name** (needs a real demo, which we won't fake) and **3 · Clip Rail** (needs real, cleared footage).

## Copy rules

Plain words. Say what it does. No "revolutionary", no "moments", no unverifiable numbers.

## Build notes (Kylon)

- Build the app window as **real HTML/CSS**, not a screenshot. It's crisp, themeable, tiny, and the text is indexable.
- Loop animation: transform and opacity only, paused off-screen (IntersectionObserver), with a static final state under `prefers-reduced-motion`.
- Any counter shows real, sourced data or is clearly labelled as a demo.
- Real streamer names, faces and clips only with written permission. Until then, use clearly fictional placeholders.

## Open decisions

- [ ] Antoine's reaction to the Live Board hero mock (link it or add its file to `inspiration/`)
- [ ] Type: board recommends **Geist only**, already set up
- [ ] Written permission plus a few real clips for any real streamers
