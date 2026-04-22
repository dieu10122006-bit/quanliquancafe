# 📝 Hướng Dẫn & Tóm Tắt Phần Đăng Ký Tài Khoản

## ✅ Hoàn Thành - Phần Đăng Ký Đã Được Tạo

Phần đăng ký tài khoản hoàn chỉnh đã được tạo cho hệ thống quản lý quán cafe của bạn!

---

## 📁 Các Tệp Được Tạo/Cập Nhật

### Frontend (Giao Diện)

| Tệp | Mô Tả |
|-----|-------|
| `Frontend/pages/signup.html` | **Trang Đăng Ký Chính** - Giao diện đẹp, responsive, validation thời gian thực |
| `Frontend/pages/login.html` | **Cập Nhật** - Thêm link "Đăng Ký Ngay" để dễ dàng chuyển hướng |
| `Frontend/js/api.js` | **Cập Nhật** - Thêm methods: `signup()`, `checkUsername()`, `checkEmail()` |

### Backend (API)

| Tệp | Mô Tả |
|-----|-------|
| `Backend/controllers/signupController.js` | **Controller Mới** - Xử lý logic đăng ký, validation, tạo user |
| `Backend/routes/auth.js` | **Cập Nhật** - Thêm routes: `/signup`, `/check-username`, `/check-email` |

### Tài Liệu

| Tệp | Mô Tả |
|-----|-------|
| `Frontend/SIGNUP_GUIDE.md` | **Hướng Dẫn Chi Tiết** - Tài liệu toàn bộ hệ thống đăng ký |
| `REGISTRATION_SUMMARY.md` | **Tệp Này** - Tóm tắt & hướng dẫn test |

---

## 🚀 Bắt Đầu Sử Dụng

### 1️⃣ Truy Cập Trang Đăng Ký
- **URL**: `http://localhost:3000/pages/signup.html`
- Hoặc click "✨ Đăng Ký Ngay" từ trang login

### 2️⃣ Điền Thông Tin
```
Họ và Tên: Nguyễn Văn A (3+ ký tự)
Tên Đăng Nhập: nguyenvana (3-20 ký tự)
Email: nguyenvana@example.com
Số Điện Thoại: 0912345678 (tùy chọn)
Vai Trò: Nhân Viên / Khách Hàng
Mật Khẩu: SecurePass123 (6+ ký tự, 1 chữ hoa, 1 chữ số)
Xác Nhận Mật Khẩu: SecurePass123
```

### 3️⃣ Gửi Form
- Click "Đăng Ký Tài Khoản"
- Chờ xử lý (loading spinner)
- Tự động chuyển hướng khi thành công

---

## ✨ Các Tính Năng Chính

### Frontend (Giao Diện)
✅ Thiết kế responsive (desktop, tablet, mobile)  
✅ Gradient màu nâu café chuyên nghiệp  
✅ Validation thời gian thực  
✅ Indicator mật khẩu mạnh (real-time)  
✅ Error messages chi tiết  
✅ Loading spinner khi gửi  
✅ Auto redirect sau khi thành công  

### Backend (API)
✅ Validation input đầy đủ  
✅ Kiểm tra format username (3-20 ký tự, alphanumeric + underscore)  
✅ Kiểm tra format email  
✅ Kiểm tra mật khẩu mạnh (6+ ký tự, 1 chữ hoa, 1 chữ số)  
✅ Kiểm tra trùng lặp username  
✅ Kiểm tra trùng lặp email  
✅ Tạo JWT token sau khi tạo user  
✅ Return user info + token  

---

## 🧪 Test Cases

### ✅ Test 1: Đăng Ký Thành Công
```json
{
    "fullName": "Trần Văn B",
    "username": "tranvanb",
    "email": "tranvanb@coffee.com",
    "phone": "0987654321",
    "password": "Coffee@123",
    "role": "staff"
}
```
**Kỳ Vọng**: Đăng ký thành công → Redirect đến Order Page

---

### ❌ Test 2: Mật Khẩu Yếu
```json
{
    "fullName": "Trần Văn C",
    "username": "tranvanc",
    "email": "tranvanc@coffee.com",
    "password": "weak",  // ← Chỉ 4 ký tự, không có chữ hoa, không có số
    "role": "customer"
}
```
**Kỳ Vọng**: Lỗi "Mật khẩu không đáp ứng các yêu cầu"

---

### ❌ Test 3: Email Không Hợp Lệ
```json
{
    "fullName": "Trần Văn D",
    "username": "trand",
    "email": "not-an-email",  // ← Không có @
    "password": "Coffee@123",
    "role": "staff"
}
```
**Kỳ Vọng**: Lỗi "Email không hợp lệ"

---

### ❌ Test 4: Username Trùng Lặp
```json
{
    "fullName": "Trần Văn E",
    "username": "tranvanb",  // ← Trùng với test 1
    "email": "tranvane@coffee.com",
    "password": "Coffee@123",
    "role": "customer"
}
```
**Kỳ Vọng**: Lỗi "Tên đăng nhập đã được sử dụng"

---

### ❌ Test 5: Email Trùng Lặp
```json
{
    "fullName": "Trần Văn F",
    "username": "tranvanf",
    "email": "tranvanb@coffee.com",  // ← Trùng với test 1
    "password": "Coffee@123",
    "role": "staff"
}
```
**Kỳ Vọng**: Lỗi "Email đã được đăng ký"

---

### ❌ Test 6: Mật Khẩu Xác Nhận Không Khớp
**Frontend Validation**: 
- Nhập Password: `Coffee@123`
- Nhập Confirm: `Coffee@124`
**Kỳ Vọng**: Lỗi "Mật khẩu xác nhận không khớp"

---

### ❌ Test 7: Username Quá Ngắn
```json
{
    "fullName": "Trần Văn G",
    "username": "ab",  // ← Chỉ 2 ký tự
    "email": "trang@coffee.com",
    "password": "Coffee@123",
    "role": "staff"
}
```
**Kỳ Vọng**: Lỗi "Tên đăng nhập phải từ 3-20 ký tự"

---

### ❌ Test 8: Số Điện Thoại Không Hợp Lệ
```json
{
    "fullName": "Trần Văn H",
    "username": "tranvanh",
    "email": "tranh@coffee.com",
    "phone": "123",  // ← Chỉ 3 chữ số
    "password": "Coffee@123",
    "role": "customer"
}
```
**Kỳ Vọng**: Lỗi "Số điện thoại không hợp lệ"

---

## 📊 API Endpoints

### 1. POST /api/auth/signup
**Đăng ký tài khoản mới**

Request:
```json
{
    "fullName": "string",
    "username": "string",
    "email": "string",
    "phone": "string (optional)",
    "password": "string",
    "role": "staff|customer"
}
```

Success Response (201):
```json
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
```

Error Response:
```json
{
    "success": false,
    "message": "Chi tiết lỗi"
}
```

---

### 2. GET /api/auth/check-username?username=nguyenvana
**Kiểm tra tên đăng nhập có sẵn**

Response:
```json
{
    "success": true,
    "available": true/false
}
```

---

### 3. GET /api/auth/check-email?email=user@example.com
**Kiểm tra email có sẵn**

Response:
```json
{
    "success": true,
    "available": true/false
}
```

---

## 🔐 Yêu Cầu Bảo Mật

### Mật Khẩu
- ✓ Tối thiểu 6 ký tự
- ✓ 1 chữ cái viết hoa (A-Z)
- ✓ 1 chữ số (0-9)
- ✓ Xác nhận mật khẩu khớp

### Username
- ✓ 3-20 ký tự
- ✓ Chỉ chứa: a-z, A-Z, 0-9, _
- ✓ Duy nhất trong hệ thống

### Email
- ✓ Format email hợp lệ
- ✓ Duy nhất trong hệ thống

---

## 🔗 Liên Kết Trang

### Từ Login → Signup
```
Trang Login (login.html)
    ↓
Click "✨ Đăng Ký Ngay"
    ↓
Trang Signup (signup.html)
```

### Từ Signup → Login
```
Trang Signup (signup.html)
    ↓
Click "Đăng Nhập Ngay"
    ↓
Trang Login (login.html)
```

### Sau Khi Đăng Ký Thành Công
```
Trang Signup (signup.html)
    ↓
Xác minh thành công
    ↓
Auto redirect dựa trên vai trò:
- Admin → /pages/dashboard.html
- Staff → /pages/order.html
- Customer → /pages/menu.html
```

---

## 📋 Checklist Deployment

- [ ] ✅ Database: Users table có sẵn
- [ ] ✅ Backend: Server chạy trên port 5000
- [ ] ✅ Frontend: Files served trên port 3000
- [ ] ✅ signupController.js loaded
- [ ] ✅ Auth routes updated
- [ ] ✅ API methods updated
- [ ] ✅ signup.html accessible
- [ ] ✅ Login page có link signup
- [ ] ✅ CORS enabled
- [ ] ✅ JWT_SECRET configured

---

## 🧠 Validation Flow

```
User fills form
    ↓
Frontend Validation:
├─ Full Name (3+ ký tự)
├─ Username (3-20 ký tự, [a-zA-Z0-9_])
├─ Email (format hợp lệ)
├─ Phone (10-11 chữ số)
├─ Password (6+ ký tự, 1 chữ hoa, 1 chữ số)
├─ Confirm Password (khớp)
└─ Role (staff/customer)
    ↓
Submit to Backend
    ↓
Backend Validation:
├─ Validate input (lại)
├─ Username format check
├─ Email format check
├─ Password strength check
├─ Check username exists
├─ Check email exists
└─ Create user
    ↓
Response:
├─ Success: Return token + user
└─ Error: Return error message
```

---

## 🆘 Xử Lý Sự Cố

### Lỗi: "Không kết nối được API"
```
Kiểm tra:
✓ Backend server đang chạy? (npm start)
✓ Port 5000 có khả dụng?
✓ baseURL trong api.js đúng?
✓ CORS enabled?
```

### Lỗi: "Username đã tồn tại"
```
Kiểm tra:
✓ Username thực sự tồn tại?
✓ Database có constraint unique?
✓ Dữ liệu cũ chưa xóa?
```

### Lỗi: "Email không hợp lệ"
```
Kiểm tra:
✓ Email format: user@domain.com
✓ Có @ và domain?
✓ Không có khoảng trắng?
```

### Lỗi: "Mật khẩu không mạnh"
```
Kiểm tra:
✓ 6+ ký tự?
✓ 1 chữ hoa (A-Z)?
✓ 1 chữ số (0-9)?
✓ Indicator show green?
```

---

## 📞 Testing dengan Postman

### Request Example
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
    "fullName": "Test User",
    "username": "testuser123",
    "email": "test@example.com",
    "phone": "0912345678",
    "password": "TestPass123",
    "role": "staff"
}
```

### Check Username
```
GET http://localhost:5000/api/auth/check-username?username=testuser123
```

### Check Email
```
GET http://localhost:5000/api/auth/check-email?email=test@example.com
```

---

## 📚 Tài Liệu Liên Quan

- 📖 [Frontend SIGNUP_GUIDE.md](SIGNUP_GUIDE.md) - Hướng dẫn chi tiết
- 🔐 [Authentication System](../Backend/FORGOT_PASSWORD_API.md) - Auth system docs
- 📊 [Database Schema](../Database/schema.sql) - Database structure

---

## ✨ Tính Năng Tiếp Theo (Khả Năng Mở Rộng)

Có thể thêm trong tương lai:
- [ ] Email verification (OTP)
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Profile picture upload
- [ ] Phone verification
- [ ] Terms & conditions agreement checkbox
- [ ] Password strength meter
- [ ] Admin approval workflow

---

## 📝 Ghi Chú Quan Trọng

1. **Mật khẩu**: Hiện tại lưu plain text (như hệ thống cũ), nên dùng bcrypt trong production
2. **Email Verification**: Nên thêm OTP verification như forgot-password
3. **Rate Limiting**: Nên add rate limiting cho signup endpoint
4. **Input Sanitization**: Nên sanitize input để tránh SQL injection
5. **CORS**: Cần cấu hình CORS đúng cho frontend

---

**Phiên Bản**: 1.0  
**Ngày Tạo**: 2026-04-17  
**Trạng Thái**: ✅ Hoàn Thành
