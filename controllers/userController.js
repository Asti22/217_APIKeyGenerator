const db = require("../db");
const crypto = require("crypto");

// Create user + generate API key
exports.createUser = async (req, res) => {
  const { firstname, lastname, email } = req.body;
  if (!firstname || !lastname || !email) return res.status(400).json({ message: "Semua field wajib diisi" });

  try {
    // Insert user
    const [userResult] = await db.execute(
      "INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)",
      [firstname, lastname, email]
    );

    const userId = userResult.insertId;
    // Generate API key
    const key = crypto.randomBytes(16).toString("hex");
    const out_of_date = new Date();
    out_of_date.setDate(out_of_date.getDate() + 7); // 7 hari berlaku

    await db.execute(
      "INSERT INTO api_keys (`key`, user_id, status, out_of_date) VALUES (?, ?, 'on', ?)",
      [key, userId, out_of_date]
    );

    res.json({ key, out_of_date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all API keys
exports.getAllKeys = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM api_keys");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM users WHERE id=?", [id]);
    res.json({ message: "User dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete API key
exports.deleteKey = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM api_keys WHERE id=?", [id]);
    res.json({ message: "API Key dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
