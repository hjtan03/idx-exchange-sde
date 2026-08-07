import './PropertyMap.css';

function PropertyMap({ latitude, longitude }) {
  if (!latitude || !longitude) return null;

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="property-map">
      <iframe
        title="Property Location"
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        src={embedUrl}
      />
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
        Get Directions
      </a>
    </div>
  );
}

export default PropertyMap;