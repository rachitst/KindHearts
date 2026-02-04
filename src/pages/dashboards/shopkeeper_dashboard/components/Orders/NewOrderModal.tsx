import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Modal from '../Common/Modal';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    instituteName: '',
    contactPerson: '',
    contactNumber: '',
    deliveryAddress: '',
    items: [{ name: '', quantity: 1, price: 0 }],
    notes: '',
    priority: 'normal'
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    onClose();
  };

  // Update the input classes with this modern style
  const inputClasses = `
    w-full bg-white border border-gray-200 rounded-xl px-4 py-3 
    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
    transition-all duration-200 ease-in-out shadow-sm
    placeholder:text-gray-400
  `;

  const sectionClasses = `
    relative bg-white rounded-xl p-6 border border-gray-100
    shadow-sm hover:shadow-md transition-all duration-300
  `;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Institution Details Section */}
        <div className={sectionClasses}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h3 className="text-lg font-medium text-gray-900">Institution Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                value={formData.instituteName}
                onChange={(e) => setFormData(prev => ({ ...prev, instituteName: e.target.value }))}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                className={inputClasses}
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className={sectionClasses}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className={inputClasses}
              >
                <option value="normal">Normal Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className={sectionClasses}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h3 className="text-lg font-medium text-gray-900">Delivery Information</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address *
            </label>
            <textarea
              value={formData.deliveryAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
              className={inputClasses}
              rows={2}
              required
            />
          </div>
        </div>

        {/* Order Items Section */}
        <div className={sectionClasses}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 
                rounded-xl hover:bg-blue-100 text-sm font-medium transition-all duration-200
                border border-blue-200 hover:border-blue-300"
            >
              <Plus size={16} className="mr-2" />
              Add New Item
            </button>
          </div>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[index].name = e.target.value;
                    setFormData(prev => ({ ...prev, items: newItems }));
                  }}
                  className={inputClasses}
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[index].quantity = Number(e.target.value);
                    setFormData(prev => ({ ...prev, items: newItems }));
                  }}
                  className={inputClasses}
                  required
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...formData.items];
                    newItems[index].price = Number(e.target.value);
                    setFormData(prev => ({ ...prev, items: newItems }));
                  }}
                  className={inputClasses}
                  required
                  min="0"
                  step="0.01"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className={sectionClasses}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className={inputClasses}
              rows={3}
              placeholder="Add any special instructions or notes here..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 
              font-medium transition-all duration-200 hover:border-gray-300
              focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
              text-white rounded-xl hover:from-blue-700 hover:to-blue-600 
              font-medium transition-all duration-200 shadow-lg shadow-blue-500/30
              hover:shadow-blue-500/40 focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Order
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewOrderModal; 