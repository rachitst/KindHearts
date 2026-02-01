import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Users, 
  Heart, 
  TrendingUp, 
  Calendar,
  ChevronDown,
  FileText,
  MapPin
} from 'lucide-react';

const ImpactReports = () => {
  const [reportPeriod, setReportPeriod] = useState('2025');

  // Sample data
  const impactStats = {
    totalBeneficiaries: '2,450',
    causesSupported: '12',
    institutesHelped: '8',
    totalImpact: '₹12,750'
  };

  const monthlyDonations = [
    { month: 'Jan', amount: 950 },
    { month: 'Feb', amount: 1200 },
    { month: 'Mar', amount: 800 },
    { month: 'Apr', amount: 1400 },
    { month: 'May', amount: 1100 }
  ];

  const impactBreakdown = [
    {
      id: 1,
      category: 'Healthcare',
      amount: '₹5,250',
      beneficiaries: '850',
      description: 'Provided medical supplies and support to local hospitals',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      category: 'Education',
      amount: '₹3,800',
      beneficiaries: '420',
      description: 'Funded scholarships and educational resources',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      category: 'Food Security',
      amount: '₹2,200',
      beneficiaries: '980',
      description: 'Supported local food banks and meal programs',
      image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 4,
      category: 'Animal Welfare',
      amount: '₹1,500',
      beneficiaries: '200',
      description: 'Helped animal shelters with supplies and care',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  const taxReports = [
    { id: 1, year: '2025', quarter: 'Q1', amount: '₹3,450', status: 'available' },
    { id: 2, year: '2024', quarter: 'Q4', amount: '₹2,800', status: 'available' },
    { id: 3, year: '2024', quarter: 'Q3', amount: '₹3,100', status: 'available' },
  ];

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Beneficiaries</p>
              <h3 className="text-2xl font-bold mt-1">{impactStats.totalBeneficiaries}</h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Users size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Causes Supported</p>
              <h3 className="text-2xl font-bold mt-1">{impactStats.causesSupported}</h3>
            </div>
            <div className="p-3 rounded-lg bg-rose-50">
              <Heart size={24} className="text-rose-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Institutes Helped</p>
              <h3 className="text-2xl font-bold mt-1">{impactStats.institutesHelped}</h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50">
              <MapPin size={24} className="text-emerald-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Impact</p>
              <h3 className="text-2xl font-bold mt-1">{impactStats.totalImpact}</h3>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <TrendingUp size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Donation Trend</h2>
            <div className="relative">
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div className="h-64 flex items-end justify-between">
            {monthlyDonations.map((month) => (
              <div key={month.month} className="flex flex-col items-center space-y-2">
                <div 
                  className="w-12 bg-rose-100 rounded-t-lg transition-all duration-300 hover:bg-rose-200"
                  style={{ height: `₹{(month.amount / 1500) * 100}%` }}
                >
                  <div className="w-full bg-rose-500 h-1 rounded-t-lg" />
                </div>
                <span className="text-sm text-gray-600">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Benefit Reports */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Benefit Reports</h2>
          <div className="space-y-4">
            {taxReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-900">{report.quarter} {report.year}</span>
                  </div>
                  <span className="text-sm text-gray-500 mt-1 block">{report.amount}</span>
                </div>
                <button className="text-rose-600 hover:text-rose-800 flex items-center space-x-1">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {impactBreakdown.map((impact) => (
            <div key={impact.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img 
                src={impact.image} 
                alt={impact.category} 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{impact.category}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Users size={16} className="mr-1" />
                  <span>{impact.beneficiaries} beneficiaries</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">{impact.description}</div>
                <div className="mt-3 font-medium text-rose-600">{impact.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactReports; 