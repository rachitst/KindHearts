import React from 'react';
import { Order, OrderStatus } from '../../types';
import Modal from '../Common/Modal';
import { CheckCircle } from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onClose,
  onStatusUpdate
}) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Details"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {order.instituteName}
            </h3>
            <p className="text-sm text-gray-500">
              Order #{order.id}
            </p>
          </div>
          {onStatusUpdate && order.status === 'ready' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'delivered')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={18} />
              Mark as Delivered
            </button>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Contact Person</p>
              <p className="font-medium">{order.contactPerson}</p>
            </div>
            <div>
              <p className="text-gray-500">Contact Number</p>
              <p className="font-medium">{order.contactNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Delivery Address</p>
              <p className="font-medium">{order.deliveryAddress}</p>
            </div>
            {order.notes && (
              <div className="col-span-2">
                <p className="text-gray-500">Notes</p>
                <p className="font-medium">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal; 
