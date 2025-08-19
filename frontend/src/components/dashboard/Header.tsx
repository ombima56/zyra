"use client";
import { useState } from "react";

type HeaderProps = {
  username: string;
  onLogout: () => void;
  publicKey: string;
};

export default function Header({ username, onLogout, publicKey }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowAccountMenu(false);
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  const formatAddress = (address: string, isMobile = false) => {
    if (isMobile) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur-sm mb-8 sticky top-0 z-40">
      <div className="w-full mx-auto border-1 border-gray-800/50 rounded-2xl p-4 sm:p-6 lg:p-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Wallet Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Zrya
            </h1>
          </div>

          {/* Account Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Network Indicator - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-400">
                Mainnet
              </span>
            </div>

            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 rounded-xl transition-all duration-200 group"
              >
                {/* Avatar */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Address - Desktop */}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs text-gray-400">Wallet</span>
                  <span className="text-sm font-mono text-gray-200">
                    {formatAddress(publicKey)}
                  </span>
                </div>

                {/* Chevron */}
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    showAccountMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showAccountMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl z-50">
                  {/* Account Info */}
                  <div className="p-4 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{username}</p>
                        <p className="text-xs text-gray-400">Main Wallet</p>
                      </div>
                    </div>

                    {/* Full Address */}
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Address</p>
                      <p className="text-sm font-mono text-gray-200 break-all">
                        {publicKey}
                      </p>
                    </div>
                  </div>

                  {/* Menu Actions */}
                  <div className="p-2">
                    <button
                      onClick={handleCopyAddress}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-200">
                        {copied ? "Address Copied!" : "Copy Address"}
                      </span>
                    </button>

                    <button
                      onClick={onLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Copy Toast */}
      {copied && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Address copied to clipboard</span>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showAccountMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowAccountMenu(false)}
        />
      )}
    </header>
  );
}
