import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const NavigationSheet = () => {
  const { secretKey, setSecretKey } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setSecretKey(null);
    setIsOpen(false);
    router.push("/");
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <Logo />
        <NavMenu orientation="vertical" className="mt-12" onLinkClick={handleLinkClick} />

        <div className="mt-8">
          {secretKey ? (
            <div className="flex flex-col gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full sm:hidden">
                  Wallet
                </Button>
              </Link>
              <Button onClick={handleLogout} className="w-full xs:hidden">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link href="/login">
                <Button variant="outline" className="w-full sm:hidden">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full xs:hidden">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
