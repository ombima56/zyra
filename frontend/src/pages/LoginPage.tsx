"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { setSecretKey } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

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

      const data = await res.json();

      // Set the secret key in the context
      setSecretKey(data.secretKey);

      setFormMessage({
        type: "success",
        text: "✅ Login successful! Redirecting...",
      });

      router.push("/dashboard");
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