import { useDraggable } from '@dnd-kit/core';
import { Order } from '../../types';
import { GripVertical } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  index: number;
  onClick: () => void;
  color: string;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick, color }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
    data: order
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white p-4 rounded-lg border shadow-sm 
        hover:shadow-md hover:border-${color}-200
        transition-all duration-200 select-none
        ${isDragging ? `ring-2 ring-${color}-500 shadow-lg` : ''}
      `}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className={`
          flex items-center mb-2 cursor-grab
          hover:bg-${color}-50 rounded-md -mx-2 px-2 py-1
          transition-colors duration-200
        `}
      >
        <GripVertical className={`h-5 w-5 text-${color}-400`} />
      </div>

      {/* Card Content - Clickable */}
      <div onClick={onClick}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-900">
              {order.instituteName}
            </h4>
            <p className={`text-sm text-${color}-600`}>
              Order #{order.id.slice(-6)}
            </p>
          </div>
          {order.notes?.includes('urgent') && (
            <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
              Urgent
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {order.items.length} items · ${order.totalAmount}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default OrderCard; 
