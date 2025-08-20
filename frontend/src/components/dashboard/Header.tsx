import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Copy, LogOut, Home } from "lucide-react";
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

  return (
    <Card className="w-full max-w-4xl mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Zrya Wallet</CardTitle>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{formatAddress(publicKey)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">{username}</h4>
                    <p className="text-sm text-muted-foreground">{publicKey}</p>
                  </div>
                  <div className="grid gap-2">
                    <Button variant="outline" onClick={handleCopyAddress}>
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? "Copied!" : "Copy Address"}
                    </Button>
                    <Button variant="destructive" onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
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
