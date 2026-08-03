import { useParams } from 'react-router-dom';

function PropertyDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <p>Property Detail Page — ID: {id}</p>
    </div>
  );
}

export default PropertyDetailPage;