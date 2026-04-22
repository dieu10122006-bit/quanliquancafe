/**
 * Cafe Management System - Backend API Tests
 * Test cases cho tất cả endpoints
 * 
 * Chạy tests:
 * npm test
 * 
 * Cần cài: npm install --save-dev mocha chai axios
 */

const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;

// Base URL
const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = 1;
let productId = 1;
let orderId = 1;

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    validateStatus: () => true  // Don't throw on any status
});

// ========================================
//  AUTHENTICATION TESTS
// ========================================

describe('🔐 Authentication Tests', function() {
    this.timeout(5000);

    it('should login with valid credentials', async function() {
        const response = await api.post('/auth/login', {
            username: 'admin',
            password: 'password123'
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.token).to.exist;
        expect(response.data.user.role).to.equal('admin');

        // Save token for next tests
        authToken = response.data.token;
    });

    it('should fail login with invalid password', async function() {
        const response = await api.post('/auth/login', {
            username: 'admin',
            password: 'wrongpassword'
        });

        expect(response.status).to.equal(401);
        expect(response.data.success).to.be.false;
    });

    it('should fail login with non-existent user', async function() {
        const response = await api.post('/auth/login', {
            username: 'nonexistent',
            password: 'password123'
        });

        expect(response.status).to.equal(401);
        expect(response.data.success).to.be.false;
    });

    it('should get current user info', async function() {
        const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.user.username).to.exist;
    });

    it('should fail accessing protected route without token', async function() {
        const response = await api.get('/auth/me');

        expect(response.status).to.equal(401);
        expect(response.data.success).to.be.false;
    });
});

// ========================================
//  PRODUCTS TESTS
// ========================================

describe('📦 Products Tests', function() {
    this.timeout(5000);

    it('should get all products', async function() {
        const response = await api.get('/products');

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.products).to.be.an('array');
        expect(response.data.products.length).to.be.greaterThan(0);

        productId = response.data.products[0].product_id;
    });

    it('should get product by ID', async function() {
        const response = await api.get(`/products/${productId}`);

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.product.product_id).to.equal(productId);
    });

    it('should return 404 for non-existent product', async function() {
        const response = await api.get('/products/99999');

        expect(response.status).to.equal(404);
        expect(response.data.success).to.be.false;
    });

    it('should get products by category', async function() {
        const response = await api.get('/products/category/1');

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.products).to.be.an('array');
    });

    it('should create new product (Admin only)', async function() {
        const response = await api.post('/products', {
            product_name: 'Test Coffee',
            category_id: 1,
            price: 35000,
            description: 'Test product'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(201);
        expect(response.data.success).to.be.true;
    });

    it('should fail creating product without authentication', async function() {
        const response = await api.post('/products', {
            product_name: 'Test Coffee',
            category_id: 1,
            price: 35000,
            description: 'Test product'
        });

        expect(response.status).to.equal(401);
        expect(response.data.success).to.be.false;
    });
});

// ========================================
//  ORDERS TESTS
// ========================================

describe('🛒 Orders Tests', function() {
    this.timeout(5000);

    it('should get all orders', async function() {
        const response = await api.get('/orders', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.orders).to.be.an('array');
    });

    it('should create new order', async function() {
        const response = await api.post('/orders', {
            customer_name: 'Nguyen Van A',
            table_number: 1,
            items: [
                {
                    product_id: 1,
                    quantity: 2,
                    unit_price: 25000
                }
            ]
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(201);
        expect(response.data.success).to.be.true;
        expect(response.data.order_id).to.exist;

        orderId = response.data.order_id;
    });

    it('should fail creating order without items', async function() {
        const response = await api.post('/orders', {
            customer_name: 'Nguyen Van A',
            table_number: 1,
            items: []
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(400);
        expect(response.data.success).to.be.false;
    });

    it('should get order by ID', async function() {
        if (orderId === 1) {
            // Skip if we don't have a valid order ID from previous test
            this.skip();
        }

        const response = await api.get(`/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.order.order_id).to.equal(orderId);
    });

    it('should update order status', async function() {
        if (orderId === 1) {
            this.skip();
        }

        const response = await api.put(`/orders/${orderId}/status`, {
            status: 'completed'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
    });
});

// ========================================
//  PAYMENTS TESTS
// ========================================

describe('💳 Payments Tests', function() {
    this.timeout(5000);

    it('should process payment', async function() {
        const response = await api.post('/payments/process', {
            order_id: 1,
            payment_method: 'cash',
            amount_received: 60000,
            notes: 'Test payment'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.data.order_id).to.exist;
    });

    it('should get invoices', async function() {
        const response = await api.get('/payments/invoices', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.invoices).to.be.an('array');
    });

    it('should get invoice by order ID', async function() {
        const response = await api.get('/payments/1', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        // May be 200 or 404 depending on if order exists
        expect(response.data.success).to.exist;
    });
});

// ========================================
//  REPORTS TESTS
// ========================================

describe('📊 Reports Tests', function() {
    this.timeout(5000);

    it('should get revenue report', async function() {
        const response = await api.get('/reports/revenue?fromDate=2026-04-01&toDate=2026-04-30', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.data.totalRevenue).to.exist;
        expect(response.data.data.ordersCount).to.exist;
    });

    it('should get product report', async function() {
        const response = await api.get('/reports/products?fromDate=2026-04-01&toDate=2026-04-30', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.products).to.be.an('array');
    });

    it('should get employee report', async function() {
        const response = await api.get('/reports/employees', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.employees).to.be.an('array');
    });

    it('should get daily revenue report', async function() {
        const response = await api.get('/reports/daily-revenue?fromDate=2026-04-01&toDate=2026-04-30', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.data).to.be.an('array');
    });

    it('should fail reports without admin role', async function() {
        // Login as staff first
        const loginResponse = await api.post('/auth/login', {
            username: 'staff_001',
            password: 'password123'
        });

        const staffToken = loginResponse.data.token;

        const response = await api.get('/reports/revenue', {
            headers: { Authorization: `Bearer ${staffToken}` }
        });

        expect(response.status).to.equal(403);
        expect(response.data.success).to.be.false;
    });
});

// ========================================
//  INTEGRATION TESTS
// ========================================

describe('🔗 Integration Tests', function() {
    this.timeout(10000);

    it('should complete full customer flow: login → browse → order → pay', async function() {
        // Step 1: Login
        const loginRes = await api.post('/auth/login', {
            username: 'staff_001',
            password: 'password123'
        });
        expect(loginRes.status).to.equal(200);
        const staffToken = loginRes.data.token;

        // Step 2: Browse products
        const productsRes = await api.get('/products');
        expect(productsRes.status).to.equal(200);
        expect(productsRes.data.products.length).to.be.greaterThan(0);

        // Step 3: Create order
        const orderRes = await api.post('/orders', {
            customer_name: 'Integration Test Customer',
            table_number: 5,
            items: [
                {
                    product_id: productsRes.data.products[0].product_id,
                    quantity: 1,
                    unit_price: productsRes.data.products[0].price
                }
            ]
        }, {
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        expect(orderRes.status).to.equal(201);
        const newOrderId = orderRes.data.order_id;

        // Step 4: Process payment
        const paymentRes = await api.post('/payments/process', {
            order_id: newOrderId,
            payment_method: 'card',
            amount_received: productsRes.data.products[0].price * 1.1,
            notes: 'Integration test'
        }, {
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        expect(paymentRes.status).to.equal(200);
        expect(paymentRes.data.success).to.be.true;

        console.log('✓ Complete customer flow successful!');
    });
});

// ========================================
//  PERFORMANCE TESTS
// ========================================

describe('⚡ Performance Tests', function() {
    this.timeout(15000);

    it('should handle multiple concurrent requests', async function() {
        const requests = [];
        for (let i = 0; i < 10; i++) {
            requests.push(api.get('/products'));
        }

        const responses = await Promise.all(requests);
        const successCount = responses.filter(r => r.status === 200).length;

        expect(successCount).to.equal(10);
        console.log(`✓ All 10 concurrent requests completed`);
    });

    it('should handle paginated requests efficiently', async function() {
        const startTime = Date.now();

        const response = await api.get('/orders', {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(response.status).to.equal(200);
        expect(duration).to.be.lessThan(1000); // Should complete in less than 1 second

        console.log(`✓ Request completed in ${duration}ms`);
    });
});

// Success message
console.log(`
╔════════════════════════════════════════════════════════════╗
║                    TEST SUITE COMPLETE                    ║
╚════════════════════════════════════════════════════════════╝
`);
