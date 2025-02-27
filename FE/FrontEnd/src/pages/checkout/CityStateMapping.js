 // Dữ liệu thành phố và các state tương ứng
 const cityStateMapping = {
  // 1
    "Hà Nội": {
      shippingFee: 10,
      states: [
        "Ba Đình", "Hoàn Kiếm", "Đống Đa", "Cầu Giấy", "Tây Hồ", "Hai Bà Trưng", "Hoàng Mai", 
        "Thanh Xuân", "Long Biên", "Hà Đông", "Nam Từ Liêm", "Bắc Từ Liêm", "Mê Linh", 
        "Sóc Sơn", "Đông Anh", "Thanh Trì", "Gia Lâm", "Thạch Thất", "Chương Mỹ", 
        "Ứng Hòa", "Mỹ Đức", "Phúc Thọ", "Đan Phượng", "Hoài Đức", "Thanh Oai", 
        "Ba Vì", "Quốc Oai"
      ]
    },

    // 2
    "Hồ Chí Minh":{
      shippingFee: 0,
      states: [
      "Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận 10", "Quận 12", "Tân Bình", 
      "Tân Phú", "Bình Tân", "Bình Thạnh", "Phú Nhuận", "Gò Vấp", "Thủ Đức", 
      "Hóc Môn", "Củ Chi", "Bình Chánh", "Nhà Bè", "Cần Giờ"
    ]},

    // 3
    "Đà Nẵng": {
      shippingFee: 5,
      states:[
      "Hải Châu", "Thanh Khê", "Liên Chiểu", "Ngũ Hành Sơn", "Cẩm Lệ", "Sơn Trà", "Hòa Vang", "Hoàng Sa"
    ]},

    // 4
    "Hải Phòng": {
      shippingFee: 5,
      states:[
      "Ngô Quyền", "Lê Chân", "Hồng Bàng", "Hải An", "Kiến An", "Dương Kinh", 
      "Thủy Nguyên", "An Dương", "An Lão", "Kiến Thụy", "Vĩnh Bảo", "Tiên Lãng", 
      "Cát Hải", "Bạch Long Vĩ"
    ]},

    // 5
    "Cần Thơ": {
      shippingFee: 5,
      states:[
      "Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn", "Thốt Nốt", 
      "Phong Điền", "Cờ Đỏ", "Thới Lai", "Vĩnh Thạnh"
    ]},

    // 6
    "Bắc Giang": {
      shippingFee: 5,
      states:[
      "Bắc Giang", "Yên Thế", "Lạng Giang", "Lục Nam", "Tân Yên", 
      "Hiệp Hòa", "Sơn Động", "Lục Ngạn", "Yên Dũng", "Việt Yên"
    ]},

    // 7
    "Bắc Kạn": {
      shippingFee: 5,
      states:[
      "Bắc Kạn", "Ba Bể", "Bạch Thông", "Chợ Đồn", "Chợ Mới", 
      "Na Rì", "Ngân Sơn", "Pác Nặm"
    ]},

    // 8
    "Bắc Ninh": {
      shippingFee: 5,
      states:[
      "Bắc Ninh", "Từ Sơn", "Tiên Du", "Quế Võ", "Yên Phong", 
      "Thuận Thành", "Gia Bình", "Lương Tài"
    ]},

    // 9
    "Bến Tre": {
      shippingFee: 5,
      states:[
      "Bến Tre", "Châu Thành", "Giồng Trôm", "Ba Tri", "Bình Đại", 
      "Mỏ Cày Bắc", "Mỏ Cày Nam", "Thạnh Phú"
    ]},

    // 10
    "Bình Dương": {
      shippingFee: 5,
      states:[
      "Thủ Dầu Một", "Thuận An", "Dĩ An", "Bến Cát", "Tân Uyên", 
      "Bàu Bàng", "Dầu Tiếng", "Phú Giáo", "Bắc Tân Uyên"
    ]},

    // 11
    "Bình Định": {
      shippingFee: 5,
      states:[
      "Quy Nhơn", "An Nhơn", "Hoài Nhơn", "Tuy Phước", "Phù Mỹ", 
      "Phù Cát", "Hoài Ân", "Vân Canh", "Vĩnh Thạnh", "Tây Sơn", "An Lão"
    ]},

    // 12
    "Bình Phước": {
      shippingFee: 5,
      states:[
      "Đồng Xoài", "Phước Long", "Bình Long", "Chơn Thành", "Bù Đăng", 
      "Bù Đốp", "Bù Gia Mập", "Hớn Quản", "Lộc Ninh", "Phú Riềng"
    ]},

    // 13
    "Bình Thuận": {
      shippingFee: 5,
      states:[
      "Phan Thiết", "La Gi", "Bắc Bình", "Đức Linh", "Hàm Tân", 
      "Hàm Thuận Bắc", "Hàm Thuận Nam", "Phú Quý", "Tánh Linh", "Tuy Phong"
    ]},

    // 14
    "Cà Mau": {
      shippingFee: 5,
      states:[
      "Cà Mau", "Cái Nước", "Đầm Dơi", "Năm Căn", "Ngọc Hiển", 
      "Phú Tân", "Thới Bình", "Trần Văn Thời", "U Minh"
    ]},

    // 15
    "Cao Bằng": {
      shippingFee: 5,
      states:[
      "Cao Bằng", "Bảo Lạc", "Bảo Lâm", "Hạ Lang", "Hà Quảng", 
      "Hòa An", "Nguyên Bình", "Phục Hòa", "Quảng Hòa", "Thạch An", "Trùng Khánh"
    ]},

    // 16
    "Đắk Lắk": {
      shippingFee: 5,
      states:[
      "Buôn Ma Thuột", "Buôn Hồ", "Ea H'leo", "Ea Kar", "Ea Súp", 
      "Krông Ana", "Krông Bông", "Krông Buk", "Krông Năng", "Krông Pắk", 
      "Lắk", "M'Đrắk", "Cư Kuin"
    ]},

    // 17
    "Đắk Nông": {
      shippingFee: 5,
      states:[
      "Gia Nghĩa", "Cư Jút", "Đắk Glong", "Đắk Mil", "Đắk R'Lấp", 
      "Đắk Song", "Krông Nô", "Tuy Đức"
    ]},

    // 18
    "Điện Biên": {
      shippingFee: 5,
      states:[
      "Điện Biên Phủ", "Mường Lay", "Điện Biên", "Điện Biên Đông", 
      "Mường Ảng", "Mường Chà", "Mường Nhé", "Nậm Pồ", "Tủa Chùa", "Tuần Giáo"
    ]},

    // 19
    "Đồng Nai": {
      shippingFee: 5,
      states:[
      "Biên Hòa", "Long Khánh", "Nhơn Trạch", "Trảng Bom", "Cẩm Mỹ", 
      "Tân Phú", "Định Quán", "Thống Nhất", "Vĩnh Cửu", "Long Thành"
    ]},

    // 20
    "Đồng Tháp": {
      shippingFee: 5,
      states:[
      "Cao Lãnh", "Sa Đéc", "Hồng Ngự", "Châu Thành", "Lấp Vò", 
      "Lai Vung", "Tam Nông", "Tân Hồng", "Tháp Mười", "Thanh Bình"
    ]},


    // 21
  "Gia Lai": {
    shippingFee: 5,
    states:[
    "Pleiku", "An Khê", "Ayun Pa", "Chư Păh", "Chư Sê", "Chư Prông", 
    "Đăk Đoa", "Đăk Pơ", "Ia Grai", "Ia Pa", "Kbang", "Krông Chro", 
    "Mang Yang", "Phú Thiện"
  ]},

  // 22
  "Hà Giang": {
    shippingFee: 5,
    states:[
    "Hà Giang", "Bắc Mê", "Bắc Quang", "Đồng Văn", "Hoàng Su Phì", 
    "Mèo Vạc", "Quản Bạ", "Quang Bình", "Vị Xuyên", "Yên Minh"
  ]},

  // 23
  "Hà Nam": {
    shippingFee: 5,
    states:[
    "Phủ Lý", "Bình Lục", "Duy Tiên", "Kim Bảng", "Lý Nhân", "Thanh Liêm"
  ]},

  // 24
  "Hà Tĩnh": {
    shippingFee: 5,
    states:[
    "Hà Tĩnh", "Hồng Lĩnh", "Kỳ Anh", "Hương Sơn", "Can Lộc", 
    "Nghi Xuân", "Thạch Hà", "Cẩm Xuyên", "Lộc Hà", "Vũ Quang", "Hương Khê"
  ]},
  
  // 25
  "Hải Dương": {
    shippingFee: 5,
    states:[
    "Hải Dương", "Chí Linh", "Bình Giang", "Cẩm Giàng", "Gia Lộc", 
    "Kim Thành", "Kinh Môn", "Nam Sách", "Ninh Giang", "Thanh Hà", "Thanh Miện", "Tứ Kỳ"
  ]},

  // 26
  "Hậu Giang": {
    shippingFee: 5,
    states:[
    "Vị Thanh", "Ngã Bảy", "Châu Thành", "Châu Thành A", "Long Mỹ", 
    "Phụng Hiệp"
  ]},

  // 27
  "Hòa Bình": {
    shippingFee: 5,
    states:[
    "Hòa Bình", "Cao Phong", "Đà Bắc", "Kim Bôi", "Kỳ Sơn", 
    "Lạc Sơn", "Lạc Thủy", "Lương Sơn", "Mai Châu", "Tân Lạc", "Yên Thủy"
  ]},

  // 28
  "Hưng Yên": {
    shippingFee: 5,
    states:[
    "Hưng Yên", "Ân Thi", "Khoái Châu", "Kim Động", "Mỹ Hào", 
    "Phù Cừ", "Tiên Lữ", "Văn Giang", "Văn Lâm", "Yên Mỹ"
  ]},

  // 29
  "Khánh Hòa": {
    shippingFee: 5,
    states:[
    "Nha Trang", "Cam Ranh", "Ninh Hòa", "Diên Khánh", "Vạn Ninh", 
    "Khánh Sơn", "Khánh Vĩnh", "Trường Sa"
  ]},

  // 30
  "Kiên Giang": {
    shippingFee: 5,
    states:[
    "Rạch Giá", "Hà Tiên", "Phú Quốc", "An Biên", "An Minh", 
    "Châu Thành", "Giang Thành", "Giồng Riềng", "Gò Quao", "Hòn Đất", 
    "Kiên Hải", "Tân Hiệp", "U Minh Thượng", "Vĩnh Thuận"
  ]},

  // 31
  "Kon Tum": {
    shippingFee: 5,
    states:[
    "Kon Tum", "Đắk Hà", "Đắk Tô", "Ngọc Hồi", "Kon Plông", 
    "Kon Rẫy", "Sa Thầy", "Tu Mơ Rông", "Ia H'Drai"
  ]},

  // 32
  "Lai Châu": {
    shippingFee: 5,
    states:[
    "Lai Châu", "Mường Tè", "Phong Thổ", "Sìn Hồ", "Tam Đường", 
    "Tân Uyên", "Than Uyên", "Nậm Nhùn"
  ]},

  // 33
  "Lâm Đồng": {
    shippingFee: 5,
    states:[
    "Đà Lạt", "Bảo Lộc", "Bảo Lâm", "Cát Tiên", "Di Linh", 
    "Đạ Huoai", "Đạ Tẻh", "Đam Rông", "Đơn Dương", "Đức Trọng", "Lạc Dương"
  ]},

  // 34
  "Lạng Sơn": {
    shippingFee: 5,
    states:[
    "Lạng Sơn", "Bắc Sơn", "Bình Gia", "Cao Lộc", "Chi Lăng", 
    "Đình Lập", "Hữu Lũng", "Lộc Bình", "Tràng Định", "Văn Lãng", "Văn Quan"
  ]},

  // 35
  "Lào Cai": {
    shippingFee: 5,
    states:[
    "Lào Cai", "Bảo Thắng", "Bảo Yên", "Bát Xát", "Mường Khương", 
    "Si Ma Cai", "Văn Bàn", "Sa Pa"
  ]},

  // 36
  "Long An": {
    shippingFee: 5,
    states:[
    "Tân An", "Bến Lức", "Cần Đước", "Cần Giuộc", "Châu Thành", 
    "Đức Hòa", "Đức Huệ", "Mộc Hóa", "Tân Hưng", "Tân Thạnh", "Thạnh Hóa", "Vĩnh Hưng"
  ]},

  // 37
  "Nam Định": {
    shippingFee: 5,
    states:[
    "Nam Định", "Giao Thủy", "Hải Hậu", "Mỹ Lộc", "Nam Trực", 
    "Nghĩa Hưng", "Trực Ninh", "Vụ Bản", "Xuân Trường", "Ý Yên"
  ]},

  // 38
  "Nghệ An": {
    shippingFee: 5,
    states:[
    "Vinh", "Thái Hòa", "Cửa Lò", "Anh Sơn", "Con Cuông", 
    "Diễn Châu", "Đô Lương", "Hưng Nguyên", "Kỳ Sơn", "Nam Đàn", 
    "Nghi Lộc", "Quế Phong", "Quỳ Châu", "Quỳ Hợp", "Quỳnh Lưu", "Tân Kỳ", "Thanh Chương", "Tương Dương", "Yên Thành"
  ]},

  // 39
  "Ninh Bình": {
    shippingFee: 5,
    states:[
    "Ninh Bình", "Tam Điệp", "Gia Viễn", "Hoa Lư", "Kim Sơn", 
    "Nho Quan", "Yên Khánh", "Yên Mô"
  ]},

  // 40
  "Ninh Thuận": {
    shippingFee: 5,
    states:[
    "Phan Rang – Tháp Chàm", "Bác Ái", "Ninh Hải", "Ninh Phước", 
    "Ninh Sơn", "Thuận Bắc", "Thuận Nam"
  ]},

  // 41
  "Bạc Liêu": {
  "shippingFee": 5,
  "states": [
    "Bạc Liêu", "Đông Hải", "Giá Rai", 
    "Hòa Bình", "Hồng Dân", "Phước Long", "Vĩnh Lợi"
  ]},

  // 42
  "Bà Rịa – Vũng Tàu": {
  "shippingFee": 5,
  "states": [
    "Vũng Tàu", "Bà Rịa", "Châu Đức", 
    "Côn Đảo", "Đất Đỏ", "Long Điền", "Tân Thành", "Xuyên Mộc"
  ]
},

  // 43
  "An Giang": {
  "shippingFee": 5,
  "states": [
    "An Phú", "Châu Đốc", "Châu Phú", "Châu Thành", 
    "Chợ Mới", "Long Xuyên", "Phú Tân", "Tân Châu", 
    "Thoại Sơn", "Tịnh Biên", "Tri Tôn"
  ]
},

  // 44
  "Yên Bái": {
  "shippingFee": 5,
  "states": [
    "Lục Yên", "Mù Cang Chải", "Nghĩa Lộ", "Trạm Tấu", 
    "Trấn Yên", "Văn Chấn", "Văn Yên", "Yên Bình", "Yên Bái"
  ]
},

  // 45
  "Vĩnh Phúc": {
  "shippingFee": 5,
  "states": [
    "Bình Xuyên", "Lập Thạch", "Phúc Yên", "Sông Lô", 
    "Tam Đảo", "Tam Dương", "Vĩnh Tường", "Vĩnh Yên", "Yên Lạc"
  ]
},

  // 46
  "Vĩnh Long": {
  "shippingFee": 5,
  "states": [
    "Bình Minh", "Bình Tân", "Long Hồ", "Mang Thít", 
    "Tam Bình", "Trà Ôn", "Vĩnh Long", "Vũng Liêm"
  ]
},

  // 47
  "Tuyên Quang": {
  "shippingFee": 5,
  "states": [
    "Chiêm Hóa", "Hàm Yên", "Lâm Bình", "Na Hang", 
    "Sơn Dương", "Tuyên Quang", "Yên Sơn"
  ]
},

  // 48
  "Trà Vinh": {
  "shippingFee": 5,
  "states": [
    "Càng Long", "Cầu Kè", "Cầu Ngang", "Châu Thành", 
    "Duyên Hải", "Tiểu Cần", "Trà Cú", "Trà Vinh"
  ]
},

  // 49
  "Tiền Giang": {
  "shippingFee": 5,
  "states": [
    "Cái Bè", "Cai Lậy", "Châu Thành", "Gò Công", 
    "Gò Công Đông", "Gò Công Tây", "Mỹ Tho", "Tân Phú Đông", "Tân Phước"
  ]
},

  // 50
  "Thừa Thiên Huế": {
  "shippingFee": 5,
  "states": [
    "A Lưới", "Huế", "Hương Thủy", "Hương Trà", 
    "Nam Đông", "Phong Điền", "Phú Lộc", "Phú Vang", "Quảng Điền"
  ]
},

  // 51
  "Thanh Hóa": {
  "shippingFee": 5,
  "states": [
    "Ba Thước", "Bỉm Sơn", "Cẩm Thủy", "Đông Sơn", "Hà Trung", "Hậu Lộc", 
    "Hoằng Hóa", "Lang Chánh", "Mường Lát", "Nga Sơn", "Ngọc Lặc", "Như Thanh", 
    "Như Xuân", "Nông Cống", "Quan Hóa", "Quan Sơn", "Quảng Xương", "Sầm Sơn", 
    "Thạch Thành", "Thiệu Hóa", "Thọ Xuân", "Thường Xuân", "Tĩnh Gia", "Triệu Sơn", 
    "Vĩnh Lộc", "Yên Định", "Thanh Hóa"
  ]
},

  // 52
  "Thái Nguyên": {
  "shippingFee": 5,
  "states": [
    "Thái Nguyên", "Sông Công", "Phổ Yên", "Định Hóa", "Đại Từ", 
    "Đồng Hỷ", "Phú Bình", "Phú Lương", "Võ Nhai"
  ]
},

  // 53
  "Thái Bình": {
  "shippingFee": 5,
  "states": [
    "Thái Bình", "Đông Hưng", "Hưng Hà", "Kiến Xương", "Quỳnh Phụ", 
    "Thái Thụy", "Tiền Hải", "Vũ Thư"
  ]
},

  // 54
  "Tây Ninh": {
  "shippingFee": 5,
  "states": [
    "Tây Ninh", "Bến Cầu", "Châu Thành", "Dương Minh Châu", 
    "Gò Dầu", "Hòa Thành", "Tân Biên", "Tân Châu", "Trảng Bàng"
  ]
},

  // 55
  "Sơn La": {
  "shippingFee": 5,
  "states": [
    "Sơn La", "Bắc Yên", "Mai Sơn", "Mộc Châu", "Mường La", 
    "Phù Yên", "Quỳnh Nhai", "Sông Mã", "Sốp Cộp", "Thuận Châu", "Vân Hồ", "Yên Châu"
  ]
},

  // 56
  "Sóc Trăng": {
  "shippingFee": 5,
  "states": [
    "Sóc Trăng", "Châu Thành", "Cù Lao Dung", "Kế Sách", "Long Phú", 
    "Mỹ Tú", "Mỹ Xuyên", "Ngã Năm", "Thạnh Trị", "Trần Đề", "Vĩnh Châu"
  ]
},

  // 57
  "Quảng Trị": {
  "shippingFee": 5,
  "states": [
    "Đông Hà", "Quảng Trị", "Cam Lộ", "Cồn Cỏ", "Đa Krông", 
    "Gio Linh", "Hải Lăng", "Hướng Hóa", "Triệu Phong", "Vĩnh Linh"
  ]
},

  // 58
  "Quảng Ninh": {
    "shippingFee": 5,
    "states": [
      "Hạ Long", "Móng Cái", "Cẩm Phả", "Uông Bí", "Bình Liêu", 
      "Ba Chẽ", "Cô Tô", "Đầm Hà", "Đông Triều", "Hải Hà", 
      "Hoành Bồ", "Quảng Yên", "Tiên Yên", "Vân Đồn"
    ]
  },

  // 59
  "Quảng Ngãi": {
  "shippingFee": 5,
  "states": [
    "Quảng Ngãi", "Ba Tơ", "Bình Sơn", "Đức Phổ", "Lý Sơn", 
    "Minh Long", "Mộ Đức", "Nghĩa Hành", "Sơn Hà", "Sơn Tây", 
    "Sơn Tịnh", "Tây Trà", "Trà Bồng", "Tư Nghĩa"
  ]
},

  // 60
  "Quảng Nam": {
  "shippingFee": 5,
  "states": [
    "Tam Kỳ", "Hội An", "Bắc Trà My", "Đại Lộc", "Điện Bàn", 
    "Đông Giang", "Duy Xuyên", "Hiệp Đức", "Nam Giang", "Nam Trà My", 
    "Nông Sơn", "Núi Thành", "Phú Ninh", "Phước Sơn", "Quế Sơn", 
    "Tây Giang", "Thăng Bình", "Tiên Phước"
  ]
},

  // 61
  "Quảng Bình": {
  "shippingFee": 5,
  "states": [
    "Đồng Hới", "Ba Đồn", "Bố Trạch", "Lệ Thủy", "Minh Hóa", 
    "Quảng Ninh", "Quảng Trạch", "Tuyên Hóa"
  ]
},

  // 62
  "Phú Yên": {
  "shippingFee": 5,
  "states": [
    "Tuy Hòa", "Sông Cầu", "Đông Hòa", "Đồng Xuân", "Phú Hòa", 
    "Sơn Hòa", "Sông Hinh", "Tây Hòa", "Tuy An"
  ]
},

  // 63
  "Phú Thọ": {
  "shippingFee": 5,
  "states": [
    "Việt Trì", "Phú Thọ", "Cẩm Khê", "Đoan Hùng", "Hạ Hòa", 
    "Lâm Thao", "Tam Nông", "Tân Sơn", "Thanh Ba", "Thanh Sơn", 
    "Thanh Thủy", "Yên Lập"
  ]
},
 };

 export default cityStateMapping;