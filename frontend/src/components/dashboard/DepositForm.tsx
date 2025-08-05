type DepositFormProps = {
  amount: string;
  depositPhone: string;
  message: string;
  onAmountChange: (value: string) => void;
  onDepositPhoneChange: (value: string) => void;
  onDeposit: () => void;
};

export default function DepositForm({
  amount,
  depositPhone,
  message,
  onAmountChange,
  onDepositPhoneChange,
  onDeposit,
}: DepositFormProps) {
  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-200">Add Funds</h3>
      <p className="text-sm text-gray-400 mb-4">
        Enter the amount and the M-Pesa number to deposit from.
      </p>
      <input
        type="number"
        placeholder="Amount"
        className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
      />
      <input
        type="tel"
        placeholder="M-Pesa Phone Number (e.g., +2547...)"
        className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={depositPhone}
        onChange={(e) => onDepositPhoneChange(e.target.value)}
      />
      <button
        onClick={onDeposit}
        className="mt-4 w-full bg-green-600 px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        Confirm Deposit
      </button>
      {message && <p className="mt-4 text-center text-green-400">{message}</p>}
    </div>
  );
}
