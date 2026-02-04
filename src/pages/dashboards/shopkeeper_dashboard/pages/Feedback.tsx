import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchFeedback } from '../store/slices/feedbackSlice';
import { Star, TrendingUp, MessageSquare, ThumbsUp, BarChart2 } from 'lucide-react';
import type { AppDispatch } from '../store';

const Feedback = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { feedback, loading } = useSelector((state: RootState) => state.feedback);

  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

  const stats = {
    avgRating: feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length || 0,
    totalFeedback: feedback.length,
    positiveRate: (feedback.filter(f => f.rating >= 4).length / feedback.length * 100) || 0,
    recentFeedback: feedback.filter(f => 
      new Date(f.createdAt).getTime() > Date.now() - 86400000 * 7
    ).length
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Feedback & Quality Improvement</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Star className="text-blue-600" size={24} />
            <span className="text-blue-600 text-sm font-medium">Overall Rating</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">{stats.avgRating.toFixed(1)}</div>
          <div className="flex mt-2">{renderStars(Math.round(stats.avgRating))}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="text-green-600" size={24} />
            <span className="text-green-600 text-sm font-medium">Total Feedback</span>
          </div>
          <div className="text-3xl font-bold text-green-700">{stats.totalFeedback}</div>
          <div className="text-green-600 text-sm mt-2">Last 30 days</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <ThumbsUp className="text-purple-600" size={24} />
            <span className="text-purple-600 text-sm font-medium">Positive Rate</span>
          </div>
          <div className="text-3xl font-bold text-purple-700">{stats.positiveRate.toFixed(1)}%</div>
          <div className="text-purple-600 text-sm mt-2">4+ star ratings</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-orange-600" size={24} />
            <span className="text-orange-600 text-sm font-medium">Recent Feedback</span>
          </div>
          <div className="text-3xl font-bold text-orange-700">{stats.recentFeedback}</div>
          <div className="text-orange-600 text-sm mt-2">Last 7 days</div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow-sm divide-y">
        {feedback.map((item) => (
          <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{item.instituteName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">{renderStars(item.rating)}</div>
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Order #{item.orderId}</span>
                <BarChart2 className="text-gray-400" size={16} />
              </div>
            </div>
            <p className="text-gray-600">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback; 
