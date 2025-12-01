interface AddressMapping {
  stt: number;
  don_vi_moi: {
    ten: string;
    loai: string;
    dien_tich_km2: number;
    dan_so: number;
  };
  cac_don_vi_cu: Array<{
    ten: string;
    loai: string;
    nguon_goc: string;
    huyen_cu: string;
  }>;
  loai_sap_nhap: string;
  ghi_chu?: string;
}

interface AddressMappingData {
  tieu_de: string;
  tong_quan: {
    nghi_quyet: string;
    noi_dung: string;
    ngay_hieu_luc: string;
    ten_tinh_moi: string;
    trung_tam_hanh_chinh: string;
  };
  thong_ke_tong_hop: any;
  danh_sach_chuyen_doi_day_du: AddressMapping[];
}

interface LandmarkWithAddress {
  name: string;
  oldAddress: string;
  newAddress: string;
  description: string;
  image?: string;
  geminiAddress?: string; // Address returned by Gemini
  addressDetails?: {
    isUpdated: boolean;
    mappingInfo?: AddressMapping;
    source: 'gemini' | 'local' | 'hybrid';
  };
}

class AddressMappingService {
  private mappingData: AddressMappingData | null = null;

  // Load dữ liệu mapping từ file JSON
  async loadMappingData(): Promise<void> {
    try {
      const response = await fetch('/source_content/tong_hop_chuyen_doi_dia_chi_day_du.json');
      if (!response.ok) {
        throw new Error('Failed to load mapping data');
      }
      this.mappingData = await response.json();
      console.log('✅ Loaded address mapping data successfully');
    } catch (error) {
      console.error('❌ Error loading mapping data:', error);
    }
  }

  // Tìm kiếm địa chỉ mới dựa trên tên địa danh
  findNewAddress(landmarkName: string): AddressMapping | null {
    if (!this.mappingData) {
      console.warn('Mapping data not loaded');
      return null;
    }

    const normalizedLandmarkName = this.normalizeText(landmarkName);
    
    // Tìm kiếm trong danh sách đơn vị mới
    for (const mapping of this.mappingData.danh_sach_chuyen_doi_day_du) {
      const normalizedNewName = this.normalizeText(mapping.don_vi_moi.ten);
      
      // Kiểm tra tên đơn vị mới
      if (normalizedNewName.includes(normalizedLandmarkName) || 
          normalizedLandmarkName.includes(normalizedNewName)) {
        return mapping;
      }

      // Kiểm tra trong các đơn vị cũ
      for (const oldUnit of mapping.cac_don_vi_cu) {
        const normalizedOldName = this.normalizeText(oldUnit.ten);
        if (normalizedOldName.includes(normalizedLandmarkName) || 
            normalizedLandmarkName.includes(normalizedOldName)) {
          return mapping;
        }
      }
    }

    return null;
  }

  // Tìm kiếm địa chỉ dựa trên từ khóa địa danh nổi tiếng
  findAddressByLandmark(landmarkName: string): AddressMapping | null {
    if (!this.mappingData) return null;

    const keywords = this.extractLocationKeywords(landmarkName);
    
    for (const keyword of keywords) {
      const result = this.findNewAddress(keyword);
      if (result) return result;
    }

    return null;
  }

  // Tìm kiếm dựa trên địa chỉ từ Gemini
  findByGeminiAddress(geminiAddress: string): AddressMapping | null {
    if (!this.mappingData || !geminiAddress) return null;

    console.log(`🔍 Searching for address: ${geminiAddress}`);
    
    // Chuẩn hóa địa chỉ từ Gemini
    const normalizedAddress = this.normalizeText(geminiAddress);
    
    // Tìm kiếm trong tất cả các đơn vị
    for (const mapping of this.mappingData.danh_sach_chuyen_doi_day_du) {
      // Kiểm tra đơn vị mới
      const newUnitName = this.normalizeText(mapping.don_vi_moi.ten);
      if (this.isAddressMatch(normalizedAddress, newUnitName)) {
        console.log(`✅ Found match in new unit: ${mapping.don_vi_moi.ten}`);
        return mapping;
      }

      // Kiểm tra các đơn vị cũ
      for (const oldUnit of mapping.cac_don_vi_cu) {
        const oldUnitName = this.normalizeText(oldUnit.ten);
        const oldUnitArea = this.normalizeText(oldUnit.huyen_cu);
        
        if (this.isAddressMatch(normalizedAddress, oldUnitName) || 
            this.isAddressMatch(normalizedAddress, oldUnitArea)) {
          console.log(`✅ Found match in old unit: ${oldUnit.ten} (${oldUnit.huyen_cu})`);
          return mapping;
        }
      }
    }

    console.log(`❌ No match found for: ${geminiAddress}`);
    return null;
  }

  // Kiểm tra xem địa chỉ có khớp không
  private isAddressMatch(normalizedAddress: string, unitName: string): boolean {
    // Kiểm tra chứa tên đơn vị
    if (normalizedAddress.includes(unitName) || unitName.includes(normalizedAddress)) {
      return true;
    }

    // Kiểm tra các từ khóa quan trọng
    const addressWords = normalizedAddress.split(' ').filter(word => word.length > 2);
    const unitWords = unitName.split(' ').filter(word => word.length > 2);
    
    // Nếu có ít nhất 1 từ khớp và từ đó dài hơn 3 ký tự
    for (const addressWord of addressWords) {
      for (const unitWord of unitWords) {
        if (addressWord.length > 3 && unitWord.length > 3) {
          if (addressWord.includes(unitWord) || unitWord.includes(addressWord)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // Trích xuất từ khóa địa điểm từ tên địa danh
  private extractLocationKeywords(landmarkName: string): string[] {
    const keywords: string[] = [];
    const normalizedName = this.normalizeText(landmarkName);

    // Danh sách các từ khóa địa điểm phổ biến
    const locationPatterns = [
      // Thành phố, thị xã, huyện
      /(?:thành phố|tp\.?|thị xã|huyện|tx\.?)\s*([^,\s]+)/gi,
      // Phường, xã, thị trấn
      /(?:phường|xã|thị trấn|tt\.?)\s*([^,\s]+)/gi,
      // Tên riêng địa danh
      /(?:buôn ma thuột|buôn hồ|ea súp|ea kar|krông năng|cư m'gar)/gi,
      // Tên địa danh nổi tiếng
      /(?:nhà đày|bảo tàng|hồ lắk|đá voi|buôn đôn|thác dray)/gi
    ];

    for (const pattern of locationPatterns) {
      const matches = normalizedName.match(pattern);
      if (matches) {
        keywords.push(...matches);
      }
    }

    // Thêm tên gốc
    keywords.push(landmarkName);

    return Array.from(new Set(keywords)); // Remove duplicates
  }

  // Chuẩn hóa text để so sánh
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s]/g, ' ') // Replace special chars with space
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  // Tạo địa chỉ đầy đủ từ mapping data
  generateFullAddress(mapping: AddressMapping): { oldAddress: string; newAddress: string } {
    // Tạo địa chỉ mới đẹp và rõ ràng
    const tinhMoi = this.mappingData?.tong_quan.ten_tinh_moi || 'Đắk Lắk';
    const newAddress = `${mapping.don_vi_moi.loai} ${mapping.don_vi_moi.ten}, tỉnh ${tinhMoi}`;
    
    // Tạo địa chỉ cũ từ các đơn vị cũ
    const oldAddresses = mapping.cac_don_vi_cu.map(unit => 
      `${unit.loai} ${unit.ten}, ${unit.huyen_cu}, tỉnh ${unit.nguon_goc}`
    );
    
    const oldAddress = oldAddresses.length > 1 
      ? `Bao gồm: ${oldAddresses.join('; ')}`
      : oldAddresses[0] || 'Không có thông tin';

    return { oldAddress, newAddress };
  }

  // Tạo địa chỉ mới ngắn gọn và đẹp
  generateNewAddressOnly(mapping: AddressMapping): string {
    const tinhMoi = this.mappingData?.tong_quan.ten_tinh_moi || 'Đắk Lắk';
    // Kiểm tra xem tên tỉnh đã có "tỉnh" chưa
    const tinhPrefix = tinhMoi.toLowerCase().includes('tỉnh') ? '' : 'tỉnh ';
    return `${mapping.don_vi_moi.loai} ${mapping.don_vi_moi.ten}, ${tinhPrefix}${tinhMoi}`;
  }

  // Xử lý địa chỉ thông minh - giữ thông tin chi tiết, chỉ cập nhật từ cấp xã/phường trở lên
  generateSmartNewAddress(geminiAddress: string, mapping: AddressMapping): string {
    if (!geminiAddress) {
      return this.generateNewAddressOnly(mapping);
    }

    // Extract thông tin chi tiết (số nhà, tên đường, quảng trường...) trước cấp xã/phường
    const detailedInfo = this.extractDetailedInfo(geminiAddress);
    
    // Tạo phần đơn vị hành chính mới (từ cấp xã/phường trở lên)
    const newAdminUnit = `${mapping.don_vi_moi.loai} ${mapping.don_vi_moi.ten}`;
    const tinhMoi = this.mappingData?.tong_quan.ten_tinh_moi || 'Đắk Lắk';
    
    // Kiểm tra xem tên tỉnh đã có "tỉnh" chưa
    const tinhPrefix = tinhMoi.toLowerCase().includes('tỉnh') ? '' : 'tỉnh ';
    const fullProvince = `${tinhPrefix}${tinhMoi}`;
    
    // Kết hợp thông tin chi tiết với đơn vị hành chính mới
    if (detailedInfo && detailedInfo.length > 0) {
      return `${detailedInfo}, ${newAdminUnit}, ${fullProvince}`;
    } else {
      return `${newAdminUnit}, ${fullProvince}`;
    }
  }

  // Kiểm tra xem có phải là thông tin đường/số nhà không
  private isStreetAddress(text: string): boolean {
    const streetPatterns = [
      /^\d+/,  // Bắt đầu bằng số (số nhà)
      /đường|phố|ngõ|hẻm|quốc lộ|ql|tỉnh lộ|tl/i,  // Chứa từ khóa đường
      /số \d+/i  // "Số ..."
    ];
    
    return streetPatterns.some(pattern => pattern.test(text));
  }

  // Kiểm tra xem địa danh có thuộc Đắk Lắk hoặc Phú Yên không
  isInTargetProvinces(address: string): boolean {
    if (!address) {
      console.log('🔍 isInTargetProvinces: Empty address provided');
      return false;
    }
    
    const normalizedAddress = this.normalizeText(address);
    console.log(`🔍 isInTargetProvinces: Checking "${address}" → normalized: "${normalizedAddress}"`);
    
    // Danh sách các từ khóa cho Đắk Lắk và Phú Yên
    const dakLakKeywords = [
      'dak lak', 'daklak', 'đắk lắk', 'dac lac', 'dac lak',
      'buon ma thuot', 'buôn ma thuột', 'buon ma thuot', 'ban me thuot',
      'buon don', 'buôn đôn', 'buon don', 'krong pak', 'krong buk', 'krong no',
      'krong ana', 'krong bong', 'lak', 'cu m gar', 'cư m gar', 'cu mgar',
      'ea h leo', 'ea hleo', 'ea sup', 'ea kar', 'm drak', 'mdrak',
      'ea tam', 'tan lap', 'tân lập', 'ea tam', 'hoa phu', 'hòa phú'
    ];
    
    const phuYenKeywords = [
      'phu yen', 'phú yên', 'phu yen', 'tuy hoa', 'tuy hòa', 'tuy hoa',
      'dong hoa', 'đông hòa', 'dong hoa', 'tuy an', 'tuy an', 'tuy an',
      'son hoa', 'sơn hòa', 'son hoa', 'song cau', 'sông cầu', 'song cau',
      'phu hoa', 'phú hòa', 'phu hoa', 'song hinh', 'sông hinh', 'song hinh'
    ];
    
    const allKeywords = [...dakLakKeywords, ...phuYenKeywords];
    
    // Kiểm tra xem có chứa từ khóa nào không
    const matchedKeyword = allKeywords.find(keyword => normalizedAddress.includes(keyword));
    const isMatch = !!matchedKeyword;
    
    console.log(`🔍 isInTargetProvinces: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'} ${matchedKeyword ? `(matched: "${matchedKeyword}")` : ''}`);
    
    return isMatch;
  }

  // Extract thông tin chi tiết (số nhà, tên đường, quảng trường...) trước cấp xã/phường
  extractDetailedInfo(fullAddress: string): string {
    if (!fullAddress) return '';

    const parts = fullAddress.split(',').map(part => part.trim());
    const detailedParts: string[] = [];

    for (const part of parts) {
      // Kiểm tra xem có phải là cấp xã/phường không (dừng tại đây)
      if (/^(xã|phường|thị trấn|thị xã|thành phố)\s/i.test(part)) {
        break;
      }

      // Kiểm tra xem có phải là số nhà không
      if (/^số\s*\d+/i.test(part) || /^\d+/.test(part)) {
        detailedParts.push(part);
        continue;
      }

      // Kiểm tra xem có phải là tên đường, quảng trường, công viên... không
      if (/đường|phố|ngõ|hẻm|quốc lộ|ql|tỉnh lộ|tl|quảng trường|công viên|khu vực|khu phố/i.test(part)) {
        detailedParts.push(part);
        continue;
      }

      // Nếu đã có thông tin chi tiết rồi thì dừng khi gặp đơn vị hành chính
      if (detailedParts.length > 0 && /^(huyện|quận|thành phố|tỉnh)\s/i.test(part)) {
        break;
      }
    }

    return detailedParts.join(', ');
  }

  // Loại bỏ từ lặp trong địa chỉ
  removeDuplicateWords(address: string): string {
    // Tách thành các phần bằng dấu phẩy
    const parts = address.split(',').map(part => part.trim()).filter(part => part.length > 0);
    const cleanedParts: string[] = [];
    
    for (const part of parts) {
      // Xử lý từ lặp trong mỗi phần
      const cleanedPart = this.removeWordDuplicatesInPart(part);
      
      // Kiểm tra xem phần này đã xuất hiện chưa
      const normalizedPart = this.normalizeText(cleanedPart);
      let isDuplicate = false;
      
      for (const existingPart of cleanedParts) {
        const normalizedExisting = this.normalizeText(existingPart);
        if (normalizedPart === normalizedExisting || 
            normalizedPart.includes(normalizedExisting) || 
            normalizedExisting.includes(normalizedPart)) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate && cleanedPart.length > 0) {
        cleanedParts.push(cleanedPart);
      }
    }
    
    return cleanedParts.join(', ');
  }

  // Xử lý từ lặp trong một phần địa chỉ
  private removeWordDuplicatesInPart(part: string): string {
    const words = part.split(/\s+/).filter(word => word.length > 0);
    const uniqueWords: string[] = [];
    const seenWords = new Set<string>();
    
    for (const word of words) {
      const normalizedWord = this.normalizeText(word);
      
      // Kiểm tra từ lặp liền kề (như "Xã Xã")
      if (uniqueWords.length > 0) {
        const lastWord = this.normalizeText(uniqueWords[uniqueWords.length - 1]);
        if (normalizedWord === lastWord) {
          continue; // Bỏ qua từ lặp liền kề
        }
      }
      
      // Kiểm tra từ lặp trong toàn bộ phần
      if (!seenWords.has(normalizedWord)) {
        seenWords.add(normalizedWord);
        uniqueWords.push(word);
      }
    }
    
    return uniqueWords.join(' ');
  }

  // Lấy thống kê tổng quan
  getOverviewStats() {
    return this.mappingData?.thong_ke_tong_hop || null;
  }

  // Lấy thông tin tổng quan về sáp nhập
  getMergerInfo() {
    return this.mappingData?.tong_quan || null;
  }

  // Debug function để test search
  debugSearch(searchTerm: string) {
    console.log(`🔍 Debug search for: "${searchTerm}"`);
    
    if (!this.mappingData) {
      console.log('❌ No mapping data loaded');
      return;
    }

    console.log(`📊 Total mappings: ${this.mappingData.danh_sach_chuyen_doi_day_du.length}`);
    
    // Test duplicate removal
    const testDuplicates = [
      "Xã Xã Hòa Phú, tỉnh Đắk Lắk",
      "Phường Phường Tân Lập, tỉnh tỉnh Đắk Lắk", 
      "Số Số 10, Phường Tân Lập, tỉnh Đắk Lắk"
    ];

    console.log('🧪 Testing duplicate removal:');
    testDuplicates.forEach(addr => {
      const cleaned = this.removeDuplicateWords(addr);
      console.log(`  "${addr}" → "${cleaned}"`);
    });

    // Test search term
    const result = this.findByGeminiAddress(searchTerm);
    console.log(`🎯 Search result for "${searchTerm}": ${result ? '✅ Found' : '❌ Not found'}`);
    
    if (result) {
      console.log(`📍 Found mapping: ${result.don_vi_moi.ten}`);
    }
  }
}

// Export singleton instance
export const addressMappingService = new AddressMappingService();
export type { LandmarkWithAddress, AddressMapping };
