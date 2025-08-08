"use client";
import { useState } from "react";

type HeaderProps = {
  username: string;
  onLogout: () => void;
  publicKey: string;
};

export default function Header({ username, onLogout, publicKey }: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const truncatedKey = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;

  return (
    <header className="w-full max-w-xl flex justify-between items-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-green-800">
        Zrya
      </h1>
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <button className="flex items-center space-x-2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <span className="hidden md:inline-block text-sm font-medium text-gray-200">
              {truncatedKey}
            </span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-max p-2 bg-gray-800 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleCopy}
              className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-lg flex items-center space-x-2"
            >
              <span>{copied ? "Copied!" : "Copy Address"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </button>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
