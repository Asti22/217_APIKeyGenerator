const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO admins (email, password) VALUES (?,?)",
    [email, hash],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Admin registered" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email=?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });

    const admin = rows[0];
    const ok = await bcrypt.compare(password, admin.password);

    if (!ok) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);

    res.json({ token });
  });
};
