import React from 'react';
import WaitlistForm from '@/components/waitlist-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LandingPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      {/* Hero Section */}
      <section className="relative w-full max-w-5xl text-center mt-20">
        <div className="relative">
          <h1 className="text-5xl font-bold text-forest-900">
            Send Money as Easily as a Text.
          </h1>
          <p className="mt-4 text-lg text-forest-700">
            Zyra lets you connect, chat, and transact seamlessly on WhatsApp. No
            complex wallets, no high fees. Just simple, social, and secure
            payments for everyone in Africa.
          </p>
          <div className="mt-8 flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* WhatsApp Example Section */}
      <section className="relative w-full max-w-5xl pt-12">
        <h2 className="text-3xl font-semibold text-center text-forest-900 mb-8">
          How it Works
        </h2>
        <div className="flex justify-center items-end gap-8">
          <Card className="w-64 h-[480px] rounded-[2.5rem]">
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
              <Alert className="bg-primary text-primary-foreground">
                <AlertTitle>You</AlertTitle>
                <AlertDescription>
                  No problem, just use Zyra. Send 500 KES to @alice.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          <Card className="w-72 h-[560px] rounded-[2.5rem]">
            <CardHeader>
              <CardTitle className="text-center">Zyra</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Alert className="bg-primary text-primary-foreground">
                <AlertTitle>You</AlertTitle>
                <AlertDescription>
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
          <Card className="w-64 h-[480px] rounded-[2.5rem]">
            <CardHeader>
              <CardTitle className="text-center">Bob</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Alert className="bg-primary text-primary-foreground">
                <AlertTitle>You</AlertTitle>
                <AlertDescription>
                  Perfect! Zyra is amazing.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
      </section>
    </main>
  );
};

export default LandingPage;