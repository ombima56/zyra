import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Copy, LogOut, Home, ChevronDown } from "lucide-react";
import Link from "next/link";

type HeaderProps = {
  username: string;
  onLogout: () => void;
  publicKey: string;
};

export default function Header({ username, onLogout, publicKey }: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatAddressResponsive = (
    address: string,
    isMobile: boolean = false
  ) => {
    if (isMobile) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <Card className="w-full max-w-4xl mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Zyra Wallet
          </CardTitle>
          <div className="flex items-center gap-2 sm:gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 h-8 sm:h-10"
                >
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarFallback className="text-xs sm:text-sm">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm hidden xs:inline">
                    {formatAddressResponsive(publicKey)}
                  </span>
                  <span className="text-xs xs:hidden">
                    {formatAddressResponsive(publicKey, true)}
                  </span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 sm:w-80 mr-2 sm:mr-0" align="end">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none text-sm sm:text-base">
                      {username}
                    </h4>
                    <div className="bg-muted rounded-md p-2 sm:p-3">
                      <p className="text-xs sm:text-sm text-muted-foreground font-mono break-all leading-relaxed">
                        {publicKey}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCopyAddress}
                      className="w-full text-sm"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? "Copied!" : "Copy Address"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={onLogout}
                      className="w-full text-sm"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect-Wallet
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
