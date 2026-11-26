import type { Platform } from "@/components/platform-icons";

/** The eight example clips in the scroll story. Footage: Mixkit (free licence), see docs/MEDIA.md. */
export type StoryClip = {
  id: number;
  length: string;
  score: string;
  platform: Extract<Platform, "tiktok" | "youtubeShorts" | "instagram" | "x">;
  /** Example view count reached by the end of the story. Illustrative only. */
  views: number;
};

export const storyClips: StoryClip[] = [
  { id: 1, length: "0:23", score: "4.8", platform: "tiktok", views: 1_240_000 },
  { id: 2, length: "0:41", score: "4.6", platform: "youtubeShorts", views: 386_000 },
  { id: 3, length: "0:18", score: "4.9", platform: "instagram", views: 912_000 },
  { id: 4, length: "0:32", score: "4.5", platform: "x", views: 154_000 },
  { id: 5, length: "0:27", score: "4.7", platform: "tiktok", views: 621_000 },
  { id: 6, length: "0:36", score: "4.4", platform: "youtubeShorts", views: 247_000 },
  { id: 7, length: "0:19", score: "4.6", platform: "instagram", views: 438_000 },
  { id: 8, length: "0:29", score: "4.3", platform: "x", views: 97_000 },
];

export const storySteps = [
  {
    label: "01 · Live",
    title: "One live stream.",
    body: "Clippable watches it in real time, every minute, so you don't have to.",
  },
  {
    label: "02 · Clipped",
    title: "Cut into clips as it happens.",
    body: "The best moments are found, trimmed, titled and scored automatically.",
  },
  {
    label: "03 · Posted",
    title: "Posted everywhere. Views keep climbing.",
    body: "Download, post to TikTok, Shorts, Reels and X, and earn per 1,000 views.",
  },
] as const;

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
export const formatViews = (n: number) => compact.format(Math.round(n));
