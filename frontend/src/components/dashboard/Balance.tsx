import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

type BalanceProps = {
  balance: string | null;
  isLoading: boolean;
  onRefresh: () => void;
};

export function Balance({ balance, isLoading, onRefresh }: BalanceProps) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const formatBalance = (bal: string | null): string => {
    if (!bal) return "0.00";
    const num = parseFloat(bal);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const displayBalance = isBalanceHidden
    ? "••••••"
    : `${formatBalance(balance)} XLM`;

  return (
    <Card className="w-full max-w-4xl mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Balance</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBalanceVisibility}
            >
              {isBalanceHidden ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            </div>
          ) : (
            displayBalance
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Balance;
