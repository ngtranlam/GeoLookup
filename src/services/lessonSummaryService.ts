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

/**
 * Convert lesson JSON data to plain text for summarization
 */
const convertLessonToText = (lessonData: any): string => {
  let text = `${lessonData.tieu_de}\n\n`;

  const extractText = (content: any): string => {
    let result = '';

    if (typeof content === 'string') {
      return content + '\n';
    }

    if (Array.isArray(content)) {
      return content.map(item => extractText(item)).join('\n');
    }

    if (typeof content === 'object' && content !== null) {
      Object.keys(content).forEach(key => {
        const value = content[key];
        
        if (key === 'tieu_de') {
          result += `\n${value}\n`;
        } else if (key === 'noi_dung') {
          result += extractText(value);
        } else if (key === 'mo_dau') {
          result += `${value}\n`;
        } else if (key.startsWith('phan_') || key.startsWith('muc_') || key === 'cac_muc' || key === 'cac_phan') {
          result += extractText(value);
        }
      });
    }

    return result;
  };

  if (lessonData.noi_dung) {
    text += extractText(lessonData.noi_dung);
  }

  return text;
};

/**
 * Clean summary text by removing greetings and introductory phrases
 */
const cleanSummaryText = (text: string): string => {
  // Remove common greeting patterns
  const greetingPatterns = [
    /^Chào các em[,!].*?\n/i,
    /^Xin chào các em[,!].*?\n/i,
    /^Các em thân mến[,!].*?\n/i,
    /^Hôm nay[,\s]+chúng ta.*?\n/i,
    /^Bài học hôm nay.*?\n/i,
    /^Chúng ta cùng.*?\n/i,
  ];

  let cleanedText = text;
  greetingPatterns.forEach(pattern => {
    cleanedText = cleanedText.replace(pattern, '');
  });

  return cleanedText.trim();
};

/**
 * Generate lesson summary using Gemini API
 */
export const generateLessonSummary = async (lessonData: any): Promise<string> => {
  try {
    const lessonText = convertLessonToText(lessonData);
    
    const prompt = `Bạn là một trợ lý AI chuyên tóm tắt nội dung lịch sử. Hãy tóm tắt bài học sau đây một cách ngắn gọn, súc tích và dễ hiểu.

Yêu cầu:
1. KHÔNG sử dụng lời chào hỏi, lời mở đầu (như "Chào các em", "Hôm nay chúng ta", v.v.)
2. Đi thẳng vào nội dung tóm tắt
3. Tóm tắt các ý chính, sự kiện quan trọng
4. Sử dụng ngôn ngữ đơn giản, dễ hiểu
5. Độ dài khoảng 150-200 từ
6. Chia thành các đoạn ngắn với bullet points
7. Tập trung vào các mốc thời gian và sự kiện quan trọng

Nội dung bài học:
${lessonText}

Hãy tóm tắt bài học trên (không cần lời chào):`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const summary = data.candidates[0].content.parts[0].text;
      // Clean the summary text to remove any greetings
      return cleanSummaryText(summary);
    }

    throw new Error('No summary generated');
  } catch (error) {
    console.error('Error generating lesson summary:', error);
    throw error;
  }
};

/**
 * Generate key points from lesson using Gemini API
 */
export const generateKeyPoints = async (lessonData: any): Promise<string[]> => {
  try {
    const lessonText = convertLessonToText(lessonData);
    
    const prompt = `Từ bài học lịch sử sau, hãy trích xuất 5-7 điểm chính (key points) quan trọng nhất.

Yêu cầu:
1. Mỗi điểm phải ngắn gọn (1-2 câu)
2. Tập trung vào sự kiện, con số, mốc thời gian quan trọng
3. Sử dụng ngôn ngữ đơn giản
4. Trả về dưới dạng danh sách, mỗi điểm trên một dòng, bắt đầu bằng dấu "-"

Nội dung bài học:
${lessonText}

Hãy liệt kê các điểm chính:`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.5,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      }
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text;
      // Split by lines and filter out empty lines
      const points = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./)))
        .map(line => line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''));
      
      return points;
    }

    throw new Error('No key points generated');
  } catch (error) {
    console.error('Error generating key points:', error);
    throw error;
  }
};
