import type { Platform } from "@/components/platform-icons";

/**
 * Streamer campaigns, taken from the current Clippable site.
 * Photos and banners are each streamer's own official channel images (Kick / Twitch),
 * fetched Nov 2026. TODO(client): confirm each streamer approves this use before launch.
 */
export type Streamer = {
  id: string;
  name: string;
  platform: Extract<Platform, "kick" | "twitch">;
  avatar: string;
  /** Portrait (3:4) crop of the official profile picture. */
  photo: string;
  /** Portrait crop of the official channel banner, when there's a good one. */
  banner?: string;
  /** Channel handle on the platform. */
  handle: string;
  rate: string;
};

export const streamers: Streamer[] = [
  {
    id: "n3on",
    name: "N3on",
    platform: "kick",
    avatar: "/media/streamers/n3on.webp",
    photo: "/media/streamers/n3on-photo.webp",
    banner: "/media/streamers/n3on-banner.webp",
    handle: "n3on",
    rate: "up to $40 / 100K views",
  },
  {
    id: "plaqueboymax",
    name: "PlaqueBoyMax",
    platform: "twitch",
    avatar: "/media/streamers/plaqueboymax.webp",
    photo: "/media/streamers/plaqueboymax-photo.webp",
    handle: "plaqueboymax",
    rate: "up to $75 / 100K views",
  },
  {
    id: "lacy",
    name: "Lacy",
    platform: "twitch",
    avatar: "/media/streamers/lacy.webp",
    photo: "/media/streamers/lacy-photo.webp",
    handle: "lacy",
    rate: "$20 / 100K views",
  },
  {
    id: "cuffem",
    name: "Cuffem",
    platform: "kick",
    avatar: "/media/streamers/cuffem.webp",
    photo: "/media/streamers/cuffem-photo.webp",
    banner: "/media/streamers/cuffem-banner.webp",
    handle: "cuffem",
    rate: "$40 / 100K views",
  },
  {
    id: "blueface",
    name: "Blueface",
    platform: "kick",
    avatar: "/media/streamers/blueface.webp",
    photo: "/media/streamers/blueface-photo.webp",
    handle: "blueface",
    rate: "$10 / 100K views",
  },
  {
    id: "clavicular",
    name: "Clavicular",
    platform: "kick",
    avatar: "/media/streamers/clavicular.webp",
    photo: "/media/streamers/clavicular-photo.webp",
    banner: "/media/streamers/clavicular-banner.webp",
    handle: "clavicular",
    rate: "$40 / 100K views",
  },
  {
    id: "yourrage",
    name: "YourRAGE",
    platform: "twitch",
    avatar: "/media/streamers/yourrage.webp",
    photo: "/media/streamers/yourrage-photo.webp",
    handle: "yourragegaming",
    rate: "up to $40 / 100K views",
  },
  {
    id: "lospollostv",
    name: "LosPollosTV",
    platform: "kick",
    avatar: "/media/streamers/lospollostv.webp",
    photo: "/media/streamers/lospollostv-photo.webp",
    handle: "lospollostv",
    rate: "up to $30 / 100K views",
  },
];
