"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Loader from "@/components/Loader";
import { AxiosError } from "axios";
const HomePage = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");
  const [userId, setUserId] = useState<string | null>();
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/users/get-user-data");
        if (response.data.data._id) {
          setUserId(response.data.data._id);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim() || !taskDescription.trim()) {
      toast.error("Task title and description cannot be empty!");
      return;
    }

    if (!userId) {
      toast.error("User is not logged in!");
      return;
    }

    setLoading(true); // Start loading when the task is being added
    try {
      const taskData = {
        taskId: `task-${Date.now()}`,
        title: taskTitle,
        description: taskDescription,
        deadline,
        priority: priority.toLowerCase(),
        userId,
      };

      const response = await axios.post("/api/users/create-task", taskData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success("Task added successfully!");
        setTaskTitle("");
        setTaskDescription("");
        setDeadline("");
        setPriority("Low");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error adding task:", error.response?.data || error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
      toast.error("Failed to add the task. Please try again!");
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-yellow-500 hover:text-yellow-400 transition duration-300">
            Task Manager
          </h1>
          <p className="text-gray-300 mt-2">Create and manage your tasks with ease.</p>
        </header>

        {/* Hero Section */}
        <div className="bg-slate-800 shadow-xl rounded-xl p-6 mb-8 flex items-center hover:scale-105 transition-all duration-500 ease-in-out">
          <Image
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Task Management"
            className="w-1/3 rounded-md shadow-lg transition-transform duration-300 ease-in-out"
            width={300}
            height={300}
          />
          <div className="ml-6">
            <h2 className="text-3xl font-bold text-yellow-400">Stay Organized</h2>
            <p className="text-gray-300 mt-2">Plan your day effectively by creating and prioritizing your tasks.</p>
          </div>
        </div>

        {/* Task Creation Form */}
        <div className="bg-slate-800 shadow-xl rounded-xl p-6 hover:scale-105 transition-all duration-500 ease-in-out">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Add a Task</h2>
          <form onSubmit={handleAddTask} className="space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2" htmlFor="taskTitle">
                Task Title
              </label>
              <input
                type="text"
                id="taskTitle"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border-2 border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                placeholder="Enter task title"
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2" htmlFor="taskDescription">
                Task Description
              </label>
              <textarea
                id="taskDescription"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border-2 border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                placeholder="Enter task description"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2" htmlFor="deadline">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border-2 border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border-2 border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-slate-900 px-4 py-2 rounded-md hover:bg-yellow-400 transition duration-300"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <svg
                    className="w-5 h-5 animate-spin mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      d="M4 12a8 8 0 0 1 16 0"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
               <Loader/>
                </span>
              ) : (
                "Add Task"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
