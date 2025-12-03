// Lesson data consolidated from JSON files
export interface Lesson {
  id: number;
  title: string;
  fileName: string;
}

export const lessons: Lesson[] = [
  { id: 1, title: "Đắk Lắk từ năm 1930 đến năm 1945", fileName: "bai_1.json" },
  { id: 2, title: "Đắk Lắk từ năm 1945 đến năm 1975", fileName: "bai_2.json" },
  { id: 3, title: "Đắk Lắk từ năm 1975 đến nay", fileName: "bai_3.json" },
  { id: 4, title: "Phú Yên từ năm 1930 đến năm 1945", fileName: "bai_4.json" },
  { id: 5, title: "Phú Yên từ năm 1945 đến năm 1975", fileName: "bai_5.json" },
  { id: 6, title: "Phú Yên từ năm 1975 đến nay", fileName: "bai_6.json" },
  { id: 7, title: "Quảng Ngãi từ năm 1930 đến năm 1945", fileName: "bai_7.json" },
  { id: 8, title: "Quảng Ngãi từ năm 1945 đến năm 1975", fileName: "bai_8.json" },
  { id: 9, title: "Quảng Ngãi từ năm 1975 đến nay", fileName: "bai_9.json" },
  { id: 10, title: "Bình Định từ năm 1930 đến nay", fileName: "bai_10.json" },
  { id: 11, title: "Đắk Lắk - Bài học bổ sung", fileName: "Bài_11_dak_lak.json" },
  { id: 12, title: "Phú Yên - Bài học bổ sung", fileName: "bai_12_phu_yen.json" },
  { id: 13, title: "Đắk Lắk - Bài học mới", fileName: "bai_13_dak_lak_moi.json" },
];
