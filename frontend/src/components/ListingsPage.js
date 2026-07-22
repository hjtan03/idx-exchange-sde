import './ListingsPage.css';
import { useState, useEffect, useRef } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequestId = useRef(0);

  function loadProperties(filters = {}) {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );

    fetchProperties(cleanedFilters)
      .then(data => {
        if (requestId !== latestRequestId.current) return;
        setProperties(data.results);
        setTotal(data.total);
    })
    .catch(err => {
      if (requestId !== latestRequestId.current) return;
      setError(err.message);
    })
    .finally(() => {
      if (requestId !== latestRequestId.current) return;
      setLoading(false);
    });
  }
  
  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div>
      <PropertyFilters onSearch={loadProperties} />
      {loading && <div>Loading properties...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <>
          <p>Showing {properties.length} of {total} properties</p>
          {properties.length === 0 ? (
            <p>No properties found. Try adjusting your filters.</p>
          ) : (
            <div className="property-grid">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
            ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListingsPage;