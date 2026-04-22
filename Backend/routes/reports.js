const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, checkRole } = require('../middleware/auth');

/**
 * GET /api/reports/revenue
 * Get revenue report
 */
router.get('/revenue', verifyToken, checkRole(['admin']), reportController.getRevenue);

/**
 * GET /api/reports/products
 * Get product report
 */
router.get('/products', verifyToken, checkRole(['admin']), reportController.getProductReport);

/**
 * GET /api/reports/employees
 * Get employee report
 */
router.get('/employees', verifyToken, checkRole(['admin']), reportController.getEmployeeReport);

/**
 * GET /api/reports/daily-revenue
 * Get daily revenue
 */
router.get('/daily-revenue', verifyToken, checkRole(['admin']), reportController.getDailyRevenue);

module.exports = router;
