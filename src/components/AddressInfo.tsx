import React from 'react';
import { LandmarkWithAddress } from '../services/enhancedGeminiService';

interface AddressInfoProps {
  result: LandmarkWithAddress;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ result }) => {
  const { addressDetails } = result;

  const getSourceBadge = () => {
    // Không hiển thị source badge nữa
    return null;
  };

  const getMappingInfo = () => {
    if (!addressDetails?.mappingInfo) return null;

    const mapping = addressDetails.mappingInfo;
    return (
      <div className="mapping-details">
        <h4>📋 Chi tiết sáp nhập</h4>
        <div className="mapping-grid">
          <div className="mapping-item">
            <strong>Loại sáp nhập:</strong>
            <span>{mapping.loai_sap_nhap}</span>
          </div>
          <div className="mapping-item">
            <strong>Diện tích:</strong>
            <span>{mapping.don_vi_moi.dien_tich_km2} km²</span>
          </div>
          <div className="mapping-item">
            <strong>Dân số:</strong>
            <span>{mapping.don_vi_moi.dan_so?.toLocaleString() || 'N/A'} người</span>
          </div>
          <div className="mapping-item">
            <strong>Số đơn vị cũ:</strong>
            <span>{mapping.cac_don_vi_cu.length} đơn vị</span>
          </div>
        </div>
        
        {mapping.cac_don_vi_cu.length > 1 && (
          <div className="old-units">
            <strong>Các đơn vị cũ:</strong>
            <ul>
              {mapping.cac_don_vi_cu.map((unit, index) => (
                <li key={index}>
                  {unit.loai} {unit.ten} ({unit.huyen_cu}, {unit.nguon_goc})
                </li>
              ))}
            </ul>
          </div>
        )}

        {mapping.ghi_chu && (
          <div className="mapping-note">
            <strong>Ghi chú:</strong> {mapping.ghi_chu}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="address-info">
      <div className="address-header">
        <h3>{result.name}</h3>
        {getSourceBadge()}
      </div>

      <div className="address-content">
        <div className="address-section">
          <h4>📍 Địa chỉ cũ</h4>
          <p className="address-old">{result.oldAddress}</p>
        </div>

        <div className="address-section">
          <h4>🏛️ Địa chỉ mới</h4>
          <p className="address-new">{result.newAddress}</p>
        </div>

        <div className="address-section">
          <h4>📖 Mô tả</h4>
          <p className="description">{result.description}</p>
        </div>

      </div>
    </div>
  );
};

export default AddressInfo;
