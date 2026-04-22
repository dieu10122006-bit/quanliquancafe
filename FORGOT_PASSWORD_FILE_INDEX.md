# 📁 FORGOT PASSWORD SYSTEM - COMPLETE FILE STRUCTURE

## 🗂️ ALL FILES CREATED FOR FORGOT PASSWORD FEATURE

### Frontend Files

#### 1. `Frontend/pages/forgot-password.html` ✅
**Purpose:** Main form UI for 3-step password recovery  
**Size:** ~800 lines  
**Key Components:**
- Step indicator (visual progress)
- Step 1: Email input form
- Step 2: OTP input (6 fields with auto-focus)
- Step 3: New password input with strength indicator
- Alert system (success/error/info messages)

**Functions Called:**
- `ForgotPasswordManager` class (from forgot-password.js)

**CSS Classes Used:**
- `.forgot-container` - Main wrapper
- `.step-indicator` - Step progress bar
- `.form-group` - Form elements
- `.alert` - Notification boxes
- `.password-strength` - Password quality indicator
- `.otp-input` - OTP input field styling

---

#### 2. `Frontend/js/forgot-password.js` ✅
**Purpose:** All JavaScript logic for password recovery  
**Size:** ~500 lines  
**Key Methods:**
```javascript
class ForgotPasswordManager {
  constructor()           // Initialize form elements & events
  showStep(stepNumber)    // Switch between steps
  validateEmail()         // Validate email format & database check
  sendOTP()              // Send request to /api/auth/forgot-password
  handleOTPInput()       // Handle OTP field input
  verifyOTP()            // Send request to /api/auth/verify-otp
  checkPasswordStrength() // Validate password (8+ chars, uppercase, number, special)
  resetPassword()        // Send request to /api/auth/reset-password
  showAlert()            // Display notification
  startTimer()           // 5-minute OTP countdown
}
```

**API Calls:**
- `POST /api/auth/forgot-password` - Step 1
- `POST /api/auth/verify-otp` - Step 2
- `POST /api/auth/reset-password` - Step 3

**Features:**
- 5-minute OTP timer
- Max 3 failed OTP attempts
- Password strength validation
- Error handling & user feedback

---

### Backend Files

#### 3. `Backend/controllers/forgotPasswordController.js` ✅
**Purpose:** All backend logic for password recovery  
**Size:** ~400 lines  
**Key Functions:**
```javascript
// Step 1: Generate OTP
forgotPassword(req, res)
  Input: { email }
  Process:
    ✓ Validate email exists
    ✓ Generate OTP (6 digits)
    ✓ Generate resetToken
    ✓ Store OTP with 5-min expiry
    ✓ Console.log OTP (demo mode)
  Output: { success, resetToken }

// Step 2: Verify OTP
verifyOTP(req, res)
  Input: { email, otp, resetToken }
  Process:
    ✓ Check OTP format
    ✓ Check OTP not expired
    ✓ Check max 3 attempts
    ✓ Verify OTP matches
  Output: { success, newToken }

// Re-send OTP
resendOtp(req, res)
  Input: { email, resetToken }
  Process:
    ✓ Generate new OTP
    ✓ Console.log new OTP
    ✓ Return resetToken
  Output: { success, resetToken }

// Step 3: Reset Password
resetPassword(req, res)
  Input: { email, newPassword, resetToken }
  Process:
    ✓ Validate password (8+ chars)
    ✓ Verify resetToken & OTP verified
    ✓ Hash new password
    ✓ Update database
    ✓ Clean up OTP storage
  Output: { success }
```

**Storage:**
```javascript
// In-memory OTP storage (demo mode)
const otpStorage = {
  'email@example.com': {
    otp: '123456',
    resetToken: 'abc123...',
    verified: false,
    attempts: 0,
    expiresAt: 1681234567890,
    createdAt: 1681234267890
  }
}

// Production: Replace with Redis or Database
```

**Email Output (Console):**
```
============================================================
📧 EMAIL NOTIFICATION
============================================================
To: email@example.com
Subject: Mã Xác Thực Đặt Lại Mật Khẩu
------------------------------------------------------------
Xin chào User,

Mã OTP của bạn là:

  ▶ 1 2 3 4 5 6

Mã này sẽ hết hạn trong 5 phút.

Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.

============================================================
```

---

#### 4. `Backend/routes/auth.js` ✅ (UPDATED)
**Purpose:** API route definitions  
**Updated Sections:**
```javascript
const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

// ... existing routes ...

// Forgot Password Routes (NEW)
router.post('/forgot-password', forgotPasswordController.forgotPassword);
router.post('/verify-otp', forgotPasswordController.verifyOTP);
router.post('/resend-otp', forgotPasswordController.resendOtp);
router.post('/reset-password', forgotPasswordController.resetPassword);

module.exports = router;
```

---

#### 5. `Backend/app.js` ✅ (VERIFY)
**Purpose:** Server initialization  
**Verify It Contains:**
```javascript
const authRoutes = require('./routes/auth');

// ... middleware setup ...

app.use('/api/auth', authRoutes);
```

---

### Documentation Files

#### 6. `Backend/FORGOT_PASSWORD_API.md` ✅
**Content:**
- API endpoint documentation
- Request/response format
- Error codes
- Example curl commands

---

#### 7. `Frontend/FORGOT_PASSWORD_GUIDE.md` ✅
**Content:**
- HTML structure explanation
- JavaScript class diagram
- Form validation rules
- Event flow

---

#### 8. `SETUP_FORGOT_PASSWORD.md` (NEW) ✅
**Content:**
- Complete setup guide
- Step-by-step instructions
- Production checklist
- Email service integration
- Rate limiting setup
- Testing guide

---

#### 9. `FORGOT_PASSWORD_VERIFICATION.md` (NEW) ✅
**Content:**
- Verification checklist
- Debugging guide
- Common issues & fixes
- cURL test commands
- Troubleshooting

---

#### 10. `ACTION_PLAN_FORGOT_PASSWORD.md` (NEW) ✅
**Content:**
- Quick action steps
- 6 main tasks to complete
- Timeline (11 minutes total)
- Error handling guide
- Checklist

---

## 📋 DIRECTORY STRUCTURE

```
Project Root/
│
├── Frontend/
│   ├── pages/
│   │   ├── login.html (UPDATED - added forgot password link)
│   │   ├── forgot-password.html (NEW)
│   │   ├── dashboard.html (UPDATED - brown theme)
│   │   ├── menu.html (UPDATED - brown theme)
│   │   ├── order.html (UPDATED - brown theme)
│   │   ├── payment.html (UPDATED - brown theme)
│   │   ├── employees.html (UPDATED - brown theme)
│   │   └── reports.html (UPDATED - brown theme)
│   ├── js/
│   │   ├── auth.js (UPDATED - brown theme)
│   │   ├── api.js (existing)
│   │   ├── utils.js (existing)
│   │   └── forgot-password.js (NEW)
│   ├── css/
│   │   └── style.css (UPDATED - brown color scheme)
│   ├── images/
│   │   └── COFFEE_HDTQ_Logo.png
│   ├── FORGOT_PASSWORD_GUIDE.md (NEW)
│   └── README.md
│
├── Backend/
│   ├── controllers/
│   │   ├── authController.js (existing)
│   │   ├── orderController.js (existing)
│   │   ├── paymentController.js (existing)
│   │   ├── productController.js (existing)
│   │   ├── reportController.js (existing)
│   │   └── forgotPasswordController.js (NEW)
│   ├── routes/
│   │   ├── auth.js (UPDATED - forgot password routes)
│   │   ├── orders.js (existing)
│   │   ├── payments.js (existing)
│   │   ├── products.js (existing)
│   │   └── reports.js (existing)
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── app.js (VERIFY)
│   ├── package.json
│   ├── FORGOT_PASSWORD_API.md (NEW)
│   └── README.md
│
├── Database/
│   ├── schema.sql
│   └── data.sql
│
├── Documentation/
│   ├── 01_PROJECT_PLAN.md
│   ├── 02_REQUIREMENTS.md
│   ├── 03_DATABASE_DESIGN.md
│   ├── 04_SYSTEM_ARCHITECTURE.md
│   ├── 05_UI_MOCKUPS.md
│   ├── 06_IMPLEMENTATION_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── FINAL_REPORT.md
│
├── Testing/
│   └── TESTING_GUIDE.md
│
├── SETUP_FORGOT_PASSWORD.md (NEW)
├── FORGOT_PASSWORD_VERIFICATION.md (NEW)
├── ACTION_PLAN_FORGOT_PASSWORD.md (NEW)
├── FILE_INDEX.md
├── README.md
└── index.html
```

---

## 🔗 DEPENDENCIES MAPPING

```
┌─────────────────────────────────────────┐
│      Frontend: forgot-password.html     │
│            (main form UI)               │
├─────────────────────────────────────────┤
│  Imports:                               │
│  - style.css (brown theme)              │
│  - forgot-password.js (logic)           │
│                                         │
│  API Calls:                             │
│  - POST /api/auth/forgot-password       │
│  - POST /api/auth/verify-otp            │
│  - POST /api/auth/reset-password        │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│    Backend: routes/auth.js              │
│       (API route definitions)           │
├─────────────────────────────────────────┤
│  Imports:                               │
│  - forgotPasswordController.js          │
│                                         │
│  Routes:                                │
│  - POST /forgot-password                │
│  - POST /verify-otp                     │
│  - POST /resend-otp                     │
│  - POST /reset-password                 │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│ Backend: forgotPasswordController.js    │
│      (API endpoint logic)               │
├─────────────────────────────────────────┤
│  Functions:                             │
│  - forgotPassword()                     │
│  - verifyOTP()                          │
│  - resendOtp()                          │
│  - resetPassword()                      │
│                                         │
│  Uses:                                  │
│  - Database (users table)               │
│  - otpStorage (in-memory)               │
│  - Email service (console.log demo)     │
└─────────────────────────────────────────┘
```

---

## 🚀 STARTUP SEQUENCE

```
1. Backend starts (Backend/app.js)
   ├── Load environment variables
   ├── Connect to database
   ├── Setup middleware (CORS, body-parser)
   ├── Mount routes (including auth.js)
   ├── Initialize error handlers
   └── Listen on port 5000

2. auth.js loaded
   ├── Import forgotPasswordController
   ├── Define routes
   └── Export router

3. forgotPasswordController loaded
   ├── Initialize otpStorage
   ├── Setup email formatter
   └── Define 4 controller functions

4. Frontend loads
   ├── Open forgot-password.html
   ├── Load style.css
   ├── Load forgot-password.js
   └── Initialize ForgotPasswordManager

5. User interacts
   ├── Fills form
   ├── Clicks button
   ├── JavaScript sends fetch()
   └── API responds
```

---

## ✅ VERIFICATION CHECKLIST

| Component | File | Status | Verified |
|-----------|------|--------|----------|
| HTML Form | `Frontend/pages/forgot-password.html` | ✅ Created | [ ] |
| Frontend JS | `Frontend/js/forgot-password.js` | ✅ Created | [ ] |
| Controller | `Backend/controllers/forgotPasswordController.js` | ✅ Created | [ ] |
| Routes | `Backend/routes/auth.js` | ✅ Updated | [ ] |
| Server | `Backend/app.js` | ✅ Mounted | [ ] |
| API Test | cURL/Postman | - | [ ] |
| OTP Output | Console Log | - | [ ] |
| Frontend Test | Browser Form | - | [ ] |
| Complete Flow | All 3 Steps | - | [ ] |

---

## 🎯 NEXT STEPS

1. ✅ Review file structure above
2. ✅ Verify all files exist in correct locations
3. ✅ Follow `ACTION_PLAN_FORGOT_PASSWORD.md` (6 steps, 11 minutes)
4. ✅ Use `FORGOT_PASSWORD_VERIFICATION.md` for debugging
5. ✅ Refer to `SETUP_FORGOT_PASSWORD.md` for production setup

---

## 📞 FILE PURPOSES SUMMARY

| File | Purpose | Time to Read |
|------|---------|--------------|
| `ACTION_PLAN_FORGOT_PASSWORD.md` | Quick 11-minute action guide | 3 min |
| `FORGOT_PASSWORD_VERIFICATION.md` | Detailed debugging & checklist | 5 min |
| `SETUP_FORGOT_PASSWORD.md` | Complete setup & production guide | 10 min |
| `Frontend/FORGOT_PASSWORD_GUIDE.md` | Frontend code explanation | 5 min |
| `Backend/FORGOT_PASSWORD_API.md` | API documentation | 5 min |

---

## 🔑 KEY POINTS TO REMEMBER

1. **Frontend Makes 3 API Calls:**
   - POST /api/auth/forgot-password (send OTP)
   - POST /api/auth/verify-otp (verify OTP)
   - POST /api/auth/reset-password (update password)

2. **Backend Stores OTP:**
   - In-memory (otpStorage object)
   - 5-minute expiration
   - Max 3 attempts
   - Console output in demo mode

3. **Production Needs:**
   - Real email service (replace console.log)
   - Redis or DB for OTP storage
   - Rate limiting on endpoints
   - HTTPS enforcement
   - Better error messages

4. **Development Mode:**
   - OTP prints to console
   - Copy from console → Paste in form
   - No real emails sent

---

**STATUS: 🟢 READY FOR TESTING**

All files created. Follow ACTION_PLAN_FORGOT_PASSWORD.md to test.