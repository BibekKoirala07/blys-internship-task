const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const dbPool = new Pool({
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // port: process.env.DB_PORT,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const initDb = async () => {
  try {
    await dbPool.query(
      "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password TEXT NOT NULL)"
    );
    await dbPool.query(
      "CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(255) NOT NULL, description TEXT)"
    );
    console.log("Database tables ensured");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
};

initDb();

module.exports = dbPool;
