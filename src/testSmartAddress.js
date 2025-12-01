// Test cases cho smart address processing

const testCases = [
  {
    name: "Bảo tàng Thế giới cà phê",
    geminiAddress: "Số 10 Nguyễn Du, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Số 10 Nguyễn Du, Phường Buôn Ma Thuột, tỉnh Đắk Lắk"
  },
  {
    name: "Nhà đày Buôn Ma Thuột", 
    geminiAddress: "Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Phường Tân Lập, tỉnh Đắk Lắk"
  },
  {
    name: "Tháp Nghĩnh Phong",
    geminiAddress: "Xã Hòa Phú, tỉnh Đắk Lắk, tỉnh Đắk Lắk", // Có lặp từ
    expectedResult: "Xã Hòa Phú, tỉnh Đắk Lắk" // Đã loại bỏ lặp
  },
  {
    name: "Tháp Nghĩnh Phong - Test lặp từ liền kề",
    geminiAddress: "Xã Xã Hòa Phú, tỉnh Đắk Lắk", // Lặp từ "Xã Xã"
    expectedResult: "Xã Hòa Phú, tỉnh Đắk Lắk" // Đã loại bỏ lặp
  },
  {
    name: "Test lặp từ xa nhau",
    geminiAddress: "Phường Tân Lập, Phường Tân Lập, tỉnh Đắk Lắk", // Lặp cả cụm từ
    expectedResult: "Phường Tân Lập, tỉnh Đắk Lắk" // Đã loại bỏ lặp
  },
  {
    name: "Test nhiều loại lặp",
    geminiAddress: "Số Số 10, Phường Phường Tân Lập, tỉnh tỉnh Đắk Lắk", // Nhiều từ lặp
    expectedResult: "Số 10, Phường Tân Lập, tỉnh Đắk Lắk" // Đã loại bỏ tất cả lặp
  }
];

console.log('🧪 Test cases for smart address processing:');
testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log(`   Input: ${testCase.geminiAddress}`);
  console.log(`   Expected: ${testCase.expectedResult}`);
});

console.log('\n📝 Features to test:');
console.log('✅ Giữ nguyên tên đường/số nhà');
console.log('✅ Loại bỏ từ lặp');
console.log('✅ Cập nhật đơn vị hành chính mới');
console.log('✅ Xử lý "tỉnh" không bị lặp');
