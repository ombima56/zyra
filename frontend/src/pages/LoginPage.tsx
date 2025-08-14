"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      const decryptRes = await fetch("/api/decrypt-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encryptedSecret: data.encryptedSecret,
          password,
        }),
      });

      if (!decryptRes.ok) {
        if (decryptRes.status === 400) {
          throw new Error(
            "Unable to securely log you in. Please verify your password."
          );
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      }

      const decryptData = await decryptRes.json();
      const decryptedSecret = decryptData.decryptedSecret;

      sessionStorage.setItem("publicKey", data.publicKey);
      sessionStorage.setItem("secretKey", decryptedSecret);

      setFormMessage({
        type: "success",
        text: "✅ Login successful! Redirecting...",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error);
      setFormMessage({ type: "error", text: `❌ ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Login to Zrya</h1>

        {formMessage && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm ${
              formMessage.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            <p>{formMessage.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
