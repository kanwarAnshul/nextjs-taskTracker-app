"use client";
import Loader from "@/components/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";

const OngoingTasksPage = () => {
  const [ongoingTasks, setOngoingTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator

  useEffect(() => {
    fetchOngoingTasks(); // Fetch ongoing tasks on component mount
  }, []);

  // Fetch ongoing tasks from the backend
  const fetchOngoingTasks = async () => {
    try {
      const response = await axios.get("/api/users/get-user-task-data", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const tasks = response.data.data.user.tasks;

      // Filter tasks with currentStatus "ongoing"
      const filteredOngoingTasks = tasks.filter(
        (task: any) => task.currentStatus === "ongoing"
      );

      setOngoingTasks(filteredOngoingTasks);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching ongoing tasks:", error);
      setLoading(false); // Set loading to false even in case of error
    }
  };

  // Update task status
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

      // Refresh tasks after status update
      fetchOngoingTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
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

  // Truncate description and show "Read More" if necessary
  const truncateDescription = (description: string) => {
    const maxLength = 150; // Maximum characters before truncation
    return description.length > maxLength
      ? description.slice(0, maxLength) + "..."
      : description;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r bg-slate-900 text-yellow-300 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-700 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Ongoing Tasks</h1>
        <p className="text-lg mb-6">Manage and track your ongoing tasks efficiently.</p>

        {loading ? (
         <Loader/>
        ) : ongoingTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingTasks.map((task) => (
              <div
                key={task.taskId}
                className={`group relative p-8 rounded-lg shadow-xl ${getPriorityColor(
                  task.priority
                )} hover:scale-105 transform transition-all duration-300 overflow-hidden`}
              >
                <h2 className="text-3xl font-semibold text-white">{task.title}</h2>
                <p className="text-base text-gray-100 mt-2">ID: {task.taskId}</p>
                <p className="text-base text-white mt-2">
                  {task.isExpanded ? (
                    task.description
                  ) : (
                    <>
                      {truncateDescription(task.description)}
                      {task.description.length > 150 && (
                        <span
                          className="text-yellow-300 cursor-pointer hover:underline"
                          onClick={() => {
                            const updatedTasks = ongoingTasks.map((t) =>
                              t.taskId === task.taskId
                                ? { ...t, isExpanded: !t.isExpanded }
                                : t
                            );
                            setOngoingTasks(updatedTasks);
                          }}
                        >
                          {" "}
                          Read More
                        </span>
                      )}
                    </>
                  )}
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
                        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-20 text-center text-gray-200">
            <h2 className="text-2xl font-bold mb-4">No Ongoing Tasks Found</h2>
            <p className="text-lg">You have no tasks in progress. Start working on tasks to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OngoingTasksPage;
