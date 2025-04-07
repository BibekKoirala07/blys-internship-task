const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5173", process.env.PROD_FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

console.log("corsOption", corsOptions);

const taskRoutes = require("./routes/tasksRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
