import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchPropertyDetail, fetchOpenHouses } from '../api/client';
import PropertyImageGallery from './PropertyImageGallery';
import PropertyMap from './PropertyMap';
import OpenHouseList from './OpenHouseList';
import './PropertyDetailPage.css';

function parsePhotos(l_photos) {
  try {
    const photos = JSON.parse(l_photos);
    return Array.isArray(photos) ? photos : [];
  } catch {
    return [];
  }
}

function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchPropertyDetail(id)
      .then(data => setProperty(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
  fetchOpenHouses(id)
    .then(data => setOpenHouses(data))
    .catch(() => setOpenHouses([]));
  }, [id]);

  if (loading) return <div className="detail-status">Loading property...</div>;
  if (error) return <div className="detail-status">Error: {error}</div>;
  if (!property) return null;

  const photos = parsePhotos(property.L_Photos);

  return (
    <div className="property-detail-page">
      <PropertyImageGallery photos={photos} />
      <div className="detail-header">
        <h1 className="detail-price">${property.L_SystemPrice?.toLocaleString()}</h1>
        <p className="detail-address">{property.L_Address}, {property.L_City}, {property.L_State}</p>
        <p className="detail-stats">
          {property.L_Keyword2} beds • {property.LM_Dec_3} baths • {property.LM_Int2_3} sqft • Built {property.YearBuilt}
        </p>
      </div>

      <div className="detail-section">
        <h2>Description</h2>
        <p className="detail-description">{property.L_Remarks}</p>
      </div>

      <div className="detail-section">
        <h2>Location</h2>
        <PropertyMap
          latitude={property.LMD_MP_Latitude}
          longitude={property.LMD_MP_Longitude}
        />
      </div>

      <div className="detail-section">
        <OpenHouseList openHouses={openHouses} />
      </div>
    </div>
  );
}

export default PropertyDetailPage;