# 🔐 Hệ Thống Đặt Lại Mật Khẩu Với Email OTP - HDTQ Coffee

## ✅ Hoàn Thiện

Hệ thống quên mật khẩu với xác thực OTP qua email đã được tạo hoàn chỉnh:

- ✅ Frontend UI chuyên nghiệp với 3 bước
- ✅ Backend API với Nodemailer (gửi email thực)
- ✅ OTP authentication (email verification + OTP)
- ✅ Password strength validation
- ✅ Rate limiting & security

---

## 🚀 Cách Sử Dụng

### Bước 1: Khởi Động Backend Server

```bash
cd Backend
npm install  # (nếu chưa cài dependencies)
node app.js
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════════╗
║   ☕ CAFE MANAGEMENT SYSTEM - Backend Server ☕          ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  ✓ Server running on: http://localhost:5000              ║
║  ✓ Environment: development                              ║
║  ✓ Database: cafe_management_system                      ║
║  ✓ Email Service: Initialized                            ║
║
║  📧 EMAIL SERVICE - Development Mode
║  Test Email Account:
║  User: [email@ethereal.email]
║  Pass: [password]
║  ✓ Emails will be sent to Ethereal
║  ✓ Preview links will be logged
║
║  API Routes:
║  • POST   /api/auth/forgot-password    - Send OTP         ║
║  • POST   /api/auth/verify-otp         - Verify OTP       ║
║  • POST   /api/auth/resend-otp         - Resend OTP       ║
║  • POST   /api/auth/reset-password     - Reset Password   ║
║
║  Ctrl+C to stop server
║
╚════════════════════════════════════════════════════════════╝
```

---

### Bước 2: Mở Trang Quên Mật Khẩu

**URL:** `http://localhost:8000/pages/forgot-password.html`
(hoặc port frontend của bạn)

---

### Bước 3: Thực Hiện Quy Trình Đặt Lại Mật Khẩu

#### **Step 1: Nhập Email**
1. Nhập email đã đăng ký trong database
   - Ví dụ: `admin@account.com`
2. Click "Gửi Mã OTP 📤"

#### **Step 2: Xác Thực OTP**
1. Mã OTP sẽ được gửi qua email
2. **MODE DEVELOPMENT (TEST):** OpenNewspaper terminal server, bạn sẽ thấy:

```
╔════════════════════════════════════════════════════════════╗
║            ✓ EMAIL SENT SUCCESSFULLY                       ║
╠════════════════════════════════════════════════════════════╣
║  To:       admin@account.com                              ║
║  Subject:  Mã Xác Thực Đặt Lại Mật Khẩu                  ║
║  OTP:      342891                                         ║
║  Time:     17/4/2026, 10:30:45                            ║
║  Preview:  https://ethereal.email/message/ABC123...      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

3. Copy mã OTP (ví dụ: **342891**)
4. Nhập vào 6 ô input
5. Click "Xác Thực ✓"

#### **Step 3: Đặt Mật Khẩu Mới**
1. Nhập mật khẩu mới (yêu cầu):
   - Ít nhất 8 ký tự
   - Chứa chữ hoa (A-Z)
   - Chứa chữ thường (a-z)
   - Chứa số (0-9)
   - Chứa ký tự đặc biệt (@$!%*?&)
2. Xác nhận mật khẩu
3. Click "Đặt Lại Mật Khẩu ✓"

---

## 📧 Cách Nhận Email OTP

### Mode Development (Test)

Email được gửi qua **Ethereal Email** - dịch vụ test email miễn phí:

**Bước 1:** Mở link preview từ console
```
Preview: https://ethereal.email/message/ABC123...
```

**Bước 2:** Click link → Xem email HTML được format đẹp

### Mode Production (Thực Tế)

Để sử dụng email thực (Gmail, Outlook, ...):

1. Update file `.env`:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@cafehdtq.com
SMTP_SECURE=false
```

2. Hoặc dùng Mailtrap:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-password
```

---

## 📋 API Endpoints

### 1. POST /api/auth/forgot-password
**Bước 1: Gửi OTP**

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Mã OTP đã được gửi đến user@example.com. Vui lòng kiểm tra inbox.",
  "resetToken": "a1b2c3d4e5f6g7h8i9j0..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email không tồn tại trong hệ thống"
}
```

---

### 2. POST /api/auth/verify-otp
**Bước 2: Xác Thực OTP**

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "342891",
  "resetToken": "a1b2c3d4e5f6g7h8i9j0..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Xác thực OTP thành công",
  "verificationToken": "x1y2z3a4b5c6d7e8f9g0...",
  "expiresIn": 250
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Mã OTP không chính xác. Còn 2 lần thử",
  "attempts": 1,
  "remainingAttempts": 2
}
```

---

### 3. POST /api/auth/reset-password
**Bước 3: Đặt Lại Mật Khẩu**

**Request:**
```json
{
  "email": "user@example.com",
  "newPassword": "NewSecure@Pass123",
  "resetToken": "x1y2z3a4b5c6d7e8f9g0..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
}
```

---

### 4. POST /api/auth/resend-otp
**Gửi Lại OTP**

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mã OTP mới đã được gửi",
  "resetToken": "new-token...",
  "expiresIn": 300
}
```

---

## 🔧 Tệp Đã Được Tạo/Cập Nhật

### Frontend
- `Frontend/pages/forgot-password.html` - **NEW** (UI chuyên nghiệp)
- `Frontend/js/forgot-password.js` - Updated (phù hợp API mới)

### Backend
- `Backend/services/emailService.js` - **NEW** (Email service với Nodemailer)
- `Backend/controllers/forgotPasswordController.js` - Updated (tích hợp email thực)
- `Backend/routes/auth.js` - Already configured
- `Backend/app.js` - Updated (khởi tạo email service)
- `Backend/.env` - Updated (cấu hình email)
- `Backend/package.json` - Updated (thêm nodemailer)

---

## 🔒 Tính Năng Bảo Mật

1. **OTP Expiration:** 5 phút
2. **Max Attempts:** 3 lần nhập sai
3. **Rate Limiting:** Chờ 30 giây trước khi gửi lại
4. **Password Strength:** Yêu cầu chữ hoa, thường, số, ký tự đặc biệt
5. **Token Verification:** Reset token được kiểm tra ở mỗi bước
6. **Auto Cleanup:** OTP hết hạn được xóa tự động mỗi phút

---

## ⚙️ Biến Môi Trường (.env)

```env
# Email Configuration - Development
NODE_ENV=development

# Email Configuration - Production
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASS=your_pass
SMTP_FROM=noreply@cafehdtq.com
SMTP_SECURE=false

# OTP Configuration
OTP_EXPIRY=300000          # 5 minutes in milliseconds
OTP_MAX_ATTEMPTS=3
```

---

## 🧪 Cách Test Endpoint Với cURL

### Test 1: Gửi OTP
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@account.com"}'
```

### Test 2: Xác Thực OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@account.com",
    "otp":"342891",
    "resetToken":"..."
  }'
```

### Test 3: Đặt Lại Mật Khẩu
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@account.com",
    "newPassword":"NewSecure@Pass123",
    "resetToken":"..."
  }'
```

---

## 📱 Responsive Design

UI tự động thích ứng với các kích thước màn hình:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

---

## 🐛 Troubleshooting

### Email không được gửi
```
→ Kiểm tra backend console có error không
→ Verify database connection
→ Kiểm tra .env configuration
```

### OTP không hiển thị
```
→ Mở Network tab (F12) để xem API response
→ Kiểm tra console frontend có error không
```

### Mật khẩu không được cư
```
→ Kiểm tra password phải chứa: UPPERCASE, lowercase, số, ký tự đặc biệt
→ Ít nhất 8 ký tự
```

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│             FORGOT PASSWORD - FULL FLOW                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  User: frontend/pages/forgot-password.html             │
│        └→ Step 1: Nhập email                           │
│           └→ POST /api/auth/forgot-password            │
│              └→ Backend: sinh OTP + gửi email          │
│                 └→ Ethereal: in OTP vào console        │
│              └→ Frontend: chuyển Step 2                │
│                                                         │
│        └→ Step 2: Nhập OTP (copy từ console)          │
│           └→ POST /api/auth/verify-otp                │
│              └→ Backend: xác thực OTP                 │
│              └→ Frontend: chuyển Step 3               │
│                                                         │
│        └→ Step 3: Nhập mật khẩu mới                   │
│           └→ POST /api/auth/reset-password            │
│              └→ Backend: hash + update DB             │
│              └→ Frontend: redirect login              │
│                                                         │
│  User: Đăng nhập với mật khẩu mới ✓                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Tính Năng Đặc Biệt

1. **Ethereal Email Preview:** Xem email HTML được format đẹp
2. **Password Strength Indicator:** 4 level: Weak/Medium/Strong/Very Strong
3. **Auto-Focus OTP:** Tự động chuyển focus giữa các ô OTP
4. **Password Visibility Toggle:** Ẩn/hiện mật khẩu khi nhập
5. **Responsive Design:** Mobile-friendly
6. **Professional UI:** Modern gradient design with smooth animations
7. **Rate Limiting:** Chặn spam gửi lại OTP

---

## 🎯 Tổng Kết

Hệ thống quên mật khẩu đã hoàn toàn chuyên nghiệp với:
- ✅ Email thực được gửi (Ethereal test / Production SMTP)
- ✅ OTP verification 2-layer security
- ✅ Beautiful responsive UI
- ✅ Complete API endpoints
- ✅ Error handling & validation
- ✅ Security best practices

**Status:** 🟢 **READY FOR PRODUCTION**

---

**Liên Hệ Hỗ Trợ:** Xem `FORGOT_PASSWORD_FILE_INDEX.md` để biết thêm chi tiết
