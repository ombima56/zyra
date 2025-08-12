type ActionsProps = {
  onDepositClick: () => void;
  onSendClick: () => void;
};

export function Actions({ onDepositClick, onSendClick }: ActionsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Deposit Button */}
        <button
          onClick={onDepositClick}
          className="group flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-green-500/20"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/20 transition-colors">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white"
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
          </div>
          <span className="text-sm sm:text-lg lg:text-xl font-semibold text-white">
            Add Funds
          </span>
          <span className="text-xs sm:text-sm text-green-100 mt-1 opacity-80">
            Deposit money
          </span>
        </button>

        {/* Send Button */}
        <button
          onClick={onSendClick}
          className="group flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-500/20"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/20 transition-colors">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white"
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
          </div>
          <span className="text-sm sm:text-lg lg:text-xl font-semibold text-white">
            Send Money
          </span>
          <span className="text-xs sm:text-sm text-blue-100 mt-1 opacity-80">
            Transfer funds
          </span>
        </button>
      </div>
    </div>
  );
}

export default Actions;
