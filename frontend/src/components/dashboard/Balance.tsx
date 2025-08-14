type BalanceProps = {
  balance: string | null;
  isLoading: boolean;
  onRefresh: () => void;
};

export function Balance({ balance, isLoading, onRefresh }: BalanceProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-sm sm:text-base font-medium text-gray-400 mb-1">
              Total Balance
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Live</span>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="text-gray-400 hover:text-white transition-all duration-200 p-2 sm:p-3 rounded-xl hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
            disabled={isLoading}
            aria-label="Refresh balance"
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

        <div className="text-center sm:text-left">
          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent leading-tight">
            {isLoading ? (
              <span className="animate-pulse">•••</span>
            ) : (
              `$${balance || "0.00"}`
            )}
          </p>
          <p className="text-sm sm:text-base text-gray-400 mt-2">USD</p>
        </div>
      </div>
    </div>
  );
}

export default Balance;
