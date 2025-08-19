import React, { useState, useEffect } from "react";
import { Eye, EyeOff, RefreshCw, TrendingUp, Wallet } from "lucide-react";

type BalanceProps = {
  balance: string | null;
  isLoading: boolean;
  onRefresh: () => void;
};

export function Balance({ balance, isLoading, onRefresh }: BalanceProps) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [xlmPrice, setXlmPrice] = useState<number | null>(null);
  const [usdBalance, setUsdBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchXlmPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch price");
        }
        const data = await response.json();
        const price = data.stellar.usd;
        setXlmPrice(price);
      } catch (error) {
        console.error("Error fetching XLM price:", error);
        setXlmPrice(null);
      }
    };

    fetchXlmPrice();
  }, []);

  useEffect(() => {
    if (balance && xlmPrice !== null) {
      const xlmValue = parseFloat(balance);
      const calculatedUsd = xlmValue * xlmPrice;
      setUsdBalance(calculatedUsd);
    } else {
      setUsdBalance(null);
    }
  }, [balance, xlmPrice]);

  const formatBalance = (bal: string | null): string => {
    if (!bal) return "0.00";
    const num = parseFloat(bal);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatUSD = (amount: number | null): string => {
    if (amount === null) return "0.00";
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getBalanceColor = (bal: string | null): string => {
    if (!bal) return "text-gray-400";
    const num = parseFloat(bal);
    if (num >= 1000) return "text-emerald-400";
    if (num >= 100) return "text-green-400";
    if (num >= 10) return "text-blue-400";
    return "text-yellow-400";
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const displayBalance = isBalanceHidden
    ? "••••••"
    : `$${formatUSD(usdBalance)}`;
  const balanceValue = parseFloat(balance || "0");

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      {/* Main Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-emerald-600/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative p-8 sm:p-10 lg:p-12">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl shadow-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Total Balance
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  <span className="text-sm text-emerald-400 font-medium">
                    Live
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleBalanceVisibility}
                className="text-slate-400 hover:text-white transition-all duration-200 p-3 rounded-xl hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label={isBalanceHidden ? "Show balance" : "Hide balance"}
              >
                {isBalanceHidden ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={onRefresh}
                className="text-slate-400 hover:text-white transition-all duration-200 p-3 rounded-xl hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                disabled={isLoading}
                aria-label="Refresh balance"
              >
                <RefreshCw
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Main Balance Display */}
          <div className="text-center mb-8">
            <div className="mb-4">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
              ) : (
                <h1
                  className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold ${getBalanceColor(
                    balance
                  )} leading-none tracking-tight`}
                >
                  {displayBalance}
                </h1>
              )}
            </div>
            <div className="flex items-center justify-center space-x-4 text-slate-400">
              <span className="text-lg font-medium">USD</span>
              {!isLoading && balance && !isBalanceHidden && (
                <>
                  <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">
                      Available
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Balance Status Bar */}
          {!isLoading && balance && !isBalanceHidden && (
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/30">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center">
                    <img
                      src="/assets/Stellar-Icons.svg"
                      alt="Stellar Icon"
                      className="w-5 h-5"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">Stellar Lumens</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-bold text-lg ${getBalanceColor(balance)}`}>
                  {formatBalance(balance)} XLM
                </p>
                <p className="text-slate-400 text-sm">
                  {usdBalance !== null
                    ? `$${formatUSD(usdBalance)}`
                    : "Fetching price..."}
                </p>
              </div>
            </div>
          )}

          {/* Low Balance Warning */}
          {!isLoading &&
            balance &&
            parseFloat(balance) < 1 &&
            !isBalanceHidden && (
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-amber-400 text-lg">⚠️</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-amber-400 font-medium">Low Balance</p>
                    <p className="text-amber-300/80 text-sm">
                      Consider adding funds to your wallet
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Balance;
