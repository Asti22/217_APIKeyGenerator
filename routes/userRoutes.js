const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create user + auto generate API key
router.post("/create", userController.createUser);

// Get all users (admin protected)
router.get("/all", authMiddleware, userController.getAllUsers);

// Get all API keys (admin protected)
router.get("/keys", authMiddleware, userController.getAllKeys);

// Delete user
router.delete("/delete/:id", authMiddleware, userController.deleteUser);

// Delete API key
router.delete("/key/:id", authMiddleware, userController.deleteKey);

module.exports = router;
