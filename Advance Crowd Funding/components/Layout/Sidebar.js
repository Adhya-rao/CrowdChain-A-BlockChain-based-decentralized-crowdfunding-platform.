// components/Sidebar/Sidebar.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import {
  FiHome,
  FiGrid,
  FiPlus,
  FiUser,
  FiHeart,
  FiSettings,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiBell,
  FiGift,
} from "react-icons/fi";
import { SIDEBAR_ITEMS } from "../../constants";

// map icons
const iconMap = {
  FiHome,
  FiGrid,
  FiPlus,
  FiUser,
  FiHeart,
  FiSettings,
  FiBell,
  FiGift,
};

export default function Sidebar({ isOpen, onToggle, isCollapsed, onToggleCollapse }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [rewardCount, setRewardCount] = useState(0);

  useEffect(() => {
    // notifications
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setUnreadCount(stored.filter((n) => !n.read).length);

    // rewards
    const rewards = JSON.parse(localStorage.getItem("rewards")) || [];
    setRewardCount(rewards.length);
  }, []);

  useEffect(() => {
    const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
    setIsAdmin(address?.toLowerCase() === adminAddress?.toLowerCase());
  }, [address]);

  const filteredItems = SIDEBAR_ITEMS.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white border-r border-gray-700 z-50 transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <span className="text-xl font-bold">CrowdChain</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-gray-800 transition-transform"
            >
              <FiChevronLeft
                className={`w-5 h-5 transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
            <button
              onClick={onToggle}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-800"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-3">
          {filteredItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = router.pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-lg ${
                  isActive
                    ? "bg-blue-800 text-blue-400 border-r-2 border-blue-600"
                    : "text-gray-200 hover:bg-gray-800"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}

                {/* Notification badge */}
                {item.label === "Notifications" && unreadCount > 0 && (
                  <span className="absolute right-4 top-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}

                {/* Rewards badge */}
                {item.label === "Net Rewards" && rewardCount > 0 && (
                  <span className="absolute right-4 top-2 bg-green-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {rewardCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Connection status */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-700">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                isConnected ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            {isConnected && address && (
              <div className="mt-2 text-xs text-gray-400 px-3">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
