import landmarkData from '../data/diadanh.json';

export interface LandmarkData {
  TT: number;
  'Tên địa danh': string;
  'Địa chỉ trước sát nhập': string;
  'Địa chỉ sau sát nhập': string;
  'Thumbnai image': string;
  'Image 1': string | null;
  'Image 2': string | null;
  'Image 3': string | null;
  'Image 4': string | null;
}

export interface LandmarkSearchResult {
  name: string;
  oldAddress: string;
  newAddress: string;
  thumbnail: string;
  images: string[];
  description?: string;
}

class LandmarkDataService {
  private landmarks: LandmarkData[] = landmarkData as LandmarkData[];

  // Normalize text for search
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .trim();
  }

  // Search landmarks by name (returns basic info, description will be fetched from Gemini)
  searchLandmark(query: string): LandmarkSearchResult | null {
    const normalizedQuery = this.normalizeText(query);
    
    const found = this.landmarks.find(landmark => {
      const normalizedName = this.normalizeText(landmark['Tên địa danh']);
      return normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName);
    });

    if (!found) {
      return null;
    }

    // Collect all valid images
    const images: string[] = [];
    if (found['Image 1']) images.push(found['Image 1']);
    if (found['Image 2']) images.push(found['Image 2']);
    if (found['Image 3']) images.push(found['Image 3']);
    if (found['Image 4']) images.push(found['Image 4']);

    return {
      name: found['Tên địa danh'],
      oldAddress: found['Địa chỉ trước sát nhập'],
      newAddress: found['Địa chỉ sau sát nhập'],
      thumbnail: found['Thumbnai image'],
      images: images,
      description: undefined // Will be fetched from Gemini
    };
  }

  // Get all landmarks
  getAllLandmarks(): LandmarkData[] {
    return this.landmarks;
  }
}

export const landmarkDataService = new LandmarkDataService();
