const pool = require('../config/database');

/**
 * LẤY HÓA ĐƠN CHI TIẾT THEO ID ĐƠN HÀNG
 * GET /api/payments/invoice/:orderId
 */
exports.getInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Lấy thông tin đơn hàng
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE order_id = ?',
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Lấy chi tiết các mục trong đơn hàng
        const [details] = await pool.query(
            `SELECT od.product_id, p.product_name, od.quantity, od.unit_price, od.subtotal
             FROM order_details od
             LEFT JOIN products p ON od.product_id = p.product_id
             WHERE od.order_id = ?`,
            [orderId]
        );

        res.json({
            success: true,
            invoice: {
                order_id: orders[0].order_id,
                customer_name: orders[0].customer_name,
                order_date: orders[0].order_date,
                items: details,
                total_amount: orders[0].final_amount,
                status: orders[0].status
            }
        });
    } catch (error) {
        console.error('Lỗi lấy hóa đơn:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * XỬ LÝ THANH TOÁN
 * POST /api/payments/process
 * Body: { order_id, payment_method, amount_received, notes }
 */
exports.processPayment = async (req, res) => {
    try {
        const { order_id, payment_method, amount_received, notes } = req.body;

        // Kiểm tra thông tin bắt buộc
        if (!order_id || !payment_method) {
            return res.status(400).json({
                success: false,
                message: 'ID đơn hàng và phương thức thanh toán là bắt buộc'
            });
        }

        // Kiểm tra đơn hàng có tồn tại
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE order_id = ?',
            [order_id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Tạo bản ghi hóa đơn
        await pool.query(
            `INSERT INTO invoices (order_id, invoice_date, total_amount, paid_amount, payment_method, notes, status)
             VALUES (?, NOW(), ?, ?, ?, ?, ?)`,
            [order_id, orders[0].final_amount, amount_received, payment_method, notes, 'completed']
        );

        // Cập nhật trạng thái đơn hàng
        await pool.query(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            ['completed', order_id]
        );

        const change = amount_received - orders[0].final_amount;

        res.json({
            success: true,
            message: 'Thanh toán được xử lý thành công',
            data: {
                order_id,
                total_amount: orders[0].final_amount,
                amount_received,
                change: change > 0 ? change : 0,
                payment_method
            }
        });
    } catch (error) {
        console.error('Lỗi xử lý thanh toán:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * LẤY DANH SÁCH TẤT CẢ HÓA ĐƠN
 * GET /api/payments/invoices
 */
exports.getAllInvoices = async (req, res) => {
    try {
        const [invoices] = await pool.query(
            `SELECT i.invoice_id, i.order_id, o.customer_name, i.invoice_date, 
                    i.total_amount, i.paid_amount, i.payment_method, i.status
             FROM invoices i
             LEFT JOIN orders o ON i.order_id = o.order_id
             ORDER BY i.invoice_date DESC
             LIMIT 100`
        );

        res.json({
            success: true,
            invoices
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách hóa đơn:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};
