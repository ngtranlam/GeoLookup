import React, { useState, useEffect } from 'react';
import '../components/PhuYenOldPageEnhancements.css';

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
  note?: string;
}

const DakLakOldPage: React.FC = () => {
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

  // Data từ JSON file
  const dakLakData = {
    title: "Tổng quan về tỉnh Đắk Lắk trước sát nhập",
    description: "Tài liệu tổng quan về tỉnh Đắk Lắk, bao gồm thông tin về vị trí địa lý, điều kiện tự nhiên, kinh tế, giao thông và đơn vị hành chính",
    overview: {
      introduction: "Đắk Lắk là tỉnh nằm ở trung tâm vùng Tây Nguyên của Việt Nam, giữ vị trí chiến lược trong tam giác phát triển Việt Nam - Lào - Campuchia. Với diện tích tự nhiên khoảng 13.125 km², Đắk Lắk là tỉnh có diện tích lớn thứ tư cả nước. Thành phố Buôn Ma Thuột là trung tâm hành chính, kinh tế, văn hóa của tỉnh, được định hướng phát triển thành đô thị trung tâm của vùng Tây Nguyên. Dân số toàn tỉnh hiện khoảng 1,87 triệu người (năm 2024), với trên 40 dân tộc anh em cùng sinh sống. Người Kinh chiếm khoảng 70% dân số, bên cạnh đó là các dân tộc bản địa như Ê Đê, M'Nông, Gia Rai, cùng các cộng đồng Tày, Nùng, Dao, Mông và nhiều dân tộc khác. Đây là vùng đất giàu bản sắc văn hóa, nơi giao thoa văn hóa dân tộc, nổi bật với không gian văn hóa cồng chiêng Tây Nguyên — Di sản văn hóa phi vật thể của nhân loại, cùng nhiều lễ hội truyền thống đặc sắc được bảo tồn và phát huy trong đời sống cộng đồng.",
      basic_info: {
        area: "13.125 km²",
        area_rank: "Lớn thứ tư cả nước",
        population: "1,87 triệu người (2024)",
        capital: "Thành phố Buôn Ma Thuột",
        ethnic_groups: "Trên 40 dân tộc (Kinh 70%, Ê Đê, M'Nông, Gia Rai, Tày, Nùng, Dao, Mông...)",
        cultural_heritage: "Không gian văn hóa cồng chiêng Tây Nguyên - Di sản văn hóa phi vật thể của nhân loại"
      }
    },
    districts: [
      {
        district_number: 1,
        name: "Thành phố Buôn Ma Thuột",
        type: "Thành phố",
        established: 1995,
        area: "377,2 km²",
        population: "502.170 người",
        subdivisions: {
          wards: ["Ea Tam", "Khánh Xuân", "Tân An", "Tân Hòa", "Tân Lập", "Tân Lợi", "Tân Thành", "Tân Tiến", "Thắng Lợi", "Thành Công", "Tự An"],
          communes: ["Cư Êbur", "Ea Kao", "Ea Tu", "Hòa Khánh", "Hòa Phú", "Hòa Thắng", "Hòa Thuận", "Hòa Xuân"]
        },
        total_subdivisions: "11 phường và 8 xã",
        map: {
          title: "Bản đồ hành chính Thành phố Buôn Ma Thuột",
          image_url: "/images/daklak_old/hinh_3.png"
        }
      },
      {
        district_number: 2,
        name: "Thị xã Buôn Hồ",
        type: "Thị xã",
        established: 2008,
        area: "282,1 km²",
        population: "127.920 người",
        subdivisions: {
          wards: ["An Bình", "An Lạc", "Bình Tân", "Đạt Hiếu", "Đoàn Kết", "Thiện An", "Thống Nhất"],
          communes: ["Bình Thuận", "Cư Bao", "Ea Blang", "Ea Drông", "Ea Siên"]
        },
        total_subdivisions: "7 phường và 5 xã",
        map: {
          title: "Bản đồ hành chính Thị xã Buôn Hồ",
          image_url: "/images/daklak_old/hinh_4.png"
        }
      },
      {
        district_number: 3,
        name: "Huyện Buôn Đôn",
        type: "Huyện",
        established: 1995,
        area: "1.412,50 km²",
        population: "70.650 người",
        subdivisions: {
          communes: ["Cuôr Knia", "Ea Bar", "Ea Huar", "Ea Nuôl", "Ea Wer", "Krông Na", "Tân Hòa"]
        },
        total_subdivisions: "7 xã",
        map: {
          title: "Bản đồ hành chính Huyện Buôn Đôn",
          image_url: "/images/daklak_old/hinh_5.png"
        }
      },
      {
        district_number: 4,
        name: "Huyện Cư Kuin",
        type: "Huyện",
        established: 2007,
        area: "288,3 km²",
        population: "103.842 người",
        subdivisions: {
          communes: ["Cư Êwi", "Dray Bhăng", "Ea Bhôk", "Ea Hu", "Ea Ktur", "Ea Ning", "Ea Tiêu", "Hòa Hiệp"]
        },
        total_subdivisions: "8 xã",
        map: {
          title: "Bản đồ hành chính Huyện Cư Kuin",
          image_url: "/images/daklak_old/hinh_6.png"
        }
      },
      {
        district_number: 5,
        name: "Huyện Cư M'gar",
        type: "Huyện",
        established: 1984,
        area: "821 km²",
        population: "173.024 người",
        subdivisions: {
          townships: ["Quảng Phú", "Ea Pốk"],
          communes: ["Cư Dliê M'nông", "Cư M'gar", "Cư Suê", "Cuôr Đăng", "Ea Drơng", "Ea H'đing", "Ea Kiết", "Ea Kpam", "Ea Kuêh", "Ea M'Drơh", "Ea M'nang", "Ea Tar", "Ea Tul", "Quảng Hiệp", "Quảng Tiến"]
        },
        total_subdivisions: "2 thị trấn và 15 xã",
        map: {
          title: "Bản đồ hành chính Huyện Cư M'gar",
          image_url: "/images/daklak_old/hinh_7.png"
        }
      },
      {
        district_number: 6,
        name: "Huyện Ea H'leo",
        type: "Huyện",
        established: 1980,
        area: "1.335 km²",
        population: "128.347 người",
        subdivisions: {
          townships: ["Ea Drăng"],
          communes: ["Cư A Mung", "Cư Mốt", "Dliê Yang", "Ea Hiao", "Ea H'leo", "Ea Khăl", "Ea Nam", "Ea Ral", "Ea Sol", "Ea Tir", "Ea Wy"]
        },
        total_subdivisions: "1 thị trấn và 11 xã",
        map: {
          title: "Bản đồ hành chính Huyện Ea H'leo",
          image_url: "/images/daklak_old/hinh_8.png"
        }
      },
      {
        district_number: 7,
        name: "Huyện Ea Kar",
        type: "Huyện",
        established: 1986,
        area: "1.021 km²",
        population: "150.895 người",
        subdivisions: {
          townships: ["Ea Kar", "Ea Knốp"],
          communes: ["Cư Bông", "Cư Elang", "Cư Huê", "Cư Ni", "Cư Prông", "Cư Yang", "Ea Đar", "Ea Kmút", "Ea Ô", "Ea Păl", "Ea Sar", "Ea Sô", "Ea Tíh", "Xuân Phú"]
        },
        total_subdivisions: "2 thị trấn và 14 xã",
        map: {
          title: "Bản đồ hành chính Huyện Ea Kar",
          image_url: "/images/daklak_old/hinh_9.png"
        }
      },
      {
        district_number: 8,
        name: "Huyện Ea Súp",
        type: "Huyện",
        established: 1977,
        area: "1.750 km²",
        population: "67.120 người",
        subdivisions: {
          townships: ["Ea Súp"],
          communes: ["Cư Kbang", "Cư M'lan", "Ea Bung", "Ea Lê", "Ea Rốk", "Ia JLơi", "Ia Lốp", "Ia Rvê", "Ya Tờ Mốt"]
        },
        total_subdivisions: "1 thị trấn và 9 xã",
        map: {
          title: "Bản đồ hành chính Huyện Ea Súp",
          image_url: "/images/daklak_old/hinh_10.png"
        }
      },
      {
        district_number: 9,
        name: "Huyện Krông Ana",
        type: "Huyện",
        established: 1981,
        area: "356,1 km²",
        population: "95.210 người",
        subdivisions: {
          townships: ["Buôn Trấp"],
          communes: ["Băng Adrênh", "Bình Hòa", "Dray Sáp", "Dur Kmăl", "Ea Bông", "Ea Na", "Quảng Điền"]
        },
        total_subdivisions: "1 thị trấn và 7 xã",
        map: {
          title: "Bản đồ hành chính Huyện Krông Ana",
          image_url: "/images/daklak_old/hinh_11.png"
        }
      },
      {
        district_number: 10,
        name: "Huyện Krông Bông",
        type: "Huyện",
        established: 1981,
        area: "1.257,49 km²",
        population: "100.900 người",
        subdivisions: {
          townships: ["Krông Kmar"],
          communes: ["Cư Đrăm", "Cư Kty", "Dang Kang", "Ea Trul", "Hòa Lễ", "Hòa Phong", "Hòa Sơn", "Hòa Tân", "Hòa Thành", "Khuê Ngọc Điền", "Yang Mao", "Yang Reh"]
        },
        total_subdivisions: "1 thị trấn và 12 xã",
        map: {
          title: "Bản đồ hành chính Huyện Krông Bông",
          image_url: "/images/daklak_old/hinh_12.png"
        }
      },
      {
        district_number: 11,
        name: "Huyện Krông Búk",
        type: "Huyện",
        established: 1975,
        area: "358,7 km²",
        population: "63.850 người",
        subdivisions: {
          townships: ["Pơng Drang"],
          communes: ["Cư Kpô", "Cư Né", "Cư Pơng", "Ea Ngai", "Ea Sin", "Krông Búk"]
        },
        total_subdivisions: "1 thị trấn và 6 xã",
        map: {
          title: "Bản đồ hành chính Huyện Krông Búk",
          image_url: "/images/daklak_old/hinh_13.png"
        }
      },
      {
        district_number: 12,
        name: "Huyện Krông Năng",
        type: "Huyện",
        established: 1987,
        area: "641,8 km²",
        population: "124.577 người",
        subdivisions: {
          townships: ["Krông Năng"],
          communes: ["Cư Klông", "Cư M'gar", "Dliê Ya", "Ea Dăh", "Ea Hồ", "Ea Puk", "Ea Tam", "Ea Tân", "Ea Tóh", "Phú Lộc", "Tam Giang"]
        },
        total_subdivisions: "1 thị trấn và 11 xã",
        map: {
          title: "Bản đồ hành chính Huyện Krông Năng",
          image_url: "/images/daklak_old/hinh_14.png"
        }
      },
      {
        district_number: 13,
        name: "Huyện Krông Pắc",
        type: "Huyện",
        area: "625,8 km²",
        population: "207.226 người",
        subdivisions: {
          townships: ["Phước An"],
          communes: ["Ea Hiu", "Ea Kênh", "Ea Kly", "Ea Knuếc", "Ea Phê", "Ea Uy", "Ea Yông", "Hòa An", "Hòa Đông", "Hòa Tiến", "Krông Búk", "Tân Tiến", "Vụ Bổn"]
        },
        total_subdivisions: "1 thị trấn và 15 xã",
        map: {
          title: "Bản đồ hành chính Huyện Krông Pắc",
          image_url: "/images/daklak_old/hinh_15.png"
        }
      },
      {
        district_number: 14,
        name: "Huyện Lắk",
        type: "Huyện",
        area: "1.250 km²",
        population: "77.390 người",
        subdivisions: {
          townships: ["Liên Sơn"],
          communes: ["Bông Krang", "Buôn Tría", "Đắk Liêng", "Đắk Nuê", "Đắk Phơi", "Đắk Wil", "Ea R'bin", "Krông Nô", "Nam Ka", "Yang Tao"]
        },
        total_subdivisions: "1 thị trấn và 10 xã",
        map: {
          title: "Bản đồ hành chính Huyện Lắk",
          image_url: "/images/daklak_old/hinh_16.png"
        }
      },
      {
        district_number: 15,
        name: "Huyện M'Drắk",
        type: "Huyện",
        established: 1977,
        area: "1.348 km²",
        population: "85.080 người",
        subdivisions: {
          townships: ["M'Drắk"],
          communes: ["Cư K Róa", "Cư M'ta", "Cư Prao", "Ea H'Mlay", "Ea M'doan", "Ea Pil", "Ea Riêng", "Ea Trang", "Krông Á", "Krông Jing", "Cư San", "Ea Lai"]
        },
        total_subdivisions: "1 thị trấn và 12 xã",
        map: {
          title: "Bản đồ hành chính Huyện M'Drắk",
          image_url: "/images/daklak_old/hinh_17.png"
        }
      }
    ]
  };

  const sections = [
    { 
      id: 'overview', 
      title: 'Tổng quan', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
          <path d="M19 15L19.5 17L21 17.5L19.5 18L19 20L18.5 18L17 17.5L18.5 17L19 15Z" fill="currentColor"/>
          <path d="M5 15L5.5 17L7 17.5L5.5 18L5 20L4.5 18L3 17.5L4.5 17L5 15Z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      id: 'geography', 
      title: 'Vị trí địa lý', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      id: 'nature', 
      title: 'Điều kiện tự nhiên', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      id: 'economy', 
      title: 'Kinh tế', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      id: 'transport', 
      title: 'Giao thông', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      id: 'districts', 
      title: 'Đơn vị hành chính', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12,2L3.09,7.26L4.91,8.74L12,4.15L19.09,8.74L20.91,7.26L12,2M5,9V14H7V11H9V14H11V9H5M13,9V14H19V12H15V11H19V9H13M15,13H17V14H15V13Z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <div className="daklak-old-page">
      {/* Hero Section */}
      <div className="daklak-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img src="/images/daklak_old/hinh_1.png" alt="Bản đồ Đắk Lắk" className="hero-bg-image" />
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-main">Tỉnh Đắk Lắk</span>
                <span className="title-sub">Trước sát nhập</span>
              </h1>
              <p className="hero-description">
                Khám phá lịch sử, địa lý và văn hóa của tỉnh Đắk Lắk trong giai đoạn trước khi sát nhập
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">13.125</span>
                  <span className="stat-label">km² diện tích</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1,87M</span>
                  <span className="stat-label">dân số</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">15</span>
                  <span className="stat-label">đơn vị hành chính</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">40+</span>
                  <span className="stat-label">dân tộc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
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

      {/* Content Sections */}
      <div className="daklak-content">
        <div className="container">
          {activeSection === 'overview' && (
            <div className="content-section overview-section">
              <div className="section-header">
                <h2>Tổng quan về tỉnh Đắk Lắk</h2>
                <p>Vùng đất giàu bản sắc văn hóa ở trung tâm Tây Nguyên</p>
              </div>
              
              <div className="overview-content">
                <div className="overview-text">
                  <div className="intro-text">
                    {dakLakData.overview.introduction}
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
                        <p>{dakLakData.overview.basic_info.area}</p>
                        <span className="info-note">{dakLakData.overview.basic_info.area_rank}</span>
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
                        <p>{dakLakData.overview.basic_info.population}</p>
                        <span className="info-note">Năm 2024</span>
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
                        <p>{dakLakData.overview.basic_info.capital}</p>
                        <span className="info-note">Trung tâm Tây Nguyên</span>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <div className="info-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.5,12A1.5,1.5 0 0,0 10,10.5A1.5,1.5 0 0,0 8.5,9A1.5,1.5 0 0,0 7,10.5A1.5,1.5 0 0,0 8.5,12M15.5,12A1.5,1.5 0 0,0 17,10.5A1.5,1.5 0 0,0 15.5,9A1.5,1.5 0 0,0 14,10.5A1.5,1.5 0 0,0 15.5,12M12,2C6.5,2 2,6.5 2,12C2,13.78 2.58,15.41 3.58,16.73L2,22L7.5,20.5C9.25,21.15 11.1,21.5 13,21.5C18.5,21.5 23,17 23,11.5C23,6 18.5,1.5 13,1.5C12.66,1.5 12.33,1.5 12,1.5V2Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="info-content">
                        <h4>Dân tộc</h4>
                        <p>{dakLakData.overview.basic_info.ethnic_groups}</p>
                        <span className="info-note">Đa dạng văn hóa</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="cultural-heritage">
                    <div className="heritage-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12,3C13.05,3 14.05,3.4 14.83,4.17C15.6,4.95 16,5.95 16,7V17C16,18.05 15.6,19.05 14.83,19.83C14.05,20.6 13.05,21 12,21C10.95,21 9.95,20.6 9.17,19.83C8.4,19.05 8,18.05 8,17V7C8,5.95 8.4,4.95 9.17,4.17C9.95,3.4 10.95,3 12,3M12,5C11.45,5 10.95,5.2 10.59,5.59C10.2,5.95 10,6.45 10,7V17C10,17.55 10.2,18.05 10.59,18.41C10.95,18.8 11.45,19 12,19C12.55,19 13.05,18.8 13.41,18.41C13.8,18.05 14,17.55 14,17V7C14,6.45 13.8,5.95 13.41,5.59C13.05,5.2 12.55,5 12,5Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="heritage-content">
                      <h4>Di sản văn hóa</h4>
                      <p>{dakLakData.overview.basic_info.cultural_heritage}</p>
                    </div>
                  </div>
                </div>
                
                <div className="overview-visual">
                  <div className="map-container">
                    <img src="/images/daklak_old/hinh_2.png" alt="Bản đồ hành chính Đắk Lắk" />
                    <div className="map-caption">Bản đồ hành chính tỉnh Đắk Lắk</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'geography' && (
            <div className="content-section geography-section">
              <div className="section-header">
                <h2>Vị trí địa lý</h2>
                <p>Đắk Lắk nằm ở vị trí chiến lược trong tam giác phát triển Việt Nam - Lào - Campuchia</p>
              </div>
              
              <div className="geography-content">
                <div className="borders-info">
                  <h3>Ranh giới hành chính</h3>
                  <div className="borders-grid">
                    <div className="border-item">
                      <div className="border-direction">Phía Bắc</div>
                      <div className="border-adjacent">Tỉnh Gia Lai</div>
                    </div>
                    <div className="border-item">
                      <div className="border-direction">Phía Nam</div>
                      <div className="border-adjacent">Tỉnh Lâm Đồng</div>
                    </div>
                    <div className="border-item">
                      <div className="border-direction">Phía Đông</div>
                      <div className="border-adjacent">Các tỉnh Phú Yên, Khánh Hòa</div>
                    </div>
                    <div className="border-item">
                      <div className="border-direction">Phía Tây</div>
                      <div className="border-adjacent">Tỉnh Mondulkiri (Campuchia)</div>
                      <div className="border-note">Có đường biên giới dài khoảng 73 km với cửa khẩu Bu Prăng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'nature' && (
            <div className="content-section nature-section">
              <div className="section-header">
                <h2>Điều kiện tự nhiên</h2>
                <p>Đắk Lắk có điều kiện tự nhiên thuận lợi cho phát triển nông nghiệp và du lịch</p>
              </div>
              
              <div className="nature-content">
                <div className="nature-grid">
                  <div className="nature-card">
                    <div className="nature-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Địa hình</h4>
                    <p>Chủ yếu là cao nguyên bazan với độ cao trung bình 400 - 800 m, có nhiều đồi núi thoải, xen kẽ các thung lũng và đồng bằng nhỏ.</p>
                    <p>Đây là vùng đất màu mỡ, thích hợp cho cây công nghiệp dài ngày như cà phê, cao su, hồ tiêu, điều, ca cao.</p>
                  </div>
                  
                  <div className="nature-card">
                    <div className="nature-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Khí hậu</h4>
                    <p><strong>Loại:</strong> Cận xích đạo với hai mùa rõ rệt</p>
                    <p><strong>Mùa mưa:</strong> Từ tháng 5 đến tháng 10</p>
                    <p><strong>Mùa khô:</strong> Từ tháng 11 đến tháng 4 năm sau</p>
                    <p><strong>Nhiệt độ:</strong> 23 - 25 °C (trung bình)</p>
                    <p><strong>Lượng mưa:</strong> 1.800 - 2.200 mm/năm</p>
                    <p>Khí hậu mát mẻ, ổn định, rất phù hợp cho phát triển nông nghiệp chất lượng cao.</p>
                  </div>
                  
                  <div className="nature-card">
                    <div className="nature-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25S18,10 18,14A6,6 0 0,1 12,20Z" fill="currentColor"/>
                        <path d="M2,19L4,21L6,19L8,21L10,19L12,21L14,19L16,21L18,19L20,21L22,19V17L20,19L18,17L16,19L14,17L12,19L10,17L8,19L6,17L4,19L2,17V19Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Sông ngòi</h4>
                    <p>Đắk Lắk có nhiều hệ thống sông lớn:</p>
                    <ul>
                      <li><strong>Sông Sêrêpốk</strong> - một nhánh của sông Mekong</li>
                      <li><strong>Sông Krông Ana</strong></li>
                      <li><strong>Sông Krông Nô</strong></li>
                    </ul>
                    <p><strong>Các hồ:</strong> Hồ Lắk, Hồ Ea Kao, Hồ Buôn Triết</p>
                    <p>Đóng vai trò quan trọng trong cấp nước, thủy điện, nông nghiệp và du lịch.</p>
                  </div>
                  
                  <div className="nature-card">
                    <div className="nature-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11,1L8,6H11V8L7,13H11V22H13V13H17L13,8V6H16L13,1H11M6,23V21H18V23H6Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Tài nguyên rừng</h4>
                    <p>Đắk Lắk có diện tích rừng lớn nhất vùng Tây Nguyên, chiếm hơn 50% diện tích đất tự nhiên.</p>
                    <p>Là nơi sinh sống của hệ sinh thái rừng nhiệt đới gió mùa, nhiều động thực vật quý hiếm.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'economy' && (
            <div className="content-section economy-section">
              <div className="section-header">
                <h2>Kinh tế</h2>
                <p>Đắk Lắk là một trong những trung tâm sản xuất nông sản hàng đầu cả nước</p>
              </div>
              
              <div className="economy-content">
                <div className="economy-grid">
                  <div className="economy-card">
                    <div className="economy-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A0.5,0.5 0 0,0 7,13.5A0.5,0.5 0 0,0 7.5,14A0.5,0.5 0 0,0 8,13.5A0.5,0.5 0 0,0 7.5,13M16.5,13A0.5,0.5 0 0,0 16,13.5A0.5,0.5 0 0,0 16.5,14A0.5,0.5 0 0,0 17,13.5A0.5,0.5 0 0,0 16.5,13Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Nông nghiệp</h4>
                    <div className="highlight-stat">Đứng đầu cả nước về diện tích và sản lượng cà phê (~210.000 ha)</div>
                    <div className="crops-list">
                      <span className="crop-item">Cà phê</span>
                      <span className="crop-item">Cao su</span>
                      <span className="crop-item">Hồ tiêu</span>
                      <span className="crop-item">Điều</span>
                      <span className="crop-item">Mía</span>
                      <span className="crop-item">Lúa gạo</span>
                      <span className="crop-item">Rau hoa công nghệ cao</span>
                    </div>
                  </div>
                  
                  <div className="economy-card">
                    <div className="economy-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17,11H22L21,8H18L17,11M4,18H12V20H4V18M4,14H12V16H4V14M4,10H12V12H4V10M4,6H12V8H4V6M15,13V9L12,2V6H2V22H14V13H15M16,14H23V22H16V14Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Công nghiệp</h4>
                    <p>Đang phát triển theo hướng:</p>
                    <ul>
                      <li>Chế biến nông sản</li>
                      <li>Năng lượng tái tạo (điện mặt trời, điện gió)</li>
                      <li>Công nghiệp chế biến gỗ</li>
                    </ul>
                  </div>
                  
                  <div className="economy-card">
                    <div className="economy-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Dịch vụ</h4>
                    <ul>
                      <li>Logistics</li>
                      <li>Thương mại biên mậu qua cửa khẩu Bu Prăng</li>
                      <li>Du lịch sinh thái - văn hóa</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'transport' && (
            <div className="content-section transport-section">
              <div className="section-header">
                <h2>Giao thông</h2>
                <p>Hệ thống giao thông kết nối Đắk Lắk với các vùng kinh tế trọng điểm</p>
              </div>
              
              <div className="transport-content">
                <div className="transport-grid">
                  <div className="transport-card">
                    <div className="transport-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Đường bộ</h4>
                    <div className="routes-list">
                      <div className="route-item">
                        <strong>Quốc lộ 14:</strong> Kết nối Tây Nguyên với Đông Nam Bộ
                      </div>
                      <div className="route-item">
                        <strong>Quốc lộ 26:</strong> Kết nối Buôn Ma Thuột với Khánh Hòa, cảng biển Nha Trang
                      </div>
                      <div className="route-item">
                        <strong>Quốc lộ 27:</strong> Kết nối với Lâm Đồng
                      </div>
                    </div>
                  </div>
                  
                  <div className="transport-card">
                    <div className="transport-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.56,3.91C21.15,4.5 21.15,5.45 20.56,6.03L16.67,9.92L18.79,19.11L17.38,20.53L13.5,13.1L9.6,17L9.96,19.47L8.89,20.53L7.13,17.35L3.94,15.58L5,14.5L7.5,14.87L11.37,11L3.94,7.09L5.36,5.68L14.55,7.8L18.44,3.91C19.03,3.33 19.97,3.33 20.56,3.91Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Đường hàng không</h4>
                    <p><strong>Sân bay Buôn Ma Thuột</strong> kết nối với:</p>
                    <div className="connections-list">
                      <span className="connection-item">Hà Nội</span>
                      <span className="connection-item">TP. Hồ Chí Minh</span>
                      <span className="connection-item">Đà Nẵng</span>
                      <span className="connection-item">Hải Phòng</span>
                      <span className="connection-item">Vinh</span>
                    </div>
                  </div>
                  
                  <div className="transport-card">
                    <div className="transport-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M17.9,17.39C17.64,16.58 16.9,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4>Đường biên giới</h4>
                    <p><strong>Cửa khẩu Bu Prăng</strong> (huyện Buôn Đôn)</p>
                    <p>Kết nối với Campuchia, có nhiều tiềm năng phát triển thương mại biên mậu</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'districts' && (
            <div className="content-section districts-section">
              <div className="section-header">
                <h2>Đơn vị hành chính</h2>
                <p>15 đơn vị hành chính cấp huyện với 180 đơn vị cấp xã</p>
              </div>
              
              <div className="districts-summary">
                <div className="summary-stats">
                  <div className="summary-item">
                    <span className="summary-number">1</span>
                    <span className="summary-label">Thành phố</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">1</span>
                    <span className="summary-label">Thị xã</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">13</span>
                    <span className="summary-label">Huyện</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">180</span>
                    <span className="summary-label">Xã/Phường/TT</span>
                  </div>
                </div>
              </div>
              
              <div className="districts-grid">
                {dakLakData.districts.map((district, index) => (
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

      {/* District Detail Modal */}
      {selectedDistrict && (
        <div className="district-modal-overlay" onClick={() => setSelectedDistrict(null)}>
          <div className="district-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDistrict.name}</h2>
              <button className="modal-close" onClick={() => setSelectedDistrict(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="district-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Loại hình</span>
                    <span className="info-value">{selectedDistrict.type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Diện tích</span>
                    <span className="info-value">{selectedDistrict.area}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dân số</span>
                    <span className="info-value">{selectedDistrict.population}</span>
                  </div>
                  {selectedDistrict.established && (
                    <div className="info-item">
                      <span className="info-label">Thành lập</span>
                      <span className="info-value">{selectedDistrict.established}</span>
                    </div>
                  )}
                </div>
                
                <div className="subdivisions-section">
                  <h4>Đơn vị hành chính cấp dưới</h4>
                  <div className="subdivisions-grid">
                    {selectedDistrict.subdivisions.wards && (
                      <div className="subdivision-type">
                        <h5>Phường ({selectedDistrict.subdivisions.wards.length})</h5>
                        <div className="subdivision-list">
                          {selectedDistrict.subdivisions.wards.map((ward, index) => (
                            <span key={index} className="subdivision-item">{ward}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedDistrict.subdivisions.townships && (
                      <div className="subdivision-type">
                        <h5>Thị trấn ({selectedDistrict.subdivisions.townships.length})</h5>
                        <div className="subdivision-list">
                          {selectedDistrict.subdivisions.townships.map((township, index) => (
                            <span key={index} className="subdivision-item">{township}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedDistrict.subdivisions.communes && (
                      <div className="subdivision-type">
                        <h5>Xã ({selectedDistrict.subdivisions.communes.length})</h5>
                        <div className="subdivision-list">
                          {selectedDistrict.subdivisions.communes.map((commune, index) => (
                            <span key={index} className="subdivision-item">{commune}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="district-map">
                <img src={selectedDistrict.map.image_url} alt={selectedDistrict.map.title} />
                <div className="map-caption">{selectedDistrict.map.title}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DakLakOldPage;
