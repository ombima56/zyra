# Complete Soroban Smart Contract Deployment Guide

## Table of Contents
1. [Prerequisites & Environment Setup](#1-prerequisites--environment-setup)
2. [Project Initialization](#2-project-initialization)
3. [Smart Contract Development](#3-smart-contract-development)
4. [Building the Contract](#4-building-the-contract)
5. [Network Configuration](#5-network-configuration)
6. [Keypair Generation](#6-keypair-generation)
7. [Account Funding](#7-account-funding)
8. [Contract Deployment](#8-contract-deployment)
9. [Contract Initialization](#9-contract-initialization)
10. [Testing Contract Functions](#10-testing-contract-functions)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prerequisites & Environment Setup

### Install Rust
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Add WASM target for Soroban
rustup target add wasm32-unknown-unknown
```

### Install Soroban CLI
```bash
# Install the latest Soroban CLI
cargo install --locked stellar-cli

# Verify installation
soroban --version
```

### Install Node.js (Optional - for frontend integration)
```bash
# Install Node.js (version 18+ recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 2. Project Initialization

### Create a New Soroban Project
```bash
# Create a new directory for your project
mkdir my-soroban-project
cd my-soroban-project

# Initialize a new Soroban contract
soroban contract init payments-contract
cd payments-contract
```

### Project Structure
```
payments-contract/
├── Cargo.toml
├── src/
│   └── lib.rs
├── tests/
└── target/
```

---

## 3. Smart Contract Development

### Basic Contract Template (`src/lib.rs`)
```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address, Symbol};

#[contract]
pub struct PaymentsContract;

#[contractimpl]
impl PaymentsContract {
    // Initialize the contract
    pub fn initialize(env: Env, token: Address, admin: Address) {
        env.storage().instance().set(&Symbol::new(&env, "token"), &token);
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);
    }

    // Get balance of a user
    pub fn balance(env: Env, user: Address) -> i128 {
        let token_address = env.storage().instance().get(&Symbol::new(&env, "token"))
            .expect("Token address not set. Contract must be initialized.");
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);
        token_client.balance(&user)
    }

    // Transfer tokens between accounts
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();

        if amount <= 0 {
            panic!("Amount must be greater than zero.");
        }

        let token_address = env.storage().instance().get(&Symbol::new(&env, "token"))
            .expect("Token address not set. Contract must be initialized.");
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);
        token_client.transfer(&from, &to, &amount);
    }

    // Deposit tokens (admin only)
    pub fn deposit(env: Env, depositor: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&Symbol::new(&env, "admin")).unwrap();
        admin.require_auth();

        if amount <= 0 {
            panic!("Deposit amount must be positive.");
        }

        let token_address = env.storage().instance().get(&Symbol::new(&env, "token")).unwrap();
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);
        let contract_address = env.current_contract_address();
        token_client.transfer(&depositor, &contract_address, &amount);
    }
}
```

### Update Cargo.toml Dependencies
```toml
[package]
name = "payments-contract"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
soroban-sdk = "21.0.0"

[dev-dependencies]
soroban-sdk = { version = "21.0.0", features = ["testutils"] }

[features]
testutils = ["soroban-sdk/testutils"]

[[bin]]
name = "generate_key"
path = "generate_key.rs"
```

---

## 4. Building the Contract

### Create Key Generation Script (`generate_key.js`)
```javascript
const { Keypair } = require('@stellar/stellar-sdk');

const keypair = Keypair.random();
console.log('Public Key:', keypair.publicKey());
console.log('Secret Key:', keypair.secret());
```

### Build the Contract
```bash
# Build the contract
soroban contract build

# Verify build output
ls target/wasm32-unknown-unknown/release/
```

**Expected Output:**
```
✅ Build Complete
Wasm File: target/wasm32-unknown-unknown/release/payments_contract.wasm
Wasm Hash: [hash-value]
Exported Functions: 4 found
  • initialize
  • balance  
  • transfer
  • deposit
```

---

## 5. Network Configuration

### Configure Testnet Network
```bash
# Add Stellar testnet configuration
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Verify network configuration
soroban network ls
```

### Alternative: Configure using environment variables
```bash
# Export network settings
export SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
export SOROBAN_RPC_URL="https://soroban-testnet.stellar.org:443"
```

---

## 6. Keypair Generation

### Generate a New Keypair
```bash
# Generate random keypair
node generate_key.js
```

**Sample Output:**
```
Public Key: <Place with your actual Pulic key>
Secret Key: <Place with your actual secret key>
```

### Store Keypair Securely
```bash
# Create identity for Soroban CLI
soroban keys add alice --secret-key <Your place with secret key>

# Verify identity
soroban keys ls
```

---

## 7. Account Funding

### Method 1: Using Stellar Laboratory (Recommended)
1. Visit: https://laboratory.stellar.org/#account-creator?network=test
2. Paste your public key: `<Your Public key>`
3. Click "Create Account"
4. Account will be funded with 10,000 XLM testnet tokens

### Method 2: Using Friendbot (Alternative)
```bash
# Fund account using Friendbot
curl "https://friendbot.stellar.org/?addr=<Your Public Key>"
```

### Method 3: Using Soroban CLI
```bash
# Fund account through Soroban CLI
soroban keys fund alice --network testnet
```

### Verify Account Funding
```bash
# Check account balance
soroban keys balance alice --network testnet

# Alternative: Direct balance check
curl "https://horizon-testnet.stellar.org/accounts/<Your Public Key>"
```

**Expected Response:**
```json
{
  "account_id": "<Your public key>",
  "sequence": "...",
  "balances": [
    {
      "balance": "10000.0000000",
      "asset_type": "native"
    }
  ]
}
```

---

## 8. Contract Deployment

### Deploy Contract to Testnet
```bash
# Deploy the contract
soroban contract deploy \
  --source alice \
  --network testnet \
  --wasm target/wasm32-unknown-unknown/release/payments_contract.wasm

# Alternative using secret key directly
soroban contract deploy \
  --source SCR5AZANLF73R5W2WD4I4XKN2BU5PGPE5IQRUMCMP2CLOHFQSRE7EXOY \
  --network testnet \
  --wasm target/wasm32-unknown-unknown/release/payments_contract.wasm
```

**Expected Output:**
```
✅ Deployed!
Contract ID: <Your deploy contract>
🔗 https://stellar.expert/explorer/testnet/contract/<Your deploy contract>
```

### Save Contract ID
```bash
# Export contract ID for future use
export CONTRACT_ID=<Your deploy contract>
```

---

## 9. Contract Initialization

### Get Native XLM Contract Address
```bash
# Get native XLM contract address for testnet
soroban contract id asset --asset native --network testnet
```

**Expected Output:**
```
CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC  // Example
```

### Initialize the Contract
```bash
# Initialize contract with token and admin addresses
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- initialize \
  --admin <Your admin address> \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC   // Example
```

**Expected Output:**
```
✅ Transaction successful
🔗 https://stellar.expert/explorer/testnet/tx/[transaction-hash]
```

---

## 10. Testing Contract Functions

### Check Function Parameters
```bash
# Check what parameters each function expects
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- balance --help
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- deposit --help  
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- transfer --help
```

### Test Balance Function
```bash
# Check balance of your account
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- balance \
  --user GDVEL43BVOY2LJ5XNCLZO5TZ5GRJXTTLA2QRGNZJOPON7S462TF7BPDA
```

### Test Deposit Function
```bash
# Deposit 1 XLM (10,000,000 stroops) to contract
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- deposit \
  --depositor GDVEL43BVOY2LJ5XNCLZO5TZ5GRJXTTLA2QRGNZJOPON7S462TF7BPDA \
  --amount 10000000
```

### Test Transfer Function  
```bash
# Transfer 0.5 XLM from contract back to your account
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- transfer \
  --from $CONTRACT_ID \
  --to GDVEL43BVOY2LJ5XNCLZO5TZ5GRJXTTLA2QRGNZJOPON7S462TF7BPDA \
  --amount 5000000
```

### Verify Contract Balance
```bash
# Check contract's balance
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- balance \
  --user $CONTRACT_ID
```

---

## 11. Troubleshooting

### Common Errors & Solutions

#### Error: "Account not found"
**Solution:** Ensure your account is funded
```bash
# Fund account
soroban keys fund alice --network testnet
```

#### Error: "Contract not found"
**Solution:** Verify contract ID and network
```bash
# Check if contract exists
curl "https://horizon-testnet.stellar.org/accounts/$CONTRACT_ID"
```

#### Error: "Transaction simulation failed"
**Possible causes:**
- Insufficient balance
- Wrong parameters
- Contract not initialized
- Authorization issues

**Debug steps:**
```bash
# Check account balance
soroban keys balance alice --network testnet

# Verify contract initialization
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- balance --user $CONTRACT_ID
```

#### Error: "Storage MissingValue"  
**Solution:** Initialize the contract first
```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- initialize \
  --admin [ADMIN_ADDRESS] \
  --token [TOKEN_ADDRESS]
```

### Useful Commands for Debugging

```bash
# Check Soroban CLI version
soroban --version

# Check network configuration
soroban network ls

# Check available identities
soroban keys ls

# Check specific account details
soroban keys address alice
soroban keys balance alice --network testnet

# View transaction details
soroban events --start-ledger [LEDGER] --network testnet

# Check contract events
soroban events --id $CONTRACT_ID --start-ledger [LEDGER] --network testnet
```

---

## Environment Variables Summary

For production deployment, set these environment variables:

```bash
# Contract Configuration
export CONTRACT_ID=<Your deploy contract>
export NATIVE_TOKEN=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
export ADMIN_PUBLIC_KEY=<Your admin public key>
export ADMIN_SECRET_KEY=<Your admin secret key>

# Network Configuration  
export SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
export SOROBAN_RPC_URL="https://soroban-testnet.stellar.org:443"
export STELLAR_NETWORK=testnet
```

---

## Next Steps

1. **Frontend Integration**: Integrate your contract with a web application using Stellar SDK
2. **Mainnet Deployment**: Deploy to Stellar mainnet for production use
3. **Advanced Features**: Add more complex business logic to your contract
4. **Testing**: Write comprehensive unit tests for your contract functions
5. **Monitoring**: Set up monitoring and logging for your deployed contract

## Useful Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)  
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar Explorer](https://stellar.expert/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)

---

**Security Note**: Never expose secret keys in production. Use environment variables, secure key management systems, or hardware wallets for production deployments.