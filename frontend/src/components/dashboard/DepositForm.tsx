import { useState } from "react";

type DepositFormProps = {
  amount: string;
  depositPhone: string;
  message: string;
  onAmountChange: (value: string) => void;
  onDepositPhoneChange: (value: string) => void;
  onDeposit: () => void;
  isLoading?: boolean;
};

export function DepositForm({
  amount,
  depositPhone,
  message,
  onAmountChange,
  onDepositPhoneChange,
  onDeposit,
  isLoading = false,
}: DepositFormProps) {
  const [isDepositing, setIsDepositing] = useState(false);
  const [showPhoneHelper, setShowPhoneHelper] = useState(false);

  // Validation logic
  const numAmount = parseFloat(amount);
  const isValidAmount = !isNaN(numAmount) && numAmount > 0;

  // Kenyan phone number validation (M-Pesa format)
  const phoneRegex = /^(\+254|254|0)?[17]\d{8}$/;
  const cleanPhone = depositPhone.replace(/\s+/g, "");
  const isValidPhone = phoneRegex.test(cleanPhone);

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      await onDeposit();
    } finally {
      // Reset depositing state after a small delay to show completion
      setTimeout(() => setIsDepositing(false), 500);
    }
  };

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
                className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base ${
                  amount && !isValidAmount
                    ? "bg-red-900/20 border-red-500/50 focus:ring-red-500"
                    : "bg-gray-900/80 border-gray-600/50 focus:ring-green-500"
                } focus:border-transparent`}
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                step="0.01"
                min="0.01"
                disabled={isDepositing}
              />
            </div>

            {amount && !isValidAmount && (
              <p className="mt-1 text-xs text-red-400">
                Amount must be greater than 0
              </p>
            )}

            {/* Quick amount buttons */}
            <div className="flex space-x-2 mt-2">
              {[10, 25, 50, 100].map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => onAmountChange(quickAmount.toString())}
                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
                  disabled={isDepositing}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                M-Pesa Phone Number
              </label>
              <button
                type="button"
                onClick={() => setShowPhoneHelper(!showPhoneHelper)}
                className="text-xs text-green-400 hover:text-green-300"
              >
                Format help
              </button>
            </div>

            <input
              type="tel"
              placeholder="+254712345678"
              className={`w-full p-3 sm:p-4 rounded-xl border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base ${
                depositPhone && !isValidPhone
                  ? "bg-red-900/20 border-red-500/50 focus:ring-red-500"
                  : "bg-gray-900/80 border-gray-600/50 focus:ring-green-500"
              } focus:border-transparent`}
              value={depositPhone}
              onChange={(e) => onDepositPhoneChange(e.target.value)}
              disabled={isDepositing}
            />

            {depositPhone && !isValidPhone && (
              <p className="mt-1 text-xs text-red-400">
                Invalid phone number format. Use +254XXXXXXXXX or 0XXXXXXXXX
              </p>
            )}

            {showPhoneHelper && (
              <div className="mt-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-xs text-green-300">
                <p className="mb-1">Accepted formats:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>+254712345678</li>
                  <li>254712345678</li>
                  <li>0712345678</li>
                </ul>
                <p className="mt-2 text-green-400">
                  Make sure your M-Pesa is active and has sufficient limits.
                </p>
              </div>
            )}

            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Enter the M-Pesa number to charge
            </p>
          </div>

          {/* Transaction Preview */}
          {amount && depositPhone && isValidAmount && isValidPhone && (
            <div className="p-3 bg-gray-900/50 border border-gray-600/30 rounded-xl">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Deposit Summary
              </h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="text-white">${amount} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="text-white">{depositPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="text-green-400">M-Pesa</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="text-white">Included</span>
                </div>
              </div>
            </div>
          )}

          {/* Deposit Button */}
          <button
            onClick={handleDeposit}
            disabled={
              isLoading || !isValidAmount || !isValidPhone || isDepositing
            }
            className={`w-full font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
              isDepositing
                ? "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white"
            }`}
          >
            {isDepositing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Initiating Deposit...</span>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Confirm Deposit"
            )}
          </button>

          {/* Instructions */}
          {isDepositing && (
            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs text-blue-300">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0"></div>
                <div>
                  <p className="font-medium mb-1">M-Pesa STK Push Sent!</p>
                  <p>
                    Check your phone for the M-Pesa prompt and enter your PIN to
                    complete the transaction.
                  </p>
                </div>
              </div>
            </div>
          )}

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
