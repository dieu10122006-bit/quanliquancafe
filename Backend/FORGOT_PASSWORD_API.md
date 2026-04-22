# Forgot Password - 2-Layer Security System

## Overview
Tính năng Quên Mật Khẩu với xác thực bảo mật 2 lớp:
- **Lớp 1**: Email Verification (Gửi & kiểm tra OTP)
- **Lớp 2**: Password Reset (Đặt mật khẩu mới sau khi OTP được xác thực)

## API Endpoints

### 1. Request Password Reset (Step 1)
**Endpoint**: `POST /api/auth/forgot-password`

**Description**: Gửi OTP đến email đã đăng ký

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP has been sent to user@example.com",
  "resetToken": "abc123def456..."
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Email not found in our system"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

**Security Features**:
- ✅ Email format validation
- ✅ User existence verification
- ✅ OTP expires in 5 minutes
- ✅ Reset token generation

---

### 2. Verify OTP (Step 2)
**Endpoint**: `POST /api/auth/verify-otp`

**Description**: Xác thực mã OTP nhận được

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "resetToken": "abc123def456..."
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "newToken": "new_reset_token_xyz789..."
}
```

**Error Response** (400 - Wrong OTP):
```json
{
  "success": false,
  "message": "Invalid OTP. 2 attempts remaining"
}
```

**Error Response** (400 - OTP Expired):
```json
{
  "success": false,
  "message": "OTP has expired. Please request a new one"
}
```

**Error Response** (429 - Too Many Attempts):
```json
{
  "success": false,
  "message": "Too many failed attempts. Please request a new OTP"
}
```

**Security Features**:
- ✅ OTP expiration check (5 minutes)
- ✅ Max 3 attempts before lockout
- ✅ Reset token validation
- ✅ New token generation for next step

---

### 3. Resend OTP
**Endpoint**: `POST /api/auth/resend-otp`

**Description**: Gửi lại OTP nếu không nhận được

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "New OTP has been sent",
  "resetToken": "new_reset_token..."
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Email not found"
}
```

**Security Features**:
- ✅ Email verification
- ✅ New OTP generation
- ✅ Timer reset (5 minutes)

---

### 4. Reset Password (Step 3)
**Endpoint**: `POST /api/auth/reset-password`

**Description**: Đặt lại mật khẩu mới

**Request Body**:
```json
{
  "email": "user@example.com",
  "newPassword": "NewSecure@Password123",
  "resetToken": "new_reset_token_xyz789..."
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Error Response** (400 - Weak Password):
```json
{
  "success": false,
  "message": "Password must be at least 8 characters"
}
```

**Error Response** (400 - Invalid Token):
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**Error Response** (400 - OTP Not Verified):
```json
{
  "success": false,
  "message": "OTP verification required"
}
```

**Security Features**:
- ✅ Minimum password length validation (8 characters)
- ✅ Two-factor verification (OTP + Token)
- ✅ Reset token validation
- ✅ Auto cleanup after successful reset

---

## Security Architecture

### Flow Diagram
```
User Interface (Frontend)
    ↓
Step 1: Email Input → /api/auth/forgot-password → OTP Generated & Sent
    ↓
Step 2: OTP Input → /api/auth/verify-otp → OTP Verified & New Token Generated
    ↓
Step 3: New Password → /api/auth/reset-password → Password Updated
    ↓
Login with new password
```

### Security Measures

1. **Email Verification**
   - Confirms user exists in system
   - Email must match registered account

2. **OTP System**
   - 6-digit random OTP
   - 5-minute expiration time
   - Max 3 failed attempts
   - Auto-cleanup on expiration

3. **Token-Based Verification**
   - Reset token generated at each step
   - Token changes after OTP verification
   - Both email and token required for password reset

4. **Password Requirements**
   - Minimum 8 characters
   - Frontend shows password strength indicator
   - No character restrictions (allows special chars)

5. **Rate Limiting**
   - 3 OTP attempts maximum
   - Automatic lockout after failed attempts
   - Resend cooldown recommended (not enforced)

### Data Storage (In-Memory)
```javascript
otpStorage = {
  "user@example.com": {
    otp: "123456",           // 6-digit OTP
    resetToken: "abc123...", // Token for this session
    expiresAt: 1713363000000, // Unix timestamp
    attempts: 0,             // Failed attempts count
    verified: false          // OTP verification status
  }
}
```

> **Production Note**: Use Redis or Database instead of in-memory storage for:
> - Persistent OTP tracking across server restarts
> - Distributed system support
> - Better performance with cleanup

---

## Frontend Implementation

### Step 1: Email Verification
```javascript
// User enters email
const response = await fetch('/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: userEmail })
});

const data = await response.json();
if (data.success) {
  resetToken = data.resetToken;
  // Move to Step 2 (OTP Input)
}
```

### Step 2: OTP Verification
```javascript
// User enters 6-digit OTP
const response = await fetch('/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userEmail,
    otp: userOTP,
    resetToken: resetToken
  })
});

const data = await response.json();
if (data.success) {
  resetToken = data.newToken; // Update token
  // Move to Step 3 (Password Reset)
}
```

### Step 3: Password Reset
```javascript
// User enters new password
const response = await fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userEmail,
    newPassword: newPassword,
    resetToken: resetToken
  })
});

const data = await response.json();
if (data.success) {
  // Redirect to login page
  window.location.href = '/pages/login.html';
}
```

---

## Testing Guide

### Test Case 1: Successful Password Reset
1. Open forgot-password.html
2. Enter valid email
3. Check console for OTP (demo shows in console)
4. Enter OTP correctly
5. Set new password
6. Verify login with new password

### Test Case 2: Invalid Email
1. Enter non-existent email
2. Should show error: "Email not found"

### Test Case 3: Wrong OTP
1. Enter valid email
2. Enter wrong OTP 3 times
3. System should lock after 3 attempts

### Test Case 4: Expired OTP
1. Enter valid email
2. Wait for 5 minutes
3. Try to verify OTP
4. Should show error: "OTP has expired"

### Test Case 5: Resend OTP
1. Enter valid email
2. Wait for some time
3. Click "Resend OTP"
4. Verify receives new OTP

---

## Configuration

### Environment Variables (optional)
```
EMAIL_SERVICE=gmail          # Email service provider
EMAIL_USER=noreply@...       # Sender email
EMAIL_PASSWORD=xxxxx         # Email password
OTP_EXPIRY=300               # OTP expiry in seconds (default: 5 min)
OTP_MAX_ATTEMPTS=3           # Max failed attempts (default: 3)
RESET_TOKEN_LENGTH=64        # Reset token length (default: 64)
```

---

## Future Enhancements

1. **Email Integration**
   - Integrate with Nodemailer / AWS SES
   - Custom email templates
   - Email branding

2. **SMS Verification**
   - Optional SMS-based 2FA
   - Twilio integration

3. **Biometric Support**
   - Fingerprint verification
   - Face ID support

4. **Activity Logging**
   - Log password change attempts
   - Security audit trail
   - Suspicious activity alerts

5. **Admin Dashboard**
   - View recent password resets
   - Manual account recovery
   - Security statistics

---

## Error Codes

| Code | HTTP Status | Message | Action |
|------|-------------|---------|--------|
| EMAIL_NOT_FOUND | 404 | Email not found | Register account |
| INVALID_EMAIL | 400 | Invalid email format | Correct email |
| INVALID_OTP | 400 | Invalid OTP | Re-enter OTP |
| OTP_EXPIRED | 400 | OTP expired | Resend OTP |
| MAX_ATTEMPTS | 429 | Too many attempts | Resend OTP |
| WEAK_PASSWORD | 400 | Password too weak | Enter stronger password |
| INVALID_TOKEN | 400 | Invalid token | Start over |
| OTP_NOT_VERIFIED | 400 | OTP not verified | Complete Step 2 first |

---

## Security Best Practices

✅ **Do's**
- Store OTP in secure backend storage (Redis/DB)
- Use HTTPS for all communications
- Implement rate limiting
- Log failed attempts
- Use strong token generation
- Validate all inputs
- Verify email ownership

❌ **Don'ts**
- Send password in emails
- Store OTP in plain text
- Use predictable OTPs
- Allow unlimited attempts
- Store tokens in localStorage
- Skip email validation
- Expose user information in errors