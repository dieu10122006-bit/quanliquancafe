// Import thư viện mysql2 hỗ trợ Promise (async/await)
const mysql = require("mysql2/promise");

// Load biến môi trường từ file .env
require("dotenv").config();

// Tạo connection pool để quản lý nhiều kết nối DB
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Địa chỉ MySQL server
  port: process.env.DB_PORT, // Cổng MySQL (3306)
  user: process.env.DB_USER, // Username DB
  password: process.env.DB_PASSWORD, // Password DB
  database: process.env.DB_NAME, // Tên database
  waitForConnections: true, // Chờ nếu hết connection
  connectionLimit: 10, // Giới hạn 10 kết nối
  queueLimit: 0, // Không giới hạn hàng chờ
});

// Kiểm tra kết nối DB khi server khởi động
pool
  .getConnection()
  .then((connection) => {
    console.log("✓ Database connected successfully"); // Kết nối OK
    connection.release(); // Trả connection về pool
  })
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message); // Báo lỗi
    process.exit(1); // Dừng server nếu DB lỗi
  });

// Export pool để dùng query ở các module khác
module.exports = pool;
