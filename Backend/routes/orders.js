const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, checkRole } = require('../middleware/auth');

/**
 * GET /api/orders
 * Get all orders
 */
router.get('/', verifyToken, checkRole(['admin', 'staff']), orderController.getAllOrders);

/**
 * GET /api/orders/:id
 * Get order by ID
 */
router.get('/:id', verifyToken, orderController.getOrderById);

/**
 * POST /api/orders
 * Create new order
 */
router.post('/', verifyToken, checkRole(['admin', 'staff']), orderController.createOrder);

/**
 * PUT /api/orders/:id/status
 * Update order status
 */
router.put('/:id/status', verifyToken, checkRole(['admin', 'staff']), orderController.updateOrderStatus);

/**
 * DELETE /api/orders/:id
 * Delete order
 */
router.delete('/:id', verifyToken, checkRole(['admin']), orderController.deleteOrder);

module.exports = router;
