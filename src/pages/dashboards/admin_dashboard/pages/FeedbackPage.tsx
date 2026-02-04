import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Star, Search, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Feedback {
  _id: string;
  name: string;
  createdAt: string;
  rating: number;
  message: string;
  role: string;
  // type: 'general' | 'service' | 'app';
  // status: 'new' | 'reviewed' | 'resolved' | 'archived';
  // response?: string;
}

const FeedbackPage: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeedbackCount, setNewFeedbackCount] = useState(0);
  const [resolvedFeedbackCount, setResolvedFeedbackCount] = useState(0);
  
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback');
        if (response.data.success) {
          setFeedback(response.data.feedbacks);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  // Filter feedback excluding archived items unless specifically requested
  const filteredFeedback = feedback.filter(item => {
    // const matchesType = typeFilter === 'all' || item.type === typeFilter;
    // const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = 
      item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeedback = filteredFeedback.slice(startIndex, startIndex + itemsPerPage);

  // Stats calculations
  const totalFeedback = feedback.length;
  const averageRating = totalFeedback > 0 
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(1)
    : '0.0';
  // const newFeedbackCount = feedback.filter(f => f.status === 'new').length;
  // const resolvedFeedbackCount = feedback.filter(f => f.status === 'resolved').length;
  
  // Handlers
  const handleResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedback) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFeedback(prevFeedback => 
        prevFeedback.map(f => 
          f._id === selectedFeedback._id 
            ? { ...f, status: 'resolved', response: responseText }
            : f
        )
      );
      
      // Close modal
      setSelectedFeedback(null);
      setResponseText('');
    } catch (error) {
      console.error('Failed to send response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle archive feedback
  const handleArchive = async (item: Feedback) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setFeedback(prevFeedback =>
        prevFeedback.map(f =>
          f._id === item._id
            ? { ...f, status: 'archived' }
            : f
        )
      );

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Feedback archived successfully';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('Failed to archive feedback:', error);
    }
  };

  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvContent = [
        ['Feedback ID', 'Date', 'User', 'Rating', 'Message'],
        ...filteredFeedback.map(f => [
          f._id,
          f.createdAt,
          f.name,
          f.rating.toString(),
          f.message
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'feedback.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-[1400px] mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Feedback</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor and manage user feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow transition-transform hover:scale-[1.02]">
          <h3 className="text-sm font-medium text-gray-500">Total Feedback</h3>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{totalFeedback}</p>
          <p className="mt-1 text-sm text-green-600">+{newFeedbackCount} new</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow transition-transform hover:scale-[1.02]">
          <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
          <div className="mt-2 flex items-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{averageRating}</p>
            <Star className="ml-2 text-yellow-400" size={24} fill="currentColor" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow transition-transform hover:scale-[1.02]">
          <h3 className="text-sm font-medium text-gray-500">New Feedback</h3>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{newFeedbackCount}</p>
          <p className="mt-1 text-sm text-blue-600">Needs review</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow transition-transform hover:scale-[1.02]">
          <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{resolvedFeedbackCount}</p>
          <p className="mt-1 text-sm text-green-600">Completed</p>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 sm:min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <select
                className="border rounded-lg px-4 py-2 bg-white"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="service">Service</option>
                <option value="app">App</option>
              </select>
              <select
                className="border rounded-lg px-4 py-2 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              <Download size={20} />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {paginatedFeedback.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{item.user}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${item.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                        item.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' : 
                        item.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                        'bg-green-100 text-green-800'}`}>
                      {item.status}
                    </span>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className={index < item.rating ? 'text-yellow-400' : 'text-gray-300'}
                        fill={index < item.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">{item.message}</p>
                  {item.response && (
                    <div className="mt-2 pl-4 border-l-2 border-blue-200">
                      <p className="text-sm text-blue-600">Response:</p>
                      <p className="text-sm text-gray-600">{item.response}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {item.status !== 'archived' && (
                    <>
                      <button
                        onClick={() => handleRespond(item)}
                        className="w-full sm:w-auto px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-1"
                      >
                        <MessageSquare size={14} />
                        Respond
                      </button>
                      <button
                        onClick={() => handleArchive(item)}
                        className="w-full sm:w-auto px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                      >
                        Archive
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-3 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredFeedback.length)}
              </span> of{' '}
              <span className="font-medium">{filteredFeedback.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Respond to Feedback</h2>
                <button 
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">From:</span>
                    <span className="text-sm text-gray-900">{selectedFeedback.user}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className={index < selectedFeedback.rating ? 'text-yellow-400' : 'text-gray-300'}
                          fill={index < selectedFeedback.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{selectedFeedback.message}</p>
                </div>

                <div>
                  <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                  </label>
                  <textarea
                    id="response"
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Type your response here..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim() || isSubmitting}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Sending...
                      </>
                    ) : (
                      'Send Response'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage; 