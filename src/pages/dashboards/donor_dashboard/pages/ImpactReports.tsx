import React, { useEffect, useState, useRef } from 'react';
import { useUser } from "@clerk/clerk-react";
import { 
  Users, 
  Heart, 
  TrendingUp, 
  MapPin,
  Sparkles,
  Share2,
  Download,
  Utensils,
  BookOpen,
  Pill,
  Box,
  Calendar,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import axios from 'axios';
import { motion } from "framer-motion";
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
};

interface ImpactStats {
    livesImpacted: number;
    primaryCause: string;
    streak: number;
    cities: number;
}

interface DonationEvent {
    _id: string;
    date: string;
    amount: number;
    donationItem: string;
    instituteName?: string;
    createdAt: string;
    type: string;
}

const ImpactReports = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<ImpactStats>({
      livesImpacted: 0,
      primaryCause: "Loading...",
      streak: 0,
      cities: 0
  });
  const [story, setStory] = useState<string>("");
  const [donations, setDonations] = useState<DonationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const storyCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const fetchData = async () => {
          if (!user) return;
          try {
              // 1. Fetch Impact Summary (Stats + AI Story)
              const summaryRes = await axios.get(`${config.apiBaseUrl}/api/donors/${user.id}/impact-summary`);
              if (summaryRes.data.success) {
                  setStats(summaryRes.data.stats);
                  setStory(summaryRes.data.summary);
              }

              // 2. Fetch History for Timeline
              const historyRes = await axios.get(`${config.apiBaseUrl}/api/donors/${user.id}/history`);
              if (historyRes.data.success) {
                  setDonations(historyRes.data.donations);
              }
          } catch (error) {
              console.error("Error fetching impact data:", error);
          } finally {
              setLoading(false);
          }
      };
      
      fetchData();
  }, [user]);

  const downloadImpactCard = async () => {
    if (!storyCardRef.current) return;
    
    try {
        const canvas = await html2canvas(storyCardRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        // Simple download image for social sharing
        const link = document.createElement('a');
        link.download = 'My_KindHearts_Impact.png';
        link.href = imgData;
        link.click();
        
        // Or generate PDF if preferred
        // const pdf = new jsPDF();
        // pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        // pdf.save("impact-report.pdf");
    } catch (err) {
        console.error("Download failed", err);
    }
  };

  const downloadExcel = () => {
    // 1. Prepare Data for Excel
    const summaryData = [
      ["KindHearts Impact Report"],
      ["Generated on", new Date().toLocaleDateString()],
      ["Donor Name", user?.fullName || "Donor"],
      [],
      ["Impact Summary"],
      ["Lives Impacted", stats.livesImpacted],
      ["Primary Cause", stats.primaryCause],
      ["Streak", `${stats.streak} Months`],
      ["Cities Reached", stats.cities],
      [],
      ["Impact Story", story]
    ];

    const historyData = [
        ["Date", "Item", "Amount (INR)", "Institute", "Impact Estimate"],
        ...donations.map(d => [
            new Date(d.createdAt).toLocaleDateString(),
            d.donationItem || "Donation",
            d.amount,
            d.instituteName || "General Fund",
            `~${Math.floor(d.amount / 50)} Lives`
        ])
    ];

    // 2. Create Workbook
    const wb = XLSX.utils.book_new();
    
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    const wsHistory = XLSX.utils.aoa_to_sheet(historyData);

    // Auto-width for history columns
    const wscols = [
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 30 },
        { wch: 20 }
    ];
    wsHistory['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    XLSX.utils.book_append_sheet(wb, wsHistory, "Donation History");

    // 3. Download
    XLSX.writeFile(wb, "KindHearts_Impact_Report.xlsx");
  };

  const getCategoryIcon = (item: string) => {
      const lower = item.toLowerCase();
      if (lower.includes('food') || lower.includes('rice') || lower.includes('meal')) return <Utensils className="w-5 h-5 text-white" />;
      if (lower.includes('book') || lower.includes('pen') || lower.includes('edu')) return <BookOpen className="w-5 h-5 text-white" />;
      if (lower.includes('med') || lower.includes('pill') || lower.includes('health')) return <Pill className="w-5 h-5 text-white" />;
      return <Box className="w-5 h-5 text-white" />;
  };

  const getCategoryColor = (item: string) => {
      const lower = item.toLowerCase();
      if (lower.includes('food') || lower.includes('rice')) return "bg-orange-500";
      if (lower.includes('book') || lower.includes('edu')) return "bg-blue-500";
      if (lower.includes('med')) return "bg-green-500";
      return "bg-indigo-500";
  };

  if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-gray-500 animate-pulse">Weaving your impact story...</p>
            </div>
        </div>
      );
  }

  if (donations.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Impact Yet</h2>
            <p className="text-gray-500 max-w-md mb-8">
                Your journey of kindness hasn't started yet. The world is waiting for your first step!
            </p>
            <a href="/donor/browse" className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
                Start Donating <ArrowRight size={20} />
            </a>
        </div>
      );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* 1. Impact Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
              { label: "Lives Impacted", value: stats.livesImpacted, icon: Users, color: "bg-blue-50 text-blue-600" },
              { label: "Primary Cause", value: stats.primaryCause, icon: Heart, color: "bg-rose-50 text-rose-600" },
              { label: "Month Streak", value: `${stats.streak} Mo`, icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
              { label: "Cities Reached", value: stats.cities, icon: MapPin, color: "bg-emerald-50 text-emerald-600" }
          ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
              >
                  <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-gray-900 capitalize">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon size={24} />
                  </div>
              </motion.div>
          ))}
      </div>

      {/* 2. AI Impact Story Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
      >
          <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 p-24 bg-pink-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-200 font-medium tracking-wide text-sm uppercase">
                      <Sparkles size={16} />
                      Your 2025 Impact Story
                  </div>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed font-serif italic opacity-95">
                      "{story}"
                  </p>
                  <div className="pt-4 flex gap-3">
                    <button 
                        onClick={downloadImpactCard}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all text-sm font-medium border border-white/10"
                    >
                        <Share2 size={16} />
                        Share Story
                    </button>
                  </div>
              </div>
              
              {/* Hidden Card for Download Generation - Moved to fixed off-screen to avoid overlap */}
              <div className="fixed left-[-9999px] top-0 pointer-events-none">
                <div ref={storyCardRef} className="w-[600px] p-10 bg-gradient-to-br from-indigo-600 to-purple-800 text-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-white p-2 rounded-lg">
                            <Heart className="text-indigo-600 w-8 h-8 fill-current" />
                        </div>
                        <h1 className="text-3xl font-bold">KindHearts Impact</h1>
                    </div>
                    <p className="text-2xl font-serif italic leading-relaxed mb-8">"{story}"</p>
                    <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                        <div>
                            <p className="text-indigo-200 text-sm">Lives Impacted</p>
                            <p className="text-3xl font-bold">{stats.livesImpacted}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-sm">Cause</p>
                            <p className="text-3xl font-bold capitalize">{stats.primaryCause}</p>
                        </div>
                    </div>
                </div>
              </div>

          </div>
      </motion.div>

      {/* 3. Narrative Timeline */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Your Journey of Kindness
            </h3>
            <button 
                onClick={downloadExcel}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-all text-sm font-medium shadow-sm"
            >
                <FileSpreadsheet size={16} />
                Download Report
            </button>
          </div>
          
          <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-100"></div>

              <div className="space-y-8">
                  {donations.map((donation, idx) => (
                      <motion.div 
                        key={donation._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative flex gap-6 group"
                      >
                          {/* Timeline Node */}
                          <div className={`
                              relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0
                              ${getCategoryColor(donation.donationItem)} shadow-lg shadow-indigo-100
                              group-hover:scale-110 transition-transform duration-300
                          `}>
                              {getCategoryIcon(donation.donationItem)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-2">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                  <h4 className="text-lg font-bold text-gray-900">
                                      Provided {donation.donationItem}
                                  </h4>
                                  <span className="text-sm font-medium text-gray-400">
                                      {new Date(donation.createdAt).toLocaleDateString('en-US', { 
                                          year: 'numeric', month: 'long', day: 'numeric' 
                                      })}
                                  </span>
                              </div>
                              
                              <p className="text-gray-600 mb-3">
                                  You donated <span className="font-bold text-gray-900">₹{donation.amount}</span> to {donation.instituteName || "a local institute"}, making a direct difference in their daily operations.
                              </p>

                              {/* Mini Impact Chip */}
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
                                  <Sparkles size={12} className="text-yellow-500" />
                                  Impact: ~{Math.floor(donation.amount / 50)} Lives
                              </div>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </div>

    </div>
  );
};

export default ImpactReports;
