import { DndContext, DragOverlay, useSensors, useSensor, MouseSensor, TouchSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { Order } from '../../types';
import { useState } from 'react';
import OrderCard from './OrderCard';

interface KanbanBoardProps {
  children: React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  children, 
  onDragStart,
  onDragEnd 
}) => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Minimum distance before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Delay before touch drag starts
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveOrder(active.data.current as Order);
    onDragStart?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveOrder(null);
    onDragEnd?.(event);
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {children}
      </div>
      <DragOverlay>
        {activeOrder ? (
          <div className="w-[350px]">
            <OrderCard 
              order={activeOrder} 
              index={-1}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard; 