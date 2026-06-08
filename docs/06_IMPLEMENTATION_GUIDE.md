# 📝 HƯỚNG DẪN XÂY DỰNG DỰ ÁN - CAFE MANAGEMENT SYSTEM

## Phần 1: SETUP BAN ĐẦU

### Bước 1: Chuẩn Bị Môi Trường

**Yêu Cầu:**
- Node.js 14+
- MySQL 5.7+
- Visual Studio Code
- Git

**Cài Đặt:**

```bash
# 1. Clone hoặc tải project
cd d:\XÂY DỰNG QUAN LÍ HỆ THỐNG CAFE

# 2. Kiểm tra cấu trúc thư mục
dir /s /b
```

### Bước 2: Setup Database

**Tạo Database:**

```bash
# Mở MySQL Command Line
mysql -u root -p

# Chạy script tạo bảng
mysql -u root -p < Database/schema.sql

# Thêm dữ liệu mẫu
mysql -u root -p cafe_management_system < Database/data.sql

# Kiểm tra
USE cafe_management_system;
SHOW TABLES;
SELECT * FROM users;
```

### Bước 3: Setup Backend

**File: Backend/package.json**

```json
{
  "name": "cafe-management-backend",
  "version": "1.0.0",
  "description": "Backend for Cafe Management System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.2.0",
    "dotenv": "^16.0.3",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

**Cài đặt:**

```bash
cd Backend
npm install
```

**File: Backend/.env**

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cafe_management_system
JWT_SECRET=your_secret_key_12345
PORT=3001
```

### Bước 4: Setup Frontend

Không cần cài đặt - chỉ cần mở file HTML trong browser.

```bash
# Sử dụng Live Server (VS Code extension)
# Click "Go Live" trên index.html hoặc login.html
```

---

## Phần 2: FILE CẤU HÌNH HỆ THỐNG

### Backend Configuration

**File: Backend/server.js**

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/reports', require('./routes/reports'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, pool };
```

**File: Backend/config/db.js**

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0
});

module.exports = pool;
```

---

## Phần 3: BACKEND ROUTES & CONTROLLERS

### 1. Authentication Route

**File: Backend/routes/auth.js**

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const connection = await pool.getConnection();
        const [users] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        connection.release();

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                id: user.user_id, 
                username: user.username, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.user_id,
                username: user.username,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register (Admin only)
router.post('/register', verify, async (req, res) => {
    try {
        const { username, password, email, full_name, role } = req.body;

        // Validate
        if (!username || !password || !email) {
            return res.status(400).json({ 
                error: 'Username, password, and email required' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await pool.getConnection();

        await connection.execute(
            'INSERT INTO users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, email, full_name, role || 'staff']
        );

        connection.release();

        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify JWT middleware
function verify(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = router;
```

### 2. Products Route

**File: Backend/routes/products.js**

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [products] = await connection.execute(`
            SELECT p.*, c.category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.status = 'active'
            ORDER BY p.product_name
        `);
        connection.release();

        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get categories
router.get('/categories', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [categories] = await connection.execute(
            'SELECT * FROM categories WHERE status = "active" ORDER BY display_order'
        );
        connection.release();

        res.json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

### 3. Orders Route

**File: Backend/routes/orders.js**

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [orders] = await connection.execute(`
            SELECT o.*, t.table_number, u.full_name as staff_name
            FROM orders o
            LEFT JOIN tables t ON o.table_id = t.table_id
            LEFT JOIN users u ON o.user_id = u.user_id
            ORDER BY o.order_date DESC
        `);
        connection.release();

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create order
router.post('/', async (req, res) => {
    try {
        const { user_id, table_id, customer_name, items } = req.body;
        const connection = await pool.getConnection();

        // Start transaction
        await connection.beginTransaction();

        // Insert order
        const [orderResult] = await connection.execute(
            `INSERT INTO orders (user_id, table_id, customer_name, total_amount, status)
             VALUES (?, ?, ?, 0, 'pending')`,
            [user_id, table_id, customer_name]
        );

        const orderId = orderResult.insertId;
        let totalAmount = 0;

        // Insert order items
        for (const item of items) {
            const [productResult] = await connection.execute(
                'SELECT price FROM products WHERE product_id = ?',
                [item.product_id]
            );

            if (productResult.length === 0) {
                throw new Error(`Product ${item.product_id} not found`);
            }

            const unitPrice = productResult[0].price;
            const totalPrice = unitPrice * item.quantity;
            totalAmount += totalPrice;

            await connection.execute(
                `INSERT INTO order_details (order_id, product_id, quantity, unit_price, total_price)
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, unitPrice, totalPrice]
            );
        }

        // Update order total
        await connection.execute(
            'UPDATE orders SET total_amount = ? WHERE order_id = ?',
            [totalAmount, orderId]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order_id: orderId,
            total_amount: totalAmount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

---

## Phần 4: FRONTEND JAVASCRIPT

### Menu Management

**File: Frontend/js/menu.js**

```javascript
const Menu = {
    /**
     * Load products
     */
    async loadProducts(categoryId = null) {
        try {
            Utils.showLoader();
            let products = await API.products.getAll();

            if (categoryId) {
                products = products.filter(p => p.category_id == categoryId);
            }

            this.displayProducts(products);
        } catch (error) {
            Utils.showAlert('Lỗi tải sản phẩm: ' + error.message, 'error');
        }
    },

    /**
     * Display products in grid
     */
    displayProducts(products) {
        const container = document.getElementById('products-grid');
        if (!container) return;

        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image_url}" alt="${product.product_name}" class="product-image">
                <h3>${product.product_name}</h3>
                <p class="product-category">${product.category_name}</p>
                <p class="product-price">${Utils.formatCurrency(product.price)}</p>
                <button class="btn btn-primary" onclick="Menu.addToOrder(${product.product_id})">
                    Thêm Vào Giỏ
                </button>
            </div>
        `).join('');

        Utils.hideLoader();
    },

    /**
     * Add product to order
     */
    addToOrder(productId) {
        const order = JSON.parse(localStorage.getItem('currentOrder') || '{}');
        const item = order.items?.find(i => i.product_id === productId);

        if (item) {
            item.quantity++;
        } else {
            if (!order.items) order.items = [];
            order.items.push({ product_id: productId, quantity: 1 });
        }

        localStorage.setItem('currentOrder', JSON.stringify(order));
        Utils.showAlert('✓ Đã thêm vào giỏ', 'success');
    }
};
```

### Order Management

**File: Frontend/js/order.js**

```javascript
const Order = {
    /**
     * Create new order
     */
    async createOrder(tableId, customerName, items) {
        try {
            const user = Utils.getCurrentUser();
            const response = await API.orders.create({
                user_id: user.id,
                table_id: tableId,
                customer_name: customerName,
                items: items
            });

            Utils.showAlert('✓ Tạo đơn hàng thành công!', 'success');
            localStorage.removeItem('currentOrder');
            
            return response.order_id;
        } catch (error) {
            Utils.showAlert('✗ Lỗi: ' + error.message, 'error');
            throw error;
        }
    },

    /**
     * Update order
     */
    async updateOrder(orderId, data) {
        try {
            await API.orders.update(orderId, data);
            Utils.showAlert('✓ Cập nhật đơn hàng thành công!', 'success');
        } catch (error) {
            Utils.showAlert('✗ Lỗi: ' + error.message, 'error');
        }
    },

    /**
     * Calculate order total
     */
    calculateTotal(items) {
        return items.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
    }
};
```

### Payment Processing

**File: Frontend/js/payment.js**

```javascript
const Payment = {
    /**
     * Process payment
     */
    async processPayment(orderId, data) {
        try {
            const response = await API.payments.process(orderId, {
                amount: data.amount,
                payment_method: data.payment_method,
                discount_percent: data.discount_percent || 0,
                notes: data.notes
            });

            Utils.showAlert('✓ Thanh toán thành công!', 'success');
            return response;
        } catch (error) {
            Utils.showAlert('✗ Lỗi thanh toán: ' + error.message, 'error');
        }
    },

    /**
     * Calculate final amount
     */
    calculateFinalAmount(totalAmount, discountPercent, tax = 0) {
        const discountAmount = Utils.calculatePercentage(totalAmount, discountPercent);
        const taxAmount = Utils.calculatePercentage(totalAmount - discountAmount, tax);
        return {
            discountAmount,
            taxAmount,
            finalAmount: totalAmount - discountAmount + taxAmount
        };
    }
};
```

---

## Phần 5: CHẠY DỰ ÁN

### Bước 1: Khởi Động Backend

```bash
cd Backend
npm start

# Output:
# Server running on http://localhost:3001
```

### Bước 2: Mở Frontend

**Tùy chọn 1: Live Server (VS Code)**
- Click chuột phải trên Frontend/pages/login.html
- Chọn "Open with Live Server"

**Tùy chọn 2: Direct Navigate**
- Mở browser
- Nhập: `file:///d:/XÂY DỰNG QUAN LÍ HỆ THỐNG CAFE/Frontend/pages/login.html`

### Bước 3: Đăng Nhập

- Username: `admin`
- Password: `password123`
- Hoặc Username: `staff_001` phím Password: `password123`

---

## Phần 6: TESTING

### Test API với Postman

1. **Download Postman**

2. **Import Collection**
   - New → Collection → [name]

3. **Create Request Examples**

   **Login:**
   ```
   POST http://localhost:3001/api/auth/login
   Body (JSON):
   {
     "username": "admin",
     "password": "password123"
   }
   ```

   **Get Products:**
   ```
   GET http://localhost:3001/api/products
   Headers:
   Authorization: Bearer {token}
   ```

   **Create Order:**
   ```
   POST http://localhost:3001/api/orders
   Headers:
   Authorization: Bearer {token}
   Body (JSON):
   {
     "user_id": 1,
     "table_id": 1,
     "customer_name": "John",
     "items": [
       {"product_id": 1, "quantity": 2}
     ]
   }
   ```

---

## Phần 7: TROUBLESHOOTING

### Lỗi: "Cannot GET /api/products"

**Nguyên nhân:** Backend server không chạy hoặc route không tồn tại

**Giải pháp:**
```bash
# Kiểm tra backend đang chạy?
# Port 3001 có lắng nghe?
netstat -ano | findstr :3001

# Restart server
npm start
```

### Lỗi: "CORS error"

**Nguyên nhân:** CORS không được bật trong backend

**Giải pháp:** Kiểm tra file Backend/server.js, đảm bảo cors middleware đã được thêm

### Lỗi: "Database connection failed"

**Nguyên nhân:** MySQL chưa khởi động hoặc credentials sai

**Giải pháp:**
```bash
# Kiểm tra MySQL service
net start MySQL80

# Kiểm tra connection
mysql -u root -p
```

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Kiểm tra console (F12) để xem lỗi chi tiết
2. Xem log trong terminal Backend
3. Kiểm tra Database trong MySQL Workbench

---

**Happy Coding! ☕**
