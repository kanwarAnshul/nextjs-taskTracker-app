"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

interface Task {
  taskId: string;
  title: string;
  description: string;
  deadline: Date;
  priority: string;
  currentStatus: string;
}

const AllTaskPage = () => {
  const [userTask, setUserTask] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users/get-user-task-data", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log("the fetched response ✅✅", response.data);
      toast.success("Successfully task fetched");
      setUserTask(response.data.data.user.tasks);
    } catch (error: any) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskDetails = async (
    taskId: string,
    title: string,
    description: string,
    deadline: Date,
    priority: string
  ) => {
    try {
      const response = await axios.post(
        "/api/users/update-task",
        { taskId, title, description, deadline, priority },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = await response.data;

      if (!response.status || !data.success) {
        throw new Error(data.message || "Failed to update task");
      }

      setUserTask((prevTasks) =>
        prevTasks.map((task) =>
          task.taskId === taskId
            ? { ...task, title, description, deadline, priority }
            : task
        )
      );
      console.log("the frontend user task details>😎😎", userTask);

      toast.success("Task updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error updating task");
      console.error("Error updating task:", error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await axios.post(
        "/api/users/update-status",
        { taskId, currentStatus: newStatus },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      setUserTask((prevTasks) =>
        prevTasks.map((task) =>
          task.taskId === taskId ? { ...task, currentStatus: newStatus } : task
        )
      );

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status.");
    }
  };

  const handleDialogOpen = (task: Task) => {
    setSelectedTask(task);
    console.log("the dialog task>>>",task);
    
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(task.deadline.toISOString);
    setPriority(task.priority);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleUpdate = () => {
    if (selectedTask) {
      updateTaskDetails(
        selectedTask.taskId,
        title,
        description,
        new Date(deadline),
        priority
      );
      handleDialogClose();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete("/api/users/delete-task", {
        data: { taskId },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setUserTask((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
      toast.success("Task deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting task");
      console.error("Error deleting task:", error);
    }
  };

  const priorityColors: Record<string, string> = {
    high: "bg-gradient-to-r from-red-500 to-red-300",
    medium: "bg-gradient-to-r from-yellow-500 to-yellow-300",
    low: "bg-gradient-to-r from-green-500 to-green-300",
  };

  const getPriorityColor = (priority: string) =>
    priorityColors[priority.toLowerCase()] || "bg-gradient-to-r from-blue-500 to-blue-300";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-700">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 text-yellow-300 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">All Tasks</h1>
        <p className="text-lg mb-6">View all your tasks, whether ongoing or completed.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTask.map((task) => (
            <div
              key={task.taskId}
              className={`p-8 rounded-lg shadow-xl transform transition-all duration-300 overflow-hidden ${getPriorityColor(
                task.priority
              )}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-semibold text-white">{task.title}</h2>
                <span
                  className={`text-white text-sm font-semibold px-3 py-1 border-[2px] border-black rounded-full ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
              <p className="text-base text-gray-100 mt-2">ID: {task.taskId}</p>
              <p className="text-base text-white mt-2">{task.description}</p>
              <p className="text-base text-white mt-4">
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <p className="text-white text-base mb-2">Status:</p>
                <div className="flex space-x-4">
                  {["pending", "ongoing", "completed"].map((status) => (
                    <label
                      key={status}
                      className={`flex items-center space-x-2 ${task.currentStatus === status ? "text-yellow-300 font-semibold" : "text-white"}`}
                    >
                      <input
                        type="radio"
                        name={`status-${task.taskId}`}
                        value={status}
                        checked={task.currentStatus === status}
                        onChange={() => updateTaskStatus(task.taskId, status)}
                        className="form-radio h-5 w-5 text-yellow-300 focus:ring-yellow-300"
                        aria-label={`Set status to ${status}`}
                      />
                      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                className="mt-4 bg-yellow-300 text-slate-900 px-4 py-2 rounded hover:bg-yellow-400 transition"
                onClick={() => handleDialogOpen(task)}
              >
                Edit Task
              </button>
              <button
                className="mt-4 bg-red-500 ml-5 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => handleDeleteTask(task.taskId)}
              >
                Delete Task
              </button>
            </div>
          ))}
        </div>
      </div>

      {isDialogOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-900 p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Update Task</h2>
            <div className="mb-4">
              <label className="block font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mt-1 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mt-1 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 mt-1 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 mt-1 text-black"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleDialogClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTaskPage;
