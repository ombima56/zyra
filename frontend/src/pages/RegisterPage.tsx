"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, password }),
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
            {showVerification ? "Verify your WhatsApp" : "Register for Zrya"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={message.includes("✅") ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {showVerification ? (
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
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          )}

          {!showVerification && (
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
