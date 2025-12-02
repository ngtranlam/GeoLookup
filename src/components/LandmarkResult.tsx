import React from 'react';
import { LandmarkWithAddress } from '../services/addressMappingService';

interface LandmarkResultProps {
  result: LandmarkWithAddress;
  onClick: () => void;
}

const LandmarkResult: React.FC<LandmarkResultProps> = ({ result, onClick }) => {
  return (
    <div className="landmark-result-card" onClick={onClick}>
      <div className="landmark-thumbnail">
        <img 
          src={result.image || '/thu-duc.jpeg'} 
          alt={result.name}
          onError={(e) => {
            e.currentTarget.src = '/thu-duc.jpeg';
          }}
        />
      </div>
      
      <div className="landmark-content">
        <h3 className="landmark-name">{result.name}</h3>
        
        {result.description && (
          <p className="landmark-description">{result.description}</p>
        )}
        
        <div className="landmark-addresses">
          <div className="address-item">
            <span className="address-label">Địa chỉ cũ:</span>
            <span className="address-value">{result.oldAddress}</span>
          </div>
          
          <div className="address-item">
            <span className="address-label">Địa chỉ mới:</span>
            <span className="address-value">{result.newAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandmarkResult;
