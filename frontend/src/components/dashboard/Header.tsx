"use client";

import { useState } from "react";

type HeaderProps = {
  username: string;
  onLogout: () => void;
};

export default function Header({ username, onLogout }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="w-full max-w-xl flex justify-between items-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-green-800">
        Zrya
      </h1>
      <div className="relative">
        <button
          className="flex items-center space-x-2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            {username.charAt(0)}
          </div>
          <span className="hidden md:inline-block text-sm font-medium">
            {username}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transform transition-transform ${
              showProfileMenu ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-lg"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
