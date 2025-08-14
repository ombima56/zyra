#![cfg(test)]

mod test {
    use crate::{PaymentsContract, PaymentsContractClient};
    use soroban_sdk::{
        testutils::Address as AddressTestUtils,
        Address, Env,
    };

    fn create_payments_contract<'a>(env: &Env) -> (PaymentsContractClient<'a>, Address) {
        let contract_id = env.register(PaymentsContract, ());
        let client = PaymentsContractClient::new(env, &contract_id);
        (client, contract_id)
    }

    #[test]
    fn test_initialize_and_check_balance() {
        let env = Env::default();
        env.mock_all_auths();
        
        let (client, contract_id) = create_payments_contract(&env);
        let admin = Address::generate(&env);
        let token_admin = Address::generate(&env);
        
        // Register a token contract and get its address
        let token_contract_id = env.register_stellar_asset_contract_v2(token_admin.clone());
        let token_admin_client = soroban_sdk::token::StellarAssetClient::new(
            &env,
            &token_contract_id.address(),  // Use .address() to get Address
        );
        let token_client = soroban_sdk::token::Client::new(&env, &token_contract_id.address());
        
        // Initialize with the token address, not the contract wrapper
        client.initialize(&token_contract_id.address(), &admin);

        let user = Address::generate(&env);

        // Deposit tokens as admin, using the admin client
        token_admin_client.mint(&admin, &1000);
        token_client.transfer(&admin, &contract_id, &1000);

        // Check initial balances using the regular client
        assert_eq!(token_client.balance(&user), 0);
        assert_eq!(token_client.balance(&contract_id), 1000);

        // Transfer from contract to user using your payments contract's transfer method
        client.transfer(&contract_id, &user, &100);

        // Check new balances
        assert_eq!(token_client.balance(&user), 100);
        assert_eq!(token_client.balance(&contract_id), 900);
    }

    #[test]
    fn test_deposit() {
        let env = Env::default();
        env.mock_all_auths();
        
        let (client, _contract_id) = create_payments_contract(&env);

        let admin = Address::generate(&env);
        let token_admin = Address::generate(&env);
        let token_contract_id = env.register_stellar_asset_contract_v2(token_admin.clone());
        let token_admin_client = soroban_sdk::token::StellarAssetClient::new(
            &env,
            &token_contract_id.address(),  // Use .address() to get Address
        );
        let token_client = soroban_sdk::token::Client::new(&env, &token_contract_id.address());

        // Initialize with the token address
        client.initialize(&token_contract_id.address(), &admin);

        let depositor = Address::generate(&env);

        // Test a successful deposit from admin
        client.deposit(&depositor, &100);

        // Check that the depositor's balance has increased
        assert_eq!(token_client.balance(&depositor), 100);
    }

    #[test]
    #[should_panic(expected = "Deposit amount is below the minimum allowed")]
    fn test_deposit_below_minimum() {
        let env = Env::default();
        env.mock_all_auths();
        
        let (client, _contract_id) = create_payments_contract(&env);
        let admin = Address::generate(&env);
        let token_admin = Address::generate(&env);
        let token_contract_id = env.register_stellar_asset_contract_v2(token_admin.clone());

        // Initialize with the token address
        client.initialize(&token_contract_id.address(), &admin);
        let depositor = Address::generate(&env);

        // This should panic due to amount being below minimum
        client.deposit(&depositor, &40);
    }
}
