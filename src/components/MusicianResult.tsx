import React from 'react';
import { MusicianResult as MusicianResultType } from '../services/musicianGeminiService';

interface MusicianResultProps {
  result: MusicianResultType;
  onClick: () => void;
}

const MusicianResult: React.FC<MusicianResultProps> = ({ result, onClick }) => {
  return (
    <div className="landmark-result-card musician-result-card" onClick={onClick}>
      {/* Thumbnail */}
      <div className="landmark-thumbnail">
        <img src={result.image} alt={result.name} />
        <div className="musician-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="currentColor"/>
          </svg>
          Nhạc sĩ
        </div>
      </div>

      {/* Content */}
      <div className="landmark-content">
        <h3 className="landmark-name">{result.name}</h3>
        
        {result.birthDeath && (
          <div className="musician-years">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{result.birthDeath}</span>
          </div>
        )}

        <p className="landmark-description">{result.overview}</p>
      </div>
    </div>
  );
};

export default MusicianResult;
