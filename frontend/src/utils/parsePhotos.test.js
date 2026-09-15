import { parsePhotos } from './parsePhotos';

describe('parsePhotos', () => {
  test('returns the array as-is when input is a valid JSON array', () => {
    const input = JSON.stringify(['photo1.jpg', 'photo2.jpg']);
    expect(parsePhotos(input)).toEqual(['photo1.jpg', 'photo2.jpg']);
  });

  test('returns an empty array when JSON is valid but not an array', () => {
    expect(parsePhotos(JSON.stringify({ foo: 'bar' }))).toEqual([]);
    expect(parsePhotos(JSON.stringify(5))).toEqual([]);
  });

  test('returns an empty array when input is malformed JSON', () => {
    expect(parsePhotos('not valid json')).toEqual([]);
  });

  test('returns an empty array when input is null or undefined', () => {
    expect(parsePhotos(null)).toEqual([]);
    expect(parsePhotos(undefined)).toEqual([]);
  });
});