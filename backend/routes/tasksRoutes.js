const express = require("express");
const {
  getTasks,
  createTask,
  removeTask,
  getMyTasks,
} = require("../controllers/taskController");
const requireAuth = require("../middleware/requireAuth");
const taskRoutes = express.Router();

taskRoutes.get("/", getTasks);
taskRoutes.get("/get-my-tasks", requireAuth, getMyTasks);
taskRoutes.post("/", requireAuth, createTask);
taskRoutes.delete("/:id", requireAuth, removeTask);

module.exports = taskRoutes;
