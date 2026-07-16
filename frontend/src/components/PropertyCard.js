import './PropertyCard.css'
function parsePhotos(l_photos) {
  try {
    const photos = JSON.parse(l_photos);
    return Array.isArray(photos) ? photos : [];
  } catch {
    return [];
  }
}

function PropertyCard({ property }) {
  const photos = parsePhotos(property.L_Photos);
  const firstPhoto = photos[0] || null;

  return (
    <div className="property-card">
      {firstPhoto ? (
        <img src={firstPhoto} alt={property.L_Address} />
      ) : (
        <div className="property-card-no-photo">No photo available</div>
      )}
      <p>${property.L_SystemPrice?.toLocaleString()}</p>
      <p>{property.L_Address}</p>
      <p>{property.L_City}, {property.L_State}</p>
      <p>{property.L_Keyword2} beds • {property.LM_Dec_3} baths • {property.LM_Int2_3} sqft</p>
    </div>
  );
}

export default PropertyCard;