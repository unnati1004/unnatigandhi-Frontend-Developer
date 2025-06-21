import { useState } from "react";
import DraggableItem from "./draggableItem";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';

const HomeSections = ({ sections, setStructure }) => {
  const [items, setItems] = useState(sections);

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      setStructure((prev) => ({ ...prev, homeSections: newItems }));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <div className="mt-2 bg-white shadow p-2 rounded space-y-1">
        {items.map((sec) => (
          <DraggableItem key={sec} id={sec} label={sec} />
        ))}
      </div>
    </DndContext>
  );
};

export default HomeSections;