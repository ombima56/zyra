#![no_std]
use soroban_sdk::{contract, contractimpl, Env, symbol_short, Address, contracterror};
use soroban_sdk::token::Client;

#[contract]
pub struct FundTransferContract;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InsufficientFunds = 1,
}

#[contractimpl]
impl FundTransferContract {
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> Result<(), Error> {
        from.require_auth();

        let token_address = env.storage().instance().get(&symbol_short!("token")).unwrap();
        let token = Client::new(&env, &token_address);

        let balance = token.balance(&from);
        if balance < amount {
            return Err(Error::InsufficientFunds);
        }

        token.transfer(&from, &to, &amount);

        let topics = (symbol_short!("transfer"), from, to);
        env.events().publish(topics, amount);

        Ok(())
    }

    pub fn balance(env: Env, address: Address) -> i128 {
        let token_address = env.storage().instance().get(&symbol_short!("token")).unwrap();
        let token = Client::new(&env, &token_address);
        token.balance(&address)
    }

    pub fn initialize(env: Env, token: Address) {
        env.storage().instance().set(&symbol_short!("token"), &token);
    }
}
