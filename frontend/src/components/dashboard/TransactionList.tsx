import React, { useState, useEffect } from "react";
import {
  StellarTransaction,
  formatXLMAmount,
  truncateAddress,
} from "@/lib/stellar";

type TransactionListProps = {
  transactions: StellarTransaction[];
  isLoading: boolean;
  onRefresh: () => void;
  userAddress?: string;
};

export function TransactionList({
  transactions,
  isLoading,
  onRefresh,
  userAddress,
}: TransactionListProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const BATCH_SIZE = 4;

  useEffect(() => {
    setVisibleCount(4);
  }, [transactions]);

  const getTransactionIcon = (type: StellarTransaction["type"]) => {
    switch (type) {
      case "SENT":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
        );
      case "RECEIVED":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 13l-5 5m0 0l-5-5m5 5V6"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        );
    }
  };

  const getTransactionColor = (type: StellarTransaction["type"]) => {
    switch (type) {
      case "SENT":
        return "from-red-500 to-rose-600";
      case "RECEIVED":
        return "from-green-500 to-emerald-600";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  const getAmountColor = (type: StellarTransaction["type"]) => {
    switch (type) {
      case "SENT":
        return "text-red-400";
      case "RECEIVED":
        return "text-green-400";
      default:
        return "text-blue-400";
    }
  };

  const getAmountPrefix = (type: StellarTransaction["type"]) => {
    switch (type) {
      case "SENT":
        return "-";
      case "RECEIVED":
        return "+";
      default:
        return "";
    }
  };

  /**
   * Returns a human-readable string describing the transaction.
   * @param {StellarTransaction} tx - Transaction to get title for
   * @returns {string} Title for the transaction
   */
  const getTransactionTitle = (tx: StellarTransaction) => {
    switch (tx.type) {
      case "SENT":
        return `Sent to ${truncateAddress(tx.to)}`;
      case "RECEIVED":
        return `Received from ${truncateAddress(tx.from)}`;
      default:
        return tx.operationType || "Transaction";
    }
  };

  /**
   * Return a string with the date and status of a transaction.
   * @param {StellarTransaction} tx - Transaction to get subtitle for
   * @returns {string} Subtitle with date and status
   */
  const getTransactionSubtitle = (tx: StellarTransaction) => {
    const date = new Date(tx.createdAt).toLocaleString();
    const status = tx.successful ? "Completed" : "Failed";
    return `${date} • ${status}`;
  };

  /**
   * Handle clicking on a transaction in the list.
   * Opens the transaction in Stellar Expert block explorer.
   * @param {StellarTransaction} tx - Transaction to open
   */
  const handleTransactionClick = (tx: StellarTransaction) => {
    // Open Stellar Expert or other block explorer
    const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${tx.hash}`;
    window.open(explorerUrl, "_blank");
  };

  /**
   * Toggles showing more or fewer transactions in the list.
   * If the visible count is already at the total number of transactions,
   * it resets to show only the first 4 transactions. Otherwise, it shows
   * 4 more transactions.
   */
  const handleViewMore = () => {
    if (visibleCount >= transactions.length) {
      setVisibleCount(BATCH_SIZE);
    } else {
      setVisibleCount((prev) =>
        Math.min(prev + BATCH_SIZE, transactions.length)
      );
    }
  };

  const visibleTransactions = transactions.slice(0, visibleCount);
  const hasMore = transactions.length > BATCH_SIZE;
  const showingAll = visibleCount >= transactions.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Transaction History
                </h2>
                <p className="text-sm text-gray-400">
                  Recent Stellar network transactions
                </p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              className="text-gray-400 hover:text-white transition-colors p-2 sm:p-3 rounded-xl hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gray-400/50 disabled:opacity-50"
              disabled={isLoading}
              aria-label="Refresh transactions"
            >
              <svg
                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  isLoading ? "animate-spin" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center space-x-2 text-gray-400">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm sm:text-base">
                  Loading transactions...
                </span>
              </div>
            </div>
          ) : transactions.length > 0 ? (
            <>
              <div className="space-y-3 sm:space-y-4">
                {visibleTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => handleTransactionClick(tx)}
                    className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-4 sm:p-5 hover:bg-gray-900/80 transition-all duration-200 cursor-pointer hover:border-gray-600/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${getTransactionColor(
                            tx.type
                          )}`}
                        >
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm sm:text-base font-semibold text-white truncate">
                            {getTransactionTitle(tx)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {getTransactionSubtitle(tx)}
                          </p>
                          {tx.memo && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              Memo: {tx.memo}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-sm sm:text-lg font-bold ${getAmountColor(
                            tx.type
                          )}`}
                        >
                          {getAmountPrefix(tx.type)}
                          {formatXLMAmount(tx.amount)} {tx.asset}
                        </p>
                        <p className="text-xs text-gray-500">
                          Fee: {formatXLMAmount(tx.fee)} XLM
                        </p>
                        {!tx.successful && (
                          <p className="text-xs text-red-400 mt-1">Failed</p>
                        )}
                      </div>
                    </div>

                    {/* Additional details for expanded view */}
                    <div className="mt-3 pt-3 border-t border-gray-700/30">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Asset: {tx.asset}</span>
                        <span className="font-mono">
                          {truncateAddress(tx.hash, 6, 6)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleViewMore}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  >
                    {showingAll ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Reset to First 4
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
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
                        View More (
                        {Math.min(
                          BATCH_SIZE,
                          transactions.length - visibleCount
                        )}{" "}
                        more)
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Showing {visibleCount} of {transactions.length} transactions
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                No transactions yet
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Your Stellar transactions will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionList;
