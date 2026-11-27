/**
 * FAQ content. Rendered on the page and as FAQPage JSON-LD from this one list, so they can't drift.
 * TODO(client): replace every "Shared with the first early-access wave." with the confirmed fact.
 */
const PENDING = "Shared with the first early-access wave.";

export const faq: { q: string; a: string }[] = [
  {
    q: "What is Clippable?",
    a: "Clippable watches Kick and Twitch streams for you and cuts them into vertical clips while the stream is still live, ready to post to TikTok, YouTube Shorts, Instagram and X.",
  },
  {
    q: "How do clippers earn?",
    a: "Streamers run campaigns that pay per 1,000 views on the clips you post. Current campaigns pay between $0.10 and $0.75 per 1,000 views.",
  },
  {
    q: "Is Clippable free?",
    a: `Early access is free to request. ${PENDING}`,
  },
  {
    q: "How do I get paid?",
    a: PENDING,
  },
  {
    q: "Do I need followers to start?",
    a: PENDING,
  },
  {
    q: "Which platforms can I post to?",
    a: "TikTok, YouTube Shorts, Instagram Reels and X. Clips are cut vertical (9:16) for all of them.",
  },
  {
    q: "I stream. How do I get clipped?",
    a: "Start a campaign: set your rate per 1,000 views and clippers start posting your best moments. Email us to set one up during early access.",
  },
];
