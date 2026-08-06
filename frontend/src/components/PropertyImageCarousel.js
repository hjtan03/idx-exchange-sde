import { useState } from 'react';
import './PropertyImageCarousel.css';

function PropertyImageCarousel({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return <div className="property-card-no-photo">No photo available</div>;
  }

  function handlePrev(e) {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  }

  function handleNext(e) {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="carousel">
      <img src={photos[currentIndex]} alt="" />

      {photos.length > 1 && (
        <>
          <button className="carousel-arrow carousel-arrow-left" onClick={handlePrev}>
            ‹
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={handleNext}>
            ›
          </button>
          <div className="carousel-counter">
            {currentIndex + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  );
}

export default PropertyImageCarousel;