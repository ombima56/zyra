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
    <Card className="w-full max-w-4xl mb-6 sm:mb-8">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          Add Funds
        </CardTitle>
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

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 sm:space-y-6"
        >
          <div className="space-y-2 sm:space-y-3">
            <Label
              htmlFor="amount"
              className="text-sm sm:text-base font-medium"
            >
              Amount (USD)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              step="0.01"
              min="0.01"
              disabled={isDepositing}
              className="h-10 sm:h-11 text-base"
            />
            {amount && !isValidAmount && (
              <p className="text-xs sm:text-sm text-destructive mt-1">
                Amount must be greater than 0
              </p>
            )}

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 sm:flex sm:space-x-2 sm:gap-0 mt-2 sm:mt-3">
              {[10, 25, 50, 100].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => onAmountChange(quickAmount.toString())}
                  disabled={isDepositing}
                  className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="phone" className="text-sm sm:text-base font-medium">
              M-Pesa Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+254712345678"
              value={depositPhone}
              onChange={(e) => onDepositPhoneChange(e.target.value)}
              disabled={isDepositing}
              className="h-10 sm:h-11 text-base"
            />
            {depositPhone && !isValidPhone && (
              <p className="text-xs sm:text-sm text-destructive mt-1">
                Invalid phone number format. Use +254XXXXXXXXX or 0XXXXXXXXX
              </p>
            )}

            {/* Phone format hints for mobile */}
            <div className="block sm:hidden">
              <p className="text-xs text-muted-foreground mt-1">
                Format: +254XXXXXXXXX, 254XXXXXXXXX, or 0XXXXXXXXX
              </p>
            </div>
          </div>

          <Button
            type="submit"
            onClick={handleDeposit}
            disabled={
              isLoading || !isValidAmount || !isValidPhone || isDepositing
            }
            className="w-full h-11 sm:h-12 text-base font-medium"
          >
            {isDepositing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Initiating Deposit...
              </span>
            ) : (
              "Confirm Deposit"
            )}
          </Button>
        </form>

        {isDepositing && (
          <Alert className="mt-4 sm:mt-6">
            <AlertTitle className="text-sm sm:text-base">
              M-Pesa STK Push Sent!
            </AlertTitle>
            <AlertDescription className="text-xs sm:text-sm mt-1">
              Check your phone for the M-Pesa prompt and enter your PIN to
              complete the transaction.
            </AlertDescription>
          </Alert>
        )}

        {/* Additional help text for mobile */}
        <div className="mt-4 sm:hidden">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Make sure you have enough M-Pesa balance
              and your phone is nearby to receive the STK push notification.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DepositForm;
