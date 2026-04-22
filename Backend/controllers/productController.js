const pool = require('../config/database');

/**
 * Get all products
 */
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await pool.query(
            `SELECT p.product_id, p.product_name, p.price, p.description, 
                    c.category_id, c.category_name, p.image_url, p.status
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             ORDER BY p.product_id`
        );

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('GetAllProducts error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get product by ID
 */
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await pool.query(
            `SELECT p.product_id, p.product_name, p.price, p.description, 
                    c.category_id, c.category_name, p.image_url, p.status
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             WHERE p.product_id = ?`,
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product: products[0]
        });
    } catch (error) {
        console.error('GetProductById error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get products by category
 */
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const [products] = await pool.query(
            `SELECT p.product_id, p.product_name, p.price, p.description, 
                    c.category_id, c.category_name, p.image_url, p.status
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             WHERE p.category_id = ?
             ORDER BY p.product_id`,
            [categoryId]
        );

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('GetProductsByCategory error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Create product (Admin only)
 */
exports.createProduct = async (req, res) => {
    try {
        const { product_name, category_id, price, description } = req.body;

        if (!product_name || !category_id || !price) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        await pool.query(
            'INSERT INTO products (product_name, category_id, price, description, status) VALUES (?, ?, ?, ?, ?)',
            [product_name, category_id, price, description, 'active']
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('CreateProduct error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Update product (Admin only)
 */
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, category_id, price, description, status } = req.body;

        await pool.query(
            'UPDATE products SET product_name = ?, category_id = ?, price = ?, description = ?, status = ? WHERE product_id = ?',
            [product_name, category_id, price, description, status, id]
        );

        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('UpdateProduct error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Delete product (Admin only)
 */
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM products WHERE product_id = ?', [id]);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('DeleteProduct error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
