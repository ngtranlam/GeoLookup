import React, { useState, useEffect } from 'react';
import DistrictPopup from './DistrictPopup';

interface ProvinceDetailPageProps {
  provinceId: string;
  onBack: () => void;
}

const ProvinceDetailPage: React.FC<ProvinceDetailPageProps> = ({ provinceId, onBack }) => {
  const [provinceData, setProvinceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);

  useEffect(() => {
    loadProvinceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceId]);

  const loadProvinceData = async () => {
    setIsLoading(true);
    setError('');

    try {
      let filePath = '';
      
      if (provinceId === 'daklak-old') {
        filePath = '/source_content/Daklak_old/dak_lak_old.json';
      } else if (provinceId === 'phuyen-old') {
        filePath = '/source_content/bai_12_phu_yen.json';
      } else if (provinceId === 'daklak-new') {
        setError('Nội dung sẽ được cập nhật sớm');
        setIsLoading(false);
        return;
      }

      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu');
      }

      const data = await response.json();
      setProvinceData(data);
    } catch (err) {
      console.error('Error loading province data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="province-detail-page">
        <div className="province-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="province-detail-page">
        <div className="province-error">
          <h2>Lỗi</h2>
          <p>{error}</p>
          <button onClick={onBack} className="back-button">Quay lại</button>
        </div>
      </div>
    );
  }

  if (!provinceData) {
    return (
      <div className="province-detail-page">
        <div className="province-error">
          <h2>Không tìm thấy dữ liệu</h2>
          <button onClick={onBack} className="back-button">Quay lại</button>
        </div>
      </div>
    );
  }

  const getProvinceTitle = () => {
    if (provinceId === 'daklak-old') return 'Đắk Lắk - Trước sáp nhập';
    if (provinceId === 'phuyen-old') return 'Phú Yên - Trước sáp nhập';
    if (provinceId === 'daklak-new') return 'Đắk Lắk - Sau sáp nhập';
    return 'Tỉnh';
  };

  return (
    <div className="province-detail-page">
      <div className="province-header">
        <button onClick={onBack} className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12l7 7m-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Quay lại
        </button>
        <h1 className="province-title">{getProvinceTitle()}</h1>
      </div>

      <div className="province-content-wrapper">
        {/* Overview Section */}
        {provinceData.overview && (
          <div className="province-section">
            <h2 className="province-section-title">{provinceData.overview.title}</h2>
            <p className="province-description">{provinceData.overview.description}</p>
            
            <div className="province-stats-grid">
              {provinceData.overview.area_km2 && (
                <div className="province-stat-item">
                  <span className="stat-label">Diện tích</span>
                  <span className="stat-value">{provinceData.overview.area_km2.toLocaleString()} km²</span>
                </div>
              )}
              {provinceData.overview.population && (
                <div className="province-stat-item">
                  <span className="stat-label">Dân số</span>
                  <span className="stat-value">{provinceData.overview.population.toLocaleString()} người</span>
                </div>
              )}
              {provinceData.overview.year && (
                <div className="province-stat-item">
                  <span className="stat-label">Năm</span>
                  <span className="stat-value">{provinceData.overview.year}</span>
                </div>
              )}
            </div>

            {provinceData.overview.ethnic_groups && (
              <div className="province-info-box">
                <h4>Dân tộc</h4>
                <p>{provinceData.overview.ethnic_groups}</p>
              </div>
            )}

            {provinceData.overview.heritage && (
              <div className="province-info-box heritage">
                <h4>Di sản</h4>
                <p>{provinceData.overview.heritage}</p>
              </div>
            )}
          </div>
        )}

        {/* Geography Section */}
        {provinceData.geography && (
          <div className="province-section">
            <h2 className="province-section-title">Vị trí địa lý</h2>
            
            {provinceData.geography.location && (
              <div className="province-info-box">
                <h4>Giới hạn lãnh thổ</h4>
                <ul className="province-list">
                  <li><strong>Phía Bắc:</strong> {provinceData.geography.location.north}</li>
                  <li><strong>Phía Nam:</strong> {provinceData.geography.location.south}</li>
                  <li><strong>Phía Đông:</strong> {provinceData.geography.location.east}</li>
                  <li><strong>Phía Tây:</strong> {provinceData.geography.location.west}</li>
                </ul>
              </div>
            )}

            {provinceData.geography.terrain && (
              <div className="province-info-box">
                <h4>Địa hình</h4>
                <p><strong>Loại:</strong> {provinceData.geography.terrain.type}</p>
                <p><strong>Độ cao:</strong> {provinceData.geography.terrain.elevation}</p>
                <p>{provinceData.geography.terrain.description}</p>
              </div>
            )}

            {provinceData.geography.climate && (
              <div className="province-info-box">
                <h4>Khí hậu</h4>
                <p><strong>Loại:</strong> {provinceData.geography.climate.type}</p>
                <p><strong>Nhiệt độ:</strong> {provinceData.geography.climate.temperature}</p>
                <p><strong>Lượng mưa:</strong> {provinceData.geography.climate.rainfall}</p>
                <p><strong>Mùa mưa:</strong> {provinceData.geography.climate.rainy_season}</p>
                <p><strong>Mùa khô:</strong> {provinceData.geography.climate.dry_season}</p>
              </div>
            )}

            <div className="province-grid-2">
              {provinceData.geography.rivers && provinceData.geography.rivers.length > 0 && (
                <div className="province-info-box">
                  <h4>Sông ngòi chính</h4>
                  <ul className="province-list">
                    {provinceData.geography.rivers.map((river: string, index: number) => (
                      <li key={index}>{river}</li>
                    ))}
                  </ul>
                </div>
              )}

              {provinceData.geography.lakes && provinceData.geography.lakes.length > 0 && (
                <div className="province-info-box">
                  <h4>Hồ nổi bật</h4>
                  <ul className="province-list">
                    {provinceData.geography.lakes.map((lake: string, index: number) => (
                      <li key={index}>{lake}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {provinceData.geography.forest_coverage && (
              <div className="province-info-box">
                <h4>Độ che phủ rừng</h4>
                <p>{provinceData.geography.forest_coverage}</p>
              </div>
            )}
          </div>
        )}

        {/* Economy Section */}
        {provinceData.economy && (
          <div className="province-section">
            <h2 className="province-section-title">Kinh tế</h2>
            
            {provinceData.economy.agriculture && (
              <div className="province-info-box">
                <h4>Nông nghiệp</h4>
                {provinceData.economy.agriculture.specialty && (
                  <p className="specialty-text"><strong>{provinceData.economy.agriculture.specialty}</strong></p>
                )}
                {provinceData.economy.agriculture.main_crops && (
                  <>
                    <p><strong>Cây trồng chính:</strong></p>
                    <ul className="province-list">
                      {provinceData.economy.agriculture.main_crops.map((crop: string, index: number) => (
                        <li key={index}>{crop}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            <div className="province-grid-2">
              {provinceData.economy.industry && provinceData.economy.industry.length > 0 && (
                <div className="province-info-box">
                  <h4>Công nghiệp</h4>
                  <ul className="province-list">
                    {provinceData.economy.industry.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {provinceData.economy.services && provinceData.economy.services.length > 0 && (
                <div className="province-info-box">
                  <h4>Dịch vụ</h4>
                  <ul className="province-list">
                    {provinceData.economy.services.map((service: string, index: number) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transportation Section */}
        {provinceData.transportation && (
          <div className="province-section">
            <h2 className="province-section-title">Giao thông</h2>
            
            {provinceData.transportation.roads && provinceData.transportation.roads.length > 0 && (
              <div className="province-info-box">
                <h4>Đường bộ</h4>
                <ul className="province-list">
                  {provinceData.transportation.roads.map((road: any, index: number) => (
                    <li key={index}>
                      <strong>{road.name}:</strong> {road.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="province-grid-2">
              {provinceData.transportation.airport && (
                <div className="province-info-box">
                  <h4>Hàng không</h4>
                  <p><strong>{provinceData.transportation.airport.name}</strong></p>
                  {provinceData.transportation.airport.routes && (
                    <>
                      <p>Các tuyến bay:</p>
                      <ul className="province-list">
                        {provinceData.transportation.airport.routes.map((route: string, index: number) => (
                          <li key={index}>{route}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {provinceData.transportation.border_gate && (
                <div className="province-info-box">
                  <h4>Cửa khẩu</h4>
                  <p><strong>{provinceData.transportation.border_gate.name}</strong></p>
                  <p>Vị trí: {provinceData.transportation.border_gate.location}</p>
                  <p>Kết nối: {provinceData.transportation.border_gate.connects_to}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images Section */}
        {provinceData.images && (
          <div className="province-section">
            <h2 className="province-section-title">Hình ảnh</h2>
            <div className="province-images-grid">
              {provinceData.images.overview_map && (
                <div className="province-image-item">
                  <h3>Bản đồ tổng quan</h3>
                  <img 
                    src={`/source_content/Daklak_old/${provinceData.images.overview_map.replace('images/dak_lak/', 'images/')}`} 
                    alt="Bản đồ tổng quan"
                  />
                </div>
              )}
              {provinceData.images.administrative_map && (
                <div className="province-image-item">
                  <h3>Bản đồ hành chính</h3>
                  <img 
                    src={`/source_content/Daklak_old/${provinceData.images.administrative_map.replace('images/dak_lak/', 'images/')}`} 
                    alt="Bản đồ hành chính"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Districts Section */}
        {provinceData.districts && Array.isArray(provinceData.districts) && (
          <div className="province-section">
            <h2 className="province-section-title">Đơn vị hành chính cấp huyện ({provinceData.districts.length})</h2>
            <div className="districts-grid">
              {provinceData.districts.map((district: any, index: number) => (
                <div 
                  key={index} 
                  className="district-card"
                  onClick={() => setSelectedDistrict(district)}
                >
                  {district.image && (
                    <div className="district-image">
                      <img 
                        src={`/source_content/Daklak_old/${district.image.replace('images/dak_lak/', 'images/')}`} 
                        alt={district.name}
                      />
                    </div>
                  )}
                  <div className="district-content">
                    <h3>{district.name}</h3>
                    <span className="district-type">{district.type}</span>
                    
                    <div className="district-info">
                      {district.established && (
                        <p><strong>Thành lập:</strong> {district.established}</p>
                      )}
                      {district.area_km2 && (
                        <p><strong>Diện tích:</strong> {district.area_km2.toLocaleString()} km²</p>
                      )}
                      {district.population && (
                        <p><strong>Dân số:</strong> {district.population.toLocaleString()} người</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* District Popup */}
      {selectedDistrict && (
        <DistrictPopup 
          district={selectedDistrict}
          onClose={() => setSelectedDistrict(null)}
        />
      )}
    </div>
  );
};

export default ProvinceDetailPage;
