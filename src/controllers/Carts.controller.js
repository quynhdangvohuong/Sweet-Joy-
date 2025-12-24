const Cart = require("../models/Carts");
const Product = require("../models/Product");

// ================== GET CART ==================
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("items.productId", "name price image");

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== ADD TO CART ==================
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [],
        totalPrice: 0
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Đã có sản phẩm → tăng số lượng
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Chưa có → thêm mới
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    // Tính lại tổng tiền
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({
      message: "Thêm vào giỏ hàng thành công",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== UPDATE QUANTITY ==================
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });
    }

    item.quantity = quantity;

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({
      message: "Cập nhật giỏ hàng thành công",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== REMOVE ITEM ==================
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== CLEAR CART ==================
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.json({ message: "Đã xóa toàn bộ giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
