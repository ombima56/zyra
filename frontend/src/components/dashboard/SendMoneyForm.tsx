type SendMoneyFormProps = {
  recipient: string;
  amount: string;
  message: string;
  onRecipientChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSend: () => void;
};

export default function SendMoneyForm({
  recipient,
  amount,
  message,
  onRecipientChange,
  onAmountChange,
  onSend,
}: SendMoneyFormProps) {
  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-200">Send Money</h3>
      <p className="text-sm text-gray-400 mb-4">
        Enter recipient's wallet address and amount.
      </p>
      <input
        type="text"
        placeholder="Recipient Public Key"
        className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        value={recipient}
        onChange={(e) => onRecipientChange(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
      />
      <button
        onClick={onSend}
        className="w-full bg-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Confirm Send
      </button>
      {message && <p className="mt-4 text-center text-green-400">{message}</p>}
    </div>
  );
}
