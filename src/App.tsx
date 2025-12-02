import React, { useState } from 'react';
import { searchLandmarkWithEnhancedAddress } from './services/enhancedGeminiService';
import { searchMusicianWithGemini, MusicianResult as MusicianData } from './services/musicianGeminiService';
import Quiz from './components/Quiz';
import LandmarkResult from './components/LandmarkResult';
import LandmarkDetailPopup from './components/LandmarkDetailPopup';
import MusicianResultCard from './components/MusicianResult';
import MusicianDetailPopup from './components/MusicianDetailPopup';

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
  const [currentPage, setCurrentPage] = useState<'explore' | 'quiz'>('explore');

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
      <header className="header">
        <div className="container">
          <nav className="nav">
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
                onClick={() => setCurrentPage('explore')}
              >
                Khám phá
              </button>
              <button 
                className={`nav-btn ${currentPage === 'quiz' ? 'nav-btn-active' : ''}`}
                onClick={() => setCurrentPage('quiz')}
              >
                Bài tập
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Conditional Content Based on Current Page */}
      {currentPage === 'explore' ? (
        <>
          {/* Hero Section */}
          <section className="hero">
        <div className="container">
          <h1>Khám phá Địa danh Tỉnh Đắk Lắk</h1>
          <p>
            Tìm kiếm thông tin về địa chỉ cũ và mới của các địa danh sau việc tái cấu trúc hành chính tại Việt Nam
          </p>

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

          {/* Stats */}
          <div className="stats">
            <div className="stat-card">
              <h3>99+</h3>
              <p>Địa danh nổi tiếng</p>
            </div>
            <div className="stat-card">
              <h3>99+</h3>
              <p>Đơn vị hành chính cập nhật mới</p>
            </div>
            <div className="stat-card">
              <h3>AI</h3>
              <p>Tìm kiếm thông minh với AI</p>
            </div>
          </div>

          {/* Info Section */}
          <div style={{textAlign: 'center', padding: '2rem 0'}}>
            <div className="sphere-title">Hơn 100 địa danh nổi tiếng Việt Nam</div>
            <p style={{fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem'}}>
              Khám phá hình cầu 3D bên trái với 100+ địa danh nổi tiếng khắp Việt Nam. 
              Click vào bất kỳ địa danh nào để tìm kiếm thông tin chi tiết.
            </p>
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

          {/* Footer */}
          <footer className="footer">
            <div className="container">
              <p>© 2025 THCS Nguyễn Bình Khiêm. Made with ❤️ by Students</p>
            </div>
          </footer>
        </>
      ) : (
        /* Quiz Page Content */
        <>
          <section className="hero">
            <div className="container">
              <Quiz />
            </div>
          </section>
          
          {/* Footer for Quiz Page */}
          <footer className="footer">
            <div className="container">
              <p>© 2025 THCS Nguyễn Bình Khiêm. Made with ❤️ by Students</p>
            </div>
          </footer>
        </>
      )}

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
