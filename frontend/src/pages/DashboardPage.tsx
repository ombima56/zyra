"use client";
import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import Balance from "@/components/dashboard/Balance";
import Actions from "@/components/dashboard/Actions";
import SendMoneyForm from "@/components/dashboard/SendMoneyForm";
import DepositForm from "@/components/dashboard/DepositForm";
import TransactionList from "@/components/dashboard/TransactionList";

// Types for a cleaner codebase
type Wallet = {
  id: number; // Add user ID to the wallet type
  publicKey: string;
  secret: string;
};

type TransactionRecord = {
  id: string;
  source_account: string;
  amount: string;
  asset_code?: string;
  from?: string;
  to?: string;
};

type Freighter = typeof import("@stellar/freighter-api");

export default function DashboardPage() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [depositPhone, setDepositPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showSendForm, setShowSendForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [freighter, setFreighter] = useState<Freighter | null>(null);
  const [freighterError, setFreighterError] = useState<string | null>(null);

  useEffect(() => {
    const loadFreighter = async () => {
      try {
        const module = await import("@stellar/freighter-api");
        setFreighter(module);
        setFreighterError(null);
      } catch (error) {
        console.error("Failed to load Freighter:", error);
        setFreighterError(
          "Failed to load Freighter wallet. Please install the Freighter browser extension."
        );
      }
    };

    loadFreighter();
  }, []);

  const handleConnect = async () => {
    if (!freighter) {
      setMessage(
        "❌ Freighter wallet not loaded yet. Please wait or refresh the page."
      );
      return;
    }

    try {
      setMessage("");
      setIsLoading(true);
      const pk = await connectWallet(freighter);
      setPublicKey(pk);
      if (pk) {
        await fetchData(pk);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setMessage(`❌ ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (rawBalance: bigint, decimals: number): string => {
    if (rawBalance === BigInt(0)) {
      return "0.00";
    }

    const balanceStr = rawBalance.toString();
    const decimalPointPosition = balanceStr.length - decimals;

    let formatted;
    if (decimalPointPosition <= 0) {
      const leadingZeros = "0".repeat(Math.abs(decimalPointPosition));
      formatted = `0.${leadingZeros}${balanceStr}`;
    } else {
      formatted =
        balanceStr.slice(0, decimalPointPosition) +
        "." +
        balanceStr.slice(decimalPointPosition);
    }

    const [integerPart, fractionalPart] = formatted.split(".");
    const twoDecimalPlaces = fractionalPart ? fractionalPart.slice(0, 2) : "00";

    return `${integerPart}.${twoDecimalPlaces}`;
  };

  const fetchData = async (pk: string) => {
    setIsLoading(true);
    try {
      const balanceResult = (await getBalance(pk)) as bigint;
      const formattedBalance = formatBalance(balanceResult, 7);
      setBalance(formattedBalance);

      const mockTransactions: TransactionRecord[] = [
        {
          id: "mock-tx-1234567890abcdef",
          source_account: "GDJ3YXXX...XXXX",
          amount: "50.00",
          asset_code: "XLM",
          from: "GDJ3YXXX...XXXX",
          to: pk,
        },
        {
          id: "mock-tx-9876543210fedcba",
          source_account: pk,
          amount: "15.50",
          asset_code: "XLM",
          from: pk,
          to: "GB245XXX...XXXX",
        },
      ];
      setTransactions(mockTransactions);
      setMessage("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage(`❌ ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMoney = async () => {
    if (!publicKey || !freighter) return;
    setMessage("");
    setIsLoading(true);
    try {
      await transfer(publicKey, recipient, amount, freighter);
      setMessage("✅ Money sent successfully!");
      setRecipient("");
      setAmount("");
      setShowSendForm(false);
      await fetchData(publicKey);
    } catch (err) {
      console.error("Transfer error:", err);
      setMessage("❌ " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!wallet) {
      setMessage('❌ Wallet not found. Please log in again.');
      return;
    }
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          phone: depositPhone,
          userId: wallet.id,
        }),
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (!res.ok) {
          throw new Error(data.details || data.error || 'Failed to initiate STK Push');
        }
        setMessage(`✅ STK Push initiated for ${amount} KES. Check your phone to complete the transaction.`);
      } catch (error) {
        throw new Error(text);
      }
      setDepositPhone('');
      setAmount('');

    } catch (err) {
      setMessage(`❌ ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsername = () => {
    if (!publicKey) return "User";
    return publicKey.slice(0, 4) + "..." + publicKey.slice(-4);
  };

  const toggleSendForm = () => {
    setShowSendForm(!showSendForm);
    setShowDepositForm(false);
    setMessage("");
  };

  const toggleDepositForm = () => {
    setShowDepositForm(!showDepositForm);
    setShowSendForm(false);
    setMessage("");
  };

  // Connection/Error States
  if (freighterError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Wallet Connection Error</h1>
          <p className="text-red-400 mb-6 text-sm leading-relaxed">
            {freighterError}
          </p>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Please install the Freighter browser extension and make sure it
            supports Soroban smart contracts.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Zrya</h1>
          <p className="text-gray-400 mb-8">
            Connect your wallet to get started with secure transactions
          </p>

          {message && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{message}</p>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={!freighter || isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Connecting...</span>
              </div>
            ) : freighter ? (
              "Connect Wallet"
            ) : (
              "Loading Wallet..."
            )}
          </button>

          {!freighter && (
            <p className="text-gray-500 text-sm mt-4">
              Loading Freighter wallet interface...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Header */}
      <Header
        username={getUsername()}
        onLogout={() => {
          setPublicKey(null);
          setBalance(null);
          setTransactions([]);
          setMessage("");
          setShowSendForm(false);
          setShowDepositForm(false);
        }}
        publicKey={publicKey || ""}
      />

      {/* Main Content */}
      <main className="pb-8 sm:pb-12">
        {/* Balance Section */}
        <Balance
          balance={balance}
          isLoading={isLoading}
          onRefresh={() => publicKey && fetchData(publicKey)}
        />

        {/* Quick Actions */}
        <Actions
          onDepositClick={toggleDepositForm}
          onSendClick={toggleSendForm}
        />

        {/* Global Message */}
        {message && !showSendForm && !showDepositForm && (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div
              className={`p-4 rounded-xl text-center ${
                message.includes("✅")
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message}
            </div>
          </div>
        )}

        {/* Forms */}
        {showDepositForm && (
          <DepositForm
            amount={amount}
            depositPhone={depositPhone}
            message={message}
            onAmountChange={setAmount}
            onDepositPhoneChange={setDepositPhone}
            onDeposit={handleDeposit}
          />
        )}

        {showSendForm && (
          <SendMoneyForm
            recipient={recipient}
            amount={amount}
            message={message}
            onRecipientChange={setRecipient}
            onAmountChange={setAmount}
            onSend={handleSendMoney}
          />
        )}

        {/* Transactions */}
        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          onRefresh={() => publicKey && fetchData(publicKey)}
        />
      </main>
    </div>
  );
}
