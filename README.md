# Zyra: Social Finance on WhatsApp

**Send money as easily as sending a message.**

Zyra is a next-generation social-finance platform that lets users seamlessly connect, chat, and transact, all within WhatsApp. Built on Stellar’s fast, low-cost blockchain, Zyra empowers anyone, anywhere to make payments, bridging the gap in financial accessibility across Africa.

## Getting Started

### Prerequisites

*   Node.js and npm
*   Rust and Soroban CLI
*   A WhatsApp Business Account and API access
*   A Lobstr wallet
*   Stellar SDK

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ombima56/zyra.git
    cd zyra
    ```

2.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    ```
3. ** Install stellar-sdk**
    ```bash
    npm install stellar-sdk
    ```

    Or if you use Yarn:

    ```bash
    yarn add stellar-sdk
    ```

3.  **Set up the database:**
    Generate Prisma node_module
    ```bash 
    npx prisma generate
    ```

    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Configure environment variables:**
    Create a `.env` file in the `frontend` directory and add your WhatsApp API credentials, database connection string, and other necessary keys.

5.  **Run the application:**
    ```bash
    npm run dev
    ```

## How It Works

Zyra uses a simple, command-based interface within WhatsApp. Users can connect their Lobstr wallet and begin transacting immediately.

1.  **Onboard:** Register your phone number and link your Lobstr wallet via WhatsApp.
2.  **Transact:** Use simple commands like `/send`, `/balance`, and `/history`.
3.  **Confirm:** Transactions are processed instantly on the Stellar network via Soroban smart contracts.

<!-- ## Project Status

This project is currently at the **MVP 1** stage. The primary goal is to prove the foundational use case of sending and receiving money via WhatsApp using Soroban smart contracts and Lobstr Wallet. -->

<!-- ## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue to discuss proposed changes.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->