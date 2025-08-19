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
  Horizon,
} from "@stellar/stellar-sdk";

interface StellarBalance {
  asset_type: string;
  balance: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
  asset_code?: string;
  asset_issuer?: string;
}

export interface StellarTransaction {
  id: string;
  hash: string;
  type: "SENT" | "RECEIVED" | "OTHER";
  amount: string;
  fee: string;
  from: string;
  to: string;
  asset: string;
  memo?: string;
  createdAt: string;
  successful: boolean;
  operationType: string;
  ledger: string;
}

const STELLAR_DECIMALS = 7;
const DECIMAL_MULTIPLIER = BigInt(10 ** STELLAR_DECIMALS);

const contractId = process.env.NEXT_PUBLIC_PAYMENTS_CONTRACT_ID!;

// Configure the Soroban RPC server
const rpcUrl =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
  "https://soroban-testnet.stellar.org";
const networkPassphrase =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK || Networks.TESTNET;

const server = new rpc.Server(rpcUrl);
const horizonUrl = "https://horizon-testnet.stellar.org";
const horizonServer = new Horizon.Server(horizonUrl);

/**
 * Converts a BigInt to a ScVal that represents an i128.
 *
 * Takes advantage of the fact that the lower 64 bits of a BigInt are
 * already a valid `xdr.Int64` and that the upper 64 bits can be
 * represented as a second `xdr.Int64`, which can then be used to
 * construct an `xdr.Int128Parts` which is a valid `xdr.ScVal`.
 *
 * @param value - The BigInt value to convert
 * @returns An `xdr.ScVal` that represents the given `BigInt` as an i128
 */
function bigIntToI128ScVal(value: bigint): xdr.ScVal {
  const hi = new xdr.Int64(value >> BigInt(64));
  const lo = new xdr.Int64(value & ((BigInt(1) << BigInt(64)) - BigInt(1)));
  return xdr.ScVal.scvI128(new xdr.Int128Parts({ hi, lo }));
}

export const decimalToStroops = (decimalAmount: string): bigint => {
  const decimal = parseFloat(decimalAmount);
  if (isNaN(decimal)) {
    throw new Error("Invalid decimal amount");
  }
  return BigInt(Math.round(decimal * Number(DECIMAL_MULTIPLIER)));
};

/**
 * Converts a stroop amount to a decimal string.
 *
 * @param stroops - A stroop amount to convert
 * @returns A string representing the decimal value of the given stroop amount
 */
export const stroopsToDecimal = (stroops: bigint): string => {
  const decimal = Number(stroops) / Number(DECIMAL_MULTIPLIER);
  return decimal.toFixed(7);
};

export const formatBalance = (balance: string): string => {
  const num = parseFloat(balance);
  if (num === 0) return "0.00";

  return num
    .toFixed(7)
    .replace(/\.?0+$/, "")
    .padEnd(4, "0");
};

/**
 * Generates a new random Stellar keypair.
 *
 * @returns An object containing the public and secret keys for the newly
 * generated keypair.
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

      console.error("Unexpected simulation error:", errorMessage);
      throw new Error(`Balance query failed: ${errorMessage}`);
    }

    if (!simulationResponse.result) {
      console.log("No result returned, returning 0.00");
      return "0.00";
    }

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
 * Submits a Soroban transaction to the network.
 *
 * @param {string} userAddress - The Stellar address of the user.
 * @param {string} secretKey - The secret key of the user.
 * @param {xdr.Operation} operation - The operation to be submitted to the contract.
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} If transaction submission fails.
 */
async function submitSorobanTransaction(
  userAddress: string,
  secretKey: string,
  operation: xdr.Operation
): Promise<void> {
  try {
    const keypair = Keypair.fromSecret(secretKey);

    const accountResponse = await server.getAccount(userAddress);
    const account = new Account(userAddress, accountResponse.sequenceNumber());

    let transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    const simulationResponse = await server.simulateTransaction(transaction);

    if (rpc.Api.isSimulationError(simulationResponse)) {
      throw new Error(`Simulation failed: ${simulationResponse.error}`);
    }

    transaction = rpc
      .assembleTransaction(transaction, simulationResponse)
      .build();

    transaction.sign(keypair);

    const transactionResponse = await server.sendTransaction(transaction);

    if (transactionResponse.status === "ERROR") {
      console.error("sendTransaction ERROR:", transactionResponse);
      throw new Error("Transaction submission failed.");
    }

    let attempts = 0;
    const maxAttempts = 30;
    let getResponse: any;

    while (attempts < maxAttempts) {
      try {
        getResponse = await server.getTransaction(transactionResponse.hash);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("Bad union switch") || msg.includes("XDR")) {
          console.warn(
            "Non-fatal status decode error (likely SDK/XDR mismatch). Assume submission ok; verify externally if needed."
          );
          return;
        }
        throw e;
      }

      if (getResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
        console.log("Transaction successful:", transactionResponse.hash);
        return;
      }

      if (getResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
        console.error("Transaction FAILED (no XDR decode):", getResponse);
        throw new Error(
          "Transaction failed. This could be due to insufficient balance, invalid arguments, or network issues."
        );
      }

      if (getResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
        attempts += 1;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      console.log("Transaction status:", getResponse.status);
      return;
    }

    throw new Error(
      "Transaction confirmation timeout. Please check the transaction status manually."
    );
  } catch (error) {
    console.error("Error submitting Soroban transaction:", error);
    if (
      error instanceof Error &&
      (error.message.includes("Bad union switch") ||
        error.message.includes("XDR"))
    ) {
      throw new Error(
        "Transaction submitted, but status decoding encountered an error. Please verify the transaction status separately."
      );
    }
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
    if (
      error instanceof Error &&
      (error.message.includes("Bad union switch") ||
        error.message.includes("XDR"))
    ) {
      throw new Error(
        "Transfer submitted, but status decoding failed. Please check balances to confirm the result."
      );
    }
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
    if (
      error instanceof Error &&
      (error.message.includes("Bad union switch") ||
        error.message.includes("XDR"))
    ) {
      throw new Error(
        "Deposit submitted, but status decoding failed. Please verify on-chain state."
      );
    }
    throw error;
  }
};

/**
 * Gets the native XLM balance of a user from the Stellar network.
 * Returns the balance as a formatted decimal string (e.g., "0.00", "1.50")
 *
 * @param {string} userAddress - The Stellar address of the user.
 *
 * @throws {Error} If balance retrieval fails.
 */

export const getNativeBalance = async (
  userAddress: string
): Promise<string> => {
  try {
    const accountId = Keypair.fromPublicKey(userAddress).xdrPublicKey();
    const ledgerKey = xdr.LedgerKey.account(
      new xdr.LedgerKeyAccount({ accountId })
    );

    const response = await server.getLedgerEntries(ledgerKey);

    if (response.entries && response.entries.length > 0) {
      const entry = response.entries[0];
      const accountEntry = entry.val.account();

      const balanceInStroops = accountEntry.balance().toString();

      const balanceInXLM = Number(balanceInStroops) / 10000000;

      return balanceInXLM.toFixed(2);
    } else {
      console.log(`Account not found or has no ledger entry: ${userAddress}`);
      return "0.00";
    }
  } catch (error) {
    console.error("Error getting native XLM balance:", error);
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

    console.log(
      `Transferring ${amount} XLM from ${sourcePublicKey} to ${recipientPublicKey}`
    );

    try {
      await server.getAccount(recipientPublicKey);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Account not found")
      ) {
        throw new Error(
          "Recipient account does not exist. The recipient needs to activate their account first by receiving at least 1 XLM."
        );
      }
      throw error;
    }

    const sourceAccountResponse = await server.getAccount(sourcePublicKey);
    const account = new Account(
      sourcePublicKey,
      sourceAccountResponse.sequenceNumber()
    );

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

    transaction.sign(sourceKeypair);

    console.log("Submitting transaction...");

    const transactionResponse = await server.sendTransaction(transaction);

    console.log("Transaction submitted:", transactionResponse.hash);

    if (transactionResponse.status === "ERROR") {
      console.error("sendTransaction ERROR:", transactionResponse);
      throw new Error("Transaction submission failed.");
    }

    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      let getResponse: Awaited<ReturnType<typeof server.getTransaction>>;

      try {
        getResponse = await server.getTransaction(transactionResponse.hash);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("Bad union switch") || msg.includes("XDR")) {
          console.warn(
            "Status decode error (likely SDK/XDR mismatch). Assuming submission ok; verify balance or explorer."
          );
          return;
        }
        throw e;
      }

      if (getResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
        console.log("Transaction successful:", transactionResponse.hash);
        return;
      }

      if (getResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
        console.error("Transaction failed (no XDR decode):", getResponse);
        throw new Error(
          "Transaction failed. This could be due to insufficient balance, invalid recipient, or network issues. Please check your balance and try again."
        );
      }

      if (getResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
        attempts++;
        console.log(
          `Waiting for transaction confirmation... (${attempts}/${maxAttempts})`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      console.log("Transaction status:", getResponse);
      return;
    }

    throw new Error(
      "Transaction confirmation timeout. Please check the transaction status manually."
    );
  } catch (error) {
    console.error("Error transferring native XLM:", error);

    if (error instanceof Error) {
      if (error.message.includes("Account not found")) {
        throw new Error(
          "Source account not found. Please ensure the account is funded and activated."
        );
      } else if (error.message.includes("destination does not exist")) {
        throw new Error(
          "Destination account does not exist. The recipient needs to activate their account first."
        );
      } else if (error.message.includes("Insufficient balance")) {
        throw new Error(
          "Insufficient balance to complete the transfer including fees."
        );
      } else if (
        error.message.includes("Bad union switch") ||
        error.message.includes("XDR")
      ) {
        throw new Error(
          "Transaction processing completed, but status confirmation had an error. Please check your balance to confirm if the transaction succeeded."
        );
      }
    }

    throw error;
  }
};

/**
 * Fetches and processes transaction history for a Stellar account.
 * Returns formatted transaction data suitable for display.
 */
export const getTransactionHistory = async (
  userAddress: string
): Promise<StellarTransaction[]> => {
  try {
    console.log("Fetching transaction history for:", userAddress);

    const response = await horizonServer
      .transactions()
      .forAccount(userAddress)
      .order("desc")
      .limit(50)
      .includeFailed(true)
      .call();

    console.log("Transaction history response:", response);

    const processedTransactions: StellarTransaction[] = [];

    for (const tx of response.records) {
      try {
        const operationsResponse = await horizonServer
          .operations()
          .forTransaction(tx.id)
          .call();

        for (const op of operationsResponse.records) {
          let transactionData: Partial<StellarTransaction> = {
            id: `${tx.id}-${op.id}`,
            hash: tx.hash,
            createdAt: tx.created_at,
            successful: tx.successful,
            fee: (Number(tx.fee_charged) / 10_000_000).toFixed(7),
            ledger: tx.ledger.toString(),
            operationType: op.type,
            memo: getCleanMemo(tx.memo, tx.memo_type),
          };

          if (op.type === "payment") {
            const paymentOp = op as any;

            if (paymentOp.asset_type === "native") {
              transactionData = {
                ...transactionData,
                type: paymentOp.from === userAddress ? "SENT" : "RECEIVED",
                amount: paymentOp.amount.toString(),
                from: paymentOp.from,
                to: paymentOp.to,
                asset: "XLM",
              };
              processedTransactions.push(transactionData as StellarTransaction);
            }
          } else if (op.type === "create_account") {
            const createAccountOp = op as any;
            transactionData = {
              ...transactionData,
              type:
                createAccountOp.funder === userAddress ? "SENT" : "RECEIVED",
              amount: createAccountOp.starting_balance.toString(),
              from: createAccountOp.funder,
              to: createAccountOp.account,
              asset: "XLM",
              operationType: "Account Creation",
            };
            processedTransactions.push(transactionData as StellarTransaction);
          } else if (op.type === "account_merge") {
            const mergeOp = op as any;
            transactionData = {
              ...transactionData,
              type: mergeOp.account === userAddress ? "SENT" : "RECEIVED",
              amount: "0",
              from: mergeOp.account,
              to: mergeOp.into,
              asset: "XLM",
              operationType: "Account Merge",
            };
            processedTransactions.push(transactionData as StellarTransaction);
          } else if (op.type === "invoke_host_function") {
            const invokeOp = op as any;
            transactionData = {
              ...transactionData,
              type: "OTHER",
              amount: "0",
              from: invokeOp.source_account || userAddress,
              to: "Smart Contract",
              asset: "XLM",
              operationType: "Smart Contract Call",
              memo: getCleanMemo(tx.memo, tx.memo_type),
            };
            processedTransactions.push(transactionData as StellarTransaction);
          } else {
            if (
              op.source_account === userAddress ||
              tx.source_account === userAddress
            ) {
              transactionData = {
                ...transactionData,
                type: "OTHER",
                amount: "0",
                from: op.source_account || tx.source_account || userAddress,
                to: "N/A",
                asset: "XLM",
                operationType: formatOperationType(op.type),
              };
              processedTransactions.push(transactionData as StellarTransaction);
            }
          }
        }
      } catch (opError) {
        console.error(
          `Error processing operations for transaction ${tx.id}:`,
          opError
        );

        const fallbackTransaction: StellarTransaction = {
          id: tx.id,
          hash: tx.hash,
          type: "OTHER",
          amount: "0",
          fee: (Number(tx.fee_charged) / 10_000_000).toFixed(7),
          from: tx.source_account,
          to: "Unknown",
          asset: "XLM",
          memo: getCleanMemo(tx.memo, tx.memo_type),
          createdAt: tx.created_at,
          successful: tx.successful,
          operationType: "Unknown Operation",
          ledger: tx.ledger.toString(),
        };
        processedTransactions.push(fallbackTransaction);
      }
    }

    processedTransactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log("Processed transactions:", processedTransactions);
    return processedTransactions;
  } catch (error) {
    console.error("Error fetching transaction history:", error);

    if (error instanceof Error && error.message.includes("Account not found")) {
      console.log("Account not found, returning empty transaction history");
      return [];
    }

    throw new Error(
      `Failed to fetch transaction history: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

function getCleanMemo(memo: any, memoType: any): string | undefined {
  if (!memo || memo === null || memo === "") return undefined;

  if (memoType === "text" && typeof memo === "string") {
    if (
      memo.includes("function") ||
      memo.includes("return") ||
      memo.length > 100
    ) {
      return undefined;
    }
    return memo;
  }

  return undefined;
}

function formatOperationType(opType: string): string {
  const formatted = opType
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Handle specific cases
  switch (opType) {
    case "invoke_host_function":
      return "Smart Contract";
    case "create_account":
      return "Account Creation";
    case "account_merge":
      return "Account Merge";
    case "manage_data":
      return "Manage Data";
    case "bump_sequence":
      return "Bump Sequence";
    default:
      return formatted;
  }
}

/**
 * Formats XLM amount for display
 */
export const formatXLMAmount = (amount: string): string => {
  const num = parseFloat(amount);
  if (num === 0) return "0.00";

  if (num >= 1) {
    return num.toFixed(2);
  } else if (num >= 0.01) {
    return num.toFixed(4);
  } else {
    return num.toFixed(7);
  }
};

export const truncateAddress = (
  address: string,
  startChars = 8,
  endChars = 8
): string => {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};
