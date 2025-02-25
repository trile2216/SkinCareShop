 // Dữ liệu thành phố và các state tương ứng
 const cityStateMapping = {
    "Hà Nội": [
      "Ba Đình", "Hoàn Kiếm", "Đống Đa", "Cầu Giấy", "Tây Hồ", "Hai Bà Trưng", "Hoàng Mai", 
      "Thanh Xuân", "Long Biên", "Hà Đông", "Nam Từ Liêm", "Bắc Từ Liêm", "Mê Linh", 
      "Sóc Sơn", "Đông Anh", "Thanh Trì", "Gia Lâm", "Thạch Thất", "Chương Mỹ", 
      "Ứng Hòa", "Mỹ Đức", "Phúc Thọ", "Đan Phượng", "Hoài Đức", "Thanh Oai", 
      "Ba Vì", "Quốc Oai"
    ],
    "Hồ Chí Minh": [
      "Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận 10", "Quận 12", "Tân Bình", 
      "Tân Phú", "Bình Tân", "Bình Thạnh", "Phú Nhuận", "Gò Vấp", "Thủ Đức", 
      "Hóc Môn", "Củ Chi", "Bình Chánh", "Nhà Bè", "Cần Giờ"
    ],
    "Đà Nẵng": [
      "Hải Châu", "Thanh Khê", "Liên Chiểu", "Ngũ Hành Sơn", "Cẩm Lệ", "Sơn Trà", "Hòa Vang", "Hoàng Sa"
    ],
    "Hải Phòng": [
      "Ngô Quyền", "Lê Chân", "Hồng Bàng", "Hải An", "Kiến An", "Dương Kinh", 
      "Thủy Nguyên", "An Dương", "An Lão", "Kiến Thụy", "Vĩnh Bảo", "Tiên Lãng", 
      "Cát Hải", "Bạch Long Vĩ"
    ],
    "Cần Thơ": [
      "Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn", "Thốt Nốt", 
      "Phong Điền", "Cờ Đỏ", "Thới Lai", "Vĩnh Thạnh"
    ],
    "Bắc Giang": [
      "Bắc Giang", "Yên Thế", "Lạng Giang", "Lục Nam", "Tân Yên", 
      "Hiệp Hòa", "Sơn Động", "Lục Ngạn", "Yên Dũng", "Việt Yên"
    ],
    "Bắc Kạn": [
      "Bắc Kạn", "Ba Bể", "Bạch Thông", "Chợ Đồn", "Chợ Mới", 
      "Na Rì", "Ngân Sơn", "Pác Nặm"
    ],
    "Bắc Ninh": [
      "Bắc Ninh", "Từ Sơn", "Tiên Du", "Quế Võ", "Yên Phong", 
      "Thuận Thành", "Gia Bình", "Lương Tài"
    ],
    "Bến Tre": [
      "Bến Tre", "Châu Thành", "Giồng Trôm", "Ba Tri", "Bình Đại", 
      "Mỏ Cày Bắc", "Mỏ Cày Nam", "Thạnh Phú"
    ],
    "Bình Dương": [
      "Thủ Dầu Một", "Thuận An", "Dĩ An", "Bến Cát", "Tân Uyên", 
      "Bàu Bàng", "Dầu Tiếng", "Phú Giáo", "Bắc Tân Uyên"
    ],
    "Bình Định": [
      "Quy Nhơn", "An Nhơn", "Hoài Nhơn", "Tuy Phước", "Phù Mỹ", 
      "Phù Cát", "Hoài Ân", "Vân Canh", "Vĩnh Thạnh", "Tây Sơn", "An Lão"
    ],
    "Bình Phước": [
      "Đồng Xoài", "Phước Long", "Bình Long", "Chơn Thành", "Bù Đăng", 
      "Bù Đốp", "Bù Gia Mập", "Hớn Quản", "Lộc Ninh", "Phú Riềng"
    ],
    "Bình Thuận": [
      "Phan Thiết", "La Gi", "Bắc Bình", "Đức Linh", "Hàm Tân", 
      "Hàm Thuận Bắc", "Hàm Thuận Nam", "Phú Quý", "Tánh Linh", "Tuy Phong"
    ],
    "Cà Mau": [
      "Cà Mau", "Cái Nước", "Đầm Dơi", "Năm Căn", "Ngọc Hiển", 
      "Phú Tân", "Thới Bình", "Trần Văn Thời", "U Minh"
    ],
    "Cao Bằng": [
      "Cao Bằng", "Bảo Lạc", "Bảo Lâm", "Hạ Lang", "Hà Quảng", 
      "Hòa An", "Nguyên Bình", "Phục Hòa", "Quảng Hòa", "Thạch An", "Trùng Khánh"
    ],
    "Đắk Lắk": [
      "Buôn Ma Thuột", "Buôn Hồ", "Ea H'leo", "Ea Kar", "Ea Súp", 
      "Krông Ana", "Krông Bông", "Krông Buk", "Krông Năng", "Krông Pắk", 
      "Lắk", "M'Đrắk", "Cư Kuin"
    ],
    "Đắk Nông": [
      "Gia Nghĩa", "Cư Jút", "Đắk Glong", "Đắk Mil", "Đắk R'Lấp", 
      "Đắk Song", "Krông Nô", "Tuy Đức"
    ],
    "Điện Biên": [
      "Điện Biên Phủ", "Mường Lay", "Điện Biên", "Điện Biên Đông", 
      "Mường Ảng", "Mường Chà", "Mường Nhé", "Nậm Pồ", "Tủa Chùa", "Tuần Giáo"
    ],
    "Đồng Nai": [
      "Biên Hòa", "Long Khánh", "Nhơn Trạch", "Trảng Bom", "Cẩm Mỹ", 
      "Tân Phú", "Định Quán", "Thống Nhất", "Vĩnh Cửu", "Long Thành"
    ],
    "Đồng Tháp": [
      "Cao Lãnh", "Sa Đéc", "Hồng Ngự", "Châu Thành", "Lấp Vò", 
      "Lai Vung", "Tam Nông", "Tân Hồng", "Tháp Mười", "Thanh Bình"
    ],
  "Gia Lai": [
    "Pleiku", "An Khê", "Ayun Pa", "Chư Păh", "Chư Sê", "Chư Prông", 
    "Đăk Đoa", "Đăk Pơ", "Ia Grai", "Ia Pa", "Kbang", "Krông Chro", 
    "Mang Yang", "Phú Thiện"
  ],
  "Hà Giang": [
    "Hà Giang", "Bắc Mê", "Bắc Quang", "Đồng Văn", "Hoàng Su Phì", 
    "Mèo Vạc", "Quản Bạ", "Quang Bình", "Vị Xuyên", "Yên Minh"
  ],
  "Hà Nam": [
    "Phủ Lý", "Bình Lục", "Duy Tiên", "Kim Bảng", "Lý Nhân", "Thanh Liêm"
  ],
  "Hà Tĩnh": [
    "Hà Tĩnh", "Hồng Lĩnh", "Kỳ Anh", "Hương Sơn", "Can Lộc", 
    "Nghi Xuân", "Thạch Hà", "Cẩm Xuyên", "Lộc Hà", "Vũ Quang", "Hương Khê"
  ],
  "Hải Dương": [
    "Hải Dương", "Chí Linh", "Bình Giang", "Cẩm Giàng", "Gia Lộc", 
    "Kim Thành", "Kinh Môn", "Nam Sách", "Ninh Giang", "Thanh Hà", "Thanh Miện", "Tứ Kỳ"
  ],
  "Hậu Giang": [
    "Vị Thanh", "Ngã Bảy", "Châu Thành", "Châu Thành A", "Long Mỹ", 
    "Phụng Hiệp"
  ],
  "Hòa Bình": [
    "Hòa Bình", "Cao Phong", "Đà Bắc", "Kim Bôi", "Kỳ Sơn", 
    "Lạc Sơn", "Lạc Thủy", "Lương Sơn", "Mai Châu", "Tân Lạc", "Yên Thủy"
  ],
  "Hưng Yên": [
    "Hưng Yên", "Ân Thi", "Khoái Châu", "Kim Động", "Mỹ Hào", 
    "Phù Cừ", "Tiên Lữ", "Văn Giang", "Văn Lâm", "Yên Mỹ"
  ],
  "Khánh Hòa": [
    "Nha Trang", "Cam Ranh", "Ninh Hòa", "Diên Khánh", "Vạn Ninh", 
    "Khánh Sơn", "Khánh Vĩnh", "Trường Sa"
  ],
  "Kiên Giang": [
    "Rạch Giá", "Hà Tiên", "Phú Quốc", "An Biên", "An Minh", 
    "Châu Thành", "Giang Thành", "Giồng Riềng", "Gò Quao", "Hòn Đất", 
    "Kiên Hải", "Tân Hiệp", "U Minh Thượng", "Vĩnh Thuận"
  ],
  "Kon Tum": [
    "Kon Tum", "Đắk Hà", "Đắk Tô", "Ngọc Hồi", "Kon Plông", 
    "Kon Rẫy", "Sa Thầy", "Tu Mơ Rông", "Ia H'Drai"
  ],
  "Lai Châu": [
    "Lai Châu", "Mường Tè", "Phong Thổ", "Sìn Hồ", "Tam Đường", 
    "Tân Uyên", "Than Uyên", "Nậm Nhùn"
  ],
  "Lâm Đồng": [
    "Đà Lạt", "Bảo Lộc", "Bảo Lâm", "Cát Tiên", "Di Linh", 
    "Đạ Huoai", "Đạ Tẻh", "Đam Rông", "Đơn Dương", "Đức Trọng", "Lạc Dương"
  ],
  "Lạng Sơn": [
    "Lạng Sơn", "Bắc Sơn", "Bình Gia", "Cao Lộc", "Chi Lăng", 
    "Đình Lập", "Hữu Lũng", "Lộc Bình", "Tràng Định", "Văn Lãng", "Văn Quan"
  ],
  "Lào Cai": [
    "Lào Cai", "Bảo Thắng", "Bảo Yên", "Bát Xát", "Mường Khương", 
    "Si Ma Cai", "Văn Bàn", "Sa Pa"
  ],
  "Long An": [
    "Tân An", "Bến Lức", "Cần Đước", "Cần Giuộc", "Châu Thành", 
    "Đức Hòa", "Đức Huệ", "Mộc Hóa", "Tân Hưng", "Tân Thạnh", "Thạnh Hóa", "Vĩnh Hưng"
  ],
  "Nam Định": [
    "Nam Định", "Giao Thủy", "Hải Hậu", "Mỹ Lộc", "Nam Trực", 
    "Nghĩa Hưng", "Trực Ninh", "Vụ Bản", "Xuân Trường", "Ý Yên"
  ],
  "Nghệ An": [
    "Vinh", "Thái Hòa", "Cửa Lò", "Anh Sơn", "Con Cuông", 
    "Diễn Châu", "Đô Lương", "Hưng Nguyên", "Kỳ Sơn", "Nam Đàn", 
    "Nghi Lộc", "Quế Phong", "Quỳ Châu", "Quỳ Hợp", "Quỳnh Lưu", "Tân Kỳ", "Thanh Chương", "Tương Dương", "Yên Thành"
  ],
  "Ninh Bình": [
    "Ninh Bình", "Tam Điệp", "Gia Viễn", "Hoa Lư", "Kim Sơn", 
    "Nho Quan", "Yên Khánh", "Yên Mô"
  ],
  "Ninh Thuận": [
    "Phan Rang – Tháp Chàm", "Bác Ái", "Ninh Hải", "Ninh Phước", 
    "Ninh Sơn", "Thuận Bắc", "Thuận Nam"
  ]
 };

 export default cityStateMapping;