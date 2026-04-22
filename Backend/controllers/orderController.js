const pool = require('../config/database');

/**
 * Get all orders
 */
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.order_id, o.customer_name, o.table_number, o.order_date, 
                    o.final_amount, o.status, COUNT(od.order_detail_id) as item_count
             FROM orders o
             LEFT JOIN order_details od ON o.order_id = od.order_id
             GROUP BY o.order_id
             ORDER BY o.order_date DESC
             LIMIT 100`
        );

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('GetAllOrders error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get order by ID
 */
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE order_id = ?',
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Get order details
        const [details] = await pool.query(
            `SELECT od.order_detail_id, od.product_id, p.product_name, 
                    od.quantity, od.unit_price, od.subtotal
             FROM order_details od
             LEFT JOIN products p ON od.product_id = p.product_id
             WHERE od.order_id = ?`,
            [id]
        );

        res.json({
            success: true,
            order: orders[0],
            items: details
        });
    } catch (error) {
        console.error('GetOrderById error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Create new order
 */
exports.createOrder = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const { customer_name, table_number, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }

        // Calculate total
        let totalAmount = 0;
        for (const item of items) {
            totalAmount += item.quantity * item.unit_price;
        }

        // Create order
        const [orderResult] = await connection.query(
            `INSERT INTO orders (customer_name, table_number, order_date, final_amount, status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            [customer_name || 'Unknown', table_number || null, totalAmount, 'pending']
        );

        const orderId = orderResult.insertId;

        // Add order details
        for (const item of items) {
            const subtotal = item.quantity * item.unit_price;
            await connection.query(
                `INSERT INTO order_details (order_id, product_id, quantity, unit_price, subtotal) 
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.unit_price, subtotal]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order_id: orderId
        });

    } catch (error) {
        await connection.rollback();
        console.error('CreateOrder error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        connection.release();
    }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        await pool.query(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            [status, id]
        );

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('UpdateOrderStatus error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Delete order
 */
exports.deleteOrder = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const { id } = req.params;

        // Delete order details first
        await connection.query(
            'DELETE FROM order_details WHERE order_id = ?',
            [id]
        );

        // Delete order
        await connection.query(
            'DELETE FROM orders WHERE order_id = ?',
            [id]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        await connection.rollback();
        console.error('DeleteOrder error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        connection.release();
    }
};
