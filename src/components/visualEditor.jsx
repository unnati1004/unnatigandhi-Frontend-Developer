import React, { useEffect, useState, useCallback, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../index.css";

const nodeWidth = 250;
const nodeHeight = 100;

const initialStructure = {
  nodes: [
    { id: "home", label: "Home", level: 1 },
    { id: "about", label: "About", parent: "home", level: 2 },
    { id: "services", label: "Services", parent: "home", level: 2 },
    { id: "service1", label: "Service Detail 1", parent: "services", level: 3 },
    { id: "service2", label: "Service Detail 2", parent: "services", level: 3 },
    { id: "blog", label: "Blog", parent: "home", level: 2 },
    { id: "post1", label: "Blog Post 1", parent: "blog", level: 3 },
    { id: "post2", label: "Blog Post 2", parent: "blog", level: 3 },
    { id: "author", label: "Author Page", parent: "blog", level: 3 },
    { id: "contact", label: "Contact", parent: "home", level: 2 },
    { id: "location", label: "Location Info", parent: "contact", level: 3 },
    { id: "support", label: "Support Page", parent: "contact", level: 3 },
  ],
  sections: ["Header Navbar", "Hero", "Services", "Features", "Call To Action", "Footer"],
};

const getColorByLevel = (level) => ["#fef3c7", "#bfdbfe", "#bbf7d0"][level - 1] || "#e5e7eb";

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-2 m-1 bg-white border rounded shadow-sm cursor-move"
    >
      {id}
    </div>
  );
}

function CustomNode({ data }) {
  return (
    <div className="rounded-lg border shadow-md bg-white w-full relative">
      <Handle type="target" position={Position.Top} />
      <div className="bg-blue-600 text-white px-3 py-2 rounded-t-md font-bold text-center">
        {data.label}
      </div>
      {data.label === "Home" && (
        <div className="p-2 bg-yellow-50">
          {data.sections.map((section, index) => (
            <div
              key={index}
              className="border rounded bg-white p-1 my-1 text-sm text-gray-700"
            >
              {section}
            </div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default function App() {
  const [structure, setStructure] = useState(() => JSON.parse(localStorage.getItem("structure")) || initialStructure);
  const [sections, setSections] = useState(structure.sections);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const roErrorHandler = (e) => {
      if (e.message === "ResizeObserver loop limit exceeded") {
        const overlay = document.getElementById("webpack-dev-server-client-overlay");
        if (overlay) overlay.style.display = "none";
      }
    };
    window.addEventListener("error", roErrorHandler);
    window.addEventListener("unhandledrejection", (e) => {
      if (e.reason?.message === "ResizeObserver loop limit exceeded") {
        e.preventDefault();
      }
    });
    return () => window.removeEventListener("error", roErrorHandler);
  }, []);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  useEffect(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: "TB" });

    structure.nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    structure.nodes.forEach((node) => {
      if (node.parent) {
        dagreGraph.setEdge(node.parent, node.id);
      }
    });

    dagre.layout(dagreGraph);

    const formattedNodes = structure.nodes.map((n) => {
      const nodeWithPos = dagreGraph.node(n.id);
      return {
        id: n.id,
        type: "custom",
        position: nodeWithPos ? { x: nodeWithPos.x, y: nodeWithPos.y } : { x: 0, y: 0 },
        data: {
          label: n.label,
          level: n.level,
          sections: n.label === "Home" ? sections : [],
        },
        style: { width: nodeWidth, background: getColorByLevel(n.level) },
        draggable: true,
      };
    });

    const formattedEdges = structure.nodes
      .filter((n) => n.parent)
      .map((n) => ({ id: `${n.parent}->${n.id}`, source: n.parent, target: n.id }));

    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [JSON.stringify(structure.nodes), sections]);

  const onNodeDragStop = useCallback((_, node) => {
    const updatedNodes = nodes.map((n) =>
      n.id === node.id ? { ...n, position: node.position } : n
    );
    setNodes(updatedNodes);
    const updatedStructure = {
      ...structure,
      nodes: structure.nodes.map((n) =>
        n.id === node.id ? { ...n, position: node.position } : n
      ),
    };
    setStructure(updatedStructure);
  }, [nodes, structure]);

  const saveStructure = () => {
    const updated = { ...structure, sections };
    localStorage.setItem("structure", JSON.stringify(updated));
    setStructure(updated);
  };

  const loadStructure = () => {
    const saved = JSON.parse(localStorage.getItem("structure"));
    if (saved) {
      setStructure(saved);
      setSections(saved.sections);
    }
  };

  const exportStructure = () => {
    const json = JSON.stringify({ ...structure, sections }, null, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "structure.json");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="h-screen flex">
      <div className="w-2/3 h-full">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">Home Page Sections</h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (active.id !== over?.id) {
              const oldIndex = sections.indexOf(active.id);
              const newIndex = sections.indexOf(over?.id);
              setSections(arrayMove(sections, oldIndex, newIndex));
            }
          }}
        >
          <SortableContext items={sections} strategy={verticalListSortingStrategy}>
            {sections.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </SortableContext>
        </DndContext>
        <div className="flex gap-2 mt-4">
          <button onClick={saveStructure} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
          <button onClick={loadStructure} className="px-4 py-2 bg-yellow-500 text-white rounded">
            Load
          </button>
          <button onClick={exportStructure} className="px-4 py-2 bg-green-600 text-white rounded">
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}
