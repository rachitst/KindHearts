import { useState, useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd';

interface KanbanColumn {
  id: string;
  title: string;
  items: string[];
  color?: string;
}

interface KanbanColumns {
  [key: string]: KanbanColumn;
}

export const useKanban = (initialColumns: KanbanColumns) => {
  const [columns, setColumns] = useState<KanbanColumns>(initialColumns);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const column = columns[source.droppableId];
      const items = Array.from(column.items);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items
        }
      });
    } else {
      // Moving between columns
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    }
  }, [columns]);

  return {
    columns,
    setColumns,
    handleDragEnd
  };
}; 
