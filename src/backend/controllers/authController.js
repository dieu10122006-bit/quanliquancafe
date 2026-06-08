const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

/**
 * ĐĂNG NHẬP - Xác thực người dùng và tạo JWT token
 * POST /api/auth/login
 * Body: { username, password }
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập và mật khẩu là bắt buộc'
            });
        }

        // Tìm người dùng trong cơ sở dữ liệu
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        const user = users[0];

        // Kiểm tra mật khẩu (hiện tại lưu dưới dạng plain text)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            {
                id: user.user_id,
                username: user.username,
                role: user.role,
                name: user.full_name
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.user_id,
                username: user.username,
                name: user.full_name,
                role: user.role,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * LẤY THÔNG TIN NGƯỜI DÙNG HIỆN TẠI
 * GET /api/auth/current-user
 * Header: Authorization: Bearer token
 */
exports.getCurrentUser = async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT user_id, username, full_name, role, email FROM users WHERE user_id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};
