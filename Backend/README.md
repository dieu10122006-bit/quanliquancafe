# 🚀 Cafe Management System - Backend

Backend API cho hệ thống quản lý quán cà phê.

## 📋 Yêu Cầu

- **Node.js**: v14+ 
- **MySQL**: v5.7+
- **npm**: v6+

## 🔧 Cài Đặt

### 1. Cài Đặt Dependencies

```bash
cd Backend
npm install
```

### 2. Cấu Hình Database

#### Tạo Database

```bash
# Mở MySQL
mysql -u root -p

# Chạy SQL script để tạo database
mysql> source ../Database/schema.sql
mysql> source ../Database/data.sql
mysql> exit
```

#### Cấu Hình Kết Nối (.env)

Chỉnh sửa file `.env`:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=cafe_management_system

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:8000
```

### 3. Chạy Server

**Development (with auto-reload)**:
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server sẽ chạy trên `http://localhost:5000`

## 📚 API Endpoints

### 🔐 Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Admin User",
    "role": "admin",
    "email": "admin@cafe.com"
  }
}
```

### 📦 Products

```http
# Get all products
GET /api/products

# Get product by ID
GET /api/products/1

# Get products by category
GET /api/products/category/1

# Create product (Admin only)
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_name": "Cà Phê Đen",
  "category_id": 1,
  "price": 25000,
  "description": "Cà phê nguyên chất"
}

# Update product (Admin only)
PUT /api/products/1
Authorization: Bearer {token}

# Delete product (Admin only)
DELETE /api/products/1
Authorization: Bearer {token}
```

### 🛒 Orders

```http
# Get all orders
GET /api/orders
Authorization: Bearer {token}

# Get order by ID
GET /api/orders/1
Authorization: Bearer {token}

# Create new order
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "customer_name": "Nguyễn Văn A",
  "table_number": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 25000
    }
  ]
}

# Update order status
PUT /api/orders/1/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}

# Delete order (Admin only)
DELETE /api/orders/1
Authorization: Bearer {token}
```

### 💳 Payments

```http
# Get invoice
GET /api/payments/1
Authorization: Bearer {token}

# Process payment
POST /api/payments/process
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 1,
  "payment_method": "cash",
  "amount_received": 60000,
  "notes": "Ghi chú thêm"
}

# Get all invoices
GET /api/payments/invoices
Authorization: Bearer {token}
```

### 📊 Reports

```http
# Get revenue report
GET /api/reports/revenue?fromDate=2026-04-01&toDate=2026-04-15
Authorization: Bearer {token}

# Get product report
GET /api/reports/products?fromDate=2026-04-01&toDate=2026-04-15
Authorization: Bearer {token}

# Get employee report
GET /api/reports/employees
Authorization: Bearer {token}

# Get daily revenue
GET /api/reports/daily-revenue?fromDate=2026-04-01&toDate=2026-04-15
Authorization: Bearer {token}
```

## 🧪 Test API (Postman)

### Demo Credentials

```
Admin:
- Username: admin
- Password: password123

Staff:
- Username: staff_001
- Password: password123
```

## 📁 Project Structure

```
Backend/
├── app.js                 # Main Express app
├── package.json          # Dependencies
├── .env                  # Configuration
├── config/
│   └── database.js       # MySQL connection
├── middleware/
│   └── auth.js           # JWT & role-based auth
├── routes/
│   ├── auth.js           # Auth endpoints
│   ├── products.js       # Product endpoints
│   ├── orders.js         # Order endpoints
│   ├── payments.js       # Payment endpoints
│   └── reports.js        # Report endpoints
└── controllers/
    ├── authController.js        # Auth logic
    ├── productController.js      # Product logic
    ├── orderController.js        # Order logic
    ├── paymentController.js      # Payment logic
    └── reportController.js       # Report logic
```

## 🔐 Authentication

Tất cả các endpoint (ngoài login) yêu cầu JWT token trong header:

```http
Authorization: Bearer {token}
```

## 👥 Roles & Permissions

| Endpoint | Admin | Staff | Customer |
|----------|-------|-------|----------|
| GET /products | ✓ | ✓ | ✓ |
| POST /products | ✓ | ✗ | ✗ |
| GET /orders | ✓ | ✓ | ✗ |
| POST /orders | ✓ | ✓ | ✗ |
| GET /reports | ✓ | ✗ | ✗ |

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**: 
- Kiểm tra MySQL đang chạy
- Kiểm tra DB_HOST, DB_USER, DB_PASSWORD trong .env

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:
- Thay đổi PORT trong .env
- Hoặc kill process đang dùng port 5000

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
- Kiểm tra CORS_ORIGIN trong .env
- Đảm bảo frontend URL trùng với CORS_ORIGIN

## 📝 License

MIT

## 👨‍💻 Developer

Cafe Management System v1.0.0
