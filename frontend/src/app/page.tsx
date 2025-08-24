"use client";

import React, { useEffect, useState } from "react";
import WaitlistForm from "@/components/waitlist-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  CheckCircle2,
  DollarSign,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import Founders from "@/components/founders/Founders";

const LandingPage = () => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const timer = setInterval(() => {
      api.scrollNext();
    }, 2500); // Change slide every 2.5 seconds

    return () => {
      clearInterval(timer);
    };
  }, [api]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      {/* Hero Section */}
      <section className="relative w-full max-w-4xl text-center mt-20">
        <div className="relative">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">
            Send Money as Easily as a Text.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Zyra lets you connect, chat, and transact seamlessly on WhatsApp.
          </p>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            No complex wallets, no high fees. Just simple, social, and secure
            payments for everyone in Africa.
          </p>
          <div className="mt-8 flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* WhatsApp Example Section */}
      <section className="relative w-full max-w-5xl pt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
          How it Works
        </h2>
        <div className="hidden md:flex justify-center items-end gap-8">
          <Card className="w-64 h-[480px] rounded-[2.5rem] shadow-[0_-5px_10px_rgba(var(--accent-rgb),0.5)]">
            <CardHeader>
              <CardTitle className="text-center">Alice</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Alert className="bg-secondary">
                <AlertTitle>You</AlertTitle>
                <AlertDescription>Hey Bob! 👋</AlertDescription>
              </Alert>
              <Alert className="bg-secondary">
                <AlertTitle>You</AlertTitle>
                <AlertDescription>
                  Can you lend me 500 KES? I need to buy groceries 🛒
                </AlertDescription>
              </Alert>
              <Alert className="bg-accent text-primary-foreground">
                <AlertTitle>Bob</AlertTitle>
                <AlertDescription className="dark:text-secondary">
                  Of course! No problem. Just use Zyra.
                </AlertDescription>
              </Alert>
              <Alert className="bg-secondary">
                <AlertTitle>You</AlertTitle>
                <AlertDescription>
                  Thank you so much! You're the best! 🙏
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="w-72 h-[560px] rounded-[2.5rem] shadow-[0_-5px_10px_rgba(var(--accent-rgb),0.5)]">
            <CardHeader>
              <CardTitle className="text-center">Zyra</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Alert className="bg-accent text-primary-foreground">
                <AlertTitle>You</AlertTitle>
                <AlertDescription className="dark:text-secondary">
                  Send 500 KES to Alice
                </AlertDescription>
              </Alert>
              <Alert className="bg-secondary">
                <AlertTitle>Zyra</AlertTitle>
                <AlertDescription>
                  ✅ Processing payment...
                  <br />
                  Amount: 500 KES
                  <br />
                  To: Alice (+254712345678)
                </AlertDescription>
              </Alert>
              <Alert className="bg-secondary">
                <AlertTitle>Zyra</AlertTitle>
                <AlertDescription>
                  🎉 Payment Successful! You sent 500 KES to Alice.
                  <br />
                  Transaction ID: ZYR123456
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="w-64 h-[480px] rounded-[2.5rem] shadow-[0_-5px_10px_rgba(var(--accent-rgb),0.5)]">
            <CardHeader>
              <CardTitle className="text-center">Bob</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Alert className="bg-secondary">
                <AlertTitle>Alice</AlertTitle>
                <AlertDescription>
                  Can you lend me 500 KES? I need to buy groceries 🛒
                </AlertDescription>
              </Alert>
              <Alert className="bg-accent text-primary-foreground">
                <AlertTitle>You</AlertTitle>
                <AlertDescription className="dark:text-secondary">
                  Of course! Sending via Zyra now...
                </AlertDescription>
              </Alert>
              <Alert className="bg-accent text-primary-foreground">
                <AlertTitle>You</AlertTitle>
                <AlertDescription className="dark:text-secondary">
                  ✅ Sent! Check your M-Pesa.
                </AlertDescription>
              </Alert>
              <Alert className="bg-secondary">
                <AlertTitle>Alice</AlertTitle>
                <AlertDescription>
                  Wow! That was so fast! Zyra is amazing!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Carousel for mobile and smaller tablets */}
        <div className="md:hidden flex justify-center">
          <Carousel
            className="w-full max-w-xs"
            setApi={setApi}
            opts={{ loop: true }}
          >
            <CarouselContent>
              <CarouselItem>
                <Card className="w-full h-[480px] rounded-[2.5rem] shadow-[0_-5px_10px_rgba(var(--accent-rgb),0.5)]">
                  <CardHeader>
                    <CardTitle className="text-center">Alice</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <Alert className="bg-secondary">
                      <AlertTitle>You</AlertTitle>
                      <AlertDescription>Hey Bob! 👋</AlertDescription>
                    </Alert>
                    <Alert className="bg-secondary">
                      <AlertTitle>You</AlertTitle>
                      <AlertDescription>
                        Can you lend me 500 KES? I need to buy groceries 🛒
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-accent text-primary-foreground">
                      <AlertTitle>Bob</AlertTitle>
                      <AlertDescription className="dark:text-secondary">
                        Of course! No problem. Just use Zyra.
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-secondary">
                      <AlertTitle>You</AlertTitle>
                      <AlertDescription>
                        Thank you so much! You're the best! 🙏
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card className="w-full h-[560px] rounded-[2.5rem] shadow-[0_-5px_10px_rgba(var(--accent-rgb),0.5)]">
                  <CardHeader>
                    <CardTitle className="text-center">Zyra</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <Alert className="bg-accent text-primary-foreground">
                      <AlertTitle>You</AlertTitle>
                      <AlertDescription className="dark:text-secondary">
                        Send 500 KES to Alice
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-secondary">
                      <AlertTitle>Zyra</AlertTitle>
                      <AlertDescription>
                        ✅ Processing payment...
                        <br />
                        Amount: 500 KES
                        <br />
                        To: Alice (+254712345678)
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-secondary">
                      <AlertTitle>Zyra</AlertTitle>
                      <AlertDescription>
                        🎉 Payment Successful! You sent 500 KES to Alice.
                        <br />
                        Transaction ID: ZYR123456
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card className="w-full h-[480px] rounded-[2.5rem] shadow-[0_-5px_10px_rgba(var(--accent-rgb),0.5)]">
                  <CardHeader>
                    <CardTitle className="text-center">Bob</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <Alert className="bg-secondary">
                      <AlertTitle>Alice</AlertTitle>
                      <AlertDescription>
                        Can you lend me 500 KES? I need to buy groceries 🛒
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-accent text-primary-foreground">
                      <AlertTitle>You</AlertTitle>
                      <AlertDescription className="dark:text-secondary">
                        Of course! Sending via Zyra now...
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-accent text-primary-foreground">
                      <AlertTitle>You</AlertTitle>
                      <AlertDescription className="dark:text-secondary">
                        ✅ Sent! Check your M-Pesa.
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-secondary">
                      <AlertTitle>Alice</AlertTitle>
                      <AlertDescription>
                        Wow! That was so fast! Zyra is amazing!
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Features Section */}
      <section id="features" className="w-full max-w-5xl py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8 font-mochiy-pop-one">
          Seamless Finance, Right in Your Chat.
        </h2>
        <p className="text-lg text-muted-foreground mb-12">
          Zyra empowers you with intuitive, secure, and borderless financial
          interactions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 text-left">
            <MessageCircle className="h-8 w-8 text-accent mb-4" />
            <CardTitle className="text-xl font-semibold text-foreground mb-2">
              Chat-Based Transactions
            </CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              Send/receive money effortlessly via simple WhatsApp chat commands.
            </CardContent>
          </Card>
          <Card className="p-6 text-left">
            <ShieldCheck className="h-8 w-8 text-accent mb-4" />
            <CardTitle className="text-xl font-semibold text-foreground mb-2">
              Secure Wallet Connection
            </CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              Integrates with Lobstr Wallet, ensuring users maintain full
              custody of their assets.
            </CardContent>
          </Card>
          <Card className="p-6 text-left">
            <DollarSign className="h-8 w-8 text-accent mb-4" />
            <CardTitle className="text-xl font-semibold text-foreground mb-2">
              Fast, Low-Fee Payments
            </CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              Backed by Stellar’s decentralized network and Soroban smart
              contracts for efficiency.
            </CardContent>
          </Card>
          <Card className="p-6 text-left">
            <Users className="h-8 w-8 text-accent mb-4" />
            <CardTitle className="text-xl font-semibold text-foreground mb-2">
              Borderless & Inclusive
            </CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              Perfect for remittances, gig payments, and informal commerce
              across African borders.
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      {/* About Section */}
      < Founders />

      <Separator className="my-12" />

      {/* Q&A Section */}
      <section id="faq" className="w-full max-w-5xl py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-foreground mb-8 font-mochiy-pop-one">
          Your Questions, Answered.
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-foreground hover:no-underline">
              What is Zyra?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Zyra is a next-generation social-finance platform that enables
              seamless cross-border payments via WhatsApp, built on Stellar's
              blockchain.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-foreground hover:no-underline">
              How does Zyra leverage WhatsApp?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              WhatsApp's near-universal adoption in Kenya makes it an ideal
              platform for Zyra to bridge accessibility gaps, allowing users to
              transact using familiar chat commands.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-foreground hover:no-underline">
              What blockchain technology does Zyra use?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Zyra is built on Stellar's fast, low-cost blockchain, utilizing
              Soroban smart contracts for efficient and programmable payments.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-foreground hover:no-underline">
              Is Zyra secure?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, Zyra integrates with Lobstr Wallet, allowing users to
              maintain custody of their assets, ensuring secure and transparent
              transactions.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
};

export default LandingPage;
