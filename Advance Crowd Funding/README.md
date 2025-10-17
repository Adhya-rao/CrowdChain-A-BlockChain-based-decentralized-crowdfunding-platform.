
🪙 CrowdChain — A Decentralized Crowdfunding Platform

Next.js | Solidity | Ethereum | Tailwind CSS | IPFS

CrowdChain is a next-generation decentralized crowdfunding platform built using Next.js, Solidity, and Wagmi.
It enables campaign creators to raise funds securely, with milestone-based releases and transparent tracking — all powered by blockchain.

---

✨ Key Highlights

✅ Decentralized — All campaign data is stored on-chain using smart contracts.
✅ Milestone-Based Funding — Funds are released step-by-step as milestones are achieved.
✅ Reward System — Contributors earn rewards based on contributions and engagement.
✅ Leaderboard — Displays top contributors and high-performing campaigns.
✅ Real-Time Notifications — Instant feedback for all actions using react-hot-toast.
✅ IPFS Integration — Metadata and campaign images are stored using Pinata.
✅ Secure & Transparent — End-to-end smart contract integration with Ethereum blockchain.

---

🚀 How It Works

CrowdChain revolutionizes crowdfunding by leveraging blockchain technology to ensure transparency, security, and trust.

For Campaign Creators:

1. Create Campaign — Set up your campaign with title, description, target amount, and optional milestones.
2. Upload Metadata — Store campaign images and details on IPFS via Pinata.
3. Launch & Promote — Share your campaign with the community.
4. Milestone Management — Release funds incrementally as project goals are met.
5. Withdraw Funds — Access raised funds securely through smart contract functions.

For Contributors:

1. Browse Campaigns — Explore active campaigns on the platform.
2. Contribute — Send ETH directly to campaigns via smart contracts.
3. Earn Rewards — Receive tokens or badges for your contributions.
4. Track Progress — Monitor milestone achievements and fund releases.
5. Claim Refunds — Get your money back if a campaign fails to meet its target.

Smart Contract Flow:

* Campaigns are created with a target amount and deadline.
* Contributions are recorded on-chain with contributor details.
* If target is met, creator can release milestones or withdraw full amount.
* If target is not met, contributors can claim refunds.
* Platform fees are collected for campaign creation.

---

🧠 Tech Stack

Frontend: Next.js, Tailwind CSS, React
Blockchain: Solidity, Hardhat, OpenZeppelin
Web3 Tools: Wagmi, RainbowKit, Ethers.js, Viem
Storage: IPFS (Pinata)
Notifications: React Hot Toast
Deployment: Vercel / Netlify
Testing: Hardhat, Chai

---

📂 Project Structure

Advance Crowd Funding
├── components
│   ├── Campaign
│   │   ├── CampaignCard.js — Campaign preview card
│   │   ├── CampaignDetails.js — Detailed campaign view
│   │   └── CreateCampaignForm.js — Form for creating campaigns
│   ├── Dashboard
│   │   ├── DashboardStats.js — Dashboard statistics
│   │   └── StatsCard.js — Individual stat card
│   ├── Debug
│   │   └── ContractDebug.js — Contract debugging tools
│   └── Layout
│       ├── GlobalErrorBoundary.js — Error handling
│       ├── Header.js — App header with navigation
│       ├── Layout.js — Main layout wrapper
│       └── Sidebar.js — Navigation sidebar
├── constants
│   ├── abi.js — Smart contract ABI
│   └── index.js — App constants
├── hooks
│   ├── useCampaignDetails.js — Campaign data hook
│   └── useContract.js — Contract interaction hook
├── pages
│   ├── _app.js — Next.js app wrapper
│   ├── index.js — Landing page
│   ├── admin.js — Admin dashboard
│   ├── contributions.js — User's contributions
│   ├── create-campaign.js — Campaign creation page
│   ├── dashboard.js — User dashboard
│   ├── my-campaigns.js — User's created campaigns
│   ├── net-rewards.js — Rewards page
│   ├── notifications.js — Notifications page
│   ├── campaign
│   │   └── [id].js — Individual campaign page
│   └── campaigns
│       └── index.js — Campaigns listing page
├── public
│   ├── logo.png — App logo
│   └── 3d-cryptocurrency-rendering-design.jpg — Hero background
├── styles
│   └── globals.css — Global styles
├── utils
│   ├── helpers.js — Utility functions
│   └── ipfs.js — IPFS upload utilities
├── web3
│   ├── contracts
│   │   └── CrowdfundingMarketplace.sol — Main smart contract
│   ├── scripts
│   │   └── deploy.js — Deployment script
│   ├── HARDHAT_SetUp.txt — Hardhat setup guide
│   ├── hardhat.config.js — Hardhat configuration
│   ├── package.json — Web3 dependencies
│   └── artifacts — Compiled contracts
├── .env.local — Environment variables
├── .gitignore — Git ignore rules
├── next.config.js — Next.js configuration
├── package.json — Frontend dependencies
├── postcss.config.js — PostCSS config
├── README.md — This file
└── tailwind.config.js — Tailwind CSS config

---

🎯 Detailed Features

Core Functionality

* Campaign Creation: Create campaigns with or without milestones
* Secure Contributions: Direct ETH transfers via smart contracts
* Milestone Management: Step-by-step fund releases
* Automatic Refunds: Failed campaigns return funds to contributors
* Reward System: Contributors earn tokens or badges
* Leaderboard: Top contributors ranking
* Real-time Notifications: Toast notifications for all actions

Smart Contract Features

* Reentrancy Protection: Using OpenZeppelin’s ReentrancyGuard
* Pausable: Emergency pause functionality
* Access Control: Owner-only admin functions
* Event Logging: Comprehensive event emission for transparency
* Gas Optimization: Efficient storage and function design

Frontend Features

* Responsive Design: Mobile-first with Tailwind CSS
* Wallet Integration: RainbowKit for wallet connection
* Dark Mode: Theme switching
* Error Boundaries: Graceful error handling
* Loading States: Smooth user experience
* Form Validation: Client-side validation

Admin Features

* Campaign Management: Activate or deactivate campaigns
* Emergency Refunds: Admin-controlled refunds
* Fee Management: Withdraw platform fees
* Contract Pause: Emergency stop functionality

---

📋 Smart Contract Overview

CrowdfundingMarketplace.sol is the main contract built using Solidity 0.8.19 and OpenZeppelin.

Key Functions

Campaign Management
createCampaign — Create a standard campaign
createCampaignWithMilestones — Create campaign with milestone breakdown
deactivateCampaign / reactivateCampaign — Admin campaign control

Contribution System
contributeToCampaign — Make a contribution
getRefund — Claim refund for failed campaigns
claimRewards — Claim contributor rewards

Milestone System
releaseMilestone — Release funds for completed milestones
getCampaignMilestones — View milestone details

View Functions
getCampaign — Get campaign details
getActiveCampaigns — Paginated campaign listing
getTopContributors — Leaderboard data
getCampaignStats — Campaign analytics

Admin Functions
withdrawFees — Withdraw platform fees
emergencyWithdraw — Emergency fund withdrawal
pause / unpause — Contract pause controls

Security Features

* Reentrancy protection
* Input validation
* Access control
* Emergency pause functionality
* Overflow protection

---

🖥️ Frontend Pages Overview

Public Pages
Home — Landing page with features and stats
Campaigns — Browse all active campaigns
Campaign Details — Individual campaign page

User Pages (Require Wallet Connection)
Dashboard — User overview with stats
Create Campaign — Campaign creation form
My Campaigns — User's created campaigns
Contributions — User's contribution history
Net Rewards — Rewards and earnings
Notifications — Activity notifications

Admin Pages
Admin — Administrative controls

---

⚙️ Setup Instructions

Prerequisites
Node.js 18+
npm or yarn
MetaMask or any Web3 wallet
Git

1. Clone and Install Dependencies
   git clone <repository-url>
   cd Advance Crowd Funding
   npm install

2. Environment Setup (.env.local)
   Create a .env.local file and add the following:

NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_RPC_URL=[http://localhost:8545](http://localhost:8545)
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_CHAIN_NAME=Localhost
NEXT_PUBLIC_NETWORK=localhost
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_ADMIN_ADDRESS=your_admin_wallet_address

For Holesky Testnet:
NEXT_PUBLIC_RPC_URL=[https://ethereum-holesky.publicnode.com](https://ethereum-holesky.publicnode.com)
NEXT_PUBLIC_CHAIN_ID=17000
NEXT_PUBLIC_CHAIN_NAME=Holesky
NEXT_PUBLIC_BLOCK_EXPLORER=[https://holesky.etherscan.io](https://holesky.etherscan.io)

🧠 Run the App Locally
Step 1 — Go to the web3 folder
cd "c:/Users/HP/Downloads/Ganesha-notifi-nftreward-leader-milestone/Advance Crowd Funding/web3"

Step 2 — Start the local Hardhat node
npm run node

Step 3 — Deploy the contracts locally (in a split terminal)
npm run deploy-local

Step 4 — Return to the main frontend folder
cd ..

Step 5 — Start the Next.js development server
npm run dev


Then open 👉 http://localhost:3000
 in your browser.

🚀 Deployment

Frontend Deployment
npm run build
npm run start

Smart Contract Deployment
npx hardhat run scripts/deploy.js --network <network-name>

---

🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make changes
4. Test thoroughly
5. Commit and push
6. Open a Pull Request

Development Guidelines

* Follow ESLint and Prettier
* Write smart contract tests
* Use conventional commits
* Ensure mobile responsiveness
* Test across wallets

---

📄 License
Licensed under the MIT License.

---

🙏 Acknowledgments
OpenZeppelin for secure smart contract libraries
RainbowKit for wallet integration
Pinata for IPFS hosting
Ethereum community for blockchain infrastructure

---

📞 Support
Open an issue on GitHub
Join the Discord community
Check the documentation

---

✅ CrowdChain combines blockchain transparency with real-world crowdfunding usability — enabling secure, milestone-driven, and community-powered funding.


