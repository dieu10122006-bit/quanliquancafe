const pool = require('../config/database');

/**
 * LẤY DANH SÁCH TẤT CẢ ĐƠN HÀNG (Có phân trang)
 * GET /api/orders?page=1&limit=10&status=pending
 */
exports.getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        // Xây dựng câu truy vấn động
        let whereClause = '';
        let params = [limit, offset];

        if (status) {
            whereClause = 'WHERE o.status = ?';
            params.unshift(status);
        }

        const [orders] = await pool.query(
            `SELECT o.order_id, o.customer_name, o.table_number, o.order_date,
                    o.final_amount, o.status, COUNT(od.order_detail_id) as item_count
             FROM orders o
             LEFT JOIN order_details od ON o.order_id = od.order_id
             ${whereClause}
             GROUP BY o.order_id
             ORDER BY o.order_date DESC
             LIMIT ? OFFSET ?`,
            params
        );

        // Lấy tổng số đơn hàng để tính phân trang
        const [countResult] = await pool.query(
            `SELECT COUNT(*) as total FROM orders ${whereClause.replace('o.status', 'status')}`,
            status ? [status] : []
        );

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * LẤY THÔNG TIN CHI TIẾT ĐƠN HÀNG THEO ID
 * GET /api/orders/:id
 */
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra ID hợp lệ
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID đơn hàng không hợp lệ'
            });
        }

        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE order_id = ?',
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Lấy chi tiết các mục trong đơn hàng
        const [details] = await pool.query(
            `SELECT od.order_detail_id, od.product_id, p.product_name,
                    od.quantity, od.unit_price, od.subtotal
             FROM order_details od
             LEFT JOIN products p ON od.product_id = p.product_id
             WHERE od.order_id = ?
             ORDER BY od.order_detail_id`,
            [id]
        );

        res.json({
            success: true,
            order: orders[0],
            items: details
        });
    } catch (error) {
        console.error('Lỗi lấy thông tin đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * TẠO ĐƠN HÀNG MỚI
 * POST /api/orders
 * Body: { customer_name, table_number, items: [{product_id, quantity, unit_price}] }
 */
exports.createOrder = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { customer_name, table_number, items } = req.body;

        // ========== KIỂM TRA DỮ LIỆU ĐẦU VÀO ==========
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Đơn hàng phải chứa ít nhất một mục'
            });
        }

        if (items.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Đơn hàng không được vượt quá 50 mục'
            });
        }

        // Kiểm tra từng mục trong đơn hàng
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (!item.product_id || !item.quantity || !item.unit_price) {
                return res.status(400).json({
                    success: false,
                    message: `Mục ${i + 1}: Thiếu thông tin bắt buộc (product_id, quantity, unit_price)`
                });
            }

            if (item.quantity <= 0 || item.quantity > 100) {
                return res.status(400).json({
                    success: false,
                    message: `Mục ${i + 1}: Số lượng phải từ 1 đến 100`
                });
            }

            if (item.unit_price <= 0 || item.unit_price > 10000000) {
                return res.status(400).json({
                    success: false,
                    message: `Mục ${i + 1}: Đơn giá không hợp lệ`
                });
            }
        }

        // ========== KIỂM TRA TỒN TẠI CỦA SẢN PHẨM ==========
        const productIds = items.map(item => item.product_id);
        const [existingProducts] = await connection.query(
            'SELECT product_id, product_name, status FROM products WHERE product_id IN (?)',
            [productIds]
        );

        if (existingProducts.length !== productIds.length) {
            const foundIds = existingProducts.map(p => p.product_id);
            const missingIds = productIds.filter(id => !foundIds.includes(id));
            return res.status(400).json({
                success: false,
                message: `Sản phẩm không tồn tại: ${missingIds.join(', ')}`
            });
        }

        // Kiểm tra sản phẩm có đang active không
        const inactiveProducts = existingProducts.filter(p => p.status !== 'active');
        if (inactiveProducts.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Sản phẩm không khả dụng: ${inactiveProducts.map(p => p.product_name).join(', ')}`
            });
        }

        // ========== TÍNH TỔNG TIỀN ==========
        let totalAmount = 0;
        for (const item of items) {
            totalAmount += item.quantity * item.unit_price;
        }

        if (totalAmount <= 0 || totalAmount > 50000000) {
            return res.status(400).json({
                success: false,
                message: 'Tổng tiền đơn hàng không hợp lệ'
            });
        }

        // ========== TẠO ĐƠN HÀNG ==========
        const [orderResult] = await connection.query(
            `INSERT INTO orders (customer_name, table_number, order_date, final_amount, status)
             VALUES (?, ?, NOW(), ?, ?)`,
            [customer_name || 'Khách hàng', table_number || null, totalAmount, 'pending']
        );

        const orderId = orderResult.insertId;

        // ========== THÊM CHI TIẾT ĐƠN HÀNG ==========
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
            message: 'Đơn hàng được tạo thành công',
            order_id: orderId,
            total_amount: totalAmount,
            item_count: items.length
        });

    } catch (error) {
        await connection.rollback();
        console.error('Lỗi tạo đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    } finally {
        connection.release();
    }
};

/**
 * CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
 * PUT /api/orders/:id/status
 * Body: { status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled" }
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Kiểm tra ID hợp lệ
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID đơn hàng không hợp lệ'
            });
        }

        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Trạng thái không hợp lệ. Các trạng thái hợp lệ: ${validStatuses.join(', ')}`
            });
        }

        // Kiểm tra đơn hàng có tồn tại không
        const [existingOrder] = await pool.query(
            'SELECT order_id, status FROM orders WHERE order_id = ?',
            [id]
        );

        if (existingOrder.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Ngăn chặn việc cập nhật trạng thái không hợp lý
        const currentStatus = existingOrder[0].status;
        if (currentStatus === 'completed' || currentStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Không thể cập nhật trạng thái của đơn hàng đã hoàn thành hoặc đã hủy'
            });
        }

        // Cập nhật trạng thái
        await pool.query(
            'UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?',
            [status, id]
        );

        res.json({
            success: true,
            message: 'Trạng thái đơn hàng được cập nhật thành công',
            order_id: id,
            old_status: currentStatus,
            new_status: status
        });
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * XÓA ĐƠN HÀNG
 * DELETE /api/orders/:id
 * Chỉ cho phép xóa đơn hàng ở trạng thái 'pending' hoặc 'cancelled'
 */
exports.deleteOrder = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params;

        // Kiểm tra ID hợp lệ
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID đơn hàng không hợp lệ'
            });
        }

        // Kiểm tra đơn hàng có tồn tại và trạng thái cho phép xóa
        const [existingOrder] = await connection.query(
            'SELECT order_id, status, customer_name FROM orders WHERE order_id = ?',
            [id]
        );

        if (existingOrder.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        const orderStatus = existingOrder[0].status;

        // Chỉ cho phép xóa đơn hàng pending hoặc cancelled
        if (!['pending', 'cancelled'].includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: `Không thể xóa đơn hàng ở trạng thái "${orderStatus}". Chỉ có thể xóa đơn hàng ở trạng thái "pending" hoặc "cancelled"`
            });
        }

        // Xóa chi tiết đơn hàng trước
        await connection.query(
            'DELETE FROM order_details WHERE order_id = ?',
            [id]
        );

        // Xóa đơn hàng
        await connection.query(
            'DELETE FROM orders WHERE order_id = ?',
            [id]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Đơn hàng được xóa thành công',
            order_id: id,
            customer_name: existingOrder[0].customer_name
        });
    } catch (error) {
        await connection.rollback();
        console.error('Lỗi xóa đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
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
