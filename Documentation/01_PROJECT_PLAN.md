# 📋 HỆ THỐNG QUẢN LÝ QUÁN CAFE
## Giai Đoạn 1: LẬP KẾ HOẠCH (Planning)

---

## 1. MÔ TẢ DỰ ÁN

**Tên dự án:** Hệ Thống Quản Lý Quán Cafe

**Mục tiêu chính:**
- Quản lý menu, sản phẩm và danh mục sản phẩm
- Tạo và quản lý đơn hàng online/tại quán
- Tính tiền và thanh toán
- Quản lý nhân viên và ca làm việc
- Báo cáo doanh thu và thống kê

**Đối tượng sử dụng:**
- Quản lý quán cafe (Admin)
- Nhân viên phục vụ (Staff)
- Khách hàng (Customer)

---

## 2. CÔNG NGHỆ SỬ DỤNG

| Thành phần | Công nghệ | Ghi chú |
|-----------|----------|--------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) | Responsive design |
| **Backend** | Node.js + Express.js | REST API |
| **Database** | MySQL | Relational DB |
| **Server** | Apache / Node.js | Local or Cloud |
| **Version Control** | Git + GitHub | Collaborative work |

---

## 3. DANH SÁCH CHỨC NĂNG CHÍNH

### 🔐 **1. Xác thực & Phân quyền**
- ✅ Đăng nhập (Login)
- ✅ Đăng ký (Register)
- ✅ Phân quyền: Admin, Staff, Customer

### 🍽️ **2. Quản Lý Menu**
- ✅ Xem danh sách sản phẩm
- ✅ Thêm/Sửa/Xóa sản phẩm
- ✅ Quản lý danh mục
- ✅ Thiết lập giá cả
- ✅ Quản lý hình ảnh sản phẩm

### 🛒 **3. Quản Lý Đơn Hàng**
- ✅ Tạo đơn hàng mới
- ✅ Chọn bàn/vị trí phục vụ
- ✅ Thêm/Xóa sản phẩm vào đơn
- ✅ Xem chi tiết đơn hàng
- ✅ Cập nhật trạng thái đơn (Pending, Confirmed, Delivered, Paid)

### 💰 **4. Thanh Toán**
- ✅ Tính tổng tiền
- ✅ Tính giảm giá
- ✅ Chọn phương thức thanh toán (Tiền mặt, Thẻ)
- ✅ In hóa đơn

### 👥 **5. Quản Lý Nhân Viên**
- ✅ Xem danh sách nhân viên
- ✅ Thêm/Sửa/Xóa nhân viên
- ✅ Quản lý ca làm việc
- ✅ Quản lý lương (cơ bản)

### 📊 **6. Báo Cáo & Thống Kê**
- ✅ Doanh thu theo ngày/tháng/năm
- ✅ Sản phẩm bán chạy
- ✅ Sản phẩm bán chậm
- ✅ Thống kê khách hàng
- ✅ Export báo cáo (PDF/CSV)

### ⚙️ **7. Cài Đặt Hệ Thống**
- ✅ Thay đổi tên quán
- ✅ Quản lý tài khoản
- ✅ Cài đặt bàn/vị trí phục vụ

---

## 4. CẤU TRÚC DỰ ÁN

```
CafeManagementSystem/
├── Documentation/
│   ├── 01_PROJECT_PLAN.md
│   ├── 02_REQUIREMENTS.md
│   ├── 03_DATABASE_DESIGN.md
│   ├── 04_SYSTEM_ARCHITECTURE.md
│   └── 05_UI_MOCKUPS.md
├── Database/
│   ├── schema.sql
│   ├── data.sql
│   └── triggers.sql
├── Frontend/
│   ├── css/
│   │   ├── style.css
│   │   ├── responsive.css
│   │   └── colors.css
│   ├── js/
│   │   ├── api.js
│   │   ├── menu.js
│   │   ├── order.js
│   │   ├── payment.js
│   │   └── utils.js
│   ├── images/
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── menu.html
│   │   ├── order.html
│   │   ├── payment.html
│   │   ├── employees.html
│   │   ├── reports.html
│   │   └── settings.html
│   └── index.html
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── employees.js
│   │   ├── auth.js
│   │   └── reports.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── employeeController.js
│   │   └── reportController.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Employee.js
│   │   └── User.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── cors.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── Testing/
│   ├── test_cases.xlsx
│   ├── test_results.md
│   └── bug_reports.md
└── README.md
```

---

## 5. TIMELINE (DỰ KIẾN)

| Giai đoạn | Công việc | Thời gian | Trạng thái |
|----------|----------|---------|----------|
| Phase 1 | Lập kế hoạch | 1-2 ngày | ⏳ |
| Phase 2 | Thu thập yêu cầu | 2-3 ngày | ⏳ |
| Phase 3 | Thiết kế hệ thống | 3-5 ngày | ⏳ |
| Phase 4 | Lập trình | 10-14 ngày | ⏳ |
| Phase 5 | Kiểm thử | 3-5 ngày | ⏳ |
| Phase 6 | Hoàn thiện | 2-3 ngày | ⏳ |

**Tổng cộng:** ~25-35 ngày làm việc

---

## 6. SPRINT PLANNING

### **Sprint 1 (5 ngày): Database & Setup**
- ✅ Thiết kế Database
- ✅ Tạo SQL scripts
- ✅ Setup Backend (Node.js + Express)
- ✅ Tạo API cơ bản

### **Sprint 2 (5 ngày): Menu & Products**
- ✅ Xây dựng trang Menu
- ✅ API quản lý sản phẩm
- ✅ CRUD sản phẩm
- ✅ Upload hình ảnh

### **Sprint 3 (5 ngày): Orders**
- ✅ Tạo trang Order
- ✅ API tạo đơn hàng
- ✅ Quản lý chi tiết đơn hàng
- ✅ Cập nhật trạng thái

### **Sprint 4 (5 ngày): Payment & Reports**
- ✅ Trang thanh toán
- ✅ Tính tiền & giảm giá
- ✅ Trang báo cáo
- ✅ Thống kê doanh thu

### **Sprint 5 (5 ngày): Employees & Admin**
- ✅ Quản lý nhân viên
- ✅ Quản lý ca làm việc
- ✅ Dashboard Admin
- ✅ Cài đặt hệ thống

### **Sprint 6 (5 ngày): Testing & Finalization**
- ✅ Viết test cases
- ✅ Testing hệ thống
- ✅ Sửa lỗi
- ✅ Hoàn thiện & Deploy

---

## 7. KỲ VỌNG KẾT QUẢ

✅ Hệ thống chạy được trên localhost
✅ Tất cả chức năng chính hoạt động
✅ Database lưu dữ liệu đúng
✅ Giao diện responsive (Mobile & Desktop)
✅ Test case đầy đủ
✅ Tài liệu hoàn chỉnh
✅ Deploy trên server (nếu có)

---

## 📄 Tiếp theo: Giai Đoạn 2 - Thu Thập & Phân Tích Yêu Cầu
Xem file: `02_REQUIREMENTS.md`
