const Order = require("../models/Orders");
const Cart = require("../models/Carts");
const Product = require("../models/Product");

// ================== CREATE ORDER (CHECKOUT) ==================
exports.createOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    // 1. Lấy giỏ hàng
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("items.productId", "name price stock");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // 2. Tạo order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity
    }));

    // 3. Tạo order
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount: cart.totalPrice,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      orderStatus: "processing"
    });

    // 4. Trừ stock sản phẩm
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // 5. Xóa giỏ hàng sau checkout
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({
      message: "Đặt hàng thành công",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== GET ORDERS BY USER ==================
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
