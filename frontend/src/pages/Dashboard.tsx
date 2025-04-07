// Dashboard.tsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Link } from "react-router-dom";

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string;
  author_name?: string;
}

const Dashboard = () => {
  const { isAuthenticated, userData } = useSelector(
    (state: RootState) => state.user
  );

  const apiUrl = useSelector((state: RootState) => state.config.apiUrl);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/tasks/get-my-tasks`, {
        credentials: "include",
      });
      const data = await response.json();

      console.log("data in my home", data);

      if (response.ok) {
        setTasks(data);
      } else {
        setError(data.message || "Failed to fetch tasks");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    console.log("taskId", taskId);
    try {
      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      console.log("data", data);

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete task");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          {isAuthenticated ? (
            <Link
              to="/create-task"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Create New Task
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Sign In to Create Tasks
            </Link>
          )}
        </div>

        {loading ? (
          <p className="text-center py-4">Loading tasks...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-600">{error}</p>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="mb-4">No tasks available</p>
            {isAuthenticated && (
              <Link
                to="/create-task"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Create Your First Task
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                <p className="text-gray-600 mb-4">{task.description}</p>
                {task.author_name && (
                  <p className="text-sm text-gray-500 mb-4">
                    Created by: {task.author_name}
                  </p>
                )}
                {isAuthenticated &&
                  userData &&
                  userData.id === task.user_id && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
