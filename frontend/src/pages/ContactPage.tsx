"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <section className="relative w-full max-w-4xl text-center mt-20">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground">
          Let's Connect
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Ready to revolutionize cross-border payments in Africa? Join us in
          making financial transactions as simple as sending a WhatsApp message.
        </p>
      </section>

      <Separator className="my-12" />

      <section className="w-full max-w-5xl py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-accent" />
                <span className="text-2xl font-semibold">
                  Start a Conversation
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="text" placeholder="Your full name" />
              <Input type="email" placeholder="your@email.com" />
              <Textarea placeholder="Tell us about your cross-border payment needs..." />
              <Button className="w-full">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-accent" />
                  <span className="text-xl font-semibold">Partner with Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join our mission to transform African payments
                </p>
                <a
                  href="mailto:partnerships@zyra.com"
                  className="text-accent hover:underline"
                >
                  partnerships@zyra.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-accent" />
                  <span className="text-xl font-semibold">
                    WhatsApp Support
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get help where you're most comfortable
                </p>
                <a
                  href="https://wa.me/1234567890"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-accent" />
                  <span className="text-xl font-semibold">Meet in Person</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visit our Nairobi innovation hub
                </p>
                <p className="text-accent">Nairobi, Kenya</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
