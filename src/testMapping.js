// Test script để kiểm tra mapping
const testData = {
  "Tháp Nghĩnh Phong": {
    expectedGeminiAddress: "Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedMapping: "Phường Tân Lập" // Theo file JSON
  },
  "Nhà đày Buôn Ma Thuột": {
    expectedGeminiAddress: "Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk", 
    expectedMapping: "Phường Tân Lập"
  },
  "Bảo tàng Thế giới cà phê": {
    expectedGeminiAddress: "Số 10 Nguyễn Du, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedMapping: "Phường Buôn Ma Thuột" // Có thể thuộc phường trung tâm
  }
};

console.log('🧪 Test cases for address mapping:', testData);

// Hướng dẫn test:
// 1. Mở Developer Console trong browser
// 2. Search "Tháp Nghĩnh Phong" 
// 3. Xem console logs để debug
// 4. Kiểm tra kết quả có đúng mapping không
