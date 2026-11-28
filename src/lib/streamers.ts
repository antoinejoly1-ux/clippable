import type { Platform } from "@/components/platform-icons";

/**
 * Streamers shown on the site, in the client's order (Nov 2026 list).
 * Photos and banners are each streamer's own official channel images (Kick / Twitch),
 * fetched Nov 2026. TODO(client): confirm each streamer approves this use before launch.
 */
export type Streamer = {
  id: string;
  name: string;
  /** Where they stream. Left out where it isn't confirmed; the badge is then hidden. */
  platform?: Extract<Platform, "kick" | "twitch" | "youtube">;
  avatar: string;
  /** Portrait photo, shown on the left of the showcase. */
  photo: string;
  /** A second photo, shown full-bleed on the right. */
  photo2?: string;
  /** Portrait crop of the official channel banner, when there's a good one. */
  banner?: string;
  handle: string;
  /** Campaign payout per 1,000 views, as listed on the current Clippable site (converted from per-100K). */
  rate?: string;
};

const m = (id: string) => `/media/streamers/${id}`;

// Avatars are each streamer's own channel picture (Kick, Twitch, or YouTube for IShowSpeed), fetched Nov 2026.
// TODO(client): confirm Rakai's main platform and channel (no verified Kick/Twitch/YouTube match), and rates for the new names.
export const streamers: Streamer[] = [
  {
    id: "n3on",
    name: "N3on",
    platform: "kick",
    avatar: m("n3on.webp"),
    photo: m("n3on-photo.webp"),
    photo2: m("n3on-photo-2.webp"),
    banner: m("n3on-banner.webp"),
    handle: "n3on",
    rate: "up to $0.40 / 1K views",
  },
  {
    id: "lacy",
    name: "Lacy",
    platform: "twitch",
    avatar: m("lacy.webp"),
    photo: m("lacy-photo.webp"),
    photo2: m("lacy-photo-2.webp"),
    handle: "lacy",
    rate: "$0.20 / 1K views",
  },
  {
    id: "plaqueboymax",
    name: "PlaqueBoyMax",
    platform: "twitch",
    avatar: m("plaqueboymax.webp"),
    photo: m("plaqueboymax-photo.webp"),
    photo2: m("plaqueboymax-photo-2.webp"),
    handle: "plaqueboymax",
    rate: "up to $0.75 / 1K views",
  },
  {
    id: "cuffem",
    name: "Cuffem",
    platform: "kick",
    avatar: m("cuffem.webp"),
    photo: m("cuffem-photo.webp"),
    photo2: m("cuffem-photo-2.webp"),
    handle: "cuffem",
    rate: "$0.40 / 1K views",
  },
  {
    id: "clavicular",
    name: "Clavicular",
    platform: "kick",
    avatar: m("clavicular.webp"),
    photo: m("clavicular-photo.webp"),
    photo2: m("clavicular-photo-2.webp"),
    banner: m("clavicular-banner.webp"),
    handle: "clavicular",
    rate: "$0.40 / 1K views",
  },
  {
    id: "blueface",
    name: "Blueface",
    platform: "kick",
    avatar: m("blueface.webp"),
    photo: m("blueface-photo.webp"),
    photo2: m("blueface-photo-2.webp"),
    handle: "blueface",
    rate: "$0.10 / 1K views",
  },
  {
    id: "kaicenat",
    name: "Kai Cenat",
    platform: "twitch",
    avatar: m("kaicenat.webp"),
    photo: m("kaicenat-photo.webp"),
    photo2: m("kaicenat-photo-2.webp"),
    handle: "kaicenat",
  },
  {
    id: "ishowspeed",
    name: "IShowSpeed",
    platform: "youtube",
    avatar: m("ishowspeed.webp"),
    photo: m("ishowspeed-photo.webp"),
    photo2: m("ishowspeed-photo-2.webp"),
    handle: "ishowspeed",
  },
  {
    id: "rakai",
    name: "Rakai",
    avatar: m("rakai.webp"),
    photo: m("rakai-photo.webp"),
    photo2: m("rakai-photo-2.webp"),
    handle: "rakai",
  },
  {
    id: "stableronaldo",
    name: "Stable Ronaldo",
    platform: "twitch",
    avatar: m("stableronaldo.webp"),
    photo: m("stableronaldo-photo.webp"),
    photo2: m("stableronaldo-photo-2.webp"),
    handle: "stableronaldo",
  },
  {
    id: "ddg",
    name: "DDG",
    platform: "kick",
    avatar: m("ddg.webp"),
    photo: m("ddg-photo.webp"),
    photo2: m("ddg-photo-2.webp"),
    handle: "ddg",
  },
  {
    id: "bendadonnn",
    name: "BenDaDonnn",
    platform: "kick",
    avatar: m("bendadonnn.webp"),
    photo: m("bendadonnn-photo.webp"),
    photo2: m("bendadonnn-photo-2.webp"),
    handle: "bendadonnn",
  },
];
