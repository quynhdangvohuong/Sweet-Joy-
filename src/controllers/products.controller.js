const Product = require("../models/Product");

// ================== CREATE PRODUCT ==================
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, image } = req.body;

    const product = await Product.create({
      name,
      price,
      stock,
      category,
      image
    });

    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== GET ALL PRODUCTS ==================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== GET PRODUCT BY ID ==================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== UPDATE PRODUCT ==================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({
      message: "Cập nhật sản phẩm thành công",
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== DELETE PRODUCT ==================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
