import './ListingsPage.css';
import { useState, useEffect, useRef } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import Pagination from './Pagination';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequestId = useRef(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const itemsPerPage = 20;

  function loadProperties(filters = {}, page = currentPage) {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );

    const offset = (page - 1) * itemsPerPage;

    fetchProperties({ ...cleanedFilters, limit: itemsPerPage, offset })
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

  function handleSearch(filters) {
    setActiveFilters(filters);
    setCurrentPage(1);
    loadProperties(filters, 1);
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    loadProperties(activeFilters, newPage);
    window.scrollTo(0, 0);
  }
  
  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div>
      <PropertyFilters onSearch={handleSearch} />
      {loading && <div>Loading properties...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <>
          <p>Showing {properties.length} of {total} properties</p>
          {properties.length === 0 ? (
            <p>No properties found. Try adjusting your filters.</p>
          ) : (
            <>
              <div className="property-grid">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
              ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ListingsPage;