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

export default function TransactionList({
  transactions,
  isLoading,
  onRefresh,
}: TransactionListProps) {
  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-200">
          Recent Transactions
        </h2>
        <button
          onClick={onRefresh}
          className="text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
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
      <ul className="space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading transactions...</p>
        ) : transactions.length > 0 ? (
          transactions.map((tx, i) => (
            <li
              key={i}
              className="bg-gray-900 p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium text-white">
                  Transaction ID: {tx.id.slice(0, 10)}...
                </p>
                <p className="text-sm text-gray-400">
                  Amount: {tx.amount} {tx.asset_code}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No transactions found.</p>
        )}
      </ul>
    </div>
  );
}
