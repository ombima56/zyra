import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const SeedPhraseExplanation: React.FC = () => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-bold text-center text-destructive flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          Recovery Phrase Security
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 pt-0">
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="font-semibold text-destructive mb-1">
              Critical Warning
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This is the ONLY way to recover your wallet. If lost, your funds
              are gone forever.
            </p>
          </div>

          <div className="space-y-2">
            <p className="leading-relaxed">
              • Write it down on paper and store securely
            </p>
            <p className="leading-relaxed">
              • Never share with anyone or store digitally
            </p>
            <p className="leading-relaxed">
              • <strong>Zyra</strong> will NEVER ask for your recovery phrase
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeedPhraseExplanation;
