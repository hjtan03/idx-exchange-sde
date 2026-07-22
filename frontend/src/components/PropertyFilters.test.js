import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

describe('PropertyFilters', () => {
  test('renders all six filter inputs', () => {
    render(<PropertyFilters onSearch={jest.fn()} />);

    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ZIP Code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Beds')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Baths')).toBeInTheDocument();
  });

  test('calls onSearch with entered filter values on submit', () => {
    const onSearch = jest.fn();
    render(<PropertyFilters onSearch={onSearch} />);

    fireEvent.change(screen.getByPlaceholderText('City'), {
      target: { value: 'Austin' }
    });
    fireEvent.click(screen.getByText('Search'));

    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'Austin' })
    );
  });

  test('clear button resets form and calls onSearch with empty filters', () => {
    const onSearch = jest.fn();
    render(<PropertyFilters onSearch={onSearch} />);

    const cityInput = screen.getByPlaceholderText('City');
    fireEvent.change(cityInput, { target: { value: 'Austin' } });
    fireEvent.click(screen.getByText('Clear Filters'));

    expect(cityInput.value).toBe('');
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ city: '' })
    );
  });
});