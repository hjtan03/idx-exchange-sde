import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchPropertyDetail } from '../api/client';
import PropertyImageGallery from './PropertyImageGallery';
import PropertyMap from './PropertyMap';

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

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchPropertyDetail(id)
      .then(data => setProperty(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading property...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) return null;

  const photos = parsePhotos(property.L_Photos);

  return (
    <div>
      <PropertyImageGallery photos={photos} />
      <PropertyMap
        latitude={property.LMD_MP_Latitude}
        longitude={property.LMD_MP_Longitude}
      />
      <h1>${property.L_SystemPrice?.toLocaleString()}</h1>
      <p>{property.L_Address}, {property.L_City}, {property.L_State}</p>
      <p>
        {property.L_Keyword2} beds • {property.LM_Dec_3} baths • {property.LM_Int2_3} sqft • Built {property.YearBuilt}
      </p>
      <p>{property.L_Remarks}</p>
    </div>
  );
}

export default PropertyDetailPage;