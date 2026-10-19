// Shared by the drum-hit counter's endpoint and the drum pad: the most hits one request may add.
// The pad sends its hits in batches, a couple of seconds' worth at a time, so this is far more than
// a visitor can play in one batch, but it stops a single request adding a huge number
export const maxHitsPerRequest = 50;
