const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

/**
 * ĐẠT NHẬP / ĐĂNG KÝ NGƯỜI DÙNG MỚI
 * POST /api/auth/signup
 * Body: { username, email, password, fullName, phone, role }
 */
exports.signup = async (req, res) => {
    try {
        const { username, email, password, fullName, phone, role } = req.body;

        // ========== KIỂM ĐỊNH DỮ LIỆU ==========
        if (!username || !email || !password || !fullName || !role) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        // Kiểm tra định dạng tên đăng nhập (3-20 ký tự, chữ số và dấu gạch dưới)
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ, số và dấu gạch dưới'
            });
        }

        // Kiểm tra định dạng email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Địa chỉ email không hợp lệ'
            });
        }

        // Kiểm tra độ mạnh mật khẩu (ít nhất 6 ký tự)
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        // Kiểm tra mật khẩu có chứa chữ hoa và chữ số
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa và 1 chữ số'
            });
        }

        // Kiểm tra họ và tên (ít nhất 3 ký tự)
        if (fullName.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Họ và tên phải có ít nhất 3 ký tự'
            });
        }

        // Kiểm tra số điện thoại nếu có
        if (phone && !/^[0-9]{10,11}$/.test(phone.replace(/[-\s]/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Số điện thoại không hợp lệ'
            });
        }

        // Kiểm tra vai trò
        const validRoles = ['admin', 'staff', 'customer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Vai trò không hợp lệ'
            });
        }

        // ========== KIỂM TRA TRÙNG LẶP ==========
        const [existingUsername] = await pool.query(
            'SELECT username FROM users WHERE username = ?',
            [username]
        );

        if (existingUsername.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Tên đăng nhập đã được sử dụng'
            });
        }

        const [existingEmail] = await pool.query(
            'SELECT email FROM users WHERE email = ?',
            [email]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email đã được đăng ký'
            });
        }

        // ========== TẠO NGƯỜI DÙNG ==========
        // Lưu ý: Trong production, sử dụng bcrypt để mã hóa mật khẩu
        // Hiện tại sử dụng plain text theo hệ thống hiện có
        // const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users 
             (username, email, password, full_name, phone, role, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, email, password, fullName.trim(), phone || null, role, 'active']
        );

        const userId = result.insertId;

        // ========== TẠO JWT TOKEN ==========
        const token = jwt.sign(
            {
                id: userId,
                username: username,
                role: role,
                name: fullName
            },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // ========== TRẢ VỀ KẾT QUẢ ==========
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            token,
            user: {
                id: userId,
                username: username,
                email: email,
                name: fullName,
                role: role,
                phone: phone || null
            }
        });

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau'
        });
    }
};

/**
 * KIỂM TRA TÊN ĐĂNG NHẬP CÓ SẴN
 * GET /api/auth/check-username?username=value
 */
exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập là bắt buộc'
            });
        }

        const [result] = await pool.query(
            'SELECT user_id FROM users WHERE username = ?',
            [username]
        );

        res.json({
            success: true,
            available: result.length === 0
        });

    } catch (error) {
        console.error('Lỗi kiểm tra tên đăng nhập:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * KIỂM TRA EMAIL CÓ SẴN
 * GET /api/auth/check-email?email=value
 */
exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email là bắt buộc'
            });
        }

        const [result] = await pool.query(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );

        res.json({
            success: true,
            available: result.length === 0
        });

    } catch (error) {
        console.error('Lỗi kiểm tra email:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};
