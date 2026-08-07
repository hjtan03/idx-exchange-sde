import { useState } from 'react';
import './PropertyFilters.css';

const emptyFilters = {
    city: '',
    zipcode: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: ''
  };

function PropertyFilters({ onSearch }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [validationError, setValidationError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      filters.minPrice !== '' &&
      filters.maxPrice !== '' &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      setValidationError('Min price cannot be greater than max price');
      return;
    }

    setValidationError(null);
    onSearch(filters);
  }

  function handleClear() {
    setFilters(emptyFilters);
    setValidationError(null);
    onSearch(emptyFilters);
  }

  return (
    <form className="filters-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
      />
      <input
        type="text"
        name="zipcode"
        placeholder="ZIP Code"
        value={filters.zipcode}
        onChange={handleChange}
      />
      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
      />
      <select name="beds" value={filters.beds} onChange={handleChange}>
        <option value="">Beds</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
        <option value="5">5+</option>
      </select>
      <select name="baths" value={filters.baths} onChange={handleChange}>
        <option value="">Baths</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>Clear Filters</button>
      {validationError && <p className="filters-error">{validationError}</p>}
    </form>
  );
}

export default PropertyFilters;