const express = require("express");
const router = express.Router();

// Import controller xử lý logic đơn hàng
const orderController = require("../controllers/orderController");

// Import middleware xác thực và phân quyền
const { verifyToken, checkRole } = require("../middleware/auth");

/**
 * GET /api/orders
 * Lấy danh sách tất cả đơn hàng
 * → phải đăng nhập (verifyToken)
 * → chỉ admin hoặc staff mới được xem
 */
router.get(
  "/",
  verifyToken,
  checkRole(["admin", "staff"]),
  orderController.getAllOrders,
);

/**
 * GET /api/orders/:id
 * Lấy thông tin 1 đơn hàng theo ID
 * → phải đăng nhập
 * → không giới hạn role (user cũng xem được đơn của mình - tùy controller xử lý)
 */
router.get("/:id", verifyToken, orderController.getOrderById);

/**
 * POST /api/orders
 * Tạo đơn hàng mới
 * → phải đăng nhập
 * → chỉ admin hoặc staff được tạo
 */
router.post(
  "/",
  verifyToken,
  checkRole(["admin", "staff"]),
  orderController.createOrder,
);

/**
 * PUT /api/orders/:id/status
 * Cập nhật trạng thái đơn hàng (vd: pending → shipped → completed)
 * → phải đăng nhập
 * → chỉ admin hoặc staff được sửa
 */
router.put(
  "/:id/status",
  verifyToken,
  checkRole(["admin", "staff"]),
  orderController.updateOrderStatus,
);

/**
 * DELETE /api/orders/:id
 * Xóa đơn hàng
 * → phải đăng nhập
 * → chỉ admin mới được xóa
 */
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  orderController.deleteOrder,
);

// Export router để dùng trong app chính
module.exports = router;
