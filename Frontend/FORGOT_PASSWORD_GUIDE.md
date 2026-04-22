# Forgot Password - Frontend Implementation

## Files Structure

```
Frontend/
├── pages/
│   ├── forgot-password.html      # Main forgot password page
│   └── login.html                # Updated with forgot password link
├── js/
│   └── forgot-password.js        # Forgot password logic & API calls
└── css/
    └── style.css                 # Global styles (inherits color scheme)
```

## Features

### 🔐 Security Features
- ✅ 2-Layer Authentication (Email + OTP)
- ✅ OTP Auto-Input with paste support
- ✅ Password Strength Indicator
- ✅ Timer-based OTP Expiration (5 minutes)
- ✅ Max 3 OTP Verification Attempts
- ✅ Secure Password Requirements

### 🎨 UI Features
- ✅ 3-Step Process Indicator
- ✅ Smooth Animations & Transitions
- ✅ Real-time Validation
- ✅ Error Messages & Alerts
- ✅ Loading States
- ✅ Responsive Design
- ✅ Dark Brown Theme (HDTQ Coffee)

### ⌨️ User Experience
- ✅ OTP Auto-focus between digits
- ✅ Paste support for OTP
- ✅ Backspace navigation
- ✅ Password visibility toggle
- ✅ Generic error messages (security)
- ✅ Progress indicator

---

## Page Flow

```
Login Page
    ↓
    └─→ "Quên mật khẩu?" link
         ↓
    Forgot Password Page
         ↓
    ┌────────────────────────────────┐
    │ STEP 1: Email Verification     │
    ├────────────────────────────────┤
    │ 1. User enters email           │
    │ 2. Backend sends OTP to email  │
    │ 3. Move to Step 2              │
    └────────────────────────────────┘
         ↓
    ┌────────────────────────────────┐
    │ STEP 2: OTP Verification       │
    ├────────────────────────────────┤
    │ 1. User enters 6-digit OTP     │
    │ 2. Backend verifies OTP        │
    │ 3. Move to Step 3              │
    └────────────────────────────────┘
         ↓
    ┌────────────────────────────────┐
    │ STEP 3: Password Reset         │
    ├────────────────────────────────┤
    │ 1. User enters new password    │
    │ 2. Password strength check     │
    │ 3. Backend updates password    │
    │ 4. Redirect to login           │
    └────────────────────────────────┘
         ↓
    Login with new password
```

---

## HTML Structure

### Header Section
- Logo/Icon (🔐)
- Title: "Khôi Phục Mật Khẩu"
- Subtitle: Instruction text

### Step Indicator
- Visual 3-step progress
- Shows current step
- Shows completed steps with ✓

### Alert System
- Success alerts (green)
- Error alerts (red)
- Info alerts (blue)
- Auto-hide after 5 seconds

### Forms

**Step 1: Email Input**
- Email input field
- "Gửi Mã OTP" button
- Help text

**Step 2: OTP Input**
- 6 individual OTP digit inputs
- OTP timer display
- Resend button (disabled during timer)
- Back & Verify buttons

**Step 3: Password Reset**
- New password input with toggle
- Confirm password input with toggle
- Password strength indicator (3 bars)
- Strength text feedback
- Back & Reset buttons

---

## JavaScript Implementation

### ForgotPasswordManager Class

**Constructor**: Initialize event listeners

**Methods**:

#### Step 1: Email Verification
```javascript
validateEmail()      // Check email format
sendOTP()           // Send OTP to email
maskEmail()         // Hide email for privacy
```

#### Step 2: OTP Verification
```javascript
handleOTPInput()    // Process OTP digit input
handleOTPKeydown()  // Handle keyboard navigation
handleOTPPaste()    // Handle paste event
updateOTPButton()   // Enable/disable verify button
startOTPTimer()     // Start 5-minute timer
verifyOTP()         // Verify OTP with backend
resendOTP()         // Resend OTP
```

#### Step 3: Password Reset
```javascript
checkPasswordStrength()  // Evaluate password strength
validateNewPassword()    // Check password requirements
resetPassword()         // Send new password to backend
```

#### Utilities
```javascript
showAlert()         // Display alert messages
hideAlert()         // Hide alert messages
goToStep()          // Navigate between steps
```

---

## API Communication

### Endpoints Called

1. **POST /api/auth/forgot-password**
   - Called on Step 1 completion
   - Sends: `{ email }`
   - Receives: `{ resetToken, message }`

2. **POST /api/auth/verify-otp**
   - Called on Step 2 completion
   - Sends: `{ email, otp, resetToken }`
   - Receives: `{ newToken, message }`

3. **POST /api/auth/resend-otp**
   - Called when user clicks resend
   - Sends: `{ email }`
   - Receives: `{ resetToken, message }`

4. **POST /api/auth/reset-password**
   - Called on Step 3 completion
   - Sends: `{ email, newPassword, resetToken }`
   - Receives: `{ message }`

---

## Validation Rules

### Email Validation
- Format: `user@example.com`
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Must exist in system

### OTP Validation
- Length: Exactly 6 digits
- Format: Numbers only
- Max attempts: 3
- Expiration: 5 minutes

### Password Validation
- Minimum length: 8 characters
- Strength indicators:
  - **Weak** (Red): 1 requirement met
  - **Medium** (Orange): 2 requirements met
  - **Strong** (Brown): 3+ requirements met

Requirements:
- ✓ At least 8 characters
- ✓ At least 1 uppercase letter
- ✓ At least 1 number
- ✓ At least 1 special character

---

## User Interactions

### Email Input Step
```
1. User opens forgot-password.html
2. Enters email address
3. Email validation on input
4. Clicks "Gửi Mã OTP"
5. Loading state appears
6. Success → Move to OTP step
7. Error → Show error message
```

### OTP Input Step
```
1. User sees "Mã OTP đã được gửi"
2. Types each OTP digit (auto-focus)
3. Can paste all 6 digits at once
4. Timer counts down from 5:00
5. Click "Xác Thực" → Verify
6. Wrong OTP? Shows remaining attempts
7. Timer expires? Show resend option
```

### Password Reset Step
```
1. User enters new password
2. Strength indicator updates (real-time)
3. User confirms password
4. Error if passwords don't match
5. Click "Đặt Lại Mật Khẩu"
6. Success → Redirect to login
7. Error → Show message, allow retry
```

---

## Error Handling

### User-Friendly Messages
- Generic error messages (don't leak info)
- Clear instructions for retry
- Helpful hints for prevention

### Error Types

**Email Errors**
- "Vui lòng nhập email hợp lệ" - Invalid format
- "Email không tồn tại" - Not registered

**OTP Errors**
- "Mã OTP không chính xác. 2 lần còn lại" - Wrong code
- "Mã OTP đã hết hạn" - Expired
- "Quá nhiều lần thử. Vui lòng gửi lại" - Locked out

**Password Errors**
- "Mật khẩu phải có ít nhất 8 ký tự" - Too short
- "Mật khẩu không khớp" - Passwords don't match

---

## Security Implementation

### Frontend Security
- ✅ No password storage
- ✅ HTTPS communication
- ✅ Input validation
- ✅ Rate limiting indicators
- ✅ Generic error messages
- ✅ Token management
- ✅ Session cleanup

### Token Management
- Reset token stored in memory only
- Token expires with session
- New token after each step
- Cleared after completion

### Data Privacy
- Email masked in display: `u***r@example.com`
- No sensitive data in console logs
- No hardcoded credentials
- Secure random generation

---

## Browser Compatibility

✅ Chrome/Edge (Latest)
✅ Firefox (Latest)
✅ Safari (Latest)
✅ Mobile browsers

**CSS Features Used**:
- CSS Grid
- Flexbox
- CSS Variables
- Animations
- Gradients
- Box shadows

---

## Testing Scenarios

### Happy Path
1. ✅ Enter valid email
2. ✅ Receive OTP
3. ✅ Enter correct OTP
4. ✅ Enter valid password
5. ✅ Successfully reset password
6. ✅ Redirect to login
7. ✅ Login with new password

### Error Scenarios
- ❌ Invalid email format
- ❌ Non-existent email
- ❌ Wrong OTP (3 times)
- ❌ Expired OTP
- ❌ Weak password
- ❌ Password mismatch
- ❌ Network error

### Edge Cases
- Paste OTP (6 digits)
- Backspace between OTP fields
- Tab navigation
- Toggle password visibility
- Resize window (responsive)
- Close/reopen page
- Fast button clicks (disabled state)

---

## Customization

### Change Colors
Edit CSS variables in HTML:
```css
--color-primary: #8B4513;      /* Primary brown */
--color-secondary: #A0522D;    /* Secondary brown */
--color-accent: #DEB887;       /* Tan accent */
```

### Change Timeouts
Edit JavaScript:
```javascript
otpTimeRemaining = 300;  // 5 minutes in seconds
// Or edit API response handling
```

### Change OTP Length
Update frontend OTP inputs (currently 6 fields)
Update backend OTP generation

### Add Email Service
In `forgotPasswordController.js`:
```javascript
// Replace console.log with real email service
const nodemailer = require('nodemailer');
// Or AWS SES, SendGrid, etc.
```

---

## Performance

### Load Time
- Single HTML file: ~30KB
- CSS inline: Minimal requests
- JS file: ~8KB (minified)
- Total: ~38KB initial load

### Optimizations
- ✅ Inline critical CSS
- ✅ Lazy image loading
- ✅ Minimal dependencies
- ✅ Efficient animations (GPU accelerated)
- ✅ Event delegation

---

## Accessibility

### Features
- ✅ ARIA labels on OTP inputs
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast WCAG AA
- ✅ Screen reader support

### Keyboard Shortcuts
- `Tab` - Navigate between fields
- `Enter` - Submit current form
- `Backspace` - Delete previous field
- `Ctrl+V` - Paste OTP
- `Esc` - Go back (optional)

---

## Files Reference

### forgot-password.html
- Complete page structure
- All form sections
- Alert system
- Step indicator
- ~450 lines

### forgot-password.js
- ForgotPasswordManager class
- All frontend logic
- API communication
- Validation functions
- ~400 lines

### forgotPasswordController.js (Backend)
- All 4 endpoints
- OTP generation
- Token management
- OTP cleanup
- ~300 lines

### auth.js (Routes)
- Route definitions
- Middleware setup
- ~40 lines