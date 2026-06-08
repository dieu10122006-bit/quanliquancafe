# 🏗️ KIẾN TRÚC HỆ THỐNG
## Giai Đoạn 3B: System Architecture

---

## 1. KIẾN TRÚC TỔNG QUÁT

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER / CLIENT                         │
│  (HTML5 + CSS3 + JavaScript + Responsive Design)                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Interface Layer (UI)                                   │   │
│  │  - Login Page                                           │   │
│  │  - Dashboard                                            │   │
│  │  - Menu Page                                            │   │
│  │  - Order Management                                     │   │
│  │  - Payment Page                                         │   │
│  │  - Reports                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                │                                 │
│                                ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Logic Layer (JavaScript)                               │   │
│  │  - Form validation                                      │   │
│  │  - API calls (Fetch API)                               │   │
│  │  - Client-side calculations                            │   │
│  │  - DOM manipulation                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/REST
                       │ JSON
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER (Node.js)                      │
│                  (Express.js Framework)                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  API Routes & Controllers                               │   │
│  │  ├── /api/auth (Login, Register)                        │   │
│  │  ├── /api/products (Menu management)                    │   │
│  │  ├── /api/orders (Order management)                     │   │
│  │  ├── /api/payments (Payment processing)                 │   │
│  │  ├── /api/employees (Staff management)                  │   │
│  │  └── /api/reports (Statistics & reports)                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                │                                 │
│                                ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Business Logic Layer                                   │   │
│  │  - Authentication & JWT                                │   │
│  │  - Data validation                                     │   │
│  │  - Business calculations                              │   │
│  │  - Error handling                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                │                                 │
│                                ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Database Layer (Models)                                │   │
│  │  - User model                                           │   │
│  │  - Product model                                        │   │
│  │  - Order model                                          │   │
│  │  - Query optimization                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ MySQL Protocol
                       │ Port 3306
                       ▼
        ┌──────────────────────────────┐
        │   DATABASE (MySQL)           │
        │  cafe_management_system      │
        │                              │
        │  - Tables                    │
        │  - Indexes                   │
        │  - Triggers                  │
        │  - Views                     │
        └──────────────────────────────┘
```

---

## 2. MÔ HÌNH MVC (Model-View-Controller)

### **Model (Dữ liệu)**
Quản lý dữ liệu và logic liên quan đến database.

```javascript
// models/Product.js
class Product {
    static getAll() { /* ... */ }
    static getById(id) { /* ... */ }
    static create(data) { /* ... */ }
    static update(id, data) { /* ... */ }
    static delete(id) { /* ... */ }
}
```

### **View (Giao diện)**
Hiển thị dữ liệu cho người dùng (HTML, CSS, JavaScript client-side).

```html
<!-- pages/menu.html -->
<div id="product-list">
    <!-- Danh sách sản phẩm sẽ được render tại đây -->
</div>
<script src="../js/menu.js"></script>
```

### **Controller (Bộ điều khiển)**
Xử lý logic ứng dụng và kết nối Model với View.

```javascript
// controllers/productController.js
exports.getAll = (req, res) => {
    const products = Product.getAll();
    res.json(products);
}
```

---

## 3. CÁC THÀNH PHẦN CHÍNH

### **3.1 Frontend (Client-side)**
| Thành phần | Mô tả | Công nghệ |
|-----------|-------|----------|
| **Trang web** | Giao diện người dùng | HTML5 |
| **Styling** | Thiết kế giao diện | CSS3 |
| **Tương tác** | Xử lý sự kiện | JavaScript |
| **API Client** | Gọi API từ server | Fetch API |
| **LocalStorage** | Lưu token & session | Web API |

### **3.2 Backend (Server-side)**
| Thành phần | Mô tả | Công nghệ |
|-----------|-------|----------|
| **Server** | Xử lý request | Node.js + Express |
| **Routes** | Định tuyến API | Express Router |
| **Controllers** | Xử lý logic | JavaScript |
| **Models** | Quản lý dữ liệu | MySQL |
| **Middleware** | Xử lý trực gửi | CORS, Auth, Body Parser |

### **3.3 Database**
| Thành phần | Mô tả | Type |
|-----------|-------|------|
| **Tables** | Lưu dữ liệu | Relational |
| **Indexes** | Tối ưu query | B-tree |
| **Triggers** | Tự động cập nhật | Event-based |
| **Views** | Dữ liệu ảo | Virtual |

---

## 4. FLOW DỮ LIỆU (Data Flow)

### **Ví dụ: Tạo Đơn Hàng**

```
1. User Click "Tạo Đơn Hàng" (Frontend)
   ↓
2. JavaScript gửi HTTP POST request → /api/orders
   {
     "user_id": 2,
     "table_id": 1,
     "customer_name": "Anh Hùng",
     "items": [
       { "product_id": 1, "quantity": 2 }
     ]
   }
   ↓
3. Express Router nhận request → /api/orders
   ↓
4. OrderController.create() xử lý
   - Validate dữ liệu
   - Tính tổng tiền
   - Lưu vào database
   ↓
5. MySQL lưu order vào bảng ORDERS & ORDER_DETAILS
   ↓
6. Controller trả về response: 
   {
     "success": true,
     "order_id": 3,
     "message": "Tạo đơn hàng thành công"
   }
   ↓
7. Frontend nhận response
   - Hiển thị thông báo thành công
   - Cập nhật giao diện
   - Lưu order_id vào localStorage
   ↓
8. Redirect đến trang thanh toán
```

---

## 5. AUTHENTICATION & SECURITY

### **Quy Trình Đăng Nhập**

```
1. User nhập username & password (Frontend)
   ↓
2. JavaScript gửi POST /api/auth/login
   {
     "username": "staff_001",
     "password": "password123"
   }
   ↓
3. AuthController.login() xử lý
   - Tìm user trong DB
   - So sánh mật khẩu (bcrypt)
   - Tạo JWT Token
   ↓
4. Trả về token & user info
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": { "id": 2, "name": "Nhân viên 1", "role": "staff" }
   }
   ↓
5. Frontend lưu token vào localStorage
   localStorage.setItem('token', token)
   ↓
6. Tất cả request tiếp theo thêm Authorization header
   Authorization: Bearer <token>
```

### **Middleware Xác Thực**

```javascript
// middleware/auth.js
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
```

---

## 6. API ENDPOINTS

### **Authentication**
```
POST   /api/auth/login          - Đăng nhập
POST   /api/auth/register       - Đăng ký
POST   /api/auth/logout         - Đăng xuất
POST   /api/auth/refresh-token  - Làm mới token
```

### **Products**
```
GET    /api/products            - Lấy tất cả sản phẩm
GET    /api/products/:id        - Lấy sản phẩm theo ID
POST   /api/products            - Tạo sản phẩm (Admin)
PUT    /api/products/:id        - Cập nhật sản phẩm (Admin)
DELETE /api/products/:id        - Xóa sản phẩm (Admin)
GET    /api/categories          - Lấy tất cả danh mục
```

### **Orders**
```
GET    /api/orders              - Lấy tất cả đơn hàng
GET    /api/orders/:id          - Lấy chi tiết đơn hàng
POST   /api/orders              - Tạo đơn hàng
PUT    /api/orders/:id          - Cập nhật đơn hàng
DELETE /api/orders/:id          - Hủy đơn hàng
GET    /api/orders/:id/invoice  - Lấy hóa đơn
```

### **Payments**
```
POST   /api/payments/process    - Xử lý thanh toán
GET    /api/payments/:id        - Lấy thông tin thanh toán
POST   /api/payments/:id/refund - Hoàn tiền
```

### **Reports**
```
GET    /api/reports/revenue     - Doanh thu
GET    /api/reports/products    - Thống kê sản phẩm
GET    /api/reports/employees   - Thống kê nhân viên
GET    /api/reports/customers   - Thống kê khách hàng
```

---

## 7. CẤU TRÚC THƯ MỤC

```
CafeManagementSystem/
│
├── Frontend/
│   ├── css/
│   │   ├── style.css           - CSS chính
│   │   ├── responsive.css      - Responsive design
│   │   └── colors.css          - Color scheme
│   │
│   ├── js/
│   │   ├── api.js              - API wrapper
│   │   ├── auth.js             - Authentication logic
│   │   ├── menu.js             - Menu functions
│   │   ├── order.js            - Order functions
│   │   ├── payment.js          - Payment functions
│   │   ├── reports.js          - Reports functions
│   │   └── utils.js            - Utility functions
│   │
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── menu.html
│   │   ├── order.html
│   │   ├── payment.html
│   │   ├── employees.html
│   │   ├── reports.html
│   │   └── settings.html
│   │
│   └── images/
│
├── Backend/
│   ├── config/
│   │   ├── db.js               - MySQL connection
│   │   └── environment.js      - Environment variables
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   ├── employees.js
│   │   └── reports.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── employeeController.js
│   │   └── reportController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Employee.js
│   │   └── Payment.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── cors.js
│   │
│   ├── utils/
│   │   ├── calculator.js       - Tính tiền
│   │   ├── validator.js        - Kiểm tra dữ liệu
│   │   └── logger.js           - Log errors
│   │
│   ├── server.js               - Entry point
│   ├── package.json
│   └── .env                    - Environment variables
│
└── Database/
    ├── schema.sql              - Tạo bảng
    └── data.sql                - Dữ liệu mặc định
```

---

## 8. TECHNOLOGY STACK

| Layer | Technology | Version | Mục đích |
|-------|-----------|---------|---------|
| **Frontend** | HTML5 | 5 | Markup |
| | CSS3 | 3 | Styling |
| | JavaScript | ES6+ | Logic |
| | Fetch API | Browser | HTTP requests |
| **Backend** | Node.js | 14+ | Runtime |
| | Express.js | 4.x | Web framework |
| | JWT | - | Authentication |
| | bcrypt | 5.x | Password hashing |
| **Database** | MySQL | 5.7+ | RDBMS |
| | MySQL2 | 2.x | Node driver |
| **Tools** | Git | - | Version control |
| | Postman | - | API testing |
| | Visual Studio Code | - | IDE |

---

## 📄 Tiếp theo: Thiết Kế UI Mockups
Xem file: `04_UI_MOCKUPS.md`
