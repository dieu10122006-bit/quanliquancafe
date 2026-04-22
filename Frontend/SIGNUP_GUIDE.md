# Hướng Dẫn Đăng Ký Tài Khoản - Registration System

## 📋 Tổng Quan
Hệ thống quản lý quán cafe bây giờ bao gồm một tính năng đăng ký tài khoản hoàn chỉnh với xác thực mạnh mẽ và kiểm tra trùng lặp.

---

## 🎯 Các Tính Năng Chính

### 1. **Giao Diện Đăng Ký**
- 📄 File: `Frontend/pages/signup.html`
- ✨ Thiết kế hiện đại với gradient màu nâu café
- 📱 Responsive design cho mọi thiết bị
- ⚠️ Validation thời gian thực trên frontend

### 2. **Xác Thực Mật Khẩu**
Mật khẩu phải đáp ứng các yêu cầu sau:
- ✓ Tối thiểu 6 ký tự
- ✓ Chứa ít nhất 1 chữ cái viết hoa (A-Z)
- ✓ Chứa ít nhất 1 chữ số (0-9)
- ✓ Xác nhận mật khẩu khớp

### 3. **Kiểm Tra Dữ Liệu**
| Trường | Yêu Cầu | Ghi Chú |
|-------|---------|--------|
| Họ và Tên | 3+ ký tự | Bắt buộc |
| Tên Đăng Nhập | 3-20 ký tự, chỉ [a-zA-Z0-9_] | Duy nhất, bắt buộc |
| Email | Định dạng email hợp lệ | Duy nhất, bắt buộc |
| Số Điện Thoại | 10-11 chữ số | Tùy chọn |
| Vai Trò | staff hoặc customer | Bắt buộc |
| Mật Khẩu | Xem mục "Xác Thực Mật Khẩu" | Bắt buộc |

---

## 🔧 Kiến Trúc Backend

### API Endpoints

#### 1. **Đăng Ký Tài Khoản**
```
POST /api/auth/signup
Content-Type: application/json

{
    "fullName": "Nguyễn Văn A",
    "username": "nguyenvana",
    "email": "user@example.com",
    "phone": "0912345678",
    "password": "SecurePass123",
    "role": "staff"
}

Response (201):
{
    "success": true,
    "message": "Đăng ký thành công",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "username": "nguyenvana",
        "email": "user@example.com",
        "name": "Nguyễn Văn A",
        "role": "staff",
        "phone": "0912345678"
    }
}

Response (400/409 - Error):
{
    "success": false,
    "message": "Chi tiết lỗi..."
}
```

#### 2. **Kiểm Tra Tên Đăng Nhập Có Sẵn**
```
GET /api/auth/check-username?username=nguyenvana

Response:
{
    "success": true,
    "available": true/false
}
```

#### 3. **Kiểm Tra Email Có Sẵn**
```
GET /api/auth/check-email?email=user@example.com

Response:
{
    "success": true,
    "available": true/false
}
```

### Controller: `Backend/controllers/signupController.js`

#### Method: `signup(req, res)`
- Validates input data
- Checks for duplicate username/email
- Creates new user in database
- Generates JWT token
- Returns user object and token

**Validation Steps:**
1. Check required fields
2. Validate username format
3. Validate email format
4. Validate password strength
5. Validate full name
6. Check phone format (if provided)
7. Validate role
8. Check username uniqueness
9. Check email uniqueness
10. Insert to database

#### Method: `checkUsername(req, res)`
- Returns availability status of username

#### Method: `checkEmail(req, res)`
- Returns availability status of email

### Routes: `Backend/routes/auth.js`

```javascript
// New routes added:
router.post('/signup', signupController.signup);
router.get('/check-username', signupController.checkUsername);
router.get('/check-email', signupController.checkEmail);
```

---

## 🎨 Frontend Integration

### API Methods: `Frontend/js/api.js`

```javascript
API.auth.signup(data)
// Usage: API.auth.signup({
//     fullName: "...",
//     username: "...",
//     email: "...",
//     phone: "...",
//     password: "...",
//     role: "staff"
// })

API.auth.checkUsername(username)
// Returns: { success: true, available: true/false }

API.auth.checkEmail(email)
// Returns: { success: true, available: true/false }
```

### Form Handler: `Frontend/pages/signup.html`

**SignupForm Object:**
- `init()` - Initialize form event listeners
- `setupEventListeners()` - Attach events
- `validatePasswordRequirements(password)` - Check password strength
- `validateField(field)` - Validate single field
- `validateForm()` - Validate entire form
- `handleSubmit()` - Process form submission
- `showAlert(message, type)` - Display alerts

**Features:**
- ✅ Real-time password strength indicator
- ✅ Field validation on blur
- ✅ Error messages for each field
- ✅ Loading spinner during submission
- ✅ Automatic redirect after successful signup

---

## 🗄️ Database

### Users Table Structure
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'staff', 'customer') DEFAULT 'staff',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🚀 Cách Sử Dụng

### 1. **Truy Cập Trang Đăng Ký**
- URL: `http://localhost:3000/pages/signup.html`
- Hoặc click vào link "Đăng Ký Ngay" từ trang login

### 2. **Điền Thông Tin**
- Nhập họ và tên (3+ ký tự)
- Chọn tên đăng nhập (3-20 ký tự)
- Nhập email hợp lệ
- Nhập số điện thoại (tùy chọn)
- Chọn vai trò (Nhân Viên/Khách Hàng)
- Đặt mật khẩu đạt yêu cầu

### 3. **Xác Minh**
- Hệ thống kiểm tra yêu cầu mật khẩu
- Tất cả trường lỗi sẽ được đánh dấu
- Thông báo lỗi chi tiết sẽ hiển thị

### 4. **Gửi**
- Click "Đăng Ký Tài Khoản"
- Chờ xử lý (loading spinner)
- Sẽ tự động chuyển hướng sau khi thành công

---

## 🔐 Bảo Mật

### Các Biện Pháp Bảo Mật:
1. **Validation Frontend**: Kiểm tra trước khi gửi
2. **Validation Backend**: Kiểm tra lại trên server
3. **Constraint Database**: Unique index trên username và email
4. **JWT Token**: Tạo token sau khi đăng ký thành công
5. **Password Requirements**: Mật khẩu mạnh bắt buộc
6. **Duplicate Check**: Kiểm tra username/email trùng lặp

### Hệ Thống Vai Trò:
- **admin**: Quản trị viên (không thể tạo qua signup)
- **staff**: Nhân viên quán cafe
- **customer**: Khách hàng

---

## 📝 Lỗi & Xử Lý

### Error Messages

| Code | Status | Thông Báo |
|------|--------|-----------|
| 400 | Bad Request | Vui lòng điền đầy đủ thông tin bắt buộc |
| 400 | Validation Error | [Chi tiết lỗi validation] |
| 409 | Conflict | Tên đăng nhập đã được sử dụng |
| 409 | Conflict | Email đã được đăng ký |
| 500 | Server Error | Lỗi hệ thống, vui lòng thử lại sau |

---

## 🔄 Workflow

```
User Opens signup.html
         ↓
   Fill Form
         ↓
   Validate Frontend
         ↓
   Submit (POST /api/auth/signup)
         ↓
   Server Validates
         ↓
   Check Duplicates
         ↓
   Create User
         ↓
   Generate JWT Token
         ↓
   Return Response
         ↓
   Save Token + User
         ↓
   Redirect to Dashboard
```

---

## 📱 Responsive Design

- **Desktop** (≥768px): 2 cột (brand + form)
- **Tablet** (480px-767px): 1 cột, brand ẩn
- **Mobile** (<480px): Padding nhỏ hơn

---

## ⚙️ Cấu Hình

### Environment Variables (Backend)
```
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=...
DATABASE_NAME=cafe_management_system
```

### API Base URL (Frontend)
File: `Frontend/js/api.js`
```javascript
const API = {
    baseURL: 'http://localhost:5000/api'
}
```

---

## 🧪 Test Cases

### Valid Registration:
```json
{
    "fullName": "Nguyễn Văn A",
    "username": "nguyenvana123",
    "email": "nguyenvana@example.com",
    "phone": "0912345678",
    "password": "SecurePass123",
    "role": "staff"
}
```

### Invalid Cases:
- ❌ Username < 3 characters
- ❌ Email format invalid
- ❌ Password without uppercase
- ❌ Password without number
- ❌ Confirm password mismatch
- ❌ Duplicate username
- ❌ Duplicate email
- ❌ Invalid phone (not 10-11 digits)

---

## 🆘 Troubleshooting

### Problem: "Không thể kết nối API"
- ✓ Kiểm tra backend server đang chạy
- ✓ Kiểm tra baseURL trong `Frontend/js/api.js`
- ✓ Kiểm tra CORS settings

### Problem: "Email đã được đăng ký" (khi email là duy nhất)
- ✓ Kiểm tra database constraint
- ✓ Xóa bản ghi trùng nếu có
- ✓ Chạy lại migration

### Problem: Mật khẩu không được chấp nhận
- ✓ Kiểm tra yêu cầu: 6+ ký tự, 1 chữ hoa, 1 chữ số
- ✓ Xem indicator màn hình cho feedback

---

## 📚 Tệp Liên Quan

```
Frontend/
├── pages/signup.html          ← Giao diện đăng ký
├── js/
│   ├── api.js                 ← API methods
│   ├── auth.js                ← Auth logic
│   └── utils.js               ← Utility functions

Backend/
├── controllers/
│   └── signupController.js    ← Signup logic
├── routes/
│   └── auth.js                ← Auth routes
├── config/
│   └── database.js            ← Database config
└── middleware/
    └── auth.js                ← Authentication middleware

Database/
└── schema.sql                 ← Users table structure
```

---

## ✅ Checklist Deployment

- [ ] Database: `cafe_management_system` created
- [ ] Users table migrated
- [ ] Backend server running on port 5000
- [ ] Frontend served on correct port
- [ ] JWT_SECRET configured
- [ ] CORS enabled
- [ ] signup.html accessible
- [ ] signupController.js loaded
- [ ] API routes registered
- [ ] Test signup flow

---

## 📞 Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Browser console (F12)
2. Network tab trong DevTools
3. Backend logs
4. Database logs

---

**Version**: 1.0  
**Last Updated**: 2026-04-17  
**Created for**: Café Management System
