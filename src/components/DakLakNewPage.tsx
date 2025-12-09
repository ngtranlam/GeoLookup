import React, { useState, useEffect } from 'react';
import '../components/PhuYenOldPageEnhancements.css';

interface AdministrativeUnit {
  stt: number;
  units_merged: string;
  new_unit_name: string;
  area_km2: string;
  population: string;
}

const DakLakNewPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [adminUnitsData, setAdminUnitsData] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<AdministrativeUnit | null>(null);

  useEffect(() => {
    // Load administrative units data from JSON
    fetch('/source_content/daklak_moi_2025.json')
      .then(res => res.json())
      .then(data => {
        const section = data.document.sections.find((s: any) => s.section_number === '2');
        if (section && section.table && section.table.data) {
          setAdminUnitsData(section.table.data);
        }
      })
      .catch(err => console.error('Error loading data:', err));
  }, []);

  return (
    <div className="daklak-new-page">
      {/* Hero Section */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          backgroundImage: 'url(/source_content/daklak_map.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25
        }} />
        
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center', 
          padding: '2rem',
          maxWidth: '1200px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #fff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Tỉnh Đắk Lắk Mới
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '0.5rem'
          }}>
            Sau khi hợp nhất với tỉnh Phú Yên
          </p>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '2rem'
          }}>
            Nghị quyết số 1660/NQ-UBTVQH15 - Hiệu lực từ 01/07/2025
          </p>

          {/* Stats Cards */}
          <div className="hero-stats-grid">
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>18.096,4 km²</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>Diện tích</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>3.346.853</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>Dân số</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>102</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>Đơn vị hành chính cấp xã</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>Buôn Ma Thuột</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>Thủ phủ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: '70px',
        background: 'rgba(30, 60, 114, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 0',
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '0 1rem'
        }}>
          {[
            { 
              id: 'overview', 
              label: 'Tổng quan', 
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s ease' }}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V9h10v2zm0-4H7V5h10v2z" fill="currentColor"/>
              </svg>
            },
            { 
              id: 'merger', 
              label: 'Quá trình sáp nhập', 
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s ease' }}>
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/>
              </svg>
            },
            { 
              id: 'geography', 
              label: 'Vị trí địa lý', 
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s ease' }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
              </svg>
            },
            { 
              id: 'units', 
              label: 'Đơn vị hành chính', 
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s ease' }}>
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" fill="currentColor"/>
              </svg>
            },
            { 
              id: 'infographics', 
              label: 'Infographics', 
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s ease' }}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
              </svg>
            }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeSection === section.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem',
                fontWeight: activeSection === section.id ? '600' : '400',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                const svg = e.currentTarget.querySelector('svg');
                if (svg) (svg as SVGSVGElement).style.transform = 'scale(1.1) rotate(5deg)';
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.background = 'transparent';
                }
                e.currentTarget.style.transform = 'translateY(0)';
                const svg = e.currentTarget.querySelector('svg');
                if (svg) (svg as SVGSVGElement).style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: '#1e3c72'
            }}>
              Tổng quan
            </h2>
            
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.8', 
                color: '#333',
                marginBottom: '1.5rem'
              }}>
                Thực hiện Nghị quyết số 1660/NQ-UBTVQH15 ngày 16/6/2025 của Ủy ban Thường vụ Quốc hội, 
                tỉnh Đắk Lắk chính thức được hợp nhất với tỉnh Phú Yên thành một đơn vị hành chính mới 
                mang tên tỉnh Đắk Lắk. Trung tâm hành chính – chính trị được đặt tại thành phố Buôn Ma Thuột, 
                thủ phủ cũ của tỉnh Đắk Lắk.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  color: '#fff'
                }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Diện tích</h3>
                  <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>18.096,4 km²</p>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' }}>
                    Gấp 2,26 lần tiêu chuẩn tối thiểu
                  </p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  color: '#fff'
                }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Dân số</h3>
                  <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>3.346.853 người</p>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' }}>
                    Nhóm tỉnh lớn nhất khu vực
                  </p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  color: '#fff'
                }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Cấu trúc dân tộc</h3>
                  <p style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
                    Ê-đê, M'nông, Gia Rai, Tày, Nùng (cao nguyên)
                  </p>
                  <p style={{ fontSize: '1rem', marginTop: '0.3rem' }}>
                    Người Kinh (đồng bằng ven biển)
                  </p>
                </div>
              </div>

              {/* Administrative Map */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: '#1e3c72'
                }}>
                  Bản đồ đơn vị hành chính Tỉnh Đắk Lắk
                </h3>
                <div style={{
                  width: '100%',
                  maxWidth: '800px',
                  margin: '0 auto',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <img 
                    src="/images/daklak_moi_2025/hinh_1.png" 
                    alt="Bản đồ hành chính Đắk Lắk mới"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Merger Process Section */}
        {activeSection === 'merger' && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: '#1e3c72'
            }}>
              Quá trình sáp nhập và tổ chức lại hành chính
            </h2>

            <div style={{
              background: 'rgba(255,255,255,0.9)',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '1.5rem',
                borderRadius: '10px',
                color: '#fff',
                marginBottom: '2rem'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                  Sắp xếp đơn vị hành chính cấp xã
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>180</div>
                    <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Trước sáp nhập</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.3rem' }}>
                      (Tỉnh Đắk Lắk cũ)
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontSize: '2rem'
                  }}>
                    →
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>102</div>
                    <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Sau sáp nhập</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.3rem' }}>
                      88 xã + 14 phường
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
              }}>
                <div style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  border: '2px solid rgba(102, 126, 234, 0.3)'
                }}>
                  <h4 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: '#667eea'
                  }}>
                    Đơn vị mới hình thành
                  </h4>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' }}>
                    96
                  </div>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>
                    82 xã + 14 phường được hình thành mới thông qua sáp nhập, điều chỉnh địa giới, 
                    đổi tên hoặc nâng cấp
                  </p>
                </div>

                <div style={{
                  background: 'rgba(245, 87, 108, 0.1)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  border: '2px solid rgba(245, 87, 108, 0.3)'
                }}>
                  <h4 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: '#f5576c'
                  }}>
                    Đơn vị giữ nguyên
                  </h4>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f5576c', marginBottom: '0.5rem' }}>
                    6
                  </div>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>
                    6 xã giữ nguyên do đặc điểm dân cư rải rác, vùng sâu – vùng xa, 
                    đảm bảo phù hợp thực tiễn quản lý địa phương
                  </p>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 193, 7, 0.1)',
                padding: '1.5rem',
                borderRadius: '10px',
                marginTop: '2rem',
                border: '2px solid rgba(255, 193, 7, 0.3)'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: '#f57c00'
                }}>
                  Ý nghĩa
                </h4>
                <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8' }}>
                  Một trong những cuộc sắp xếp cấp xã quy mô lớn nhất cả nước năm 2025
                </p>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: '#1e3c72'
                }}>
                  Nguyên tắc thiết kế
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {[
                    'Bảo đảm quy mô dân số hợp lý (trên 10.000 dân/xã đối với nông thôn, trên 15.000 dân/phường đối với đô thị)',
                    'Không gian địa lý kết nối tốt',
                    'Tính kế thừa văn hóa – lịch sử – tên gọi quen thuộc với người dân'
                  ].map((principle, idx) => (
                    <li key={idx} style={{
                      padding: '1rem',
                      background: 'rgba(30, 60, 114, 0.05)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #1e3c72',
                      fontSize: '1rem',
                      color: '#555'
                    }}>
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Geography Section */}
        {activeSection === 'geography' && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: '#1e3c72'
            }}>
              Vị trí địa lý của tỉnh Đắk Lắk sau khi sáp nhập
            </h2>

            <div style={{
              background: 'rgba(255,255,255,0.9)',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.8', 
                color: '#333',
                marginBottom: '2rem',
                fontStyle: 'italic',
                background: 'rgba(102, 126, 234, 0.1)',
                padding: '1.5rem',
                borderRadius: '10px',
                borderLeft: '4px solid #667eea'
              }}>
                Tỉnh Đắk Lắk mới sở hữu vị trí địa lý mang tính kết nối liên vùng chiến lược, 
                trải dài từ Tây Nguyên đến Duyên hải Nam Trung Bộ, kết hợp các hệ sinh thái 
                tự nhiên đa dạng: rừng – núi – cao nguyên – đồng bằng – biển.
              </p>

              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: '#1e3c72'
              }}>
                Giáp ranh
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {[
                  { direction: 'Phía Đông', adjacent: 'Biển Đông', color: '#4facfe' },
                  { direction: 'Phía Tây', adjacent: 'Campuchia', color: '#f093fb' },
                  { direction: 'Phía Bắc', adjacent: 'Tỉnh Gia Lai', color: '#667eea' },
                  { direction: 'Phía Nam', adjacent: 'Các tỉnh Lâm Đồng và Khánh Hòa', color: '#f5576c' }
                ].map((border, idx) => (
                  <div key={idx} style={{
                    background: `linear-gradient(135deg, ${border.color}15 0%, ${border.color}30 100%)`,
                    padding: '1.5rem',
                    borderRadius: '10px',
                    border: `2px solid ${border.color}50`,
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '600', 
                      color: border.color,
                      marginBottom: '0.5rem'
                    }}>
                      {border.direction}
                    </div>
                    <div style={{ fontSize: '1rem', color: '#555' }}>
                      {border.adjacent}
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: '#1e3c72'
              }}>
                Lợi thế chiến lược
              </h3>

              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                {[
                  { 
                    title: 'Hạ tầng giao thông', 
                    desc: 'Xây dựng hệ thống giao thông liên vùng', 
                    icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#667eea"/>
                    </svg>
                  },
                  { 
                    title: 'Logistics', 
                    desc: 'Phát triển chuỗi logistics cao nguyên – cảng biển', 
                    icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" fill="#667eea"/>
                    </svg>
                  },
                  { 
                    title: 'Khu kinh tế', 
                    desc: 'Phát triển các khu kinh tế, đô thị vùng trung tâm – ven biển', 
                    icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" fill="#667eea"/>
                    </svg>
                  },
                  { 
                    title: 'Công nghiệp', 
                    desc: 'Khu công nghiệp – nông nghiệp công nghệ cao', 
                    icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 21H2v-2h20v2zM10 10l-1.41 1.41L11.17 14H2v2h9.17l-2.58 2.59L10 20l5-5-5-5zm9-5h-3V2h-2v3h-3l4 4 4-4z" fill="#667eea"/>
                    </svg>
                  },
                  { 
                    title: 'Du lịch', 
                    desc: 'Du lịch sinh thái, du lịch văn hóa', 
                    icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z" fill="#667eea"/>
                    </svg>
                  }
                ].map((advantage, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '10px',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                    const svg = e.currentTarget.querySelector('svg');
                    if (svg) (svg as SVGSVGElement).style.transform = 'scale(1.1) rotate(5deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.boxShadow = 'none';
                    const svg = e.currentTarget.querySelector('svg');
                    if (svg) (svg as SVGSVGElement).style.transform = 'scale(1) rotate(0deg)';
                  }}
                  >
                    <div style={{ 
                      minWidth: '48px',
                      transition: 'transform 0.3s ease'
                    }}>
                      {advantage.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        color: '#1e3c72',
                        marginBottom: '0.3rem'
                      }}>
                        {advantage.title}
                      </h4>
                      <p style={{ fontSize: '0.95rem', color: '#666', margin: 0 }}>
                        {advantage.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                color: '#fff'
              }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Tầm nhìn tương lai</h4>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', opacity: 0.95 }}>
                  Được kỳ vọng sẽ tạo nên một cực tăng trưởng mới, góp phần tái định hình lại 
                  trục phát triển chiến lược của khu vực miền Trung – Tây Nguyên trong những năm tới
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Administrative Units Section */}
        {activeSection === 'units' && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: '#1e3c72'
            }}>
              Danh sách đơn vị hành chính cấp xã, phường
            </h2>

            <div style={{
              background: 'rgba(255,255,255,0.9)',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: '1.8', 
                color: '#333',
                marginBottom: '2rem'
              }}>
                Việc sáp nhập tỉnh Phú Yên vào Đắk Lắk và sắp xếp toàn diện hệ thống đơn vị hành chính 
                cấp xã đã tạo ra một cơ cấu tổ chức chính quyền cơ sở hoàn toàn mới cho tỉnh Đắk Lắk 
                từ ngày 1/7/2025. Toàn tỉnh đã tinh gọn bộ máy từ <strong>180 xuống còn 102</strong> đơn vị hành chính 
                cấp xã, trong đó gồm <strong>88 xã</strong> và <strong>14 phường</strong>.
              </p>

              <div style={{
                overflowX: 'auto',
                marginTop: '1.5rem',
                maxHeight: '600px',
                overflowY: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem'
                }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                      <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', minWidth: '60px' }}>STT</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.2)', minWidth: '300px' }}>Đơn vị hành chính sáp nhập</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.2)', minWidth: '180px' }}>Tên đơn vị mới</th>
                      <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid rgba(255,255,255,0.2)', minWidth: '120px' }}>Diện tích (km²)</th>
                      <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid rgba(255,255,255,0.2)', minWidth: '120px' }}>Dân số</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUnitsData.map((row, idx) => (
                      <tr key={idx} style={{
                        background: idx % 2 === 0 ? 'rgba(102, 126, 234, 0.05)' : '#fff',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(102, 126, 234, 0.05)' : '#fff'}
                      >
                        <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #e0e0e0', color: '#333', fontWeight: '500' }}>{row.stt}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e0e0e0', fontSize: '0.85rem', color: '#333', lineHeight: '1.6' }}>{row.units_merged}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e0e0e0', fontWeight: '600', color: '#1e3c72' }}>{row.new_unit_name}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #e0e0e0', color: '#333' }}>{row.area_km2}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #e0e0e0', color: '#333' }}>{row.population}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#1e3c72',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>
                Tổng cộng: {adminUnitsData.length} đơn vị hành chính cấp xã (88 xã + 14 phường)
              </div>
            </div>
          </section>
        )}

        {/* Infographics Section */}
        {activeSection === 'infographics' && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: '#1e3c72'
            }}>
              Infographics
            </h2>

            <div style={{
              background: 'rgba(255,255,255,0.9)',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                color: '#1e3c72',
                textAlign: 'center'
              }}>
                TỈNH ĐẮK LẮK (MỚI) SAU HỢP NHẤT TỈNH ĐẮK LẮK VÀ TỈNH PHÚ YÊN
              </h3>
              
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: '1.8', 
                color: '#555',
                marginBottom: '2rem',
                textAlign: 'center',
                maxWidth: '900px',
                margin: '0 auto 2rem'
              }}>
                Thực hiện chủ trương của Đảng, Nhà nước về sắp xếp đơn vị hành chính, tỉnh Đắk Lắk 
                và tỉnh Phú Yên sáp nhập thành tỉnh Đắk Lắk (mới). Việc sáp nhập này không chỉ tạo 
                không gian cho chiến lược phát triển mà còn là cơ hội, sứ mệnh lịch sử cho tỉnh Đắk Lắk 
                sau khi hợp nhất thành trung tâm kinh tế, văn hóa, đổi mới sáng tạo và được kỳ vọng sẽ 
                là một cực tăng trưởng mới của khu vực Nam Trung bộ và Tây Nguyên.
              </p>

              <div style={{
                display: 'grid',
                gap: '2rem'
              }}>
                {[
                  { num: 2, title: 'Infographic tổng quan tỉnh Đắk Lắk mới - Phần 1', url: '/images/daklak_moi_2025/hinh_2.png' },
                  { num: 3, title: 'Infographic tổng quan tỉnh Đắk Lắk mới - Phần 2', url: '/images/daklak_moi_2025/hinh_3.png' },
                  { num: 4, title: 'Infographic tổng quan tỉnh Đắk Lắk mới - Phần 3', url: '/images/daklak_moi_2025/hinh_4.png' }
                ].map((info, idx) => (
                  <div key={idx} style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}>
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff'
                    }}>
                      <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{info.title}</h4>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <img 
                        src={info.url}
                        alt={info.title}
                        style={{ 
                          width: '100%', 
                          height: 'auto', 
                          display: 'block',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DakLakNewPage;
