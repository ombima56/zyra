"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { createKeypair, getKeypairFromMnemonic } from "@/lib/stellar";
import { Copy, Eye, EyeOff } from "lucide-react";
import CryptoJS from "crypto-js";
import SeedPhraseExplanation from "@/components/SeedPhraseExplanation";

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
  const [showMnemonicContent, setShowMnemonicContent] = useState(false);
  const [hasCopiedMnemonic, setHasCopiedMnemonic] = useState(false);

  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
  const [verificationInputs, setVerificationInputs] = useState<
    { value: string; disabled: boolean }[]
  >([]);

  const router = useRouter();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { mnemonic: newMnemonic } = createKeypair();
    setMnemonic(newMnemonic);
    setMnemonicWords(newMnemonic.split(" "));

    const words = newMnemonic.split(" ");
    const indicesToFill = new Set<number>();
    while (indicesToFill.size < 6) {
      indicesToFill.add(Math.floor(Math.random() * 12));
    }

    const initialInputs = words.map((word, index) => ({
      value: indicesToFill.has(index) ? word : "",
      disabled: indicesToFill.has(index),
    }));
    setVerificationInputs(initialInputs);

    setShowSeedPhrase(true);
  };

  const handleVerificationInputChange = (index: number, value: string) => {
    const newInputs = [...verificationInputs];
    newInputs[index].value = value;
    setVerificationInputs(newInputs);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredMnemonic = verificationInputs
      .map((input) => input.value)
      .join(" ");

    if (enteredMnemonic.trim() !== mnemonic.trim()) {
      setMessage("Seed phrase does not match. Please try again.");
      return;
    }
    setVerified(true);
    setMessage("");

    setIsLoading(true);
    try {
      const keypair = getKeypairFromMnemonic(mnemonic);
      const secretKey = keypair.secret();
      const encryptedSecretKey = CryptoJS.AES.encrypt(
        secretKey,
        password
      ).toString();

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          password,
          publicKey: keypair.publicKey(),
          encryptedSecretKey,
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

  const handleCopyAndProceed = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setMessage("✅ Recovery phrase copied to clipboard!");
      setHasCopiedMnemonic(true);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to copy recovery phrase:", err);
      setMessage("Failed to copy recovery phrase. Please copy manually.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 mt-20">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center leading-tight">
            {showSeedPhrase ? "Save Your Seed Phrase" : "Register for Zrya"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          {message && (
            <Alert
              variant={message.includes("✅") ? "default" : "destructive"}
              className="mb-4"
            >
              <AlertDescription className="text-sm leading-relaxed">
                {message}
              </AlertDescription>
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
                className="h-12 text-base"
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-12 text-base"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base"
              >
                {isLoading ? "Generating Keys..." : "Register"}
              </Button>
            </form>
          ) : !verified ? (
            <>
              {!hasCopiedMnemonic ? (
                <div className="space-y-4">
                  <SeedPhraseExplanation />
                  <p className="text-base sm:text-lg text-center text-muted-foreground">
                    Click on the eye icon to reveal your seed phrase and keep it
                    safe.
                  </p>
                  <div className="relative">
                    <div
                      className={`grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg bg-muted transition-all duration-300 ${
                        showMnemonicContent ? "filter-none" : "blur-sm"
                      }`}
                    >
                      {mnemonicWords.map((word, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 py-1"
                        >
                          <span className="text-muted-foreground text-sm w-6 text-right flex-shrink-0">
                            {index + 1}.
                          </span>
                          <span className="text-base sm:text-lg font-mono font-semibold text-foreground break-all">
                            {showMnemonicContent ? word : "*****"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setShowMnemonicContent(!showMnemonicContent)
                        }
                        aria-label={
                          showMnemonicContent
                            ? "Hide seed phrase"
                            : "Show seed phrase"
                        }
                        title={
                          showMnemonicContent
                            ? "Hide recovery phrase"
                            : "Show recovery phrase"
                        }
                        className="h-8 w-8 sm:h-10 sm:w-10"
                      >
                        {showMnemonicContent ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleCopyAndProceed}
                    className="w-full h-12 text-base"
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy and Proceed
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-base sm:text-lg text-center text-muted-foreground">
                    To verify, please fill in the missing words below:
                  </p>
                  <form
                    onSubmit={handleVerificationSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {verificationInputs.map((input, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm w-6 text-right flex-shrink-0">
                            {index + 1}.
                          </span>
                          <Input
                            type="text"
                            value={input.value}
                            onChange={(e) =>
                              handleVerificationInputChange(
                                index,
                                e.target.value
                              )
                            }
                            disabled={input.disabled}
                            className="font-mono h-10 sm:h-12 text-sm sm:text-base"
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <Button type="submit" className="w-full h-12 text-base">
                      Verify & Register
                    </Button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-base sm:text-lg">
                Send the following code to our WhatsApp number to verify your
                account:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold">+1 555 141 3984</p>
                <p className="text-2xl sm:text-4xl font-bold my-2 break-all">
                  {verificationCode}
                </p>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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
