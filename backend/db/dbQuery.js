// index.js
const pool = require("./db");

(async () => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");
    console.log("Database connected at:", rows[0].currentTime);
  } catch (err) {
    console.error("MySQL connection error:", err);
  }
})();
