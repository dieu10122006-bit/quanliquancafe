const pool = require('../config/database');

/**
 * Get revenue report
 */
exports.getRevenue = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        let query = 'SELECT SUM(final_amount) as totalRevenue, COUNT(*) as ordersCount, COUNT(DISTINCT customer_name) as customersCount FROM orders WHERE status = "completed"';
        const params = [];

        if (fromDate && toDate) {
            query += ' AND DATE(order_date) BETWEEN ? AND ?';
            params.push(fromDate, toDate);
        }

        const [result] = await pool.query(query, params);

        res.json({
            success: true,
            data: {
                totalRevenue: result[0].totalRevenue || 0,
                ordersCount: result[0].ordersCount || 0,
                customersCount: result[0].customersCount || 0
            }
        });
    } catch (error) {
        console.error('GetRevenue error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get product report
 */
exports.getProductReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        let query = `
            SELECT p.product_id, p.product_name, c.category_name, 
                   SUM(od.quantity) as sold_count, SUM(od.subtotal) as total_revenue
            FROM order_details od
            LEFT JOIN products p ON od.product_id = p.product_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE 1=1
        `;
        const params = [];

        if (fromDate && toDate) {
            query += ` AND DATE(od.order_date) BETWEEN ? AND ?`;
            params.push(fromDate, toDate);
        }

        query += ` GROUP BY od.product_id ORDER BY sold_count DESC LIMIT 10`;

        const [products] = await pool.query(query, params);

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('GetProductReport error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get employee report
 */
exports.getEmployeeReport = async (req, res) => {
    try {
        const [employees] = await pool.query(
            'SELECT employee_id, full_name, position, email, phone, hire_date, status FROM employees ORDER BY employee_id'
        );

        res.json({
            success: true,
            employees
        });
    } catch (error) {
        console.error('GetEmployeeReport error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get daily revenue
 */
exports.getDailyRevenue = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        let query = `
            SELECT DATE(order_date) as date, 
                   SUM(final_amount) as revenue, 
                   COUNT(*) as orders,
                   COUNT(DISTINCT customer_name) as customers,
                   AVG(final_amount) as average_order_value
            FROM orders
            WHERE status = "completed"
        `;
        const params = [];

        if (fromDate && toDate) {
            query += ` AND DATE(order_date) BETWEEN ? AND ?`;
            params.push(fromDate, toDate);
        }

        query += ` GROUP BY DATE(order_date) ORDER BY date DESC`;

        const [data] = await pool.query(query, params);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('GetDailyRevenue error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
