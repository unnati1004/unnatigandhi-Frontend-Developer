// src/components/HomeSectionEditor.jsx
import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

export default function HomeSectionEditor({ homeSections, setHomeSections }) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="p-4 border rounded bg-white w-80 shadow">
      <h3 className="text-lg font-bold mb-2">Home Sections</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = homeSections.indexOf(active.id);
            const newIndex = homeSections.indexOf(over.id);
            setHomeSections(arrayMove(homeSections, oldIndex, newIndex));
          }
        }}
      >
        <SortableContext items={homeSections} strategy={verticalListSortingStrategy}>
          {homeSections.map((section) => (
            <SortableItem key={section} id={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
