import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

type ActionsProps = {
  onDepositClick: () => void;
  onSendClick: () => void;
};

export function Actions({ onDepositClick, onSendClick }: ActionsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={onDepositClick} size="lg">
          <ArrowDown className="mr-2 h-5 w-5" />
          Add Funds
        </Button>
        <Button onClick={onSendClick} size="lg">
          <ArrowUp className="mr-2 h-5 w-5" />
          Send Money
        </Button>
      </div>
    </div>
  );
}

export default Actions;
