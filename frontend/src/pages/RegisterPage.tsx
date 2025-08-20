"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { createKeypair, getKeypairFromMnemonic } from "@/lib/stellar";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [verified, setVerified] = useState(false);
  const [userMnemonic, setUserMnemonic] = useState("");

  const router = useRouter();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { mnemonic: newMnemonic } = createKeypair();
    setMnemonic(newMnemonic);
    setShowSeedPhrase(true);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userMnemonic.trim() !== mnemonic.trim()) {
      setMessage("Seed phrase does not match. Please try again.");
      return;
    }
    setVerified(true);
    setMessage("");

    setIsLoading(true);
    try {
      const keypair = getKeypairFromMnemonic(mnemonic);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          password,
          publicKey: keypair.publicKey(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setVerificationCode(data.whatsappVerificationCode);
      setShowVerification(true);
      setMessage("✅ Registration successful! Please verify your WhatsApp.");
    } catch (error: any) {
      console.error("Registration error:", error);
      setMessage(` ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {showSeedPhrase ? "Save Your Seed Phrase" : "Register for Zrya"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={message.includes("✅") ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {!showSeedPhrase ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4 mt-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Generating Keys..." : "Register"}
              </Button>
            </form>
          ) : !verified ? (
            <div>
              <p className="text-lg text-center text-muted-foreground">
                Please save this seed phrase in a secure location. You will need
                it to recover your account.
              </p>
              <div className="my-4 p-4 border rounded-lg bg-muted">
                <p className="text-lg font-mono text-center">{mnemonic}</p>
              </div>
              <form
                onSubmit={handleVerificationSubmit}
                className="space-y-4 mt-4"
              >
                <Input
                  type="text"
                  placeholder="Enter your seed phrase to verify"
                  value={userMnemonic}
                  onChange={(e) => setUserMnemonic(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Verify & Register
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center mt-4">
              <p className="text-lg">
                Send the following code to our WhatsApp number to verify your
                account:
              </p>
              <p className="text-2xl font-bold my-2">+1 555 141 3984</p>
              <p className="text-4xl font-bold my-4">{verificationCode}</p>
              <p className="text-muted-foreground">
                Once you have verified your account, you can{" "}
                <Link href="/login" className="text-accent hover:underline">
                  log in
                </Link>
                .
              </p>
            </div>
          )}

          {!showSeedPhrase && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Login here
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
