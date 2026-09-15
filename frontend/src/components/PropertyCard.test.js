import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PropertyCard from './PropertyCard';

const mockProperty = {
  id: 1,
  L_ListingID: '1118422731',
  L_Photos: JSON.stringify(['https://example.com/photo1.jpg']),
  L_SystemPrice: 3950000,
  L_Address: '1461 Laurel Way',
  L_City: 'Beverly Hills',
  L_State: 'CA',
  L_Keyword2: 4,
  LM_Dec_3: 5,
  LM_Int2_3: 3677,
};

function renderWithRouter(property) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<PropertyCard property={property} />} />
        <Route
          path="/property/:id"
          element={<div>Property Detail Page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('PropertyCard', () => {
  test('renders property data correctly', () => {
    renderWithRouter(mockProperty);

    expect(screen.getByText('$3,950,000')).toBeInTheDocument();
    expect(screen.getByText('1461 Laurel Way')).toBeInTheDocument();
    expect(screen.getByText('Beverly Hills, CA')).toBeInTheDocument();
    expect(screen.getByText(/4 beds • 5 baths • 3677 sqft/)).toBeInTheDocument();
  });

  test('clicking the card navigates to the property detail page', () => {
    renderWithRouter(mockProperty);

    fireEvent.click(screen.getByRole('link'));

    expect(screen.getByText('Property Detail Page')).toBeInTheDocument();
  });
});