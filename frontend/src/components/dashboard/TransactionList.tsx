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
import { RefreshCw, ArrowDown, ArrowUp, History } from "lucide-react";

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
        return <ArrowUp className="h-4 w-4 text-destructive" />;
      case "RECEIVED":
        return <ArrowDown className="h-4 w-4 text-primary" />;
      default:
        return <History className="h-4 w-4 text-muted-foreground" />;
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

  const getTransactionSubtitle = (tx: StellarTransaction) => {
    const date = new Date(tx.createdAt).toLocaleString();
    const status = tx.successful ? "Completed" : "Failed";
    return `${date} • ${status}`;
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
    <Card className="w-full max-w-4xl mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <History className="h-6 w-6" /> Transaction History
          </CardTitle>
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading transactions...
          </div>
        ) : transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleTransactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  onClick={() => handleTransactionClick(tx)}
                  className="cursor-pointer"
                >
                  <TableCell>{getTransactionIcon(tx.type)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{getTransactionTitle(tx)}</div>
                    <div className="text-sm text-muted-foreground">
                      {getTransactionSubtitle(tx)}
                    </div>
                    {tx.memo && (
                      <div className="text-xs text-muted-foreground">
                        Memo: {tx.memo}
                      </div>
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${getAmountColor(
                      tx.type
                    )}`}
                  >
                    {getAmountPrefix(tx.type)}
                    {formatXLMAmount(tx.amount)} {tx.asset}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet.
          </div>
        )}
        {hasMore && (
          <div className="text-center mt-4">
            <Button variant="outline" onClick={handleViewMore}>
              {showingAll
                ? "Show Less"
                : `View More (${transactions.length - visibleCount} more)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionList;
