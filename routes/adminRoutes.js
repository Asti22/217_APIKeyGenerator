const router = require("express").Router();
const admin = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.post("/register", admin.register);
router.post("/login", admin.login);

// protected
router.get("/users", auth, (req, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

router.get("/apikeys", auth, (req, res) => {
  db.query("SELECT * FROM api_keys", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

module.exports = router;
