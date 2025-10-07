import { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { FiUpload, FiX, FiInfo, FiPlus, FiTrash2 } from "react-icons/fi";
import { useContract } from "../../hooks/useContract";
import { uploadCampaignMetadata } from "../../utils/ipfs";
import { CAMPAIGN_CREATION_FEE } from "../../constants";
import { formatEther } from "../../utils/helpers";
import ContractDebug from "../Debug/ContractDebug";
import { CONTRACT_ADDRESS } from "../../constants";

export default function CreateCampaignForm() {
  const router = useRouter();
  const { useCreateCampaignSimple, useCreateCampaignWithMilestones } = useContract();
  const { createCampaignAsync, isLoading: isLoadingSimple } = useCreateCampaignSimple();
  const { createCampaignWithMilestonesAsync, isLoading: isLoadingMilestones } = useCreateCampaignWithMilestones();
  const isLoading = isLoadingSimple || isLoadingMilestones;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    duration: "",
    category: "General",
    tags: "",
    additionalInfo: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Milestone state
  const [useMilestones, setUseMilestones] = useState(false);
  const [milestones, setMilestones] = useState([
    { title: "", description: "", amount: "", releaseTime: "" }
  ]);

  const categories = [
    "Technology",
    "Creative",
    "Medical",
    "Education",
    "Environment",
    "Community",
    "Business",
    "General",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("Image size must be less than 10MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Milestone functions
  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", amount: "", releaseTime: "" }]);
  };

  const removeMilestone = (index) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index, field, value) => {
    const updated = milestones.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    setMilestones(updated);
  };

  const getTotalMilestoneAmount = () => {
    return milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      toast.error("Valid target amount is required");
      return false;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error("Valid duration is required");
      return false;
    }

    if (useMilestones) {
      if (getTotalMilestoneAmount() !== parseFloat(formData.targetAmount)) {
        toast.error("Milestone amounts must equal the target amount");
        return false;
      }
      for (let i = 0; i < milestones.length; i++) {
        const m = milestones[i];
        if (!m.title.trim()) {
          toast.error(`Milestone ${i + 1}: Title is required`);
          return false;
        }
        if (!m.description.trim()) {
          toast.error(`Milestone ${i + 1}: Description is required`);
          return false;
        }
        if (!m.amount || parseFloat(m.amount) <= 0) {
          toast.error(`Milestone ${i + 1}: Valid amount is required`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if createCampaignAsync function is available
    if (!createCampaignAsync) {
      toast.error(
        "Contract function not available. Please check your wallet connection and contract address."
      );
      console.error(
        "createCampaignAsync is undefined. CONTRACT_ADDRESS:",
        CONTRACT_ADDRESS
      );
      return;
    }

    setUploading(true);

    try {
      // Upload metadata to IPFS
      const metadataData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      toast.loading("Uploading to IPFS...", { id: "upload" });
      const uploadResult = await uploadCampaignMetadata(
        metadataData,
        imageFile
      );
      toast.dismiss("upload");

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Prepare contract parameters
      const targetAmountWei = ethers.utils.parseEther(formData.targetAmount);
      const durationSeconds = parseInt(formData.duration) * 24 * 60 * 60; // Convert days to seconds
      const creationFee = ethers.utils.parseEther("1"); // 1 ETH

      toast.loading("Creating campaign...", { id: "create" });

      let tx;
      if (useMilestones) {
        // Prepare milestone arrays
        const milestoneAmounts = milestones.map(m => ethers.utils.parseEther(m.amount));
        const milestoneTitles = milestones.map(m => m.title);
        const milestoneDescriptions = milestones.map(m => m.description);
        const milestoneReleaseTimes = milestones.map(m => m.releaseTime ? Math.floor(new Date(m.releaseTime).getTime() / 1000) : 0);

        console.log("Creating campaign with milestones:", {
          title: formData.title,
          description: formData.description,
          metadataHash: uploadResult.metadataHash,
          targetAmount: targetAmountWei.toString(),
          duration: durationSeconds,
          milestoneAmounts: milestoneAmounts.map(a => a.toString()),
          milestoneTitles,
          milestoneDescriptions,
          milestoneReleaseTimes,
          value: creationFee.toString(),
        });

        tx = await createCampaignWithMilestonesAsync({
          args: [
            formData.title,
            formData.description,
            uploadResult.metadataHash,
            targetAmountWei,
            durationSeconds,
            milestoneAmounts,
            milestoneTitles,
            milestoneDescriptions,
            milestoneReleaseTimes,
          ],
          value: creationFee,
        });
      } else {
        console.log("Contract call parameters:", {
          title: formData.title,
          description: formData.description,
          metadataHash: uploadResult.metadataHash,
          targetAmount: targetAmountWei.toString(),
          duration: durationSeconds,
          value: creationFee.toString(),
          contractAddress: CONTRACT_ADDRESS,
        });

        tx = await createCampaignAsync({
          args: [
            formData.title,
            formData.description,
            uploadResult.metadataHash,
            targetAmountWei,
            durationSeconds,
          ],
          value: creationFee,
        });
      }

      console.log("Transaction submitted:", tx);

      toast.dismiss("create");
      toast.success("Campaign created successfully!");
      router.push("/my-campaigns");
    } catch (error) {
      toast.dismiss();
      console.error("Error creating campaign:", error);

      let errorMessage = "Failed to create campaign";
      if (error?.message) {
        if (
          error.message.includes("User rejected") ||
          error.message.includes("user rejected")
        ) {
          errorMessage = "Transaction was rejected by user";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for transaction";
        } else if (error.message.includes("ABI encoding")) {
          errorMessage =
            "Contract configuration error. Please contact support.";
        } else if (error.message.includes("execution reverted")) {
          errorMessage =
            "Transaction failed: " + (error.reason || "Unknown reason");
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className=" mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Campaign
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Launch your crowdfunding campaign and bring your ideas to life
        </p>
      </div>

      {/* Debug Component - Remove this in production */}
      {/* <ContractDebug /> */}

      {/* Creation Fee Notice */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <FiInfo className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-blue-800 dark:text-blue-200 font-medium">
              Creation Fee
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              A fee of {formatEther(CAMPAIGN_CREATION_FEE)} ETH is required to
              create a campaign.
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Toggle */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiInfo className="w-5 h-5 text-purple-500" />
            <div>
              <h4 className="text-purple-800 dark:text-purple-200 font-medium">
                Milestone-Based Releases
              </h4>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Enable sequential fund releases after campaign success
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={useMilestones}
              onChange={(e) => setUseMilestones(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Campaign Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a compelling title for your campaign"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe your campaign, goals, and how funds will be used"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            required
          />
        </div>

        {/* Target Amount & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Amount (ETH) *
            </label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleInputChange}
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (Days) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              max="365"
              placeholder="30"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="startup, tech, innovation (comma separated)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Campaign Image
          </label>

          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Campaign preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
              <div className="text-center">
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Information
          </label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            rows={3}
            placeholder="Any additional details about your campaign, team, or project timeline"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          />
        </div>

        {/* Milestone Builder */}
        {useMilestones && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Milestones
              </h3>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Milestone {index + 1}
                    </h4>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        placeholder="e.g., Development Phase 1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Amount (ETH) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={milestone.amount}
                        onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      rows={2}
                      placeholder="Describe what this milestone includes"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white resize-none"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Release Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={milestone.releaseTime}
                      onChange={(e) => updateMilestone(index, 'releaseTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Leave empty for immediate release after previous milestone
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-800 dark:text-purple-200">
                  Total Milestone Amount:
                </span>
                <span className={`font-medium ${getTotalMilestoneAmount() === parseFloat(formData.targetAmount || 0) ? 'text-green-600' : 'text-red-600'}`}>
                  {getTotalMilestoneAmount().toFixed(2)} ETH
                  {getTotalMilestoneAmount() !== parseFloat(formData.targetAmount || 0) && (
                    <span className="ml-2">
                      (Target: {parseFloat(formData.targetAmount || 0).toFixed(2)} ETH)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading || uploading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {uploading
              ? "Uploading to IPFS..."
              : isLoading
              ? "Creating Campaign..."
              : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
