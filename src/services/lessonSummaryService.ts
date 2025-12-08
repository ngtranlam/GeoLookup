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
  let text = '';

  // Handle new lesson structure
  if (lessonData.lesson) {
    const lesson = lessonData.lesson;
    
    // Add title
    if (lesson.title) {
      text += `${lesson.title}\n\n`;
    }

    // Add learning objectives
    if (lesson.learning_objectives && Array.isArray(lesson.learning_objectives)) {
      text += "Mục tiêu học tập:\n";
      lesson.learning_objectives.forEach((objective: string) => {
        text += `- ${objective}\n`;
      });
      text += "\n";
    }

    // Add introduction
    if (lesson.introduction) {
      text += "Giới thiệu:\n";
      
      // Handle comparison structure for lesson 3
      if (lesson.introduction.content && lesson.introduction.content.comparison) {
        const comparison = lesson.introduction.content.comparison;
        if (comparison.task) {
          text += `${comparison.task}\n`;
        }
      }
      // Handle lesson 2 structure with content object
      else if (lesson.introduction.content && typeof lesson.introduction.content === 'object') {
        if (lesson.introduction.content.historical_sites) {
          text += `Di tích lịch sử: ${lesson.introduction.content.historical_sites}\n`;
        }
        if (lesson.introduction.content.notable_figures) {
          text += `Nhân vật tiêu biểu: ${lesson.introduction.content.notable_figures}\n`;
        }
        if (lesson.introduction.content.task) {
          text += `${lesson.introduction.content.task}\n`;
        }
      }
      // Handle old structure
      else {
        if (lesson.introduction.activity) {
          text += `${lesson.introduction.activity}\n`;
        }
        if (lesson.introduction.task) {
          text += `${lesson.introduction.task}\n`;
        }
      }
      text += "\n";
    }

    // Add main content
    if (lesson.main_content && Array.isArray(lesson.main_content)) {
      lesson.main_content.forEach((section: any) => {
        if (section.title) {
          text += `${section.title}\n`;
        }
        
        // Extract content from sections
        if (section.content && Array.isArray(section.content)) {
          section.content.forEach((item: any) => {
            if (item.type === 'paragraph' && item.text) {
              text += `${item.text}\n`;
            }
          });
        }

        // Extract content from subsections
        if (section.subsections && Array.isArray(section.subsections)) {
          section.subsections.forEach((subsection: any) => {
            if (subsection.title) {
              text += `${subsection.title}\n`;
            }
            
            if (subsection.content && Array.isArray(subsection.content)) {
              subsection.content.forEach((item: any) => {
                if (item.type === 'paragraph' && item.text) {
                  text += `${item.text}\n`;
                }
              });
            }

            // Extract questions and answers
            if (subsection.questions && Array.isArray(subsection.questions)) {
              subsection.questions.forEach((q: any) => {
                if (q.question) {
                  text += `Câu hỏi: ${q.question}\n`;
                }
                if (q.answer) {
                  text += `Trả lời: ${q.answer}\n`;
                }
              });
            }
          });
        }
        text += "\n";
      });
    }

    // Add practice section
    if (lesson.practice) {
      text += "Thực hành:\n";
      if (lesson.practice.exercises && Array.isArray(lesson.practice.exercises)) {
        lesson.practice.exercises.forEach((exercise: any) => {
          if (exercise.question) {
            text += `${exercise.question}\n`;
          }
          if (exercise.description) {
            text += `${exercise.description}\n`;
          }
        });
      }
      text += "\n";
    }

    // Add application section
    if (lesson.application && lesson.application.project) {
      text += "Vận dụng:\n";
      if (lesson.application.project.title) {
        text += `${lesson.application.project.title}\n`;
      }
      if (lesson.application.project.tasks && Array.isArray(lesson.application.project.tasks)) {
        lesson.application.project.tasks.forEach((task: any) => {
          if (task.description) {
            text += `${task.description}\n`;
          }
        });
      }
    }
  } else {
    // Fallback to old structure
    if (lessonData.tieu_de) {
      text += `${lessonData.tieu_de}\n\n`;
    }

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
