"use client";
import { useState, useEffect } from "react";
import Header from "@/components/dashboard/Header";
import Balance from "@/components/dashboard/Balance";
import Actions from "@/components/dashboard/Actions";
import SendMoneyForm from "@/components/dashboard/SendMoneyForm";
import DepositForm from "@/components/dashboard/DepositForm";
import TransactionList from "@/components/dashboard/TransactionList";
import {
  getNativeBalance,
  getTransactionHistory,
  StellarTransaction,
  getKeypairFromMnemonic,
  server,
} from "@/lib/stellar";
import { Card } from "@/components/ui/card";
import {
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Operation,
  Asset,
  Account,
} from "@stellar/stellar-sdk";

export default function DashboardPage() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [whatsappVerified, setWhatsappVerified] = useState(false);

  const [stellarTransactions, setStellarTransactions] = useState<
    StellarTransaction[]
  >([]);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [depositPhone, setDepositPhone] = useState("");
  const [userMnemonic, setUserMnemonic] = useState(""); // To store mnemonic for signing

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showSendForm, setShowSendForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch user session data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return;
        }
        const userData = await res.json();
        setPublicKey(userData.publicKey);
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

      await fetch("/api/user/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: pk, balance: balanceResult }),
      });

      try {
        const stellarTxHistory = await getTransactionHistory(pk);
        setStellarTransactions(stellarTxHistory);
        console.log("Fetched Stellar transactions:", stellarTxHistory);
      } catch (txError) {
        console.error("Error fetching Stellar transactions:", txError);
        setStellarTransactions([]);

        if (
          !(
            txError instanceof Error &&
            txError.message.includes("Account not found")
          )
        ) {
          setNotification({
            type: "error",
            text: "Failed to load transaction history. Balance loaded successfully.",
          });
        }
      }

      if (notification?.type === "error") {
        setNotification(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        type: "error",
        text: `❌ Failed to load account data. Please try again.`,
      });
      setBalance("0.00");
      setStellarTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMoney = async () => {
    if (!publicKey) {
      setNotification({
        type: "error",
        text: "Please log in to send money.",
      });
      return;
    }

    // Prompt for mnemonic for signing
    const mnemonic = prompt(
      "Please enter your seed phrase to confirm the transaction:"
    );
    if (!mnemonic) {
      setNotification({
        type: "error",
        text: "Seed phrase is required to sign the transaction.",
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
      const keypair = getKeypairFromMnemonic(mnemonic);
      const sourceAccount = await new Account(
        keypair.publicKey(),
        (await server.getAccount(keypair.publicKey())).sequenceNumber()
      );

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: recipient,
            asset: Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(30) // 30 seconds timeout
        .build();

      transaction.sign(keypair);

      const signedTransactionXDR = transaction.toXDR();

      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedTransactionXDR,
          recipient,
          amount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Transfer failed");
      }

      setNotification({
        type: "success",
        text: `✅ Successfully sent ${amount} XLM to ${recipient.slice(
          0,
          8
        )}...${recipient.slice(-8)}`,
      });

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
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 pt-28">
      <Header
        username={getUsername()}
        onLogout={handleLogout}
        publicKey={publicKey || ""}
      />
      <div className="w-full max-w-4xl">
        <Balance
          balance={balance}
          isLoading={isLoading}
          onRefresh={() => publicKey && fetchData(publicKey)}
        />
        <Actions
          onDepositClick={toggleDepositForm}
          onSendClick={toggleSendForm}
        />
        {!whatsappVerified && (
          <Card className="mb-6 p-4 text-center text-yellow-400 bg-yellow-500/10 border border-yellow-500/20">
            Please verify your WhatsApp account to enable all features.
          </Card>
        )}
        {notification && (
          <Card
            className={`mb-6 p-4 text-center ${
              notification.type === "success"
                ? "text-green-400 bg-green-500/10 border border-green-500/20"
                : "text-red-400 bg-red-500/10 border border-red-500/20"
            }`}
          >
            {notification.text}
          </Card>
        )}
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
            currentBalance={balance || "0"}
          />
        )}
        <TransactionList
          transactions={stellarTransactions}
          isLoading={isLoading}
          onRefresh={() => publicKey && fetchData(publicKey)}
          userAddress={publicKey || undefined}
        />
      </div>
    </main>
  );
}
