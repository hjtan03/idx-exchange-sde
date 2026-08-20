export function parsePhotos(l_photos) {
  try {
    const photos = JSON.parse(l_photos);
    return Array.isArray(photos) ? photos : [];
  } catch {
    return [];
  }
}