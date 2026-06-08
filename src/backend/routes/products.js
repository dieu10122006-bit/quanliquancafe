const express = require("express");
const router = express.Router();

// Import controller xử lý logic sản phẩm
const productController = require("../controllers/productController");

// Import middleware xác thực và phân quyền
const { verifyToken, checkRole } = require("../middleware/auth");

/**
 * GET /api/products
 * Lấy danh sách tất cả sản phẩm
 * → ai cũng xem được (không cần đăng nhập)
 */
router.get("/", productController.getAllProducts);

/**
 * GET /api/products/:id
 * Lấy chi tiết 1 sản phẩm theo ID
 * → ai cũng xem được
 */
router.get("/:id", productController.getProductById);

/**
 * GET /api/products/category/:categoryId
 * Lấy danh sách sản phẩm theo danh mục
 * → ai cũng xem được
 */
router.get("/category/:categoryId", productController.getProductsByCategory);

/**
 * POST /api/products (Admin only)
 * Tạo sản phẩm mới
 * → phải đăng nhập
 * → chỉ admin được phép
 */
router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  productController.createProduct,
);

/**
 * PUT /api/products/:id (Admin only)
 * Cập nhật sản phẩm
 * → phải đăng nhập
 * → chỉ admin được phép
 */
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  productController.updateProduct,
);

/**
 * DELETE /api/products/:id (Admin only)
 * Xóa sản phẩm
 * → phải đăng nhập
 * → chỉ admin được phép
 */
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  productController.deleteProduct,
);

// Export router để dùng trong app chính
module.exports = router;
