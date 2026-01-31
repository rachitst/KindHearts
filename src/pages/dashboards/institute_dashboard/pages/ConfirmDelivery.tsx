import React, { useState, useRef } from 'react';
import { Search, CheckCircle2, X, Camera, Upload, AlertCircle, Check, Star, Send, Calendar } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';

interface DeliveryItem {
  id: string;
  itemName: string;
  quantity: number;
  status: string;
  expectedDate: string;
  shopName: string;
  category: string;
}

interface FeedbackForm {
  rating: number;
  comment: string;
  deliveryTime: 'On Time' | 'Delayed' | 'Early';
  itemCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  staffBehavior: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  wouldRecommend: boolean;
}

const ConfirmDelivery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<DeliveryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationTime, setConfirmationTime] = useState<string>('');
  const [confirmedDeliveries, setConfirmedDeliveries] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackForm>({
    rating: 5,
    comment: '',
    deliveryTime: 'On Time',
    itemCondition: 'Good',
    staffBehavior: 'Good',
    wouldRecommend: true
  });
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);

  // Extended mock data
  const deliveryItems: DeliveryItem[] = [
    {
      id: "DEL-001",
      itemName: "School Supplies Bundle",
      quantity: 50,
      status: "Out for Delivery",
      expectedDate: "2024-03-20",
      shopName: "Educational Supplies Co.",
      category: "Education Material"
    },
    {
      id: "DEL-002",
      itemName: "First Aid Kits",
      quantity: 25,
      status: "Out for Delivery",
      expectedDate: "2024-03-21",
      shopName: "MediCare Pharmacy",
      category: "Medical Supplies"
    },
    {
      id: "DEL-003",
      itemName: "Rice and Pulses",
      quantity: 100,
      status: "Out for Delivery",
      expectedDate: "2024-03-20",
      shopName: "Fresh Grocers",
      category: "Food"
    },
    {
      id: "DEL-004",
      itemName: "Laboratory Equipment",
      quantity: 10,
      status: "Out for Delivery",
      expectedDate: "2024-03-22",
      shopName: "Science Supplies Ltd",
      category: "Education Material"
    }
  ];

  const filteredItems = deliveryItems.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmDelivery = async (item: DeliveryItem) => {
    setSelectedItem(item);
    setShowModal(true);
    setError(null);
    setReceipt(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      setReceipt(file);
      setError(null);
    }
  };

  const handleDeliverySuccess = async () => {
    if (!receipt) {
      setError('Please upload the delivery receipt');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setConfirmedDeliveries(prev => [...prev, selectedItem!.id]);
      setConfirmationTime(new Date().toLocaleString());
      setIsConfirmed(true);
      setShowModal(false); // Close delivery confirmation modal
      setShowFeedbackPrompt(true); // Show feedback prompt
    } catch (err) {
      setError('Failed to confirm delivery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDelivery = async () => {
    if (!receipt) {
      setError('Please upload the delivery receipt');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setConfirmedDeliveries(prev => [...prev, selectedItem!.id]);
      setConfirmationTime(new Date().toLocaleString());
      setIsConfirmed(true);
      setIsSubmitting(false);
    } catch (err) {
      setError('Failed to confirm delivery. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      // Here you would typically send the feedback to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowFeedbackForm(false);
      setShowFeedbackSuccess(true);
      
      // Auto close success message after 3 seconds
      setTimeout(() => {
        setShowFeedbackSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Confirm Delivery</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#100e92] focus:border-[#100e92]"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Delivery Items Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.id}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.shopName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.expectedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {confirmedDeliveries.includes(item.id) ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle2 size={16} />
                      Delivery Confirmed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConfirmDelivery(item)}
                      className="text-[#100e92] hover:text-[#0d0b7a] font-medium"
                    >
                      Confirm Delivery
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fadeIn">
            {isConfirmed ? (
              // Success State
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Delivery Confirmed!
                </h3>
                <p className="text-gray-600 mb-4">
                  The delivery has been successfully confirmed at {confirmationTime}
                </p>
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Item: {selectedItem.itemName}</p>
                    <p>Quantity: {selectedItem.quantity}</p>
                    <p>Shop: {selectedItem.shopName}</p>
                    <p>Receipt: {receipt?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setIsConfirmed(false);
                    setReceipt(null);
                    // Refresh the delivery items list here if needed
                  }}
                  className="mt-6 px-4 py-2 bg-[#100e92] text-white rounded-md hover:bg-[#0d0b7a] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              // Confirmation Form
              <>
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Confirm Delivery</h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p><span className="text-gray-600">Item:</span> {selectedItem.itemName}</p>
                      <p><span className="text-gray-600">Quantity:</span> {selectedItem.quantity}</p>
                      <p><span className="text-gray-600">Shop:</span> {selectedItem.shopName}</p>
                      <p><span className="text-gray-600">Expected Date:</span> {selectedItem.expectedDate}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Delivery Receipt
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                        ${receipt ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-[#100e92]'}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {receipt ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <Check size={20} />
                          <span>{receipt.name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <Upload className="mx-auto h-8 w-8 mb-2" />
                          <p>Click to upload receipt</p>
                          <p className="text-xs">Max file size: 5MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {error}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeliverySuccess}
                    disabled={isSubmitting || !receipt}
                    className={`px-4 py-2 bg-[#100e92] text-white rounded-md flex items-center gap-2
                      ${isSubmitting || !receipt ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0d0b7a]'}`}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Delivery'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Feedback Prompt Modal */}
      {showFeedbackPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-fadeIn">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Would you like to provide feedback for this delivery?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowFeedbackPrompt(false);
                    setShowFeedbackForm(true);
                  }}
                  className="px-4 py-2 bg-[#100e92] text-white rounded-md hover:bg-[#0d0b7a]"
                >
                  Yes, Give Feedback
                </button>
                <button
                  onClick={() => setShowFeedbackPrompt(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#100e92] text-white rounded-t-lg">
              <h2 className="text-xl font-semibold">Delivery Feedback</h2>
              <button onClick={() => setShowFeedbackForm(false)} className="text-white/80 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={`${
                            star <= feedback.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          } hover:scale-110 transition-transform`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <select
                    value={feedback.deliveryTime}
                    onChange={(e) => setFeedback(prev => ({ 
                      ...prev, 
                      deliveryTime: e.target.value as FeedbackForm['deliveryTime']
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="On Time">On Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Early">Early</option>
                  </select>
                </div>

                {/* Item Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Condition
                  </label>
                  <select
                    value={feedback.itemCondition}
                    onChange={(e) => setFeedback(prev => ({ 
                      ...prev, 
                      itemCondition: e.target.value as FeedbackForm['itemCondition']
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                {/* Staff Behavior */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Staff Behavior
                  </label>
                  <select
                    value={feedback.staffBehavior}
                    onChange={(e) => setFeedback(prev => ({ 
                      ...prev, 
                      staffBehavior: e.target.value as FeedbackForm['staffBehavior']
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                {/* Would Recommend */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={feedback.wouldRecommend}
                      onChange={(e) => setFeedback(prev => ({ 
                        ...prev, 
                        wouldRecommend: e.target.checked 
                      }))}
                      className="rounded border-gray-300 text-[#100e92] focus:ring-[#100e92]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Would you recommend our service?
                    </span>
                  </label>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your experience about the delivery..."
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 text-white bg-[#100e92] rounded-md hover:bg-[#0d0940]"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Success Message */}
      {showFeedbackSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 animate-fadeIn">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your feedback has been submitted successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmDelivery; 