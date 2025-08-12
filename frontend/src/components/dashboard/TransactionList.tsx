type TransactionRecord = {
  id: string;
  source_account: string;
  amount: string;
  asset_code?: string;
  from?: string;
  to?: string;
};

type TransactionListProps = {
  transactions: TransactionRecord[];
  isLoading: boolean;
  onRefresh: () => void;
};

export function TransactionList({
  transactions,
  isLoading,
  onRefresh,
}: TransactionListProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

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
                  Recent Transactions
                </h2>
                <p className="text-sm text-gray-400">
                  Your transaction history
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
            <div className="space-y-3 sm:space-y-4">
              {transactions.map((tx, i) => (
                <div
                  key={i}
                  className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-4 sm:p-5 hover:bg-gray-900/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
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
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-semibold text-white truncate">
                          Transaction
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 font-mono">
                          {formatAddress(tx.id)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm sm:text-lg font-bold text-green-400">
                        +${tx.amount}
                      </p>
                      <p className="text-xs text-gray-500">{tx.asset_code}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                Your transactions will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionList;
