import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  FiShield,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiArrowRight,
  FiTarget,
  FiGlobe,
} from "react-icons/fi";

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();

  const features = [
    {
      icon: FiTarget,
      title: "Launch Your Ideas",
      description:
        "Create compelling campaigns and bring your innovative projects to life with blockchain transparency.",
    },
    {
      icon: FiUsers,
      title: "Global Community",
      description:
        "Connect with supporters worldwide and build a community around your vision.",
    },
    {
      icon: FiShield,
      title: "Secure & Transparent",
      description:
        "Smart contracts ensure funds are safe and transactions are transparent on the blockchain.",
    },
    {
      icon: FiGlobe,
      title: "Decentralized",
      description:
        "No intermediaries, no censorship. Pure peer-to-peer crowdfunding on Ethereum.",
    },
  ];

  const stats = [
    { value: "1000+", label: "Campaigns Launched" },
    { value: "$2M+", label: "Funds Raised" },
    { value: "50K+", label: "Contributors" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                CrowdChain
              </span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat pt-36 pb-32"
        style={{ backgroundImage: "url('/3d-cryptocurrency-rendering-design.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg">
            CrowdChain
            <span className="block text-blue-400">
              A Decentralized Crowdfunding Platform
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Launch campaigns, contribute securely, and track milestones on blockchain.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 flex-wrap">
            {isConnected ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-blue-500/40 hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center"
              >
                Go to Dashboard
                <FiArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            ) : (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-2xl">
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={openConnectModal}
                      className="text-white font-semibold hover:text-blue-200 transition-colors duration-200"
                    >
                      Connect Wallet to Start
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            )}
            <button
              onClick={() => router.push("/campaigns")}
              className="border-2 border-white px-10 py-4 rounded-2xl text-lg font-semibold text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Explore Campaigns
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why CrowdChain?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Secure, transparent, and milestone-based crowdfunding powered by blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center flex flex-col items-center justify-start p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CC</span>
            </div>
            <span className="text-xl font-extrabold">CrowdChain</span>
          </div>
          <p className="text-gray-400 mb-2">Decentralized crowdfunding for the future</p>
          <p className="text-gray-500 text-sm">© 2025 CrowdChain. Built on Ethereum.</p>
        </div>
      </footer>
    </div>
  );
}
