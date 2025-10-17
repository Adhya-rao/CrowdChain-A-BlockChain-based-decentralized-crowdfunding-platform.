# 🪙 CrowdChain — A Decentralized Crowdfunding Platform

**Tech Stack:** Next.js | Solidity | Ethereum | Tailwind CSS | IPFS

CrowdChain is a next-generation decentralized crowdfunding platform built using **Next.js**, **Solidity**, and **Wagmi**.
It enables campaign creators to raise funds securely, with **milestone-based releases** and **transparent tracking**, all powered by blockchain.

---

## ✨ Key Highlights

✅ **Decentralized:** All campaign data stored on-chain via smart contracts.
✅ **Milestone-Based Funding:** Funds released step-by-step as milestones are achieved.
✅ **Reward System:** Contributors earn rewards based on engagement.
✅ **Leaderboard:** Displays top contributors and trending campaigns.
✅ **Real-Time Notifications:** Instant feedback using `react-hot-toast`.
✅ **IPFS Integration:** Metadata and images stored using Pinata.
✅ **Secure & Transparent:** Smart contract-based end-to-end workflow.

---

## 🚀 How It Works

### For Campaign Creators

1. **Create Campaign** – Set title, description, target, and milestones.
2. **Upload Metadata** – Store campaign images on IPFS via Pinata.
3. **Launch & Promote** – Share your campaign publicly.
4. **Manage Milestones** – Release funds after each completed goal.
5. **Withdraw Funds** – Securely withdraw using smart contracts.

### For Contributors

1. **Browse Campaigns** – Explore active projects.
2. **Contribute ETH** – Direct transfer via smart contracts.
3. **Earn Rewards** – Gain tokens or badges for participation.
4. **Track Progress** – Monitor milestone completion.
5. **Claim Refunds** – Get refunds for failed campaigns.

---

## 🔁 Smart Contract Flow

* Campaigns are deployed with target and deadline.
* Each contribution recorded on-chain.
* If target met → creator releases milestones.
* If target not met → contributors claim refund.
* Platform collects minimal fees.

---

## 🧠 Tech Stack

| Category          | Tools Used                         |
| ----------------- | ---------------------------------- |
| **Frontend**      | Next.js, Tailwind CSS, React       |
| **Blockchain**    | Solidity, Hardhat, OpenZeppelin    |
| **Web3 Tools**    | Wagmi, RainbowKit, Ethers.js, Viem |
| **Storage**       | IPFS (Pinata)                      |
| **Notifications** | React Hot Toast                    |
| **Deployment**    | Vercel / Netlify                   |
| **Testing**       | Hardhat, Chai                      |

---

## 📂 Project Structure

```
Advance Crowd Funding
├── components
│   ├── Campaign
│   │   ├── CampaignCard.js
│   │   ├── CampaignDetails.js
│   │   └── CreateCampaignForm.js
│   ├── Dashboard
│   │   ├── DashboardStats.js
│   │   └── StatsCard.js
│   ├── Debug
│   │   └── ContractDebug.js
│   └── Layout
│       ├── Header.js
│       ├── Layout.js
│       └── Sidebar.js
├── constants
│   ├── abi.js
│   └── index.js
├── hooks
│   ├── useCampaignDetails.js
│   └── useContract.js
├── pages
│   ├── _app.js
│   ├── index.js
│   ├── admin.js
│   ├── contributions.js
│   ├── create-campaign.js
│   ├── dashboard.js
│   ├── my-campaigns.js
│   ├── net-rewards.js
│   ├── notifications.js
│   ├── campaign/[id].js
│   └── campaigns/index.js
├── public
│   ├── logo.png
│   └── 3d-cryptocurrency-rendering-design.jpg
├── styles
│   └── globals.css
├── utils
│   ├── helpers.js
│   └── ipfs.js
├── web3
│   ├── contracts/CrowdfundingMarketplace.sol
│   ├── scripts/deploy.js
│   ├── hardhat.config.js
│   ├── HARDHAT_SetUp.txt
│   ├── package.json
│   └── artifacts/
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

---

## 🎯 Detailed Features

### Core Functionality

* Campaign creation (with or without milestones)
* Direct ETH contributions
* Automatic refunds for failed campaigns
* Reward system and leaderboard
* Real-time notifications

### Smart Contract Features

* **Reentrancy Protection** (OpenZeppelin’s `ReentrancyGuard`)
* **Pausable & Access Control** for admins
* **Event Logging** for transparency
* **Gas Optimization** for efficiency

### Frontend Features

* Responsive and mobile-friendly design
* Wallet integration via RainbowKit
* Dark mode support
* Error boundaries and smooth UI loading states

### Admin Features

* Campaign activation/deactivation
* Emergency refund handling
* Fee management
* Smart contract pause/resume controls

---

## 📜 Smart Contract Overview

**File:** `CrowdfundingMarketplace.sol`
**Language:** Solidity ^0.8.19
**Framework:** Hardhat

### Key Functions

| Category                | Function                                                  | Description               |
| ----------------------- | --------------------------------------------------------- | ------------------------- |
| **Campaign Management** | `createCampaign()`, `createCampaignWithMilestones()`      | Create campaigns          |
| **Admin Controls**      | `deactivateCampaign()`, `reactivateCampaign()`            | Manage campaigns          |
| **Contributions**       | `contributeToCampaign()`, `getRefund()`, `claimRewards()` | Handle funds & rewards    |
| **Milestones**          | `releaseMilestone()`                                      | Release partial funds     |
| **Analytics**           | `getCampaignStats()`, `getTopContributors()`              | Fetch dashboard data      |
| **Security**            | `pause()`, `unpause()`, `withdrawFees()`                  | Emergency + admin actions |

---

## 🖥️ Frontend Pages

| Type                       | Page                                                                                | Description                    |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------------------------ |
| **Public**                 | Home, Campaigns, Campaign Details                                                   | Open access pages              |
| **User (Wallet Required)** | Dashboard, Create Campaign, My Campaigns, Contributions, Net Rewards, Notifications | Wallet-connected pages         |
| **Admin**                  | Admin Dashboard                                                                     | Manage platform-level controls |

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js 18+
* npm or yarn
* MetaMask or Web3 wallet
* Git

### 1️⃣ Clone & Install

```bash
git clone <repository-url>
cd "Advance Crowd Funding"
npm install
```

### 2️⃣ Environment Setup (`.env.local`)

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key
NEXT_PUBLIC_ADMIN_ADDRESS=your_admin_wallet_address
```

For **Holesky Testnet**:

```env
NEXT_PUBLIC_RPC_URL=https://ethereum-holesky.publicnode.com
NEXT_PUBLIC_CHAIN_ID=17000
NEXT_PUBLIC_CHAIN_NAME=Holesky
NEXT_PUBLIC_BLOCK_EXPLORER=https://holesky.etherscan.io
```

### 3️⃣ Run Locally

```bash
# Start Hardhat node
cd web3
npm run node

# Deploy contracts
npm run deploy-local

# Start frontend
cd ..
npm run dev
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

**Frontend:**

```bash
npm run build
npm run start
```

**Smart Contracts:**

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make changes and test
4. Commit and push
5. Open a pull request

**Guidelines:**

* Follow ESLint + Prettier
* Write smart contract tests
* Use conventional commits
* Test on both light/dark modes

---

## 📄 License

Licensed under the **MIT License**

---

## 🙏 Acknowledgments

* OpenZeppelin for smart contract libraries
* RainbowKit for wallet integration
* Pinata for IPFS hosting
* Ethereum community for developer support

---
<img width="992" height="874" alt="Image" src="https://github.com/user-attachments/assets/adfd0a70-58fa-499e-be60-34fa227f4679" />


<img width="992" height="874" alt="Image" src="https://github.com/user-attachments/assets/02543fa1-95e3-4010-bc06-dc4d814fb44c" />


<img width="1092" height="1194" alt="Image" src="https://github.com/user-attachments/assets/3daf31ef-ca1d-4305-96ee-bbef8c15fb3e" />


<img width="992" height="874" alt="Image" src="https://github.com/user-attachments/assets/233bd7e8-f2e9-4c3a-aab6-b14ad41bce3a" />

<img width="1092" height="1643" alt="Image" src="https://github.com/user-attachments/assets/503ce10b-ab67-4e6b-97a2-e2b69f50b93c" />


<img width="992" height="874" alt="Image" src="https://github.com/user-attachments/assets/a6ddccef-e051-4f49-985f-f49ff03aea07" />


<img width="982" height="2715" alt="Image" src="https://github.com/user-attachments/assets/f8fcf45f-94d3-45da-a392-55cf178c3528" />
<img width="1229" height="2724" alt="Image" src="https://github.com/user-attachments/assets/c0b9a387-5dea-46e8-9919-a054d9062a34" />
<img width="1973" height="2425" alt="Image" src="https://github.com/user-attachments/assets/a325883a-b85e-4b52-b672-ad591e218f05" />
<img width="1092" height="2816" alt="Image" src="https://github.com/user-attachments/assets/2caaf3ce-6e96-43bd-b946-d64bb073fdd5" />
