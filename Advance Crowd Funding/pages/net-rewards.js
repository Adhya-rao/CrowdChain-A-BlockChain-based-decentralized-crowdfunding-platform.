import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Layout from "../components/Layout/Layout";
import { ethers } from "ethers";
import { useContract } from "../hooks/useContract";
import Confetti from "react-confetti";

export default function NetRewardsPage() {
  const { address, isConnected } = useAccount();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const { useUserRewards, useClaimRewards, useTopContributors } = useContract();
  const { data: userRewards, error } = useUserRewards(address);
  const { claimRewards, isLoading: claimLoading } = useClaimRewards();
  const { data: leaderboardData } = useTopContributors(10);

  useEffect(() => {
    if (!isConnected || !userRewards) {
      setRewards([]);
      setLoading(false);
      return;
    }

    try {
      const formatted = userRewards.map((reward, index) => {
        const rewardData = getRewardData(Number(reward.id));
        return {
          id: index + 1,
          rewardId: Number(reward.id),
          amount: ethers.utils.formatEther(reward.amount),
          claimed: reward.claimed,
          badge: rewardData.badge,
          description: rewardData.description,
        };
      });
      setRewards(formatted);
    } catch (err) {
      console.error("Error fetching rewards:", err);
    } finally {
      setLoading(false);
    }
  }, [userRewards, isConnected]);

  useEffect(() => {
    if (rewards.some(r => !r.claimed)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [rewards]);

  const getUserLevel = (totalETH) => {
    if (totalETH >= 0.5) return "Gold Donor";
    if (totalETH >= 0.1) return "Silver Supporter";
    if (totalETH > 0) return "Bronze Contributor";
    return "No Level Yet";
  };

  const totalETH = rewards.reduce((acc, r) => acc + parseFloat(r.amount), 0);
  const userLevel = getUserLevel(totalETH);

  const getRewardData = (rewardId) => {
    const rewardMap = {
      1: {
        badge: "Contributor Badge",
        description: "Awarded for making a contribution to a campaign",
      },
      2: {
        badge: "Top Supporter",
        description: "Awarded for contributing multiple times",
      },
      // Add more types dynamically
    };
    return rewardMap[Number(rewardId)] || {
      badge: `Reward #${rewardId}`,
      description: "Unknown reward type",
    };
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Net Rewards</h1>
            <p className="text-gray-300">Please connect your wallet to view your rewards.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {showConfetti && <Confetti numberOfPieces={200} />}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-white dark:text-yellow-300 text-center">
          Your Net Rewards
        </h1>

        <h2 className="text-xl font-bold text-white text-center mb-4">
          Level: {userLevel} ({totalETH.toFixed(3)} ETH earned)
        </h2>

        {loading && <p className="text-blue-400 text-center">Loading rewards...</p>}
        {error && <p className="text-red-500 text-center">Error: {error.message}</p>}

        {!loading && rewards.length === 0 && (
          <p className="text-gray-300 text-center">You have no rewards yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-gray-800 dark:to-gray-700 text-white rounded-xl shadow-lg border border-white/20 p-6 transform transition-transform hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="font-bold text-xl mb-2">{reward.badge}</h2>
              <p className="text-sm mb-2">{reward.description}</p>
              <p className="font-semibold mb-4">Reward: {reward.amount} ETH</p>

              {!reward.claimed ? (
                <button
                  onClick={() => claimRewards()}
                  disabled={claimLoading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {claimLoading ? "Claiming..." : "Claim Rewards"}
                </button>
              ) : (
                <span className="text-green-400 font-semibold">Claimed ✅</span>
              )}
            </div>
          ))}
        </div>

        {/* 🏆 Leaderboard Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            🏆 Top Contributors Leaderboard
          </h2>

          {leaderboardData && leaderboardData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl shadow-lg border border-white/10">
                <thead>
                  <tr className="text-yellow-400 text-left">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Wallet Address</th>
                    <th className="py-3 px-4">Total Contributed (ETH)</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => {
                    const rank = index + 1;
                    const isTop3 = rank <= 3;
                    const rankColor =
                      rank === 1
                        ? "text-yellow-300"
                        : rank === 2
                        ? "text-gray-300"
                        : rank === 3
                        ? "text-orange-300"
                        : "text-white";

                    return (
                      <tr
                        key={index}
                        className={`border-t border-white/10 hover:bg-white/10 transition-colors ${
                          isTop3 ? "font-semibold" : ""
                        }`}
                      >
                        <td className={`py-3 px-4 ${rankColor}`}>
                          {rank === 1
                            ? "🥇"
                            : rank === 2
                            ? "🥈"
                            : rank === 3
                            ? "🥉"
                            : `#${rank}`}
                        </td>
                        <td className="py-3 px-4 font-mono truncate max-w-[180px]">
                          {user.wallet
                            ? `${user.wallet.slice(0, 6)}...${user.wallet.slice(-4)}`
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          {ethers.utils.formatEther(user.totalContributed)} ETH
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-4">
              No contributor data available yet.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
