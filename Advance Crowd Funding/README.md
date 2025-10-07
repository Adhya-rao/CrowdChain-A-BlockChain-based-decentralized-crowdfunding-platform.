

# 🪙 CrowdChain — A Decentralized Crowdfunding Platform

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)](https://ethereum.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=IPFS&logoColor=white)](https://ipfs.io/)

**CrowdChain** is a next-generation **decentralized crowdfunding platform** built using **Next.js**, **Solidity**, and **Wagmi**.
It enables campaign creators to raise funds securely, with milestone-based releases and transparent tracking — all powered by blockchain.

---

## ✨ Key Highlights

✅ **Decentralized** — All campaign data is stored on-chain using smart contracts.  
✅ **Milestone-Based Funding** — Funds are released step-by-step as milestones are achieved.  
✅ **Reward System** — Contributors earn rewards based on contributions and engagement.  
✅ **Leaderboard** — Displays top contributors and high-performing campaigns.  
✅ **Real-Time Notifications** — Instant feedback for all actions using react-hot-toast.  
✅ **IPFS Integration** — Metadata and campaign images are stored using **Pinata**.  
✅ **Secure & Transparent** — End-to-end smart contract integration with Ethereum blockchain.  

---

## 🚀 How It Works

CrowdChain revolutionizes crowdfunding by leveraging blockchain technology to ensure transparency, security, and trust. Here's the core workflow:

### For Campaign Creators:
1. **Create Campaign** — Set up your campaign with title, description, target amount, and optional milestones.
2. **Upload Metadata** — Store campaign images and details on IPFS via Pinata.
3. **Launch & Promote** — Share your campaign with the community.
4. **Milestone Management** — Release funds incrementally as project goals are met.
5. **Withdraw Funds** — Access raised funds securely through smart contract functions.

### For Contributors:
1. **Browse Campaigns** — Explore active campaigns on the platform.
2. **Contribute** — Send ETH directly to campaigns via smart contracts.
3. **Earn Rewards** — Receive tokens or badges for your contributions.
4. **Track Progress** — Monitor milestone achievements and fund releases.
5. **Claim Refunds** — Get your money back if a campaign fails to meet its target.

### Smart Contract Flow:
- Campaigns are created with a target amount and deadline.
- Contributions are recorded on-chain with contributor details.
- If target is met, creator can release milestones or withdraw full amount.
- If target is not met, contributors can claim refunds.
- Platform fees are collected for campaign creation.

---

## 🧠 Tech Stack

| Layer             | Technology                   |
| ----------------- | ---------------------------- |
| **Frontend**      | Next.js, Tailwind CSS, React |
| **Blockchain**    | Solidity, Hardhat, OpenZeppelin |
| **Web3 Tools**    | Wagmi, RainbowKit, Ethers.js, Viem |
| **Storage**       | IPFS (Pinata)                |
| **Notifications** | React Hot Toast              |
| **Deployment**    | Vercel / Netlify             |
| **Testing**       | Hardhat, Chai                |

---

## 📂 Project Structure

```
Advance Crowd Funding/
├── components/
│   ├── Campaign/
│   │   ├── CampaignCard.js          # Campaign preview card
│   │   ├── CampaignDetails.js       # Detailed campaign view
│   │   └── CreateCampaignForm.js    # Form for creating campaigns
│   ├── Dashboard/
│   │   ├── DashboardStats.js        # Dashboard statistics
│   │   └── StatsCard.js             # Individual stat card
│   ├── Debug/
│   │   └── ContractDebug.js         # Contract debugging tools
│   └── Layout/
│       ├── GlobalErrorBoundary.js   # Error handling
│       ├── Header.js                # App header with navigation
│       ├── Layout.js                # Main layout wrapper
│       └── Sidebar.js               # Navigation sidebar
├── constants/
│   ├── abi.js                       # Smart contract ABI
│   └── index.js                     # App constants
├── hooks/
│   ├── useCampaignDetails.js        # Campaign data hook
│   └── useContract.js               # Contract interaction hook
├── pages/
│   ├── _app.js                      # Next.js app wrapper
│   ├── index.js                     # Landing page
│   ├── admin.js                     # Admin dashboard
│   ├── contributions.js             # User's contributions
│   ├── create-campaign.js           # Campaign creation page
│   ├── dashboard.js                 # User dashboard
│   ├── my-campaigns.js              # User's created campaigns
│   ├── net-rewards.js               # Rewards page
│   ├── notifications.js             # Notifications page
│   ├── campaign/
│   │   └── [id].js                  # Individual campaign page
│   └── campaigns/
│       └── index.js                 # Campaigns listing page
├── public/
│   ├── logo.png                     # App logo
│   └── 3d-cryptocurrency-rendering-design.jpg  # Hero background
├── styles/
│   └── globals.css                  # Global styles
├── utils/
│   ├── helpers.js                   # Utility functions
│   └── ipfs.js                      # IPFS upload utilities
├── web3/
│   ├── contracts/
│   │   └── CrowdfundingMarketplace.sol  # Main smart contract
│   ├── scripts/
│   │   └── deploy.js                # Deployment script
│   ├── HARDHAT_SetUp.txt            # Hardhat setup guide
│   ├── hardhat.config.js            # Hardhat configuration
│   ├── package.json                 # Web3 dependencies
│   └── artifacts/                   # Compiled contracts
├── .env.local                       # Environment variables
├── .gitignore                       # Git ignore rules
├── next.config.js                   # Next.js configuration
├── package.json                     # Frontend dependencies
├── postcss.config.js                # PostCSS config
├── README.md                        # This file
└── tailwind.config.js               # Tailwind CSS config
```

---

## 🎯 Detailed Features

### Core Functionality
- **Campaign Creation**: Create campaigns with or without milestones
- **Secure Contributions**: Direct ETH transfers via smart contracts
- **Milestone Management**: Step-by-step fund releases
- **Automatic Refunds**: Failed campaigns return funds to contributors
- **Reward System**: Contributors earn tokens/badges
- **Leaderboard**: Top contributors ranking
- **Real-time Notifications**: Toast notifications for all actions

### Smart Contract Features
- **Reentrancy Protection**: Using OpenZeppelin's ReentrancyGuard
- **Pausable**: Emergency pause functionality
- **Access Control**: Owner-only admin functions
- **Event Logging**: Comprehensive event emission for transparency
- **Gas Optimization**: Efficient storage and function design

### Frontend Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Wallet Integration**: RainbowKit for seamless wallet connection
- **Dark Mode**: Theme switching capability
- **Error Boundaries**: Graceful error handling
- **Loading States**: Smooth UX with loading indicators
- **Form Validation**: Client-side validation for all forms

### Admin Features
- **Campaign Management**: Activate/deactivate campaigns
- **Emergency Refunds**: Admin-controlled refunds
- **Fee Management**: Withdraw platform fees
- **Contract Pause**: Emergency stop functionality

---

## 📋 Smart Contract Overview

The `CrowdfundingMarketplace.sol` contract is the backbone of CrowdChain, built with Solidity 0.8.19 and OpenZeppelin libraries.

### Key Functions:

#### Campaign Management
- `createCampaign()` — Create a standard campaign
- `createCampaignWithMilestones()` — Create campaign with milestone breakdown
- `deactivateCampaign()` / `reactivateCampaign()` — Admin campaign control

#### Contribution System
- `contributeToCampaign()` — Make a contribution
- `getRefund()` — Claim refund for failed campaigns
- `claimRewards()` — Claim contributor rewards

#### Milestone System
- `releaseMilestone()` — Release funds for completed milestones
- `getCampaignMilestones()` — View milestone details

#### View Functions
- `getCampaign()` — Get campaign details
- `getActiveCampaigns()` — Paginated campaign listing
- `getTopContributors()` — Leaderboard data
- `getCampaignStats()` — Campaign analytics

#### Admin Functions
- `withdrawFees()` — Withdraw platform fees
- `emergencyWithdraw()` — Emergency fund withdrawal
- `pause()` / `unpause()` — Contract pause controls

### Security Features:
- Reentrancy protection
- Input validation
- Access control (Ownable)
- Emergency pause functionality
- Overflow protection (Solidity 0.8+)

---

## 🖥️ Frontend Pages Overview

### Public Pages
- **Home (`/`)** — Landing page with features and stats
- **Campaigns (`/campaigns`)** — Browse all active campaigns
- **Campaign Details (`/campaign/[id]`)** — Individual campaign page

### User Pages (Require Wallet Connection)
- **Dashboard (`/dashboard`)** — User overview with stats
- **Create Campaign (`/create-campaign`)** — Campaign creation form
- **My Campaigns (`/my-campaigns`)** — User's created campaigns
- **Contributions (`/contributions`)** — User's contribution history
- **Net Rewards (`/net-rewards`)** — Rewards and earnings
- **Notifications (`/notifications`)** — Activity notifications

### Admin Pages
- **Admin (`/admin`)** — Administrative controls

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Git

### 1️⃣ Clone and Install Dependencies

```bash
git clone <repository-url>
cd "Advance Crowd Funding"
npm install
```

### 2️⃣ Environment Setup (.env.local)

Create a `.env.local` file in the root directory:

```env
# WalletConnect (for RainbowKit)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Network Configuration (Local Development)
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_CHAIN_NAME=Localhost
NEXT_PUBLIC_NETWORK=localhost

# Contract Address (after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address

# IPFS (Pinata)
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt

# Admin Configuration
NEXT_PUBLIC_ADMIN_ADDRESS=your_admin_wallet_address
```

#### For Holesky Testnet:
```env
NEXT_PUBLIC_RPC_URL=https://ethereum-holesky.publicnode.com
NEXT_PUBLIC_CHAIN_ID=17000
NEXT_PUBLIC_CHAIN_NAME=Holesky
NEXT_PUBLIC_BLOCK_EXPLORER=https://holesky.etherscan.io
```

### 3️⃣ Smart Contract Setup

Navigate to the web3 directory:

```bash
cd web3
npm install
```

Configure Hardhat network in `hardhat.config.js` if needed.

### 4️⃣ Deploy Contracts (Local Development)

Start local Hardhat node:

```bash
npm run node
```

In another terminal, deploy contracts:

```bash
npm run deploy-local
```

Copy the deployed contract address to your `.env.local` file.

---

## 🔨 Run the App Locally

1️⃣ **Start the development server:**

```bash
npm run dev
```

2️⃣ **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

3️⃣ **Connect your wallet:**

Use MetaMask or another Web3 wallet to connect to the application.

---

## 🚀 Deployment

### Frontend Deployment
Deploy to Vercel, Netlify, or any static hosting service:

```bash
npm run build
npm run start
```

### Smart Contract Deployment
For testnet/mainnet deployment, update `hardhat.config.js` with your network settings and private key, then:

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly** — Run tests and ensure no breaking changes
5. **Commit your changes:** `git commit -m 'Add some feature'`
6. **Push to the branch:** `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write comprehensive tests for smart contracts
- Use conventional commit messages
- Ensure mobile responsiveness
- Test on multiple wallets/browsers

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenZeppelin** for secure smart contract libraries
- **RainbowKit** for seamless wallet integration
- **Pinata** for IPFS hosting
- **Ethereum Community** for the robust blockchain infrastructure

---

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Join our Discord community
- Check the documentation

---

✅ **CrowdChain** combines blockchain transparency with real-world crowdfunding usability — enabling secure, milestone-driven, and community-powered funding.


