// Root React App for Visual Page Hierarchy Editor
// Tech Stack: ReactJS + Tailwind + React Flow + Dagre + DndKit

import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, addEdge } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { DndContext, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 172, height: 36 });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    node.position = {
      x: nodeWithPosition.x - 86,
      y: nodeWithPosition.y - 18,
    };

    return node;
  });

  return { nodes, edges };
};

const defaultStructure = {
  pages: [
    { id: 'home', label: 'Home', level: 1 },
    { id: 'about', label: 'About', parent: 'home', level: 2 },
    { id: 'services', label: 'Services', parent: 'home', level: 2 },
    { id: 'blog', label: 'Blog', parent: 'home', level: 2 },
    { id: 'contact', label: 'Contact', parent: 'home', level: 2 },
    { id: 'service1', label: 'Service Detail 1', parent: 'services', level: 3 },
    { id: 'service2', label: 'Service Detail 2', parent: 'services', level: 3 },
    { id: 'post1', label: 'Blog Post 1', parent: 'blog', level: 3 },
    { id: 'post2', label: 'Blog Post 2', parent: 'blog', level: 3 },
    { id: 'author', label: 'Author Page', parent: 'blog', level: 3 },
    { id: 'location', label: 'Location Info', parent: 'contact', level: 3 },
    { id: 'support', label: 'Support Page', parent: 'contact', level: 3 },
  ],
  homeSections: ['Hero', 'Features', 'Testimonials', 'CTA', 'Footer'],
};

const getColor = (level) => {
  switch (level) {
    case 1: return 'bg-blue-300';
    case 2: return 'bg-green-300';
    case 3: return 'bg-yellow-300';
    default: return 'bg-gray-200';
  }
};

const VisualEditor = () => {
  const [structure, setStructure] = useState(() => {
    const saved = localStorage.getItem('pageStructure');
    return saved ? JSON.parse(saved) : defaultStructure;
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const rawNodes = structure.pages.map((p) => ({
      id: p.id,
      data: {
        label: (
          <div className={`p-2 rounded text-sm text-center ${getColor(p.level)}`}>
            {p.label}
            {p.id === 'home' && <HomeSections sections={structure.homeSections} setStructure={setStructure} />}
          </div>
        ),
      },
      position: { x: 0, y: 0 },
    }));

    const rawEdges = structure.pages.filter(p => p.parent).map(p => ({
      id: `${p.parent}-${p.id}`,
      source: p.parent,
      target: p.id,
    }));

    const layouted = getLayoutedElements(rawNodes, rawEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [structure]);

  const handleSave = () => {
    localStorage.setItem('pageStructure', JSON.stringify(structure));
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('pageStructure');
    if (saved) setStructure(JSON.parse(saved));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(structure, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'structure.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="p-2 bg-gray-100 flex gap-4">
        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-1 rounded">Save</button>
        <button onClick={handleLoad} className="bg-green-500 text-white px-4 py-1 rounded">Load</button>
        <button onClick={handleExport} className="bg-orange-500 text-white px-4 py-1 rounded">Export JSON</button>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

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

export default VisualEditor;