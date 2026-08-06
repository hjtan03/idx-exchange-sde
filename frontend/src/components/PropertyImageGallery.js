import { useState } from 'react';
import './PropertyImageGallery.css';

function PropertyImageGallery({ photos }) {
  const [mainIndex, setMainIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!photos || photos.length === 0) {
    return <div className="gallery-no-photo">No photo available</div>;
  }

  function handleThumbnailClick(index) {
    setMainIndex(index);
  }

  function openLightbox() {
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function showPrev(e) {
    e.stopPropagation();
    setMainIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  }

  function showNext(e) {
    e.stopPropagation();
    setMainIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="gallery">
      <img
        src={photos[mainIndex]}
        alt=""
        className="gallery-main-image"
        onClick={openLightbox}
      />

      {photos.length > 1 && (
        <div className="gallery-thumbnails">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt=""
              className={index === mainIndex ? 'thumbnail active' : 'thumbnail'}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <img
            src={photos[mainIndex]}
            alt=""
            className="lightbox-image"
            onClick={e => e.stopPropagation()}
          />
          {photos.length > 1 && (
            <>
              <button className="lightbox-arrow lightbox-arrow-left" onClick={showPrev}>‹</button>
              <button className="lightbox-arrow lightbox-arrow-right" onClick={showNext}>›</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PropertyImageGallery;