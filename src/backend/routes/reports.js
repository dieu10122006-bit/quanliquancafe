const express = require("express");
const router = express.Router();

// Import controller xử lý logic báo cáo
const reportController = require("../controllers/reportController");

// Import middleware xác thực và phân quyền
const { verifyToken, checkRole } = require("../middleware/auth");

/**
 * GET /api/reports/revenue
 * Lấy báo cáo doanh thu tổng
 * → phải đăng nhập
 * → chỉ admin mới được xem
 */
router.get(
  "/revenue",
  verifyToken,
  checkRole(["admin"]),
  reportController.getRevenue,
);

/**
 * GET /api/reports/products
 * Lấy báo cáo sản phẩm (vd: bán chạy, tồn kho,...)
 * → phải đăng nhập
 * → chỉ admin mới được xem
 */
router.get(
  "/products",
  verifyToken,
  checkRole(["admin"]),
  reportController.getProductReport,
);

/**
 * GET /api/reports/employees
 * Lấy báo cáo nhân viên (vd: hiệu suất làm việc,...)
 * → phải đăng nhập
 * → chỉ admin mới được xem
 */
router.get(
  "/employees",
  verifyToken,
  checkRole(["admin"]),
  reportController.getEmployeeReport,
);

/**
 * GET /api/reports/daily-revenue
 * Lấy doanh thu theo từng ngày
 * → phải đăng nhập
 * → chỉ admin mới được xem
 */
router.get(
  "/daily-revenue",
  verifyToken,
  checkRole(["admin"]),
  reportController.getDailyRevenue,
);

// Export router để dùng trong app chính
module.exports = router;
