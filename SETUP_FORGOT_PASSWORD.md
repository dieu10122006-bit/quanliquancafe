# ⚙️ Setup Guide - Forgot Password System

## 🚀 Quick Start

### Step 1: Backend Setup
1. Frontend sẽ gọi API tới đường dẫn: `/api/auth/forgot-password`
2. Backend đã được setup sẵn ở `Backend/routes/auth.js`
3. Routes được import vào `Backend/app.js`

### Step 2: Test Endpoints
Server sẽ chạy ở: `http://localhost:5000`

Các endpoint sẵn sàng:
```
POST   /api/auth/forgot-password      - Step 1: Gửi OTP
POST   /api/auth/verify-otp           - Step 2: Xác thực OTP
POST   /api/auth/resend-otp           - Gửi lại OTP
POST   /api/auth/reset-password       - Step 3: Đặt mật khẩu mới
```

### Step 3: Frontend Testing
1. Mở: `http://localhost:3000/forgot-password.html` (hoặc port CMS của bạn)
2. Nhập email có trong database
3. Server sẽ in OTP ở console (vì chế độ demo)
4. Copy OTP từ console server → Nhập vào form
5. Hoàn tất reset

---

## 📋 Cách thực hiện từng bước

### Step 1️⃣: Email Verification (Gửi OTP)

**Frontend:**
```javascript
const email = 'user@example.com';

const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
});

const data = await response.json();
// Returns: { resetToken: "abc123..." }
```

**Backend:**
```
✓ Check email exists
✓ Generate OTP (6 digits)
✓ Generate reset token
✓ Store OTP with 5-min expiry
✓ Send OTP via email (console in demo)
✓ Return reset token
```

**Server Console Output:**
```
============================================================
📧 EMAIL NOTIFICATION
============================================================
To: dieu10122006@gmail.com
Subject: Mã Xác Thực Đặt Lại Mật Khẩu
------------------------------------------------------------
Xin chào User,

Mã OTP của ca bạn là:

  ▶ 1 2 3 4 5 6

Mã này sẽ hết hạn trong 5 phút.

Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.

============================================================
```

---

### Step 2️⃣: OTP Verification (Xác thực OTP)

**Frontend:**
```javascript
const otp = '123456';  // 6-digit code user input

const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'user@example.com',
        otp: otp,
        resetToken: 'abc123...'
    })
});

const data = await response.json();
// Returns: { newToken: "xyz789..." }
```

**Backend:**
```
✓ Check OTP format (6 digits)
✓ Check OTP expiration (5 min)
✓ Check failed attempts (max 3)
✓ Verify OTP matches
✓ Verify reset token
✓ Generate new token
✓ Mark OTP as verified
✓ Return new token
```

---

### Step 3️⃣: Password Reset (Đặt mật khẩu mới)

**Frontend:**
```javascript
const newPassword = 'NewSecure@Pass123';

const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'user@example.com',
        newPassword: newPassword,
        resetToken: 'xyz789...'
    })
});

const data = await response.json();
// Returns: { success: true }
```

**Backend:**
```
✓ Validate password (8+ chars)
✓ Verify reset token
✓ Check OTP was verified
✓ Update password in DB
✓ Clean up OTP storage
✓ Return success
```

---

## 🔧 Current Files

### Frontend Files Created:
```
✓ Frontend/pages/forgot-password.html
✓ Frontend/js/forgot-password.js
✓ Frontend/FORGOT_PASSWORD_GUIDE.md
✓ Frontend/pages/login.html (updated with link)
```

### Backend Files Created:
```
✓ Backend/controllers/forgotPasswordController.js
✓ Backend/routes/auth.js (updated with routes)
✓ Backend/FORGOT_PASSWORD_API.md
```

---

## 📝 Demo Mode Testing

### Test Email:
Use any email from your database. Example:
- `admin@account.com`
- `staff_001@account.com`
- `user@example.com`

### Test Scenario:
```
1. Open http://localhost:YOUR_PORT/forgot-password.html
2. Enter email → "Gửi Mã OTP"
3. Check server console for OTP output
4. Example OTP: "123456" (will show in console box)
5. Copy OTP → Enter in form
6. Click "Xác Thực"
7. Enter new password (8+ chars)
8. Click "Đặt Lại Mật Khẩu"
9. Redirect to login
10. Login with new password
```

---

## ⚡ Production Checklist

Before deploying to production:

### Email Service Setup
```javascript
// In forgotPasswordController.js
// Replace console.log with actual email service:

// Option 1: Nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: email,
  subject: 'Khôi Phục Mật Khẩu',
  html: `<p>Mã OTP: <strong>${otp}</strong></p>`
});
```

### OTP Storage Migration
```javascript
// Current: In-memory storage (won't survive server restart)
// Production: Use Redis or Database

// Option 1: Redis
const redis = require('redis');
const client = redis.createClient();

// Store OTP
client.setex(`otp:${email}`, 300, JSON.stringify({
  otp, resetToken, verified: false
}));

// Retrieve OTP
const otpData = await client.get(`otp:${email}`);
```

### Environment Variables
```env
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@cafehdtq.com

# Security
OTP_EXPIRY=300
OTP_MAX_ATTEMPTS=3
JWT_SECRET=your-strong-secret-key

# General
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=cafe_db
```

### Rate Limiting
```javascript
// Add rate limiting in routes/auth.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

router.post('/forgot-password', limiter, forgotPasswordController.forgotPassword);
```

### HTTPS Setup
- Force HTTPS in production
- Use SSL certificates
- Update CORS origin in app.js

---

## 🧪 Testing Endpoints with cURL

### Test 1: Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Test 2: Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "otp":"123456",
    "resetToken":"abc123..."
  }'
```

### Test 3: Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "newPassword":"NewSecure@Pass123",
    "resetToken":"xyz789..."
  }'
```

---

## 🐛 Troubleshooting

### Issue: "Cannot POST /api/auth/forgot-password"
**Solution**: 
- Check routes imported in app.js
- Verify forgotPasswordController.js exists
- Check PORT and CORS settings

### Issue: "OTP mãi không gửi"
**Solution**:
- Check server console for email output
- OTP should print to console in demo mode
- In production, check email service logs

### Issue: "Lỗi 500 Internal Server Error"
**Solution**:
- Check server logs
- Verify database connection
- Check environment variables loaded

### Issue: "Cannot read property 'db_name' of undefined"
**Solution**:
- Add .env file with required variables
- Or check pool.js config
- Verify DATABASE setup

### Issue: Frontend GET request instead of POST
**Solution**:
- Check fetch method is POST
- Check Content-Type header is set
- Verify fetch URL is correct

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│             FORGOT PASSWORD FLOW                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  User Opens forgot-password.html                        │
│           ↓                                             │
│  Enters Email                                           │
│           ↓                                             │
│  Frontend → POST /api/auth/forgot-password             │
│           ↓                                             │
│  Backend: Generate OTP + Send Email                     │
│  Output: ┌──────────────────────────┐                  │
│          │ 📧 EMAIL NOTIFICATION    │                  │
│          │ OTP: 1 2 3 4 5 6         │                  │
│          └──────────────────────────┘                  │
│           ↓                                             │
│  Frontend: Move to Step 2 (OTP Input)                  │
│           ↓                                             │
│  User Copies OTP from Server Console                    │
│           ↓                                             │
│  Frontend → POST /api/auth/verify-otp                  │
│           ↓                                             │
│  Backend: Verify OTP + Generate New Token              │
│           ↓                                             │
│  Frontend: Move to Step 3 (Password Reset)             │
│           ↓                                             │
│  User Enters New Password                              │
│           ↓                                             │
│  Frontend → POST /api/auth/reset-password              │
│           ↓                                             │
│  Backend: Update Password + Clean Storage              │
│           ↓                                             │
│  Redirect to Login Page                                │
│           ↓                                             │
│  User Login with New Password ✓                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation Links

- **Backend API**: See `Backend/FORGOT_PASSWORD_API.md`
- **Frontend Guide**: See `Frontend/FORGOT_PASSWORD_GUIDE.md`
- **Main README**: See `README.md`

---

## ✅ Verification Checklist

- [x] Frontend HTML file created
- [x] Frontend JS file created
- [x] Backend controller created
- [x] Backend routes setup
- [x] App.js configured
- [x] Email mock implemented
- [x] OTP timer working
- [x] Password strength check
- [x] Error handling
- [x] Validation working
- [ ] Email service integrated (Production)
- [ ] Database for OTP storage (Production)
- [ ] Rate limiting added (Production)
- [ ] HTTPS enabled (Production)