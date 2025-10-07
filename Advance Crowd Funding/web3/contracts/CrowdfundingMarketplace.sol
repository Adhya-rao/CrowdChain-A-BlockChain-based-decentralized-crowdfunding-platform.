// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CrowdfundingMarketplace
 * @dev A decentralized crowdfunding platform with campaign management and commission system
 */
contract CrowdfundingMarketplace is ReentrancyGuard, Ownable, Pausable {
    
    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 targetAmount,
        uint256 deadline,
        string metadataHash
    );
    
    event ContributionMade(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );
    
    event CampaignFunded(
        uint256 indexed campaignId,
        uint256 totalRaised
    );
    
    event RefundIssued(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );
    
    event CampaignWithdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );
    
    event FeesWithdrawn(
        address indexed admin,
        uint256 amount
    );
    
    event CommissionUpdated(
        uint256 oldCommission,
        uint256 newCommission
    );

    event MilestoneCreated(uint256 indexed campaignId, uint256 indexed milestoneIndex, uint256 amount);
    event MilestoneReleased(uint256 indexed campaignId, uint256 indexed milestoneIndex, uint256 amount);
    
    // Structs
    struct Campaign {
        uint256 id;
        address payable creator;
        string title;
        string description;
        string metadataHash; // IPFS hash for images and additional data
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 deadline;
        bool withdrawn;
        bool active;
        uint256 createdAt;
        uint256 contributorsCount;
    }

    struct Milestone {
        uint256 id;
        string title;
        string description;
        uint256 amount;       // wei
        uint256 releaseTime;  // optional unix timestamp (0 = no time lock)
        bool released;
    }

    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
    }

    struct Reward {
        uint256 id;
        uint256 amount;
        bool claimed;
    }
    
    // State variables
    uint256 public constant CAMPAIGN_CREATION_FEE = 1 ether;
    uint256 public totalFeesCollected;
    uint256 public campaignCounter;
    
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Milestone[]) public campaignMilestones;
    mapping(uint256 => uint256) public campaignReleasedAmount; // how much creator already withdrew for this campaign
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => Contribution[]) public campaignContributions;
    mapping(address => uint256[]) public userCampaigns;
    mapping(address => uint256[]) public userContributions;
    mapping(address => Reward[]) public userRewards;
    mapping(address => uint256) public totalContributions;
    address[] public allContributors;
    
    // Modifiers
    modifier validCampaign(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign ID");
        require(campaigns[_campaignId].active, "Campaign is not active");
        _;
    }
    
    modifier onlyCampaignCreator(uint256 _campaignId) {
        require(campaigns[_campaignId].creator == msg.sender, "Not campaign creator");
        _;
    }
    
    modifier campaignNotEnded(uint256 _campaignId) {
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign has ended");
        _;
    }
    
    modifier campaignEnded(uint256 _campaignId) {
        require(block.timestamp >= campaigns[_campaignId].deadline, "Campaign still active");
        _;
    }
    
    constructor() {}
    
    /**
     * @dev Create a new crowdfunding campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _metadataHash IPFS hash containing images and metadata
     * @param _targetAmount Target funding amount in wei
     * @param _duration Campaign duration in seconds
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _metadataHash,
        uint256 _targetAmount,
        uint256 _duration
    ) external payable whenNotPaused nonReentrant {
        require(msg.value >= CAMPAIGN_CREATION_FEE, "Insufficient campaign creation fee");
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_metadataHash).length > 0, "Metadata hash cannot be empty");
        
        campaignCounter++;
        uint256 deadline = block.timestamp + _duration;
        
        campaigns[campaignCounter] = Campaign({
            id: campaignCounter,
            creator: payable(msg.sender),
            title: _title,
            description: _description,
            metadataHash: _metadataHash,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            deadline: deadline,
            withdrawn: false,
            active: true,
            createdAt: block.timestamp,
            contributorsCount: 0
        });
        
        userCampaigns[msg.sender].push(campaignCounter);
        totalFeesCollected += CAMPAIGN_CREATION_FEE;
        
        // Refund excess fee
        if (msg.value > CAMPAIGN_CREATION_FEE) {
            payable(msg.sender).transfer(msg.value - CAMPAIGN_CREATION_FEE);
        }
        
        emit CampaignCreated(
            campaignCounter,
            msg.sender,
            _targetAmount,
            deadline,
            _metadataHash
        );
    }

    /**
     * @dev Create a new crowdfunding campaign with milestones
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _metadataHash IPFS hash containing images and metadata
     * @param _targetAmount Target funding amount in wei
     * @param _duration Campaign duration in seconds
     * @param _milestoneAmounts Array of milestone amounts in wei
     * @param _milestoneTitles Array of milestone titles
     * @param _milestoneDescriptions Array of milestone descriptions
     * @param _milestoneReleaseTimes Array of milestone release times (0 for no lock)
     */
    function createCampaignWithMilestones(
        string memory _title,
        string memory _description,
        string memory _metadataHash,
        uint256 _targetAmount,
        uint256 _duration,
        uint256[] memory _milestoneAmounts,
        string[] memory _milestoneTitles,
        string[] memory _milestoneDescriptions,
        uint256[] memory _milestoneReleaseTimes
    ) external payable whenNotPaused nonReentrant {
        require(msg.value >= CAMPAIGN_CREATION_FEE, "Insufficient campaign creation fee");
        require(_targetAmount > 0, "Target must be > 0");
        require(_duration > 0, "Duration must be > 0");
        require(_milestoneAmounts.length > 0, "Add at least one milestone");
        require(_milestoneAmounts.length == _milestoneTitles.length &&
                _milestoneAmounts.length == _milestoneDescriptions.length &&
                _milestoneAmounts.length == _milestoneReleaseTimes.length,
                "Milestones arrays length mismatch");

        // total check
        uint256 sum = 0;
        for (uint i = 0; i < _milestoneAmounts.length; i++) {
            sum += _milestoneAmounts[i];
        }
        require(sum == _targetAmount, "Milestones total must equal target");

        // create campaign (same as before)
        campaignCounter++;
        uint256 deadline = block.timestamp + _duration;

        campaigns[campaignCounter] = Campaign({
            id: campaignCounter,
            creator: payable(msg.sender),
            title: _title,
            description: _description,
            metadataHash: _metadataHash,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            deadline: deadline,
            withdrawn: false,
            active: true,
            createdAt: block.timestamp,
            contributorsCount: 0
        });

        // store milestones
        for (uint i = 0; i < _milestoneAmounts.length; i++) {
            Milestone memory m = Milestone({
                id: i,
                title: _milestoneTitles[i],
                description: _milestoneDescriptions[i],
                amount: _milestoneAmounts[i],
                releaseTime: _milestoneReleaseTimes[i],
                released: false
            });
            campaignMilestones[campaignCounter].push(m);
            emit MilestoneCreated(campaignCounter, i, _milestoneAmounts[i]);
        }

        userCampaigns[msg.sender].push(campaignCounter);
        totalFeesCollected += CAMPAIGN_CREATION_FEE;

        if (msg.value > CAMPAIGN_CREATION_FEE) {
            payable(msg.sender).transfer(msg.value - CAMPAIGN_CREATION_FEE);
        }

        emit CampaignCreated(campaignCounter, msg.sender, _targetAmount, deadline, _metadataHash);
    }
    
    /**
     * @dev Contribute to a campaign
     * @param _campaignId Campaign ID to contribute to
     */
    function contributeToCampaign(uint256 _campaignId) 
        external 
        payable 
        validCampaign(_campaignId) 
        campaignNotEnded(_campaignId) 
        whenNotPaused 
        nonReentrant 
    {
        require(msg.value > 0, "Contribution must be greater than 0");
        require(campaigns[_campaignId].creator != msg.sender, "Cannot contribute to own campaign");
        
        Campaign storage campaign = campaigns[_campaignId];
        
    // First time contributor
    if (contributions[_campaignId][msg.sender] == 0) {
        campaign.contributorsCount++;
        userContributions[msg.sender].push(_campaignId);
    }

    if (totalContributions[msg.sender] == 0) {
        allContributors.push(msg.sender);
    }
    totalContributions[msg.sender] += msg.value;

    contributions[_campaignId][msg.sender] += msg.value;
        campaign.raisedAmount += msg.value;
        
        campaignContributions[_campaignId].push(Contribution({
            contributor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        // Calculate reward dynamically
        uint256 rewardAmount = msg.value / 10; // Example: 10% of contribution as reward

        // Save reward on-chain
        userRewards[msg.sender].push(Reward({
            id: 1,          // Contributor Badge
            amount: rewardAmount,
            claimed: false
        }));

        emit ContributionMade(_campaignId, msg.sender, msg.value);

        // Check if target reached
        if (campaign.raisedAmount >= campaign.targetAmount) {
            emit CampaignFunded(_campaignId, campaign.raisedAmount);
        }
    }
    
    /**
     * @dev Withdraw funds from successful campaign
     * @param _campaignId Campaign ID to withdraw from
     */
    function withdrawCampaignFunds(uint256 _campaignId)
        external
        validCampaign(_campaignId)
        onlyCampaignCreator(_campaignId)
        campaignEnded(_campaignId)
        nonReentrant
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.withdrawn, "Funds already withdrawn");
        require(campaign.raisedAmount >= campaign.targetAmount, "Campaign target not reached");
        require(campaignMilestones[_campaignId].length == 0, "Withdraw disabled when milestones exist");

        campaign.withdrawn = true;

        // Transfer full amount to creator (no platform commission)
        campaign.creator.transfer(campaign.raisedAmount);

        emit CampaignWithdrawn(_campaignId, msg.sender, campaign.raisedAmount);
    }

    /**
     * @dev Release a milestone (only creator, sequential)
     * @param _campaignId Campaign ID
     * @param _milestoneIndex Milestone index to release
     */
    function releaseMilestone(uint256 _campaignId, uint256 _milestoneIndex) external nonReentrant {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign id");
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.creator == msg.sender, "Not campaign creator");

        // require campaign funded (you can change to partial-release-on-available-funds if you prefer)
        require(campaign.raisedAmount >= campaign.targetAmount, "Campaign not fully funded");

        Milestone storage m = campaignMilestones[_campaignId][_milestoneIndex];
        require(!m.released, "Milestone already released");

        // ensure previous milestones released (sequential)
        if (_milestoneIndex > 0) {
            require(campaignMilestones[_campaignId][_milestoneIndex - 1].released, "Release prev milestone first");
        }

        // optional time lock
        if (m.releaseTime > 0) {
            require(block.timestamp >= m.releaseTime, "Milestone locked until releaseTime");
        }

        require(address(this).balance >= m.amount, "Contract balance insufficient");

        m.released = true;
        campaignReleasedAmount[_campaignId] += m.amount;

        (bool sent, ) = campaign.creator.call{value: m.amount}("");
        require(sent, "Transfer failed");

        emit MilestoneReleased(_campaignId, _milestoneIndex, m.amount);
    }

    /**
     * @dev Get all milestones for a campaign
     * @param _campaignId Campaign ID
     */
    function getCampaignMilestones(uint256 _campaignId) external view returns (Milestone[] memory) {
        return campaignMilestones[_campaignId];
    }

    /**
     * @dev Get refund for failed campaign
     * @param _campaignId Campaign ID to get refund from
     */
    function getRefund(uint256 _campaignId) 
        external 
        validCampaign(_campaignId) 
        campaignEnded(_campaignId) 
        nonReentrant 
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.raisedAmount < campaign.targetAmount, "Campaign was successful");
        require(contributions[_campaignId][msg.sender] > 0, "No contribution found");
        
        uint256 refundAmount = contributions[_campaignId][msg.sender];
        contributions[_campaignId][msg.sender] = 0;
        
        payable(msg.sender).transfer(refundAmount);
        
        emit RefundIssued(_campaignId, msg.sender, refundAmount);
    }
    
    /**
     * @dev Emergency refund for contributors (admin only)
     * @param _campaignId Campaign ID
     * @param _contributor Contributor address
     */
    function emergencyRefund(uint256 _campaignId, address _contributor) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(contributions[_campaignId][_contributor] > 0, "No contribution found");
        
        uint256 refundAmount = contributions[_campaignId][_contributor];
        contributions[_campaignId][_contributor] = 0;
        campaigns[_campaignId].raisedAmount -= refundAmount;
        
        payable(_contributor).transfer(refundAmount);
        
        emit RefundIssued(_campaignId, _contributor, refundAmount);
    }
    
    /**
     * @dev Deactivate a campaign (admin only)
     * @param _campaignId Campaign ID to deactivate
     */
    function deactivateCampaign(uint256 _campaignId) external onlyOwner {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign ID");
        campaigns[_campaignId].active = false;
    }
    
    /**
     * @dev Reactivate a campaign (admin only)
     * @param _campaignId Campaign ID to reactivate
     */
    function reactivateCampaign(uint256 _campaignId) external onlyOwner {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign ID");
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign expired");
        campaigns[_campaignId].active = true;
    }
    
    /**
     * @dev Withdraw platform fees (admin only)
     * @param _amount Amount to withdraw
     */
    function withdrawFees(uint256 _amount) external onlyOwner nonReentrant {
        require(_amount <= totalFeesCollected, "Insufficient fee balance");
        require(_amount <= address(this).balance, "Insufficient contract balance");
        
        totalFeesCollected -= _amount;
        payable(owner()).transfer(_amount);
        
        emit FeesWithdrawn(msg.sender, _amount);
    }
    
    /**
     * @dev Emergency withdrawal (admin only)
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Pause the contract (admin only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract (admin only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // View functions
    
    /**
     * @dev Get campaign details
     * @param _campaignId Campaign ID
     */
    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign ID");
        return campaigns[_campaignId];
    }
    
    /**
     * @dev Get user's contribution to a campaign
     * @param _campaignId Campaign ID
     * @param _contributor Contributor address
     */
    function getContribution(uint256 _campaignId, address _contributor) 
        external 
        view 
        returns (uint256) 
    {
        return contributions[_campaignId][_contributor];
    }
    
    /**
     * @dev Get all contributions for a campaign
     * @param _campaignId Campaign ID
     */
    function getCampaignContributions(uint256 _campaignId) 
        external 
        view 
        returns (Contribution[] memory) 
    {
        return campaignContributions[_campaignId];
    }
    
    /**
     * @dev Get user's created campaigns
     * @param _user User address
     */
    function getUserCampaigns(address _user) external view returns (uint256[] memory) {
        return userCampaigns[_user];
    }
    
    /**
     * @dev Get user's contributed campaigns
     * @param _user User address
     */
    function getUserContributions(address _user) external view returns (uint256[] memory) {
        return userContributions[_user];
    }

    /**
     * @dev Get user's rewards
     * @param user User address
     */
    function getUserRewards(address user) external view returns (Reward[] memory) {
        return userRewards[user];
    }

    /**
     * @dev Claim all unclaimed rewards
     */
    function claimRewards() external nonReentrant {
        Reward[] storage rewards = userRewards[msg.sender];
        uint256 total = 0;

        for (uint i = 0; i < rewards.length; i++) {
            if (!rewards[i].claimed) {
                total += rewards[i].amount;
                rewards[i].claimed = true; // mark as claimed
            }
        }

        require(total > 0, "No rewards to claim");
        require(address(this).balance >= total, "Contract has insufficient funds");

        payable(msg.sender).transfer(total);
    }
    
    /**
     * @dev Get active campaigns (paginated)
     * @param _offset Starting index
     * @param _limit Number of campaigns to return
     */
    function getActiveCampaigns(uint256 _offset, uint256 _limit) 
        external 
        view 
        returns (Campaign[] memory) 
    {
        require(_limit > 0 && _limit <= 100, "Invalid limit");
        
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= campaignCounter; i++) {
            if (campaigns[i].active) activeCount++;
        }
        
        if (_offset >= activeCount) {
            return new Campaign[](0);
        }
        
        uint256 returnCount = _limit;
        if (_offset + _limit > activeCount) {
            returnCount = activeCount - _offset;
        }
        
        Campaign[] memory result = new Campaign[](returnCount);
        uint256 resultIndex = 0;
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= campaignCounter && resultIndex < returnCount; i++) {
            if (campaigns[i].active) {
                if (currentIndex >= _offset) {
                    result[resultIndex] = campaigns[i];
                    resultIndex++;
                }
                currentIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Check if campaign is successful
     * @param _campaignId Campaign ID
     */
    function isCampaignSuccessful(uint256 _campaignId) external view returns (bool) {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign ID");
        Campaign memory campaign = campaigns[_campaignId];
        return campaign.raisedAmount >= campaign.targetAmount;
    }
    
    /**
     * @dev Get campaign statistics
     * @param _campaignId Campaign ID
     */
    function getCampaignStats(uint256 _campaignId) 
        external 
        view 
        returns (
            uint256 raisedAmount,
            uint256 targetAmount,
            uint256 contributorsCount,
            uint256 timeLeft,
            bool isActive,
            bool isSuccessful
        ) 
    {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign ID");
        Campaign memory campaign = campaigns[_campaignId];
        
        raisedAmount = campaign.raisedAmount;
        targetAmount = campaign.targetAmount;
        contributorsCount = campaign.contributorsCount;
        timeLeft = block.timestamp >= campaign.deadline ? 0 : campaign.deadline - block.timestamp;
        isActive = campaign.active;
        isSuccessful = campaign.raisedAmount >= campaign.targetAmount;
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats()
        external
        view
        returns (
            uint256 totalCampaigns,
            uint256 totalFees,
            uint256 contractBalance
        )
    {
        totalCampaigns = campaignCounter;
        totalFees = totalFeesCollected;
        contractBalance = address(this).balance;
    }

    /**
     * @dev Get top contributors by total ETH contributed
     * @param topN Number of top contributors to return
     */
    function getTopContributors(uint256 topN) external view returns (address[] memory, uint256[] memory) {
        uint256 len = allContributors.length;
        if (topN > len) topN = len;

        address[] memory topAddresses = new address[](topN);
        uint256[] memory topTotals = new uint256[](topN);

        // Create a copy of allContributors to sort
        address[] memory contributors = new address[](len);
        for (uint256 i = 0; i < len; i++) {
            contributors[i] = allContributors[i];
        }

        // Selection sort for top N
        for (uint256 i = 0; i < topN; i++) {
            uint256 maxIndex = i;
            uint256 maxTotal = totalContributions[contributors[i]];
            for (uint256 j = i + 1; j < len; j++) {
                if (totalContributions[contributors[j]] > maxTotal) {
                    maxTotal = totalContributions[contributors[j]];
                    maxIndex = j;
                }
            }
            // Swap
            address tempAddr = contributors[i];
            contributors[i] = contributors[maxIndex];
            contributors[maxIndex] = tempAddr;

            topAddresses[i] = contributors[i];
            topTotals[i] = maxTotal;
        }

        return (topAddresses, topTotals);
    }

    /**
     * @dev Fallback function to receive Ether
     */
    receive() external payable {}
}