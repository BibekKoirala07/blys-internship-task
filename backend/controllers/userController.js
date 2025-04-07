const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbPool = require("../db/db");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    const userCheck = await dbPool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userCheck.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await dbPool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    console.log("result", result);

    res
      .status(201)
      .json({ message: "User created now login", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const result = await dbPool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("token", token);

    return res
      .cookie("blys_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .json({ message: "Login successful", data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
