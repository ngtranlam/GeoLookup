// Lesson data consolidated from JSON files
export interface Lesson {
  id: number;
  title: string;
  fileName: string;
}

export const lessons: Lesson[] = [
  // Đắk Lắk lessons
  { id: 1, title: "Bài 1 - Đắk Lắk: Đắk Lắk từ năm 1930 đến năm 1945", fileName: "bai_1_daklak.json" },
  { id: 2, title: "Bài 2 - Đắk Lắk: Đắk Lắk từ năm 1945 đến năm 1975", fileName: "bai_2_daklak.json" },
  { id: 3, title: "Bài 3 - Đắk Lắk: Đắk Lắk từ năm 1975 đến nay", fileName: "bai_3_daklak.json" },
  { id: 4, title: "Bài 4 - Đắk Lắk: Bảo tồn và phát huy giá trị di sản văn hóa địa phương", fileName: "bai4_daklak.json" },
  { id: 5, title: "Bài 8 - Đắk Lắk: Địa lí ngành du lịch tỉnh Đắk Lắk", fileName: "bai8_daklak.json" },
  { id: 6, title: "Bài 12 - Đắk Lắk: Một số vấn đề về môi trường ở tỉnh Đắk Lắk", fileName: "bai12_daklak.json" },
  
  // Phú Yên lessons
  { id: 7, title: "Chủ đề 1 - Phú Yên: Khái quát phong trào cách mạng ở Phú Yên (1930 – 1945)", fileName: "chude1_phuyen.json" },
  { id: 8, title: "Chủ đề 3 - Phú Yên: Văn xuôi trên vùng đất Phú Yên", fileName: "chude3_phuyen.json" },
  { id: 9, title: "Chủ đề 5 - Phú Yên: Giới thiệu một số nhạc sĩ tiêu biểu người Phú Yên", fileName: "chude5_phuyen.json" },
  { id: 10, title: "Chủ đề 7 - Phú Yên: Quảng bá du lịch tỉnh Phú Yên", fileName: "chude7_phuyen.json" },

];
