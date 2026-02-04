import { useState, useEffect } from "react";
import {
  Home,
  Search,
  Clock,
  BarChart,
  MessageSquare,
  RefreshCw,
  Bell,
  Sparkle,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import BrowseDonate from "./pages/BrowseDonate";
import RecommendDonate from "./pages/RecommendDonate";
import MyDonations from "./pages/MyDonations";
import ImpactReports from "./pages/ImpactReports";
import ReviewsFeedback from "./pages/ReviewsFeedback";
import RecurringDonations from "./pages/RecurringDonations";
import Chatbot from "./components/chatbot/chatbot";
import OnboardingForm from "./pages/OnboardingForm";
import { UserButton, useUser } from "@clerk/clerk-react";

function App() {
  const { user, isLoaded } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Remove the hardcoded user state and use Clerk's user data
  const [userData, setUserData] = useState({
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      setUserData({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        avatar: user.imageUrl || "",
      });
      setIsAuthenticated(true);
    }
  }, [isLoaded, user]);

  const handleOnboardingComplete = (userData: any) => {
    setUserData({
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
    });
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "browse", label: "Browse & Donate", icon: <Search size={20} /> },
    { id: "recommend", label: "Recommendations", icon: <Sparkle size={20} /> },
    { id: "donations", label: "My Donations", icon: <Clock size={20} /> },
    { id: "impact", label: "Impact & Reports", icon: <BarChart size={20} /> },
    {
      id: "reviews",
      label: "Reviews & Feedback",
      icon: <MessageSquare size={20} />,
    },
    {
      id: "recurring",
      label: "Recurring Donations",
      icon: <RefreshCw size={20} />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage setActiveTab={setActiveTab} />;
      case "browse":
        return <BrowseDonate />;
      case "recommend":
        return <RecommendDonate />;
      case "donations":
        return <MyDonations />;
      case "impact":
        return <ImpactReports />;
      case "reviews":
        return <ReviewsFeedback />;
      case "recurring":
        return <RecurringDonations />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Sidebar
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-900">
              {navItems.find((item) => item.id === activeTab)?.label}
            </h2>

            {/* Notifications only */}
            <div className="flex items-center">
              <button className="p-2 mx-4 text-indigo-600 hover:bg-indigo-50 rounded-full">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-2">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonBox: "hover:opacity-80 transition-opacity",
                      userButtonTrigger: "rounded-full ring-2 ring-white/20",
                      userButtonPopoverCard:
                        "bg-white shadow-xl border border-gray-200",
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div>{renderContent()}</div>
        </div>
      </div>

      {/* Add Chatbot here */}
      <Chatbot />
    </div>
  );
}

export default App;
