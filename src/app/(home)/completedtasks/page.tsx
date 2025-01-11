"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader"; // Make sure to import the loader component

// Define the structure of a Task
interface Task {
  taskId: string;
  title: string;
  description: string;
  currentStatus: string;
  priority: string;
  completedDate: string; // Assuming it's a string from the API
}

const CompletedTasksPage = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state

  useEffect(() => {
    fetchCompletedTasks(); // Fetch completed tasks on component mount
  }, []);

  // Fetch completed tasks from the backend
  const fetchCompletedTasks = async () => {
    try {
      const response = await axios.get("/api/users/get-user-task-data", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const tasks: Task[] = response.data.data.user.tasks;

      // Filter tasks with currentStatus "completed"
      const filteredCompletedTasks = tasks.filter(
        (task) => task.currentStatus === "completed"
      );

      setCompletedTasks(filteredCompletedTasks);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  // Get priority background color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-600 to-red-400";
      case "medium":
        return "bg-gradient-to-r from-yellow-600 to-yellow-400";
      case "low":
        return "bg-gradient-to-r from-green-600 to-green-400";
      default:
        return "bg-gradient-to-r from-slate-600 to-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r bg-slate-900 text-yellow-300 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-700 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Completed Tasks</h1>
        <p className="text-lg mb-6">All the tasks you have completed are listed here.</p>

        {/* Show loader while data is loading */}
        {loading ? (
          <Loader /> // Show loader if data is still loading
        ) : completedTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedTasks.map((task) => (
              <div
                key={task.taskId}
                className={`group relative p-8 rounded-lg shadow-xl ${getPriorityColor(
                  task.priority
                )} hover:scale-105 transform transition-all duration-300 overflow-hidden`}
              >
                <h2 className="text-3xl font-semibold text-white">{task.title}</h2>
                <p className="text-base text-gray-100 mt-2">ID: {task.taskId}</p>
                <p className="text-base text-white mt-2">{task.description}</p>
                <p className="text-base text-white mt-4">
                  Completed On: {new Date(task.completedDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-20 text-center text-gray-200">
            <h2 className="text-2xl font-bold mb-4">No Completed Tasks Found</h2>
            <p className="text-lg">You have not completed any tasks yet. Keep working to achieve your goals!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasksPage;
