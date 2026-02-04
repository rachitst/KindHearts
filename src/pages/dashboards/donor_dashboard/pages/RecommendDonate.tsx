import React, { useState, useEffect, useCallback, useRef } from "react";
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
} from "lucide-react";
import { Button } from "../components/Button";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOMServer from "react-dom/server";
import { useClerk, useUser } from "@clerk/clerk-react";

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

declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

const BrowseDonate = () => {
  const institutes = [
    {
      id: 1,
      name: "City Children's Hospital",
      category: "healthcare",
      description:
        "Supporting pediatric care and medical research for children.",
      image:
        "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      needs: [
        { id: 1, name: "Medical Supplies", amount: 150, type: "monetary" },
        { id: 2, name: "Children's Books", amount: 75, type: "resource" },
        { id: 3, name: "Toys for Patients", amount: 100, type: "resource" },
      ],
    },
    {
      id: 2,
      name: "Local Food Bank",
      category: "community",
      description:
        "Providing meals and groceries to families in need throughout the community.",
      image:
        "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      needs: [
        { id: 4, name: "Canned Goods", amount: 50, type: "resource" },
        { id: 5, name: "Fresh Produce Fund", amount: 200, type: "monetary" },
        { id: 6, name: "Volunteer Equipment", amount: 120, type: "monetary" },
      ],
    },
    {
      id: 3,
      name: "Greenville Animal Shelter",
      category: "animals",
      description:
        "Rescuing and rehoming abandoned pets and providing veterinary care.",
      image:
        "https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      needs: [
        { id: 7, name: "Pet Food", amount: 85, type: "resource" },
        { id: 8, name: "Medical Care Fund", amount: 250, type: "monetary" },
        { id: 9, name: "Shelter Supplies", amount: 120, type: "resource" },
      ],
    },
    {
      id: 4,
      name: "Westside Elementary School",
      category: "education",
      description:
        "Supporting educational programs and resources for underprivileged students.",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      needs: [
        { id: 10, name: "School Supplies", amount: 60, type: "resource" },
        { id: 11, name: "Library Books", amount: 150, type: "monetary" },
        { id: 12, name: "Technology Fund", amount: 300, type: "monetary" },
      ],
    },
    {
      id: 5,
      name: "Forest Conservation Trust",
      category: "environment",
      description:
        "Protecting local forests and promoting sustainable environmental practices.",
      image:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      needs: [
        { id: 13, name: "Tree Planting", amount: 100, type: "monetary" },
        {
          id: 14,
          name: "Conservation Equipment",
          amount: 175,
          type: "resource",
        },
        { id: 15, name: "Educational Materials", amount: 80, type: "monetary" },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");
  const [donationType, setDonationType] = useState("all");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInstitutes, setFilteredInstitutes] = useState(institutes);
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

  // Memoize the filter function to prevent infinite loop
  const filterInstitutes = useCallback(() => {
    let filtered = institutes;

    if (searchQuery) {
      filtered = filtered.filter(
        (institute) =>
          institute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          institute.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (institute) => institute.category === activeCategory
      );
    }

    if (donationType !== "all") {
      filtered = filtered.filter((institute) =>
        institute.needs.some((need: Need) => need.type === donationType)
      );
    }

    return filtered;
  }, [searchQuery, activeCategory, donationType, institutes]);

  // Update filtered institutes when filters change
  useEffect(() => {
    setFilteredInstitutes(filterInstitutes());
  }, [filterInstitutes]);

  const handleInstituteClick = (institute: any) => {
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

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Prepare donation data
      const donationData = {
        paymentId: response.razorpay_payment_id,
        donorId: user?.id,
        donorName: user?.fullName || "Anonymous",
        instituteId: selectedInstitute.id,
        instituteName: currentDonation.institute,
        donationItem:
          currentDonation.type === "monetary"
            ? "Fixed Amount"
            : currentDonation.resources.map((r: any) => r.name).join(", "),
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
      const res = await fetch(`${API_URL}/api/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });

      if (!res.ok) {
        throw new Error("Failed to save donation");
      }

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
                  {currentDonation.resources.map(
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

  const { user } = useUser();

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-indigo-100">
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-indigo-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search institutes or causes..."
              className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="grid grid-cols-2 sm:flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex gap-2 sm:ml-auto">
              <button
                onClick={() => setDonationType("all")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  donationType === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setDonationType("monetary")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  donationType === "monetary"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                Monetary
              </button>
              <button
                onClick={() => setDonationType("resource")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  donationType === "resource"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                Resources
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Institutes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutes.map((institute) => (
          <div
            key={institute.id}
            className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-indigo-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => handleInstituteClick(institute)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={institute.image}
                alt={institute.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-indigo-900/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-600">
                  {institute.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {institute.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {institute.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>120+ donors</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Local Impact</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-indigo-600">
                  {institute.needs.length} donation needs
                </span>
                <Button
                  variant="secondary"
                  className="text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInstituteClick(institute);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Institute Details Modal */}
      {showInstituteModal && selectedInstitute && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide relative"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="relative h-64">
                <img
                  src={selectedInstitute.image}
                  alt={selectedInstitute.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setShowInstituteModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-600 mb-2 inline-block">
                    {selectedInstitute.category}
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedInstitute.name}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>120+ donors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={16} />
                      <span>Local Impact</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Est. 2010</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstituteClick(selectedInstitute);
                      }}
                    >
                      <Share2 size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      className="p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstituteClick(selectedInstitute);
                      }}
                    >
                      <Heart size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open("https://institute-website.com", "_blank");
                      }}
                    >
                      Visit Website
                      <ExternalLink size={16} />
                    </Button>
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-4">
                    About the Institute
                  </h3>
                  <p className="text-gray-600">
                    {selectedInstitute.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        selectedDonationType === "fixed"
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      }`}
                      onClick={() => setSelectedDonationType("fixed")}
                    >
                      Fixed Amount Donation
                    </button>
                    <button
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        selectedDonationType === "resource"
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      }`}
                      onClick={() => setSelectedDonationType("resource")}
                    >
                      Resource Donation
                    </button>
                  </div>

                  {selectedDonationType === "fixed" ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-indigo-900">
                        Choose Donation Amount
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {fixedAmountOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedAmount(option.amount)}
                            className={`p-4 rounded-xl border transition-all ${
                              selectedAmount === option.amount
                                ? "border-indigo-600 bg-indigo-50"
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                          >
                            <div className="text-lg font-semibold text-indigo-900">
                              ₹{option.amount}
                            </div>
                            <div className="text-sm font-medium text-indigo-600">
                              {option.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Or enter custom amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            className="pl-8 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter amount"
                            value={selectedAmount || ""}
                            onChange={(e) =>
                              setSelectedAmount(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-indigo-900">
                        Select Resources & Quantity
                      </h3>
                      <div className="space-y-3">
                        {selectedInstitute.needs
                          .filter((need) => need.type === "resource")
                          .map((need) => (
                            <div
                              key={need.id}
                              className="flex items-center justify-between p-4 rounded-xl border border-gray-200"
                            >
                              <div>
                                <h4 className="font-medium text-indigo-900">
                                  {need.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  ₹{need.amount} per resource
                                </p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button
                                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setResourceQuantities((prev) => ({
                                      ...prev,
                                      [need.id]: Math.max(
                                        0,
                                        (prev[need.id] || 0) - 1
                                      ),
                                    }));
                                  }}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  className="w-16 text-center border border-gray-200 rounded-lg"
                                  value={resourceQuantities[need.id] || 0}
                                  onChange={(e) => {
                                    const quantity = Number(e.target.value);
                                    setResourceQuantities((prev) => ({
                                      ...prev,
                                      [need.id]: Math.max(0, quantity),
                                    }));
                                  }}
                                />
                                <button
                                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setResourceQuantities((prev) => ({
                                      ...prev,
                                      [need.id]: (prev[need.id] || 0) + 1,
                                    }));
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowInstituteModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleDonate}
                      disabled={
                        (selectedDonationType === "fixed" && !selectedAmount) ||
                        (selectedDonationType === "resource" &&
                          Object.values(resourceQuantities).every((q) => !q))
                      }
                    >
                      Donate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                        {currentDonation.resources.map(
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
