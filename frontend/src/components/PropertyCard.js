import './PropertyCard.css'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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

PropertyCard.propTypes = {
  property: PropTypes.shape({
    L_ListingID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    L_Photos: PropTypes.string,
    L_SystemPrice: PropTypes.number,
    L_Address: PropTypes.string,
    L_City: PropTypes.string,
    L_State: PropTypes.string,
    L_Keyword2: PropTypes.number,
    LM_Dec_3: PropTypes.number,
    LM_Int2_3: PropTypes.number,
  }).isRequired,
};

export default PropertyCard;