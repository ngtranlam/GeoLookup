interface LandmarkResult {
  name: string;
  oldAddress: string;
  newAddress: string;
  description: string;
  image?: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const GEMINI_API_KEY = 'AIzaSyAldSnqUMuPuxSU3D3G_yniibLgTWYngNA';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

// Function to validate image URL with timeout
const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
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

// Note: Removed getValidImageUrl function as we now validate directly in the main function

export const searchLandmarkWithGemini = async (landmarkName: string): Promise<LandmarkResult[]> => {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
    const prompt = `Như bạn đã biết, Việt Nam đã thực hiện tái cấu trúc về đơn vị hành chính (Xác nhập tỉnh, địa phương). Bạn hãy tìm kiếm thông tin trên internet và trả về kết quả chi tiết cho tôi bao gồm các thông tin sau về địa danh "${landmarkName}":

- Địa chỉ cũ 
- Địa chỉ mới
- Mô tả về địa danh đó
- Link hình ảnh thực tế về địa danh đó (BẮT BUỘC phải có URL hình ảnh từ internet)

CỰC KỲ QUAN TRỌNG: 
1. Bạn PHẢI tìm và cung cấp link hình ảnh thực tế từ internet cho địa danh này
2. Link hình ảnh PHẢI hoạt động và có thể truy cập được
3. Tìm từ các nguồn uy tín như Wikipedia, báo chí, du lịch Việt Nam
4. Không được để trống hoặc trả về placeholder
5. Nếu không tìm được hình ảnh chính xác, hãy tìm hình ảnh liên quan đến khu vực đó

Ví dụ các nguồn tốt:
- https://upload.wikimedia.org/wikipedia/commons/...
- https://images.vietnamnet.vn/...
- https://photo-cms-baonghean.zadn.vn/...
- https://media.vneconomy.vn/...

Vui lòng trả về kết quả dưới dạng JSON với format sau:
{
  "results": [
    {
      "name": "Tên địa danh",
      "oldAddress": "Địa chỉ cũ",
      "newAddress": "Địa chỉ mới", 
      "description": "Mô tả chi tiết về địa danh",
      "image": "URL hình ảnh thực tế từ internet (BẮT BUỘC - PHẢI CÓ)"
    }
  ]
}

Nếu không tìm thấy thông tin về tái cấu trúc hành chính, hãy trả về thông tin chung về địa danh đó với oldAddress và newAddress giống nhau. Nhưng LUÔN LUÔN phải có link hình ảnh thật từ internet hoạt động được.`;

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
        maxOutputTokens: 2048,
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

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If no JSON found, create a fallback response
      return [{
        name: landmarkName,
        oldAddress: "Thông tin chưa có sẵn",
        newAddress: "Thông tin chưa có sẵn",
        description: responseText.trim(),
        image: "/thu-duc.jpeg" // Fallback image only when no JSON
      }];
    }

    try {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      if (parsedResponse.results && Array.isArray(parsedResponse.results)) {
        const results = await Promise.all(
          parsedResponse.results.map(async (result: any) => ({
            name: result.name || landmarkName,
            oldAddress: result.oldAddress || "Thông tin chưa có sẵn",
            newAddress: result.newAddress || "Thông tin chưa có sẵn", 
            description: result.description || "Thông tin chưa có sẵn",
            image: result.image || "" // Keep original URL for validation
          }))
        );
        
        // Check if all images are valid
        const hasValidImages = await Promise.all(
          results.map(result => result.image ? validateImageUrl(result.image) : Promise.resolve(false))
        );
        
        if (hasValidImages.some(isValid => isValid)) {
          // At least one valid image found, return results with validated images
          const finalResults = await Promise.all(
            results.map(async (result, index) => ({
              ...result,
              image: hasValidImages[index] ? result.image : "/thu-duc.jpeg"
            }))
          );
          return finalResults;
        } else if (attempt < maxRetries) {
          console.log(`Attempt ${attempt}: No valid images found, retrying...`);
          continue; // Retry
        } else {
          // Last attempt failed, return with fallback images
          return results.map(result => ({
            ...result,
            image: "/thu-duc.jpeg"
          }));
        }
      } else {
        // Handle single result format
        const imageUrl = parsedResponse.image || "";
        const isValidImage = imageUrl ? await validateImageUrl(imageUrl) : false;
        
        if (isValidImage) {
          return [{
            name: parsedResponse.name || landmarkName,
            oldAddress: parsedResponse.oldAddress || "Thông tin chưa có sẵn",
            newAddress: parsedResponse.newAddress || "Thông tin chưa có sẵn",
            description: parsedResponse.description || responseText.trim(),
            image: imageUrl
          }];
        } else if (attempt < maxRetries) {
          console.log(`Attempt ${attempt}: Single result has no valid image, retrying...`);
          continue; // Retry
        } else {
          return [{
            name: parsedResponse.name || landmarkName,
            oldAddress: parsedResponse.oldAddress || "Thông tin chưa có sẵn",
            newAddress: parsedResponse.newAddress || "Thông tin chưa có sẵn",
            description: parsedResponse.description || responseText.trim(),
            image: "/thu-duc.jpeg"
          }];
        }
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      if (attempt < maxRetries) {
        console.log(`Attempt ${attempt}: Parse error, retrying...`);
        continue; // Retry
      } else {
        // Return fallback response with raw text
        return [{
          name: landmarkName,
          oldAddress: "Thông tin chưa có sẵn",
          newAddress: "Thông tin chưa có sẵn",
          description: responseText.trim(),
          image: "/thu-duc.jpeg"
        }];
      }
    }

    } catch (error) {
      console.error(`Error calling Gemini API (attempt ${attempt}):`, error);
      if (attempt < maxRetries) {
        console.log(`Attempt ${attempt}: API error, retrying...`);
        continue; // Retry
      } else {
        // Return fallback response on final error
        return [{
          name: landmarkName,
          oldAddress: "Lỗi khi tìm kiếm thông tin",
          newAddress: "Lỗi khi tìm kiếm thông tin",
          description: "Không thể tìm kiếm thông tin lúc này. Vui lòng thử lại sau.",
          image: "/thu-duc.jpeg"
        }];
      }
    }
  }
  
  // This should never be reached, but TypeScript requires it
  return [{
    name: landmarkName,
    oldAddress: "Lỗi không xác định",
    newAddress: "Lỗi không xác định", 
    description: "Đã thử tối đa số lần cho phép.",
    image: "/thu-duc.jpeg"
  }];
};
