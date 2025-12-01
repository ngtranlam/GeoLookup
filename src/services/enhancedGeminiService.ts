import { addressMappingService, LandmarkWithAddress, AddressMapping } from './addressMappingService';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyAldSnqUMuPuxSU3D3G_yniibLgTWYngNA';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

// Enhanced search function với address mapping
export const searchLandmarkWithEnhancedAddress = async (landmarkName: string): Promise<LandmarkWithAddress[]> => {
  console.log(`🔍 Searching for: ${landmarkName}`);
  
  // Ensure mapping data is loaded
  await addressMappingService.loadMappingData();

  const maxRetries = 2; // Giảm retry để tăng tốc độ
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Step 1: Tìm kiếm với Gemini để lấy thông tin cơ bản
      const geminiResults = await searchWithGemini(landmarkName);
      
      // Step 2: Enhance với local address mapping
      const enhancedResults = await enhanceWithLocalMapping(geminiResults, landmarkName);
      
      if (enhancedResults.length > 0) {
        console.log(`✅ Found ${enhancedResults.length} enhanced results`);
        return enhancedResults;
      }

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        // Fallback: Chỉ dùng local mapping
        return await searchWithLocalMappingOnly(landmarkName);
      }
    }
  }

  // Final fallback
  return await searchWithLocalMappingOnly(landmarkName);
};

// Tìm kiếm với Gemini (enhanced prompt for address)
async function searchWithGemini(landmarkName: string): Promise<LandmarkWithAddress[]> {
  const prompt = `Tìm thông tin về địa danh "${landmarkName}" ở Việt Nam. Trả về JSON format:
{
  "results": [
    {
      "name": "Tên địa danh",
      "currentAddress": "Địa chỉ hiện tại chi tiết (phường/xã, quận/huyện, tỉnh/thành phố)",
      "description": "Mô tả ngắn gọn về địa danh",
      "image": "URL hình ảnh (nếu có)"
    }
  ]
}

QUAN TRỌNG: 
- Hãy cung cấp địa chỉ hiện tại chi tiết nhất có thể
- Bao gồm tên phường/xã, quận/huyện, tỉnh/thành phố
- Ví dụ: "Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk"`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
    }
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data: GeminiResponse = await response.json();
  const responseText = data.candidates[0]?.content.parts[0]?.text || '';
  
  // Parse JSON response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.results?.map((result: any) => ({
        name: result.name || landmarkName,
        oldAddress: '', // Will be filled by local mapping
        newAddress: '', // Will be filled by local mapping
        description: result.description || '',
        image: result.image || '',
        geminiAddress: result.currentAddress || '', // Store Gemini address for mapping
        addressDetails: {
          isUpdated: false,
          source: 'gemini' as const
        }
      })) || [];
    } catch (e) {
      console.warn('Failed to parse Gemini JSON response');
    }
  }

  // Fallback response
  return [{
    name: landmarkName,
    oldAddress: '',
    newAddress: '',
    description: responseText.trim(),
    image: '',
    geminiAddress: '', // No address in fallback
    addressDetails: {
      isUpdated: false,
      source: 'gemini' as const
    }
  }];
}

// Enhance kết quả Gemini với local mapping
async function enhanceWithLocalMapping(
  geminiResults: LandmarkWithAddress[], 
  originalQuery: string
): Promise<LandmarkWithAddress[]> {
  
  const enhancedResults: LandmarkWithAddress[] = [];

  for (const result of geminiResults) {
    let mapping: any = null;
    
    // Ưu tiên tìm kiếm bằng địa chỉ từ Gemini
    if (result.geminiAddress) {
      console.log(`🎯 Using Gemini address: ${result.geminiAddress}`);
      mapping = addressMappingService.findByGeminiAddress(result.geminiAddress);
    }
    
    // Nếu không tìm thấy bằng địa chỉ Gemini, thử tên địa danh
    if (!mapping) {
      mapping = addressMappingService.findAddressByLandmark(result.name);
    }
    
    // Nếu vẫn không tìm thấy, thử với query gốc
    if (!mapping) {
      mapping = addressMappingService.findAddressByLandmark(originalQuery);
    }

    if (mapping) {
      // Có mapping data - cập nhật địa chỉ thông minh
      const smartNewAddress = addressMappingService.generateSmartNewAddress(
        result.geminiAddress || '', 
        mapping
      );
      
      // Loại bỏ từ lặp trong địa chỉ mới
      const cleanNewAddress = addressMappingService.removeDuplicateWords(smartNewAddress);
      
      enhancedResults.push({
        ...result,
        oldAddress: result.geminiAddress || 'Thông tin chưa có sẵn', // Địa chỉ từ Gemini
        newAddress: cleanNewAddress, // Địa chỉ mới thông minh, không lặp từ
        addressDetails: {
          isUpdated: true,
          mappingInfo: mapping,
          source: 'hybrid' as const
        }
      });
    } else {
      // Không có mapping - sử dụng địa chỉ Gemini
      enhancedResults.push({
        ...result,
        oldAddress: result.geminiAddress || 'Thông tin chưa có sẵn',
        newAddress: 'Không có thông tin sáp nhập',
        addressDetails: {
          isUpdated: false,
          source: 'gemini' as const
        }
      });
    }
  }

  return enhancedResults;
}

// Fallback: Chỉ dùng local mapping
async function searchWithLocalMappingOnly(landmarkName: string): Promise<LandmarkWithAddress[]> {
  console.log(`🏠 Using local mapping only for: ${landmarkName}`);
  
  const mapping = addressMappingService.findAddressByLandmark(landmarkName);
  
  if (mapping) {
    const addresses = addressMappingService.generateFullAddress(mapping);
    
    return [{
      name: mapping.don_vi_moi.ten,
      oldAddress: addresses.oldAddress,
      newAddress: addresses.newAddress,
      description: `${mapping.loai_sap_nhap}. Diện tích: ${mapping.don_vi_moi.dien_tich_km2} km². Dân số: ${mapping.don_vi_moi.dan_so?.toLocaleString() || 'N/A'} người.`,
      image: '/thu-duc.jpeg', // Fallback image
      geminiAddress: '',
      addressDetails: {
        isUpdated: true,
        mappingInfo: mapping,
        source: 'local' as const
      }
    }];
  }

  // Không tìm thấy gì
  return [{
    name: landmarkName,
    oldAddress: 'Không tìm thấy thông tin',
    newAddress: 'Không tìm thấy thông tin',
    description: 'Địa danh này có thể không nằm trong khu vực sáp nhập tỉnh Đắk Lắk và Phú Yên.',
    image: '/thu-duc.jpeg',
    geminiAddress: '',
    addressDetails: {
      isUpdated: false,
      source: 'local' as const
    }
  }];
}

// Utility function để validate image URL
const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') || false);
  } catch {
    return false;
  }
};

// Export functions
export { addressMappingService };
export type { LandmarkWithAddress };
