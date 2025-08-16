#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address, Symbol};

#[contract]
pub struct PaymentsContract;

#[contractimpl]
impl PaymentsContract {
    // Initialize the contract with the token address
    pub fn initialize(env: Env, token: Address, admin: Address) {
        env.storage().instance().set(&Symbol::new(&env, "token"), &token);
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);
    }

    // Transfer tokens from the sender to a recipient
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

    /**
     * - Deposit tokens into the contract. Only the admin can call this function.
     * - This function will mint tokens and add them to the contract's balance.
     * - The `depositor` parameter should be the address that the tokens are for,
     * - and the `amount` parameter is the amount of tokens to deposit.
     */
    pub fn deposit(env: Env, depositor: Address, amount: i128) {
        let admin: soroban_sdk::Address = env.storage().instance().get(&Symbol::new(&env, "admin")).unwrap();
        admin.require_auth();
        
        if amount <= 0 {
            panic!("Deposit amount must be a positive number.");
        }
    
        let min_deposit_amount: i128 = 50;
        if amount < min_deposit_amount {
            panic!("Deposit amount is below the minimum allowed.");
        }
    
        let token_address = env.storage().instance().get(&Symbol::new(&env, "token")).unwrap();
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);
        
        // Transfer from depositor to the contract
        let contract_address = env.current_contract_address();
        token_client.transfer(&depositor, &contract_address, &amount);
    }

    // Get the balance of a user
    pub fn balance(env: Env, user: Address) -> i128 {
        let token_address = env.storage().instance().get(&Symbol::new(&env, "token"))
            .expect("Token address not set. The contract must be initialized.");
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);
        token_client.balance(&user)
    }
}
