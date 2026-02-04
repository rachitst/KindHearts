import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from 'axios';
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
  User,
  BookOpen,
  Utensils,
  Shirt,
  Stethoscope,
  Download,
} from "lucide-react";
import { Button } from "../components/Button";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { config } from "../../../../config/env";
import { useUser } from "@clerk/clerk-react";
import { jsPDF } from "jspdf";

interface Need {
  id: number;
  name: string;
  amount: number;
  type: "monetary" | "resource";
}

interface Institute {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  needs: Need[];
}

interface DonationOption {
  id: number;
  amount: number;
  label: string;
  description: string;
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

interface Receipt {
  institute: string;
  amount: number;
  date: string;
  transactionId: string;
  donationType: string;
  paymentId: string;
}

interface RecommendedInstitute {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  requirement?: string[];
  category?: string;
  itemName?: string;
  quantity?: number;
  urgency?: string;
  beneficiaryCount?: number;
  previousDonations: boolean;
  createdAt?: string;
}

interface DonationCategory {
  id: string;
  name: string;
  items: string[];
  icon: React.ReactNode;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const DONATION_CATEGORIES: DonationCategory[] = [
  {
    id: "education",
    name: "Education",
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      "Textbooks",
      "Notebooks",
      "School Bags",
      "Stationery",
      "Uniforms",
      "Educational Toys",
      "Computers",
      "Library Books",
    ],
  },
  {
    id: "food",
    name: "Food",
    icon: <Utensils className="w-5 h-5" />,
    items: [
      "Rice",
      "Wheat",
      "Pulses",
      "Cooking Oil",
      "Vegetables",
      "Fruits",
      "Milk Products",
      "Dry Rations",
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: <Shirt className="w-5 h-5" />,
    items: [
      "Children's Wear",
      "Winter Wear",
      "School Uniforms",
      "Shoes",
      "Baby Clothes",
      "Blankets",
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: <Stethoscope className="w-5 h-5" />,
    items: [
      "Medicines",
      "Medical Equipment",
      "First Aid Kits",
      "Hygiene Products",
      "Sanitizers",
      "Face Masks",
    ],
  },
];

const BrowseDonate = () => {
  const { user } = useUser();

  const [activeCategory, setActiveCategory] = useState("all");
  const [donationType, setDonationType] = useState("all");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] =
    useState<RecommendedInstitute | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>([]);
  const [selectedDonationType, setSelectedDonationType] = useState<
    "fixed" | "resource"
  >("fixed");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [resourceQuantities, setResourceQuantities] = useState<
    Record<number, number>
  >({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showDonationPrompt, setShowDonationPrompt] = useState(true);
  const [donorName, setDonorName] = useState(user?.fullName || "");
  const [donationItem, setDonationItem] = useState("");
  const [recommendedInstitutes, setRecommendedInstitutes] = useState<
    RecommendedInstitute[]
  >([]);
  const [allInstitutes, setAllInstitutes] = useState<RecommendedInstitute[]>([]);
  const [impactStories, setImpactStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("education");
  const [selectedItems, setSelectedItems] = useState<string[]>(["Notebooks"]);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(9);
  const [showFilteredAll, setShowFilteredAll] = useState<boolean>(false);
  const [recommendedInfoMessage, setRecommendedInfoMessage] = useState<string | null>(null);
  const displayedAllInstitutes = React.useMemo(() => {
    let list = allInstitutes;
    if (showFilteredAll) {
      const cat = (selectedCategory || "").toLowerCase();
      const itemsLower = selectedItems.map((i) => i.toLowerCase());
      const containsAny = (text?: string) => {
        const t = (text || "").toLowerCase();
        return itemsLower.some((i) => t.includes(i));
      };
      list = list.filter((inst) => {
        const catMatch =
          cat === "" || cat === "all"
            ? true
            : (inst.category || "").toLowerCase() === cat;
        const itemMatch =
          containsAny(inst.itemName) ||
          containsAny(inst.description) ||
          containsAny((inst.requirement || []).join(", "));
        return catMatch && itemMatch;
      });
    }
    if (activeCategory !== "all") {
      list = list.filter(
        (inst) =>
          inst.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (inst) =>
          inst.name.toLowerCase().includes(q) ||
          inst.description?.toLowerCase().includes(q) ||
          inst.address?.toLowerCase().includes(q)
      );
    }
    const urgencyRank: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };
    if (sortBy === "recent") {
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sortBy === "beneficiaries") {
      list = [...list].sort(
        (a, b) => (b.beneficiaryCount || 0) - (a.beneficiaryCount || 0)
      );
    } else if (sortBy === "urgency") {
      list = [...list].sort(
        (a, b) =>
          (urgencyRank[(b.urgency || "").toLowerCase()] || 0) -
          (urgencyRank[(a.urgency || "").toLowerCase()] || 0)
      );
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [allInstitutes, activeCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(displayedAllInstitutes.length / pageSize) || 1;
  const pagedInstitutes = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return displayedAllInstitutes.slice(start, start + pageSize);
  }, [displayedAllInstitutes, pageIndex, pageSize]);

  const fixedAmountOptions: DonationOption[] = [
    {
      id: 1,
      amount: 100,
      label: "Basic Support",
      description: "Helps provide essential supplies",
    },
    {
      id: 2,
      amount: 500,
      label: "Regular Donor",
      description: "Supports monthly programs",
    },
    {
      id: 3,
      amount: 1000,
      label: "Major Contributor",
      description: "Enables significant impact",
    },
    {
      id: 4,
      amount: 5000,
      label: "Champion Donor",
      description: "Drives major initiatives",
    },
  ];

  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

  // Deprecated legacy filtering (removed - now using API-driven AllInstitutes with filters)

  const handleInstituteClick = (institute: RecommendedInstitute) => {
    setSelectedInstitute(institute);
    setShowInstituteModal(true);
  };

  // Sample data
  const categories = [
    { id: "all", name: "All Institutes" },
    { id: "education", name: "Education" },
    { id: "healthcare", name: "Healthcare" },
    { id: "environment", name: "Environment" },
    { id: "animals", name: "Animal Welfare" },
    { id: "community", name: "Community" },
  ];

  const handleDonate = () => {
    let donationDetails;
    if (selectedDonationType === "fixed" && selectedAmount) {
      donationDetails = {
        type: "monetary",
        amount: selectedAmount,
        institute: selectedInstitute.name,
        description: "Fixed Amount Donation",
      };
    } else if (selectedDonationType === "resource") {
      const selectedResources = Object.entries(resourceQuantities)
        .filter(([_, quantity]) => quantity > 0)
        .map(([needId, quantity]) => {
          const resource = selectedInstitute.needs.find(
            (n: Need) => n.id === Number(needId)
          );
          return {
            name: resource?.name,
            quantity,
            amount: (resource?.amount || 0) * quantity,
          };
        });

      donationDetails = {
        type: "resource",
        resources: selectedResources,
        institute: selectedInstitute.name,
        totalAmount: selectedResources.reduce(
          (sum, item) => sum + item.amount,
          0
        ),
      };
    }

    setCurrentDonation(donationDetails);
    setShowPaymentModal(true);
    setShowInstituteModal(false);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const handlePaymentSuccess = (response: any) => {
    setShowPaymentModal(false);
    setCurrentDonation((prev) => ({
      ...prev,
      paymentId: response.razorpay_payment_id,
    }));
    const amountToSend =
      currentDonation?.type === "resource"
        ? currentDonation?.totalAmount || 0
        : currentDonation?.amount || 0;
    const payload = {
      donorName: user?.fullName || "Anonymous",
      amount: amountToSend,
      donationItem:
        currentDonation?.type === "resource"
          ? `Resources donated to ${currentDonation?.institute}`
          : `Monetary donation to ${currentDonation?.institute}`,
    };
    axios
      .post(`${config.apiBaseUrl}/api/donations`, payload)
      .then(() => {
        setShowSuccess(true);
      })
      .catch(() => {
        setShowSuccess(true);
      });
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
        name: "Donor Name",
        email: "donor@example.com",
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

  const generateReceipt = async (paymentId: string) => {
    if (!currentDonation || !paymentId) {
      alert("Missing donation information");
      return;
    }

    setIsGeneratingReceipt(true);
    try {
      // Create a temporary container for the receipt
      const receiptContainer = document.createElement("div");
      receiptContainer.style.position = "absolute";
      receiptContainer.style.left = "-9999px";
      receiptContainer.style.top = "-9999px";

      receiptContainer.innerHTML = `
        <div class="p-8 bg-white" style="width: 800px; font-family: Arial, sans-serif;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #4F46E5; padding-bottom: 1rem;">
            <h1 style="color: #4F46E5; font-size: 28px; font-weight: bold; margin-bottom: 0.5rem;">Donation Receipt</h1>
            <p style="color: #6B7280; font-size: 16px;">Tax Deductible Receipt for Charitable Donation</p>
          </div>
          
          <!-- Organization Info -->
          <div style="margin-bottom: 2rem;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: bold;">DonorConnect</h2>
            <p style="color: #4B5563; font-size: 14px; margin-top: 0.5rem;">
              123 Charity Lane<br/>
              Mumbai, Maharashtra 400001<br/>
              India<br/>
              support@donorconnect.org
            </p>
          </div>
          
          <!-- Receipt Details -->
          <div style="margin-bottom: 2rem; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; background-color: #F9FAFB;">
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-weight: bold; width: 40%;">Receipt Number</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB;">${paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Date</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB;">
                  ${new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Donor Name</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB;">${
                  user?.fullName || "Anonymous"
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; font-weight: bold;">Recipient Organization</td>
                <td style="padding: 12px 16px;">${
                  currentDonation.institute
                }</td>
              </tr>
            </table>
          </div>

          <!-- Donation Details -->
          <div style="margin-bottom: 2rem;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #4F46E5;">
                  <th style="padding: 12px 16px; color: white; text-align: left; border-radius: 8px 0 0 0;">Description</th>
                  <th style="padding: 12px 16px; color: white; text-align: right; border-radius: 0 8px 0 0;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 16px; background-color: #F9FAFB;">Charitable Donation</td>
                  <td style="padding: 16px; text-align: right; background-color: #F9FAFB; font-weight: bold;">
                    ₹${currentDonation.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
                <tr style="background-color: #F3F4F6;">
                  <td style="padding: 16px; font-weight: bold;">Total Amount</td>
                  <td style="padding: 16px; text-align: right; font-weight: bold;">
                    ₹${currentDonation.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div style="margin-top: 2rem; border-top: 2px solid #E5E7EB; padding-top: 1rem;">
            <p style="color: #4B5563; font-size: 14px; margin-bottom: 0.5rem;">
              This receipt is computer generated and does not require a physical signature.
            </p>
            <p style="color: #6B7280; font-size: 12px;">
              Thank you for your generous donation. Your contribution will make a meaningful impact.
            </p>
          </div>
        </div>
      `;

      // Add the receipt to the document
      document.body.appendChild(receiptContainer);

      try {
        // Convert to canvas
        const canvas = await html2canvas(
          receiptContainer.firstChild as HTMLElement,
          {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
          }
        );

        // Create PDF
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`donation-receipt-${paymentId}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("Failed to generate PDF");
      } finally {
        // Clean up
        document.body.removeChild(receiptContainer);
      }
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Failed to generate receipt. Please try again.");
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      // Join selected items with commas for the API call
      const itemsString = selectedItems.join(", ");
      const response = await fetch(
        `${
          config.apiBaseUrl
        }/api/llm/match-donor?donorName=${encodeURIComponent(
          user?.fullName || ""
        )}&donationItem=${encodeURIComponent(itemsString)}`
      );
      const data = await response.json();
      let matched: any[] = [];
      if (data?.success) {
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
      setCurrentDonation({
        institute: selectedInstitute.name,
        amount,
        type: "monetary",
        date: new Date().toISOString(),
      });
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZOR_PAY,
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: selectedInstitute.name,
        description: `Donation for ${selectedInstitute.name}`,
        handler: function (response) {
          handlePaymentSuccess(response);
          setShowInstituteModal(false);
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
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

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-medium">
                  {currentDonation?.paymentId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">
                  ₹{currentDonation?.amount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => generateReceipt(currentDonation?.paymentId)}
              disabled={isGeneratingReceipt}
              className="flex-1"
              variant="outline"
            >
              {isGeneratingReceipt ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download size={16} />
                  Download Receipt
                </span>
              )}
            </Button>

            <Button onClick={() => setShowSuccess(false)} variant="outline">
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BrowseDonate;
