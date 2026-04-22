const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, checkRole } = require('../middleware/auth');

/**
 * GET /api/products
 * Get all products
 */
router.get('/', productController.getAllProducts);

/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get('/:id', productController.getProductById);

/**
 * GET /api/products/category/:categoryId
 * Get products by category
 */
router.get('/category/:categoryId', productController.getProductsByCategory);

/**
 * POST /api/products (Admin only)
 * Create new product
 */
router.post('/', verifyToken, checkRole(['admin']), productController.createProduct);

/**
 * PUT /api/products/:id (Admin only)
 * Update product
 */
router.put('/:id', verifyToken, checkRole(['admin']), productController.updateProduct);

/**
 * DELETE /api/products/:id (Admin only)
 * Delete product
 */
router.delete('/:id', verifyToken, checkRole(['admin']), productController.deleteProduct);

module.exports = router;
