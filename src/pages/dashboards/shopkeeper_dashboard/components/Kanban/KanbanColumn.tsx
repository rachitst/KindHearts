import { useDroppable } from '@dnd-kit/core';
import { LucideIcon } from 'lucide-react';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  count, 
  color,
  icon: Icon,
  children 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id
  });

  return (
    <div 
      ref={setNodeRef}
      className={`
        flex-1 min-w-[350px] bg-white rounded-xl shadow-sm border 
        transition-colors duration-200
        ${isOver ? `border-${color}-500 ring-2 ring-${color}-500/20` : 'border-gray-200'}
      `}
    >
      <div className={`p-4 border-b border-gray-100`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-700">{title}</h3>
          </div>
          <span className={`
            px-2.5 py-1 rounded-full text-sm font-medium 
            bg-${color}-50 text-${color}-600
          `}>
            {count}
          </span>
        </div>
      </div>
      <div className={`
        p-4 min-h-[calc(100vh-16rem)] 
        ${isOver ? `bg-${color}-50/20` : 'bg-gray-50/50'}
        transition-colors duration-200
      `}>
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn; 
