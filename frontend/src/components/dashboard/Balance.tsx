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
          className="text-blue-400 hover:text-blue-300 transition-colors"
          disabled={isLoading}
        >
          {/* Updated SVG for a simpler refresh icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.836 0H20v-5m0 11v5h-.581m0 0a9.003 9.003 0 01-16.205-.003m.002-.685a9.003 9.003 0 0116.205.685M4 16v5h.582m0 0a9.003 9.003 0 0015.836 0M3 12h18"
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
