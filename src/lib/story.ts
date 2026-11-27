/**
 * The eight vertical clips in the hero story, by file number in public/media/clips.
 * Placeholder footage (Mixkit, free licence) until the client's clips are encoded with
 * scripts/encode-clips.sh.
 */
export const storyClips = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => ({ id, key: `c${id}` }));

/**
 * Tiles in the story. Large screens show a 5 × 2 grid, so two clips repeat there;
 * smaller screens use the first eight.
 */
export const storyTiles = [...storyClips, { id: 1, key: "c1b" }, { id: 4, key: "c4b" }];
