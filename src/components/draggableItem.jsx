import { useDraggable} from '@dnd-kit/core';

const DraggableItem = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? {
    transform: `translateY(${transform.y}px)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="p-1 px-2 bg-gray-200 rounded cursor-move">
      {label}
    </div>
  );
};

export default DraggableItem;