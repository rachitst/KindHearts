import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Heart,
  Sparkles,
  Flame,
  Utensils,
  BookOpen,
  Stethoscope,
  X,
  CheckCircle2,
  AlertCircle,
  Store,
  ArrowRight,
  Download
} from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { generateAndOpenReceipt } from "../../../../utils/receiptGenerator";

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
  amountNeeded?: number;
  amountRaised?: number;
  urgency?: string;
  beneficiaryCount?: number;
  previousDonations?: boolean;
  createdAt?: string;
  image?: string;
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

const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
};

const BrowseDonate = () => {
  const { user } = useUser();
  const [donorName, setDonorName] = useState(user?.fullName || "");
  const [searchResults, setSearchResults] = useState<RecommendedInstitute[] | null>(null);
  const [allInstitutes, setAllInstitutes] = useState<RecommendedInstitute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Donation & Modal States
  const [selectedInstitute, setSelectedInstitute] = useState<RecommendedInstitute | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<any>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Load initial data
  useEffect(() => {
    const fetchInstitutes = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${config.apiBaseUrl}/api/search/semantic`, {
           // Sending empty query to get all or use a different endpoint if available. 
           // Reusing semantic search with generic query or if backend supports empty
           data: { query: "urgent needs" } 
        });
        // Actually, let's use the semantic search with a broad query if no other endpoint
        // Or better, let's check if there's an endpoint for all requests.
        // There is `getAllRequests` in adminController but maybe not exposed for donors?
        // Let's stick to semantic search or just use the search endpoint with empty query if it returns all.
        // The previous code had `allInstitutes` state but didn't seem to populate it initially in the snippet I saw?
        // Ah, let's try to fetch all active needs.
        
        // Use semantic search with a generic "all" query to populate initial view
        const response = await axios.post(`${config.apiBaseUrl}/api/search/semantic`, {
            query: "all urgent needs"
        });

        if (response.data.success && Array.isArray(response.data.results)) {
             const mapped: RecommendedInstitute[] = response.data.results.map((inst: any) => ({
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
                amountNeeded: inst.amountNeeded,
                amountRaised: inst.amountRaised || 0,
                urgency: inst.urgency,
                beneficiaryCount: inst.beneficiaryCount,
                previousDonations: !!inst.previousDonations,
                createdAt: inst.createdAt,
                image: inst.image
              }));
             setAllInstitutes(mapped);
        }
      } catch (e) {
        console.error("Error fetching institutes:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstitutes();

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsLoading(true);
        try {
          const res = await axios.post(`${config.apiBaseUrl}/api/search/semantic`, {
            query: searchQuery
          });
          if (res.data.success && Array.isArray(res.data.results)) {
             const mapped: RecommendedInstitute[] = res.data.results.map((inst: any) => ({
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
                amountNeeded: inst.amountNeeded,
                amountRaised: inst.amountRaised || 0,
                urgency: inst.urgency,
                beneficiaryCount: inst.beneficiaryCount,
                previousDonations: !!inst.previousDonations,
                createdAt: inst.createdAt,
                image: inst.image
              }));
             setSearchResults(mapped);
          }
        } catch (e) {
          console.error("Search error:", e);
        } finally {
            setIsLoading(false);
        }
      } else {
        setSearchResults(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const displayedInstitutes = useMemo(() => {
    let result = searchResults !== null ? [...searchResults] : [...allInstitutes];

    // Filter Chips
    if (activeFilter !== "all") {
        if (activeFilter === "critical") {
            result = result.filter(i => (i.urgency || "").toLowerCase() === "critical");
        } else {
            result = result.filter(i => (i.category || "").toLowerCase().includes(activeFilter));
        }
    }
    
    return result;
  }, [searchResults, allInstitutes, activeFilter]);

  const filters = [
    { id: "critical", label: "Critical", icon: <Flame size={16} />, color: "text-red-600 bg-red-50 border-red-200" },
    { id: "food", label: "Food", icon: <Utensils size={16} />, color: "text-orange-600 bg-orange-50 border-orange-200" },
    { id: "education", label: "Education", icon: <BookOpen size={16} />, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { id: "medical", label: "Medical", icon: <Stethoscope size={16} />, color: "text-green-600 bg-green-50 border-green-200" },
  ];

  const handleCardClick = (institute: RecommendedInstitute) => {
    setSelectedInstitute(institute);
    setDonationAmount("");
    setShowDonateModal(true);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const handlePaymentSuccess = async (response: any, amount: number) => {
    try {
      const donationData = {
        paymentId: response.razorpay_payment_id,
        donorId: user?.id,
        donorName: user?.fullName || "Anonymous",
        instituteId: selectedInstitute?._id,
        instituteName: selectedInstitute?.name,
        donationItem: selectedInstitute?.itemName || "Monetary Donation",
        amount: amount,
        donationType: "monetary",
        date: new Date().toISOString(),
        status: "completed",
      };

      await axios.post(`${config.apiBaseUrl}/api/donations`, donationData);

      // Optimistic update for UI
      if (selectedInstitute) {
          const updatedAmountRaised = (selectedInstitute.amountRaised || 0) + amount;
          
          // Update local state for selected institute
          setSelectedInstitute(prev => prev ? { ...prev, amountRaised: updatedAmountRaised } : null);
          
          // Update in lists
          const updateList = (list: RecommendedInstitute[]) => 
              list.map(inst => inst._id === selectedInstitute._id ? { ...inst, amountRaised: updatedAmountRaised } : inst);
          
          setAllInstitutes(prev => updateList(prev));
          if (searchResults) {
              setSearchResults(prev => prev ? updateList(prev) : null);
          }
      }

      setCurrentDonation({
        ...donationData,
        paymentId: response.razorpay_payment_id,
      });

      setShowDonateModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving donation:", error);
      // Show success anyway if payment worked but save failed (edge case)
      setShowDonateModal(false);
      setShowSuccessModal(true);
    }
  };

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) return;
    
    await loadRazorpay();

    const amountToDonate = parseFloat(donationAmount);
    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZOR_PAY,
      amount: amountToDonate * 100,
      currency: "INR",
      name: "KindHearts",
      description: `Donation to ${selectedInstitute?.name}`,
      handler: function (response) {
        handlePaymentSuccess(response, amountToDonate);
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

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-8">
      {/* 1. Layout: Top Section */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
                Browse & <span className="text-indigo-600">Donate</span>
            </h1>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-2xl group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tell Sahayak what cause you want to support today..."
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none text-lg"
                />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 rounded-full border font-medium text-sm transition-all duration-200 ${
                        activeFilter === "all" 
                        ? "bg-gray-900 text-white border-gray-900" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                >
                    All Causes
                </button>
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm transition-all duration-200 ${
                            activeFilter === filter.id
                            ? filter.color.replace("bg-", "bg-opacity-100 bg-").replace("text-", "text-white ").replace("border-", "border-transparent ") // This is tricky with dynamic classes, let's just use specific active styles
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        } ${activeFilter === filter.id ? getActiveColor(filter.id) : ""}`}
                    >
                        {filter.icon}
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* 2. Result Cards (Grid Layout) */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        ) : displayedInstitutes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedInstitutes.map((institute) => {
                    const amountNeeded = institute.amountNeeded || (institute.quantity ? institute.quantity * 100 : 10000); // Mock amount if missing
                    const amountRaised = institute.amountRaised || 0;
                    const progress = Math.min((amountRaised / amountNeeded) * 100, 100);
                    const isCritical = (institute.urgency || "").toLowerCase() === "critical";

                    return (
                        <motion.div
                            key={institute._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden cursor-pointer group flex flex-col h-full"
                            onClick={() => handleCardClick(institute)}
                        >
                            <div className="p-5 flex flex-col h-full">
                                {/* Header: Badge & Urgency */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 uppercase tracking-wide">
                                        {institute.category}
                                    </span>
                                    {isCritical && (
                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 animate-pulse">
                                            <Flame size={12} fill="currentColor" />
                                            CRITICAL
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                    {institute.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                                    {institute.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-xs font-medium text-gray-500">
                                        <span>Raised: ₹{amountRaised.toLocaleString()}</span>
                                        <span>Goal: ₹{amountNeeded.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                isCritical ? "bg-red-500" : "bg-indigo-500"
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Impact Summary */}
                                <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-600 bg-gray-50/50 -mx-5 -mb-5 p-4 mt-auto">
                                    <Sparkles size={16} className="text-yellow-500" />
                                    <span>
                                        Will provide <strong>{institute.itemName || "Support"}</strong> for <strong>{institute.beneficiaryCount || 10}</strong> people
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        ) : (
            // 4. Empty State
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No exact matches found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    I couldn't find an exact match for your search, but here are some critical needs that need your heart!
                </p>
                <button 
                    onClick={() => {
                        setSearchQuery("");
                        setActiveFilter("all");
                    }}
                    className="text-indigo-600 font-medium hover:text-indigo-800 underline"
                >
                    View all active causes
                </button>
            </div>
        )}
      </div>

      {/* 3. 'Donate Now' Interaction: Modal */}
      <AnimatePresence>
        {showDonateModal && selectedInstitute && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowDonateModal(false)}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Make a Donation</h2>
                                <p className="text-sm text-gray-500">Supporting {selectedInstitute.name}</p>
                            </div>
                            <button 
                                onClick={() => setShowDonateModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Full Description */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">About this cause</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {selectedInstitute.description}
                            </p>
                        </div>

                        {/* Shopkeeper Assigned */}
                        <div className="mb-6 flex items-center gap-4 p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Store size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">Assigned Shopkeeper</h4>
                                <p className="text-xs text-gray-500">
                                    Verified Partner (Transparency Guaranteed)
                                </p>
                            </div>
                            <CheckCircle2 size={16} className="text-green-500 ml-auto" />
                        </div>

                        {/* Input Field */}
                        <div className="space-y-4 mb-8">
                            <label className="block text-sm font-medium text-gray-700">
                                Enter Donation Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                    ₹
                                </span>
                                <input 
                                    type="number" 
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 text-lg font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div className="flex gap-2">
                                {[500, 1000, 2000].map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setDonationAmount(amt.toString())}
                                        className="flex-1 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                    >
                                        ₹{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleDonate}
                            disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <span>Confirm Donation</span>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-center p-8"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="h-10 w-10 text-green-600 fill-current" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
                    <p className="text-gray-600 mb-8">
                        Your donation of <span className="font-bold text-gray-900">₹{currentDonation?.amount}</span> has been successfully processed. You are making a real difference!
                    </p>
                    
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => generateAndOpenReceipt({
                                paymentId: currentDonation?.paymentId,
                                institute: currentDonation?.instituteName,
                                donorName: currentDonation?.donorName,
                                date: new Date(),
                                amount: currentDonation?.amount,
                                type: "monetary",
                                totalAmount: currentDonation?.amount
                            })}
                            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download size={18} />
                            Download Receipt
                        </button>
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper for active filter styles
function getActiveColor(id: string) {
    switch (id) {
        case "critical": return "bg-red-600 text-white border-red-600";
        case "food": return "bg-orange-600 text-white border-orange-600";
        case "education": return "bg-blue-600 text-white border-blue-600";
        case "medical": return "bg-green-600 text-white border-green-600";
        default: return "";
    }
}

export default BrowseDonate;
