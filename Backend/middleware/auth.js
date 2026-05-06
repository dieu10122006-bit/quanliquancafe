const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
  // Lấy token từ header Authorization
  // Ví dụ header: Bearer abc123 → lấy "abc123"
  const token = req.headers.authorization?.split(" ")[1];

  // Nếu không có token → chưa đăng nhập
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    // Kiểm tra token có hợp lệ không (đúng secret, chưa hết hạn,...)
    // Nếu đúng → trả về dữ liệu bên trong token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu thông tin user vào request để dùng ở bước sau
    req.user = decoded;

    // Cho request đi tiếp
    next();
  } catch (error) {
    // Token sai hoặc hết hạn → báo lỗi
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

/**
 * Middleware to check user role
 */
const checkRole = (roles) => {
  // roles là danh sách quyền được phép (vd: ['admin', 'user'])
  return (req, res, next) => {
    // Nếu chưa có user → chưa xác thực
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Kiểm tra role của user có nằm trong danh sách cho phép không
    if (!roles.includes(req.user.role)) {
      // Không có quyền → chặn lại
      return res.status(403).json({
        success: false,
        message: "Forbidden - insufficient permissions",
      });
    }

    // Có quyền → cho đi tiếp
    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
};
