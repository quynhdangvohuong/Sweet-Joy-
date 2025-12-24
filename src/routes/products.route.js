const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");

// CRUD Product
router.post("/", productController.createProduct);      // Thêm
router.get("/", productController.getProducts);          // Lấy tất cả
router.get("/:id", productController.getProductById);    // Lấy theo ID
router.put("/:id", productController.updateProduct);     // Sửa
router.delete("/:id", productController.deleteProduct);  // Xóa

module.exports = router;
