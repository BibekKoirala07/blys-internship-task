const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");

const taskRoutes = require("./routes/tasksRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
