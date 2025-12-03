interface LessonContent {
  tieu_de: string;
  noi_dung: any;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  questions: QuizQuestion[];
  totalQuestions: number;
}

const GEMINI_API_KEY = 'AIzaSyAldSnqUMuPuxSU3D3G_yniibLgTWYngNA';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

// Function to load lesson content from JSON files
export const loadLessonContent = async (): Promise<LessonContent[]> => {
  const lessons: LessonContent[] = [];
  
  try {
    // Load all 10 lesson files
    for (let i = 1; i <= 10; i++) {
      const response = await fetch(`/source_content/bai_${i}.json`);
      if (response.ok) {
        const lessonData = await response.json();
        lessons.push(lessonData);
      }
    }
    return lessons;
  } catch (error) {
    console.error('Error loading lesson content:', error);
    return [];
  }
};

// Function to extract text content from lesson structure
const extractTextContent = (obj: any): string[] => {
  const texts: string[] = [];
  
  if (typeof obj === 'string') {
    texts.push(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach(item => {
      texts.push(...extractTextContent(item));
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(value => {
      texts.push(...extractTextContent(value));
    });
  }
  
  return texts;
};

// Function to generate quiz using Gemini API
export const generateQuizFromLessons = async (lessons: LessonContent[]): Promise<QuizData> => {
  try {
    // Extract all text content from lessons
    const allContent = lessons.map(lesson => {
      const title = lesson.tieu_de;
      const contentTexts = extractTextContent(lesson.noi_dung);
      return `Bài học: ${title}\n${contentTexts.join('\n')}`;
    }).join('\n\n');

    const prompt = `Dựa trên nội dung các bài học về lịch sử Đắk Lắk dưới đây, hãy tạo ra 10 câu hỏi trắc nghiệm:

${allContent}

YÊU CẦU:
1. Tạo 10 câu hỏi trắc nghiệm về nội dung các bài học
2. Mỗi câu hỏi có 4 đáp án A, B, C, D
3. Câu hỏi phải đa dạng: về sự kiện lịch sử, nhân vật, địa danh, thời gian
4. Độ khó từ dễ đến trung bình, phù hợp học sinh
5. Đáp án đúng phải rõ ràng và có giải thích

Trả về kết quả dưới dạng JSON với format sau:
{
  "questions": [
    {
      "id": 1,
      "question": "Câu hỏi...",
      "options": ["A. Đáp án A", "B. Đáp án B", "C. Đáp án C", "D. Đáp án D"],
      "correctAnswer": 0,
      "explanation": "Giải thích tại sao đáp án này đúng..."
    }
  ]
}

Lưu ý: correctAnswer là index của đáp án đúng (0=A, 1=B, 2=C, 3=D)`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
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
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    try {
      const quizData = JSON.parse(jsonMatch[0]);
      
      return {
        questions: quizData.questions || [],
        totalQuestions: quizData.questions?.length || 0
      };
    } catch (parseError) {
      console.error('Error parsing quiz JSON:', parseError);
      throw new Error('Failed to parse quiz data');
    }

  } catch (error) {
    console.error('Error generating quiz:', error);
    
    // Return fallback quiz data
    return {
      questions: [
        {
          id: 1,
          question: "Đảng Cộng sản Việt Nam ra đời vào ngày nào?",
          options: ["A. 3/2/1930", "B. 19/5/1890", "C. 2/9/1945", "D. 15/8/1945"],
          correctAnswer: 0,
          explanation: "Đảng Cộng sản Việt Nam ra đời ngày 3/2/1930 là một bước ngoặt vĩ đại của lịch sử dân tộc."
        }
      ],
      totalQuestions: 1
    };
  }
};

// Function to generate quiz for a single lesson
export const generateQuizForLesson = async (lessonData: any): Promise<QuizData> => {
  try {
    // Extract text content from lesson
    const title = lessonData.tieu_de || 'Bài học';
    const contentTexts = extractTextContent(lessonData.noi_dung || lessonData);
    const lessonContent = `${title}\n${contentTexts.join('\n')}`;

    const prompt = `Dựa trên nội dung bài học lịch sử dưới đây, hãy tạo ra 5 câu hỏi trắc nghiệm:

${lessonContent}

YÊU CẦU:
1. Tạo CHÍNH XÁC 5 câu hỏi trắc nghiệm về nội dung bài học
2. Mỗi câu hỏi có 4 đáp án A, B, C, D
3. Câu hỏi phải đa dạng: về sự kiện lịch sử, nhân vật, địa danh, thời gian, ý nghĩa
4. Độ khó từ dễ đến trung bình, phù hợp học sinh THCS
5. Đáp án đúng phải rõ ràng và có giải thích chi tiết
6. KHÔNG sử dụng lời chào, lời mở đầu

Trả về kết quả dưới dạng JSON thuần túy với format sau (KHÔNG thêm markdown, KHÔNG thêm \`\`\`json):
{
  "questions": [
    {
      "id": 1,
      "question": "Câu hỏi...",
      "options": ["A. Đáp án A", "B. Đáp án B", "C. Đáp án C", "D. Đáp án D"],
      "correctAnswer": 0,
      "explanation": "Giải thích chi tiết tại sao đáp án này đúng..."
    }
  ]
}

Lưu ý: correctAnswer là index của đáp án đúng (0=A, 1=B, 2=C, 3=D)`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
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

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    let responseText = data.candidates[0].content.parts[0].text;
    
    // Clean response text
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const quizData = JSON.parse(jsonMatch[0]);
    
    return {
      questions: quizData.questions || [],
      totalQuestions: quizData.questions?.length || 0
    };

  } catch (error) {
    console.error('Error generating quiz for lesson:', error);
    throw error;
  }
};

export type { QuizQuestion, QuizData, LessonContent };
