const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================== REGISTER ==================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // 2. HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Đăng ký thành công"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================== LOGIN ==================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // 2. So sánh password
   /* const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }*/

    if(password != user.password){
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // 3. Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
