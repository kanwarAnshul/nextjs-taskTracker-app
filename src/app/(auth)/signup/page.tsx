"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const SignUpPage = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(
        "/api/users/signup",
        { username, email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success("Successfully signed up!");
      setIsLoading(false);
      router.push("/login");
    } catch (err: unknown) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Signup failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={onSignup}>
          <div>
            <label className="block text-yellow-400 mb-1" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-yellow-400 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-yellow-400 mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded font-semibold transition ${
              isLoading
                ? "bg-yellow-300 text-slate-800 cursor-not-allowed"
                : "bg-yellow-400 text-slate-900 hover:bg-yellow-500"
            }`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-slate-400 text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
