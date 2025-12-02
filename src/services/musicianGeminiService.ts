import { musicianDataService } from './musicianDataService';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyAldSnqUMuPuxSU3D3G_yniibLgTWYngNA';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface MusicianResult {
  name: string;
  birthDeath: string;
  overview: string;
  biography: string;
  career: string;
  works: string;
  awards: string;
  image: string;
  images: string[];
  source: 'local_data' | 'gemini';
}

// Identify musician name from user query using Gemini
async function identifyMusicianWithGemini(userQuery: string): Promise<string | null> {
  const allMusicians = musicianDataService.getAllMusicians();
  const musicianNames = allMusicians.map(m => m.ten_nhac_si).join('\n- ');
  
  const prompt = `Người dùng đang tìm kiếm: "${userQuery}"

Danh sách các nhạc sĩ có sẵn:
- ${musicianNames}

Nhiệm vụ: Xác định xem người dùng đang muốn tìm nhạc sĩ NÀO trong danh sách trên.

Yêu cầu:
- Nếu tìm thấy khớp (có thể viết tắt, thiếu dấu, sai chính tả nhẹ), trả về TÊN CHÍNH XÁC từ danh sách
- Nếu không khớp với bất kỳ nhạc sĩ nào, trả về: NONE
- CHỈ trả về tên nhạc sĩ hoặc NONE, KHÔNG giải thích gì thêm

Ví dụ:
- "nhat lai" → "Nhạc sĩ Nhật Lai"
- "kpa ylang" → "Nhạc sĩ Kpă Y Lăng"
- "tuyet mai" → "Nhạc sĩ Trương Tuyết Mai"
- "nguoi khong ton tai" → NONE`;

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
    
    console.log(`Gemini musician identification: "${result}"`);
    
    if (!result || result.toUpperCase() === 'NONE') {
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Error identifying musician:', error);
    return null;
  }
}

// Fetch detailed biography from Gemini
async function fetchMusicianBioFromGemini(musicianName: string): Promise<{
  biography: string;
  achievements: string;
  famousWorks: string;
}> {
  const prompt = `Hãy cung cấp thông tin chi tiết và đầy đủ về ${musicianName} theo đúng format sau:

TIỂU SỬ:
[Viết 4-6 câu về:
- Họ tên đầy đủ, năm sinh - mất (nếu có)
- Quê quán, nơi sinh
- Quá trình học tập, đào tạo âm nhạc
- Sự nghiệp âm nhạc, các giai đoạn hoạt động
- Phong cách sáng tác đặc trưng
- Ảnh hưởng đến nền âm nhạc Việt Nam]

THÀNH TỰU:
[Liệt kê CỤ THỂ và ĐẦY ĐỦ:
- Các giải thưởng âm nhạc đã nhận (tên giải, năm nhận)
- Danh hiệu, chức vụ (Nghệ sĩ Nhân dân, Nghệ sĩ Ưu tú, v.v.)
- Các đóng góp quan trọng cho âm nhạc dân tộc
- Vai trò trong các tổ chức âm nhạc
- Thành tích nổi bật khác
- Nếu KHÔNG có thông tin cụ thể, hãy viết: "Chưa có thông tin chi tiết về thành tựu"]

TÁC PHẨM NỔI TIẾNG:
[Liệt kê CỤ THỂ:
- Tên các bài hát nổi tiếng nhất (ít nhất 5-10 bài nếu có)
- Năm sáng tác (nếu biết)
- Thể loại nhạc
- Ca sĩ thể hiện nổi tiếng
- Các tác phẩm được yêu thích nhất
- Nếu KHÔNG tìm được thông tin, hãy viết: "Chưa có thông tin chi tiết về tác phẩm"]

YÊU CẦU QUAN TRỌNG:
- Viết bằng tiếng Việt
- Thông tin PHẢI chính xác, có căn cứ từ nguồn đáng tin cậy
- Viết ĐẦY ĐỦ, CHI TIẾT, KHÔNG viết chung chung
- KHÔNG sử dụng emoji
- KHÔNG bịa đặt thông tin
- Nếu thực sự KHÔNG có thông tin về mục nào, hãy ghi rõ "Chưa có thông tin chi tiết"
- Ưu tiên thông tin về nhạc sĩ Việt Nam, đặc biệt là các nhạc sĩ có liên quan đến Đắk Lắk, Phú Yên`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000,
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
    const text = data.candidates[0]?.content.parts[0]?.text || '';
    
    console.log('Gemini musician bio response:', text);
    
    // Parse the response
    const bioMatch = text.match(/TIỂU SỬ:\s*([\s\S]*?)(?=THÀNH TỰU:|$)/i);
    const achievementsMatch = text.match(/THÀNH TỰU:\s*([\s\S]*?)(?=TÁC PHẨM NỔI TIẾNG:|$)/i);
    const worksMatch = text.match(/TÁC PHẨM NỔI TIẾNG:\s*([\s\S]*?)(?=YÊU CẦU QUAN TRỌNG:|$)/i);
    
    return {
      biography: bioMatch?.[1]?.trim() || 'Chưa có thông tin tiểu sử',
      achievements: achievementsMatch?.[1]?.trim() || 'Chưa có thông tin chi tiết về thành tựu',
      famousWorks: worksMatch?.[1]?.trim() || 'Chưa có thông tin chi tiết về tác phẩm'
    };
  } catch (error) {
    console.error('Error fetching musician bio:', error);
    return {
      biography: 'Không thể tải thông tin tiểu sử',
      achievements: 'Chưa có thông tin chi tiết về thành tựu',
      famousWorks: 'Chưa có thông tin chi tiết về tác phẩm'
    };
  }
}

// Main search function for musicians
export const searchMusicianWithGemini = async (query: string): Promise<MusicianResult[]> => {
  console.log(`🎵 Searching for musician: ${query}`);
  
  // STEP 1: Try direct match in local data
  const directMatch = musicianDataService.searchMusician(query);
  if (directMatch) {
    console.log('✅ Direct match found in local musician data');
    
    return [{
      name: directMatch.name,
      birthDeath: directMatch.birthDeath,
      overview: directMatch.overview,
      biography: directMatch.biography,
      career: directMatch.career,
      works: directMatch.works,
      awards: directMatch.awards,
      image: directMatch.thumbnail,
      images: directMatch.images,
      source: 'local_data'
    }];
  }
  
  // STEP 2: Use Gemini to identify the musician
  console.log('⚠️ No direct match, using Gemini to identify musician...');
  
  try {
    const identifiedMusician = await identifyMusicianWithGemini(query);
    
    if (identifiedMusician) {
      console.log(`✅ Gemini identified: "${identifiedMusician}"`);
      
      const localMatch = musicianDataService.searchMusician(identifiedMusician);
      
      if (localMatch) {
        console.log('✅ Found matching musician in local data!');
        
        return [{
          name: localMatch.name,
          birthDeath: localMatch.birthDeath,
          overview: localMatch.overview,
          biography: localMatch.biography,
          career: localMatch.career,
          works: localMatch.works,
          awards: localMatch.awards,
          image: localMatch.thumbnail,
          images: localMatch.images,
          source: 'local_data'
        }];
      }
    }
  } catch (error) {
    console.error('Error identifying musician with Gemini:', error);
  }
  
  // STEP 3: Not found in local data
  console.log('⚠️ Not found in local musician database');
  return [];
};
