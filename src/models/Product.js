const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // 👉 tự tạo createdAt & updatedAt
  }
);

module.exports = mongoose.model("Product", productSchema);
