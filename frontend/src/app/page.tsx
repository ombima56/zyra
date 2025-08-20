
import React from 'react';
import WaitlistForm from '@/components/waitlist-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, DollarSign, MessageCircle, ShieldCheck, Users } from 'lucide-react';

const LandingPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      {/* Hero Section */}
      <section className="relative w-full max-w-4xl text-center mt-20">
        <div className="relative">
          <h1 className="text-5xl font-bold text-foreground">
            Send Money as Easily as a Text.
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Zyra lets you connect, chat, and transact seamlessly on WhatsApp.
          </p>
          <p className="mt-4 text-xl text-muted-foreground">
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
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
          How it Works
        </h2>
        <div className="flex justify-center items-end gap-8">
          <Card className="w-64 h-[480px] rounded-[2.5rem] shadow-[0_-5px_10px_rgba(var(--accent-rgb),0.5)]">
            <CardHeader>
              <CardTitle className="text-center">Alice</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Alert className="bg-secondary">
                <AlertTitle>Alice</AlertTitle>
                <AlertDescription>
                  Hey, I need to send you 500 KES.
                </AlertDescription>
              </Alert>
              <Alert className="bg-accent text-primary-foreground">
                <AlertTitle>You</AlertTitle>
                <AlertDescription className='dark:text-secondary'>
                  No problem, just use Zyra. Send 500 KES to @alice.
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
                  Okay, sending now...
                </AlertDescription>
              </Alert>
              <Alert className="bg-secondary">
                <AlertTitle>Zyra</AlertTitle>
                <AlertDescription>
                  You sent 500 KES to Alice.
                </AlertDescription>
              </Alert>
               <Alert className="bg-secondary">
                <AlertTitle>Alice</AlertTitle>
                <AlertDescription>
                  Wow, that was fast! Received.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          <Card className="w-64 h-[480px] rounded-[2.5rem] shadow-[0_-5px_10px_rgba(var(--accent-rgb),0.5)]">
            <CardHeader>
              <CardTitle className="text-center">Bob</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Alert className="bg-accent text-primary-foreground">
                <AlertTitle>You</AlertTitle>
                <AlertDescription className='dark:text-secondary'>
                  Perfect! Zyra is amazing.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Features Section */}
      <section id="features" className="w-full max-w-5xl py-12 text-center">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8 font-mochiy-pop-one">
          Seamless Finance, Right in Your Chat.
        </h2>
        <p className="text-lg text-muted-foreground mb-12">
          Zyra empowers you with intuitive, secure, and borderless financial interactions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 text-left">
            <MessageCircle className="h-8 w-8 text-accent mb-4" />
            <CardTitle className="text-xl font-semibold text-foreground mb-2">Chat-Based Transactions</CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              Send/receive money effortlessly via simple WhatsApp chat commands.
            </CardContent>
          </Card>
          <Card className="p-6 text-left">
            <DollarSign className="h-8 w-8 text-accent mb-4" />
            <CardTitle className="text-xl font-semibold text-foreground mb-2">Fast, Low-Fee Payments</CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              Backed by Stellar’s decentralized network and Soroban smart contracts for efficiency.
            </CardContent>
          </Card>
          <Card className="p-6 text-left">
            <Users className="h-8 w-8 text-accent mb-4" />
            <CardTitle className="text-xl font-semibold text-foreground mb-2">Borderless & Inclusive</CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              Perfect for remittances, gig payments, and informal commerce across African borders.
            </CardContent>
          </Card>
          <Card className="p-6 text-left">
            <CheckCircle2 className="h-8 w-8 text-accent mb-4" />
            <CardTitle className="text-xl font-semibold text-foreground mb-2">Admin Dashboard</CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              Web UI (Next.js + Tailwind) for monitoring and managing financial flows.
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      {/* About Section */}
      <section id="about" className="w-full max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8 font-mochiy-pop-one">
          Connecting Africa Through Seamless Finance.
        </h2>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          Cross-border payments in Africa are often expensive and inaccessible. Zyra addresses this by leveraging WhatsApp's widespread adoption and Stellar's blockchain technology.
        </p>
        <p className="text-lg text-muted-foreground mb-12 text-center">
          We empower individuals and businesses to send money as easily as sending a message, fostering frictionless, borderless, and decentralized financial interactions.
        </p>

        <h3 className="text-3xl font-bold text-foreground mb-6 text-center">Meet the Founders</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center">
            <CardTitle className="text-xl font-semibold text-foreground mb-2">Hilary Okello</CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              [Brief description of role/expertise]
            </CardContent>
          </Card>
          <Card className="p-6 text-center">
            <CardTitle className="text-xl font-semibold text-foreground mb-2">Quinter Ochieng</CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              [Brief description of role/expertise]
            </CardContent>
          </Card>
          <Card className="p-6 text-center">
            <CardTitle className="text-xl font-semibold text-foreground mb-2">Hillary Ombima</CardTitle>
            <CardContent className="p-0 text-muted-foreground">
              [Brief description of role/expertise]
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Q&A Section */}
      <section id="faq" className="w-full max-w-5xl py-12">
        <h2 className="text-3xl font-semibold text-center text-foreground mb-8 font-mochiy-pop-one">
          Your Questions, Answered.
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-foreground hover:no-underline">What is Zyra?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Zyra is a next-generation social-finance platform that enables seamless cross-border payments via WhatsApp, built on Stellar's blockchain.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-foreground hover:no-underline">How does Zyra leverage WhatsApp?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              WhatsApp's near-universal adoption in Kenya makes it an ideal platform for Zyra to bridge accessibility gaps, allowing users to transact using familiar chat commands.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-foreground hover:no-underline">What blockchain technology does Zyra use?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Zyra is built on Stellar's fast, low-cost blockchain, utilizing Soroban smart contracts for efficient and programmable payments.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-foreground hover:no-underline">Is Zyra secure?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, Zyra integrates with Lobstr Wallet, allowing users to maintain custody of their assets, ensuring secure and transparent transactions.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
};

export default LandingPage;
