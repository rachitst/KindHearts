import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Users, 
  Search,
  ChevronDown,
  Heart
} from 'lucide-react';

const ReviewsFeedback = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Sample data
  const reviewStats = {
    totalReviews: '1,248',
    averageRating: '4.8',
    responseRate: '92%',
    positiveRating: '96%'
  };

  const reviews = [
    {
      id: 1,
      institute: "Children's Hospital",
      userName: 'Priya S.',
      rating: 5,
      date: 'May 15, 2025',
      comment: 'Incredibly transparent about how donations are used. The impact reports are detailed and meaningful.',
      helpful: 24,
      instituteResponse: 'Thank you for your kind words and continued support! We strive to maintain transparency in all our operations.',
      donation: '₹1,500 to Medical Supplies'
    },
    {
      id: 2,
      institute: 'Education Trust',
      userName: 'Rahul M.',
      rating: 4,
      date: 'May 12, 2025',
      comment: 'Great cause and easy donation process. Would appreciate more frequent updates.',
      helpful: 18,
      donation: '₹2,000 to Scholarship Fund'
    },
    {
      id: 3,
      institute: 'Food Bank',
      userName: 'Anita K.',
      rating: 5,
      date: 'May 10, 2025',
      comment: 'The volunteer team is amazing. They keep donors well-informed about the impact of contributions.',
      helpful: 15,
      instituteResponse: 'We\'re glad to hear about your positive experience! Our volunteers are indeed the backbone of our organization.',
      donation: '₹1,000 to Monthly Food Drive'
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <h3 className="text-2xl font-bold mt-1">{reviewStats.totalReviews}</h3>
            </div>
            <div className="p-3 rounded-lg bg-rose-50">
              <MessageSquare size={24} className="text-rose-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold mt-1">{reviewStats.averageRating}</h3>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <Star size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Response Rate</p>
              <h3 className="text-2xl font-bold mt-1">{reviewStats.responseRate}</h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Users size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Positive Rating</p>
              <h3 className="text-2xl font-bold mt-1">{reviewStats.positiveRating}</h3>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <ThumbsUp size={24} className="text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reviews..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="all">All Institutes</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="food">Food & Hunger</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{review.institute}</h3>
                <div className="text-sm text-gray-500">{review.userName} • {review.date}</div>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">{review.comment}</div>
            <div className="mt-2 text-sm text-gray-500 flex items-center">
              <Heart size={14} className="mr-1" />
              {review.donation}
            </div>
            <div className="mt-3 flex items-center space-x-4">
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ThumbsUp size={14} className="mr-1" />
                Helpful ({review.helpful})
              </button>
            </div>
            {review.instituteResponse && (
              <div className="mt-4 pl-4 border-l-2 border-gray-200">
                <div className="text-sm font-medium text-gray-900">Response from {review.institute}</div>
                <div className="mt-1 text-sm text-gray-600">{review.instituteResponse}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsFeedback; 