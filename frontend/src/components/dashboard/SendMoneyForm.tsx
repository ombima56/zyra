import { useState } from "react";

type SendMoneyFormProps = {
  recipient: string;
  amount: string;
  message: string;
  onRecipientChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  currentBalance?: string;
};

export function SendMoneyForm({
  recipient,
  amount,
  message,
  onRecipientChange,
  onAmountChange,
  onSend,
  isLoading = false,
  currentBalance = "0",
}: SendMoneyFormProps) {
  const [showAddressHelper, setShowAddressHelper] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const isValidAddress = recipient.startsWith("G") && recipient.length === 56;
  const numAmount = parseFloat(amount);
  const balance = parseFloat(currentBalance);
  const isValidAmount =
    !isNaN(numAmount) && numAmount > 0 && numAmount <= balance;

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend();
    } finally {
      // Reset sending state after a small delay to show completion
      setTimeout(() => setIsSending(false), 500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center">
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              Send Money
            </h3>
            <p className="text-sm text-gray-400">
              Transfer funds to another wallet
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Recipient Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Recipient Address
              </label>
              <button
                type="button"
                onClick={() => setShowAddressHelper(!showAddressHelper)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Address format help
              </button>
            </div>

            <input
              type="text"
              placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              className={`w-full p-3 sm:p-4 rounded-xl border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base font-mono ${
                recipient && !isValidAddress
                  ? "bg-red-900/20 border-red-500/50 focus:ring-red-500"
                  : "bg-gray-900/80 border-gray-600/50 focus:ring-blue-500"
              } focus:border-transparent`}
              value={recipient}
              onChange={(e) => onRecipientChange(e.target.value)}
              disabled={isSending}
            />

            {recipient && !isValidAddress && (
              <p className="mt-1 text-xs text-red-400">
                Invalid address format. Must start with 'G' and be 56 characters
                long.
              </p>
            )}

            {showAddressHelper && (
              <div className="mt-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs text-blue-300">
                Stellar addresses start with 'G' and are exactly 56 characters
                long. Example:
                GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Amount (USD)
              </label>
              <span className="text-xs text-gray-400">
                Balance: ${currentBalance}
              </span>
            </div>
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
                    : "bg-gray-900/80 border-gray-600/50 focus:ring-blue-500"
                } focus:border-transparent`}
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                step="0.01"
                min="0.01"
                max={currentBalance}
                disabled={isSending}
              />
            </div>

            {amount && !isValidAmount && (
              <p className="mt-1 text-xs text-red-400">
                {numAmount > balance
                  ? "Insufficient balance"
                  : "Amount must be greater than 0"}
              </p>
            )}

            {/* Quick amount buttons */}
            <div className="flex space-x-2 mt-2">
              {[25, 50, 75, 100].map((percentage) => {
                const quickAmount = ((balance * percentage) / 100).toFixed(2);
                return (
                  <button
                    key={percentage}
                    type="button"
                    onClick={() => onAmountChange(quickAmount)}
                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
                    disabled={balance <= 0 || isSending}
                  >
                    {percentage}%
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transaction Summary */}
          {recipient && amount && isValidAddress && isValidAmount && (
            <div className="p-3 bg-gray-900/50 border border-gray-600/30 rounded-xl">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Transaction Summary
              </h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="text-white">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span className="text-white font-mono">
                    {recipient.slice(0, 8)}...{recipient.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span className="text-white">~$0.001</span>
                </div>
              </div>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={
              isLoading || !isValidAddress || !isValidAmount || isSending
            }
            className={`w-full font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
              isSending
                ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
            }`}
          >
            {isSending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Confirm Send"
            )}
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

export default SendMoneyForm;
