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

export default function DashboardPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [depositPhone, setDepositPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showSendForm, setShowSendForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = {
    push: (path: string) => {
      window.location.href = path;
    },
  };

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      const parsedWallet = JSON.parse(storedWallet) as Wallet;
      setWallet(parsedWallet);
      // Automatically fetch balance and transactions on load
      fetchData(parsedWallet.publicKey);
    } else {
      router.push("/login");
    }
  }, []);

  // Centralized data fetching function to avoid code duplication
  const fetchData = async (publicKey: string) => {
    setIsLoading(true);
    try {
      // Mocking API calls for a functioning UI without external libraries
      // Simulating a balance fetch
      const mockBalance = (Math.random() * 1000).toFixed(2);
      setBalance(mockBalance);

      // Simulating transaction fetching
      const mockTransactions: TransactionRecord[] = [
        {
          id: "mock-tx-1",
          source_account: "GDJ3Y...",
          amount: "50.00",
          asset_code: "XLM",
          from: "GDJ3Y...",
          to: publicKey,
        },
        {
          id: "mock-tx-2",
          source_account: publicKey,
          amount: "15.50",
          asset_code: "XLM",
          from: publicKey,
          to: "GB245...",
        },
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to load wallet data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMoney = async () => {
    setMessage("");
    setIsLoading(true);
    try {
      // Mocking API call for sending money
      // This is a placeholder for the real API call
      console.log("Sending money to:", recipient, "Amount:", amount);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      setMessage("✅ Money sent successfully!");
      setRecipient("");
      setAmount("");
      if (wallet) fetchData(wallet.publicKey); // Refresh data
    } catch (err) {
      setMessage("❌ " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    setMessage("");
    setIsLoading(true);
    try {
      // This is the core API call for the deposit
      // Mocking the API call
      console.log(
        "Deposit request initiated for phone:",
        depositPhone,
        "Amount:",
        amount
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      setMessage(
        `✅ Deposit request initiated for ${amount} XLM. Check your phone for a prompt.`
      );
      setDepositPhone("");
      setAmount("");
      // No need to refresh immediately as the M-Pesa callback will trigger the Stellar transaction
      // and a real-time listener (like a websocket or a `poll` from Horizon) would handle the update.
    } catch (err) {
      setMessage("❌ " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("wallet");
    router.push("/login");
  };

  const getUsername = () => {
    if (!wallet?.publicKey) return "User";
    // A simplified way to get a user identifier from the public key
    return wallet.publicKey.slice(0, 4) + "..." + wallet.publicKey.slice(-4);
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-4 md:p-10 font-sans">
      <Header
        username={getUsername()}
        onLogout={handleLogout}
        publicKey={wallet?.publicKey || ""}
      />
      <Balance
        balance={balance}
        isLoading={isLoading}
        onRefresh={() => wallet && fetchData(wallet.publicKey)}
      />
      <Actions
        onDepositClick={toggleDepositForm}
        onSendClick={toggleSendForm}
      />
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
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        onRefresh={() => wallet && fetchData(wallet.publicKey)}
      />
    </div>
  );
}
