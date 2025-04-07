const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies["blys_token"];

  console.log("req.cookies", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    console.log("req.user", req.user);

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = requireAuth;
