import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send } from "lucide-react";

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

  return (
    <Card className="w-full max-w-4xl mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-6 w-6" /> Send Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert variant={message.includes("✅") ? "default" : "destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              value={recipient}
              onChange={(e) => onRecipientChange(e.target.value)}
              disabled={isSending}
            />
            {recipient && !isValidAddress && (
              <p className="text-sm text-destructive mt-1">
                Invalid address format. Must start with 'G' and be 56 characters
                long.
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="amount">Amount (XLM)</Label>
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
            />
            {amount && !isValidAmount && (
              <p className="text-sm text-destructive mt-1">
                {numAmount > balance
                  ? "Insufficient balance"
                  : "Amount must be greater than 0"}
              </p>
            )}
            <div className="flex space-x-2 mt-2">
              {[25, 50, 75, 100].map((percentage) => {
                const quickAmount = ((balance * percentage) / 100).toFixed(2);
                return (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => onAmountChange(quickAmount)}
                    disabled={balance <= 0 || isSending}
                  >
                    {percentage}%
                  </Button>
                );
              })}
            </div>
          </div>
          <Button
            type="submit"
            onClick={handleSend}
            disabled={
              isLoading || !isValidAddress || !isValidAmount || isSending
            }
            className="w-full"
          >
            {isSending ? "Sending..." : "Confirm Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default SendMoneyForm;
