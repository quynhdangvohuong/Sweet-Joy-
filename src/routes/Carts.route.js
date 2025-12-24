const express = require("express");
const router = express.Router();
const cartController = require("../controllers/Carts.controller");
const auth = require("../middlewares/auth.middleware");

// Giỏ hàng (bắt buộc đăng nhập)
router.get("/", auth, cartController.getCart);           // Xem giỏ
router.post("/", auth, cartController.addToCart);        // Thêm
router.put("/", auth, cartController.updateCartItem);    // Sửa số lượng
router.delete("/:productId", auth, cartController.removeCartItem); // Xóa SP
router.delete("/", auth, cartController.clearCart);      // Xóa tất cả

module.exports = router;
// ================== ADD TO CART ==================
router.post("/add", async (req, res) => {
  const { productId } = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.redirect("/");
  }

  const exist = req.session.cart.find(
    item => item.product._id.toString() === productId
  );

  if (exist) {
    exist.quantity += 1;
  } else {
    req.session.cart.push({
      product,
      quantity: 1
    });
  }

  res.redirect("/cart");
});

module.exports = router;
