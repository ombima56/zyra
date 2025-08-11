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
} from "@stellar/stellar-sdk";

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
 * Connects to the user's Freighter wallet and retrieves their public key.
 */
export const connectWallet = async (freighter: any): Promise<string | null> => {
  try {
    if (!freighter) {
      throw new Error(
        "Freighter wallet is not available. Please install the Freighter extension."
      );
    }

    // Check if already connected
    if (await freighter.isConnected()) {
      return freighter.getPublicKey();
    }

    // Request connection
    await freighter.requestAccess();

    if (await freighter.isConnected()) {
      return freighter.getPublicKey();
    }

    return null;
  } catch (error) {
    console.error("Wallet connection error:", error);
    throw error;
  }
};

/**
 * Gets the balance of a user from the Soroban smart contract.
 */
export const getBalance = async (userAddress: string): Promise<bigint> => {
  try {
    if (!contractId) {
      throw new Error(
        "Contract ID is not configured. Please set NEXT_PUBLIC_PAYMENTS_CONTRACT_ID environment variable."
      );
    }

    const account = new Address(userAddress);

    const contractAddress = new Address(contractId);
    const operation = Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: contractAddress.toScAddress(),
          functionName: "balance",
          args: [account.toScVal()],
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
    const simulationResponse = await server.simulateTransaction(transaction);

    if (rpc.Api.isSimulationError(simulationResponse)) {
      throw new Error(`Simulation error: ${simulationResponse.error}`);
    }

    if (!simulationResponse.result) {
      throw new Error("No result returned from contract simulation");
    }

    // Parse the result
    const resultXdr = simulationResponse.result.retval;
    const result = scValToNative(resultXdr);

    return BigInt(result.toString());
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
};

/**
 * Creates and submits a Soroban transaction using Freighter for signing.
 */
async function submitSorobanTransaction(
  userAddress: string,
  operation: xdr.Operation,
  freighter: any
): Promise<void> {
  try {
    if (!freighter) {
      throw new Error("Freighter wallet is not available.");
    }

    // Get the user's account details
    const accountResponse = await server.getAccount(userAddress);
    const account = new Account(userAddress, accountResponse.sequenceNumber());

    // Build the transaction
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    // Simulate the transaction first
    const simulationResponse = await server.simulateTransaction(transaction);

    if (rpc.Api.isSimulationError(simulationResponse)) {
      throw new Error(`Simulation failed: ${simulationResponse.error}`);
    }

    // Prepare the transaction for signing
    const preparedTransaction = rpc.assembleTransaction(
      transaction,
      simulationResponse
    );

    // Sign the transaction using Freighter
    const signedTransaction = await freighter.signTransaction(
      preparedTransaction,
      {
        networkPassphrase,
        accountToSign: userAddress,
      }
    );

    // Submit the signed transaction
    const transactionResponse = await server.sendTransaction(signedTransaction);

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
 */
export const transfer = async (
  from: string,
  to: string,
  amount: string,
  freighter: any
): Promise<void> => {
  try {
    if (!contractId) {
      throw new Error(
        "Contract ID is not configured. Please set NEXT_PUBLIC_PAYMENTS_CONTRACT_ID environment variable."
      );
    }

    const fromAddress = new Address(from);
    const toAddress = new Address(to);
    const amountToTransfer = BigInt(amount);

    // The correct way to create a contract address is to pass the contract ID string
    // directly to the Address constructor. The Address class handles the type internally.
    const contractAddress = new Address(contractId);
    const operation = Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: contractAddress.toScAddress(),
          functionName: "transfer",
          args: [
            fromAddress.toScVal(),
            toAddress.toScVal(),
            bigIntToI128ScVal(amountToTransfer),
          ],
        })
      ),
      auth: [],
    });

    await submitSorobanTransaction(from, operation, freighter);
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw error;
  }
};

/**
 * Deposits tokens into the contract. This function can only be called by the admin.
 */
export const deposit = async (
  depositor: string,
  amount: string,
  freighter: any
): Promise<void> => {
  try {
    if (!contractId) {
      throw new Error(
        "Contract ID is not configured. Please set NEXT_PUBLIC_PAYMENTS_CONTRACT_ID environment variable."
      );
    }

    const depositorAddress = new Address(depositor);
    const amountToDeposit = BigInt(amount);

    // The correct way to create a contract address is to pass the contract ID string
    // directly to the Address constructor. The Address class handles the type internally.
    const contractAddress = new Address(contractId);
    const operation = Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: contractAddress.toScAddress(),
          functionName: "deposit",
          args: [
            depositorAddress.toScVal(),
            bigIntToI128ScVal(amountToDeposit),
          ],
        })
      ),
      auth: [],
    });

    await submitSorobanTransaction(depositor, operation, freighter);
  } catch (error) {
    console.error("Error depositing tokens:", error);
    throw error;
  }
};
