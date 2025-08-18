"use client";
import { useState, useEffect } from "react";
import Header from "@/components/dashboard/Header";
import Balance from "@/components/dashboard/Balance";
import Actions from "@/components/dashboard/Actions";
import SendMoneyForm from "@/components/dashboard/SendMoneyForm";
import DepositForm from "@/components/dashboard/DepositForm";
import TransactionList from "@/components/dashboard/TransactionList";
import { getNativeBalance, transferNative } from "@/lib/stellar";

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
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [depositPhone, setDepositPhone] = useState("");
  // Updated state to a more structured notification object
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showSendForm, setShowSendForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to automatically clear notifications after a duration
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000); // Notification will disappear after 5 seconds
      return () => clearTimeout(timer); // Cleanup function
    }
  }, [notification]);

  // Fetch user session data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          // If session is not found or unauthorized, redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return;
        }
        const userData = await res.json();
        setPublicKey(userData.publicKey);
        setSecretKey(userData.secret);
        setBalance(userData.balance.toString());
        setWhatsappVerified(userData.whatsappVerified);
        console.log("Public Key from API:", userData.publicKey);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (publicKey) {
      fetchData(publicKey);
    }
  }, [publicKey]);

  const fetchData = async (pk: string) => {
    setIsLoading(true);
    try {
      const balanceResult = await getNativeBalance(pk);
      setBalance(balanceResult);

      // Update balance in the database
      await fetch("/api/user/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: pk, balance: balanceResult }),
      });

      const res = await fetch(`/api/transactions?publicKey=${pk}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch transactions");
      }
      const transactionsData = await res.json();
      setTransactions(transactionsData);

      setNotification(null); // Clear notification on successful fetch
    } catch (error) {
      console.error("Error fetching data:", error);
      // Use the new notification state
      setNotification({
        type: "error",
        text: `❌ Failed to load data. Please try again.`,
      });
      setBalance("0.00");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMoney = async () => {
    if (!publicKey || !secretKey) {
      setNotification({
        type: "error",
        text: "Please log in to send money.",
      });
      return;
    }

    // Validate inputs
    if (!recipient || !amount) {
      setNotification({
        type: "error",
        text: "Please enter both recipient address and amount.",
      });
      return;
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setNotification({
        type: "error",
        text: "Please enter a valid amount greater than 0.",
      });
      return;
    }

    // Validate recipient address format
    if (!recipient.startsWith("G") || recipient.length !== 56) {
      setNotification({
        type: "error",
        text: "Invalid recipient address. Please check the format.",
      });
      return;
    }

    // Check if user has sufficient balance
    const currentBalance = parseFloat(balance || "0");
    if (numAmount > currentBalance) {
      setNotification({
        type: "error",
        text: "Insufficient balance for this transfer.",
      });
      return;
    }

    setNotification(null);
    setIsLoading(true);

    try {
      await transferNative(secretKey, recipient, amount);

      setNotification({
        type: "success",
        text: `✅ Successfully sent ${amount} to ${recipient.slice(
          0,
          8
        )}...${recipient.slice(-8)}`,
      });

      // Clear form and refresh data
      setRecipient("");
      setAmount("");
      setShowSendForm(false);
      await fetchData(publicKey);
    } catch (err) {
      console.error("Transfer error:", err);
      setNotification({
        type: "error",
        text: `❌ ${(err as Error).message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!publicKey) {
      setNotification({
        type: "error",
        text: "Please log in again.",
      });
      return;
    }
    setNotification(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          phone: depositPhone,
          userId: publicKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.details || data.error || "Failed to initiate STK Push"
        );
      }

      setNotification({
        type: "success",
        text: `✅ STK Push initiated for ${amount} KES. Check your phone to complete the transaction.`,
      });

      setDepositPhone("");
      setAmount("");
    } catch (err) {
      console.error("Deposit error:", err);
      setNotification({ type: "error", text: `❌ ${(err as Error).message}` });
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
    setNotification(null);
  };

  const toggleDepositForm = () => {
    setShowDepositForm(!showDepositForm);
    setShowSendForm(false);
    setNotification(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Redirect to login page regardless of API call success
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Header */}
      <Header
        username={getUsername()}
        onLogout={handleLogout} // Use the new handleLogout function
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

        {/* Global Notification */}
        {!whatsappVerified && (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div
              className={`p-4 rounded-xl text-center bg-yellow-500/10 border border-yellow-500/20 text-yellow-400`}
            >
              Please verify your WhatsApp account to enable all features.
            </div>
          </div>
        )}
        {notification && (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div
              className={`p-4 rounded-xl text-center ${
                notification.type === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {notification.text}
            </div>
          </div>
        )}

        {/* Forms */}
        {showDepositForm && (
          <DepositForm
            amount={amount}
            depositPhone={depositPhone}
            message={notification?.text || ""}
            onAmountChange={setAmount}
            onDepositPhoneChange={setDepositPhone}
            onDeposit={handleDeposit}
          />
        )}

        {showSendForm && (
          <SendMoneyForm
            recipient={recipient}
            amount={amount}
            message={notification?.text || ""}
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
