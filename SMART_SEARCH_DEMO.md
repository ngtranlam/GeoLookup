# 🔍 Tìm Kiếm Thông Minh với Gemini AI

## Tính năng mới: Tìm kiếm không cần nhập chính xác

### Cách hoạt động:

**3 bước tìm kiếm:**

1. **Direct Match** (Nhanh nhất)
   - Tìm trực tiếp trong file JSON
   - Nếu khớp → Trả về ngay

2. **Gemini Identification** (Thông minh)
   - Gửi query + danh sách 29 địa danh cho Gemini
   - Gemini xác định địa danh nào người dùng muốn tìm
   - Tìm lại trong JSON với tên chính xác
   - Nếu tìm thấy → Trả về với ảnh + mô tả chi tiết

3. **General Search** (Fallback)
   - Tìm kiếm địa danh tổng quát với Gemini
   - Áp dụng cho địa danh không có trong JSON

### Ví dụ tìm kiếm:

| Người dùng nhập | Gemini nhận diện | Kết quả |
|----------------|------------------|---------|
| "nha day" | "Nhà đày Buôn Ma Thuột" | ✅ Tìm thấy |
| "thap nhinh phong" | "Tháp Nghinh Phong" | ✅ Tìm thấy |
| "ho lak" | "Hồ Lắk" | ✅ Tìm thấy |
| "bao tang ca phe" | "Bảo tàng Thế giới Cà phê" | ✅ Tìm thấy |
| "nha tho tan dinh" | "Nhà thờ Tân Định" | ✅ Tìm thấy |
| "ganh da dia" | "Gành Đá Đĩa" | ✅ Tìm thấy |

### Ưu điểm:

✅ **Không cần nhập chính xác**
- Thiếu dấu: "nha day" → "Nhà đày"
- Sai chính tả nhẹ: "nhinh phong" → "Nghinh Phong"
- Viết tắt: "ho lak" → "Hồ Lắk"

✅ **Mô tả chi tiết từ Gemini**
- 3-5 câu mô tả sinh động
- Thông tin lịch sử, văn hóa
- Phong cách giới thiệu du lịch

✅ **Hiển thị đầy đủ**
- Thumbnail + 4 ảnh slideshow
- Địa chỉ cũ và mới
- Popup đẹp với dark theme

### Test ngay:

1. Mở ứng dụng: http://localhost:3000
2. Thử tìm kiếm:
   - "nha day" (không dấu)
   - "thap" (viết tắt)
   - "ho" (từ khóa ngắn)
   - "bao tang" (thiếu từ)

### Technical Details:

**Gemini Prompt:**
```
Người dùng đang tìm kiếm: "{query}"

Danh sách các địa danh có sẵn ở Đắk Lắk:
- Nhà đày Buôn Ma Thuột
- Tháp Nghinh Phong
- Hồ Lắk
- ... (29 địa danh)

Nhiệm vụ: Xác định địa danh nào người dùng muốn tìm
→ Trả về tên chính xác hoặc NONE
```

**Performance:**
- Direct match: ~50ms
- Gemini identification: ~1-2s
- Total: ~2-3s (bao gồm fetch description)
