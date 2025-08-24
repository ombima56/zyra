"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  LogIn,
  UserPlus,
  Menu,
  Zap,
  User,
  Mail,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

// Custom hook for responsive breakpoints
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    ...screenSize,
    isXs: screenSize.width < 480 && screenSize.width !== 0,
    isSm: screenSize.width >= 480 && screenSize.width < 768,
    isMd: screenSize.width >= 768 && screenSize.width < 1024,
    isLg: screenSize.width >= 1024,
    isMobile: screenSize.width < 768 && screenSize.width !== 0,
    isTablet: screenSize.width >= 768 && screenSize.width < 1024,
    isDesktop: screenSize.width >= 1024,
  };
};

export const MobileSidebar = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const { secretKey, setSecretKey } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const responsive = useResponsive();

  // Close sidebar when screen becomes desktop size
  useEffect(() => {
    if (responsive.isDesktop && isOpen) {
      setIsOpen(false);
    }
  }, [responsive.isDesktop, isOpen]);

  const handleLogout = () => {
    setSecretKey(null);
    setIsOpen(false);
    router.push("/");
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "features", label: "Features", icon: Zap, href: "/#features" },
    { id: "about", label: "About", icon: User, href: "/about" },
    { id: "contact", label: "Contact", icon: Mail, href: "/contact" },
  ];

  // Check if a menu item is active
  const isMenuItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.includes("#")) {
      const basePath = href.split("#")[0];
      return pathname === basePath;
    }
    return pathname === href;
  };

  // Check if auth item is active
  const isAuthItemActive = (href: string) => {
    return pathname === href;
  };

  // Dynamic sidebar width based on screen size
  const getSidebarWidth = () => {
    if (responsive.isXs) return "w-[280px]";
    if (responsive.isSm) return "w-[260px]";
    return "w-[240px]";
  };

  // Dynamic button sizes based on screen
  const getButtonSize = () => {
    if (responsive.isXs) return "py-4";
    return "py-3";
  };

  const getIconSize = () => {
    if (responsive.isXs) return "w-6 h-6";
    return "w-5 h-5";
  };

  // Enhanced button classes with yellow hover/active states
  const getButtonClasses = (isActive: boolean = false) => {
    const baseClasses = `w-full flex items-center justify-start space-x-3 px-3 ${getButtonSize()} rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-95 mb-2`;

    if (isActive) {
      return `${baseClasses} bg-yellow-400/20 text-yellow-600 border border-yellow-400/30 shadow-sm hover:bg-yellow-400/30 hover:text-yellow-700 hover:border-yellow-400/50 hover:shadow-md`;
    }

    return `${baseClasses} text-sidebar-foreground/70 hover:text-yellow-600 hover:bg-yellow-400/10 hover:border hover:border-yellow-400/20 hover:shadow-sm`;
  };

  // Don't render on desktop (handled by main navbar)
  if (!hasMounted || responsive.isDesktop) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size={responsive.isXs ? "default" : "icon"}
          className={`rounded-full transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-yellow-400/10 hover:border-yellow-400/30 hover:text-yellow-600 ${
            responsive.isXs ? "px-3" : ""
          }`}
        >
          <Menu className={responsive.isXs ? "w-5 h-5" : "w-4 h-4"} />
          {responsive.isXs && <span className="ml-2 text-sm">Menu</span>}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className={`${getSidebarWidth()} bg-background/80 backdrop-blur-sm shadow-2xl p-0 border-l border-sidebar-border text-sidebar-foreground overflow-y-auto`}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center justify-between ${
              responsive.isXs ? "p-6" : "p-4"
            } border-b border-sidebar-border hover:bg-sidebar-accent/5 transition-colors duration-200`}
          >
            <div className="flex items-center space-x-3">
              <div>
                <h1
                  className={`${
                    responsive.isXs ? "text-2xl" : "text-xl"
                  } font-semibold text-lg`}
                >
                  Zyra
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${responsive.isXs ? "p-6" : "p-4"}`}>
            <div className={`space-y-${responsive.isXs ? "3" : "2"}`}>
              {menuItems.map((item) => {
                const isActive = isMenuItemActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={handleLinkClick}
                  >
                    <Button
                      variant="ghost"
                      className={getButtonClasses(isActive)}
                    >
                      <item.icon
                        className={`${getIconSize()} ${
                          isActive ? "drop-shadow-sm" : ""
                        }`}
                      />
                      <span
                        className={`${
                          responsive.isXs ? "text-base" : "text-sm"
                        } ${isActive ? "font-semibold" : "font-medium"}`}
                      >
                        {item.label}
                      </span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div
              className={`${
                responsive.isXs ? "my-8" : "my-6"
              } border-t border-sidebar-border relative`}
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>
            </div>

            {/* Auth Section - Wallet, Logout */}
            <div className={`space-y-1`}>
              {secretKey ? (
                <>
                  <div className="mb-2">
                    <Link href="/dashboard" onClick={handleLinkClick}>
                      <Button
                        variant="ghost"
                        className={getButtonClasses(
                          isAuthItemActive("/dashboard")
                        )}
                      >
                        <Wallet
                          className={`${getIconSize()} ${
                            isAuthItemActive("/dashboard")
                              ? "drop-shadow-sm"
                              : ""
                          }`}
                        />
                        <span
                          className={`${
                            responsive.isXs ? "text-base" : "text-sm"
                          } ${
                            isAuthItemActive("/dashboard")
                              ? "font-semibold"
                              : "font-medium"
                          }`}
                        >
                          Wallet
                        </span>
                      </Button>
                    </Link>
                  </div>
                  <div className="mb-2">
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className={`w-full flex items-center justify-start space-x-3 px-3 ${getButtonSize()} rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-sidebar-foreground/70 hover:text-red-600 hover:bg-red-400/10 hover:border hover:border-red-400/20 hover:shadow-sm mb-2`}
                    >
                      <LogIn className={getIconSize()} />
                      <span
                        className={`${
                          responsive.isXs ? "text-base" : "text-sm"
                        }`}
                      >
                        Logout
                      </span>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2">
                    <Link href="/login" onClick={handleLinkClick}>
                      <Button
                        variant="ghost"
                        className={getButtonClasses(isAuthItemActive("/login"))}
                      >
                        <LogIn
                          className={`${getIconSize()} ${
                            isAuthItemActive("/login") ? "drop-shadow-sm" : ""
                          }`}
                        />
                        <span
                          className={`${
                            responsive.isXs ? "text-base" : "text-sm"
                          } ${
                            isAuthItemActive("/login")
                              ? "font-semibold"
                              : "font-medium"
                          }`}
                        >
                          Login
                        </span>
                      </Button>
                    </Link>
                  </div>
                  <div className="mb-2">
                    <Link href="/register" onClick={handleLinkClick}>
                      <Button
                        variant="ghost"
                        className={getButtonClasses(
                          isAuthItemActive("/register")
                        )}
                      >
                        <UserPlus
                          className={`${getIconSize()} ${
                            isAuthItemActive("/register")
                              ? "drop-shadow-sm"
                              : ""
                          }`}
                        />
                        <span
                          className={`${
                            responsive.isXs ? "text-base" : "text-sm"
                          } ${
                            isAuthItemActive("/register")
                              ? "font-semibold"
                              : "font-medium"
                          }`}
                        >
                          Register
                        </span>
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};
