// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /auth/sign-up
router.post("/sign-up", authController.signup);

// POST /auth/login
router.post("/login", authController.login);

module.exports = router;
