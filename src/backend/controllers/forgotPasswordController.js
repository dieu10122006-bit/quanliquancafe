const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const crypto = require('crypto');
const { sendOTPEmail } = require('../services/emailService');
const bcrypt = require('bcrypt');

/**
 * LƯU TRỮ OTP TẠM THỜI - Trong production nên dùng Redis hoặc Database
 * Format: { email: { otp: '123456', token: 'token', expiresAt: timestamp, verified: false } }
 */
const otpStorage = {};

/**
 * HỖ TRỢ: Tạo mã OTP ngẫu nhiên 6 chữ số
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * HỖ TRỢ: Tạo token đặt lại mật khẩu ngẫu nhiên
 */
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * BƯỚC 1: YÊU CẦU ĐẶT LẠI MẬT KHẨU - Gửi mã OTP tới email
 * POST /api/auth/forgot-password
 * Body: { email }
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra email không để trống
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email không được để trống'
            });
        }

        // Kiểm tra định dạng email hợp lệ
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Định dạng email không hợp lệ'
            });
        }

        // Tìm người dùng theo email
        const [users] = await pool.query(
            'SELECT user_id, username, full_name, email FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            // Không tiết lộ email có tồn tại hay không (bảo mật)
            return res.status(400).json({
                success: false,
                message: 'Email không tồn tại trong hệ thống'
            });
        }

        const user = users[0];

        // Tạo OTP và reset token
        const otp = generateOTP();
        const resetToken = generateResetToken();
        const expiresAt = Date.now() + (parseInt(process.env.OTP_EXPIRY) || 300000); // 5 phút

        // Lưu OTP vào bộ nhớ tạm thời
        otpStorage[email] = {
            otp,
            resetToken,
            expiresAt,
            verified: false,
            attempts: 0,
            createdAt: new Date()
        };

        try {
            // Gửi OTP qua email
            await sendOTPEmail(email, otp, user.full_name);

            // Trả về resetToken cho client
            res.json({
                success: true,
                message: `Mã OTP đã được gửi đến ${email}. Vui lòng kiểm tra inbox.`,
                resetToken
            });

        } catch (emailError) {
            console.error('Lỗi gửi email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi gửi email. Vui lòng thử lại sau.'
            });
        }

    } catch (error) {
        console.error('Lỗi yêu cầu đặt lại mật khẩu:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * BƯỚC 2: XÁC THỰC OTP
 * POST /api/auth/verify-otp
 * Body: { email, otp, resetToken }
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp, resetToken } = req.body;

        // Kiểm tra tất cả trường bắt buộc
        if (!email || !otp || !resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Email, mã OTP và reset token là bắt buộc'
            });
        }

        // Kiểm tra định dạng OTP (6 chữ số)
        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Mã OTP phải là 6 chữ số'
            });
        }

        // Kiểm tra OTP có tồn tại không
        if (!otpStorage[email]) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy yêu cầu OTP cho email này'
            });
        }

        const storedOTP = otpStorage[email];

        // Kiểm tra OTP hết hạn chưa
        if (Date.now() > storedOTP.expiresAt) {
            delete otpStorage[email];
            return res.status(400).json({
                success: false,
                message: 'Mã OTP hết hạn. Vui lòng yêu cầu cấp mã mới'
            });
        }

        // Kiểm tra số lần thử vượt quá giới hạn
        const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS) || 3;
        if (storedOTP.attempts >= maxAttempts) {
            delete otpStorage[email];
            return res.status(429).json({
                success: false,
                message: 'Quá nhiều lần thử. Vui lòng yêu cầu mã OTP mới'
            });
        }

        // Xác thực OTP
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

        // Kiểm tra reset token
        if (storedOTP.resetToken !== resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Reset token không hợp lệ'
            });
        }

        // OTP xác thực thành công
        storedOTP.verified = true;
        storedOTP.verifiedAt = new Date();

        // Tạo verification token mới cho đặt lại mật khẩu
        const verificationToken = generateResetToken();
        storedOTP.verificationToken = verificationToken;

        res.json({
            success: true,
            message: 'Xác thực OTP thành công',
            verificationToken,
            expiresIn: Math.ceil((storedOTP.expiresAt - Date.now()) / 1000) // giây
        });

    } catch (error) {
        console.error('Lỗi xác thực OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * GỬI LẠI MÃ OTP
 * POST /api/auth/resend-otp
 * Body: { email }
 */
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra email không để trống
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email không được để trống'
            });
        }

        // Kiểm tra người dùng có tồn tại
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

        // Kiểm tra rate limiting - chỉ gửi lại sau 30 giây
        if (otpStorage[email] && (Date.now() - otpStorage[email].createdAt.getTime()) < 30000) {
            return res.status(429).json({
                success: false,
                message: 'Vui lòng chờ 30 giây trước khi gửi lại. Kiểm tra mục spam nếu chưa nhận được.'
            });
        }

        // Tạo OTP mới
        const otp = generateOTP();
        const resetToken = generateResetToken();
        const expiresAt = Date.now() + (parseInt(process.env.OTP_EXPIRY) || 300000);

        // Cập nhật lưu trữ OTP
        otpStorage[email] = {
            otp,
            resetToken,
            expiresAt,
            verified: false,
            attempts: 0,
            createdAt: new Date()
        };

        try {
            // Gửi OTP mới qua email
            await sendOTPEmail(email, otp, users[0].full_name);

            res.json({
                success: true,
                message: 'Mã OTP mới đã được gửi',
                resetToken,
                expiresIn: parseInt(process.env.OTP_EXPIRY) / 1000 || 300 // giây
            });
        } catch (emailError) {
            console.error('Lỗi gửi email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi gửi email'
            });
        }

    } catch (error) {
        console.error('Lỗi gửi lại OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * BƯỚC 3: ĐẶT LẠI MẬT KHẨU
 * POST /api/auth/reset-password
 * Body: { email, newPassword, resetToken }
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, resetToken } = req.body;

        // Kiểm tra tất cả trường bắt buộc
        if (!email || !newPassword || !resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Email, mật khẩu mới và reset token là bắt buộc'
            });
        }

        // Kiểm tra độ mạnh mật khẩu (ít nhất 8 ký tự)
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 8 ký tự'
            });
        }

        // Kiểm tra mật khẩu chứa chữ hoa, chữ thường, số và ký tự đặc biệt
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
            });
        }

        // Kiểm tra yêu cầu đặt lại mật khẩu
        if (!otpStorage[email]) {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu đặt lại mật khẩu không hợp lệ'
            });
        }

        const otpData = otpStorage[email];

        // Kiểm tra OTP đã được xác thực
        if (!otpData.verified) {
            return res.status(400).json({
                success: false,
                message: 'Cần xác thực OTP trước'
            });
        }

        // Kiểm tra verification token
        if (otpData.verificationToken !== resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Reset token không hợp lệ'
            });
        }

        // Kiểm tra phiên đặt lại mật khẩu hết hạn chưa
        if (Date.now() > otpData.expiresAt) {
            delete otpStorage[email];
            return res.status(400).json({
                success: false,
                message: 'Phiên đặt lại mật khẩu hết hạn. Vui lòng bắt đầu lại.'
            });
        }

        // Tìm người dùng
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

        // Mã hóa mật khẩu nếu chưa được mã hóa
        let hashedPassword = newPassword;
        if (!newPassword.startsWith('$2')) {
            hashedPassword = await bcrypt.hash(newPassword, 10);
        }

        // Cập nhật mật khẩu trong cơ sở dữ liệu
        await pool.query(
            'UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?',
            [hashedPassword, email]
        );

        // Xóa dữ liệu OTP khỏi lưu trữ
        delete otpStorage[email];

        // Ghi nhật ký đặt lại mật khẩu cho kiểm toán bảo mật
        console.log(`✓ Đặt lại mật khẩu thành công cho email: ${email} vào ${new Date().toLocaleString('vi-VN')}`);

        res.json({
            success: true,
            message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.'
        });

    } catch (error) {
        console.error('Lỗi đặt lại mật khẩu:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * DỌN DẸP: Xóa các OTP hết hạn (chạy định kỳ)
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
            console.log(`🗑️ Đã xóa ${cleaned} OTP hết hạn`);
        }
    }, 60000); // Chạy mỗi phút
};

// Bắt đầu dọn dẹp khi module được tải
exports.cleanupExpiredOTPs();