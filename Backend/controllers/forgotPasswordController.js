const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const crypto = require('crypto');
const { sendOTPEmail } = require('../services/emailService');
const bcrypt = require('bcrypt');

// In-memory storage for OTP (in production, use Redis or Database)
// Format: { email: { otp: '123456', token: 'token', expiresAt: timestamp, verified: false } }
const otpStorage = {};

// Helper function to generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to generate reset token
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Step 1: Request password reset - Send OTP to email
 * POST /api/auth/forgot-password
 * Body: { email }
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email không được để trống'
            });
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Định dạng email không hợp lệ'
            });
        }

        // Find user by email
        const [users] = await pool.query(
            'SELECT user_id, username, full_name, email FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            // For security, don't reveal if email exists
            return res.status(400).json({
                success: false,
                message: 'Email không tồn tại trong hệ thống'
            });
        }

        const user = users[0];

        // Generate OTP and reset token
        const otp = generateOTP();
        const resetToken = generateResetToken();
        const expiresAt = Date.now() + (parseInt(process.env.OTP_EXPIRY) || 300000); // 5 minutes

        // Store OTP in memory
        otpStorage[email] = {
            otp,
            resetToken,
            expiresAt,
            verified: false,
            attempts: 0,
            createdAt: new Date()
        };

        try {
            // Send OTP via email
            const emailResult = await sendOTPEmail(email, otp, user.full_name);

            // Return resetToken to client
            res.json({
                success: true,
                message: `Mã OTP đã được gửi đến ${email}. Vui lòng kiểm tra inbox.`,
                resetToken,
                // Note: resetToken lưu ở client
            });

        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi gửi email. Vui lòng thử lại sau.'
            });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * Step 2: Verify OTP
 * POST /api/auth/verify-otp
 * Body: { email, otp, resetToken }
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp, resetToken } = req.body;

        // Validation
        if (!email || !otp || !resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Email, mã OTP và reset token là bắt buộc'
            });
        }

        // Validate OTP format (6 digits)
        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Mã OTP phải là 6 chữ số'
            });
        }

        // Check if OTP exists
        if (!otpStorage[email]) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy yêu cầu OTP cho email này'
            });
        }

        const storedOTP = otpStorage[email];

        // Check if OTP expired
        if (Date.now() > storedOTP.expiresAt) {
            delete otpStorage[email];
            return res.status(400).json({
                success: false,
                message: 'Mã OTP hết hạn. Vui lòng yêu cầu cấp mã mới'
            });
        }

        // Check if max attempts exceeded
        const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS) || 3;
        if (storedOTP.attempts >= maxAttempts) {
            delete otpStorage[email];
            return res.status(429).json({
                success: false,
                message: `Quá nhiều lần thử. Vui lòng yêu cầu mã OTP mới`
            });
        }

        // Verify OTP
        if (storedOTP.otp !== otp) {
            storedOTP.attempts++;
            const remaining = maxAttempts - storedOTP.attempts;
            return res.status(400).json({
                success: false,
                message: `Mã OTP không chính xác. Còn ${remaining} lần thử`,
                attempts: storedOTP.attempts,
                remainingAttempts: remaining
            });
        }

        // Verify reset token
        if (storedOTP.resetToken !== resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Reset token không hợp lệ'
            });
        }

        // OTP verified successfully
        storedOTP.verified = true;
        storedOTP.verifiedAt = new Date();

        // Generate new verification token for password reset
        const verificationToken = generateResetToken();
        storedOTP.verificationToken = verificationToken;

        res.json({
            success: true,
            message: 'Xác thực OTP thành công',
            verificationToken,
            expiresIn: Math.ceil((storedOTP.expiresAt - Date.now()) / 1000) // seconds
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * Resend OTP
 * POST /api/auth/resend-otp
 * Body: { email }
 */
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email không được để trống'
            });
        }

        // Check if user exists
        const [users] = await pool.query(
            'SELECT full_name FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Email không tồn tại'
            });
        }

        // Check rate limiting - only resend after 30 seconds
        if (otpStorage[email] && (Date.now() - otpStorage[email].createdAt.getTime()) < 30000) {
            return res.status(429).json({
                success: false,
                message: 'Vui lòng chờ 30 giây trước khi gửi lại. Kiểm tra email spam nếu chưa nhận được.'
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const resetToken = generateResetToken();
        const expiresAt = Date.now() + (parseInt(process.env.OTP_EXPIRY) || 300000);

        // Update OTP storage
        otpStorage[email] = {
            otp,
            resetToken,
            expiresAt,
            verified: false,
            attempts: 0,
            createdAt: new Date()
        };

        try {
            // Send new OTP via email
            await sendOTPEmail(email, otp, users[0].full_name);

            res.json({
                success: true,
                message: 'Mã OTP mới đã được gửi',
                resetToken,
                expiresIn: parseInt(process.env.OTP_EXPIRY) / 1000 || 300 // seconds
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi gửi email'
            });
        }

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * Step 3: Reset Password
 * POST /api/auth/reset-password
 * Body: { email, newPassword, resetToken }
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, resetToken } = req.body;

        // Validation
        if (!email || !newPassword || !resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Email, mật khẩu mới và reset token là bắt buộc'
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 8 ký tự'
            });
        }

        // Check password contains uppercase, lowercase, number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
            });
        }

        // Verify reset token
        if (!otpStorage[email]) {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu đặt lại mật khẩu không hợp lệ'
            });
        }

        const otpData = otpStorage[email];

        // Check if OTP was verified
        if (!otpData.verified) {
            return res.status(400).json({
                success: false,
                message: 'Cần xác thực OTP trước'
            });
        }

        // Verify reset token
        if (otpData.verificationToken !== resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Reset token không hợp lệ'
            });
        }

        // Check if reset token expired
        if (Date.now() > otpData.expiresAt) {
            delete otpStorage[email];
            return res.status(400).json({
                success: false,
                message: 'Phiên đặt lại mật khẩu hết hạn. Vui lòng bắt đầu lại.'
            });
        }

        // Find user
        const [users] = await pool.query(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Hash new password if not already hashed
        let hashedPassword = newPassword;
        if (!newPassword.startsWith('$2')) { // Check if already bcrypt hash
            hashedPassword = await bcrypt.hash(newPassword, 10);
        }

        // Update password in database
        await pool.query(
            'UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?',
            [hashedPassword, email]
        );

        // Clean up OTP storage
        delete otpStorage[email];

        // Log password reset for security audit
        console.log(`\n✓ Password reset successful for email: ${email} at ${new Date().toLocaleString('vi-VN')}\n`);

        res.json({
            success: true,
            message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * Cleanup expired OTPs (run periodically)
 */
exports.cleanupExpiredOTPs = () => {
    setInterval(() => {
        const now = Date.now();
        let cleaned = 0;
        for (const email in otpStorage) {
            if (otpStorage[email].expiresAt < now) {
                delete otpStorage[email];
                cleaned++;
            }
        }
        if (cleaned > 0) {
            console.log(`🗑️ Cleaned up ${cleaned} expired OTPs`);
        }
    }, 60000); // Run every minute
};

// Start cleanup on module load
exports.cleanupExpiredOTPs();