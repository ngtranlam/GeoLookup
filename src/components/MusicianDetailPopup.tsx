import React, { useState, useEffect } from 'react';
import { MusicianResult } from '../services/musicianGeminiService';

interface MusicianDetailPopupProps {
  musician: MusicianResult;
  onClose: () => void;
}

const MusicianDetailPopup: React.FC<MusicianDetailPopupProps> = ({ musician, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [showFullInfo, setShowFullInfo] = useState(false);
  
  // Get all images
  const allImages = [
    musician.image || '/thu-duc.jpeg',
    ...(musician.images || [])
  ].filter(Boolean);

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
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
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
              <img src={image} alt={`${musician.name} ${index + 1}`} />
            </div>
          ))}
          
          {allImages.length > 1 && (
            <div className="slideshow-dots">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="popup-info-section">
          <h1 className="popup-landmark-title">{musician.name}</h1>
          
          {/* Birth-Death Info */}
          {musician.birthDeath && (
            <div className="musician-birth-death">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{musician.birthDeath}</span>
            </div>
          )}

          {/* Overview */}
          <div className="musician-section">
            <h3 className="musician-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
              Tổng quan
            </h3>
            <p className="musician-section-content">{musician.overview}</p>
          </div>

          {/* Show More Button */}
          {!showFullInfo && (
            <button className="show-more-btn" onClick={() => setShowFullInfo(true)}>
              <span>Tìm hiểu thêm</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Full Information - Only shown when expanded */}
          {showFullInfo && (
            <>
              {/* Biography */}
              <div className="musician-section">
                <h3 className="musician-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                  </svg>
                  Tiểu sử
                </h3>
                <p className="musician-section-content">{musician.biography}</p>
              </div>

              {/* Career */}
              <div className="musician-section">
                <h3 className="musician-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" fill="currentColor"/>
                  </svg>
                  Sự nghiệp
                </h3>
                <p className="musician-section-content">{musician.career}</p>
              </div>

              {/* Works */}
              <div className="musician-section">
                <h3 className="musician-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="currentColor"/>
                  </svg>
                  Tác phẩm
                </h3>
                <p className="musician-section-content">{musician.works}</p>
              </div>

              {/* Awards */}
              <div className="musician-section">
                <h3 className="musician-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                  Giải thưởng
                </h3>
                <p className="musician-section-content">{musician.awards}</p>
              </div>

              {/* Show Less Button */}
              <button className="show-more-btn" onClick={() => setShowFullInfo(false)}>
                <span>Thu gọn</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicianDetailPopup;
