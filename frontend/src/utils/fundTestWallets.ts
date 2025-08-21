import { Keypair } from "@stellar/stellar-sdk";

/**
 * Creates multiple test wallets and funds them for testing transfers
 */
export async function createAndFundTestWallets(count: number = 3): Promise<
  Array<{
    publicKey: string;
    secretKey: string;
    funded: boolean;
  }>
> {
  const wallets = [];

  for (let i = 0; i < count; i++) {
    // Generate keypair
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secretKey = keypair.secret();

    console.log(`\n=== Test Wallet ${i + 1} ===`);
    console.log(`Public Key: ${publicKey}`);
    console.log(`Secret Key: ${secretKey}`);

    // Fund the wallet using Friendbot
    let funded = false;
    try {
      const response = await fetch(
        `https://friendbot.stellar.org/?addr=${publicKey}`
      );
      if (response.ok) {
        funded = true;
        console.log(`✅ Wallet ${i + 1} funded successfully`);
      } else {
        console.log(`❌ Failed to fund wallet ${i + 1}`);
      }
    } catch (error) {
      console.log(`❌ Error funding wallet ${i + 1}:`, error);
    }

    wallets.push({
      publicKey,
      secretKey,
      funded,
    });

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return wallets;
}

/**
 * Fund a specific wallet using Friendbot
 */
export async function fundWallet(publicKey: string): Promise<boolean> {
  try {
    console.log(`Funding wallet: ${publicKey}`);
    const response = await fetch(
      `https://friendbot.stellar.org/?addr=${publicKey}`
    );

    if (response.ok) {
      console.log(`✅ Wallet funded successfully`);
      return true;
    } else {
      console.log(`❌ Failed to fund wallet`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error funding wallet:`, error);
    return false;
  }
}

/**
 * Check balance of a wallet using Horizon API
 */
export async function checkWalletBalance(
  publicKey: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://horizon-testnet.stellar.org/accounts/${publicKey}`
    );

    if (response.ok) {
      const accountData = await response.json();
      const nativeBalance = accountData.balances.find(
        (b: any) => b.asset_type === "native"
      );
      return nativeBalance ? nativeBalance.balance : "0";
    } else {
      console.log("Account not found or not funded");
      return null;
    }
  } catch (error) {
    console.error("Error checking balance:", error);
    return null;
  }
}

// Example usage script
export async function runTestWalletSetup() {
  console.log("🚀 Setting up test wallets for transfer testing...\n");

  // Create and fund test wallets
  const testWallets = await createAndFundTestWallets(3);

  console.log("\n📋 Summary of Test Wallets:");
  console.log("================================");

  for (let i = 0; i < testWallets.length; i++) {
    const wallet = testWallets[i];
    console.log(`\nWallet ${i + 1}:`);
    console.log(`  Public Key: ${wallet.publicKey}`);
    console.log(`  Secret Key: ${wallet.secretKey}`);
    console.log(`  Funded: ${wallet.funded ? "✅" : "❌"}`);

    // Check actual balance
    if (wallet.funded) {
      const balance = await checkWalletBalance(wallet.publicKey);
      console.log(`  Balance: ${balance} XLM`);
    }
  }

  console.log("\n🎯 Next Steps:");
  console.log("1. Use these public keys as recipients in your transfer form");
  console.log("2. Test transfers between wallets");
  console.log("3. Verify balances change after transfers");

  return testWallets;
}

// If running this file directly
if (require.main === module) {
  runTestWalletSetup().catch(console.error);
}
