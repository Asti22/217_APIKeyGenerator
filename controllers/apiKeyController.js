const crypto = require("crypto");
const db = require("../db");

// ONLY generate API key (tanpa simpan)
exports.generate = (req, res) => {
  const apiKey = crypto.randomBytes(24).toString("hex");
  res.json({ api_key: apiKey });
};

// Create API key baru (tanpa user)
exports.create = async (req, res) => {
  try {
    const apiKey = crypto.randomBytes(24).toString("hex");
    
    // FIX: Format tanggal untuk MySQL
    const out_of_date = new Date(Date.now() + 7*24*3600*1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    await db.execute(
      "INSERT INTO api_keys (api_key, status, out_of_date) VALUES (?, 'on', ?)",
      [apiKey, out_of_date] // Sekarang menggunakan string yang diformat
    );

    res.json({
      message: "API key dibuat",
      api_key: apiKey,
      out_of_date
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
