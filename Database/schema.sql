-- ========================================
-- DATABASE: cafe_management_system
-- PHIÊN BẢN: 1.0
-- NGÀY TẠO: 2026-04-15
-- ========================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS cafe_management_system;
USE cafe_management_system;

-- ========================================
-- BẢNG 1: USERS (Người dùng)
-- ========================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu được hash (bcrypt)',
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'staff', 'customer') NOT NULL DEFAULT 'staff',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG 2: CATEGORIES (Danh mục sản phẩm)
-- ========================================
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    display_order INT DEFAULT 1,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (category_name),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG 3: PRODUCTS (Sản phẩm)
-- ========================================
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    image_url VARCHAR(255),
    quantity_in_stock INT DEFAULT 0,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    INDEX idx_category (category_id),
    INDEX idx_name (product_name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG 4: TABLES (Bàn phục vụ)
-- ========================================
CREATE TABLE tables (
    table_id INT PRIMARY KEY AUTO_INCREMENT,
    table_number INT NOT NULL UNIQUE,
    area VARCHAR(50) NOT NULL COMMENT 'Hall, VIP, Private Room',
    capacity INT NOT NULL DEFAULT 2,
    status ENUM('available', 'occupied', 'reserved') NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_number (table_number),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG 5: ORDERS (Đơn hàng)
-- ========================================
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'Staff tạo',
    table_id INT NOT NULL,
    customer_name VARCHAR(100),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'delivered', 'paid', 'cancelled') NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method ENUM('cash', 'card', 'e_wallet', 'bank_transfer'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (table_id) REFERENCES tables(table_id) ON DELETE RESTRICT,
    INDEX idx_user (user_id),
    INDEX idx_table (table_id),
    INDEX idx_status (status),
    INDEX idx_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG 6: ORDER_DETAILS (Chi tiết đơn hàng)
-- ========================================
CREATE TABLE order_details (
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    notes VARCHAR(255),
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG 7: EMPLOYEES (Nhân viên)
-- ========================================
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    position VARCHAR(50) NOT NULL COMMENT 'Chef, Waiter, Manager, etc',
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2) DEFAULT 0,
    status ENUM('working', 'on_leave', 'resigned') NOT NULL DEFAULT 'working',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_code (employee_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG 8: SHIFTS (Ca làm việc)
-- ========================================
CREATE TABLE shifts (
    shift_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    shift_name VARCHAR(50) NOT NULL COMMENT 'Morning, Afternoon, Evening',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    shift_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_date (shift_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG 9: INVOICES (Hóa đơn)
-- ========================================
CREATE TABLE invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('paid', 'unpaid', 'refunded') NOT NULL DEFAULT 'unpaid',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_number (invoice_number),
    INDEX idx_date (invoice_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PROCEDURES & TRIGGERS
-- ========================================

-- TRIGGER: Cập nhật tổng tiền đơn hàng khi thêm/xóa chi tiết
DELIMITER $$

CREATE TRIGGER update_order_total_after_insert
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT SUM(total_price) FROM order_details WHERE order_id = NEW.order_id
    )
    WHERE order_id = NEW.order_id;
END$$

CREATE TRIGGER update_order_total_after_update
AFTER UPDATE ON order_details
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT SUM(total_price) FROM order_details WHERE order_id = NEW.order_id
    )
    WHERE order_id = NEW.order_id;
END$$

CREATE TRIGGER update_order_total_after_delete
AFTER DELETE ON order_details
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = COALESCE((
        SELECT SUM(total_price) FROM order_details WHERE order_id = OLD.order_id
    ), 0)
    WHERE order_id = OLD.order_id;
END$$

-- TRIGGER: Tính final_amount khi cập nhật discount
CREATE TRIGGER update_final_amount
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
    SET NEW.discount_amount = NEW.total_amount * NEW.discount_percent / 100;
    SET NEW.final_amount = NEW.total_amount - NEW.discount_amount;
END$$

DELIMITER ;

-- ========================================
-- VIEWS (Tùy chọn)
-- ========================================

-- View: Danh sách đơn hàng chi tiết
CREATE VIEW vw_orders_details AS
SELECT 
    o.order_id,
    o.order_date,
    o.customer_name,
    t.table_number,
    u.full_name AS staff_name,
    o.status,
    o.total_amount,
    o.discount_amount,
    o.final_amount,
    COUNT(od.order_detail_id) AS items_count
FROM orders o
LEFT JOIN tables t ON o.table_id = t.table_id
LEFT JOIN users u ON o.user_id = u.user_id
LEFT JOIN order_details od ON o.order_id = od.order_id
GROUP BY o.order_id;

-- View: Doanh thu từng sản phẩm
CREATE VIEW vw_product_revenue AS
SELECT 
    p.product_id,
    p.product_name,
    c.category_name,
    COUNT(od.order_detail_id) AS sold_count,
    SUM(od.total_price) AS total_revenue
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN order_details od ON p.product_id = od.product_id
GROUP BY p.product_id;

-- ========================================
-- TẠO INDEX BỔ SUNG
-- ========================================

CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_payment ON orders(payment_method);
CREATE INDEX idx_employees_position ON employees(position);
CREATE INDEX idx_products_price ON products(price);
