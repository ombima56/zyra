type ActionsProps = {
  onDepositClick: () => void;
  onSendClick: () => void;
};

export default function Actions({ onDepositClick, onSendClick }: ActionsProps) {
  return (
    <div className="w-full max-w-xl grid grid-cols-2 gap-4 mb-8">
      <button
        onClick={onDepositClick}
        className="flex flex-col items-center justify-center p-6 bg-green-600 rounded-2xl shadow-md hover:bg-green-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-white mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="text-lg font-medium text-white">Deposit</span>
      </button>
      <button
        onClick={onSendClick}
        className="flex flex-col items-center justify-center p-6 bg-blue-600 rounded-2xl shadow-md hover:bg-blue-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-white mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        <span className="text-lg font-medium text-white">Send</span>
      </button>
    </div>
  );
}
