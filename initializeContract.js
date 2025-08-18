const {
  Keypair,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  Server,
  Account,
  xdr,
  Address,
  rpc,
} = require("@stellar/stellar-sdk");
require("dotenv").config({ path: "./frontend/.env" });

const contractId = process.env.NEXT_PUBLIC_PAYMENTS_CONTRACT_ID;
const adminSecret = process.env.ADMIN_SECRET_KEY;
const rpcUrl =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
  "https://soroban-testnet.stellar.org";
const networkPassphrase =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET;

const server = new rpc.Server(rpcUrl);

async function checkContractStatus() {
  console.log("=== CHECKING CONTRACT STATUS ===");
  try {
    const contractAddress = new Address(contractId);

    // Try to call get_admin to see if contract is initialized
    const operation = Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: contractAddress.toScAddress(),
          functionName: "get_admin",
          args: [],
        })
      ),
      auth: [],
    });

    // Create dummy transaction for simulation
    const dummyKeypair = Keypair.random();
    const dummyAccount = new Account(dummyKeypair.publicKey(), "0");

    const transaction = new TransactionBuilder(dummyAccount, {
      fee: "100",
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const simulationResponse = await server.simulateTransaction(transaction);

    if (rpc.Api.isSimulationError(simulationResponse)) {
      console.log(
        "Contract might not be initialized or get_admin method doesn't exist"
      );
      console.log("Simulation error:", simulationResponse.error);
      return false;
    } else {
      console.log("Contract appears to be initialized");
      console.log("Current admin:", simulationResponse.result?.retval);
      return true;
    }
  } catch (error) {
    console.log("Could not check contract status:", error.message);
    return false;
  }
}

async function initializeContract() {
  if (!contractId) {
    console.error(
      "NEXT_PUBLIC_PAYMENTS_CONTRACT_ID is not set in .env. Please set it."
    );
    return;
  }
  if (!adminSecret) {
    console.error(
      "ADMIN_SECRET_KEY is not set in .env. Please set it with your admin account's secret key."
    );
    return;
  }

  const adminKeypair = Keypair.fromSecret(adminSecret);
  const adminPublicKey = adminKeypair.publicKey();

  console.log("=== INITIALIZING SOROBAN PAYMENTS CONTRACT ===");
  console.log("Contract ID:", contractId);
  console.log("Admin Public Key:", adminPublicKey);
  console.log("Soroban RPC URL:", rpcUrl);
  console.log("Network Passphrase:", networkPassphrase);

  // Check if contract is already initialized
  const isInitialized = await checkContractStatus();
  if (isInitialized) {
    console.log("Contract is already initialized. Exiting.");
    return;
  }

  try {
    console.log("\n=== GETTING ADMIN ACCOUNT DETAILS ===");
    // Get admin account details
    const accountResponse = await server.getAccount(adminPublicKey);
    console.log("Account sequence number:", accountResponse.sequenceNumber());
    console.log("Account balance:", accountResponse.balances);

    const adminAccount = new Account(
      adminPublicKey,
      accountResponse.sequenceNumber()
    );

    // Define the token to be managed by the contract.
    const tokenAddress = new Address(
      "GAKHPYOEGR2OM7IXQALYVW2FGRFUVO4UGDSQCK6EOYDHXTBM7HL7BEQN"
    );

    const contractAddress = new Address(contractId);

    console.log("\n=== BUILDING TRANSACTION ===");
    const operation = Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: contractAddress.toScAddress(),
          functionName: "initialize",
          args: [tokenAddress.toScVal(), new Address(adminPublicKey).toScVal()],
        })
      ),
      auth: [],
    });

    let transaction = new TransactionBuilder(adminAccount, {
      fee: "100000", // Increase base fee for contract calls
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30) // 30 seconds timeout
      .build();

    // Simulate first to get accurate fee and check for errors
    console.log("Simulating transaction...");
    const simulationResponse = await server.simulateTransaction(transaction);

    if (rpc.Api.isSimulationError(simulationResponse)) {
      console.error("=== SIMULATION ERROR ===");
      console.error("Error:", simulationResponse.error);
      return;
    }

    console.log("Simulation successful!");
    console.log("Simulation result:", simulationResponse.result?.retval);

    // Prepare the transaction with simulation results
    transaction = rpc
      .assembleTransaction(transaction, simulationResponse)
      .build();
    transaction.sign(adminKeypair);

    console.log("\n=== SUBMITTING TRANSACTION ===");
    const sendResult = await server.sendTransaction(transaction);
    console.log("Transaction hash:", sendResult.hash);
    console.log("Transaction status:", sendResult.status);

    if (sendResult.status === "ERROR") {
      console.error("=== TRANSACTION SUBMISSION ERROR ===");
      console.error("Full error object:", JSON.stringify(sendResult, null, 2));

      // Enhanced error decoding
      try {
        if (sendResult.errorResult && sendResult.errorResult._attributes) {
          const attrs = sendResult.errorResult._attributes;
          console.log("Fee charged:", attrs.feeCharged?._value || 0);

          if (attrs.result && attrs.result._switch !== undefined) {
            const errorCode = attrs.result._switch;
            console.log("Transaction result code:", errorCode);

            // Common Stellar transaction result codes
            const errorMap = {
              "-1": "txFAILED - One or more operations failed",
              "-2": "txTOO_EARLY - Ledger closeTime before minTime",
              "-3": "txTOO_LATE - Ledger closeTime after maxTime",
              "-4": "txMISSING_OPERATION - No operation was specified",
              "-5": "txBAD_SEQ - Sequence number does not match source account",
              "-6": "txBAD_AUTH - Too few valid signatures / wrong network",
              "-7": "txINSUFFICIENT_BALANCE - Fee would bring account below reserve",
              "-8": "txNO_SOURCE_ACCOUNT - Source account not found",
              "-9": "txINSUFFICIENT_FEE - Fee is too small",
              "-10":
                "txBAD_AUTH_EXTRA - Unused signatures attached to transaction",
              "-11": "txINTERNAL_ERROR - An unknown error occurred",
            };

            const errorMessage =
              errorMap[errorCode.toString()] ||
              `Unknown error code: ${errorCode}`;
            console.log("Error meaning:", errorMessage);
          }
        }
      } catch (decodeError) {
        console.log("Could not decode error details:", decodeError.message);
      }

      return;
    }

    console.log("\n=== WAITING FOR CONFIRMATION ===");
    let getResponse = await server.getTransaction(sendResult.hash);
    while (getResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
      console.log("Transaction not found yet, waiting 2 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      getResponse = await server.getTransaction(sendResult.hash);
    }

    if (getResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
      console.error("=== TRANSACTION FAILED ===");
      console.error("Result XDR:", getResponse.resultXdr);

      // Try to decode the failure reason
      try {
        const resultXdr = xdr.TransactionResult.fromXDR(
          getResponse.resultXdr,
          "base64"
        );
        console.error("Decoded result:", resultXdr);
      } catch (e) {
        console.error("Could not decode result XDR:", e.message);
      }
    } else if (getResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
      console.log("=== CONTRACT INITIALIZED SUCCESSFULLY! ===");
      console.log("Transaction hash:", sendResult.hash);

      // Verify initialization by checking contract status again
      await checkContractStatus();
    }
  } catch (error) {
    console.error("=== UNEXPECTED ERROR ===");
    console.error("Error:", error);
    console.error("Stack trace:", error.stack);
  }
}

initializeContract();
