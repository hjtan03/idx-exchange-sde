import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListingsPage from './ListingsPage';
import { fetchProperties } from '../api/client';

jest.mock('../api/client');

function deferred() {
  let resolve;
  const promise = new Promise(res => { resolve = res; });
  return { promise, resolve };
}

test('does not let a stale request overwrite a newer one', async () => {
  const first = deferred();
  const second = deferred();

  fetchProperties
    .mockReturnValueOnce(Promise.resolve({ total: 20, limit: 20, offset: 0, results: [] })) // initial mount
    .mockReturnValueOnce(first.promise)
    .mockReturnValueOnce(second.promise);

  render(<ListingsPage />);
  await waitFor(() => expect(fetchProperties).toHaveBeenCalledTimes(1));

  fireEvent.click(screen.getByText('Search')); // fires "first" request
  fireEvent.click(screen.getByText('Search')); // fires "second" request, before "first" resolves

  second.resolve({ total: 1, limit: 20, offset: 0, results: [{ id: 2, L_Address: 'Denver House' }] });
  await waitFor(() => screen.getByText(/Denver House/));

  first.resolve({ total: 1, limit: 20, offset: 0, results: [{ id: 1, L_Address: 'Austin House' }] });

  await new Promise(r => setTimeout(r, 0));

  expect(screen.queryByText(/Austin House/)).not.toBeInTheDocument();
  expect(screen.getByText(/Denver House/)).toBeInTheDocument();
});