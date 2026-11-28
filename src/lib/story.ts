/**
 * The eight vertical N3on clips in the hero story: public/media/clips/n3on-<id>.*
 */
export const storyClips = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => ({ id, key: `c${id}` }));

/**
 * Tiles in the story. Large screens show a 5 × 2 grid, so two clips repeat there;
 * smaller screens use the first eight.
 */
export const storyTiles = [...storyClips, { id: 1, key: "c1b" }, { id: 4, key: "c4b" }];
