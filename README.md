# ☕ HỆ THỐNG QUẢN LÝ QUÁN CAFE

## 📋 Giới Thiệu Dự Án

Hệ thống Quản Lý Quán Cafe là một ứng dụng web toàn diện giúp quản lý các hoạt động của quán cafe bao gồm: quản lý menu, tạo đơn hàng, thanh toán, quản lý nhân viên và báo cáo doanh thu.

**Dự án được xây dựng theo quy trình CNPM (Software Engineering) chuẩn với 6 giai đoạn:**
- ✅ Phase 1 - Planning (Lập Kế Hoạch)
- ✅ Phase 2 - Requirements (Phân Tích Yêu Cầu)
- ✅ Phase 3 - Design (Thiết Kế)
- ⏳ Phase 4 - Implementation (Lập Trình)
- ⏳ Phase 5 - Testing (Kiểm Thử)
- ⏳ Phase 6 - Finalization (Hoàn Thiện)

---

## 📁 CẤU TRÚC DỰ ÁN

```
quanliquancafe/
│
├── 📁 docs/                      # Tài liệu dự án và hướng dẫn
│   ├── 01_PROJECT_PLAN.md
│   ├── 02_REQUIREMENTS.md
│   ├── 03_DATABASE_DESIGN.md
│   ├── 04_SYSTEM_ARCHITECTURE.md
│   ├── 05_UI_MOCKUPS.md
│   ├── 06_IMPLEMENTATION_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── FINAL_REPORT.md
│   └── 📁 guides/                # Tài liệu hướng dẫn riêng
│       ├── action-plan-forgot-password.md
│       ├── forgot-password-complete-guide.md
│       ├── completion-summary.md
│       ├── file-index.md
│       ├── forgot-password-file-index.md
│       ├── forgot-password-verification.md
│       ├── project-summary.md
│       ├── quick-start-registration.md
│       ├── ready-to-use.md
│       ├── registration-complete.md
│       ├── registration-summary.md
│       └── setup-forgot-password.md
│
├── 📁 src/
│   ├── 📁 backend/                # Node.js backend
│   │   ├── app.js
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── .env
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── 📁 frontend/               # Frontend files
│   │   ├── index.html
│   │   ├── css/
│   │   ├── js/
│   │   ├── pages/
│   │   └── images/
│   └── 📁 database/               # Database scripts
│       ├── schema.sql
│       └── data.sql
│
├── 📁 tests/                     # Testing hướng dẫn & case
│   └── TESTING_GUIDE.md
│
├── .gitignore
├── LICENSE
├── package.json
└── README.md                     # This file
```

---

## 🎯 CHỨC NĂNG CHÍNH

### ✅ Hoàn Thành

- **Xác Thực & Phân Quyền**
  - Đăng nhập (Login) ✅
  - Phân quyền: Admin, Staff, Customer ✅
  - JWT Authentication ✅
  - Remember me ✅

- **Thiết Kế Hệ Thống**
  - Database schema (9 bảng) ✅
  - ERD (Entity Relationship Diagram) ✅
  - System architecture (MVC) ✅
  - API endpoints design ✅

- **Frontend Foundation**
  - CSS framework ✅
  - API wrapper ✅
  - Utility functions ✅
  - Responsive design ✅
  - Login UI ✅

### 🚀 Sắp Hoàn Thành

- **Menu Management**
  - Xem danh sách sản phẩm
  - Thêm/Sửa/Xóa sản phẩm (Admin)
  - Tìm kiếm & lọc
  - Hiển thị danh mục

- **Order Management**
  - Tạo đơn hàng mới
  - Chọn bàn/khách
  - Thêm sản phẩm vào đơn
  - Quản lý chi tiết đơn hàng

- **Payment Process**
  - Tính tiền tự động
  - Áp dụng giảm giá
  - Chọn phương thức thanh toán
  - In/lưu hóa đơn

- **Dashboard (Admin)**
  - Tổng quan doanh thu
  - Đơn hàng gần đây
  - Biểu đồ thống kê
  - Widgets tóm tắt

- **Reports & Analytics**
  - Doanh thu theo ngày/tháng
  - Top sản phẩm bán chạy
  - Thống kê nhân viên
  - Export báo cáo

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | HTML5 | 5 |
| | CSS3 | 3 |
| | JavaScript | ES6+ |
| | Fetch API | Browser |
| **Backend** | Node.js | 14+ |
| | Express.js | 4.x |
| | JWT | - |
| | bcrypt | 5.x |
| **Database** | MySQL | 5.7+ |
| | MySQL2 | 2.x |
| **Tools** | Git | - |
| | VS Code | - |

---

## 📊 CƠ SỞ DỮ LIỆU

### Database Schema

Tổng **9 bảng chính:**

1. **Users** - Người dùng (Admin, Staff, Customer)
2. **Categories** - Danh mục sản phẩm
3. **Products** - Sản phẩm menu
4. **Orders** - Đơn hàng
5. **OrderDetails** - Chi tiết đơn hàng
6. **Employees** - Nhân viên
7. **Tables** - Bàn phục vụ
8. **Shifts** - Ca làm việc
9. **Invoices** - Hóa đơn

### Mối Quan Hệ

```
Users → Orders → OrderDetails ← Products ← Categories
Users → Employees → Shifts
Orders → Invoices
```

**Normalization:** 3NF (Third Normal Form)

---

## 🎨 GIAO DIỆN (UI)

### Paginated Screens

1. **Login** - Đăng nhập ✅
2. **Dashboard** - Trang chủ (Admin)
3. **Menu** - Quản lý menu
4. **Create Order** - Tạo đơn hàng
5. **Payment** - Thanh toán
6. **Order History** - Lịch sử đơn
7. **Employees** - Quản lý nhân viên
8. **Reports** - Báo cáo
9. **Settings** - Cài đặt
10. **Profile** - Hồ sơ người dùng

### Design System

- **Color Palette:**
  - Primary: #8B4513 (Coffee Brown)
  - Secondary: #FF8C00 (Orange)
  - Success: #28A745 (Green)
  - Error: #DC3545 (Red)

- **Responsive Design:**
  - Desktop: 1200px+
  - Tablet: 768px - 1199px
  - Mobile: < 768px

---

## 🚀 CÁCH SỬ DỤNG

### 1. Setup Database

```bash
# Tạo database
mysql -u root -p < Database/schema.sql

# Thêm dữ liệu mặc định
mysql -u root -p cafe_management_system < Database/data.sql
```

### 2. Setup Backend (Node.js)

```bash
# Di chuyển vào thư mục Backend
cd Backend

# Cài đặt dependencies
npm install

# Tạo file .env
echo "DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cafe_management_system
JWT_SECRET=your_secret_key_here
PORT=3001" > .env

# Chạy server
npm start
```

### 3. Open Frontend

```bash
# Mở file login.html trong browser
# Hoặc sử dụng Live Server
# File: http://localhost:3000/Frontend/pages/login.html
```

### 4. Login Demo

- **Admin Account:**
  - Username: `admin`
  - Password: `password123`

- **Staff Account:**
  - Username: `staff_001`
  - Password: `password123`

---

## 📝 API ENDPOINTS

### Authentication

```
POST   /api/auth/login              - Đăng nhập
POST   /api/auth/logout             - Đăng xuất
POST   /api/auth/register           - Đăng ký
POST   /api/auth/refresh-token      - Làm mới token
```

### Products

```
GET    /api/products                - Lấy tất cả sản phẩm
GET    /api/products/:id            - Lấy sản phẩm theo ID
POST   /api/products                - Tạo sản phẩm (Admin)
PUT    /api/products/:id            - Cập nhật sản phẩm (Admin)
DELETE /api/products/:id            - Xóa sản phẩm (Admin)
GET    /api/categories              - Lấy danh mục
```

### Orders

```
GET    /api/orders                  - Lấy tất cả đơn hàng
GET    /api/orders/:id              - Lấy chi tiết đơn
POST   /api/orders                  - Tạo đơn hàng
PUT    /api/orders/:id              - Cập nhật đơn hàng
DELETE /api/orders/:id              - Hủy đơn hàng
GET    /api/orders/:id/invoice      - Lấy hóa đơn
```

### Payments

```
POST   /api/payments/process/:id    - Xử lý thanh toán
GET    /api/payments/:id            - Lấy thông tin thanh toán
POST   /api/payments/:id/refund     - Hoàn tiền
```

### Employees

```
GET    /api/employees               - Lấy tất cả nhân viên
GET    /api/employees/:id           - Lấy nhân viên theo ID
POST   /api/employees               - Thêm nhân viên (Admin)
PUT    /api/employees/:id           - Cập nhật nhân viên (Admin)
DELETE /api/employees/:id           - Xóa nhân viên (Admin)
```

### Reports

```
GET    /api/reports/revenue         - Doanh thu
GET    /api/reports/products        - Thống kê sản phẩm
GET    /api/reports/employees       - Thống kê nhân viên
GET    /api/reports/customers       - Thống kê khách hàng
```

---

## 📊 TIMELINE

| Phase | Task | Status | Days |
|-------|------|--------|------|
| 1 | Planning | ✅ Complete | 2 |
| 2 | Requirements | ✅ Complete | 2 |
| 3 | Design | ✅ Complete | 3 |
| 4 | Implementation | 🚀 In Progress | 10 |
| 5 | Testing | ⏳ Pending | 3 |
| 6 | Finalization | ⏳ Pending | 2 |

---

## 🧪 TESTING

### Test Categories

- **Login Process**
  - Valid credentials → Success
  - Invalid credentials → Error message
  - Expired token → Redirect to login

- **Menu Management**
  - Display products
  - Add/Edit/Delete products

- **Order Management**
  - Create order
  - Add products to order
  - Update order status

- **Payment**
  - Calculate total
  - Apply discount
  - Process payment

### Test Tools

- Postman (API testing)
- Browser DevTools (Frontend testing)
- MySQL Workbench (Database testing)

---

## 📋 NEXT STEPS

1. **Complete Frontend Pages** (Ongoing)
   - [ ] Dashboard.html
   - [ ] Menu.html
   - [ ] Order.html
   - [ ] Payment.html
   - [ ] Reports.html
   - [ ] Employees.html

2. **Build Backend APIs** (Upcoming)
   - [ ] Setup Express server
   - [ ] Create route handlers
   - [ ] Implement controllers
   - [ ] Add database queries

3. **Database Integration** (Upcoming)
   - [ ] Connect frontend to backend
   - [ ] Test API calls
   - [ ] Validate data flow

4. **Testing & QA** (Upcoming)
   - [ ] Write test cases
   - [ ] Execute manual tests
   - [ ] Bug fixing

5. **Documentation** (Upcoming)
   - [ ] API documentation
   - [ ] User manual
   - [ ] Installation guide

---

## 🤝 CONTRIBUTING

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📝 LICENSE

This project is created for educational purposes.

---

## 📧 SUPPORT

For issues and questions, please create an issue in the repository.

---

## 👨‍💻 AUTHOR

Developed as a Software Engineering (CNPM) course project.

Version: 1.0.0
Last Updated: 2026-04-15

---

## 🎓 LEARNING OUTCOMES

Students will learn:

✓ Software Development Lifecycle (SDLC)
✓ Database Design & Normalization
✓ MVC Architecture Pattern
✓ REST API Development
✓ Frontend Development (HTML, CSS, JS)
✓ Backend Development (Node.js, Express)
✓ MySQL Database Management
✓ Authentication & Security
✓ Testing & Quality Assurance
✓ Version Control (Git)
✓ Project Documentation

---

**Let's build something amazing! ☕**
