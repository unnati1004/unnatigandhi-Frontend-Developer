import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

export default function CustomHomeNode({ data }) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = data.sections.indexOf(active.id);
      const newIndex = data.sections.indexOf(over.id);
      const newList = arrayMove(data.sections, oldIndex, newIndex);
      data.setSections(newList); // Controlled state update
    }
  };

  return (
    <div className="w-64 bg-white border-2 border-yellow-400 rounded p-2 shadow-md">
      <h3 className="text-center font-bold text-blue-600">Home Page</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.sections} strategy={verticalListSortingStrategy}>
          {data.sections.map((section) => (
            <SortableItem key={section} id={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
