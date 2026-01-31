import React, { useState } from 'react';
import { Star, Send, ThumbsUp, X } from 'lucide-react';
import { storeFeedback, FeedbackData } from '../data/mockData';

interface FeedbackForm {
  rating: number;
  category: string;
  comment: string;
}

interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: FeedbackForm;
}

const Feedback = () => {
  const [form, setForm] = useState<FeedbackForm>({
    rating: 0,
    category: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [apiResponse, setApiResponse] = useState<FeedbackResponse | null>(null);

  // Updated API simulation with storage
  const submitFeedbackToAPI = async (feedback: FeedbackForm): Promise<FeedbackResponse> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the feedback in our mock database
      const storedFeedback = storeFeedback({
        rating: feedback.rating,
        category: feedback.category,
        comment: feedback.comment
      });

      // Log to console to verify storage
      console.log('Stored Feedback:', storedFeedback);
      
      return {
        success: true,
        message: 'Feedback submitted successfully!',
        data: feedback
      };
    } catch (error) {
      console.error('Error storing feedback:', error);
      throw new Error('Failed to store feedback');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (form.rating === 0 || !form.category) {
      setApiResponse({
        success: false,
        message: 'Please provide a rating and select a category.'
      });
      setShowPopup(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitFeedbackToAPI(form);
      setApiResponse(response);
      setShowPopup(true);
      
      if (response.success) {
        // Reset form after successful submission
        setForm({
          rating: 0,
          category: '',
          comment: ''
        });
      }
    } catch (error) {
      setApiResponse({
        success: false,
        message: 'Failed to submit feedback. Please try again.'
      });
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn relative">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Feedback Matters</h1>
        <p className="mt-2 text-gray-600">Help us improve our services by sharing your experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            How would you rate your overall experience?
          </label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className={`p-2 rounded-full transition-colors ${
                  form.rating >= star 
                    ? 'text-yellow-400 hover:text-yellow-500' 
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <Star className="h-8 w-8 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            What aspect would you like to provide feedback about?
          </label>
          <div className="grid grid-cols-2 gap-4">
            {['Delivery Service', 'Product Quality', 'Website Experience', 'Customer Support'].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setForm({ ...form, category })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  form.category === category
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Additional Comments
          </label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share your thoughts..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all
            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <Send className="w-5 h-5 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative animate-fadeIn">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <div className="text-center space-y-4">
              <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${
                apiResponse?.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <ThumbsUp className={`h-6 w-6 ${
                  apiResponse?.success ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              
              <h3 className={`text-lg font-semibold ${
                apiResponse?.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {apiResponse?.success ? 'Thank You!' : 'Oops!'}
              </h3>
              
              <p className="text-gray-600">{apiResponse?.message}</p>
              
              <button
                onClick={() => setShowPopup(false)}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback; 