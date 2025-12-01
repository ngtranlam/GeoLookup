// Test cases cho smart address processing

const testCases = [
  {
    name: "Bảo tàng Thế giới cà phê - Có số nhà và đường",
    geminiAddress: "Số 10 đường Nguyễn Du, Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Số 10 đường Nguyễn Du, Phường Tân Lập, tỉnh Đắk Lắk"
  },
  {
    name: "Quảng trường Đắk Lắk - Có quảng trường", 
    geminiAddress: "Quảng trường Đắk Lắk, Phường Ea Tam, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Quảng trường Đắk Lắk, Phường Ea Tam, tỉnh Đắk Lắk"
  },
  {
    name: "Công viên Ama Khê - Có công viên",
    geminiAddress: "Công viên Ama Khê, Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Công viên Ama Khê, Phường Tân Lập, tỉnh Đắk Lắk"
  },
  {
    name: "Test địa chỉ chỉ có đơn vị hành chính",
    geminiAddress: "Phường Tân Lập, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Phường Tân Lập, tỉnh Đắk Lắk"
  },
  {
    name: "Test địa chỉ đầy đủ với khu phố",
    geminiAddress: "Khu phố 1, Phường Ea Tam, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Khu phố 1, Phường Ea Tam, tỉnh Đắk Lắk"
  },
  {
    name: "Test với quốc lộ và xã",
    geminiAddress: "Quốc lộ 14, Xã Hòa Phú, huyện Buôn Đôn, tỉnh Đắk Lắk",
    expectedResult: "Quốc lộ 14, Xã Hòa Phú, tỉnh Đắk Lắk"
  },
  {
    name: "Test địa chỉ phức tạp với nhiều thông tin chi tiết",
    geminiAddress: "Số 123 đường Lý Thường Kiệt, Khu vực trung tâm, Phường Ea Tam, thành phố Buôn Ma Thuột, tỉnh Đắk Lắk",
    expectedResult: "Số 123 đường Lý Thường Kiệt, Khu vực trung tâm, Phường Ea Tam, tỉnh Đắk Lắk"
  }
];

console.log('🧪 Test cases for smart address processing:');
testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log(`   Input: ${testCase.geminiAddress}`);
  console.log(`   Expected: ${testCase.expectedResult}`);
});

console.log('\n📝 Features to test:');
console.log('✅ Giữ nguyên thông tin chi tiết trước cấp xã/phường');
console.log('✅ Chỉ cập nhật từ cấp xã/phường trở lên (xã, huyện, tỉnh)');
console.log('✅ Hỗ trợ: số nhà, đường, phố, quảng trường, công viên, khu vực');
console.log('✅ Logic dừng tại đơn vị hành chính (xã/phường)');
console.log('✅ Loại bỏ từ lặp và xử lý "tỉnh" thông minh');
