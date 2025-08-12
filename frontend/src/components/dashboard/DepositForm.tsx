type DepositFormProps = {
  amount: string;
  depositPhone: string;
  message: string;
  onAmountChange: (value: string) => void;
  onDepositPhoneChange: (value: string) => void;
  onDeposit: () => void;
};

export function DepositForm({
  amount,
  depositPhone,
  message,
  onAmountChange,
  onDepositPhoneChange,
  onDeposit,
}: DepositFormProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              Add Funds
            </h3>
            <p className="text-sm text-gray-400">Deposit via M-Pesa</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl bg-gray-900/80 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              placeholder="+254712345678"
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/80 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              value={depositPhone}
              onChange={(e) => onDepositPhoneChange(e.target.value)}
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Enter the M-Pesa number to charge
            </p>
          </div>

          {/* Deposit Button */}
          <button
            onClick={onDeposit}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base"
          >
            Confirm Deposit
          </button>

          {/* Message */}
          {message && (
            <div
              className={`p-3 sm:p-4 rounded-xl text-center text-sm sm:text-base ${
                message.includes("✅")
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DepositForm;
