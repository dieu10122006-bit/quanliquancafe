const express = require("express");
const router = express.Router();

// Import các controller xử lý logic
const authController = require("../controllers/authController"); // login, lấy thông tin user
const signupController = require("../controllers/signupController"); // đăng ký
const forgotPasswordController = require("../controllers/forgotPasswordController"); // quên mật khẩu

// Import middleware kiểm tra token (đăng nhập)
const { verifyToken } = require("../middleware/auth");

/**
 * POST /api/auth/login
 * Đăng nhập bằng username + password
 */
router.post("/login", authController.login);

/**
 * ========== SIGNUP / REGISTRATION ==========
 */

/**
 * POST /api/auth/signup
 * Tạo tài khoản mới
 */
router.post("/signup", signupController.signup);

/**
 * GET /api/auth/check-username
 * Kiểm tra username đã tồn tại chưa
 */
router.get("/check-username", signupController.checkUsername);

/**
 * GET /api/auth/check-email
 * Kiểm tra email đã tồn tại chưa
 */
router.get("/check-email", signupController.checkEmail);

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại
 * → cần đăng nhập (có token)
 */
router.get("/me", verifyToken, authController.getCurrentUser);

/**
 * ========== FORGOT PASSWORD - 2-LAYER SECURITY ==========
 */

/**
 * POST /api/auth/forgot-password
 * Bước 1: Yêu cầu đặt lại mật khẩu
 * → gửi OTP về email
 */
router.post("/forgot-password", forgotPasswordController.forgotPassword);

/**
 * POST /api/auth/verify-otp
 * Bước 2: Xác nhận OTP
 * → user nhập mã OTP nhận được
 */
router.post("/verify-otp", forgotPasswordController.verifyOTP);

/**
 * POST /api/auth/resend-otp
 * Gửi lại OTP nếu chưa nhận được
 */
router.post("/resend-otp", forgotPasswordController.resendOTP);

/**
 * POST /api/auth/reset-password
 * Bước 3: Đặt lại mật khẩu
 * → sau khi OTP đúng thì đổi mật khẩu mới
 */
router.post("/reset-password", forgotPasswordController.resetPassword);

// Export router để dùng ở app chính
module.exports = router;
