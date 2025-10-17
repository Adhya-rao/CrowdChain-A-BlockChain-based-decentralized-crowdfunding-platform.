import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import Layout from "../components/Layout/Layout";
import { formatEther } from "../utils/helpers";
import { useContract } from "../hooks/useContract";

export default function NotificationPage() {
  const { address, isConnected } = useAccount();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'ending-soon', 'ended'

  const { useActiveCampaigns, useUserContributions } = useContract();
  const {
    data: activeCampaigns,
    isLoading: campaignsLoading,
    error: campaignsError,
  } = useActiveCampaigns(0, 100); // Get first 100 active campaigns

  const {
    data: userContributionIds,
    isLoading: contribIdsLoading,
    error: contribIdsError,
  } = useUserContributions(address);

  // 🧩 Generate notifications from campaigns
  useEffect(() => {
    if (!activeCampaigns || !userContributionIds) return;

    try {
      // Filter campaigns relevant to the connected user (created or contributed)
      const relevantCampaigns = activeCampaigns.filter((campaign) => {
        const isCreator = campaign.creator?.toLowerCase() === address?.toLowerCase();
        const isContributor = userContributionIds?.some(id => {
          const contribId = typeof id === 'bigint' ? id : BigInt(id.toString());
          const campId = typeof campaign.id === 'bigint' ? campaign.id : BigInt(campaign.id.toString());
          return contribId === campId;
        });
        return isCreator || isContributor;
      });

      const notes = relevantCampaigns.map((campaign) => {
        const raisedAmountBig = BigInt(campaign.raisedAmount || 0);
        const targetAmountBig = BigInt(campaign.targetAmount || 0);
        const deadline = campaign.deadline?._hex
          ? parseInt(campaign.deadline._hex)
          : Number(campaign.deadline || 0);
        const timeLeft = Math.max(0, deadline - Math.floor(Date.now() / 1000));

        const days = Math.floor(timeLeft / 86400);
        const hours = Math.floor((timeLeft % 86400) / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const progress =
          targetAmountBig > 0n
            ? (Number(raisedAmountBig) / Number(targetAmountBig)) * 100
            : 0;

        let timeLeftText;
        if (timeLeft === 0) timeLeftText = "Campaign ended ⏰";
        else if (days > 0) timeLeftText = `${days}d ${hours}h ${minutes}m`;
        else timeLeftText = `${hours}h ${minutes}m`;

        return {
          id: campaign.id.toString(),
          title: campaign.title,
          raisedAmount: raisedAmountBig.toString(),
          targetAmount: targetAmountBig.toString(),
          progress: progress.toFixed(2),
          contributors: Number(campaign.contributorsCount) || 0,
          timeLeft,
          timeLeftText,
          status:
            progress >= 100
              ? "Goal achieved 🎉"
              : timeLeft === 0
              ? "Campaign ended ⏰"
              : "Active 🔥",
          isActive: timeLeft > 0 && progress < 100,
          isEndingSoon: timeLeft > 0 && timeLeft <= 86400,
          isEnded: timeLeft === 0,
          read: false, // 👀 mark unread initially
        };
      });

      setNotifications(notes);
    } catch (error) {
      console.error("Error generating notifications:", error);
    }
  }, [activeCampaigns, userContributionIds]);

  // 🧠 Save notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  // ✅ Mark all as read when visiting notifications page
  useEffect(() => {
    if (notifications.length > 0) {
      const markedRead = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(markedRead);
      localStorage.setItem("notifications", JSON.stringify(markedRead));
    }
  }, [notifications.length]);

  // 🔍 Filter logic
  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "active") return notifications.filter((n) => n.isActive);
    if (filter === "ending-soon")
      return notifications.filter((n) => n.isEndingSoon);
    if (filter === "ended") return notifications.filter((n) => n.isEnded);
    return notifications;
  }, [notifications, filter]);

  // 🧮 Get unread count for sidebar badge (can export later)
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    localStorage.setItem("unreadCount", unread);
  }, [notifications]);

  return (
    <Layout>
      <div className="p-6 space-y-4">
       <h1 className="text-2xl font-bold mb-4 text-white">
  Notifications
</h1>

        {!isConnected && (
          <p className="text-red-500">
            Please connect your wallet to view your notifications.
          </p>
        )}

        {isConnected && (campaignsLoading || contribIdsLoading) && (
          <p className="text-blue-500">Loading campaigns...</p>
        )}

        {isConnected && (campaignsError || contribIdsError) && (
          <p className="text-red-500">
            Error loading campaigns: {(campaignsError || contribIdsError).message}
          </p>
        )}

        {/* Filter Buttons */}
        {isConnected && notifications.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {["all", "active", "ending-soon", "ended"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? f === "all"
                      ? "bg-blue-500 text-white"
                      : f === "active"
                      ? "bg-green-500 text-white"
                      : f === "ending-soon"
                      ? "bg-orange-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")} (
                {
                  notifications.filter((n) => {
                    if (f === "all") return true;
                    if (f === "active") return n.isActive;
                    if (f === "ending-soon") return n.isEndingSoon;
                    if (f === "ended") return n.isEnded;
                  }).length
                }
                )
              </button>
            ))}
          </div>
        )}

        {filteredNotifications.length === 0 &&
          isConnected &&
          !campaignsLoading &&
          !contribIdsLoading && (
            <p className="text-gray-600 dark:text-gray-300">
              {filter === "all"
                ? "No relevant campaigns available."
                : `No ${filter.replace("-", " ")} campaigns.`}
            </p>
          )}

        <div className="space-y-3">
          {filteredNotifications.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              <h2 className="font-semibold text-lg">{note.title}</h2>
              <p className="text-sm mb-1">
                Status: <span className="font-medium">{note.status}</span>
              </p>
              <p className="text-sm">
                Raised: {formatEther(note.raisedAmount)} /{" "}
                {formatEther(note.targetAmount)} ETH
              </p>
              <p className="text-sm">Contributors: {note.contributors}</p>
              {note.timeLeftText && (
                <p className="text-sm">Time Left: {note.timeLeftText}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
