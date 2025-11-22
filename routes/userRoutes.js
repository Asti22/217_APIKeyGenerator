const express = require("express");
const router = express.Router();
const user = require("../controllers/userController");

// User route
router.post("/create", user.createUser);
router.get("/all", user.getAllUsers);
router.delete("/:id", user.deleteUser);

// API Key route
router.get("/apikey/all", user.getAllKeys);
router.delete("/apikey/:id", user.deleteKey);

module.exports = router;
