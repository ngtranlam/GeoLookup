import React, { useState, useEffect } from 'react';
import { searchLandmarkWithEnhancedAddress } from './services/enhancedGeminiService';
import { searchMusicianWithGemini, MusicianResult as MusicianData } from './services/musicianGeminiService';
import LandmarkResult from './components/LandmarkResult';
import LandmarkDetailPopup from './components/LandmarkDetailPopup';
import MusicianResultCard from './components/MusicianResult';
import MusicianDetailPopup from './components/MusicianDetailPopup';
import LessonPage from './components/LessonPage';
import DocumentsPage from './components/DocumentsPage';
import ProvinceDetailPage from './components/ProvinceDetailPage';
import DakLakOldPage from './components/DakLakOldPage';
import DakLakNewPage from './components/DakLakNewPage';
import PhuYenOldPage from './components/PhuYenOldPage';

// Mock data cho demo
const mockResults = [
  {
    name: "Thành phố Thủ Đức",
    oldAddress: "Quận 2, Quận 9, Quận Thủ Đức, TP.HCM",
    newAddress: "Thành phố Thủ Đức, TP.HCM",
    description: "Được thành lập từ việc sáp nhập 3 quận vào năm 2020.",
    image: "/thu-duc.jpeg"
  },
  {
    name: "Thành phố Phú Quốc",
    oldAddress: "Huyện Phú Quốc, tỉnh Kiên Giang",
    newAddress: "Thành phố Phú Quốc, tỉnh Kiên Giang",
    description: "Được nâng cấp từ huyện đảo lên thành phố vào năm 2021.",
    image: "/thu-duc.jpeg"
  }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [musicianResults, setMusicianResults] = useState<MusicianData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [selectedMusician, setSelectedMusician] = useState<MusicianData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showMusicianPopup, setShowMusicianPopup] = useState(false);
  const [searchError, setSearchError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<'explore' | 'lessons' | 'documents' | 'province-detail' | 'daklak-old' | 'daklak-new' | 'phuyen-old'>('explore');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Page transition effect
  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handlePageChange = (newPage: 'explore' | 'lessons' | 'documents' | 'province-detail' | 'daklak-old' | 'daklak-new' | 'phuyen-old') => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
    }, 150);
  };

  // Detailed place information
  const placeDetails = {
    "Nhà đày Buôn Ma Thuột": {
      name: "Nhà đày Buôn Ma Thuột",
      oldAddress: "Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
      newAddress: "Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
      description: "Nhà đày Buôn Ma Thuột là một di tích lịch sử quan trọng, được xây dựng từ thời Pháp thuộc. Đây là nơi giam giữ các chiến sĩ cách mạng trong thời kỳ đấu tranh giành độc lập. Hiện tại, nơi đây đã được tu bổ và trở thành bảo tàng, lưu giữ nhiều hiện vật quý giá về lịch sử đấu tranh của dân tộc.",
      image: "/nhadaybuonmathuot.jpg"
    },
    "Bảo tàng Thế giới cà phê": {
      name: "Bảo tàng Thế giới cà phê",
      oldAddress: "Số 10 Nguyễn Du, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
      newAddress: "Số 10 Nguyễn Du, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
      description: "Bảo tàng Thế giới cà phê là nơi trưng bày và giới thiệu về lịch sử, văn hóa cà phê Việt Nam và thế giới. Với hơn 10.000 hiện vật quý giá, bảo tàng mang đến cho du khách cái nhìn toàn diện về hành trình từ hạt cà phê đến tách cà phê thơm ngon.",
      image: "/baotangthegioicaphe.jpg"
    },
    "Hồ Lắk": {
      name: "Hồ Lắk",
      oldAddress: "Xã Lắk, huyện Lắk, tỉnh Đắk Lắk",
      newAddress: "Xã Lắk, huyện Lắk, tỉnh Đắk Lắk",
      description: "Hồ Lắk là hồ nước ngọt tự nhiên lớn nhất tỉnh Đắk Lắk, có diện tích mặt nước khoảng 500 ha. Nơi đây nổi tiếng với cảnh quan thiên nhiên tuyệt đẹp, là nơi sinh sống của cộng đồng người M'Nông với văn hóa đặc sắc. Du khách có thể trải nghiệm cưỡi voi, thăm làng văn hóa và thưởng thức các món ăn đặc sản.",
      image: "/holak.jpg"
    },
    "Đá Voi Mẹ – Đá Voi Cha": {
      name: "Đá Voi Mẹ – Đá Voi Cha",
      oldAddress: "Xã Ea Sup, huyện Ea Sup, tỉnh Đắk Lắk",
      newAddress: "Xã Ea Sup, huyện Ea Sup, tỉnh Đắk Lắk",
      description: "Đá Voi Mẹ – Đá Voi Cha là một danh thắng thiên nhiên độc đáo với những khối đá granite khổng lồ có hình dáng giống như đàn voi. Theo truyền thuyết của người M'Nông, đây là gia đình voi đã hóa đá để bảo vệ vùng đất này. Nơi đây thu hút du khách bởi cảnh quan hùng vĩ và những câu chuyện thần tích thú vị.",
      image: "/nui-da-voi-me.webp"
    },
    "Buôn Đôn": {
      name: "Buôn Đôn",
      oldAddress: "Xã Krông Na, huyện Buôn Đôn, tỉnh Đắk Lắk",
      newAddress: "Xã Krông Na, huyện Buôn Đôn, tỉnh Đắk Lắk",
      description: "Buôn Đôn là làng văn hóa du lịch cộng đồng nổi tiếng với nghề thuần dưỡng voi của người Ê Đê. Đây là nơi sinh sống của những gia đình có truyền thống nuôi voi lâu đời nhất Việt Nam. Du khách đến đây có thể tìm hiểu về văn hóa, phong tục tập quán của đồng bào Ê Đê và trải nghiệm cưỡi voi trong rừng nguyên sinh.",
      image: "/buondon.jpg"
    },
    "Thác Dray Nur – Dray Sáp": {
      name: "Thác Dray Nur – Dray Sáp",
      oldAddress: "Xã Ea Sup, huyện Ea Sup, tỉnh Đắk Lắk",
      newAddress: "Xã Ea Sup, huyện Ea Sup, tỉnh Đắk Lắk",
      description: "Thác Dray Nur – Dray Sáp là quần thể thác nước hùng vĩ nhất tỉnh Đắk Lắk, gồm 3 tầng thác chính với độ cao tổng cộng hơn 100m. Nước thác đổ xuống tạo thành những dòng chảy mạnh mẽ giữa rừng già nguyên sinh. Đây là điểm đến lý tưởng cho những ai yêu thích thiên nhiên hoang dã và muốn khám phá vẻ đẹp hùng vĩ của núi rừng Tây Nguyên.",
      image: "/thacdraynur.jpg"
    }
  };

  const handlePlaceClick = (placeName: string) => {
    const placeInfo = placeDetails[placeName as keyof typeof placeDetails];
    if (placeInfo) {
      setSelectedPlace(placeInfo);
      setShowPopup(true);
    }
  };


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchResults([]);
    setMusicianResults([]);
    setSearchError('');
    
    try {
      // Search musicians first
      const musicianSearchResults = await searchMusicianWithGemini(searchQuery.trim());
      
      // If musician found, only show musician results
      if (musicianSearchResults.length > 0) {
        setMusicianResults(musicianSearchResults);
        setSearchResults([]);
        
        // Auto scroll to results title after a short delay
        setTimeout(() => {
          const resultsTitle = document.getElementById('search-results-title');
          if (resultsTitle) {
            resultsTitle.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
            });
          }
        }, 300);
      } else {
        // If no musician found, search for landmarks
        const landmarkResults = await searchLandmarkWithEnhancedAddress(searchQuery.trim());
        setSearchResults(landmarkResults);
        setMusicianResults([]);
        
        if (landmarkResults.length === 0) {
          setSearchError('Không tìm thấy thông tin về địa danh hoặc nhạc sĩ này.');
        } else {
          // Auto scroll to results title after a short delay
          setTimeout(() => {
            const resultsTitle = document.getElementById('search-results-title');
            if (resultsTitle) {
              resultsTitle.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center'
              });
            }
          }, 300);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Có lỗi xảy ra khi tìm kiếm. Đang sử dụng dữ liệu mẫu...');
      
      // Fallback to mock data if API fails
      const filtered = mockResults.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.oldAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.newAddress.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      
      // Auto scroll for fallback results too
      if (filtered.length > 0) {
        setTimeout(() => {
          const resultsTitle = document.getElementById('search-results-title');
          if (resultsTitle) {
            resultsTitle.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
            });
          }
        }, 300);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      {/* Header */}
      <header className="header header-full-width">
        <nav className="nav nav-full-width">
          <div className="logo">
            <img 
              src="/logo-nbk.png" 
              alt="Logo THCS Nguyễn Bình Khiêm" 
              className="logo-image"
            />
            <div className="logo-text">
              <div className="logo-main">THCS Nguyễn Bình Khiêm</div>
              <div className="logo-sub">Học hiện đại – Sáng tương lai</div>
            </div>
          </div>
          <div className="nav-buttons">
            <button 
              className={`nav-btn ${currentPage === 'explore' ? 'nav-btn-active' : ''}`}
              onClick={() => handlePageChange('explore')}
            >
              Khám phá
            </button>
            <button 
              className={`nav-btn ${currentPage === 'lessons' ? 'nav-btn-active' : ''}`}
              onClick={() => handlePageChange('lessons')}
            >
              Kiến thức
            </button>
            <button 
              className={`nav-btn ${currentPage === 'documents' ? 'nav-btn-active' : ''}`}
              onClick={() => handlePageChange('documents')}
            >
              Tư liệu
            </button>
          </div>
        </nav>
      </header>

      {/* Page Loading Overlay */}
      <div className={`page-loading-overlay ${isPageTransitioning ? 'active' : ''}`}>
        <div className="page-loading-spinner"></div>
      </div>

      {/* Conditional Content Based on Current Page */}
      <div className={`page-container ${isPageTransitioning ? 'page-transition-exit-active' : 'page-transition-enter-active'}`}>
        {currentPage === 'phuyen-old' ? (
          /* Phu Yen Old Page */
          <div className="page-content" style={{ animation: 'slideInFromBottom 0.6s ease-out' }}>
            <PhuYenOldPage />
          </div>
        ) : currentPage === 'daklak-old' ? (
          /* Dak Lak Old Page */
          <div className="page-content" style={{ animation: 'slideInFromBottom 0.6s ease-out' }}>
            <DakLakOldPage />
          </div>
        ) : currentPage === 'daklak-new' ? (
          /* Dak Lak New Page */
          <div className="page-content" style={{ animation: 'slideInFromBottom 0.6s ease-out' }}>
            <DakLakNewPage />
          </div>
        ) : currentPage === 'province-detail' && selectedProvince ? (
          /* Province Detail Page */
          <div className="page-content" style={{ animation: 'slideInFromRight 0.6s ease-out' }}>
            <ProvinceDetailPage 
              provinceId={selectedProvince}
              onBack={() => {
                handlePageChange('explore');
                setSelectedProvince(null);
              }}
            />
          </div>
        ) : currentPage === 'lessons' ? (
          /* Lessons Page Content */
          <div className="page-content" style={{ animation: 'fadeInLeft 0.6s ease-out' }}>
            <LessonPage />
          </div>
        ) : currentPage === 'documents' ? (
          /* Documents Page Content */
          <div className="page-content" style={{ animation: 'fadeInRight 0.6s ease-out' }}>
            <DocumentsPage 
              onSelectProvince={(provinceId) => {
                setSelectedProvince(provinceId);
                handlePageChange('province-detail');
              }}
              onNavigateToDakLakOld={() => {
                handlePageChange('daklak-old');
              }}
              onNavigateToDakLakNew={() => {
                handlePageChange('daklak-new');
              }}
              onNavigateToPhuyenOld={() => {
                handlePageChange('phuyen-old');
              }}
            />
          </div>
        ) : (
          <div className="page-content" style={{ animation: 'scaleIn 0.6s ease-out' }}>
          {/* Hero Section */}
          <section className="hero citizenship-hero">
        <div className="container">
          {/* Citizenship Icons */}
          <div className="citizenship-icons">
            <div className="citizenship-icon citizenship-icon-1">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                <path d="M19 15L19.5 17L21 17.5L19.5 18L19 20L18.5 18L17 17.5L18.5 17L19 15Z" fill="currentColor"/>
                <path d="M5 15L5.5 17L7 17.5L5.5 18L5 20L4.5 18L3 17.5L4.5 17L5 15Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="citizenship-icon citizenship-icon-2">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V6.5L21 9ZM3 9L9 6.5V5.5L3 7V9ZM15 7.5V9L21 11V13L15 10.5V12L21 14.5V16.5L12 13L3 16.5V14.5L9 12V10.5L3 13V11L9 9V7.5L3 9V7L9 5.5V4C9 2.9 9.9 2 11 2H13C14.1 2 15 2.9 15 4V5.5L21 7V9L15 7.5Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="citizenship-icon citizenship-icon-3">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="citizenship-icon citizenship-icon-4">
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="citizenship-icon citizenship-icon-5">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,2L3.09,7.26L4.91,8.74L12,4.15L19.09,8.74L20.91,7.26L12,2M5,9V14H7V11H9V14H11V9H5M13,9V14H19V12H15V11H19V9H13M15,13H17V14H15V13Z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          <h1 className="citizenship-title">
            <span className="title-highlight">Bộ tư liệu số</span>
            <span className="title-main">TÔI LÀ CÔNG DÂN ĐẮK LẮK</span>
          </h1>
          {/* Interactive Đắk Lắk Map */}
          <div className="daklak-map-container">
            <div className="map-wrapper">
              <img 
                src="/source_content/daklak_map.png" 
                alt="Bản đồ tỉnh Đắk Lắk" 
                className="daklak-map"
              />
            </div>
          </div>


          {/* Enhanced Search Form */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <div className="search-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên địa danh, vị trí cần tìm... (VD: Nhà đày, Tháp Nghinh phong)"
                  className="search-input"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`search-btn-icon-only ${isLoading ? 'searching' : ''}`}
                  title={isLoading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                >
                  <svg className="search-magnifier" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="m21 21-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>


          {/* Citizenship Education Features */}
          <div className="citizenship-features">
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                  </svg>
                </div>
                <h3>Tra cứu thông tin địa danh trước và sau sáp nhập</h3>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  </svg>
                </div>
                <h3>Tự học và luyện tập thông minh cùng AI</h3>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                    <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3>Bộ tư liệu đa dạng và chính xác</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Đang tìm kiếm thông tin với AI Gemini...</p>
          </div>
        </div>
      )}

      {/* Error Message */}

      {/* Enhanced Search Results */}
      {(searchResults.length > 0 || musicianResults.length > 0) && (
        <div className="container enhanced-results">
          <div className="results">
            <h2 id="search-results-title">
              Kết quả tìm kiếm cho "{searchQuery}" 
              {searchError && <span style={{color: '#f59e0b'}}> (Dữ liệu mẫu)</span>}
            </h2>
            
            {/* Landmark Results */}
            {searchResults.length > 0 && (
              <div className="result-section">
                <h3 className="result-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                  </svg>
                  Địa danh ({searchResults.length})
                </h3>
                {searchResults.map((result, index) => (
                  <LandmarkResult 
                    key={`landmark-${index}`} 
                    result={result}
                    onClick={() => {
                      setSelectedPlace(result);
                      setShowPopup(true);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Musician Results */}
            {musicianResults.length > 0 && (
              <div className="result-section">
                <h3 className="result-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="currentColor"/>
                  </svg>
                  Nhạc sĩ ({musicianResults.length})
                </h3>
                {musicianResults.map((result, index) => (
                  <MusicianResultCard 
                    key={`musician-${index}`} 
                    result={result}
                    onClick={() => {
                      setSelectedMusician(result);
                      setShowMusicianPopup(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results - Simple Notification */}
      {!isLoading && searchResults.length === 0 && musicianResults.length === 0 && searchQuery && (
        <div className="container">
          <div className="error-message">
            <h3>Thông báo</h3>
            <p>Không tìm thấy thông tin về "{searchQuery}" trong cơ sở dữ liệu địa danh và nhạc sĩ</p>
          </div>
        </div>
      )}

      {/* Nearby Places Section */}
      <section className="nearby-places">
        <div className="container">
          <h2 className="section-title">Địa điểm gần bạn</h2>
          <p className="section-subtitle">Khám phá những địa danh nổi tiếng tại Đắk Lắk</p>
          
          <div className="places-grid">
            <div className="place-card" onClick={() => handlePlaceClick("Nhà đày Buôn Ma Thuột")}>
              <div className="place-image">
                <img src="/nhadaybuonmathuot.jpg" alt="Nhà đày Buôn Ma Thuột" />
                <div className="place-overlay">
                  <span className="place-icon"></span>
                </div>
              </div>
              <div className="place-content">
                <h3>Nhà đày Buôn Ma Thuột</h3>
                <p>Di tích lịch sử quan trọng của thành phố</p>
              </div>
            </div>

            <div className="place-card" onClick={() => handlePlaceClick("Bảo tàng Thế giới cà phê")}>
              <div className="place-image">
                <img src="/baotangthegioicaphe.jpg" alt="Bảo tàng Thế giới cà phê" />
                <div className="place-overlay">
                  <span className="place-icon">☕</span>
                </div>
              </div>
              <div className="place-content">
                <h3>Bảo tàng Thế giới cà phê</h3>
                <p>Tìm hiểu về văn hóa cà phê Việt Nam</p>
              </div>
            </div>

            <div className="place-card" onClick={() => handlePlaceClick("Hồ Lắk")}>
              <div className="place-image">
                <img src="/holak.jpg" alt="Hồ Lắk" />
                <div className="place-overlay">
                  <span className="place-icon">🏞️</span>
                </div>
              </div>
              <div className="place-content">
                <h3>Hồ Lắk</h3>
                <p>Hồ nước ngọt lớn nhất Đắk Lắk</p>
              </div>
            </div>

            <div className="place-card" onClick={() => handlePlaceClick("Đá Voi Mẹ – Đá Voi Cha")}>
              <div className="place-image">
                <img src="/nui-da-voi-me.webp" alt="Đá Voi Mẹ – Đá Voi Cha" />
                <div className="place-overlay">
                  <span className="place-icon">🗿</span>
                </div>
              </div>
              <div className="place-content">
                <h3>Đá Voi Mẹ – Đá Voi Cha</h3>
                <p>Danh thắng thiên nhiên độc đáo</p>
              </div>
            </div>

            <div className="place-card" onClick={() => handlePlaceClick("Buôn Đôn")}>
              <div className="place-image">
                <img src="/buondon.jpg" alt="Buôn Đôn" />
                <div className="place-overlay">
                  <span className="place-icon">🐘</span>
                </div>
              </div>
              <div className="place-content">
                <h3>Buôn Đôn</h3>
                <p>Làng văn hóa du lịch cộng đồng</p>
              </div>
            </div>

            <div className="place-card" onClick={() => handlePlaceClick("Thác Dray Nur – Dray Sáp")}>
              <div className="place-image">
                <img src="/thacdraynur.jpg" alt="Thác Dray Nur – Dray Sáp" />
                <div className="place-overlay">
                  <span className="place-icon">💧</span>
                </div>
              </div>
              <div className="place-content">
                <h3>Thác Dray Nur – Dray Sáp</h3>
                <p>Thác nước hùng vĩ giữa rừng già</p>
              </div>
            </div>
          </div>
        </div>
      </section>
          </div>
        )}
      </div>

      {/* Floating 3D Sphere - Fixed Position - TEMPORARILY DISABLED */}
      {/*
      <div className="sphere-container">
        <div className="sphere">
          {[
            "Vịnh Hạ Long", "Phố cổ Hội An", "Quần thể Tràng An", "Cố đô Hoa Lư", "Thánh địa Mỹ Sơn",
            "Hoàng thành Thăng Long", "Phong Nha - Kẻ Bàng", "Phú Quốc", "Đà Lạt", "Sapa",
            "Phan Thiết - Mũi Né", "Nha Trang", "Miền Tây", "Côn Đảo", "Hang Sơn Đoòng",
            "Vườn quốc gia Ba Vì", "Đảo Lý Sơn", "Tam Đảo", "Bà Nà Hills", "Cầu Vàng",
            "Địa đạo Củ Chi", "Nhà thờ Đức Bà Sài Gòn", "Bưu điện Trung tâm Sài Gòn", "Dinh Độc Lập", "Chợ Bến Thành",
            "Bảo tàng Chứng tích Chiến tranh", "Bitexco Financial Tower", "Công viên Văn hóa Đầm Sen", "Khu du lịch Suối Tiên", "Bãi Dài Phú Quốc",
            "Hòn Thơm", "Vườn Quốc gia Tràm Chim", "Chùa Dơi", "Chợ nổi Cái Răng", "Nhà cổ Bình Thủy",
            "Vườn Quốc gia U Minh Thượng", "Mũi Cà Mau", "Vườn Quốc gia Côn Đảo", "Hải đăng Vũng Tàu", "Hòn Bà Vũng Tàu",
            "Thác Prenn", "Hồ Tuyền Lâm", "Thiền viện Trúc Lâm", "Đỉnh Lang Biang", "Thác Datanla",
            "Mũi Né", "Đồi Cát Bay", "Hải đăng Kê Gà", "Cát Tiên", "Vườn Quốc gia Núi Chúa",
            "Vịnh Vĩnh Hy", "Tháp Chăm Po Klong Garai", "Đảo Bình Ba", "Hòn Mun", "Vinpearl Land Nha Trang",
            "Tháp Bà Ponagar", "Chùa Long Sơn", "Bãi biển An Bàng", "Rừng dừa Bảy Mẫu", "Chùa Cầu",
            "Ngũ Hành Sơn", "Bán đảo Sơn Trà", "Chùa Linh Ứng Bãi Bụt", "Đèo Hải Vân", "Lăng Cô",
            "Đầm Lập An", "Cầu ngói Thanh Toàn", "Vườn Quốc gia Bạch Mã", "Bãi biển Cửa Lò", "Khu di tích Kim Liên",
            "Vườn Quốc gia Pù Mát", "Thác Bản Giốc", "Hồ Ba Bể", "Khu di tích Pác Bó", "Đèo Khau Phạ",
            "Ruộng bậc thang Hoàng Su Phì", "Phố cổ Đồng Văn", "Dinh thự Vua Mèo", "Chợ tình Sapa", "Núi Hàm Rồng",
            "Nhà thờ Đá Sapa", "Đèo Ô Quy Hồ", "Vườn Quốc gia Hoàng Liên", "Bãi biển Trà Cổ", "Đảo Quan Lạn",
            "Đảo Cô Tô", "Chùa Yên Tử", "Đảo Tuần Châu", "Suối Khoáng Kim Bôi", "Thung lũng Mai Châu",
            "Vườn Quốc gia Cúc Phương", "Khu du lịch sinh thái Thung Nham", "Chùa Đồng", "Hòn Gai", "Chợ Đồng Xuân",
            "Phố bia Tạ Hiện", "Cầu Nhật Tân", "Nhà thờ Lớn Hà Nội", "Làng gốm Bát Tràng", "Chùa Tây Phương",
            "Đền Gióng Sóc Sơn"
          ].map((landmark, index) => (
            <div 
              key={index} 
              className="sphere-item"
              onClick={() => setSearchQuery(landmark)}
            >
              {landmark}
            </div>
          ))}
        </div>
      </div>
      */}

      {/* Vietnam Map - Fixed Position Right */}
      {/* <div className="vietnam-map-container-fixed">
        <img 
          src="/vietnam-map.png" 
          alt="Bản đồ Việt Nam với các địa danh nổi tiếng" 
          className="vietnam-map"
        />
      </div> */}

      {/* Place Details Popup */}
      {showPopup && selectedPlace && (
        <LandmarkDetailPopup
          landmark={selectedPlace}
          onClose={() => {
            setShowPopup(false);
            setSelectedPlace(null);
          }}
        />
      )}

      {/* Musician Details Popup */}
      {showMusicianPopup && selectedMusician && (
        <MusicianDetailPopup
          musician={selectedMusician}
          onClose={() => {
            setShowMusicianPopup(false);
            setSelectedMusician(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
