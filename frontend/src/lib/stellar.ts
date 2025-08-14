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
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    // Sign the transaction directly
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

    const fromAddress = new Address(from);
    const toAddress = new Address(to);
    const amountToTransfer = BigInt(amount);

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

    await submitSorobanTransaction(from, secretKey, operation);
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
  secretKey: string
): Promise<void> => {
  try {
    if (!contractId) {
      throw new Error(
        "Contract ID is not configured. Please set NEXT_PUBLIC_PAYMENTS_CONTRACT_ID environment variable."
      );
    }

    const depositorAddress = new Address(depositor);
    const amountToDeposit = BigInt(amount);

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

    await submitSorobanTransaction(depositor, secretKey, operation);
  } catch (error) {
    console.error("Error depositing tokens:", error);
    throw error;
  }
};
