const express = require("express");
const router = express.Router();

// Import controller xử lý logic thanh toán
const paymentController = require("../controllers/paymentController");

// Import middleware xác thực và phân quyền
const { verifyToken, checkRole } = require("../middleware/auth");

/**
 * GET /api/payments/invoices
 * Lấy danh sách tất cả hóa đơn
 * → phải đăng nhập
 * → chỉ admin hoặc staff mới được xem
 */
router.get(
  "/invoices",
  verifyToken,
  checkRole(["admin", "staff"]),
  paymentController.getAllInvoices,
);

/**
 * GET /api/payments/:orderId
 * Lấy hóa đơn theo ID đơn hàng
 * → phải đăng nhập
 * → tất cả user đã login đều có thể gọi (chi tiết quyền xử lý trong controller)
 */
router.get("/:orderId", verifyToken, paymentController.getInvoice);

/**
 * POST /api/payments/process
 * Xử lý thanh toán cho đơn hàng
 * → phải đăng nhập
 * → chỉ admin hoặc staff được phép xử lý
 */
router.post(
  "/process",
  verifyToken,
  checkRole(["admin", "staff"]),
  paymentController.processPayment,
);

// Export router để dùng trong app chính
module.exports = router;
