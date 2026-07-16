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