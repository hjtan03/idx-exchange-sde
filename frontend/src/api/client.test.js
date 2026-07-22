import { fetchProperties } from './client';

describe('fetchProperties', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns parsed JSON on a successful response', async () => {
    const mockData = { total: 1, limit: 20, offset: 0, results: [{ id: 1 }] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await fetchProperties();

    expect(result).toEqual(mockData);
  });

  test('throws a meaningful error when response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await expect(fetchProperties()).rejects.toThrow('Failed to fetch properties: 500 Internal Server Error');
  });

  test('builds query string correctly from filter params', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ total: 0, limit: 20, offset: 0, results: [] })
    });

    await fetchProperties({ city: 'Austin', beds: '3' });

    expect(global.fetch).toHaveBeenCalledWith('/api/properties?city=Austin&beds=3');
  });
});