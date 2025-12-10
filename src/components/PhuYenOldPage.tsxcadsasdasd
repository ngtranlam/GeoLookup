import React, { useState, useEffect } from 'react';
import './PhuYenOldPageEnhancements.css';

interface District {
  district_number: number;
  name: string;
  type: string;
  established?: number;
  area: string;
  population: string;
  subdivisions: {
    wards?: string[];
    townships?: string[];
    communes?: string[];
  };
  total_subdivisions: string;
  map: {
    title: string;
    image_url: string;
  };
}

const PhuYenOldPage: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Auto scroll modal to center when opened
  useEffect(() => {
    if (selectedDistrict) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Wait for modal to render then scroll to center it
      setTimeout(() => {
        const modal = document.querySelector('.district-modal');
        if (modal) {
          const modalRect = modal.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const modalHeight = modalRect.height;
          
          // Calculate scroll position to center modal
          const scrollTop = window.pageYOffset;
          const modalTop = modalRect.top + scrollTop;
          const targetScroll = modalTop - (viewportHeight - modalHeight) / 2;
          
          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }
      }, 50);
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDistrict]);

  // Data đầy đủ từ JSON file
  const phuyenData = {
    title: "Tổng quan về tỉnh Phú Yên trước sát nhập",
    description: "Tài liệu tổng quan về tỉnh Phú Yên, bao gồm thông tin về vị trí địa lý, điều kiện tự nhiên, dân số và đơn vị hành chính",
    overview: {
      introduction: "Tỉnh Phú Yên nằm ở vùng Duyên hải Nam Trung Bộ Việt Nam, có vị trí địa lý quan trọng trong hành lang kinh tế Đông – Tây và ven biển miền Trung.",
      basic_info: {
        area: "5.045,3 km²",
        population: "874.071 người (năm 2020)",
        capital: "Thành phố Tuy Hòa",
        coastline: "189 km",
        terrain_zones: [
          "Vùng núi và trung du (phía tây)",
          "Vùng đồng bằng (dọc sông Ba)",
          "Vùng ven biển (phía đông)"
        ]
      }
    },
    geography: {
      borders: [
        {
          direction: "Phía Bắc",
          adjacent: "1 phần tỉnh Đắk Lắk và tỉnh Bình Định",
          natural_border: "Dãy núi Cù Mông"
        },
        {
          direction: "Phía Nam", 
          adjacent: "tỉnh Đắk Lắk và tỉnh Khánh Hòa",
          natural_border: "Dãy núi Đại Lãnh, đèo Cả (quốc lộ 1A)"
        },
        {
          direction: "Phía Tây",
          adjacent: "các tỉnh Gia Lai và Đắk Lắk",
          terrain: "Địa hình đồi núi chuyển tiếp từ cao nguyên xuống trung du và đồng bằng"
        },
        {
          direction: "Phía Đông",
          adjacent: "Biển Đông",
          coastline: "189 km"
        }
      ]
    },
    terrain: {
      regions: [
        {
          name: "Vùng núi và trung du",
          location: "Phía tây tỉnh",
          districts: ["Sông Hinh", "Sơn Hòa", "Đồng Xuân"],
          characteristics: "Địa hình đồi núi thấp xen lẫn các thung lũng sông, thích hợp phát triển nông lâm nghiệp"
        },
        {
          name: "Vùng đồng bằng",
          location: "Dọc các con sông chính như sông Ba",
          characteristics: "Nơi tập trung dân cư đông đúc và các trung tâm hành chính – kinh tế lớn"
        },
        {
          name: "Vùng ven biển",
          location: "Phía đông",
          features: ["Bãi biển Tuy Hòa", "Vũng Rô", "Bãi Môn", "Hệ thống đầm phá và vịnh nhỏ"],
          advantages: "Thuận lợi cho nuôi trồng thủy sản và phát triển du lịch"
        }
      ]
    },
    transport: {
      roads: [
        {
          name: "Quốc lộ 1A",
          description: "Tuyến đường huyết mạch chạy dọc qua Phú Yên",
          connection: "Nối tỉnh với Bình Định (phía Bắc) và Khánh Hòa (phía Nam)"
        },
        {
          name: "Quốc lộ 25",
          connection: "Kết nối Phú Yên với tỉnh Gia Lai"
        },
        {
          name: "Quốc lộ 29", 
          connection: "Liên kết Phú Yên với tỉnh Đắk Lắk"
        }
      ],
      railways: [
        {
          name: "Tuyến đường sắt Bắc – Nam",
          main_station: "Ga Tuy Hòa",
          other_stations: ["Ga Đông Tác", "Ga Phú Hiệp"]
        }
      ]
    },
    districts: [
      {
        district_number: 1,
        name: "Thành phố Tuy Hòa",
        type: "Thành phố",
        established: 2005,
        area: "106,82 km²",
        population: "155.920 người",
        subdivisions: {
          wards: ["Phường 1", "Phường 2", "Phường 4", "Phường 5", "Phường 7", "Phường 9", "Phú Đông", "Phú Lâm", "Phú Thạnh"],
          communes: ["An Phú", "Bình Kiến", "Hòa Kiến"]
        },
        total_subdivisions: "9 phường và 3 xã",
        map: {
          title: "Bản đồ hành chính Thành phố Tuy Hòa",
          image_url: "/images/phuyen_old/hinh_2.png"
        }
      },
      {
        district_number: 2,
        name: "Thị xã Sông Cầu",
        type: "Thị xã",
        established: 2009,
        area: "492,8 km²",
        population: "120.780 người",
        subdivisions: {
          wards: ["Xuân Đài", "Xuân Phú", "Xuân Thành", "Xuân Yên"],
          communes: ["Xuân Bình", "Xuân Cảnh", "Xuân Hải", "Xuân Lâm", "Xuân Lộc", "Xuân Phương", "Xuân Thịnh", "Xuân Thọ 1", "Xuân Thọ 2"]
        },
        total_subdivisions: "4 phường và 9 xã",
        map: {
          title: "Bản đồ hành chính Thị xã Sông Cầu",
          image_url: "/images/phuyen_old/hinh_3.png"
        }
      },
      {
        district_number: 3,
        name: "Thị xã Đông Hòa",
        type: "Thị xã",
        established: 2020,
        area: "265,62 km²",
        population: "119.921 người",
        subdivisions: {
          wards: ["Hòa Hiệp Bắc", "Hòa Hiệp Nam", "Hòa Hiệp Trung", "Hòa Vinh", "Hòa Xuân Tây"],
          communes: ["Hòa Tâm", "Hòa Tân Đông", "Hòa Thành", "Hòa Xuân Đông", "Hòa Xuân Nam"]
        },
        total_subdivisions: "5 phường và 5 xã",
        map: {
          title: "Bản đồ hành chính Thị xã Đông Hòa",
          image_url: "/images/phuyen_old/hinh_4.png"
        }
      },
      {
        district_number: 4,
        name: "Huyện Tuy An",
        type: "Huyện",
        area: "435 km²",
        population: "133.000 người",
        subdivisions: {
          townships: ["Chí Thạnh"],
          communes: ["An Cư", "An Chấn", "An Dân", "An Định", "An Hải", "An Hiệp", "An Hòa Hải", "An Lĩnh", "An Mỹ", "An Nghiệp", "An Ninh Đông", "An Ninh Tây", "An Thạch", "An Thọ", "An Xuân"]
        },
        total_subdivisions: "1 thị trấn và 15 xã",
        map: {
          title: "Bản đồ hành chính Huyện Tuy An",
          image_url: "/images/phuyen_old/hinh_5.png"
        }
      },
      {
        district_number: 5,
        name: "Huyện Phú Hòa",
        type: "Huyện",
        established: 2002,
        area: "264,2 km²",
        population: "113.850 người",
        subdivisions: {
          townships: ["Phú Hòa"],
          communes: ["Hòa An", "Hòa Định Đông", "Hòa Định Tây", "Hòa Hội", "Hòa Quang Bắc", "Hòa Quang Nam", "Hòa Thắng", "Hòa Trị"]
        },
        total_subdivisions: "1 thị trấn và 8 xã",
        map: {
          title: "Bản đồ hành chính Huyện Phú Hòa",
          image_url: "/images/phuyen_old/hinh_6.png"
        }
      },
      {
        district_number: 6,
        name: "Huyện Tây Hòa",
        type: "Huyện",
        established: 2005,
        area: "610,43 km²",
        population: "127.000 người",
        subdivisions: {
          townships: ["Phú Thứ"],
          communes: ["Hòa Bình 1", "Hòa Đồng", "Hòa Mỹ Đông", "Hòa Mỹ Tây", "Hòa Phong", "Hòa Phú", "Hòa Tân Tây", "Hòa Thịnh", "Sơn Thành Đông", "Sơn Thành Tây"]
        },
        total_subdivisions: "1 thị trấn và 10 xã",
        map: {
          title: "Bản đồ hành chính Huyện Tây Hòa",
          image_url: "/images/phuyen_old/hinh_7.png"
        }
      },
      {
        district_number: 7,
        name: "Huyện Sơn Hòa",
        type: "Huyện",
        established: 1984,
        area: "950,33 km²",
        population: "60.290 người",
        subdivisions: {
          townships: ["Củng Sơn"],
          communes: ["Cà Lúi", "Ea Chà Rang", "Krông Pa", "Phước Tân", "Sơn Định", "Sơn Hà", "Sơn Hội", "Sơn Long", "Sơn Nguyên", "Sơn Phước", "Sơn Xuân", "Suối Bạc", "Suối Trai"]
        },
        total_subdivisions: "1 thị trấn và 13 xã",
        map: {
          title: "Bản đồ hành chính Huyện Sơn Hòa",
          image_url: "/images/phuyen_old/hinh_8.png"
        }
      },
      {
        district_number: 8,
        name: "Huyện Sông Hinh",
        type: "Huyện",
        established: 1985,
        area: "890,2 km²",
        population: "58.700 người",
        subdivisions: {
          townships: ["Hai Riêng"],
          communes: ["Đức Bình Đông", "Đức Bình Tây", "Ea Bá", "Ea Bar", "Ea Bia", "Ea Lâm", "Ea Ly", "Ea Trol", "Sông Hinh", "Sơn Giang"]
        },
        total_subdivisions: "1 thị trấn và 10 xã",
        map: {
          title: "Bản đồ hành chính Huyện Sông Hinh",
          image_url: "/images/phuyen_old/hinh_9.png"
        }
      },
      {
        district_number: 9,
        name: "Huyện Đồng Xuân",
        type: "Huyện",
        established: 1611,
        area: "1.065,08 km²",
        population: "65.300 người",
        subdivisions: {
          townships: ["La Hai"],
          communes: ["Đa Lộc", "Phú Mỡ", "Xuân Lãnh", "Xuân Long", "Xuân Phước", "Xuân Quang 1", "Xuân Quang 2", "Xuân Quang 3", "Xuân Sơn Bắc", "Xuân Sơn Nam"]
        },
        total_subdivisions: "1 thị trấn và 10 xã",
        map: {
          title: "Bản đồ hành chính Huyện Đồng Xuân",
          image_url: "/images/phuyen_old/hinh_10.png"
        }
      }
    ]
  };

  // Navigation sections với SVG icons chuyên nghiệp
  const sections = [
    {
      id: 'overview',
      title: 'Tổng quan',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 'geography',
      title: 'Địa lý',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 'nature',
      title: 'Tự nhiên',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 'transport',
      title: 'Giao thông',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6.01M6.5,7H17.5L19,12H5L6.5,7M7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16M16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 'districts',
      title: 'Đơn vị hành chính',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12,2L3.09,7.26L4.91,8.74L12,4.15L19.09,8.74L20.91,7.26L12,2M5,9V14H7V11H9V14H11V9H5M13,9V14H19V12H15V11H19V9H13M15,13H17V14H15V13Z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <div className="daklak-old-page">
      {/* Hero Section - sử dụng CSS của DakLak */}
      <div className="daklak-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img src="/images/phuyen_old/hinh_1.png" alt="Bản đồ Phú Yên" className="hero-bg-image" />
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-main">Tỉnh Phú Yên</span>
                <span className="title-sub">Trước sát nhập</span>
              </h1>
              <p className="hero-description">
                Khám phá lịch sử, địa lý và văn hóa của tỉnh Phú Yên trong giai đoạn trước khi sát nhập
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">5.045</span>
                  <span className="stat-label">km² diện tích</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">874K</span>
                  <span className="stat-label">dân số</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">9</span>
                  <span className="stat-label">đơn vị hành chính</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">189</span>
                  <span className="stat-label">km bờ biển</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - sử dụng CSS của DakLak */}
      <div className="daklak-nav">
        <div className="container">
          <div className="nav-sections">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-section ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-title">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections - sử dụng CSS của DakLak */}
      <div className="daklak-content">
        <div className="container">
          {activeSection === 'overview' && (
            <div className="content-section overview-section">
              <div className="section-header">
                <h2>Tổng quan về tỉnh Phú Yên</h2>
                <p>Vùng đất ven biển Nam Trung Bộ với bản sắc văn hóa đặc trưng</p>
              </div>
              
              <div className="overview-content">
                <div className="overview-text">
                  <div className="intro-text">
                    {phuyenData.overview.introduction}
                  </div>
                  
                  <div className="basic-info-grid">
                    <div className="info-card">
                      <div className="info-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="info-content">
                        <h4>Diện tích</h4>
                        <p>{phuyenData.overview.basic_info.area}</p>
                        <span className="info-note">Duyên hải Nam Trung Bộ</span>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <div className="info-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H17c-.8 0-1.54.37-2.01.99l-2.54 3.4c-.74.99-.74 2.31 0 3.3l1.18 1.58-.89 4.73H8c-1.1 0-2-.9-2-2v-7c0-.55-.45-1-1-1s-1 .45-1 1v7c0 2.21 1.79 4 4 4h12z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="info-content">
                        <h4>Dân số</h4>
                        <p>{phuyenData.overview.basic_info.population}</p>
                        <span className="info-note">Năm 2020</span>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <div className="info-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12,2L3.09,7.26L4.91,8.74L12,4.15L19.09,8.74L20.91,7.26L12,2M5,9V14H7V11H9V14H11V9H5M13,9V14H19V12H15V11H19V9H13M15,13H17V14H15V13Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="info-content">
                        <h4>Thủ phủ</h4>
                        <p>{phuyenData.overview.basic_info.capital}</p>
                        <span className="info-note">Trung tâm tỉnh</span>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <div className="info-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="info-content">
                        <h4>Bờ biển</h4>
                        <p>{phuyenData.overview.basic_info.coastline}</p>
                        <span className="info-note">Biển Đông</span>
                      </div>
                    </div>
                  </div>

                  <div className="terrain-zones">
                    <h4>Vùng địa hình</h4>
                    <div className="zones-list">
                      {phuyenData.overview.basic_info.terrain_zones.map((zone, index) => (
                        <div key={index} className="zone-item">
                          <span className="zone-bullet">•</span>
                          <span className="zone-text">{zone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="overview-visual">
                  <div className="map-container">
                    <img src="/images/phuyen_old/hinh_1.png" alt="Bản đồ hành chính Phú Yên" />
                    <div className="map-caption">Bản đồ hành chính tỉnh Phú Yên</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'geography' && (
            <div className="content-section geography-section">
              <div className="section-header">
                <h2>Vị trí địa lý</h2>
                <p>Phú Yên nằm ở vùng Duyên hải Nam Trung Bộ với vị trí chiến lược</p>
              </div>
              
              <div className="geography-content">
                <div className="borders-info">
                  <h3>Ranh giới hành chính</h3>
                  <div className="borders-grid">
                    {phuyenData.geography.borders.map((border, index) => (
                      <div key={index} className="border-item">
                        <div className="border-direction">{border.direction}</div>
                        <div className="border-adjacent">{border.adjacent}</div>
                        {border.natural_border && (
                          <div className="border-note">{border.natural_border}</div>
                        )}
                        {border.terrain && (
                          <div className="border-note">{border.terrain}</div>
                        )}
                        {border.coastline && (
                          <div className="border-note">{border.coastline} đường bờ biển</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'nature' && (
            <div className="content-section nature-section">
              <div className="section-header">
                <h2>Điều kiện tự nhiên</h2>
                <p>Phú Yên có 3 vùng địa hình đặc trưng và khí hậu nhiệt đới gió mùa</p>
              </div>
              
              <div className="nature-content">
                <div className="nature-grid">
                  {phuyenData.terrain.regions.map((region, index) => (
                    <div key={index} className="nature-card">
                      <div className="nature-icon">
                        {index === 0 ? (
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z" fill="currentColor"/>
                          </svg>
                        ) : index === 1 ? (
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22V16H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V16H2V14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z" fill="currentColor"/>
                          </svg>
                        ) : (
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12,18H6L4,16L6,14H18L20,16L18,18H12M12,16A1,1 0 0,0 13,15A1,1 0 0,0 12,14A1,1 0 0,0 11,15A1,1 0 0,0 12,16M21,4H3A1,1 0 0,0 2,5V11A1,1 0 0,0 3,12H21A1,1 0 0,0 22,11V5A1,1 0 0,0 21,4Z" fill="currentColor"/>
                          </svg>
                        )}
                      </div>
                      <h4>{region.name}</h4>
                      <p><strong>Vị trí:</strong> {region.location}</p>
                      {region.districts && (
                        <p><strong>Các huyện:</strong> {region.districts.join(', ')}</p>
                      )}
                      {region.features && (
                        <div>
                          <p><strong>Đặc điểm:</strong></p>
                          <ul>
                            {region.features.map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p><strong>Đặc trưng:</strong> {region.characteristics || region.advantages}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'transport' && (
            <div className="content-section transport-section">
              <div className="section-header">
                <h2>Hệ thống giao thông</h2>
                <p>Phú Yên có hệ thống giao thông đa dạng, bao gồm đường bộ, đường sắt, đường thủy và đường hàng không, giúp kết nối tỉnh với các khu vực khác trong nước</p>
              </div>
              
              <div className="transport-content">
                <div className="transport-grid">
                  <div className="transport-card">
                    <div className="transport-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18,15H6V9H18M18,7H6A2,2 0 0,0 4,9V15A2,2 0 0,0 6,17H18A2,2 0 0,0 20,15V9A2,2 0 0,0 18,7M2,19H4V21H6V19H18V21H20V19H22V17H2V19Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Đường bộ</h4>
                    <ul>
                      <li>
                        <strong>Quốc lộ 1A:</strong> Tuyến đường huyết mạch chạy dọc qua Phú Yên
                        <br />
                        <em>Nối tỉnh với Bình Định (phía Bắc) và Khánh Hòa (phía Nam)</em>
                      </li>
                      <li>
                        <strong>Quốc lộ 25:</strong> Kết nối Phú Yên với tỉnh Gia Lai
                        <br />
                        <em>Tạo điều kiện thuận lợi cho giao thương giữa vùng duyên hải Nam Trung Bộ và Tây Nguyên</em>
                      </li>
                      <li>
                        <strong>Quốc lộ 29:</strong> Liên kết Phú Yên với tỉnh Đắk Lắk
                        <br />
                        <em>Tuyến đường quan trọng cho việc giao thương giữa các khu vực</em>
                      </li>
                      <li>
                        <strong>Đường tỉnh lộ và huyện:</strong> Hệ thống đường tỉnh và đường huyện kết nối các xã, phường, thị trấn
                        <br />
                        <em>Đảm bảo việc di chuyển thuận lợi trong nội tỉnh</em>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="transport-card">
                    <div className="transport-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12,2C8,2 5,5 5,9V15C5,16 5,17 6,17H7V16H8V18H16V16H17V17C18,17 18,16 18,15V9C18,5 15,2 12,2M7.5,9A1.5,1.5 0 0,1 9,7.5A1.5,1.5 0 0,1 10.5,9A1.5,1.5 0 0,1 9,10.5A1.5,1.5 0 0,1 7.5,9M16.5,9A1.5,1.5 0 0,1 18,7.5A1.5,1.5 0 0,1 19.5,9A1.5,1.5 0 0,1 18,10.5A1.5,1.5 0 0,1 16.5,9M6,18H18V20H6V18Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Đường sắt</h4>
                    <ul>
                      <li>
                        <strong>Tuyến đường sắt Bắc – Nam:</strong> Chạy qua Phú Yên
                        <br />
                        <strong>Ga chính:</strong> Ga Tuy Hòa
                        <br />
                        <strong>Các ga khác:</strong> Ga Đông Tác, Ga Phú Hiệp
                      </li>
                      <li>
                        <strong>Chức năng:</strong> Phục vụ cho việc vận chuyển hành khách và hàng hóa
                        <br />
                        <em>Một trong những tuyến giao thông quan trọng, giúp kết nối Phú Yên với các tỉnh từ Bắc vào Nam</em>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="transport-card">
                    <div className="transport-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21,16V14L13,9V7A3,3 0 0,0 10,4A3,3 0 0,0 7,7V9L-1,14V16L7,13.5V19L5,20.5V21.5L10,20L15,21.5V20.5L13,19V13.5L21,16Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Giao thông khác</h4>
                    <ul>
                      <li>
                        <strong>Đường thủy:</strong> Hệ thống sông Ba và các sông nhỏ
                        <br />
                        <em>Phục vụ vận chuyển nội địa và du lịch sinh thái</em>
                      </li>
                      <li>
                        <strong>Cảng biển:</strong> Cảng Tuy Hòa và các cảng nhỏ
                        <br />
                        <em>Phục vụ ngư nghiệp và vận chuyển hàng hóa ven biển</em>
                      </li>
                      <li>
                        <strong>Sân bay:</strong> Sân bay Tuy Hòa (dự kiến phát triển)
                        <br />
                        <em>Tiềm năng phát triển du lịch và kết nối hàng không</em>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="transport-map-section">
                  <div className="map-header">
                    <h3>Bản đồ giao thông tỉnh Phú Yên</h3>
                    <p>Hệ thống đường bộ và đường sắt kết nối các vùng</p>
                  </div>
                  <div className="transport-map-container">
                    <div className="map-overlay">
                      <div className="map-legend">
                        <div className="legend-item">
                          <div className="legend-color" style={{backgroundColor: '#e74c3c'}}></div>
                          <span>Quốc lộ</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color" style={{backgroundColor: '#3498db'}}></div>
                          <span>Đường sắt</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color" style={{backgroundColor: '#f39c12'}}></div>
                          <span>Trung tâm hành chính</span>
                        </div>
                      </div>
                    </div>
                    <img src="/images/phuyen_old/hinh_11.png" alt="Bản đồ giao thông Phú Yên" className="transport-map-image" />
                    <div className="map-caption">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                      </svg>
                      Bản đồ giao thông tỉnh Phú Yên - Cập nhật 2020
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'districts' && (
            <div className="content-section districts-section">
              <div className="section-header">
                <h2>Đơn vị hành chính</h2>
                <p>Phú Yên có 9 đơn vị cấp huyện với 106 đơn vị cấp xã</p>
              </div>
              
              <div className="districts-summary">
                <div className="summary-stats">
                  <div className="summary-stat">
                    <span className="stat-number">1</span>
                    <span className="stat-label">Thành phố</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number">2</span>
                    <span className="stat-label">Thị xã</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number">6</span>
                    <span className="stat-label">Huyện</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number">106</span>
                    <span className="stat-label">Đơn vị cấp xã</span>
                  </div>
                </div>
              </div>
              
              <div className="districts-grid">
                {phuyenData.districts.map((district, index) => (
                  <div 
                    key={district.district_number} 
                    className="district-card-modern"
                    onClick={() => setSelectedDistrict(district)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="district-card-background"></div>
                    <div className="district-card-content">
                      <div className="district-header-modern">
                        <div className="district-icon">
                          {district.type === 'Thành phố' ? (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12,2L3.09,7.26L4.91,8.74L12,4.15L19.09,8.74L20.91,7.26L12,2M5,9V14H7V11H9V14H11V9H5M13,9V14H19V12H15V11H19V9H13M15,13H17V14H15V13Z" fill="currentColor"/>
                            </svg>
                          ) : district.type === 'Thị xã' ? (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75Z" fill="currentColor"/>
                            </svg>
                          ) : (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" fill="currentColor"/>
                            </svg>
                          )}
                        </div>
                        <div className="district-title-section">
                          <h4 className="district-name">{district.name}</h4>
                          <span className={`district-type-badge ${district.type.toLowerCase().replace(' ', '-')}`}>
                            {district.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="district-stats-grid">
                        <div className="stat-item-modern">
                          <div className="stat-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div className="stat-content">
                            <span className="stat-value-modern">{district.area}</span>
                            <span className="stat-label-modern">Diện tích</span>
                          </div>
                        </div>
                        
                        <div className="stat-item-modern">
                          <div className="stat-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H17c-.8 0-1.54.37-2.01.99l-2.54 3.4c-.74.99-.74 2.31 0 3.3l1.18 1.58-.89 4.73H8c-1.1 0-2-.9-2-2v-7c0-.55-.45-1-1-1s-1 .45-1 1v7c0 2.21 1.79 4 4 4h12z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div className="stat-content">
                            <span className="stat-value-modern">{district.population}</span>
                            <span className="stat-label-modern">Dân số</span>
                          </div>
                        </div>
                        
                        {district.established && (
                          <div className="stat-item-modern">
                            <div className="stat-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" fill="currentColor"/>
                              </svg>
                            </div>
                            <div className="stat-content">
                              <span className="stat-value-modern">{district.established}</span>
                              <span className="stat-label-modern">Thành lập</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="stat-item-modern">
                          <div className="stat-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12,2L3.09,7.26L4.91,8.74L12,4.15L19.09,8.74L20.91,7.26L12,2M5,9V14H7V11H9V14H11V9H5M13,9V14H19V12H15V11H19V9H13M15,13H17V14H15V13Z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div className="stat-content">
                            <span className="stat-value-modern">{district.total_subdivisions}</span>
                            <span className="stat-label-modern">Đơn vị cấp xã</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="district-action-modern">
                        <span className="action-text">Xem chi tiết</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* District Modal - sử dụng CSS của DakLak */}
      {selectedDistrict && (
        <div className="district-modal-overlay" onClick={() => setSelectedDistrict(null)}>
          <div className="district-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDistrict.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedDistrict(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-info">
                <div className="modal-details">
                  <h4>Thông tin chung</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Loại</span>
                      <span className="detail-value">{selectedDistrict.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Diện tích</span>
                      <span className="detail-value">{selectedDistrict.area}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dân số</span>
                      <span className="detail-value">{selectedDistrict.population}</span>
                    </div>
                    {selectedDistrict.established && (
                      <div className="detail-item">
                        <span className="detail-label">Thành lập</span>
                        <span className="detail-value">{selectedDistrict.established}</span>
                      </div>
                    )}
                  </div>
                  
                  <h4>Đơn vị hành chính</h4>
                  
                  {selectedDistrict.subdivisions.wards && selectedDistrict.subdivisions.wards.length > 0 && (
                    <div className="subdivisions-section">
                      <h5>Phường ({selectedDistrict.subdivisions.wards.length})</h5>
                      <div className="subdivisions-list">
                        {selectedDistrict.subdivisions.wards.map((ward, index) => (
                          <span key={index} className="subdivision-item">{ward}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDistrict.subdivisions.townships && selectedDistrict.subdivisions.townships.length > 0 && (
                    <div className="subdivisions-section">
                      <h5>Thị trấn ({selectedDistrict.subdivisions.townships.length})</h5>
                      <div className="subdivisions-list">
                        {selectedDistrict.subdivisions.townships.map((township, index) => (
                          <span key={index} className="subdivision-item">{township}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDistrict.subdivisions.communes && selectedDistrict.subdivisions.communes.length > 0 && (
                    <div className="subdivisions-section">
                      <h5>Xã ({selectedDistrict.subdivisions.communes.length})</h5>
                      <div className="subdivisions-list">
                        {selectedDistrict.subdivisions.communes.map((commune, index) => (
                          <span key={index} className="subdivision-item">{commune}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="modal-map">
                  <img 
                    src={selectedDistrict.map.image_url}
                    alt={selectedDistrict.map.title}
                    className="district-map-image"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="map-caption">{selectedDistrict.map.title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhuYenOldPage;
