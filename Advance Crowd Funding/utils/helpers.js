import { ethers } from "ethers";

export const formatEther = (value) => {
  if (!value) return "0";
  return ethers.utils.formatEther(value.toString());
};

export const parseEther = (value) => {
  return ethers.utils.parseEther(value.toString());
};

export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateTimeLeft = (deadline) => {
  const now = Math.floor(Date.now() / 1000);
  const timeLeft = parseInt(deadline) - now;

  if (timeLeft <= 0) {
    return { expired: true, text: "Expired" };
  }

  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);

  if (days > 0) {
    return { expired: false, text: `${days}d ${hours}h` };
  } else if (hours > 0) {
    return { expired: false, text: `${hours}h ${minutes}m` };
  } else {
    return { expired: false, text: `${minutes}m` };
  }
};

export const calculateProgress = (raised, target) => {
  if (!target || target === "0") return 0;
  const raisedNum = parseFloat(formatEther(raised));
  const targetNum = parseFloat(formatEther(target));
  return Math.min((raisedNum / targetNum) * 100, 100);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
};

export const generateRandomGradient = () => {
  const gradients = [
    "from-blue-500 to-purple-600",
    "from-green-500 to-blue-600",
    "from-purple-500 to-pink-600",
    "from-yellow-500 to-red-600",
    "from-indigo-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

export const validateEthereumAddress = (address) => {
  return ethers.utils.isAddress(address);
};

export const validateAmount = (amount) => {
  try {
    const parsed = parseFloat(amount);
    return parsed > 0 && !isNaN(parsed);
  } catch {
    return false;
  }
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export const getNetworkName = () => {
  return process.env.NEXT_PUBLIC_NETWORK || "unknown";
};
