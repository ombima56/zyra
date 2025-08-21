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

  const formatBalanceResponsive = (
    bal: string | null,
    isMobile: boolean = false
  ): string => {
    if (!bal) return "0.00";
    const num = parseFloat(bal);

    if (isMobile && num >= 1000000) {
      // For mobile, show abbreviated format for large numbers
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + "B";
      } else if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + "M";
      }
    }

    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: isMobile ? 2 : 2,
    });
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const getDisplayBalance = (isMobile: boolean = false) => {
    if (isBalanceHidden) {
      return isMobile ? "••••" : "••••••";
    }
    return `${formatBalanceResponsive(balance, isMobile)} XLM`;
  };

  return (
    <Card className="w-full max-w-4xl mb-6 sm:mb-8">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg sm:text-xl">Balance</CardTitle>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBalanceVisibility}
              className="h-8 w-8 sm:h-10 sm:w-10"
              title={isBalanceHidden ? "Show balance" : "Hide balance"}
            >
              {isBalanceHidden ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 sm:h-10 sm:w-10"
              title="Refresh balance"
            >
              <RefreshCw
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Display */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold hidden xs:block">
              {getDisplayBalance()}
            </div>
            {/* Mobile Display */}
            <div className="text-xl font-bold xs:hidden">
              {getDisplayBalance(true)}
            </div>

            {/* Additional info for context */}
            {!isLoading && !isBalanceHidden && balance && (
              <div className="mt-2 sm:mt-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Stellar Lumens • Last updated:{" "}
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default Balance;
