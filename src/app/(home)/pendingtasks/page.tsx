"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Task {
  taskId: string;
  title: string;
  description?: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  currentStatus: "pending" | "ongoing" | "completed";
}

const PendingTasksPage = () => {
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchPendingTasks(); // Fetch pending tasks on component mount
  }, []);

  // Fetch tasks from the backend and filter for pending tasks
  const fetchPendingTasks = async () => {
    try {
      const response = await axios.get("/api/users/get-user-task-data", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const tasks: Task[] = response.data.data.user.tasks; // Type the tasks as Task[]

      // Filter tasks to get only those that are pending
      const filteredPendingTasks = tasks.filter(
        (task) => task.currentStatus === "pending"
      );

      setPendingTasks(filteredPendingTasks); // Update state with pending tasks
    } catch (error) {
      console.error("Error fetching pending tasks:", error);
    }
  };

  // Get background color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-600 to-red-400"; // High priority - Red gradient
      case "medium":
        return "bg-gradient-to-r from-yellow-600 to-yellow-400"; // Medium priority - Yellow gradient
      case "low":
        return "bg-gradient-to-r from-green-600 to-green-400"; // Low priority - Green gradient
      default:
        return "bg-gradient-to-r from-slate-600 to-slate-400"; // Default - Slate gradient
    }
  };

  const updateTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      await axios.post(
        "/api/users/update-status",
        { taskId, currentStatus },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      fetchPendingTasks(); // Refresh tasks after updating
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r bg-slate-900 text-yellow-300 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-700 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Pending Tasks</h1>
        <p className="text-lg mb-6">Manage your pending tasks efficiently.</p>

        {/* Render task list */}
        {pendingTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTasks.map((task) => (
              <div
                key={task.taskId}
                className={`group relative p-8 rounded-lg shadow-xl ${getPriorityColor(
                  task.priority
                )} hover:scale-105 transform transition-all duration-300 overflow-hidden`}
              >
                <h2 className="text-3xl font-semibold text-white">{task.title}</h2>
                <p className="text-base text-gray-100 mt-2">ID: {task.taskId}</p>
                <p className="text-base text-white mt-2">
                  {task.description || "No details available."}
                </p>
                <p className="text-base text-white mt-4">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </p>

                {/* Radio buttons for status */}
                <div className="mt-4">
                  <p className="text-white text-base mb-2">Status:</p>
                  <div className="flex space-x-4">
                    {["pending", "ongoing", "completed"].map((status) => (
                      <label
                        key={status}
                        className="text-base text-white flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name={`status-${task.taskId}`}
                          value={status}
                          checked={task.currentStatus === status}
                          onChange={() => updateTaskStatus(task.taskId, status)}
                          className="form-radio text-yellow-300"
                        />
                        <span>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-20 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">No Pending Tasks Found</h2>
            <p className="text-lg">
              You have no tasks pending. Add new tasks to keep track of your work.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingTasksPage;
