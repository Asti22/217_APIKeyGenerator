const db = require("../db");
const crypto = require("crypto");

// 1. CREATE USER + API KEY
exports.createUser = async (req, res) => {
  const { firstname, lastname, email } = req.body;

  if (!firstname || !lastname || !email)
    return res.status(400).json({ message: "Semua field wajib diisi" });

  try {
    // 1️⃣ Insert user ke tabel users
    const [userResult] = await db.execute(
      "INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)",
      [firstname, lastname, email]
    );
    const userId = userResult.insertId;

    // 2️⃣ Generate API key & hitung masa berlaku (30 hari)
    const apiKey = crypto.randomBytes(24).toString("hex");
    const out = new Date(Date.now() + 30 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    // 3️⃣ Insert api key ke tabel api_keys
    const [keyResult] = await db.execute(
      "INSERT INTO api_keys (api_key, user_id, status, out_of_date) VALUES (?, ?, 'on', ?)",
      [apiKey, userId, out]
    );
    const keyId = keyResult.insertId;

    // 4️⃣ Ambil data key lengkap (termasuk created_at & updated_at)
    const [rows] = await db.execute(
      "SELECT user_id, api_key, out_of_date, created_at, updated_at FROM api_keys WHERE id = ?",
      [keyId]
    );
    const createdKey = rows[0];

    // 5️⃣ Kembalikan data lengkap
    res.status(201).json({
      message: "User + API key created",
      ...createdKey // Menggunakan spread operator untuk menggabungkan semua properti dari createdKey
    });

  } catch (err) {
    console.error("Error creating user:", err);
    // Cek jika error 409 (Duplicate entry for key 'email') dari MySQL
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: "Email sudah terdaftar. Gunakan email lain." });
    }
    res.status(500).json({ error: err.message });
  }
};

// 2. GET ALL USERS (Admin Protected)
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, firstname, lastname, email FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. GET ALL KEYS (Admin Protected)
exports.getAllKeys = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM api_keys");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. DELETE USER (Admin Protected)
exports.deleteUser = async (req, res) => {
  try {
    await db.execute("DELETE FROM users WHERE id=?", [req.params.id]);
    res.json({ message: "User dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. DELETE KEY (Admin Protected)
exports.deleteKey = async (req, res) => {
  try {
    await db.execute("DELETE FROM api_keys WHERE id=?", [req.params.id]);
    res.json({ message: "API key dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};