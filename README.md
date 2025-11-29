# 🏛️ GeoLookup - Khám phá Địa danh Việt Nam

Ứng dụng web tìm kiếm thông tin về địa danh Việt Nam và những thay đổi hành chính sau tái cấu trúc. Sử dụng AI Gemini để cung cấp thông tin chính xác và cập nhật về các địa danh trên khắp đất nước.

## ✨ Tính năng chính

- 🔍 **Tìm kiếm thông minh**: Sử dụng Google Gemini AI để tìm kiếm thông tin địa danh
- 📍 **Thông tin địa chỉ**: Hiển thị địa chỉ cũ và mới sau tái cấu trúc hành chính
- 🖼️ **Hình ảnh thực tế**: Tự động tìm và hiển thị hình ảnh từ internet
- 🌐 **Giao diện 3D**: Hình cầu 3D với 100+ địa danh nổi tiếng Việt Nam
- 🗺️ **Bản đồ Việt Nam**: Hiển thị bản đồ với các địa danh được đánh dấu
- 📱 **Responsive Design**: Tương thích với mọi thiết bị

## 🚀 Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **AI Integration**: Google Gemini API
- **Styling**: CSS3 với animations và 3D effects
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.x
- npm >= 8.x

### Các bước cài đặt

1. **Clone repository**
```bash
git clone git@github.com:ngtranlam/GeoLookup.git
cd GeoLookup
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình API Key**
- Tạo file `.env` trong thư mục gốc
- Thêm Google Gemini API key:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Chạy ứng dụng**
```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy lên Render

### Chuẩn bị deploy

1. **Push code lên Git repository** (GitHub, GitLab, hoặc Bitbucket)
2. **Đảm bảo file `.env` không được commit** (đã có trong `.gitignore`)

### Các bước deploy trên Render

1. **Truy cập [render.com](https://render.com)** và đăng ký/đăng nhập
2. **Tạo Static Site mới**:
   - Click **"New"** → **"Static Site"**
   - Connect với Git repository của bạn
3. **Cấu hình build**:
   - **Name**: `vietnam-landmarks` (hoặc tên bạn muốn)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
4. **Thêm Environment Variables**:
   - Key: `REACT_APP_GEMINI_API_KEY`
   - Value: API key Gemini của bạn
5. **Deploy**: Click **"Create Static Site"**

### Sau khi deploy thành công

- Ứng dụng sẽ có URL dạng: `https://your-app-name.onrender.com`
- Mỗi lần push code mới, Render sẽ tự động rebuild và deploy

## 🛠️ Scripts có sẵn

### `npm start`
Chạy ứng dụng ở chế độ development.\
Mở [http://localhost:3000](http://localhost:3000) để xem trong trình duyệt.

### `npm test`
Chạy test runner ở chế độ interactive watch.

### `npm run build`
Build ứng dụng cho production vào thư mục `build`.\
Tối ưu hóa và minify code để có hiệu suất tốt nhất.

### `npm run eject`
**Lưu ý: Đây là thao tác một chiều. Một khi `eject`, bạn không thể quay lại!**

## 📁 Cấu trúc dự án

```
vietnam-landmarks/
├── public/
│   ├── index.html
│   ├── logo.jpg
│   ├── vietnam-map.png
│   └── [các hình ảnh địa danh]
├── src/
│   ├── services/
│   │   └── geminiService.ts    # Tích hợp Gemini AI
│   ├── App.tsx                 # Component chính
│   ├── App.css                 # Styles chính
│   ├── index.tsx              # Entry point
│   └── index.css              # Global styles
├── package.json
└── README.md
```

## 🎯 Cách sử dụng

1. **Tìm kiếm địa danh**: Nhập tên địa danh vào ô tìm kiếm
2. **Khám phá hình cầu 3D**: Click vào các địa danh trên hình cầu xoay
3. **Xem thông tin chi tiết**: Click vào kết quả để xem popup với thông tin đầy đủ
4. **Khám phá địa danh gần bạn**: Xem các địa danh nổi tiếng tại Đắk Lắk

## 🔧 Tính năng kỹ thuật

### Gemini AI Integration
- Tự động tìm kiếm thông tin địa danh từ internet
- Xác thực URL hình ảnh với timeout 5 giây
- Retry mechanism với tối đa 3 lần thử
- Fallback data khi API không khả dụng

### 3D Sphere Animation
- CSS 3D transforms
- Smooth rotation animation
- Interactive landmark selection
- 100+ địa danh được tích hợp

### Responsive Design
- Mobile-first approach
- Flexible grid layout
- Touch-friendly interactions

## 🌟 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Để đóng góp:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phát triển bởi học sinh THCS Nguyễn Bình Khiêm.

## 👥 Tác giả

- **THCS Nguyễn Bình Khiêm** - *Học hiện đại – Sáng tương lai*

## 🙏 Lời cảm ơn

- Google Gemini AI cho việc cung cấp API tìm kiếm thông minh
- Cộng đồng React và TypeScript
- Các nguồn hình ảnh từ Wikipedia và các trang tin tức Việt Nam

## 📞 Liên hệ

Nếu bạn có câu hỏi hoặc đề xuất, vui lòng tạo issue trên GitHub repository này.

---

Made with ❤️ by Students of THCS Nguyễn Bình Khiêm
