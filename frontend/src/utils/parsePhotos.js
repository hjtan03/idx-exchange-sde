// L_Photos is stored as a raw JSON string in the database, but real MLS
// data is inconsistent: it can be a valid array of URLs, a malformed/
// truncated JSON string, or entirely null/undefined for listings with no
// photos. JSON.parse() throws on anything that isn't valid JSON, and even
// valid JSON might not be an array (e.g. a single object or a number), so
// this function defensively falls back to an empty array in either failure
// case rather than letting a bad value crash whatever component calls it.
export function parsePhotos(l_photos) {
  try {
    const photos = JSON.parse(l_photos);
    return Array.isArray(photos) ? photos : [];
  } catch {
    return [];
  }
}