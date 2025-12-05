import React from 'react';

interface DistrictPopupProps {
  district: any;
  onClose: () => void;
}

const DistrictPopup: React.FC<DistrictPopupProps> = ({ district, onClose }) => {
  if (!district) return null;

  return (
    <div className="district-popup-overlay" onClick={onClose}>
      <div className="district-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="district-popup-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="district-popup-header">
          <h2>{district.name}</h2>
          <span className="district-popup-type">{district.type}</span>
        </div>

        {district.image && (
          <div className="district-popup-image">
            <img 
              src={`/source_content/Daklak_old/${district.image.replace('images/dak_lak/', 'images/')}`} 
              alt={district.name}
            />
          </div>
        )}

        <div className="district-popup-body">
          <div className="district-popup-stats">
            {district.established && (
              <div className="district-popup-stat">
                <span className="stat-label">Thành lập</span>
                <span className="stat-value">{district.established}</span>
              </div>
            )}
            {district.area_km2 && (
              <div className="district-popup-stat">
                <span className="stat-label">Diện tích</span>
                <span className="stat-value">{district.area_km2.toLocaleString()} km²</span>
              </div>
            )}
            {district.population && (
              <div className="district-popup-stat">
                <span className="stat-label">Dân số</span>
                <span className="stat-value">{district.population.toLocaleString()} người</span>
              </div>
            )}
          </div>

          {district.description && (
            <div className="district-popup-description">
              <h3>Mô tả</h3>
              <p>{district.description}</p>
            </div>
          )}

          {/* Administrative Units */}
          <div className="district-popup-administrative">
            <h3>Đơn vị hành chính</h3>
            
            {district.wards && district.wards.length > 0 && (
              <div className="administrative-section">
                <h4>Phường ({district.wards.length})</h4>
                <div className="administrative-list">
                  {district.wards.map((ward: string, index: number) => (
                    <span key={index} className="administrative-item">{ward}</span>
                  ))}
                </div>
              </div>
            )}

            {district.towns && district.towns.length > 0 && (
              <div className="administrative-section">
                <h4>Thị trấn ({district.towns.length})</h4>
                <div className="administrative-list">
                  {district.towns.map((town: string, index: number) => (
                    <span key={index} className="administrative-item">{town}</span>
                  ))}
                </div>
              </div>
            )}

            {district.communes && district.communes.length > 0 && (
              <div className="administrative-section">
                <h4>Xã ({district.communes.length})</h4>
                <div className="administrative-list">
                  {district.communes.map((commune: string, index: number) => (
                    <span key={index} className="administrative-item">{commune}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictPopup;
