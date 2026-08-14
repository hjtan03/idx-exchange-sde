const BASE_URL = '/api';

export async function fetchProperties(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/properties${query ? `?${query}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchPropertyDetail(id) {
  const response = await fetch(`${BASE_URL}/properties/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch property: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchOpenHouses(id) {
  const response = await fetch(`${BASE_URL}/properties/${id}/openhouses`);

  if (!response.ok) {
    throw new Error(`Failed to fetch open houses: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchNaturalSearch(query) {
  const response = await fetch(`${BASE_URL}/search/natural`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  if (response.status === 503) {
    throw new Error('Search is temporarily unavailable. Please try again shortly.');
  }

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}