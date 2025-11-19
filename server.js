const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/apikey", userRoutes);
app.use("/api/admin", adminRoutes);

// Static frontend
app.use(express.static(path.join(__dirname, "public")));

// Non-API route → index.html
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    next();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
