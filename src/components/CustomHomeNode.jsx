import React, { useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
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

  const [sections, setSections] = useState(data.sections || []);

  useEffect(() => {
    setSections(data.sections || []);
  }, [data.sections]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.indexOf(active.id);
      const newIndex = sections.indexOf(over.id);
      const newList = arrayMove(sections, oldIndex, newIndex);
      setSections(newList); // local reordering
    }
  };

  return (
    <div
      className="w-64 bg-white border-2 border-yellow-400 rounded p-2 shadow-md"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <h3 className="text-center font-bold text-blue-600">Home Page</h3>

      {/* Top handle for incoming connections */}
      <Handle type="target" position={Position.Top} id="home-target" />

      {/* Bottom handle for outgoing connections */}
      <Handle type="source" position={Position.Bottom} id="home-source" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableItem key={section} id={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
// This component allows the user to reorder sections of the Home page using drag-and-drop.