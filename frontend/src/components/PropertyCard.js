import './PropertyCard.css'
import { Link } from 'react-router-dom';
import PropertyImageCarousel from './PropertyImageCarousel';
import { parsePhotos } from '../utils/parsePhotos';

function PropertyCard({ property }) {
  const photos = parsePhotos(property.L_Photos);

  return (
    <Link to={`/property/${property.L_ListingID}`} className="property-card">
      <PropertyImageCarousel photos={photos} />
      <p>${property.L_SystemPrice?.toLocaleString()}</p>
      <p>{property.L_Address}</p>
      <p>{property.L_City}, {property.L_State}</p>
      <p>{property.L_Keyword2} beds • {property.LM_Dec_3} baths • {property.LM_Int2_3} sqft</p>
    </Link>
  );
}

export default PropertyCard;