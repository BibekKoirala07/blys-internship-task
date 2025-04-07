const express = require("express");
const {
  getTasks,
  createTask,
  removeTask,
} = require("../controllers/taskController");
const taskRoutes = express.Router();

taskRoutes.get("/", getTasks);
taskRoutes.post("/", createTask);
taskRoutes.delete("/:id", removeTask);

module.exports = taskRoutes;
