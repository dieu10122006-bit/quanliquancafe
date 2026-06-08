// Import Express framework
const express = require("express");

// Import CORS middleware
const cors = require("cors");

// Load biến môi trường
require("dotenv").config();

// Kết nối database
require("./config/database");

// Import service gửi email
const { initializeEmailService } = require("./services/emailService");

// Import các route API
const authRoutes = require("./routes/auth"); // Auth API
const productRoutes = require("./routes/products"); // Product API
const orderRoutes = require("./routes/orders"); // Order API
const paymentRoutes = require("./routes/payments"); // Payment API
const reportRoutes = require("./routes/reports"); // Report API

// Khởi tạo app
const app = express();

// Lấy port từ .env
const PORT = process.env.PORT || 5000;

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Cho phép frontend
    credentials: true,
  }),
);

// Middleware đọc JSON
app.use(express.json());

// Middleware đọc form data
app.use(express.urlencoded({ extended: true }));

// Middleware log request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next(); // Chuyển tiếp
});

// API kiểm tra server
app.get("/health", (req, res) => {
  res.json({
    status: "OK", // Server OK
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Định nghĩa route
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path,
  });
});

// Xử lý lỗi server
app.use((err, req, res, next) => {
  console.error("Error:", err); // Log lỗi
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Hàm khởi động server
async function startServer() {
  try {
    await initializeEmailService(); // Khởi tạo email
  } catch (error) {
    console.error("Email init failed:", error.message);
  }

  // Chạy server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Gọi hàm start server
startServer();

// Export app
module.exports = app;
