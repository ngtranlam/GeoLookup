# 📚 TÀI LIỆU TỔNG QUAN DỰ ÁN

## 🎯 GIỚI THIỆU DỰ ÁN

**Tên dự án:** GeoLookup - Khám phá Địa danh & Nhạc sĩ Việt Nam

**Mục đích:** Ứng dụng web giáo dục phục vụ môn Giáo dục Địa phương lớp 9, giúp học sinh:
- Tìm hiểu về các địa danh nổi tiếng tại tỉnh Đắk Lắk và Việt Nam
- Tra cứu thông tin về địa chỉ cũ và mới sau tái cấu trúc hành chính
- Học tập thông qua hệ thống bài tập trắc nghiệm tự động
- Khám phá thông tin về các nhạc sĩ Việt Nam

**Đơn vị phát triển:** THCS Nguyễn Bình Khiêm

**Slogan:** "Học hiện đại – Sáng tương lai"

---

## 🎨 TÍNH NĂNG CHÍNH

### 1. 🔍 Tìm kiếm Địa danh thông minh
- **Công nghệ AI:** Tích hợp Google Gemini AI để tìm kiếm thông tin chính xác
- **Tìm kiếm đa dạng:** Hỗ trợ tìm theo tên địa danh, vị trí, địa chỉ
- **Kết quả chi tiết:** Hiển thị đầy đủ thông tin:
  - Tên địa danh
  - Địa chỉ cũ (trước tái cấu trúc)
  - Địa chỉ mới (sau tái cấu trúc)
  - Mô tả chi tiết về lịch sử, văn hóa
  - Hình ảnh thực tế từ internet
  - Tọa độ GPS (nếu có)

### 2. 🎵 Tìm kiếm Nhạc sĩ Việt Nam
- **Cơ sở dữ liệu phong phú:** Thông tin về các nhạc sĩ nổi tiếng
- **Thông tin đầy đủ:**
  - Tiểu sử và sự nghiệp
  - Các tác phẩm nổi tiếng
  - Thời kỳ hoạt động
  - Phong cách âm nhạc
  - Hình ảnh minh họa

### 3. 📝 Hệ thống Bài tập trắc nghiệm
- **Tự động sinh câu hỏi:** Sử dụng AI Gemini để tạo câu hỏi từ nội dung bài học
- **Nguồn nội dung:** 
  - 12 bài học về Giáo dục Địa phương Đắk Lắk
  - Nội dung từ file JSON được chuẩn bị sẵn
- **Tính năng:**
  - Câu hỏi trắc nghiệm 4 đáp án
  - Hiển thị kết quả chi tiết
  - Xem lại đáp án đúng/sai
  - Làm lại bài tập
  - Chọn bài học cụ thể để luyện tập

### 4. 🗺️ Khám phá Địa danh nổi tiếng Đắk Lắk
Hiển thị 6 địa danh tiêu biểu:
1. **Nhà đày Buôn Ma Thuột** - Di tích lịch sử
2. **Bảo tàng Thế giới cà phê** - Văn hóa cà phê
3. **Hồ Lắk** - Hồ nước ngọt lớn nhất tỉnh
4. **Đá Voi Mẹ – Đá Voi Cha** - Danh thắng thiên nhiên
5. **Buôn Đôn** - Làng văn hóa du lịch
6. **Thác Dray Nur – Dray Sáp** - Thác nước hùng vĩ

### 5. 🎨 Giao diện hiện đại
- **Thiết kế đẹp mắt:** Gradient màu sắc, hiệu ứng 3D
- **Responsive:** Tương thích mọi thiết bị (Desktop, Tablet, Mobile)
- **Animation mượt mà:** Hiệu ứng chuyển động, particles bay
- **UX thân thiện:** Dễ sử dụng, trực quan

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### Frontend Framework
- **React 19.2.0** - Thư viện UI hiện đại
- **TypeScript 4.9.5** - Ngôn ngữ lập trình có type safety
- **React Scripts 5.0.1** - Build tools và development server

### AI & API Integration
- **Google Gemini AI** - Tìm kiếm thông minh, sinh câu hỏi tự động
- **Gemini Pro Model** - Model AI mạnh mẽ cho xử lý ngôn ngữ tự nhiên

### Styling & UI
- **CSS3** - Styling với animations, transitions, 3D transforms
- **Custom CSS** - Không sử dụng framework CSS để tối ưu hiệu suất
- **Responsive Design** - Mobile-first approach

### Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction testing

### Development Tools
- **ESLint** - Code linting
- **Git** - Version control
- **npm** - Package manager

---

## 📁 CẤU TRÚC DỰ ÁN

```
vietnam-landmarks/
│
├── public/                          # Static files
│   ├── index.html                   # HTML template
│   ├── logo-nbk.png                 # Logo THCS Nguyễn Bình Khiêm
│   ├── source_content/              # Nội dung bài học (JSON)
│   └── [images]                     # Hình ảnh địa danh
│
├── src/                             # Source code
│   │
│   ├── components/                  # React Components
│   │   ├── AddressInfo.tsx          # Component hiển thị địa chỉ
│   │   ├── LandmarkDetailPopup.tsx  # Popup chi tiết địa danh
│   │   ├── LandmarkResult.tsx       # Card kết quả địa danh
│   │   ├── MusicianDetailPopup.tsx  # Popup chi tiết nhạc sĩ
│   │   ├── MusicianResult.tsx       # Card kết quả nhạc sĩ
│   │   └── Quiz.tsx                 # Component bài tập trắc nghiệm
│   │
│   ├── services/                    # Business Logic & API
│   │   ├── addressMappingService.ts      # Xử lý mapping địa chỉ
│   │   ├── enhancedGeminiService.ts      # Tích hợp Gemini AI cho địa danh
│   │   ├── geminiService.ts              # Base Gemini service
│   │   ├── landmarkDataService.ts        # Quản lý dữ liệu địa danh
│   │   ├── musicianDataService.ts        # Quản lý dữ liệu nhạc sĩ
│   │   ├── musicianGeminiService.ts      # Tích hợp Gemini AI cho nhạc sĩ
│   │   └── quizService.ts                # Xử lý logic bài tập
│   │
│   ├── App.tsx                      # Main component
│   ├── App.css                      # Main styles
│   ├── index.tsx                    # Entry point
│   ├── index.css                    # Global styles
│   └── react-app-env.d.ts          # TypeScript declarations
│
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── README.md                        # Hướng dẫn sử dụng
└── TAI_LIEU_TONG_QUAN.md           # Tài liệu này

```

---

## 🔧 CHI TIẾT KỸ THUẬT

### 1. Tích hợp Google Gemini AI

#### Service: `enhancedGeminiService.ts`
- **Chức năng:** Tìm kiếm thông tin địa danh
- **Model:** gemini-pro
- **Xử lý:**
  - Gửi prompt tìm kiếm đến Gemini
  - Parse JSON response
  - Validate URL hình ảnh
  - Retry mechanism (tối đa 3 lần)
  - Timeout 5 giây cho mỗi request

#### Service: `musicianGeminiService.ts`
- **Chức năng:** Tìm kiếm thông tin nhạc sĩ
- **Xử lý tương tự:** Search, parse, validate

#### Service: `quizService.ts`
- **Chức năng:** Sinh câu hỏi trắc nghiệm tự động
- **Input:** Nội dung bài học từ file JSON
- **Output:** 10 câu hỏi trắc nghiệm với 4 đáp án
- **Đặc điểm:**
  - Câu hỏi đa dạng về lịch sử, địa lý, văn hóa
  - Đáp án được shuffle ngẫu nhiên
  - Có giải thích cho đáp án đúng

### 2. Quản lý State với React Hooks

```typescript
// State chính trong App.tsx
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [selectedPlace, setSelectedPlace] = useState<any>(null);
const [showPopup, setShowPopup] = useState(false);
const [currentPage, setCurrentPage] = useState<'explore' | 'quiz'>('explore');
```

### 3. Responsive Design

#### Breakpoints
- **Desktop:** > 768px
- **Tablet:** 481px - 768px
- **Mobile:** < 480px

#### Techniques
- Flexbox layout
- CSS Grid cho gallery
- Media queries
- Touch-friendly buttons (min 44px)
- Optimized font sizes

### 4. Performance Optimization

- **Code Splitting:** Lazy loading components
- **Image Optimization:** Compressed images
- **CSS Optimization:** Minified trong production
- **Caching:** Browser caching cho static assets
- **Debouncing:** Cho search input (nếu cần)

---

## 📊 DỮ LIỆU VÀ NỘI DUNG

### 1. Dữ liệu Địa danh
**Nguồn:** 
- API Gemini (real-time)
- Fallback data trong code
- 6 địa danh cố định tại Đắk Lắk

**Format:**
```typescript
interface Landmark {
  name: string;
  oldAddress: string;
  newAddress: string;
  description: string;
  image: string;
  coordinates?: string;
}
```

### 2. Dữ liệu Nhạc sĩ
**Nguồn:** API Gemini

**Format:**
```typescript
interface Musician {
  name: string;
  biography: string;
  famousWorks: string[];
  period: string;
  style: string;
  image: string;
}
```

### 3. Nội dung Bài học
**Vị trí:** `/public/source_content/`

**Files:**
- `bai_1.json` đến `bai_12.json`
- Mỗi file chứa nội dung 1 bài học về Đắk Lắk

**Cấu trúc:**
```json
{
  "title": "Tên bài học",
  "content": "Nội dung chi tiết...",
  "sections": [...]
}
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY

### Yêu cầu hệ thống
- **Node.js:** >= 16.x
- **npm:** >= 8.x
- **Trình duyệt:** Chrome, Firefox, Safari, Edge (phiên bản mới nhất)

### Các bước cài đặt

#### 1. Clone repository
```bash
git clone git@github.com:ngtranlam/GeoLookup.git
cd GeoLookup
```

#### 2. Cài đặt dependencies
```bash
npm install
```

#### 3. Cấu hình API Key
Tạo file `.env` trong thư mục gốc:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

**Lấy API Key:**
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập với Google Account
3. Tạo API Key mới
4. Copy và paste vào file `.env`

#### 4. Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ mở tại: [http://localhost:3000](http://localhost:3000)

#### 5. Build cho Production
```bash
npm run build
```

Output trong thư mục `build/`

---

## 🌐 HƯỚNG DẪN DEPLOY

### Deploy lên Render.com (Miễn phí)

#### Bước 1: Chuẩn bị
1. Push code lên GitHub
2. Đảm bảo `.env` không bị commit

#### Bước 2: Tạo Static Site trên Render
1. Truy cập [render.com](https://render.com)
2. Đăng nhập/Đăng ký
3. Click **New** → **Static Site**
4. Connect với GitHub repository

#### Bước 3: Cấu hình
- **Name:** `vietnam-landmarks`
- **Build Command:** `npm run build`
- **Publish Directory:** `build`

#### Bước 4: Environment Variables
Thêm biến môi trường:
- **Key:** `REACT_APP_GEMINI_API_KEY`
- **Value:** [Your Gemini API Key]

#### Bước 5: Deploy
Click **Create Static Site** và đợi deploy hoàn tất.

**URL:** `https://vietnam-landmarks.onrender.com`

### Auto Deploy
Mỗi lần push code mới lên GitHub, Render sẽ tự động rebuild và deploy.

---

## 📱 HƯỚNG DẪN SỬ DỤNG

### Dành cho Học sinh

#### 1. Tìm kiếm Địa danh
1. Vào trang chủ
2. Nhập tên địa danh vào ô tìm kiếm
   - VD: "Nhà đày Buôn Ma Thuột", "Hồ Lắk"
3. Click nút Tìm kiếm hoặc Enter
4. Xem kết quả hiển thị
5. Click vào card để xem chi tiết

#### 2. Khám phá Địa danh gần bạn
1. Scroll xuống phần "Địa điểm gần bạn"
2. Click vào bất kỳ địa danh nào
3. Popup hiển thị thông tin chi tiết

#### 3. Làm Bài tập
1. Click tab **"Bài tập"** trên header
2. Click **"Bắt đầu làm bài"**
3. Chọn bài học muốn luyện tập (hoặc "Tất cả")
4. Đợi AI tạo câu hỏi
5. Trả lời 10 câu hỏi trắc nghiệm
6. Xem kết quả và đáp án đúng
7. Click **"Làm lại"** để thử lại

#### 4. Tìm kiếm Nhạc sĩ
1. Nhập tên nhạc sĩ vào ô tìm kiếm
   - VD: "Trịnh Công Sơn", "Văn Cao"
2. Xem thông tin tiểu sử và tác phẩm

### Dành cho Giáo viên

#### 1. Sử dụng trong giảng dạy
- Chiếu ứng dụng lên màn hình lớp
- Tìm kiếm địa danh để minh họa bài giảng
- Sử dụng hệ thống quiz để kiểm tra kiến thức

#### 2. Giao bài tập về nhà
- Yêu cầu học sinh tìm hiểu 5-10 địa danh
- Làm bài tập trắc nghiệm và chụp màn hình kết quả
- Viết báo cáo về 1 địa danh yêu thích

#### 3. Tùy chỉnh nội dung
- Thêm bài học mới vào `/public/source_content/`
- Format JSON theo mẫu có sẵn
- Hệ thống tự động tạo câu hỏi từ nội dung mới

---

## 🔐 BẢO MẬT VÀ QUYỀN RIÊNG TƯ

### API Key Security
- ✅ API Key được lưu trong file `.env`
- ✅ `.env` được thêm vào `.gitignore`
- ✅ Không commit API Key lên Git
- ✅ Sử dụng Environment Variables trên server

### Dữ liệu người dùng
- ❌ Không thu thập thông tin cá nhân
- ❌ Không lưu trữ lịch sử tìm kiếm
- ❌ Không sử dụng cookies tracking
- ✅ Tất cả xử lý trên client-side

---

## 🐛 XỬ LÝ LỖI VÀ TROUBLESHOOTING

### Lỗi thường gặp

#### 1. API Key không hoạt động
**Triệu chứng:** Tìm kiếm không trả về kết quả

**Giải pháp:**
- Kiểm tra API Key trong file `.env`
- Đảm bảo format: `REACT_APP_GEMINI_API_KEY=AIza...`
- Restart server: `npm start`
- Kiểm tra quota API trên Google AI Studio

#### 2. Hình ảnh không hiển thị
**Triệu chứng:** Ảnh bị lỗi hoặc không load

**Giải pháp:**
- Kiểm tra kết nối internet
- URL ảnh có thể bị chặn bởi CORS
- Hệ thống sẽ tự động fallback sang ảnh mặc định

#### 3. Quiz không tạo được câu hỏi
**Triệu chứng:** Loading mãi không xong

**Giải pháp:**
- Kiểm tra file JSON trong `/public/source_content/`
- Đảm bảo format JSON đúng
- Kiểm tra API Key Gemini
- Xem console log để debug

#### 4. Build lỗi
**Triệu chứng:** `npm run build` báo lỗi

**Giải pháp:**
```bash
# Xóa cache
rm -rf node_modules
rm package-lock.json

# Cài lại
npm install

# Build lại
npm run build
```

---

## 📈 PHÁT TRIỂN TƯƠNG LAI

### Tính năng đang lên kế hoạch

#### Phase 2 (Q1 2025)
- [ ] Thêm chế độ Dark Mode
- [ ] Lưu lịch sử tìm kiếm (Local Storage)
- [ ] Bookmark địa danh yêu thích
- [ ] Chia sẻ lên mạng xã hội
- [ ] Tải xuống thông tin dạng PDF

#### Phase 3 (Q2 2025)
- [ ] Tích hợp Google Maps
- [ ] Hiển thị route đến địa danh
- [ ] Thêm video YouTube về địa danh
- [ ] Hệ thống đánh giá và bình luận
- [ ] Gamification: Điểm số, huy hiệu

#### Phase 4 (Q3 2025)
- [ ] Mobile App (React Native)
- [ ] Offline mode
- [ ] AR view cho địa danh
- [ ] Multi-language support
- [ ] Admin dashboard

### Cải tiến kỹ thuật
- [ ] Migrate sang Next.js (SSR)
- [ ] Sử dụng Redux cho state management
- [ ] Implement Progressive Web App (PWA)
- [ ] Optimize images với WebP
- [ ] Add service worker cho caching

---

## 👥 ĐÓNG GÓP VÀ HỖ TRỢ

### Cách đóng góp

#### Báo lỗi (Bug Report)
1. Vào [GitHub Issues](https://github.com/ngtranlam/GeoLookup/issues)
2. Click **New Issue**
3. Mô tả chi tiết:
   - Lỗi gì?
   - Làm sao để tái hiện?
   - Screenshot (nếu có)
   - Thông tin trình duyệt/thiết bị

#### Đề xuất tính năng (Feature Request)
1. Tạo Issue mới với label `enhancement`
2. Mô tả tính năng mong muốn
3. Giải thích tại sao cần tính năng này

#### Đóng góp code
1. Fork repository
2. Tạo branch mới: `git checkout -b feature/TenTinhNang`
3. Commit changes: `git commit -m 'Thêm tính năng X'`
4. Push: `git push origin feature/TenTinhNang`
5. Tạo Pull Request

### Liên hệ
- **GitHub:** [ngtranlam/GeoLookup](https://github.com/ngtranlam/GeoLookup)
- **Email:** [Liên hệ qua GitHub Issues]

---

## 📜 GIẤY PHÉP VÀ BẢN QUYỀN

### Giấy phép
Dự án này được phát triển cho mục đích giáo dục tại THCS Nguyễn Bình Khiêm.

### Bản quyền nội dung
- **Nội dung bài học:** Thuộc Sở Giáo dục và Đào tạo Đắk Lắk
- **Hình ảnh địa danh:** Từ nguồn công khai (Wikipedia, báo chí)
- **Thông tin nhạc sĩ:** Từ nguồn công khai

### Sử dụng API
- **Google Gemini AI:** Tuân thủ [Terms of Service](https://ai.google.dev/terms)

---

## 🙏 LỜI CẢM ƠN

Dự án này không thể hoàn thành nếu không có sự hỗ trợ từ:

- **Google AI** - Cung cấp Gemini API miễn phí cho giáo dục
- **React Team** - Framework tuyệt vời
- **TypeScript Team** - Type safety cho JavaScript
- **Cộng đồng Open Source** - Các thư viện và công cụ hữu ích
- **Sở GD&ĐT Đắk Lắk** - Nội dung bài học
- **THCS Nguyễn Bình Khiêm** - Hỗ trợ và động viên
- **Các thầy cô giáo** - Góp ý và feedback
- **Các em học sinh** - Sử dụng và đóng góp ý kiến

---

## 📊 THỐNG KÊ DỰ ÁN

### Code Statistics
- **Tổng số files:** ~30 files
- **Tổng số dòng code:** ~5,000 lines
- **Components:** 6 components
- **Services:** 7 services
- **Languages:** TypeScript, CSS, HTML

### Features
- ✅ 2 chế độ: Khám phá & Bài tập
- ✅ Tìm kiếm địa danh với AI
- ✅ Tìm kiếm nhạc sĩ với AI
- ✅ Hệ thống quiz tự động
- ✅ 6 địa danh cố định Đắk Lắk
- ✅ 12 bài học Giáo dục Địa phương
- ✅ Responsive design
- ✅ Modern UI/UX

---

## 📝 CHANGELOG

### Version 0.1.0 (Current)
**Release Date:** December 2024

**Features:**
- ✨ Tìm kiếm địa danh với Gemini AI
- ✨ Tìm kiếm nhạc sĩ với Gemini AI
- ✨ Hệ thống quiz tự động
- ✨ 6 địa danh nổi tiếng Đắk Lắk
- ✨ Responsive design
- ✨ Modern UI với animations

**Technical:**
- ⚙️ React 19.2.0
- ⚙️ TypeScript 4.9.5
- ⚙️ Gemini AI Integration
- ⚙️ Custom CSS styling

---

## 🎓 HỌC TẬP TỪ DỰ ÁN

### Kiến thức học được

#### Cho học sinh
- **Lập trình web:** React, TypeScript
- **AI Integration:** Sử dụng API
- **UI/UX Design:** Thiết kế giao diện
- **Git & GitHub:** Version control
- **Problem Solving:** Debug và fix bugs

#### Cho giáo viên
- **Công nghệ giáo dục:** EdTech
- **Tích hợp AI:** Trong giảng dạy
- **Quản lý dự án:** Agile, Scrum
- **Open Source:** Đóng góp cộng đồng

### Tài nguyên học tập
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Google AI Documentation](https://ai.google.dev)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Made with ❤️ by Students of THCS Nguyễn Bình Khiêm**

*"Học hiện đại – Sáng tương lai"*

---

**Phiên bản tài liệu:** 1.0
**Ngày cập nhật:** Tháng 12, 2024
**Tác giả:** THCS Nguyễn Bình Khiêm
