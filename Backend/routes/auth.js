const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const signupController = require('../controllers/signupController');
const forgotPasswordController = require('../controllers/forgotPasswordController');
const { verifyToken } = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Login with username and password
 */
router.post('/login', authController.login);

/**
 * ========== SIGNUP / REGISTRATION ==========
 */

/**
 * POST /api/auth/signup
 * Register new user account
 */
router.post('/signup', signupController.signup);

/**
 * GET /api/auth/check-username
 * Check if username is available
 */
router.get('/check-username', signupController.checkUsername);

/**
 * GET /api/auth/check-email
 * Check if email is available
 */
router.get('/check-email', signupController.checkEmail);

/**
 * GET /api/auth/me
 * Get current user info (requires token)
 */
router.get('/me', verifyToken, authController.getCurrentUser);

/**
 * ========== FORGOT PASSWORD - 2-LAYER SECURITY ==========
 */

/**
 * POST /api/auth/forgot-password
 * Step 1: Request password reset
 * Send OTP to email
 */
router.post('/forgot-password', forgotPasswordController.forgotPassword);

/**
 * POST /api/auth/verify-otp
 * Step 2: Verify OTP
 * User enters OTP received in email
 */
router.post('/verify-otp', forgotPasswordController.verifyOTP);

/**
 * POST /api/auth/resend-otp
 * Resend OTP to email
 */
router.post('/resend-otp', forgotPasswordController.resendOTP);

/**
 * POST /api/auth/reset-password
 * Step 3: Reset password
 * User sets new password after OTP verification
 */
router.post('/reset-password', forgotPasswordController.resetPassword);

module.exports = router;
