import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  StellarTransaction,
  formatXLMAmount,
  truncateAddress,
} from "@/lib/stellar";
import {
  RefreshCw,
  ArrowDown,
  ArrowUp,
  History,
  ExternalLink,
} from "lucide-react";

type TransactionListProps = {
  transactions: StellarTransaction[];
  isLoading: boolean;
  onRefresh: () => void;
  userAddress?: string;
};

export function TransactionList({
  transactions,
  isLoading,
  onRefresh,
  userAddress,
}: TransactionListProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const BATCH_SIZE = 5;

  useEffect(() => {
    setVisibleCount(5);
  }, [transactions]);

  const getTransactionIcon = (type: StellarTransaction["type"]) => {
    switch (type) {
      case "SENT":
        return <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />;
      case "RECEIVED":
        return <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />;
      default:
        return (
          <History className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        );
    }
  };

  const getAmountColor = (type: StellarTransaction["type"]) => {
    switch (type) {
      case "SENT":
        return "text-destructive";
      case "RECEIVED":
        return "text-primary";
      default:
        return "text-foreground";
    }
  };

  const getAmountPrefix = (type: StellarTransaction["type"]) => {
    switch (type) {
      case "SENT":
        return "-";
      case "RECEIVED":
        return "+";
      default:
        return "";
    }
  };

  const getTransactionTitle = (tx: StellarTransaction) => {
    switch (tx.type) {
      case "SENT":
        return `Sent to ${truncateAddress(tx.to)}`;
      case "RECEIVED":
        return `Received from ${truncateAddress(tx.from)}`;
      default:
        return tx.operationType || "Transaction";
    }
  };

  const getTransactionTitleMobile = (tx: StellarTransaction) => {
    switch (tx.type) {
      case "SENT":
        return `To ${truncateAddress(tx.to, 4)}`;
      case "RECEIVED":
        return `From ${truncateAddress(tx.from, 4)}`;
      default:
        return tx.operationType || "Transaction";
    }
  };

  const getTransactionSubtitle = (tx: StellarTransaction) => {
    const date = new Date(tx.createdAt).toLocaleString();
    const status = tx.successful ? "Completed" : "Failed";
    return `${date} • ${status}`;
  };

  const getTransactionSubtitleMobile = (tx: StellarTransaction) => {
    const date = new Date(tx.createdAt).toLocaleDateString();
    const time = new Date(tx.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const status = tx.successful ? "✅" : "❌";
    return `${date} ${time} ${status}`;
  };

  const handleTransactionClick = (tx: StellarTransaction) => {
    const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${tx.hash}`;
    window.open(explorerUrl, "_blank");
  };

  const handleViewMore = () => {
    if (visibleCount >= transactions.length) {
      setVisibleCount(BATCH_SIZE);
    } else {
      setVisibleCount((prev) =>
        Math.min(prev + BATCH_SIZE, transactions.length)
      );
    }
  };

  const visibleTransactions = transactions.slice(0, visibleCount);
  const hasMore = transactions.length > BATCH_SIZE;
  const showingAll = visibleCount >= transactions.length;

  return (
    <Card className="w-full max-w-4xl mb-6 sm:mb-8">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <History className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden xs:inline">Transaction History</span>
            <span className="xs:hidden">History</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 w-8 sm:h-10 sm:w-10"
            title="Refresh transactions"
          >
            <RefreshCw
              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce"></div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Loading transactions...
            </p>
          </div>
        ) : transactions.length > 0 ? (
          <>
            {/* Desktop/Tablet Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right w-32">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleTransactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      onClick={() => handleTransactionClick(tx)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="p-3">
                        {getTransactionIcon(tx.type)}
                      </TableCell>
                      <TableCell className="p-3">
                        <div className="font-medium text-sm">
                          {getTransactionTitle(tx)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {getTransactionSubtitle(tx)}
                        </div>
                        {tx.memo && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Memo: {tx.memo}
                          </div>
                        )}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold p-3 ${getAmountColor(
                          tx.type
                        )}`}
                      >
                        <div className="text-sm">
                          {getAmountPrefix(tx.type)}
                          {formatXLMAmount(tx.amount)} {tx.asset}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
              {visibleTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => handleTransactionClick(tx)}
                  className="bg-muted/30 rounded-lg p-3 cursor-pointer active:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {getTransactionTitleMobile(tx)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getTransactionSubtitleMobile(tx)}
                        </div>
                        {tx.memo && (
                          <div className="text-xs text-muted-foreground truncate">
                            {tx.memo}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`text-right ${getAmountColor(tx.type)}`}>
                        <div className="text-sm font-bold">
                          {getAmountPrefix(tx.type)}
                          {formatXLMAmount(tx.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tx.asset}
                        </div>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <History className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm sm:text-base text-muted-foreground mb-1">
              No transactions yet
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your transaction history will appear here
            </p>
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-4 sm:mt-6">
            <Button
              variant="outline"
              onClick={handleViewMore}
              className="text-sm px-4 py-2"
            >
              {showingAll
                ? "Show Less"
                : `View More (${transactions.length - visibleCount} remaining)`}
            </Button>
          </div>
        )}

        {/* Mobile tip */}
        {transactions.length > 0 && (
          <div className="block sm:hidden mt-4">
            <p className="text-xs text-muted-foreground text-center">
              💡 Tap any transaction to view on Stellar Explorer
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionList;
