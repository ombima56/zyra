"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, Heart, Shield, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <section className="relative w-full max-w-4xl text-center mt-15">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground">
          About Zyra
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Bridging Africa's financial divide through the power of WhatsApp and
          blockchain technology
        </p>
      </section>

      <Separator className="my-12" />

      <section className="w-full max-w-5xl py-12">
        <div className="text-center mb-8">
          <Target className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
        </div>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
          To democratize financial access across Africa by transforming WhatsApp
          into a powerful payment platform. We're making cross-border
          transactions as simple, secure, and social as sending a message to a
          friend.
        </p>
      </section>

      <Separator className="my-12" />

      <section className="w-full max-w-5xl py-12">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl font-bold mb-4 text-destructive">
                The Problem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                <span className="font-semibold text-destructive">
                  8.37% average fees
                </span>{" "}
                for remittances in Sub-Saharan Africa - the world's most
                expensive
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-destructive">
                  $300+ billion
                </span>{" "}
                in cross-border payments needed across Africa in 2025
              </p>
              <p className="text-muted-foreground">
                Despite{" "}
                <span className="font-semibold text-destructive">
                  72% smartphone penetration
                </span>{" "}
                in Kenya, only{" "}
                <span className="font-semibold text-destructive">2.23%</span>{" "}
                use cryptocurrency
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl font-bold mb-4 text-primary">
                Our Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                <span className="font-semibold text-primary">
                  97% WhatsApp adoption
                </span>{" "}
                among Kenya's internet users - the perfect bridge
              </p>
              <p className="text-muted-foreground">
                Built on{" "}
                <span className="font-semibold text-primary">
                  Stellar blockchain
                </span>{" "}
                for fast, low-cost transactions
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-primary">
                  No new apps to download
                </span>{" "}
                - works within familiar WhatsApp interface
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      <section className="w-full max-w-5xl py-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
          Our Values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
            <p className="text-muted-foreground text-sm">
              Financial services should be available to everyone, everywhere,
              regardless of technical expertise or infrastructure.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Security</h3>
            <p className="text-muted-foreground text-sm">
              Blockchain-powered security meets user-friendly design, protecting
              every transaction without complexity.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community</h3>
            <p className="text-muted-foreground text-sm">
              Building stronger connections across borders, enabling families
              and businesses to thrive together.
            </p>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      <section className="w-full max-w-5xl py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-center">
              Meet the Founders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 text-center">
                <CardTitle className="text-xl font-semibold text-foreground mb-2">
                  Hilary Okello
                </CardTitle>
                <CardContent className="p-0 text-muted-foreground">
                  [Brief description of role/expertise]
                </CardContent>
              </Card>
              <Card className="p-6 text-center">
                <CardTitle className="text-xl font-semibold text-foreground mb-2">
                  Quinter Ochieng
                </CardTitle>
                <CardContent className="p-0 text-muted-foreground">
                  [Brief description of role/expertise]
                </CardContent>
              </Card>
              <Card className="p-6 text-center">
                <CardTitle className="text-xl font-semibold text-foreground mb-2">
                  Hillary Ombima
                </CardTitle>
                <CardContent className="p-0 text-muted-foreground">
                  [Brief description of role/expertise]
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}