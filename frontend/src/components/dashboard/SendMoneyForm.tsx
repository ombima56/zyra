import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, QrCode } from "lucide-react";

type SendMoneyFormProps = {
  recipient: string;
  amount: string;
  message: string;
  onRecipientChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  currentBalance?: string;
};

export function SendMoneyForm({
  recipient,
  amount,
  message,
  onRecipientChange,
  onAmountChange,
  onSend,
  isLoading = false,
  currentBalance = "0",
}: SendMoneyFormProps) {
  const [isSending, setIsSending] = useState(false);

  const isValidAddress = recipient.startsWith("G") && recipient.length === 56;
  const numAmount = parseFloat(amount);
  const balance = parseFloat(currentBalance);
  const isValidAmount =
    !isNaN(numAmount) && numAmount > 0 && numAmount <= balance;

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend();
    } finally {
      setTimeout(() => setIsSending(false), 500);
    }
  };

  const formatBalance = (bal: string): string => {
    const num = parseFloat(bal);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const shortenAddress = (address: string, isMobile: boolean = false): string => {
    if (!address || address.length < 10) return address;
    const chars = isMobile ? 4 : 6;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  return (
    <Card className="w-full max-w-4xl mb-6 sm:mb-8">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Send className="h-5 w-5 sm:h-6 sm:w-6" /> 
          Send Money
        </CardTitle>
        {/* Balance display */}
        <div className="mt-2 sm:mt-3">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Available Balance: <span className="font-medium">{formatBalance(currentBalance)} XLM</span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {message && (
          <Alert 
            variant={message.includes("✅") ? "default" : "destructive"}
            className="mb-4"
          >
            <AlertDescription className="text-sm sm:text-base">
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="recipient" className="text-sm sm:text-base font-medium">
              Recipient Address
            </Label>
            <div className="relative">
              <Input
                id="recipient"
                type="text"
                placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={recipient}
                onChange={(e) => onRecipientChange(e.target.value)}
                disabled={isSending}
                className="h-10 sm:h-11 text-sm sm:text-base pr-10 sm:pr-12 font-mono"
              />
              {/* QR Code button for mobile - placeholder for future implementation */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 sm:h-9 sm:w-9 sm:right-1 sm:top-1"
                disabled={isSending}
                title="Scan QR Code (Coming Soon)"
              >
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            
            {recipient && !isValidAddress && (
              <p className="text-xs sm:text-sm text-destructive mt-1">
                Invalid address format. Must start with 'G' and be 56 characters long.
              </p>
            )}
            
            {/* Show shortened address on mobile for confirmation */}
            {recipient && isValidAddress && (
              <div className="block sm:hidden">
                <p className="text-xs text-muted-foreground mt-1">
                  Sending to: <span className="font-mono">{shortenAddress(recipient, true)}</span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="amount" className="text-sm sm:text-base font-medium">
              Amount (XLM)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              step="0.01"
              min="0.01"
              max={currentBalance}
              disabled={isSending}
              className="h-10 sm:h-11 text-base"
            />
            {amount && !isValidAmount && (
              <p className="text-xs sm:text-sm text-destructive mt-1">
                {numAmount > balance
                  ? "Insufficient balance"
                  : "Amount must be greater than 0"}
              </p>
            )}
            
            {/* Percentage buttons */}
            <div className="grid grid-cols-4 gap-2 sm:flex sm:space-x-2 sm:gap-0 mt-2 sm:mt-3">
              {[25, 50, 75, 100].map((percentage) => {
                const quickAmount = ((balance * percentage) / 100).toFixed(2);
                return (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => onAmountChange(quickAmount)}
                    disabled={balance <= 0 || isSending}
                    className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {percentage}%
                  </Button>
                );
              })}
            </div>
            
            {/* Amount preview */}
            {amount && isValidAmount && (
              <div className="bg-muted rounded-lg p-3 mt-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="block sm:inline">You're sending: </span>
                  <span className="font-medium text-foreground">{numAmount.toFixed(2)} XLM</span>
                  <span className="block sm:inline sm:ml-2">
                    Remaining balance: <span className="font-medium">{(balance - numAmount).toFixed(2)} XLM</span>
                  </span>
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            onClick={handleSend}
            disabled={
              isLoading || !isValidAddress || !isValidAmount || isSending
            }
            className="w-full h-11 sm:h-12 text-base font-medium"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : (
              "Confirm Send"
            )}
          </Button>
        </form>

        {/* Mobile-specific warning */}
        <div className="mt-4 sm:hidden">
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Double-check the recipient address!</strong> Stellar transactions cannot be reversed once confirmed.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SendMoneyForm;