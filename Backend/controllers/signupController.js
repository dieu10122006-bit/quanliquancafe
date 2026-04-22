const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

/**
 * Register/Signup new user
 */
exports.signup = async (req, res) => {
    try {
        const { username, email, password, fullName, phone, role } = req.body;

        // ========== VALIDATION ==========
        if (!username || !email || !password || !fullName || !role) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        // Validate username format (3-20 characters, alphanumeric and underscore)
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ, số và dấu gạch dưới'
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Địa chỉ email không hợp lệ'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        // Validate password has uppercase and number
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa và 1 chữ số'
            });
        }

        // Validate full name
        if (fullName.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Họ và tên phải có ít nhất 3 ký tự'
            });
        }

        // Validate phone if provided
        if (phone && !/^[0-9]{10,11}$/.test(phone.replace(/[-\s]/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Số điện thoại không hợp lệ'
            });
        }

        // Validate role
        const validRoles = ['admin', 'staff', 'customer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Vai trò không hợp lệ'
            });
        }

        // ========== CHECK DUPLICATE ==========
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

        // ========== CREATE USER ==========
        // Note: In production, use bcrypt to hash password
        // For now using plain text as per existing system
        // const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users 
             (username, email, password, full_name, phone, role, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, email, password, fullName.trim(), phone || null, role, 'active']
        );

        const userId = result.insertId;

        // ========== CREATE JWT TOKEN ==========
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

        // ========== SEND RESPONSE ==========
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
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau'
        });
    }
};

/**
 * Check username availability
 */
exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
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
        console.error('CheckUsername error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Check email availability
 */
exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
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
        console.error('CheckEmail error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
