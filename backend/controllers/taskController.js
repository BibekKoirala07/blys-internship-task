const dbPool = require("../db/db");

const getTasks = async (req, res) => {
  try {
    const result = await dbPool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await dbPool.query(
      "SELECT * FROM tasks WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  const userId = req.user.id;
  const { title, description } = req.body;

  console.log("userrId", userId, title, description);
  try {
    await dbPool.query(
      "INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3)",
      [userId, title, description]
    );
    res.status(201).json({ message: "Task added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeTask = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  console.log("uesrId", userId, taskId);
  try {
    await dbPool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [
      taskId,
      userId,
    ]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, getMyTasks, removeTask };
