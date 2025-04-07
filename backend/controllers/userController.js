const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbPool = require("../db/db");

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userCheck = await dbPool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userCheck.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );

    res
      .status(201)
      .json({ message: "User created", userId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await dbPool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
