import {
  Address,
  xdr,
  scValToNative,
  Keypair,
  TransactionBuilder,
  Networks,
  Account,
  BASE_FEE,
  TimeoutInfinite,
  Operation,
  rpc,
  Transaction,
  Asset,
} from "@stellar/stellar-sdk";

interface StellarBalance {
  asset_type: string;
  balance: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
  asset_code?: string;
  asset_issuer?: string;
}

// Stellar tokens typically use 7 decimal places
const STELLAR_DECIMALS = 7;
const DECIMAL_MULTIPLIER = BigInt(10 ** STELLAR_DECIMALS);

// The contract ID is essential for all contract interactions.
const contractId = process.env.NEXT_PUBLIC_PAYMENTS_CONTRACT_ID!;

// Configure the Soroban RPC server
const rpcUrl =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
  "https://soroban-testnet.stellar.org";
const networkPassphrase =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK || Networks.TESTNET;

const server = new rpc.Server(rpcUrl);

/**
 * Converts a JavaScript BigInt into a Stellar XDR i128 ScVal.
 */
function bigIntToI128ScVal(value: bigint): xdr.ScVal {
  const hi = new xdr.Int64(value >> BigInt(64));
  const lo = new xdr.Int64(value & ((BigInt(1) << BigInt(64)) - BigInt(1)));
  return xdr.ScVal.scvI128(new xdr.Int128Parts({ hi, lo }));
}

/**
 * Converts decimal amount to stroops (contract units)
 * Example: 1.5 -> 15000000 (1.5 * 10^7)
 */
export const decimalToStroops = (decimalAmount: string): bigint => {
  const decimal = parseFloat(decimalAmount);
  if (isNaN(decimal)) {
    throw new Error("Invalid decimal amount");
  }
  return BigInt(Math.round(decimal * Number(DECIMAL_MULTIPLIER)));
};

/**
 * Converts stroops (contract units) to decimal amount
 * Example: 15000000 -> "1.5000000"
 */
export const stroopsToDecimal = (stroops: bigint): string => {
  const decimal = Number(stroops) / Number(DECIMAL_MULTIPLIER);
  return decimal.toFixed(7); // Always show 7 decimal places
};

/**
 * Formats balance for display (removes trailing zeros)
 * Example: "1.5000000" -> "1.50"
 */
export const formatBalance = (balance: string): string => {
  const num = parseFloat(balance);
  if (num === 0) return "0.00";

  // Remove trailing zeros but keep at least 2 decimal places
  return num
    .toFixed(7)
    .replace(/\.?0+$/, "")
    .padEnd(4, "0");
};

/**
 * Creates a new Stellar keypair.
 */
export const createKeypair = (): { publicKey: string; secret: string } => {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secret: keypair.secret(),
  };
};

/**
 * Gets the balance of a user from the Soroban smart contract.
 * Returns the balance as a formatted decimal string (e.g., "0.00", "1.50")
 */
export const getBalance = async (userAddress: string): Promise<string> => {
  try {
    if (!contractId) {
      throw new Error(
        "Contract ID is not configured. Please set NEXT_PUBLIC_PAYMENTS_CONTRACT_ID environment variable."
      );
    }

    console.log("Getting balance for:", userAddress);
    console.log("Contract ID:", contractId);

    // Create Address objects properly
    const userAddressObj = Address.fromString(userAddress);
    const contractAddress = Address.fromString(contractId);

    const operation = Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: contractAddress.toScAddress(),
          functionName: "balance",
          args: [userAddressObj.toScVal()],
        })
      ),
      auth: [],
    });

    // Create a transaction builder with a dummy source account
    const dummyKeypair = Keypair.random();
    const dummyAccount = new Account(dummyKeypair.publicKey(), "0");

    const transaction = new TransactionBuilder(dummyAccount, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    // Simulate the transaction to get the result
    console.log("Simulating balance query...");
    const simulationResponse = await server.simulateTransaction(transaction);

    if (rpc.Api.isSimulationError(simulationResponse)) {
      const errorMessage = simulationResponse.error;
      console.log("Simulation error details:", errorMessage);

      // Check if the error indicates the user doesn't exist or has no balance
      if (
        errorMessage.includes("UnreachableCodeReached") ||
        errorMessage.includes("InvalidAction") ||
        errorMessage.includes("balance") ||
        errorMessage.includes("not initialized")
      ) {
        console.log(
          "User not found or contract not initialized, returning 0.00"
        );
        return "0.00";
      }

      // For other errors, still throw
      console.error("Unexpected simulation error:", errorMessage);
      throw new Error(`Balance query failed: ${errorMessage}`);
    }

    if (!simulationResponse.result) {
      console.log("No result returned, returning 0.00");
      return "0.00";
    }

    // Parse the result
    const resultXdr = simulationResponse.result.retval;
    const result = scValToNative(resultXdr);

    console.log("Balance query successful, raw result (stroops):", result);

    const stroopsBalance = BigInt(result.toString());
    const decimalBalance = stroopsToDecimal(stroopsBalance);
    const formattedBalance = formatBalance(decimalBalance);

    console.log("Formatted balance:", formattedBalance);
    return formattedBalance;
  } catch (error) {
    console.error("Error getting balance:", error);

    // For unexpected errors, return 0.00 as a fallback
    if (
      error instanceof Error &&
      !error.message.includes("Balance query failed")
    ) {
      console.log("Unexpected error, returning 0.00 as fallback");
      return "0.00";
    }

    throw error;
  }
};

/**
 * Creates and submits a Soroban transaction using a secret key for signing.
 */
async function submitSorobanTransaction(
  userAddress: string,
  secretKey: string,
  operation: xdr.Operation
): Promise<void> {
  try {
    const keypair = Keypair.fromSecret(secretKey);

    // Get the user's account details
    const accountResponse = await server.getAccount(userAddress);
    const account = new Account(userAddress, accountResponse.sequenceNumber());

    // Build the transaction
    let transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    // Simulate first to get proper fee and auth
    const simulationResponse = await server.simulateTransaction(transaction);

    if (rpc.Api.isSimulationError(simulationResponse)) {
      throw new Error(`Simulation failed: ${simulationResponse.error}`);
    }

    // Assemble the transaction with simulation results
    transaction = rpc
      .assembleTransaction(transaction, simulationResponse)
      .build();

    // Sign the transaction
    transaction.sign(keypair);

    // Submit the signed transaction
    const transactionResponse = await server.sendTransaction(transaction);

    if (transactionResponse.status === "ERROR") {
      throw new Error(`Transaction failed: ${transactionResponse.errorResult}`);
    }

    // Wait for the transaction to be included in a ledger
    let getResponse = await server.getTransaction(transactionResponse.hash);
    while (getResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getResponse = await server.getTransaction(transactionResponse.hash);
    }

    if (getResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
      throw new Error(`Transaction failed: ${getResponse.resultXdr}`);
    }
  } catch (error) {
    console.error("Error submitting Soroban transaction:", error);
    throw error;
  }
}

/**
 * Transfers tokens from one user to another via the smart contract.
 * @param from - Source address
 * @param to - Destination address
 * @param amount - Amount as decimal string (e.g., "1.50")
 * @param secretKey - Secret key for signing
 */
export const transfer = async (
  from: string,
  to: string,
  amount: string,
  secretKey: string
): Promise<void> => {
  try {
    if (!contractId) {
      throw new Error(
        "Contract ID is not configured. Please set NEXT_PUBLIC_PAYMENTS_CONTRACT_ID environment variable."
      );
    }

    // Create Address objects properly
    const fromAddress = Address.fromString(from);
    const toAddress = Address.fromString(to);
    const contractAddress = Address.fromString(contractId);
    const amountInStroops = decimalToStroops(amount);

    console.log(
      `Transferring ${amount} (${amountInStroops} stroops) from ${from} to ${to}`
    );

    const operation = Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: contractAddress.toScAddress(),
          functionName: "transfer",
          args: [
            fromAddress.toScVal(),
            toAddress.toScVal(),
            bigIntToI128ScVal(amountInStroops),
          ],
        })
      ),
      auth: [],
    });

    await submitSorobanTransaction(from, secretKey, operation);
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw error;
  }
};

/**
 * Deposits tokens into the contract. This function can only be called by the admin.
 * @param depositor - Depositor address
 * @param amount - Amount as decimal string (e.g., "1.50")
 * @param secretKey - Admin secret key
 */
export const deposit = async (
  depositor: string,
  amount: string,
  secretKey: string
): Promise<void> => {
  try {
    if (!contractId) {
      throw new Error(
        "Contract ID is not configured. Please set NEXT_PUBLIC_PAYMENTS_CONTRACT_ID environment variable."
      );
    }

    // Create Address objects properly
    const depositorAddress = Address.fromString(depositor);
    const contractAddress = Address.fromString(contractId);
    const amountInStroops = decimalToStroops(amount);

    console.log(
      `Depositing ${amount} (${amountInStroops} stroops) from ${depositor}`
    );

    const operation = Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: contractAddress.toScAddress(),
          functionName: "deposit",
          args: [
            depositorAddress.toScVal(),
            bigIntToI128ScVal(amountInStroops),
          ],
        })
      ),
      auth: [],
    });

    await submitSorobanTransaction(depositor, secretKey, operation);
  } catch (error) {
    console.error("Error depositing tokens:", error);
    throw error;
  }
};

/**
 * Gets the native XLM balance of a user account.
 */
export const getNativeBalance = async (
  userAddress: string
): Promise<string> => {
  try {
    // 1. Create a ledger key for the account.
    const accountId = Keypair.fromPublicKey(userAddress).xdrPublicKey();
    const ledgerKey = xdr.LedgerKey.account(
      new xdr.LedgerKeyAccount({ accountId })
    );

    // 2. Fetch the ledger entry.
    const response = await server.getLedgerEntries(ledgerKey);

    if (response.entries && response.entries.length > 0) {
      // 3. Parse the XDR response to get the balance.
      const entry = response.entries[0];
      const accountEntry = entry.val.account();

      // The balance is in stroops.
      const balanceInStroops = accountEntry.balance().toString();

      // Convert stroops to XLM.
      const balanceInXLM = Number(balanceInStroops) / 10000000;

      return balanceInXLM.toFixed(2);
    } else {
      console.log(`Account not found or has no ledger entry: ${userAddress}`);
      return "0.00";
    }
  } catch (error) {
    console.error("Error getting native XLM balance:", error);
    // If the account doesn't exist, getAccount will throw.
    if (error instanceof Error && error.message.includes("Account not found")) {
      console.log("Account not found on network, returning 0.00");
      return "0.00";
    }
    throw error;
  }
};

/**
 * Transfers native XLM from one account to another.
 * @param senderSecret - The secret key of the sender.
 * @param recipientPublicKey - The public key of the recipient.
 * @param amount - The amount of XLM to send.
 */
export const transferNative = async (
  senderSecret: string,
  recipientPublicKey: string,
  amount: string
): Promise<void> => {
  try {
    const sourceKeypair = Keypair.fromSecret(senderSecret);
    const sourcePublicKey = sourceKeypair.publicKey();

    // Load the source account
    const sourceAccount = await server.getAccount(sourcePublicKey);
    const account = new Account(
      sourcePublicKey,
      sourceAccount.sequenceNumber()
    );

    // Build the transaction
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: recipientPublicKey,
          asset: Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(TimeoutInfinite)
      .build();

    // Sign the transaction
    transaction.sign(sourceKeypair);

    // Submit the transaction
    const transactionResponse = await server.sendTransaction(transaction);

    if (transactionResponse.status === "ERROR") {
      throw new Error(`Transaction failed: ${transactionResponse.errorResult}`);
    }

    // Wait for the transaction to be included in a ledger
    let getResponse = await server.getTransaction(transactionResponse.hash);
    while (getResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getResponse = await server.getTransaction(transactionResponse.hash);
    }

    if (getResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
      throw new Error(`Transaction failed: ${getResponse.resultXdr}`);
    }
  } catch (error) {
    console.error("Error transferring native XLM:", error);
    throw error;
  }
};
