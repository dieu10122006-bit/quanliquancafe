# 📋 PHÂN TÍCH & THU THẬP YÊU CẦU
## Giai Đoạn 2: Requirements Analysis

---

## 1. YÊU CẦU CHỨC NĂNG (Functional Requirements)

### **FR1: Xác Thực & Phân Quyền**
| ID | Yêu cầu | Mô tả |
|---|---------|-------|
| FR1.1 | Đăng nhập | Người dùng nhập email/username & password để đăng nhập |
| FR1.2 | Đăng ký | Tạo tài khoản mới (cho admin/staff) |
| FR1.3 | Phân quyền | Hệ thống phân quyền theo role: Admin, Staff, Customer |
| FR1.4 | Quên mật khẩu | Cung cấp chức năng reset mật khẩu |
| FR1.5 | Đăng xuất | Thoát khỏi hệ thống an toàn |

### **FR2: Quản Lý Sản Phẩm**
| ID | Yêu cầu | Mô tả |
|---|---------|-------|
| FR2.1 | Xem menu | Hiển thị danh sách tất cả sản phẩm theo danh mục |
| FR2.2 | Thêm sản phẩm | Admin thêm sản phẩm mới (tên, giá, mô tả, hình ảnh) |
| FR2.3 | Sửa sản phẩm | Admin cập nhật thông tin sản phẩm |
| FR2.4 | Xóa sản phẩm | Admin xóa sản phẩm khỏi menu |
| FR2.5 | Tìm kiếm | Tìm sản phẩm theo tên/danh mục |
| FR2.6 | Lọc theo danh mục | Hiển thị sản phẩm theo danh mục được chọn |
| FR2.7 | Sắp xếp giá | Sắp xếp sản phẩm theo giá (tăng/giảm) |

### **FR3: Quản Lý Đơn Hàng**
| ID | Yêu cầu | Mô tả |
|---|---------|-------|
| FR3.1 | Tạo đơn hàng | Tạo đơn hàng mới, chọn bàn/vị trí |
| FR3.2 | Thêm sản phẩm vào đơn | Chọn sản phẩm & số lượng |
| FR3.3 | Sửa số lượng | Thay đổi số lượng sản phẩm |
| FR3.4 | Xóa sản phẩm | Xóa sản phẩm khỏi đơn hàng |
| FR3.5 | Xem chi tiết đơn | Hiển thị toàn bộ thông tin đơn hàng |
| FR3.6 | Cập nhật trạng thái | Thay đổi trạng thái: Pending → Confirmed → Delivered |
| FR3.7 | Hủy đơn hàng | Hủy đơn hàng chưa thanh toán |
| FR3.8 | Lịch sử đơn hàng | Xem tất cả đơn hàng cũ |

### **FR4: Thanh Toán**
| ID | Yêu cầu | Mô tả |
|---|---------|-------|
| FR4.1 | Tính tổng tiền | Tự động cộng tiền từ các sản phẩm |
| FR4.2 | Giảm giá | Áp dụng mã giảm giá hoặc % giảm |
| FR4.3 | Tính phí dịch vụ | Tính thêm phí dịch vụ (nếu cần) |
| FR4.4 | Chọn phương thức | Tiền mặt, Thẻ tín dụng, E-wallet |
| FR4.5 | Xác nhận thanh toán | Xác nhận khi tiền được nhận |
| FR4.6 | In hóa đơn | In hoặc lưu hóa đơn (PDF) |
| FR4.7 | Hoàn tiền | Xử lý hoàn tiền nếu khách đổi ý |

### **FR5: Quản Lý Nhân Viên**
| ID | Yêu cầu | Mô tả |
|---|---------|-------|
| FR5.1 | Xem danh sách nhân viên | Hiển thị toàn bộ nhân viên |
| FR5.2 | Thêm nhân viên | Tạo tài khoản nhân viên mới |
| FR5.3 | Sửa thông tin | Cập nhật thông tin nhân viên |
| FR5.4 | Xóa nhân viên | Xóa nhân viên khỏi hệ thống |
| FR5.5 | Quản lý ca làm việc | Gán ca làm việc cho nhân viên |
| FR5.6 | Lương & bonus | Tính lương cơ bản + bonus |

### **FR6: Báo Cáo & Thống Kê**
| ID | Yêu cầu | Mô tả |
|---|---------|-------|
| FR6.1 | Doanh thu ngày | Tổng doanh thu trong ngày |
| FR6.2 | Doanh thu theo tháng | Tổng doanh thu trong tháng |
| FR6.3 | Sản phẩm bán chạy | Top sản phẩm có doanh số cao |
| FR6.4 | Sản phẩm bán chậm | Bottom sản phẩm ít bán |
| FR6.5 | Thống kê khách | Số lượng khách theo ngày/tháng |
| FR6.6 | Xuất báo cáo | Export báo cáo dạng PDF/Excel |
| FR6.7 | Biểu đồ doanh thu | Hiển thị biểu đồ doanh thu |

### **FR7: Cài Đặt & Quản Lý**
| ID | Yêu cầu | Mô tả |
|---|---------|-------|
| FR7.1 | Thay đổi tên quán | Cập nhật tên quán cafe |
| FR7.2 | Quản lý tài khoản cá nhân | Đổi mật khẩu, cập nhật proflie |
| FR7.3 | Quản lý các bàn | Thêm/Sửa/Xóa số bàn |
| FR7.4 | Cấu hình giờ mở cửa | Thiết lập giờ mở cửa |

---

## 2. YÊU CẦU PHI CHỨC NĂNG (Non-Functional Requirements)

### **NFR1: Hiệu Suất (Performance)**
| ID | Yêu cầu | Tiêu chí |
|---|---------|---------|
| NFR1.1 | Tốc độ tải trang | < 3 giây |
| NFR1.2 | Tốc độ truy vấn DB | < 1 giây |
| NFR1.3 | Hỗ trợ 50+ người dùng đồng thời | Không bị lag |
| NFR1.4 | Tối ưu hóa ảnh | Hình ảnh được nén tốt |

### **NFR2: Bảo Mật (Security)**
| ID | Yêu cầu | Tiêu chí |
|---|---------|---------|
| NFR2.1 | Mã hóa mật khẩu | Dùng bcrypt/SHA256 |
| NFR2.2 | Xác thực JWT token | Bảo vệ API endpoints |
| NFR2.3 | Phân quyền role-based | Admin ≠ Staff ≠ Customer |
| NFR2.4 | SQL Injection prevention | Sử dụng parameterized queries |
| NFR2.5 | HTTPS (nếu online) | Mã hóa dữ liệu truyền tải |

### **NFR3: Khả Dùng (Usability)**
| ID | Yêu cầu | Tiêu chí |
|---|---------|---------|
| NFR3.1 | Giao diện trực quan | Dễ learn, dễ use |
| NFR3.2 | Responsive design | Chạy tốt trên Mobile/Tablet/Desktop |
| NFR3.3 | Hỗ trợ Tiếng Việt | Tất cả text bằng Tiếng Việt |
| NFR3.4 | Dark/Light mode (tùy chọn) | Có option đổi theme |

### **NFR4: Độ Tin Cậy (Reliability)**
| ID | Yêu cầu | Tiêu chí |
|---|---------|---------|
| NFR4.1 | Uptime | 99% (nếu online) |
| NFR4.2 | Backup dữ liệu | Backup hàng ngày |
| NFR4.3 | Error handling | Hiển thị lỗi rõ ràng |
| NFR4.4 | Không mất dữ liệu | Có transaction rollback |

### **NFR5: Khả Năng Bảo Trì (Maintainability)**
| ID | Yêu cầu | Tiêu chí |
|---|---------|---------|
| NFR5.1 | Code clean & modular | Dễ update & extend |
| NFR5.2 | Comment & documentation | Rõ ràng, dễ hiểu |
| NFR5.3 | Version control | Dùng Git/GitHub |
| NFR5.4 | API documentation | Swagger/Postman docs |

### **NFR6: Khả Năng Mở Rộng (Scalability)**
| ID | Yêu cầu | Tiêu chí |
|---|---------|---------|
| NFR6.1 | Dễ thêm feature mới | Architecture hỗ trợ |
| NFR6.2 | Database có thể mở rộng | Thiết kế cho growth |
| NFR6.3 | Có thể tích hợp API | Hỗ trợ webhook/API third-party |

---

## 3. DỮ LIỆU CHÍNH (Data Entities)

### **Entity 1: Users (Người dùng)**
```
Users
├── user_id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password (hashed)
├── full_name
├── phone
├── role (Admin, Staff, Customer)
├── status (Active, Inactive)
├── created_at
└── updated_at
```

### **Entity 2: Products (Sản phẩm)**
```
Products
├── product_id (PK)
├── product_name
├── category_id (FK)
├── description
├── price
├── cost
├── image_url
├── quantity_in_stock
├── status (Active, Inactive)
├── created_at
└── updated_at
```

### **Entity 3: Categories (Danh mục)**
```
Categories
├── category_id (PK)
├── category_name (UNIQUE)
├── description
├── image_url
├── display_order
└── status
```

### **Entity 4: Orders (Đơn hàng)**
```
Orders
├── order_id (PK)
├── user_id (FK) - Staff tạo
├── customer_name
├── table_number
├── order_date
├── status (Pending, Confirmed, Delivered, Paid, Cancelled)
├── total_amount
├── discount_percent
├── discount_amount
├── final_amount
├── payment_method (Cash, Card, E-wallet, Bank Transfer)
├── notes
└── created_at
```

### **Entity 5: OrderDetails (Chi tiết đơn hàng)**
```
OrderDetails
├── order_detail_id (PK)
├── order_id (FK)
├── product_id (FK)
├── quantity
├── unit_price
├── total_price
└── notes
```

### **Entity 6: Employees (Nhân viên)**
```
Employees
├── employee_id (PK)
├── user_id (FK)
├── employee_code
├── full_name
├── email
├── phone
├── position (Cook, Waiter, Manager, etc)
├── hire_date
├── salary
├── status (Working, On-leave, Resigned)
└── created_at
```

### **Entity 7: Tables (Bàn phục vụ)**
```
Tables
├── table_id (PK)
├── table_number (UNIQUE)
├── area (Hall, VIP, Private Room)
├── capacity (số người)
├── status (Available, Occupied, Reserved)
└── created_at
```

### **Entity 8: Shifts (Ca làm việc)**
```
Shifts
├── shift_id (PK)
├── shift_name (Sáng, Chiều, Tối)
├── start_time
├── end_time
└── employee_id (FK)
```

### **Entity 9: Invoices (Hóa đơn)**
```
Invoices
├── invoice_id (PK)
├── order_id (FK)
├── invoice_number (UNIQUE)
├── invoice_date
├── total_amount
├── tax_amount
├── final_amount
├── payment_status (Paid, Unpaid, Refunded)
└── notes
```

---

## 4. USE CASES CHÍNH

### **UC1: Quản lý Menu**
```
Actor: Admin
Precondition: Admin đã đăng nhập
Main Flow:
  1. Admin chọn "Quản lý Menu"
  2. Hệ thống hiển thị danh sách sản phẩm
  3. Admin chọn "Thêm/Sửa/Xóa"
  4. Hệ thống cập nhật dữ liệu
```

### **UC2: Tạo Đơn Hàng**
```
Actor: Staff
Precondition: Staff đã đăng nhập
Main Flow:
  1. Staff chọn "Tạo Đơn Hàng Mới"
  2. Chọn bàn/vị trí
  3. Thêm sản phẩm vào giỏ
  4. Xác nhận đơn hàng
  5. Hệ thống lưu đơn và cập nhật trạng thái
```

### **UC3: Thanh Toán**
```
Actor: Staff
Precondition: Có đơn hàng đã hoàn thành
Main Flow:
  1. Chọn đơn hàng cần thanh toán
  2. Xem chi tiết đơn hàng
  3. Tính tiền (áp dụng giảm giá)
  4. Chọn phương thức thanh toán
  5. Xác nhận & in hóa đơn
  6. Cập nhật trạng thái → Paid
```

### **UC4: Xem Báo Cáo**
```
Actor: Admin/Manager
Precondition: Admin đã đăng nhập
Main Flow:
  1. Admin chọn "Báo Cáo"
  2. Chọn loại: Doanh thu, Sản phẩm, Nhân viên, etc.
  3. Chọn khoảng thời gian
  4. Hệ thống hiển thị báo cáo + biểu đồ
  5. Có option Export PDF/Excel
```

---

## 5. CONSTRAINTS & ASSUMPTIONS

### **Constraints:**
- ✅ Hệ thống chạy trên localhost ban đầu
- ✅ Database MySQL 5.7+
- ✅ Browser: Chrome, Firefox, Edge (mới)
- ✅ Tối đa 50 người dùng đồng thời (version 1)
- ✅ Lưu trữ hình ảnh local (không dùng cloud)

### **Assumptions:**
- ✅ Nhân viên biết sử dụng máy tính cơ bản
- ✅ Admin sẽ setup và quản lý hệ thống
- ✅ Có web server (Apache hoặc Node.js)
- ✅ Khách hàng có thể dùng mobile browsing

---

## 📄 Tiếp theo: Giai Đoạn 3 - Thiết Kế Hệ Thống
Xem file: `03_DATABASE_DESIGN.md`
