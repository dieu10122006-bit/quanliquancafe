CREATE DATABASE cafe_management_system; -- Tạo database
USE cafe_management_system; -- Sử dụng database

CREATE TABLE users ( -- Bảng người dùng
    user_id INT PRIMARY KEY AUTO_INCREMENT, -- Khóa chính
    username VARCHAR(50) UNIQUE, -- Tên đăng nhập
    email VARCHAR(100) UNIQUE, -- Email
    password VARCHAR(255), -- Mật khẩu (hash)
    role ENUM('admin','staff','customer'), -- Phân quyền
    status ENUM('active','inactive') -- Trạng thái
);

CREATE TABLE categories ( -- Danh mục
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) -- Tên danh mục
);

CREATE TABLE products ( -- Sản phẩm
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT, -- FK đến categories
    product_name VARCHAR(100),
    price DECIMAL(10,2),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE orders ( -- Đơn hàng
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT, -- Nhân viên tạo
    table_id INT, -- Bàn
    total_amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_details ( -- Chi tiết đơn
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);