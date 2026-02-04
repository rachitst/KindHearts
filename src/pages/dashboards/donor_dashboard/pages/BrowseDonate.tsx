import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  DollarSign,
  Package,
  ShoppingCart,
  X,
  CreditCard,
  Users,
  MapPin,
  Globe,
  Calendar,
  ExternalLink,
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
  Star,
  Download
} from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/Button";
import Confetti from "react-confetti";
import ReactDOMServer from "react-dom/server";

interface RecommendedInstitute {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  requirement?: string[];
  category: string;
  itemName?: string;
  quantity?: number;
  urgency?: string;
  beneficiaryCount?: number;
  previousDonations?: boolean;
  createdAt?: string;
}

interface DonationCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: string[];
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

const DONATION_CATEGORIES: DonationCategory[] = [
  {
    id: "food",
    name: "Food & Nutrition",
    icon: <Package size={24} />,
    items: ["Rice", "Wheat", "Lentils", "Cooking Oil", "Spices", "Vegetables"],
  },
  {
    id: "education",
    name: "Education",
    icon: <Sparkles size={24} />,
    items: ["Notebooks", "Pens/Pencils", "Textbooks", "School Bags", "Uniforms"],
  },
  {
    id: "medical",
    name: "Medical",
    icon: <Heart size={24} />,
    items: ["Medicines", "First Aid Kits", "Wheelchairs", "Hygiene Kits"],
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: <ShoppingCart size={24} />,
    items: ["Shirts", "Pants", "Sarees", "Kids Wear", "Blankets"],
  },
];

const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
};

const BrowseDonate = () => {
  const { user } = useUser();
  const [donorName, setDonorName] = useState(user?.fullName || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [recommendedInstitutes, setRecommendedInstitutes] = useState<RecommendedInstitute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedInfoMessage, setRecommendedInfoMessage] = useState<string | null>(null);

  // Pagination and filtering states for "All Institutes"
  const [allInstitutes, setAllInstitutes] = useState<RecommendedInstitute[]>([]);
  const [impactStories, setImpactStories] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [activeCategory, setActiveCategory] = useState("all"); // Filter for Browse All
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilteredAll, setShowFilteredAll] = useState(false); // If true, filter "All" by recommendation criteria

  // Derived state for "All Institutes"
  const categories = [
    { id: "all", name: "All Causes" },
    { id: "food", name: "Food & Hunger" },
    { id: "education", name: "Education" },
    { id: "healthcare", name: "Healthcare" },
    { id: "animals", name: "Animals" },
    { id: "environment", name: "Environment" },
  ];

  const displayedAllInstitutes = useMemo(() => {
    let result = [...allInstitutes];

    // 1. Filter by Category
    if (activeCategory !== "all") {
      result = result.filter(
        (inst) =>
          (inst.category || "").toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (inst) =>
          inst.name.toLowerCase().includes(q) ||
          inst.description.toLowerCase().includes(q) ||
          inst.address.toLowerCase().includes(q)
      );
    }

    // 3. (Optional) Filter by Recommendation Criteria
    if (showFilteredAll) {
      // reuse logic: matches selectedCategory or selectedItems
      const targetCat = selectedCategory.toLowerCase().trim();
      const itemsLower = selectedItems.map((i) => i.toLowerCase());

      result = result.filter((inst) => {
        const catMatch =
          targetCat === "" ||
          (inst.category || "").toLowerCase() === targetCat;
        const itemMatch = itemsLower.some(
          (i) =>
            (inst.itemName || "").toLowerCase().includes(i) ||
            inst.description.toLowerCase().includes(i) ||
            (inst.requirement || []).join(", ").toLowerCase().includes(i)
        );
        return catMatch || itemMatch;
      });
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "beneficiaries":
          return (b.beneficiaryCount || 0) - (a.beneficiaryCount || 0);
        case "urgency": {
          const urgencyWeight = (u?: string) => {
            const v = (u || "").toLowerCase();
            if (v === "critical") return 3;
            if (v === "high") return 2;
            if (v === "medium") return 1;
            return 0;
          };
          return urgencyWeight(b.urgency) - urgencyWeight(a.urgency);
        }
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
        default:
          // Assuming createdAt exists, else stable sort
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    return result;
  }, [
    allInstitutes,
    activeCategory,
    searchQuery,
    sortBy,
    showFilteredAll,
    selectedCategory,
    selectedItems,
  ]);

  const totalPages = Math.ceil(displayedAllInstitutes.length / pageSize);
  const pagedInstitutes = displayedAllInstitutes.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDonationPrompt, setShowDonationPrompt] = useState(false);
  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<any>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleInstituteClick = (institute: any) => {
    setSelectedInstitute(institute);
    setShowInstituteModal(true);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Prepare donation data
      const donationData = {
        paymentId: response.razorpay_payment_id,
        donorId: user?.id,
        donorName: user?.fullName || "Anonymous",
        instituteId: selectedInstitute._id || selectedInstitute.id, // Handle both _id and id
        instituteName: currentDonation.institute,
        donationItem:
          currentDonation.type === "monetary"
            ? "Fixed Amount"
            : currentDonation.resources?.map((r: any) => r.name).join(", "),
        amount:
          currentDonation.type === "monetary"
            ? currentDonation.amount
            : currentDonation.totalAmount,
        donationType: currentDonation.type,
        resources:
          currentDonation.type === "resource"
            ? currentDonation.resources
            : null,
        date: new Date().toISOString(),
        status: "completed",
      };

      // Make API call to save donation
      const res = await axios.post(`${config.apiBaseUrl}/api/donations`, donationData);

      // Close payment modal first
      setShowPaymentModal(false);

      // Store payment ID from Razorpay response
      setCurrentDonation((prev: any) => ({
        ...prev,
        paymentId: response.razorpay_payment_id,
      }));

      // Show success modal
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving donation:", error);
      // Still show success modal even if API call fails
      setShowPaymentModal(false);
      setCurrentDonation((prev: any) => ({
        ...prev,
        paymentId: response.razorpay_payment_id,
      }));
      setShowSuccess(true);
    }
  };

  const handleRazorpayPayment = async (amount: number) => {
    await loadRazorpay();

    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZOR_PAY,
      amount: amount * 100,
      currency: "INR",
      name: "KindHearts",
      description: `Donation to ${currentDonation?.institute}`,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: user?.fullName || "Donor Name",
        email: user?.primaryEmailAddress?.emailAddress || "donor@example.com",
      },
      theme: {
        color: "#4F46E5",
      },
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Error initializing Razorpay:", err);
      alert("Failed to initialize payment. Please try again.");
    }
  };

  const generateReceipt = () => {
    if (!currentDonation || !currentDonation.paymentId) {
      alert("Missing donation information");
      return;
    }

    try {
      // Create receipt content in HTML
      const receiptContent = (
        <div className="bg-white p-8 rounded-xl max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-indigo-600">DonorConnect</h1>
            <p className="text-gray-600">Donation Receipt</p>
          </div>

          <div className="mb-6">
            <p className="font-medium">DonorConnect Foundation</p>
            <div className="text-sm text-gray-600">
              <p>123 Charity Lane</p>
              <p>Mumbai, Maharashtra 400001</p>
              <p>India</p>
              <p>support@donorconnect.org</p>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Receipt Number:</p>
                <p className="font-medium">{currentDonation.paymentId}</p>
              </div>
              <div>
                <p className="text-gray-600">Date:</p>
                <p className="font-medium">
                  {new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Donor Name:</p>
                <p className="font-medium">{user?.fullName || "Anonymous"}</p>
              </div>
              <div>
                <p className="text-gray-600">Recipient Organization:</p>
                <p className="font-medium">{currentDonation.institute}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Donation Details</h2>
            <div className="space-y-2">
              {currentDonation.type === "monetary" ? (
                <div className="flex justify-between py-2 border-b">
                  <span>Charitable Donation</span>
                  <span className="font-medium">
                    ₹{currentDonation.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ) : (
                <>
                  {currentDonation.resources?.map(
                    (resource: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b"
                      >
                        <span>{`${resource.name} x ${resource.quantity}`}</span>
                        <span className="font-medium">
                          ₹{resource.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )
                  )}
                </>
              )}
              <div className="flex justify-between pt-4 font-semibold">
                <span>Total Amount</span>
                <span>
                  ₹
                  {(currentDonation.type === "monetary"
                    ? currentDonation.amount
                    : currentDonation.totalAmount
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 mt-8">
            <p>
              This receipt is computer generated and does not require a physical
              signature.
            </p>
            <p className="mt-2">
              Thank you for your generous donation. Your contribution will make
              a meaningful impact.
            </p>
          </div>
        </div>
      );

      // Create a new window and write the receipt content
      const receiptWindow = window.open("", "_blank");
      if (!receiptWindow) {
        alert("Please allow popups for this website to view the receipt");
        return;
      }

      receiptWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Donation Receipt</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body>
            <div class="min-h-screen bg-gray-100 py-8">
              ${ReactDOMServer.renderToString(receiptContent)}
              <div class="text-center mt-8">
                <button onclick="window.print()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Print Receipt
                </button>
              </div>
            </div>
          </body>
        </html>
      `);
      receiptWindow.document.close();
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Failed to generate receipt. Please try again.");
    }
  };

  const fetchRecommendations = async () => {
    if (!selectedCategory && selectedItems.length === 0) return;
    setIsLoading(true);
    try {
      // POST to API
      const res = await axios.post(`${config.apiBaseUrl}/api/recommendations`, {
        category: selectedCategory,
        items: selectedItems,
        donorName,
      });

      const data = res.data;
      let matched: any[] = [];
      if (data && data.success) {
        matched = Array.isArray(data.matchedInstitutes)
          ? data.matchedInstitutes
          : [];
      }

      const normalizeCategory = (c?: string) =>
        (c || "").toLowerCase().trim();
      const targetCategory = normalizeCategory(selectedCategory);
      const itemsLower = selectedItems.map((i) => i.toLowerCase());

      const mapInstitute = (inst: any): RecommendedInstitute => ({
        _id: inst._id,
        name: inst.name || "Unknown",
        email: inst.email || "",
        phone: inst.phone || "",
        address: inst.deliveryAddress || inst.address || "",
        description: inst.description || "",
        requirement: inst.itemName ? [inst.itemName] : [],
        category: inst.category || "General",
        itemName: inst.itemName,
        quantity: inst.quantity,
        urgency: inst.urgency,
        beneficiaryCount: inst.beneficiaryCount,
        previousDonations: !!inst.previousDonations,
        createdAt: inst.createdAt,
      });

      const candidateMap = new Map<string, RecommendedInstitute>();
      matched.forEach((m) => {
        const mapped = mapInstitute(m);
        if (mapped._id) candidateMap.set(mapped._id, mapped);
      });
      allInstitutes.forEach((a) => {
        if (a._id && !candidateMap.has(a._id)) {
          candidateMap.set(a._id, a);
        }
      });

      const urgencyWeight = (u?: string) => {
        const v = (u || "").toLowerCase();
        if (v === "critical") return 1;
        if (v === "high") return 0.8;
        if (v === "medium") return 0.5;
        if (v === "low") return 0.2;
        return 0.3;
      };
      const containsAny = (text?: string) => {
        const t = (text || "").toLowerCase();
        return itemsLower.some((i) => t.includes(i)) ? 1 : 0;
      };

      const scored = Array.from(candidateMap.values())
        .map((inst) => {
          const catMatch =
            targetCategory === "" ||
            targetCategory === "all" ||
            normalizeCategory(inst.category) === targetCategory
              ? 1
              : 0;
          const itemMatch =
            containsAny(inst.itemName) ||
            containsAny(inst.description) ||
            containsAny((inst.requirement || []).join(", "));
          const score =
            0.5 * catMatch +
            0.3 * itemMatch +
            0.2 * urgencyWeight(inst.urgency) +
            (inst.previousDonations ? 0.1 : 0);
          return { inst, score };
        })
        .filter((s) => s.score > 0.25)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((s) => s.inst);

      if (scored.length === 0) {
        const relaxed = Array.from(candidateMap.values())
          .map((inst) => {
            const itemMatch =
              containsAny(inst.itemName) ||
              containsAny(inst.description) ||
              containsAny((inst.requirement || []).join(", "));
            const score = 0.6 * itemMatch + 0.4 * urgencyWeight(inst.urgency);
            return { inst, score };
          })
          .filter((s) => s.score > 0.1)
          .sort((a, b) => b.score - a.score)
          .slice(0, 6)
          .map((s) => s.inst);
        setRecommendedInfoMessage("No strong matches; showing closest alternatives");
        setRecommendedInstitutes(relaxed);
      } else {
        setRecommendedInfoMessage(null);
        setRecommendedInstitutes(scored);
      }
      setShowDonationPrompt(false);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update donor name when user data is loaded
  useEffect(() => {
    if (user?.fullName) {
      setDonorName(user.fullName);
    }
  }, [user?.fullName]);

  // Donation Prompt Modal
  const DonationPromptModal = () => (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6">
          Let's Find Your Perfect Match
        </h2>

        <div className="space-y-6">
          {/* User's Name (from Clerk) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={donorName}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Donation Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What would you like to donate?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DONATION_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedItems([]);
                  }}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200
                    flex flex-col items-center gap-2
                    ${
                      selectedCategory === category.id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-200"
                    }
                  `}
                >
                  {category.icon}
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Items Selection */}
          {selectedCategory && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select specific items you'd like to donate:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DONATION_CATEGORIES.find(
                  (c) => c.id === selectedCategory
                )?.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSelectedItems((prev) =>
                        prev.includes(item)
                          ? prev.filter((i) => i !== item)
                          : [...prev, item]
                      );
                    }}
                    className={`
                      p-3 rounded-lg border text-sm transition-all duration-200
                      ${
                        selectedItems.includes(item)
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCategory) {
                      setActiveCategory(selectedCategory);
                    }
                    setShowFilteredAll(true);
                    setShowDonationPrompt(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                >
                  Browse All Matching Institutes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("");
              setSelectedItems([]);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              if (selectedItems.length > 0) {
                fetchRecommendations();
              }
            }}
            disabled={selectedItems.length === 0 || isLoading}
            className={`
              px-6 py-2 rounded-lg text-white font-medium
              ${
                selectedItems.length === 0 || isLoading
                  ? "bg-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }
              transition-all duration-200
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Finding matches...
              </span>
            ) : (
              "Find Matching Institutes"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Institute Details Modal
  const InstituteDetailsModal = () => {
    if (!selectedInstitute) return null;

    const handleDonate = async (amount: number) => {
      // Changed to open Payment Modal instead of direct Razorpay
      setCurrentDonation({
        institute: selectedInstitute.name,
        amount,
        type: "monetary",
        date: new Date().toISOString(),
      });
      setShowInstituteModal(false);
      setShowPaymentModal(true);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-indigo-800">
            <button
              onClick={() => setShowInstituteModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-6">
              <h2 className="text-2xl font-bold text-white mb-1">
                {selectedInstitute.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                  {selectedInstitute.category || "General"}
                </span>
                {selectedInstitute.previousDonations && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-white">
                    Previous Donor
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Location
                </h3>
                <p className="text-gray-900">{selectedInstitute.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Contact
                </h3>
                <p className="text-gray-900">{selectedInstitute.phone}</p>
                <p className="text-gray-900 text-sm">
                  {selectedInstitute.email}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
              <p className="text-gray-900">{selectedInstitute.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Requirements
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedInstitute.requirement?.map((req, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Donation Options */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Make a Donation
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[500, 1000, 2000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleDonate(amount)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                  >
                    <span className="text-2xl font-bold text-indigo-600">
                      ₹{amount}
                    </span>
                    <span className="text-sm text-gray-500">One-time</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleDonate(5000)}
                className="w-full mt-4 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Custom Amount
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Recommended Institutes Grid
  const RecommendedInstitutesGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendedInstitutes.map((institute) => (
        <div
          key={institute._id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-50 hover:shadow-xl transition-all duration-300 flex flex-col h-[400px]"
        >
          {/* Card Header with Gradient */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 flex flex-col justify-end">
            <h3 className="text-xl font-semibold text-white mb-2">
              {institute.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                {institute.category || "General"}
              </span>
              {institute.previousDonations && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-white">
                  Previous Donor
                </span>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
              {institute.description}
            </p>

            <div className="space-y-4">
              {institute.requirement && (
                <div className="flex flex-wrap gap-2">
                  {institute.requirement.slice(0, 3).map((req, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700"
                    >
                      {req}
                    </span>
                  ))}
                  {institute.requirement.length > 3 && (
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      +{institute.requirement.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>
                    {institute.beneficiaryCount || "N/A"} beneficiaries
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{institute.address?.split(",")[0]}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleInstituteClick(institute)}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Heart size={16} />
              Donate Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const AllInstitutesGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pagedInstitutes.map((institute) => (
        <div
          key={institute._id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-50 hover:shadow-xl transition-all duration-300 flex flex-col h-[400px]"
        >
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 flex flex-col justify-end">
            <h3 className="text-xl font-semibold text-white mb-2">
              {institute.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                {institute.category || "General"}
              </span>
              {institute.previousDonations && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-white">
                  Previous Donor
                </span>
              )}
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
              {institute.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{institute.beneficiaryCount || "N/A"} beneficiaries</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{institute.address?.split(",")[0]}</span>
              </div>
            </div>
            <button
              onClick={() => handleInstituteClick(institute)}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Heart size={16} />
              Donate Now
            </button>
          </div>
        </div>
      ))}
      {pagedInstitutes.length === 0 && (
        <div className="col-span-3 text-center text-gray-500 py-8">
          No institutes found for the selected filters.
        </div>
      )}
    </div>
  );

  const ImpactStoriesGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {impactStories.map((story: any) => (
        <div
          key={story._id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-50 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="h-40 overflow-hidden">
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-indigo-900">
                {story.title}
              </h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                {story.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm flex-1">{story.description}</p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Sparkles size={16} />
                See How It Helped
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAllInstitutes = async () => {
      try {
        const res = await axios.get(`${config.apiBaseUrl}/api/institutes`);
        if (res.data?.success && Array.isArray(res.data.institutes)) {
          const mapped: RecommendedInstitute[] = res.data.institutes.map((inst: any) => ({
            _id: inst._id,
            name: inst.name || "Unknown",
            email: inst.email || "",
            phone: inst.phone || "",
            address: inst.deliveryAddress || inst.address || "",
            description: inst.description || "",
            requirement: inst.itemName ? [inst.itemName] : [],
            category: inst.category || "General",
            itemName: inst.itemName,
            quantity: inst.quantity,
            urgency: inst.urgency,
            beneficiaryCount: inst.beneficiaryCount,
            previousDonations: !!inst.previousDonations,
            createdAt: inst.createdAt,
          }));
          setAllInstitutes(mapped);
        }
      } catch (e) {
        console.error("Error fetching institutes:", e);
      }
    };
    fetchAllInstitutes();
  }, []);

  useEffect(() => {
    const fetchImpactStories = async () => {
      try {
        const res = await axios.get(`${config.apiBaseUrl}/api/impact-stories`);
        if (res.data?.success && Array.isArray(res.data.stories)) {
          setImpactStories(res.data.stories);
        }
      } catch (e) {
        console.error("Error fetching impact stories:", e);
      }
    };
    fetchImpactStories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {showDonationPrompt && <DonationPromptModal />}
      {showInstituteModal && <InstituteDetailsModal />}

      {/* Payment Modal */}
      {showPaymentModal && currentDonation && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide relative">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Donation Summary
                  </h2>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-indigo-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-lg bg-white flex items-center justify-center">
                      <Heart size={32} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-indigo-900">
                        {currentDonation.institute}
                      </h3>
                      <p className="text-indigo-600">
                        {currentDonation.type === "monetary"
                          ? "Fixed Amount Donation"
                          : "Resource Donation"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentDonation.type === "monetary" ? (
                      <div className="flex justify-between items-center py-2 border-b border-indigo-100">
                        <span className="text-indigo-900">Donation Amount</span>
                        <span className="font-semibold text-indigo-900">
                          ₹{currentDonation.amount}
                        </span>
                      </div>
                    ) : (
                      <>
                        {currentDonation.resources?.map(
                          (resource: any, index: number) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 border-b border-indigo-100"
                            >
                              <span className="text-indigo-900">
                                {resource.name} x {resource.quantity}
                              </span>
                              <span className="font-semibold text-indigo-900">
                                ₹{resource.amount}
                              </span>
                            </div>
                          )
                        )}
                        <div className="flex justify-between items-center pt-3">
                          <span className="font-medium text-indigo-900">
                            Total Amount
                          </span>
                          <span className="font-semibold text-indigo-900">
                            ₹{currentDonation.totalAmount}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleRazorpayPayment(
                      currentDonation.type === "monetary"
                        ? currentDonation.amount
                        : currentDonation.totalAmount
                    )
                  }
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showDonationPrompt && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-indigo-900">
              Recommended Institutes for Your Donation
            </h1>
            {recommendedInfoMessage && (
              <span className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                {recommendedInfoMessage}
              </span>
            )}
            <button
              onClick={() => setShowDonationPrompt(true)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
            >
              Change Donation
            </button>
          </div>
          <RecommendedInstitutesGrid />
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-indigo-900">
                Browse Institutes
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowFilteredAll((v) => !v);
                    if (!showFilteredAll && selectedCategory) {
                      setActiveCategory(selectedCategory);
                    }
                    setPageIndex(0);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    showFilteredAll
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  }`}
                  title="Toggle filtering All Institutes by your selection"
                >
                  {showFilteredAll ? "Showing Matching Institutes" : "Show Matching Institutes"}
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description, address"
                  className="px-3 py-2 border rounded-lg text-sm w-64"
                />
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPageIndex(0);
                  }}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="recent">Recent</option>
                  <option value="beneficiaries">Beneficiaries</option>
                  <option value="urgency">Urgency</option>
                  <option value="name">Name</option>
                </select>
                <span className="text-sm text-gray-600">
                  {displayedAllInstitutes.length} results
                </span>
              </div>
            </div>
            <AllInstitutesGrid />
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
                className="px-3 py-1 border rounded-md text-sm"
                disabled={pageIndex === 0}
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">
                Page {pageIndex + 1} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPageIndex((p) => Math.min(p + 1, totalPages - 1))
                }
                className="px-3 py-1 border rounded-md text-sm"
                disabled={pageIndex >= totalPages - 1}
              >
                Next
              </button>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageIndex(0);
                }}
                className="ml-4 px-3 py-1 border rounded-md text-sm"
              >
                <option value={6}>6 / page</option>
                <option value={9}>9 / page</option>
                <option value={12}>12 / page</option>
              </select>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-indigo-900">
                Impact Stories
              </h2>
            </div>
            <ImpactStoriesGrid />
          </div>
        </>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <div className="fixed inset-0 z-[60]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.2}
                style={{ position: "fixed", top: 0, left: 0, zIndex: 61 }}
              />

              <div className="fixed inset-0 z-[62] flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", duration: 1.5 }}
                  className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl"
                >
                  <div className="text-center relative">
                    {/* Close button */}
                    <button
                      onClick={() => setShowSuccess(false)}
                      className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-3xl font-bold text-gray-900">
                        Thank You for Your Generosity!
                      </h3>
                      <p className="text-lg text-gray-600">
                        Your donation of ₹
                        {currentDonation?.amount ||
                          currentDonation?.totalAmount}{" "}
                        will make a meaningful impact in someone's life.
                      </p>
                    </motion.div>

                    <motion.div
                      className="flex justify-center gap-6 my-8"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[Heart, Star, Sparkles].map((Icon, index) => (
                        <motion.div
                          key={index}
                          animate={{
                            y: [0, -10, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                          className="p-3 bg-indigo-50 rounded-full"
                        >
                          <Icon className="w-8 h-8 text-indigo-600" />
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-4"
                    >
                      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                        <p>
                          A confirmation email has been sent to your registered
                          email address.
                        </p>
                        <p className="mt-1">
                          Transaction ID: {currentDonation?.paymentId}
                        </p>
                      </div>

                      <Button
                        onClick={generateReceipt}
                        className="mt-4"
                        variant="outline"
                      >
                        View Receipt
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrowseDonate;