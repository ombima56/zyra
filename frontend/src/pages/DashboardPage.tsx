"use client";
import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import Balance from "@/components/dashboard/Balance";
import Actions from "@/components/dashboard/Actions";
import SendMoneyForm from "@/components/dashboard/SendMoneyForm";
import DepositForm from "@/components/dashboard/DepositForm";
import TransactionList from "@/components/dashboard/TransactionList";
import Server from "@stellar/stellar-sdk";
import {
  Keypair,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
} from "@stellar/stellar-sdk";
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

const STELLAR_SERVER = new Server("https://horizon-testnet.stellar.org");
const STELLAR_NETWORK_PASSPHRASE = Networks.TESTNET;

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

  // Replaced useRouter with window.location for navigation in this environment
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
      const account = await STELLAR_SERVER.loadAccount(publicKey);
      const xlmBalance = account.balances.find(
        (balance: { asset_type: string; balance: string }) =>
          balance.asset_type === "native"
      );
      setBalance(
        xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : "0.00"
      );

      const txs = await STELLAR_SERVER.transactions()
        .forAccount(publicKey)
        .order("desc")
        .limit(10)
        .call();

      const formattedTxs: TransactionRecord[] = txs.records.map(
        (tx: { id: string; source_account: string }) => ({
          id: tx.id,
          source_account: tx.source_account,
          amount: "N/A",
          asset_code: "XLM",
        })
      );

      setTransactions(formattedTxs);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to load wallet data. Is the account funded?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMoney = async () => {
    setMessage("");
    setIsLoading(true);
    if (!wallet) {
      setMessage("Wallet not found");
      setIsLoading(false);
      return;
    }

    try {
      const sourceKeys = Keypair.fromSecret(wallet.secret);

      const transaction = new TransactionBuilder(
        await STELLAR_SERVER.loadAccount(sourceKeys.publicKey()),
        {
          fee: await STELLAR_SERVER.fetchBaseFee(),
          networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
        }
      )
        .addOperation(
          Operation.payment({
            destination: recipient,
            asset: Asset.native(),
            amount,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeys);

      const result = await STELLAR_SERVER.submitTransaction(transaction);
      console.log("Transaction successful:", result);

      setMessage("✅ Money sent successfully!");
      setRecipient("");
      setAmount("");
      if (wallet) fetchData(wallet.publicKey);
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
      <Header username={getUsername()} onLogout={handleLogout} />
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
