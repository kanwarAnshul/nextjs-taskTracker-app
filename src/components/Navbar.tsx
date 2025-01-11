"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();

  const onLogout = async () => {
    try {
      await axios.get("api/users/logout", {}).then(() => {
        toast.success("Successfully logged out");
        router.push("/");
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMobileMenuToggle = () => setIsMobileMenuOpen((prev) => !prev);

  const handleProfileMenuToggle = () => setIsProfileMenuOpen((prev) => !prev);

  return (
    <nav className="bg-slate-800 text-yellow-300 p-4 shadow-lg transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Section: Logo */}
        <div>
          <Link
            href="/"
            className="font-bold text-2xl sm:text-3xl transition-all duration-200 hover:text-yellow-400 transform hover:scale-110"
          >
            Task Manager
          </Link>
        </div>

        {/* Center Section: Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            href="/alltasks"
            className="text-lg font-semibold hover:text-yellow-400 hover:scale-105 transition-all duration-200"
          >
            All Tasks
          </Link>
          <Link
            href="/pendingtasks"
            className="text-lg font-semibold hover:text-yellow-400 hover:scale-105 transition-all duration-200"
          >
            Pending Tasks
          </Link>
          <Link
            href="/ongoingtasks"
            className="text-lg font-semibold hover:text-yellow-400 hover:scale-105 transition-all duration-200"
          >
            Ongoing Tasks
          </Link>
          <Link
            href="/completedtasks"
            className="text-lg font-semibold hover:text-yellow-400 hover:scale-105 transition-all duration-200"
          >
            Completed Tasks
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center space-x-2 p-2 text-yellow-300 rounded-lg hover:bg-yellow-400 hover:text-slate-800 transition-all"
          onClick={handleMobileMenuToggle}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Profile Icon and Dropdown for Desktop */}
        <Menu as="div" className="relative hidden md:block">
          <Menu.Button
            onClick={handleProfileMenuToggle}
            className="flex items-center space-x-2 bg-slate-700 p-3 rounded-full text-yellow-300 hover:bg-yellow-400 hover:text-slate-800 transition-all duration-300 ease-in-out"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4C10.343 4 9 5.343 9 7C9 8.657 10.343 10 12 10C13.657 10 15 8.657 15 7C15 5.343 13.657 4 12 4ZM6 14C6 12.343 7.343 11 9 11H15C16.657 11 18 12.343 18 14V18C18 19.657 16.657 21 15 21H9C7.343 21 6 19.657 6 18V14Z"
              />
            </svg>
            <span className="font-semibold">Profile</span>
            <svg
              className="w-5 h-5 transform transition-all duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-slate-800 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-2">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-slate-700 text-yellow-400" : "text-yellow-300"
                      }`}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        active ? "bg-slate-700 text-yellow-400" : "text-yellow-300"
                      }`}
                      onClick={() => {
                        onLogout();
                      }}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Mobile Profile Icon and Dropdown */}
      <div className="md:hidden flex items-center space-x-2">
        <button
          className="flex items-center space-x-2 p-2 text-yellow-300 rounded-lg hover:bg-yellow-400 hover:text-slate-800 transition-all"
          onClick={handleProfileMenuToggle}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4C10.343 4 9 5.343 9 7C9 8.657 10.343 10 12 10C13.657 10 15 8.657 15 7C15 5.343 13.657 4 12 4ZM6 14C6 12.343 7.343 11 9 11H15C16.657 11 18 12.343 18 14V18C18 19.657 16.657 21 15 21H9C7.343 21 6 19.657 6 18V14Z"
            />
          </svg>
          <span>Profile</span>
        </button>

        <Transition
          show={isProfileMenuOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg p-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-yellow-300 hover:bg-slate-700 hover:text-yellow-400"
            >
              Profile
            </Link>
            <button
              className="block px-4 py-2 text-sm text-yellow-300 hover:bg-slate-700 hover:text-yellow-400 w-full text-left"
              onClick={() => onLogout()}
            >
              Logout
            </button>
          </div>
        </Transition>
      </div>

      {/* Mobile Menu Dropdown */}
      <Transition
        show={isMobileMenuOpen}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="md:hidden bg-slate-800 divide-y divide-gray-700 rounded-lg shadow-lg mt-2">
          <div className="flex flex-col p-2">
            <Link
              href="/alltasks"
              className="px-4 py-2 text-lg font-semibold text-yellow-300 hover:bg-slate-700 hover:text-yellow-400 transition-all duration-200"
            >
              All Tasks
            </Link>
            <Link
              href="/pendingtasks"
              className="px-4 py-2 text-lg font-semibold text-yellow-300 hover:bg-slate-700 hover:text-yellow-400 transition-all duration-200"
            >
              Pending Tasks
            </Link>
            <Link
              href="/ongoingtasks"
              className="px-4 py-2 text-lg font-semibold text-yellow-300 hover:bg-slate-700 hover:text-yellow-400 transition-all duration-200"
            >
              Ongoing Tasks
            </Link>
            <Link
              href="/completedtasks"
              className="px-4 py-2 text-lg font-semibold text-yellow-300 hover:bg-slate-700 hover:text-yellow-400 transition-all duration-200"
            >
              Completed Tasks
            </Link>
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;
