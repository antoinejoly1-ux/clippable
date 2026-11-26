import type { Platform } from "@/components/platform-icons";

/**
 * Streamer campaigns, taken from the current Clippable site.
 * TODO(client): confirm each streamer has approved the use of their name and photo.
 */
export type Streamer = {
  id: string;
  name: string;
  platform: Extract<Platform, "kick" | "twitch">;
  avatar: string;
  rate: string;
};

export const streamers: Streamer[] = [
  {
    id: "n3on",
    name: "N3on",
    platform: "kick",
    avatar: "/media/streamers/n3on.webp",
    rate: "up to $40 / 100K views",
  },
  {
    id: "plaqueboymax",
    name: "PlaqueBoyMax",
    platform: "twitch",
    avatar: "/media/streamers/plaqueboymax.webp",
    rate: "up to $75 / 100K views",
  },
  {
    id: "lacy",
    name: "Lacy",
    platform: "twitch",
    avatar: "/media/streamers/lacy.webp",
    rate: "$20 / 100K views",
  },
  {
    id: "cuffem",
    name: "Cuffem",
    platform: "kick",
    avatar: "/media/streamers/cuffem.webp",
    rate: "$40 / 100K views",
  },
  {
    id: "blueface",
    name: "Blueface",
    platform: "kick",
    avatar: "/media/streamers/blueface.webp",
    rate: "$10 / 100K views",
  },
  {
    id: "clavicular",
    name: "Clavicular",
    platform: "kick",
    avatar: "/media/streamers/clavicular.webp",
    rate: "$40 / 100K views",
  },
  {
    id: "yourrage",
    name: "YourRAGE",
    platform: "twitch",
    avatar: "/media/streamers/yourrage.webp",
    rate: "up to $40 / 100K views",
  },
  {
    id: "lospollostv",
    name: "LosPollosTV",
    platform: "kick",
    avatar: "/media/streamers/lospollostv.webp",
    rate: "up to $30 / 100K views",
  },
];
