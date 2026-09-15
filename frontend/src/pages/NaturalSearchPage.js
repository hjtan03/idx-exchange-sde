import { useState } from 'react';
import { fetchNaturalSearch } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import './NaturalSearchPage.css';

function formatFilters(filters) {
  const parts = [];
  if (filters.city) parts.push(`city=${filters.city}`);
  if (filters.zipcode) parts.push(`zip=${filters.zipcode}`);
  if (filters.minPrice) parts.push(`min price=$${filters.minPrice.toLocaleString()}`);
  if (filters.maxPrice) parts.push(`max price=$${filters.maxPrice.toLocaleString()}`);
  if (filters.beds) parts.push(`beds=${filters.beds}+`);
  if (filters.baths) parts.push(`baths=${filters.baths}+`);
  if (filters.minYearBuilt) parts.push(`built after ${filters.minYearBuilt}`);
  if (filters.maxYearBuilt) parts.push(`built before ${filters.maxYearBuilt}`);
  return parts.join(', ');
}

function NaturalSearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [interpretedFilters, setInterpretedFilters] = useState(undefined);
  const [message, setMessage] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    fetchNaturalSearch(query)
      .then(data => {
        setResults(data.results);
        setInterpretedFilters(data.interpretedFilters);
        setMessage(data.message || null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="natural-search-page">
      <h1>Search in Plain English</h1>
      <form onSubmit={handleSubmit} className="natural-search-form">
        <input
          type="text"
          name="naturalSearchQuery"
          id="naturalSearchQuery"
          placeholder="e.g. 3 bed 2 bath house in Beverly Hills under $800k built after 2000"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Searching...</p>}
      {error && <p className="natural-search-error">{error}</p>}

      {interpretedFilters && (
        <p className="interpreted-filters">
          Searching: {formatFilters(interpretedFilters)}
        </p>
      )}

      {interpretedFilters === null && message && (
        <p className="natural-search-message">{message}</p>
      )}

      {results && results.length === 0 && interpretedFilters && (
        <p>No properties matched your search.</p>
      )}

      {results && results.length > 0 && (
        <div className="property-grid">
          {results.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NaturalSearchPage;