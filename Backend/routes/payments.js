const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, checkRole } = require('../middleware/auth');

/**
 * GET /api/payments/invoices
 * Get all invoices
 */
router.get('/invoices', verifyToken, checkRole(['admin', 'staff']), paymentController.getAllInvoices);

/**
 * GET /api/payments/:orderId
 * Get invoice by order ID
 */
router.get('/:orderId', verifyToken, paymentController.getInvoice);

/**
 * POST /api/payments/process
 * Process payment
 */
router.post('/process', verifyToken, checkRole(['admin', 'staff']), paymentController.processPayment);

module.exports = router;
