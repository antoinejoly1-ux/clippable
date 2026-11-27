/**
 * Testimonials from real clippers and streamers.
 * TODO(client): replace every placeholder with a real quote, name, handle and photo,
 * with written permission to publish. Never ship invented testimonials.
 */
export type Testimonial = {
  role: "Clipper" | "Streamer";
  quote: string;
  name: string;
  detail: string;
  /** Background image for the card. */
  image: string;
  placeholder: boolean;
};

export const testimonials: Testimonial[] = [
  {
    role: "Clipper",
    quote: "A real quote from a clipper goes here.",
    name: "Clipper name",
    detail: "@handle · platform",
    image: "/media/clips/clip-3.webp",
    placeholder: true,
  },
  {
    role: "Streamer",
    quote: "A real quote from a streamer goes here.",
    name: "Streamer name",
    detail: "@handle · Kick or Twitch",
    image: "/media/clips/clip-2.webp",
    placeholder: true,
  },
  {
    role: "Clipper",
    quote: "A real quote from a clipper goes here.",
    name: "Clipper name",
    detail: "@handle · platform",
    image: "/media/clips/clip-6.webp",
    placeholder: true,
  },
];
