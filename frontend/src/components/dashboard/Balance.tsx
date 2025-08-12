type BalanceProps = {
  balance: string | null;
  isLoading: boolean;
  onRefresh: () => void;
};

export default function Balance({
  balance,
  isLoading,
  onRefresh,
}: BalanceProps) {
  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-3xl shadow-lg mb-8 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-300">Total Balance</h2>
        <button
          onClick={onRefresh}
          className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          disabled={isLoading}
          aria-label="Refresh balance"
        >
          {/* Simple circular refresh icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
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
      <p className="text-5xl md:text-6xl font-extrabold text-white">
        {isLoading ? "..." : `$${balance || "0.00"}`}
      </p>
    </div>
  );
}
