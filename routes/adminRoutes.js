const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Register admin
router.post("/register", adminController.registerAdmin);

// Login admin → JWT
router.post("/login", adminController.loginAdmin);

module.exports = router;
