import { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from './PropertyCard';
import './ListingsPage.css'

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties().then(data => {
        setProperties(data.results);
        setTotal(data.total);
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
        <p>Showing {properties.length} of {total} properties</p>
        <div className="property-grid">
        {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
        ))}
        </div>
    </div>
  );
}

export default ListingsPage;