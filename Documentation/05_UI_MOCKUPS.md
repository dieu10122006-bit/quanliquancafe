# 🎨 THIẾT KẾ GIAO DIỆN (UI MOCKUPS)
## Giai Đoạn 3C: UI/UX Design

---

## 1. DANH SÁCH CÁC MÀN HÌNH

| STT | Tên Màn Hình | Người Dùng | Mô Tả |
|-----|-------------|-----------|-------|
| 1 | Login | Tất cả | Đăng nhập vào hệ thống |
| 2 | Dashboard | Admin, Staff | Bảng điều khiển chính |
| 3 | Menu Management | Admin, Customer | Xem & quản lý menu |
| 4 | Create Order | Staff | Tạo đơn hàng mới |
| 5 | Order Details | Staff | Xem chi tiết đơn hàng |
| 6 | Payment | Staff | Xử lý thanh toán |
| 7 | Order History | Admin, Staff | Lịch sử đơn hàng |
| 8 | Employee Management | Admin | Quản lý nhân viên |
| 9 | Employee List | Admin | Danh sách nhân viên |
| 10 | Reports - Revenue | Admin | Thống kê doanh thu |
| 11 | Reports - Products | Admin | Thống kê sản phẩm |
| 12 | Reports - Charts | Admin | Biểu đồ doanh thu |
| 13 | Settings | Admin | Cài đặt hệ thống |
| 14 | User Profile | Tất cả | Thông tin tài khoản |
| 15 | 404 Not Found | Tất cả | Trang không tìm thấy |

---

## 2. CHI TIẾT TỪNG MÀN HÌNH

### **Màn Hình 1: LOGIN**
```
┌─────────────────────────────────────┐
│                                     │
│   CAFE MANAGEMENT SYSTEM            │
│   ☕ Quản Lý Quán Cafe              │
│                                     │
│   ┌───────────────────────────┐    │
│   │ 🔐 Đăng Nhập             │    │
│   ├───────────────────────────┤    │
│   │                           │    │
│   │ Username:                 │    │
│   │ [________________]        │    │
│   │                           │    │
│   │ Password:                 │    │
│   │ [________________]        │    │
│   │                           │    │
│   │ [ Keep me logged in ]     │    │
│   │                           │    │
│   │  [   ĐĂNG NHẬP   ]        │    │
│   │                           │    │
│   │ Quên mật khẩu? | Đăng ký  │    │
│   └───────────────────────────┘    │
│                                     │
│  © 2026 Cafe Management System      │
└─────────────────────────────────────┘
```

**Yếu tố:**
- Logo & tên quán
- Form nhập username & password
- Checkbox "Remember me"
- Nút "Đăng nhập"
- Link "Quên mật khẩu" & "Đăng ký"
- Xác thực input (required, min length)
- Flash messages (lỗi/thành công)

---

### **Màn Hình 2: DASHBOARD (Admin/Staff)**
```
┌──────────────────────────────────────────────────────────┐
│  ☕ CAFE MANAGEMENT SYSTEM  │ 🔔 👤 ⚙️ 🚪             │
├──────────────────────────────────────────────────────────┤
│  Dashboard / Trang Chủ                                   │
│                                                          │
│  ╔════════════════╗  ╔════════════════╗  ╔════════════╗ │
│  ║ 💰 Doanh Thu   ║  ║ 📦 Đơn Hàng     ║  ║ 👥 Nhân Viên║│
│  ║ Hôm Nay        ║  ║ Chưa Thanh Toán ║  ║ Đang Làm    ║│
│  ║ 2,500,000 VNĐ  ║  ║ 12 đơn          ║  ║ 3 người     ║│
│  ╚════════════════╝  ╚════════════════╝  ╚════════════╝ │
│                                                          │
│  ┌─ Hành Động Nhanh ─────────────────────────────────┐ │
│  │ [+ Đơn Hàng] [+ Sản Phẩm] [+ Nhân Viên]           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Đơn Hàng Gần Đây ────────────────────────────────┐ │
│  │ #   | Khách      | Bàn | Tiền      | Trạng Thái  │ │
│  │─────┼────────────┼─────┼───────────┼─────────────│ │
│  │ 125 | Anh Hùng   │ 5   │ 450,000   │ Đang phục vụ│ │
│  │ 124 | Chị Lan    │ 3   │ 350,000   │ Đã thanh toán│ │
│  │ 123 | Nam Phong  │ 1   │ 250,000   │ Đang phục vụ│ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📊 Biểu Đồ Doanh Thu (Tuần)                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Thứ Hai: ████ 1.5M  | Thứ Năm: ██████ 2.0M        │ │
│  │ Thứ Ba:  █████ 1.8M | Thứ Sáu:  ███████ 2.5M      │ │
│  │ Thứ Tư:  ████ 1.6M  | Thứ Bảy:  ████████ 3.0M    │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

### **Màn Hình 3: MENU/PRODUCTS**
```
┌──────────────────────────────────────────────────────────┐
│  ☕ CAFE MANAGEMENT   │ 🔔 👤 ⚙️ 🚪                   │
├──────────────────────────────────────────────────────────┤
│  Menu / Sản Phẩm                                         │
│                                                          │
│  🔍 Tìm Kiếm:  [______________]                          │
│  Danh Mục: [Cả Thể ▼]  Giá: [Tất Cả ▼]                  │
│  [Admin: + Thêm SP]                                      │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │ [☕ CAFE]            │  │ [🥤 TRÀ]            │    │
│  │ Cà Phê Đen Đá        │  │ Trà Sữa             │    │
│  │ 22,000 VNĐ           │  │ 32,000 VNĐ          │    │
│  │ ⭐ 4.5/5 (45 đánh giá) │  │ ⭐ 4.8/5 (32 đánh giá) │
│  │ [ Thêm Vào Giỏ ]    │  │ [ Thêm Vào Giỏ ]   │    │
│  │ [✏️ Sửa] [🗑 Xóa]   │  │ [✏️ Sửa] [🗑 Xóa]  │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │ [🍰 TRÁNG MIỆNG]     │  │ [🍟 ĐỒ ĂN]          │    │
│  │ Kem Vani             │  │ Khoai Tây Chiên      │    │
│  │ 25,000 VNĐ           │  │ 20,000 VNĐ          │    │
│  │ ⭐ 4.6/5 (50 đánh giá) │  │ ⭐ 4.3/5 (28 đánh giá) │
│  │ [ Thêm Vào Giỏ ]    │  │ [ Thêm Vào Giỏ ]   │    │
│  │ [✏️ Sửa] [🗑 Xóa]   │  │ [✏️ Sửa] [🗑 Xóa]  │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  Trang: [ < 1 2 3 > ]  Hiển thị 1-12 / 45               │
└──────────────────────────────────────────────────────────┘
```

---

### **Màn Hình 4: TẠO ĐƠN HÀNG (Create Order)**
```
┌──────────────────────────────────────────────────────────┐
│  ☕ CAFE MANAGEMENT   │ 🔔 👤 ⚙️ 🚪                   │
├──────────────────────────────────────────────────────────┤
│  Tạo Đơn Hàng                                            │
│                                                          │
│  ┌─ Thông Tin Đơn Hàng ──────────────────────────────┐ │
│  │ Bàn: [5 ▼]              Khách: [Anh Hùng      ]   │ │
│  │ Thời Gian: 14:30:45      Nhân viên: Nhân viên 1   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Thêm Sản Phẩm ───────────────────────────────────┐ │
│  │ Danh Mục: [Cà Phê ▼]                              │ │
│  │ Sản Phẩm: [Cà Phê Đen Đá ▼]                       │ │
│  │ Số Lượng: [2]  Giá: 22,000 VNĐ                    │ │
│  │ Ghi Chú: [Không mía, ít đá         ]              │ │
│  │ [+ Thêm]                                           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Danh Sách Sản Phẩm Đã Chọn (3 sản phẩm) ────────┐ │
│  │ # │ Sản Phẩm         │ SL │ Giá/CÁI │ Thành Tiền │ │
│  │───┼──────────────────┼────┼─────────┼───────────│ │
│  │ 1 │ Cà Phê Đen Đá    │ 2  │ 22,000  │ 44,000   │ │
│  │ 2 │ Trà Sữa          │ 1  │ 32,000  │ 32,000   │ │
│  │ 3 │ Kem Vani         │ 2  │ 25,000  │ 50,000   │ │
│  │   │                  │    │ --------│ --------│ │
│  │   │ TỔNG CỘNG        │ 5  │         │ 126,000 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [ Hủy đơn ]  [ Lưu & Thanh Toán ]  [ Lưu Tạm ]       │
└──────────────────────────────────────────────────────────┘
```

---

### **Màn Hình 5: THANH TOÁN (Payment)**
```
┌──────────────────────────────────────────────────────────┐
│  ☕ CAFE MANAGEMENT   │ 🔔 👤 ⚙️ 🚪                   │
├──────────────────────────────────────────────────────────┤
│  Thanh Toán - Đơn Hàng #125                              │
│                                                          │
│  ┌─ Chi Tiết Đơn Hàng ───────────────────────────────┐ │
│  │ Bàn: 5           Khách: Anh Hùng                  │ │
│  │ Thời Gian: 14:30    Nhân viên: Nhân viên 1       │ │
│  │                                                  │ │
│  │ STT │ Sản Phẩm      │ SL │ Giá      │ Thành Tiền│ │
│  │─────┼──────────────┼────┼──────────┼─────────│ │
│  │ 1 │ Cà Phê Đen Đá │ 2  │ 22,000   │ 44,000  │ │
│  │ 2 │ Trà Sữa       │ 1  │ 32,000   │ 32,000  │ │
│  │ 3 │ Kem Vani      │ 2  │ 25,000   │ 50,000  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Tính Tiền ───────────────────────────────────────┐ │
│  │ Tổng Tiền:           126,000 VNĐ                 │ │
│  │ Giảm Giá (%): [0 %]      → -0 VNĐ                │ │
│  │ Phí Dịch Vụ: [0 VNĐ]     → 0 VNĐ                 │ │
│  │ Thuế (10%):              → 12,600 VNĐ            │ │
│  │ ─────────────────────────────────────────────────│ │
│  │ TỔNG THANH TOÁN:         138,600 VNĐ             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Phương Thức Thanh Toán ──────────────────────────┐ │
│  │ ◉ Tiền Mặt                                        │ │
│  │ ○ Thẻ Tín Dụng                                    │ │
│  │ ○ E-Wallet                                        │ │
│  │ ○ Transfer NH                                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Ghi Chú: [___________________________]                  │
│                                                          │
│  [ Hủy ]  [ In Hóa Đơn ]  [ THANH TOÁN ]             │
└──────────────────────────────────────────────────────────┘
```

---

### **Màn Hình 6: QUẢN LÝ NHÂN VIÊN (Employees)**
```
┌──────────────────────────────────────────────────────────┐
│  ☕ CAFE MANAGEMENT   │ 🔔 👤 ⚙️ 🚪                   │
├──────────────────────────────────────────────────────────┤
│  Quản Lý Nhân Viên                                       │
│                                                          │
│  🔍 Tìm: [____________]  [+ Thêm Nhân Viên]             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Mã │ Tên      │ Chức Vụ  │ Lương   │ Trạng Thái │ │
│  │────┼──────────┼──────────┼─────────┼───────────│ │
│  │NV01│Nhân viên1│ Phục vụ  │ 5.0M    │ Làm việc  │ │
│  │    │          │          │         │ ✏️ 🗑️    │ │
│  │────┼──────────┼──────────┼─────────┼───────────│ │
│  │NV02│Nhân viên2│ Pha chế  │ 6.0M    │ Làm việc  │ │
│  │    │          │          │         │ ✏️ 🗑️    │ │
│  │────┼──────────┼──────────┼─────────┼───────────│ │
│  │NV03│Nhân viên3│ Thu ngân │ 5.5M    │ Đang phép │ │
│  │    │          │          │         │ ✏️ 🗑️    │ │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Trang: [ < 1 2 3 > ]  Hiển thị 1-3 / 10               │
└──────────────────────────────────────────────────────────┘
```

---

### **Màn Hình 7: BÁO CÁO DOANH THU (Revenue Reports)**
```
┌──────────────────────────────────────────────────────────┐
│  ☕ CAFE MANAGEMENT   │ 🔔 👤 ⚙️ 🚪                   │
├──────────────────────────────────────────────────────────┤
│  Báo Cáo Doanh Thu                                       │
│                                                          │
│  Khoảng Thời Gian: [Từ: 01/04/2026 ▼] [Đến: 15/04/2026 ▼]
│  [🔄 Refresh]  [📥 Export Excel]  [📄 Export PDF]        │
│                                                          │
│  ┌─ Tóm Tắt ──────────────────────────────────────────┐ │
│  │ 💰 Tổng Doanh Thu:  2,500,000 VNĐ                 │ │
│  │ 📦 Số Đơn Hàng:     125 đơn                        │ │
│  │ 👥 Số Khách:        150 khách                      │ │
│  │ 📊 Doanh Thu Trung Bình/Đơn: 20,000 VNĐ            │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📊 BIỂU ĐỒ DOANH THU THEO NGÀY                         │
│  │                                                    │ │
│  │                    ▄██                             │ │
│  │                    ███                             │ │
│  │  ▄██             ░███  ░                           │ │
│  │  ███    ▄██      ░███  ░                           │ │
│  │ ░███   ░███   ▄██ ███  ░                           │ │
│  │ ░███   ░███  ░███ ███  ░                           │ │
│  │ ░███   ░███  ░███ ███  ░  ▄█                       │ │
│  │ ░███   ░███  ░███ ███  ░  ███                      │ │
│  │ ░███ ░ ░███  ░███ ███  ░  ███                      │ │
│  │ ░███ ░ ░███  ░███ ███  ░ ░███                      │ │
│  │ ░█████ ░████ ░███ ████ ░ ░███                      │ │
│  │  ████  █████ ░███ ████ ░ ░███ ▄                    │ │
│  │  ──── ──────  ─── ───── ──────                      │ │
│  │   1/4   2/4    ...   14/4  15/4                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Top 10 Sản Phẩm Bán Chạy ────────────────────────┐ │
│  │ # │ Sản Phẩm       │ SL Bán │ Doanh Thu           │ │
│  │─────────────────────────────────────────────────│ │
│  │ 1 │Cà Phê Đen Đá   │ 250    │ 5,500,000 VNĐ      │ │
│  │ 2 │Trà Sữa         │ 180    │ 5,760,000 VNĐ      │ │
│  │ 3 │Cà Phê Sữa Đá   │ 120    │ 3,240,000 VNĐ      │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

### **Màn Hình 8: CÀI ĐẶT (Settings)**
```
┌──────────────────────────────────────────────────────────┐
│  ☕ CAFE MANAGEMENT   │ 🔔 👤 ⚙️ 🚪                   │
├──────────────────────────────────────────────────────────┤
│  Cài Đặt Hệ Thống                                        │
│                                                          │
│  📟 Thông Tin Quán Cafe                                  │
│  ├─ Tên Quán:        [Cafe Hoa Cà Phê      ]            │
│  ├─ Địa Chỉ:         [456 Đường ABC, Q.1   ]            │
│  ├─ SĐT:             [0123456789           ]            │
│  ├─ Email:           [cafe@example.com     ]            │
│  └─ [💾 Lưu]                                            │
│                                                          │
│  🕐 Giờ Mở Cửa / Đóng Cửa                               │
│  ├─ Giờ Mở: [06:00]  Giờ Đóng: [22:00]                 │
│  ├─ Ngày Đóng CỬ: [ ] Thứ 2  [ ] Thứ 3  [ ] Thứ 4     │
│  └─ [💾 Lưu]                                            │
│                                                          │
│  💰 Cài Đặt Thanh Toán                                   │
│  ├─ Phí Dịch Vụ: [0 %]                                 │
│  ├─ Thuế (VAT): [10 %]                                 │
│  └─ [💾 Lưu]                                            │
│                                                          │
│  🎨 Giao Diện Người Dùng                                │
│  ├─ Theme: ◉ Light  ○ Dark                             │
│  ├─ Ngôn Ngữ: [Tiếng Việt ▼]                           │
│  └─ [💾 Lưu]                                            │
│                                                          │
│  🔐 Cài Đặt Bảo Mật                                      │
│  ├─ Đổi Mật Khẩu:  [Đổi Mật Khẩu]                      │
│  ├─ Xóa Cache:     [Xóa]                               │
│  └─ Xuất Dữ Liệu:  [Xuất]                              │
│                                                          │
│  ⚠️ Vùng Nguy Hiểm                                       │
│  └─ [🔴 Xóa Tất Cả Dữ Liệu]                             │
└──────────────────────────────────────────────────────────┘
```

---

## 3. DESIGN SYSTEM

### **Color Palette**
```
Primary Colors:
- ☕ Coffee Brown: #8B4513
- Cream White: #FFF8DC
- Accent Orange: #FF8C00

Neutral Colors:
- Dark Gray: #333333
- Light Gray: #F5F5F5
- White: #FFFFFF
- Black: #000000

Status Colors:
- Success Green: #28A745
- Warning Orange: #FFC107
- Error Red: #DC3545
- Info Blue: #17A2B8
```

### **Typography**
```
Font: Segoe UI, Roboto, Arial
Header: 24-32px, Bold
Subheader: 18-20px, Semi-bold
Body: 14-16px, Regular
Small: 12px, Regular
```

### **Spacing**
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
```

### **Button Styles**
```
Primary:    Orange background, white text
Secondary:  Gray background, dark text
Success:    Green background, white text
Danger:     Red background, white text
Disabled:   Light gray, gray text
```

---

## 4. RESPONSIVE DESIGN

- **Desktop:** 1200px+ (full layout)
- **Tablet:** 768px - 1199px (adjusted layout)
- **Mobile:** < 768px (single column, stacked)

---

## 5. USER INTERACTION FLOWS

### **UC1: Tạo Đơn Hàng**
```
1. Staff Click Menu → Order
2. Chọn Bàn
3. Thêm Sản Phẩm (loop)
   - Chọn Danh Mục
   - Chọn Sản Phẩm
   - Điều Chỉnh Số Lượng
   - Thêm Ghi Chú (tùy)
4. Review Chi Tiết
5. Click "Thanh Toán" hoặc "Lưu Tạm"
6. Goto Thanh Toán
```

### **UC2: Thanh Toán**
```
1. Staff View Đơn Hàng Chi Tiết
2. Review Tổng Tiền
3. Nhập Giảm Giá (nếu có)
4. Xem Final Amount
5. Chọn Phương Thức
6. Click "Xác Nhận Thanh Toán"
7. In Hóa Đơn (tùy)
8. Success → Trở lại Dashboard
```

---

## 📄 Tiếp Theo: Bắt Đầu Xây Dựng Frontend

Danh sách html files cần tạo:
1. index.html → login.html
2. dashboard.html
3. menu.html
4. order.html
5. payment.html
6. employees.html
7. reports.html
8. settings.html
