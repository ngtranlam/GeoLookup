// Test cases cho smart address processing

const testCases = [
  {
    name: "Bảo tàng Thế giới cà phê - Có số nhà và đường",
    geminiAddress: "Số 10 đường Nguyễn Du, Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Số 10 đường Nguyễn Du, Phường Tân Lập, tỉnh Đắk Lắk"
  },
  {
    name: "Nhà đày Buôn Ma Thuột - Có địa chỉ chi tiết", 
    geminiAddress: "Số 234 đường Lê Duẩn, Phường Ea Tam, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Số 234 đường Lê Duẩn, Phường Ea Tam, tỉnh Đắk Lắk"
  },
  {
    name: "Tháp Nghĩnh Phong - Có tên đường",
    geminiAddress: "Đường Trần Hưng Đạo, Xã Hòa Phú, tỉnh Đắk Lắk",
    expectedResult: "Đường Trần Hưng Đạo, Xã Hòa Phú, tỉnh Đắk Lắk"
  },
  {
    name: "Test địa chỉ không có số nhà",
    geminiAddress: "Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Phường Tân Lập, tỉnh Đắk Lắk"
  },
  {
    name: "Test địa chỉ đầy đủ với nhiều thông tin",
    geminiAddress: "Số 15 đường Nguyễn Tất Thành, Phường Ea Tam, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Số 15 đường Nguyễn Tất Thành, Phường Ea Tam, tỉnh Đắk Lắk"
  },
  {
    name: "Test với quốc lộ",
    geminiAddress: "Quốc lộ 14, Xã Hòa Phú, huyện Buôn Đôn, tỉnh Đắk Lắk",
    expectedResult: "Quốc lộ 14, Xã Hòa Phú, tỉnh Đắk Lắk"
  }
];

console.log('🧪 Test cases for smart address processing:');
testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log(`   Input: ${testCase.geminiAddress}`);
  console.log(`   Expected: ${testCase.expectedResult}`);
});

console.log('\n📝 Features to test:');
console.log('✅ Extract số nhà và tên đường chi tiết từ Gemini');
console.log('✅ Giữ nguyên số nhà/tên đường trong địa chỉ mới');
console.log('✅ Cập nhật đơn vị hành chính mới từ JSON');
console.log('✅ Loại bỏ từ lặp và xử lý "tỉnh"');
console.log('✅ Hỗ trợ nhiều loại đường: số nhà, đường, phố, quốc lộ');
