#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

#[contract]
pub struct PaymentsContract;

#[contractimpl]
impl PaymentsContract {
    // Initialize the contract with the token address
    pub fn initialize(env: Env, token: Address, admin: Address) {
        env.storage()
            .instance()
            .set(&Symbol::new(&env, "token"), &token);
        env.storage()
            .instance()
            .set(&Symbol::new(&env, "admin"), &admin);
    }

    // Enhanced transfer function with better validation and logging
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();

        if amount <= 0 {
            panic!("Amount must be greater than zero.");
        }

        // Prevent self-transfer.
        if from == to {
            panic!("Cannot transfer to yourself.");
        }

        // Get token contract
        let token_address = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "token"))
            .expect("Token address not set. Contract must be initialized.");
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);

        // Check sender has sufficient balance
        let sender_balance = token_client.balance(&from);
        if sender_balance < amount {
            panic!("Insufficient balance for transfer.");
        }

        // Perform the transfer
        token_client.transfer(&from, &to, &amount);

    }

    // Deposit function for admin
    pub fn deposit(env: Env, depositor: Address, amount: i128) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "admin"))
            .unwrap();
        admin.require_auth();

        if amount <= 0 {
            panic!("Deposit amount must be a positive number.");
        }

        // 0.5 tokens = 0.5 * 10^7 = 5000000 stroops
        let min_deposit_amount: i128 = 5_000_000; // 0.5 tokens in stroops (7 decimals)
        if amount < min_deposit_amount {
            panic!("Deposit amount is below the minimum allowed (0.5 tokens).");
        }

        let token_address = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "token"))
            .unwrap();
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);

        // Transfer from depositor to the contract
        let contract_address = env.current_contract_address();
        token_client.transfer(&depositor, &contract_address, &amount);

    }

    // Get the balance of a user account using the token contract
    pub fn balance(env: Env, user: Address) -> i128 {
        let token_address = env.storage().instance().get(&Symbol::new(&env, "token"));

        match token_address {
            Some(token_addr) => {
                let token_client = soroban_sdk::token::Client::new(&env, &token_addr);
                token_client.balance(&user)
            }
            None => {
                0
            }
        }
    }

    // Additional helper function: Check if transfer is possible
    pub fn can_transfer(env: Env, from: Address, amount: i128) -> bool {
        if amount <= 0 {
            return false;
        }

        let token_address = env.storage().instance().get(&Symbol::new(&env, "token"));
        if token_address.is_none() {
            return false;
        }

        let token_client = soroban_sdk::token::Client::new(&env, &token_address.unwrap());
        let balance = token_client.balance(&from);

        balance >= amount
    }

    // Get contract's own token balance using the token contract
    pub fn contract_balance(env: Env) -> i128 {
        let token_address = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "token"))
            .expect("Token address not set. The contract must be initialized.");
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);
        let contract_address = env.current_contract_address();
        token_client.balance(&contract_address)
    }

    // Withdraw function for admin
    pub fn withdraw(env: Env, to: Address, amount: i128) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "admin"))
            .unwrap();
        admin.require_auth();

        if amount <= 0 {
            panic!("Withdrawal amount must be positive.");
        }

        let token_address = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "token"))
            .unwrap();
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);
        let contract_address = env.current_contract_address();

        // Check contract has sufficient balance
        let contract_balance = token_client.balance(&contract_address);
        if contract_balance < amount {
            panic!("Insufficient contract balance for withdrawal.");
        }

        // Transfer from contract to specified address
        token_client.transfer(&contract_address, &to, &amount);

    }
}
