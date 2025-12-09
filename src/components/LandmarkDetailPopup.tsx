import React, { useState, useEffect } from 'react';
import { LandmarkWithAddress } from '../services/addressMappingService';

interface LandmarkDetailPopupProps {
  landmark: LandmarkWithAddress;
  onClose: () => void;
}

const LandmarkDetailPopup: React.FC<LandmarkDetailPopupProps> = ({ landmark, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [animationState, setAnimationState] = useState<'entering' | 'open' | 'exiting'>('entering');
  
  // Get all images (thumbnail + additional images)
  const allImages = [
    landmark.image || '/thu-duc.jpeg',
    ...(landmark.images || [])
  ].filter(Boolean);

  // Initialize animation state
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('open');
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    if (allImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  // Handle close with animation
  const handleClose = () => {
    setAnimationState('exiting');
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400); // Match animation duration
  };

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={`landmark-popup-backdrop ${isClosing ? 'closing' : ''}`} onClick={handleBackdropClick}>
      <div className={`landmark-popup-container ${isClosing ? 'closing' : ''}`}>
        <button className="popup-close-btn" onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Slideshow Section */}
        <div className="popup-slideshow-section">
          {allImages.map((image, index) => (
            <div
              key={index}
              className={`popup-slide ${index === currentImageIndex ? 'active' : ''}`}
            >
              <img 
                src={image} 
                alt={`${landmark.name} - ${index + 1}`}
                onError={(e) => {
                  e.currentTarget.src = '/thu-duc.jpeg';
                }}
              />
            </div>
          ))}
          
          {allImages.length > 1 && (
            <div className="slideshow-dots">
              {allImages.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="popup-info-section">
          <h1 className="popup-landmark-title">{landmark.name}</h1>
          
          {landmark.description && (
            <div className="popup-description-box">
              <p>{landmark.description}</p>
            </div>
          )}

          <div className="popup-address-grid">
            <div className="popup-address-card old-address">
              <div className="address-card-header">
                <span className="address-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                  </svg>
                </span>
                <h3>Địa chỉ cũ</h3>
              </div>
              <p>{landmark.oldAddress}</p>
            </div>
            
            <div className="popup-address-card new-address">
              <div className="address-card-header">
                <span className="address-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                  </svg>
                </span>
                <h3>Địa chỉ mới</h3>
              </div>
              <p>{landmark.newAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandmarkDetailPopup;
