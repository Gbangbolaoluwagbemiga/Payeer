# Payeer 🎡

Payeer is a sleek, modern, and on-chain bill-splitting application built on the **Stacks** blockchain. It provides a fun and transparent way to decide "who's paying" by letting a decentralized spinner wheel make the choice.


## 🌟 Features

- **Decentralized Randomness**: Add your friends and spin the wheel—powered by on-chain transparency.
- **On-Chain Recording**: Record the results of your splits forever on the Stacks blockchain.
- **Premium UI**: A "dope" dark-themed experience with glassmorphism, smooth animations, and a spinning 3D-effect wheel.
- **Wallet Integration**: Connect seamlessly with Leather or Xverse wallets using `@stacks/connect`.

## 🛠 Tech Stack

- **Frontend**: Next.js (TypeScript), Tailwind CSS.
- **Blockchain**: Stacks (Clarity 4).
- **Libraries**: `@stacks/transactions`, `@stacks/connect`, `@stacks/network`.

## 🚀 Live on Mainnet

The Payeer smart contract is live and confirmed on the Stacks mainnet.

- **Contract Address**: `SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK.payeer`
- **Explorer Link**: [View on Hiro Explorer](https://explorer.hiro.so/txid/0x8600893e44182e4c73c63eaaa211de716a1997adc8dddacaea17efb81e4d4b79?chain=mainnet)

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Gbangbolaoluwagbemiga/Payeer
   cd Payeer
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

3. **Smart Contract (Optional)**:
   The contract is already deployed, but you can explore it in `backend/contracts/payeer.clar`. If you have [Clarinet](https://github.com/hirosystems/clarinet) installed:
   ```bash
   cd backend
   clarinet check
   ```

## 🔒 Security

This project follows best practices for Bitcoin-layer development:
- Private keys and mnemonics are strictly managed via environment variables and never committed to version control.
- All on-chain interactions are signed locally by the user.

## 📄 License

MIT
