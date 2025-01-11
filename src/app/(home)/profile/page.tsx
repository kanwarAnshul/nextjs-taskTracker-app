"use client";
import Loader from "@/components/Loader";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";

interface UserData {
  username: string;
  email: string;
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users/get-user-task-data", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const user = response.data?.data?.user;
      if (user) {
        setUserData({
          username: user.username,
          email: user.email,
        });
        toast.success("Successfully fetched user data");
      } else {
        throw new Error("User data is missing in the response.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch user data."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-700">
        <Loader />
      </div>
    );

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex justify-center items-center px-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center relative">
        {/* Profile Picture */}
        <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center shadow-md mb-4 relative">
          {userData?.username ? (
            <Image
              src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile"
              height={40}
              width={40}
              className="rounded-full w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")} // Fallback if image fails to load
            />
          ) : (
            <FaUserCircle className="text-gray-500 text-5xl" />
          )}
        </div>

        {/* Profile Details */}
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          Profile Details
        </h1>

        <div className="animate-fade-in-up">
          <div className="text-xl font-semibold text-yellow-400 mb-4">
            Username:
            <span className="block text-white text-lg mt-1">
              {userData?.username || "Loading..."}
            </span>
          </div>
          <div className="text-xl font-semibold text-yellow-400 mb-4">
            Email:
            <span className="block text-white text-lg mt-1">
              {userData?.email || "Loading..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
