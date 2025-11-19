const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password wajib diisi" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO admins (email, password) VALUES (?, ?)", [email, hashed]);
    res.json({ message: "Admin berhasil register" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute("SELECT * FROM admins WHERE email=?", [email]);
    if (rows.length === 0) return res.status(401).json({ message: "Admin tidak ditemukan" });

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
};
