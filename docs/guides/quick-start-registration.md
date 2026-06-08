# ⚡ Quick Start - Hệ Thống Đăng Ký

## 🎯 5 Phút Để Bắt Đầu

### 1️⃣ Khởi Động Backend (Terminal 1)
```bash
cd Backend
npm install
npm start
```
✅ Backend sẽ chạy trên: `http://localhost:5000`

---

### 2️⃣ Khởi Động Frontend (Terminal 2)
```bash
# Nếu dùng Live Server (VS Code extension)
# Right-click index.html → Open with Live Server
# Sẽ chạy trên: http://localhost:5500
```
✅ Frontend sẽ chạy trên: `http://localhost:5500`

---

### 3️⃣ Truy Cập Trang Đăng Ký
```
http://localhost:5500/pages/signup.html
```

---

## 📋 Form Test Nhanh

### ✅ Test Thành Công
```
Họ và Tên:      Nguyễn Văn Test
Tên Đăng Nhập:  nguyenvantest
Email:          nguyenvantest@example.com
Số Điện Thoại:  0912345678
Vai Trò:        Nhân Viên
Mật Khẩu:       TestPass123
Xác Nhận:       TestPass123
```
**👉 Click "Đăng Ký Tài Khoản"**  
**✨ Kỳ Vọng: Chuyển đến trang Order**

---

### ❌ Test Lỗi - Mật Khẩu Yếu
```
Họ và Tên:      Trần Văn A
Tên Đăng Nhập:  tranvana
Email:          tranvana@example.com
Số Điện Thoại:  0987654321
Vai Trò:        Khách Hàng
Mật Khẩu:       weak
Xác Nhận:       weak
```
**👉 Click "Đăng Ký Tài Khoản"**  
**⚠️ Kỳ Vọng: Lỗi "Mật khẩu không đáp ứng..."**

---

### ❌ Test Lỗi - Email Trùng Lặp
Dùng email từ test thành công:
```
Email: nguyenvantest@example.com
```
**👉 Click "Đăng Ký Tài Khoản"**  
**⚠️ Kỳ Vọng: Lỗi "Email đã được đăng ký"**

---

## 📂 Cấu Trúc Files

```
Phần Đăng Ký:
├── Frontend/
│   ├── pages/signup.html          ← GIAO DIỆN CHÍNH
│   ├── js/api.js                  ← UPDATED: signup API methods
│   ├── SIGNUP_GUIDE.md            ← Hướng dẫn chi tiết
│   └── pages/login.html           ← UPDATED: Thêm link signup
│
├── Backend/
│   ├── controllers/signupController.js  ← LOGIC ĐĂNG KÝ
│   └── routes/auth.js             ← UPDATED: Signup routes
│
└── REGISTRATION_SUMMARY.md        ← Tóm tắt này
```

---

## 🔌 API Endpoints

### POST /api/auth/signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "phone": "0912345678",
    "password": "TestPass123",
    "role": "staff"
  }'
```

---

## ✅ Checklist

- [ ] Backend running trên port 5000
- [ ] Frontend running trên port 5500
- [ ] Truy cập `signup.html`
- [ ] Test form thành công
- [ ] Test lỗi validation
- [ ] Kiểm tra database

---

## 🧪 Browser DevTools

**F12 → Network Tab** để xem request:
1. Điền form
2. Click "Đăng Ký"
3. Xem request `POST /api/auth/signup`
4. Kiểm tra response

---

## 🆘 Lỗi Phổ Biến

| Lỗi | Giải Pháp |
|-----|---------|
| "Không kết nối API" | Kiểm tra backend chạy? |
| "Email/Username trùng" | Dùng email/username khác |
| "Mật khẩu yếu" | Thêm chữ hoa + số |
| "CORS error" | Backend CORS settings |

---

## 📱 Di Chuyển Sau Đăng Ký

- **Admin** → `/pages/dashboard.html`
- **Staff** → `/pages/order.html`
- **Customer** → `/pages/menu.html`

---

## 💡 Tips

1. Mở **2 tab browser**:
   - Tab 1: Login
   - Tab 2: Network DevTools

2. Kiểm tra mật khẩu indicator:
   - ✓ = Xanh (Đạt yêu cầu)
   - ✗ = Xám (Không đạt)

3. Xem real-time validation khi nhập

---

**Tất Cả Sẵn Sàng! 🚀**
