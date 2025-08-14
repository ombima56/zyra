"use client";
import { useState, useEffect } from "react";
import Header from "@/components/dashboard/Header";
import Balance from "@/components/dashboard/Balance";
import Actions from "@/components/dashboard/Actions";
import SendMoneyForm from "@/components/dashboard/SendMoneyForm";
import DepositForm from "@/components/dashboard/DepositForm";
import TransactionList from "@/components/dashboard/TransactionList";
import { getBalance, transfer, deposit } from "@/lib/stellar";

type Wallet = {
  id: number;
  publicKey: string;
  secret: string;
};

export type TransactionRecord = {
  id: number;
  amount: number;
  phone: string;
  status: string;
  type: string;
  createdAt: string;
  mpesaReceiptNumber?: string;
};

export default function DashboardPage() {
  // Placeholder for publicKey and secretKey. In a real app, these would come from
  // a global state management solution (e.g., Context API, Redux) after login.
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);

  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [depositPhone, setDepositPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showSendForm, setShowSendForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedPublicKey = sessionStorage.getItem("publicKey");
    const storedSecretKey = sessionStorage.getItem("secretKey");

    if (storedPublicKey && storedSecretKey) {
      setPublicKey(storedPublicKey);
      setSecretKey(storedSecretKey);
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

  useEffect(() => {
    if (publicKey) {
      fetchData(publicKey);
    }
  }, [publicKey]);

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
      // Fetch balance
      const balanceResult = (await getBalance(pk)) as bigint;
      const formattedBalance = formatBalance(balanceResult, 7);
      setBalance(formattedBalance);

      // Fetch transactions
      const res = await fetch(`/api/transactions?publicKey=${pk}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch transactions");
      }
      const transactionsData = await res.json();
      setTransactions(transactionsData);

      setMessage("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage(`❌ ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMoney = async () => {
    if (!publicKey || !secretKey) {
      setMessage("❌ Please log in to send money.");
      return;
    }
    setMessage("");
    setIsLoading(true);
    try {
      await transfer(publicKey, recipient, amount, secretKey); // Pass secretKey
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
    if (!publicKey || !secretKey) {
      // Ensure secretKey is available for deposit if needed for signing
      setMessage("❌ Wallet not found. Please log in again.");
      return;
    }
    setMessage("");
    setIsLoading(true);
    try {
      // This part still uses the /api/mpesa/stk-push endpoint, which is fine.
      // The deposit function in stellar.ts is for contract interaction, not M-Pesa.
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          phone: depositPhone,
          userId: publicKey,
        }),
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (!res.ok) {
          throw new Error(
            data.details || data.error || "Failed to initiate STK Push"
          );
        }
        setMessage(
          `✅ STK Push initiated for ${amount} KES. Check your phone to complete the transaction.`
        );
      } catch (error) {
        throw new Error(text);
      }
      setDepositPhone("");
      setAmount("");
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

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Header */}
      <Header
        username={getUsername()}
        onLogout={() => {
          setPublicKey(null);
          setSecretKey(null); // Clear secret key on logout
          setBalance(null);
          setTransactions([]);
          setMessage("");
          setShowSendForm(false);
          setShowDepositForm(false);
          if (typeof window !== "undefined") {
            window.location.href = "/login"; // Redirect to login page
          }
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
