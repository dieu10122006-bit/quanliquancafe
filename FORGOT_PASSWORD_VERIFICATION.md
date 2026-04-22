# 🔍 FORGOT PASSWORD SYSTEM - FINAL VERIFICATION CHECKLIST

## ✅ Step 1: Verify Backend Routes Are Registered

### Check Point 1: Verify forgotPasswordController.js Exists
```bash
❓ Do you see this file exists?
Backend/controllers/forgotPasswordController.js
```

**Expected Content Check:**
```javascript
// File should contain these 4 functions:
✓ forgotPassword()
✓ verifyOTP()
✓ resendOTP()
✓ resetPassword()
```

---

### Check Point 2: Verify routes/auth.js Has Routes Registered

Open `Backend/routes/auth.js`

**Look for these lines:**
```javascript
const forgotPasswordController = require('../controllers/forgotPasswordController');

// ... existing routes ...

// Forgot Password Routes
router.post('/forgot-password', forgotPasswordController.forgotPassword);
router.post('/verify-otp', forgotPasswordController.verifyOTP);
router.post('/resend-otp', forgotPasswordController.resendOTP);
router.post('/reset-password', forgotPasswordController.resetPassword);
```

✅ **If you see these → Routes are registered**

---

### Check Point 3: Verify app.js Mounts Auth Routes

Open `Backend/app.js`

**Look for:**
```javascript
const authRoutes = require('./routes/auth');

// ... other config ...

app.use('/api/auth', authRoutes);
```

✅ **If you see this → Routes are mounted**

---

## 🚀 Step 2: Start Backend Server

### Action: Start Node.js Server

```bash
cd Backend
npm install          # Install packages if needed
node app.js          # Start server
```

### Expected Console Output:
```
Server running on port 5000
✓ Database connected
✓ Middleware configured
✓ Routes mounted:
  /api/auth/forgot-password
  /api/auth/verify-otp
  /api/auth/resend-otp
  /api/auth/reset-password
```

⚠️ **If you DON'T see route output:**
- Add a startup log to app.js
- See "Fix: Add Startup Logging" below

---

## 🌐 Step 3: Test API Endpoints

### Option A: Test with cURL (Recommended)

#### Test 1: Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@account.com\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to email",
  "resetToken": "abc123def456..."
}
```

**Expected Server Console Output:**
```
============================================================
📧 EMAIL NOTIFICATION
============================================================
To: admin@account.com
Subject: Mã Xác Thực Đặt Lại Mật Khẩu
------------------------------------------------------------
Xin chào User,

Mã OTP của bạn là:

  ▶ 1 2 3 4 5 6

...
```

---

### Option B: Test with Postman

1. Open Postman
2. Create new POST request
3. **URL:** `http://localhost:5000/api/auth/forgot-password`
4. **Headers:** 
   - Key: `Content-Type`
   - Value: `application/json`
5. **Body (raw JSON):**
```json
{
  "email": "admin@account.com"
}
```
6. Click **Send**

**Expected Response:** 
- Status: `200 OK`
- Body contains `resetToken`

---

## 💻 Step 4: Test Frontend

### Action: Open Web Browser

1. Navigate to: `http://localhost:3000/pages/forgot-password.html`
   - Or your frontend port if different
   
2. Enter email: `admin@account.com`

3. Click "Gửi Mã OTP"

4. Check server console for OTP

5. Copy OTP from console output

6. Paste OTP in form (6 fields)

7. Click "Xác Thực"

8. Enter new password (8+ characters)

9. Click "Đặt Lại Mật Khẩu"

10. Should redirect to login page ✓

---

## 🐛 Common Issues & Fixes

### Issue #1: "Cannot POST /api/auth/forgot-password"

**Cause:** Routes not registered or app.js not restarted

**Fix:**
1. Stop server (Ctrl+C)
2. Verify routes in auth.js exist
3. Restart: `node app.js`
4. Retry curl test

---

### Issue #2: "Cannot read property 'email' of undefined"

**Cause:** Request body not being parsed

**Fix:**
1. Check app.js has body parser:
```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

2. Restart server

---

### Issue #3: "Email is required"

**Cause:** Email not in request body

**Fix (Frontend):**
1. Check forgot-password.js line that sends email
2. Should be: `body: JSON.stringify({ email })`
3. Restart frontend

---

### Issue #4: "User not found"

**Cause:** Email doesn't exist in database

**Fix:**
1. Check database has user with that email
2. Use real email from `SELECT email FROM users;`
3. Retry with valid email

---

### Issue #5: Frontend loads forever ("Đang gửi...")

**Cause:** Backend not responding or fetch URL wrong

**Fix:**
1. Check console (F12 → Console tab)
2. Look for fetch error message
3. Verify URL: `/api/auth/forgot-password`
4. Verify backend server is running
5. Try curl test first (Step 3)

---

## 🔧 Fix: Add Startup Logging

If routes not showing in console, add this to `Backend/app.js`:

```javascript
// After all routes are defined, before app.listen()

console.log('\n' + '='.repeat(60));
console.log('✓ API Routes Registered:');
console.log('='.repeat(60));

// Auth Routes
const authRoutes = [
  'POST   /api/auth/login',
  'POST   /api/auth/register',
  'POST   /api/auth/forgot-password',
  'POST   /api/auth/verify-otp',
  'POST   /api/auth/resend-otp',
  'POST   /api/auth/reset-password'
];

authRoutes.forEach(route => {
  console.log('  ' + route);
});

console.log('='.repeat(60) + '\n');
```

---

## 📋 Debugging Checklist

### Backend
- [ ] forgotPasswordController.js exists and has 4 functions
- [ ] routes/auth.js has import and 4 routes
- [ ] app.js mounts auth routes with `app.use('/api/auth', authRoutes)`
- [ ] Server runs without errors
- [ ] Startup console shows routes
- [ ] cURL test returns 200 status
- [ ] OTP prints to console when sent

### Frontend
- [ ] forgot-password.html exists
- [ ] forgot-password.js exists
- [ ] fetch URL is `/api/auth/forgot-password` (not full URL)
- [ ] Can open page in browser
- [ ] Form shows all 3 steps
- [ ] Browser console (F12) shows no errors
- [ ] Clicking button makes request (check Network tab)

### Integration
- [ ] Frontend can reach backend API
- [ ] CORS not blocking requests
- [ ] Request body includes correct fields
- [ ] Response contains expected data
- [ ] Frontend processes response correctly

---

## 🎯 Quick Start Command

If everything is set up, just:

```bash
# Terminal 1: Backend
cd Backend
node app.js

# Terminal 2: Frontend (if using separate server)
# Or just open in browser if using index.html

# Then in browser: http://localhost:3000/pages/forgot-password.html
```

---

## 📞 When to Ask for Help

If after checking this checklist:
1. ❌ Backend routes still don't show
2. ❌ cURL test fails
3. ❌ Frontend gives specific error message
4. ❌ OTP doesn't print to console

**Provide:**
- Full error message from server console
- Full error from browser DevTools (F12)
- Screenshot of what you see
- Commands you tried
- Which step in this checklist failed

---

## ✨ Success Indicators

### ✓ Backend Working
```
terminal output shows:
- ✓ Database connected
- ✓ Routes registered
- OTP prints to console when requested
```

### ✓ Frontend Working
```
browser shows:
- Step 1 form appears
- Can enter email
- "Gửi Mã OTP" button clickable
- Button shows "Đang gửi..." when clicked
```

### ✓ Integration Working
```
Full flow:
1. Enter email → Click button
2. Server console shows OTP
3. Copy OTP → Paste in form
4. Click verify → Move to step 2
5. Enter password → Click submit
6. Redirect to login ✓
```

---

**START HERE:** Go to "Step 1: Verify Backend Routes" ⬆️