import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import Link from "next/link";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Logo />
        <NavMenu orientation="vertical" className="mt-12" />

        <div className="mt-8 space-y-4">
          <Link href="/login">
            <Button variant="outline" className="w-full sm:hidden">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="w-full xs:hidden">Register</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
