// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Sign‑up handler
exports.signup = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  if (!name || !email || !password || !mobile) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await new User({ name, email, password: hash, mobile }).save();
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login handler
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }``
    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
