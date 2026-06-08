/**
 * Mock Backend Server for Testing
 * Uses in-memory data instead of database
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ===== Mock Data =====
const mockUsers = {
    'admin': { id: 1, username: 'admin', password: 'password123', role: 'admin', name: 'Admin User' },
    'staff_001': { id: 2, username: 'staff_001', password: 'password123', role: 'staff', name: 'Staff User' }
};

let mockOrders = [
    { id: 1, customer_name: 'Customer 1', table: '1', items: [{ product_id: 1, quantity: 2, price: 50000 }], total_amount: 100000, status: 'completed' },
    { id: 2, customer_name: 'Customer 2', table: '2', items: [{ product_id: 2, quantity: 1, price: 30000 }], total_amount: 30000, status: 'pending' }
];

const mockProducts = [
    { id: 1, name: 'Coffee', category_id: 1, price: 50000, stock: 100 },
    { id: 2, name: 'Tea', category_id: 2, price: 30000, stock: 80 },
    { id: 3, name: 'Juice', category_id: 3, price: 25000, stock: 50 },
    { id: 4, name: 'Cake', category_id: 4, price: 45000, stock: 20 }
];

let mockInvoices = [
    { id: 1, order_id: 1, amount_received: 100000, payment_method: 'cash', status: 'completed' }
];

// ===== Middleware =====
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
};

// ===== Health Check =====
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ===== Authentication Routes =====
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = mockUsers[username];
    if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
    const user = Object.values(mockUsers).find(u => u.id === req.user.id);
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
});

// ===== Products Routes =====
app.get('/api/products', (req, res) => {
    const products = mockProducts.map(p => ({ ...p, product_id: p.id }));
    res.json({ success: true, products });
});

app.get('/api/products/:id', (req, res) => {
    const product = mockProducts.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product: { ...product, product_id: product.id } });
});

app.get('/api/products/category/:categoryId', (req, res) => {
    const products = mockProducts.filter(p => p.category_id === parseInt(req.params.categoryId)).map(p => ({ ...p, product_id: p.id }));
    res.json({ success: true, products });
});

app.post('/api/products', verifyToken, checkRole(['admin']), (req, res) => {
    const newProduct = { id: mockProducts.length + 1, ...req.body };
    mockProducts.push(newProduct);
    res.status(201).json({ success: true, product: newProduct });
});

// ===== Orders Routes =====
app.get('/api/orders', verifyToken, checkRole(['admin', 'staff']), (req, res) => {
    const orders = mockOrders.map(o => ({ ...o, order_id: o.id }));
    res.json({ success: true, orders });
});

app.get('/api/orders/:id', verifyToken, (req, res) => {
    const order = mockOrders.find(o => o.id === parseInt(req.params.id));
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order: { ...order, order_id: order.id } });
});

app.post('/api/orders', verifyToken, checkRole(['admin', 'staff']), (req, res) => {
    const { customer_name, table, items } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Order must have items' });
    }
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = {
        id: mockOrders.length + 1,
        customer_name,
        table,
        items,
        total_amount: total,
        status: 'pending',
        order_date: new Date()
    };
    mockOrders.push(newOrder);
    res.status(201).json({ success: true, order_id: newOrder.id, order: { ...newOrder, order_id: newOrder.id } });
});

app.put('/api/orders/:id/status', verifyToken, checkRole(['admin', 'staff']), (req, res) => {
    const order = mockOrders.find(o => o.id === parseInt(req.params.id));
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = req.body.status;
    res.json({ success: true, order: { ...order, order_id: order.id } });
});

// ===== Payments Routes =====
app.post('/api/payments/process', verifyToken, checkRole(['admin', 'staff']), (req, res) => {
    const { order_id, amount_received, payment_method } = req.body;
    const order = mockOrders.find(o => o.id === order_id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    const invoice = {
        id: mockInvoices.length + 1,
        order_id,
        amount_received,
        payment_method,
        status: 'completed',
        change: amount_received - order.total_amount,
        invoice_id: mockInvoices.length + 1
    };
    mockInvoices.push(invoice);
    order.status = 'completed';
    res.json({ success: true, data: { order_id, invoice_id: invoice.id, change: invoice.change } });
});

app.get('/api/payments/invoices', verifyToken, checkRole(['admin', 'staff']), (req, res) => {
    const invoices = mockInvoices.map(i => ({ ...i, invoice_id: i.id }));
    res.json({ success: true, invoices });
});

app.get('/api/payments/:orderId', verifyToken, (req, res) => {
    const invoice = mockInvoices.find(i => i.order_id === parseInt(req.params.orderId));
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, invoice: { ...invoice, invoice_id: invoice.id } });
});

// ===== Reports Routes =====
app.get('/api/reports/revenue', verifyToken, checkRole(['admin']), (req, res) => {
    const totalRevenue = mockOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    res.json({ success: true, data: { totalRevenue, ordersCount: mockOrders.length, customersCount: 5 } });
});

app.get('/api/reports/products', verifyToken, checkRole(['admin']), (req, res) => {
    const products = mockProducts.map(p => ({ ...p, product_id: p.id }));
    res.json({ success: true, products });
});

app.get('/api/reports/employees', verifyToken, checkRole(['admin']), (req, res) => {
    const employees = Object.values(mockUsers).map(u => ({ ...u, employee_id: u.id }));
    res.json({ success: true, employees });
});

app.get('/api/reports/daily-revenue', verifyToken, checkRole(['admin']), (req, res) => {
    const dailyRevenue = [{ date: new Date().toDateString(), revenue: 100000, orders: 2 }];
    res.json({ success: true, data: dailyRevenue });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║   ☕ CAFE MANAGEMENT SYSTEM - Mock Backend ☕           ║`);
    console.log(`╠════════════════════════════════════════════════════════════╣`);
    console.log(`║                                                            ║`);
    console.log(`║  ✓ Server running on: http://localhost:${PORT}              ║`);
    console.log(`║  ✓ Mode: Mock (in-memory data, no database needed)         ║`);
    console.log(`║  ✓ Test credentials: admin / password123                   ║`);
    console.log(`║                                 staff_001 / password123     ║`);
    console.log(`║                                                            ║`);
    console.log(`║  Ready for testing! Run: npm test                          ║`);
    console.log(`║                                                            ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});
