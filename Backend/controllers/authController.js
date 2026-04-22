const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

/**
 * Login user
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const user = users[0];

        // Check password (for demo, passwords are plain text in DB)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Create JWT token
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
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get current user info
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
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('GetCurrentUser error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
