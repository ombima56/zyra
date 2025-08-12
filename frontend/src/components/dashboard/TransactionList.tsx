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
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
          disabled={isLoading}
          aria-label="Refresh transactions"
        >
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
