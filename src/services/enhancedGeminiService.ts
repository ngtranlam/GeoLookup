import { addressMappingService, LandmarkWithAddress } from './addressMappingService';
import { landmarkDataService } from './landmarkDataService';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyDyEKFMprx1PzYz3Xc-YnIUTrNft_QDstc';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`;

// Enhanced search function với address mapping
export const searchLandmarkWithEnhancedAddress = async (landmarkName: string): Promise<LandmarkWithAddress[]> => {
  console.log(`🔍 Searching for: ${landmarkName}`);
  
  // STEP 1: Try direct match in local data first (fast path)
  const directMatch = landmarkDataService.searchLandmark(landmarkName);
  if (directMatch) {
    console.log('✅ Direct match found in local landmark data');
    
    // Fetch detailed description from Gemini
    let description = '';
    try {
      const geminiDesc = await fetchDescriptionFromGemini(directMatch.name);
      description = geminiDesc;
    } catch (error) {
      console.error('Failed to fetch description from Gemini:', error);
      description = 'Địa danh lịch sử quan trọng tại tỉnh Đắk Lắk';
    }
    
    return [{
      name: directMatch.name,
      oldAddress: directMatch.oldAddress,
      newAddress: directMatch.newAddress,
      geminiAddress: directMatch.newAddress,
      description: description,
      image: directMatch.thumbnail,
      images: directMatch.images,
      addressDetails: {
        source: 'local_data',
        hasMapping: false
      }
    }];
  }
  
  // STEP 2: Use Gemini to identify the landmark from user query
  console.log('⚠️ No direct match, using Gemini to identify landmark...');
  
  try {
    const identifiedLandmark = await identifyLandmarkWithGemini(landmarkName);
    
    if (identifiedLandmark) {
      console.log(`✅ Gemini identified: "${identifiedLandmark}"`);
      
      // Try to find in local data with identified name
      const localMatch = landmarkDataService.searchLandmark(identifiedLandmark);
      
      if (localMatch) {
        console.log('✅ Found matching landmark in local data!');
        
        // Fetch detailed description
        let description = '';
        try {
          const geminiDesc = await fetchDescriptionFromGemini(localMatch.name);
          description = geminiDesc;
        } catch (error) {
          description = 'Địa danh lịch sử quan trọng tại tỉnh Đắk Lắk';
        }
        
        return [{
          name: localMatch.name,
          oldAddress: localMatch.oldAddress,
          newAddress: localMatch.newAddress,
          geminiAddress: localMatch.newAddress,
          description: description,
          image: localMatch.thumbnail,
          images: localMatch.images,
          addressDetails: {
            source: 'local_data',
            hasMapping: false
          }
        }];
      }
    }
  } catch (error) {
    console.error('Error identifying landmark with Gemini:', error);
  }
  
  // STEP 3: Search with Gemini for general landmarks (fallback)
  console.log('⚠️ Not found in local data, searching with Gemini for general landmarks...');
  
  // Ensure mapping data is loaded
  await addressMappingService.loadMappingData();

  const maxRetries = 2; // Giảm retry để tăng tốc độ
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Step 1: Tìm kiếm với Gemini để lấy thông tin cơ bản
      const geminiResults = await searchWithGemini(landmarkName);
      
      // Step 2: Filter chỉ giữ địa danh thuộc Đắk Lắk và Phú Yên
      const filteredResults = geminiResults.filter(result => {
        const isInTarget = addressMappingService.isInTargetProvinces(result.geminiAddress || '');
        if (!isInTarget) {
          console.log(`🚫 Filtered out: ${result.name} - not in Đắk Lắk/Phú Yên`);
        }
        return isInTarget;
      });

      if (filteredResults.length === 0) {
        console.log('❌ No results found in target provinces (Đắk Lắk/Phú Yên)');
        // Nếu Gemini trả về kết quả nhưng không thuộc target provinces, return empty array
        if (geminiResults.length > 0) {
          console.log('🚫 Gemini found results but not in target provinces - returning empty array');
          return [];
        }
        continue; // Try next attempt if no results at all
      }

      // Step 3: Enhance với local address mapping
      const enhancedResults = await enhanceWithLocalMapping(filteredResults, landmarkName);
      
      if (enhancedResults.length > 0) {
        console.log(`✅ Found ${enhancedResults.length} enhanced results in target provinces`);
        return enhancedResults;
      }

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        // Fallback: Chỉ dùng local mapping (trong phạm vi Đắk Lắk/Phú Yên)
        const localResults = await searchWithLocalMappingOnly(landmarkName);
        const filteredLocalResults = localResults.filter(result => 
          addressMappingService.isInTargetProvinces(result.oldAddress || result.newAddress || '')
        );
        
        // Nếu không có kết quả local nào trong target provinces, return empty array
        if (filteredLocalResults.length === 0) {
          console.log('🚫 No local results found in target provinces - returning empty array');
          return [];
        }
        
        return filteredLocalResults;
      }
    }
  }

  // Final fallback (trong phạm vi Đắk Lắk/Phú Yên)
  const finalResults = await searchWithLocalMappingOnly(landmarkName);
  const filteredFinalResults = finalResults.filter(result => 
    addressMappingService.isInTargetProvinces(result.oldAddress || result.newAddress || '')
  );
  
  // Đảm bảo trả về empty array nếu không có kết quả trong target provinces
  if (filteredFinalResults.length === 0) {
    console.log('🚫 Final fallback: No results found in target provinces - returning empty array');
    return [];
  }
  
  return filteredFinalResults;
};

// Identify landmark name from user query using Gemini
async function identifyLandmarkWithGemini(userQuery: string): Promise<string | null> {
  // Get all landmark names from local data
  const allLandmarks = landmarkDataService.getAllLandmarks();
  const landmarkNames = allLandmarks.map(l => l['Tên địa danh']).join('\n- ');
  
  const prompt = `Người dùng đang tìm kiếm: "${userQuery}"

Danh sách các địa danh có sẵn ở Đắk Lắk:
- ${landmarkNames}

Nhiệm vụ: Xác định xem người dùng đang muốn tìm địa danh NÀO trong danh sách trên.

Yêu cầu:
- Nếu tìm thấy khớp (có thể viết tắt, thiếu dấu, sai chính tả nhẹ), trả về TÊN CHÍNH XÁC từ danh sách
- Nếu không khớp với bất kỳ địa danh nào, trả về: NONE
- CHỈ trả về tên địa danh hoặc NONE, KHÔNG giải thích gì thêm

Ví dụ:
- "nha day" → "Nhà đày Buôn Ma Thuột"
- "thap nhinh phong" → "Tháp Nghinh Phong"
- "ho lak" → "Hồ Lắk"
- "dia danh khong ton tai" → NONE`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 100,
    }
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const result = data.candidates[0]?.content.parts[0]?.text.trim() || '';
    
    console.log(`Gemini identification result: "${result}"`);
    
    // Check if result is NONE or empty
    if (!result || result.toUpperCase() === 'NONE') {
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Error identifying landmark:', error);
    return null;
  }
}

// Fetch detailed description from Gemini
async function fetchDescriptionFromGemini(landmarkName: string): Promise<string> {
  const prompt = `Hãy viết một đoạn mô tả chi tiết, sinh động và hấp dẫn về địa danh "${landmarkName}" ở tỉnh Đắk Lắk, Việt Nam.

Yêu cầu:
- Mô tả phải dài từ 3-5 câu
- Bao gồm thông tin lịch sử, ý nghĩa văn hóa
- Nêu bật điểm đặc biệt, độc đáo của địa danh
- Viết theo phong cách giới thiệu du lịch, thu hút người đọc
- KHÔNG sử dụng emoji
- Trả về CHỈ đoạn mô tả, không có tiêu đề hay format khác`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    }
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const description = data.candidates[0]?.content.parts[0]?.text || '';
    
    return description.trim();
  } catch (error) {
    console.error('Error fetching description:', error);
    return `${landmarkName} là một địa danh lịch sử quan trọng tại tỉnh Đắk Lắk, mang đậm dấu ấn văn hóa và lịch sử của vùng đất Tây Nguyên.`;
  }
}

// Tìm kiếm với Gemini (enhanced prompt for detailed address)
async function searchWithGemini(landmarkName: string): Promise<LandmarkWithAddress[]> {
  const prompt = `Tìm thông tin về địa danh "${landmarkName}" ở tỉnh Đắk Lắk hoặc tỉnh Phú Yên, Việt Nam. Trả về JSON format:
{
  "results": [
    {
      "name": "Tên địa danh",
      "currentAddress": "Địa chỉ hiện tại CỰC KỲ CHI TIẾT (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)",
      "description": "Mô tả ngắn gọn về địa danh",
      "image": "URL hình ảnh (nếu có)"
    }
  ]
}

CỰC KỲ QUAN TRỌNG - PHẠM VI TÌM KIẾM:
- CHỈ tìm địa danh thuộc tỉnh Đắk Lắk hoặc tỉnh Phú Yên
- KHÔNG trả về địa danh ở các tỉnh khác
- Nếu không tìm thấy ở 2 tỉnh này, trả về mảng rỗng

ĐỊA CHỈ CHI TIẾT:
- BẮT BUỘC bao gồm số nhà và tên đường (nếu có)
- Định dạng: "Số [X] đường [Tên đường], Phường [Tên], [Quận/Huyện], tỉnh [Tên tỉnh]"
- Ví dụ tốt: "Số 10 đường Nguyễn Du, Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk"
- Ví dụ tốt: "Đường Trần Hưng Đạo, thị xã Tuy Hòa, tỉnh Phú Yên"
- Nếu không có số nhà cụ thể, hãy tìm tên đường gần nhất`;

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
