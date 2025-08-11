"use client";
import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import Balance from "@/components/dashboard/Balance";
import Actions from "@/components/dashboard/Actions";
import SendMoneyForm from "@/components/dashboard/SendMoneyForm";
import DepositForm from "@/components/dashboard/DepositForm";
import TransactionList from "@/components/dashboard/TransactionList";
import { connectWallet, getBalance, transfer, deposit } from "../lib/stellar";

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

  /**
   * Helper function to format the balance from a raw bigint to a
   * string with a fixed number of decimal places for display.
   */
  const formatBalance = (rawBalance: bigint, decimals: number): string => {
    if (rawBalance === BigInt(0)) {
      return "0.00";
    }

    // Convert the BigInt to a string
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
      // Note: getBalance no longer needs freighter parameter
      const balanceResult = (await getBalance(pk)) as bigint;

      // **Modified line:** Use the helper function to format the balance
      const formattedBalance = formatBalance(balanceResult, 7);
      setBalance(formattedBalance);

      // Mock transactions for now
      const mockTransactions: TransactionRecord[] = [
        {
          id: "mock-tx-1",
          source_account: "GDJ3Y...",
          amount: "50.00",
          asset_code: "XLM",
          from: "GDJ3Y...",
          to: pk,
        },
        {
          id: "mock-tx-2",
          source_account: pk,
          amount: "15.50",
          asset_code: "XLM",
          from: pk,
          to: "GB245...",
        },
      ];
      setTransactions(mockTransactions);
      setMessage(""); // Clear any previous error messages
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
      await fetchData(publicKey);
    } catch (err) {
      console.error("Transfer error:", err);
      setMessage("❌ " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!publicKey || !freighter) return;
    setMessage("");
    setIsLoading(true);
    try {
      await deposit(publicKey, amount, freighter);
      setMessage(
        `✅ Deposit request initiated for ${amount} tokens. Please approve the transaction in your wallet.`
      );
      setAmount("");
      await fetchData(publicKey);
    } catch (err) {
      console.error("Deposit error:", err);
      setMessage("❌ " + (err as Error).message);
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

  // Show error if Freighter failed to load
  if (freighterError) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Wallet Error</h1>
        <p className="text-red-400 mb-4 text-center max-w-md">
          {freighterError}
        </p>
        <p className="text-gray-400 text-sm text-center max-w-md">
          Please install the Freighter browser extension and make sure it
          supports Soroban smart contracts.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Zyra</h1>
        {message && (
          <p className="text-red-400 mb-4 text-center max-w-md">{message}</p>
        )}
        <button
          onClick={handleConnect}
          disabled={!freighter || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
        >
          {isLoading
            ? "Connecting..."
            : freighter
            ? "Connect Wallet"
            : "Loading Wallet..."}
        </button>
        {!freighter && (
          <p className="text-gray-400 text-sm mt-2">
            Loading Freighter wallet...
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-4 md:p-10 font-sans">
      <Header
        username={getUsername()}
        onLogout={() => setPublicKey(null)}
        publicKey={publicKey || ""}
      />
      <Balance
        balance={balance}
        isLoading={isLoading}
        onRefresh={() => publicKey && fetchData(publicKey)}
      />
      <Actions
        onDepositClick={toggleDepositForm}
        onSendClick={toggleSendForm}
      />
      {message && (
        <div className="w-full max-w-md mb-4 p-3 rounded bg-gray-800">
          <p className="text-sm">{message}</p>
        </div>
      )}
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
        onRefresh={() => publicKey && fetchData(publicKey)}
      />
    </div>
  );
}
