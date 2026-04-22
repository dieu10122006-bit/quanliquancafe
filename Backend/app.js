const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import email service
const { initializeEmailService } = require('./services/emailService');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
async function startServer() {
    try {
        // Initialize email service
        await initializeEmailService();
    } catch (error) {
        console.error('⚠️ Warning: Email service initialization failed (non-critical):', error.message);
    }

    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║   ☕ CAFE MANAGEMENT SYSTEM - Backend Server ☕          ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  ✓ Server running on: http://localhost:${PORT}          ║
║  ✓ Environment: ${process.env.NODE_ENV || 'development'}                  ║
║  ✓ Database: ${process.env.DB_NAME}                           ║
║  ✓ Email Service: Initialized                             ║
║                                                            ║
║  API Routes:                                               ║
║  • POST   /api/auth/login              - Login            ║
║  • GET    /api/auth/me                 - Current user     ║
║  • POST   /api/auth/forgot-password    - Send OTP         ║
║  • POST   /api/auth/verify-otp         - Verify OTP       ║
║  • POST   /api/auth/reset-password     - Reset Password   ║
║  • GET    /api/products                - List products    ║
║  • POST   /api/products                - Create product   ║
║  • GET    /api/orders                  - List orders      ║
║  • POST   /api/orders                  - Create order     ║
║  • POST   /api/payments/process        - Process payment  ║
║  • GET    /api/reports/revenue         - Revenue report   ║
║                                                            ║
║  Ctrl+C to stop server                                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
        `);
    });
}

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

module.exports = app;
