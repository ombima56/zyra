import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusCircle } from "lucide-react";

type DepositFormProps = {
  amount: string;
  depositPhone: string;
  message: string;
  onAmountChange: (value: string) => void;
  onDepositPhoneChange: (value: string) => void;
  onDeposit: () => void;
  isLoading?: boolean;
};

export function DepositForm({
  amount,
  depositPhone,
  message,
  onAmountChange,
  onDepositPhoneChange,
  onDeposit,
  isLoading = false,
}: DepositFormProps) {
  const [isDepositing, setIsDepositing] = useState(false);

  const numAmount = parseFloat(amount);
  const isValidAmount = !isNaN(numAmount) && numAmount > 0;

  const phoneRegex = /^(\+254|254|0)?[17]\d{8}$/;
  const cleanPhone = depositPhone.replace(/\s+/g, "");
  const isValidPhone = phoneRegex.test(cleanPhone);

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      await onDeposit();
    } finally {
      setTimeout(() => setIsDepositing(false), 500);
    }
  };

  return (
    <Card className="w-full max-w-4xl mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-6 w-6" /> Add Funds
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
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              step="0.01"
              min="0.01"
              disabled={isDepositing}
            />
            {amount && !isValidAmount && (
              <p className="text-sm text-destructive mt-1">
                Amount must be greater than 0
              </p>
            )}
            <div className="flex space-x-2 mt-2">
              {[10, 25, 50, 100].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => onAmountChange(quickAmount.toString())}
                  disabled={isDepositing}
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="phone">M-Pesa Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+254712345678"
              value={depositPhone}
              onChange={(e) => onDepositPhoneChange(e.target.value)}
              disabled={isDepositing}
            />
            {depositPhone && !isValidPhone && (
              <p className="text-sm text-destructive mt-1">
                Invalid phone number format. Use +254XXXXXXXXX or 0XXXXXXXXX
              </p>
            )}
          </div>
          <Button
            type="submit"
            onClick={handleDeposit}
            disabled={
              isLoading || !isValidAmount || !isValidPhone || isDepositing
            }
            className="w-full"
          >
            {isDepositing ? "Initiating Deposit..." : "Confirm Deposit"}
          </Button>
        </form>
        {isDepositing && (
          <Alert className="mt-4">
            <AlertTitle>M-Pesa STK Push Sent!</AlertTitle>
            <AlertDescription>
              Check your phone for the M-Pesa prompt and enter your PIN to
              complete the transaction.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default DepositForm;
