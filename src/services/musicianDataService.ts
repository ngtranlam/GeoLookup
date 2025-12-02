import musicianData from '../data/nhac_si.json';

export interface MusicianData {
  stt: number;
  ten_nhac_si: string;
  nam_sinh_mat: string;
  tong_quan: string;
  tieu_su: string;
  su_nghiep: string;
  tac_pham: string;
  giai_thuong: string;
  thumbnail: string;
  images: string[];
}

export interface MusicianSearchResult {
  name: string;
  birthDeath: string;
  overview: string;
  biography: string;
  career: string;
  works: string;
  awards: string;
  thumbnail: string;
  images: string[];
}

class MusicianDataService {
  private musicians: MusicianData[];

  constructor() {
    this.musicians = musicianData.nhac_si;
  }

  // Normalize text for search (remove diacritics, lowercase)
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd');
  }

  // Search musician by name (fuzzy matching)
  searchMusician(query: string): MusicianSearchResult | null {
    const normalizedQuery = this.normalizeText(query);
    
    const found = this.musicians.find(musician => {
      const normalizedName = this.normalizeText(musician.ten_nhac_si);
      
      // Check if query is contained in name or vice versa
      return normalizedName.includes(normalizedQuery) || 
             normalizedQuery.includes(normalizedName) ||
             this.fuzzyMatch(normalizedName, normalizedQuery);
    });

    if (!found) return null;

    return {
      name: found.ten_nhac_si,
      birthDeath: found.nam_sinh_mat,
      overview: found.tong_quan,
      biography: found.tieu_su,
      career: found.su_nghiep,
      works: found.tac_pham,
      awards: found.giai_thuong,
      thumbnail: found.thumbnail,
      images: found.images
    };
  }

  // Fuzzy matching for partial name matches
  private fuzzyMatch(name: string, query: string): boolean {
    const nameWords = name.split(' ').filter(w => w.length > 0);
    const queryWords = query.split(' ').filter(w => w.length > 0);
    
    // Check if all query words are found in name words
    return queryWords.every(qWord => 
      nameWords.some(nWord => 
        nWord.includes(qWord) || qWord.includes(nWord)
      )
    );
  }

  // Get all musicians
  getAllMusicians(): MusicianData[] {
    return this.musicians;
  }
}

export const musicianDataService = new MusicianDataService();
