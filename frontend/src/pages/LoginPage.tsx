"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { getKeypairFromMnemonic } from "@/lib/stellar";
import CryptoJS from "crypto-js";

// Removed global sessionEncryptionKey variable

const generateAndStoreSessionKey = (): string => {
  const key = CryptoJS.lib.WordArray.random(256 / 8).toString();
  sessionStorage.setItem("sessionEncryptionKey", key); // Store key in sessionStorage
  return key;
};

const encryptSecretKey = (secret: string, key: string): string => {
  return CryptoJS.AES.encrypt(secret, key).toString();
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState(""); // State for mnemonic input
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  // Effect to manage the message's duration
  useEffect(() => {
    if (formMessage && formMessage.type === "error") {
      const timer = setTimeout(() => {
        setFormMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [formMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);
    setIsLoading(true);

    try {
      // Step 1: Authenticate with email and password
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Incorrect email or password. Please try again.");
        } else {
          throw new Error("Login failed. An unexpected server error occurred.");
        }
      }

      // Step 2: If email/password is correct, verify mnemonic and store encrypted secretKey client-side
      try {
        const keypair = getKeypairFromMnemonic(mnemonic);
        // In a real app, you'd compare keypair.publicKey() with the user's stored public key from the server
        // For now, we assume the mnemonic is correct if it generates a valid keypair.

        const secretKey = keypair.secret();
        const encryptionKey = generateAndStoreSessionKey(); // Generate and store key in sessionStorage
        const encryptedSecret = encryptSecretKey(secretKey, encryptionKey);

        sessionStorage.setItem("encryptedUserSecretKey", encryptedSecret);

        setFormMessage({
          type: "success",
          text: "✅ Login successful! Redirecting...",
        });

        router.push("/dashboard");
      } catch (mnemonicError) {
        console.error("Mnemonic verification error:", mnemonicError);
        throw new Error("Invalid seed phrase. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setFormMessage({ type: "error", text: `❌ ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Login to Zrya
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formMessage && (
            <Alert
              variant={formMessage.type === "error" ? "destructive" : "default"}
            >
              <AlertDescription>{formMessage.text}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Your 12-word seed phrase"
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-accent hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}