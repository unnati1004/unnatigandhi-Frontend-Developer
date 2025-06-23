// File: src/components/FlowCanvas.jsx
import React, { useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls as FlowControls,
  MiniMap,
  ReactFlowProvider,
  applyNodeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getLayoutedElements } from "../utils/layout";
import CustomHomeNode from "./CustomHomeNode";

const nodeTypes = {
  customHome: CustomHomeNode,
};

const FlowCanvas = ({ flowData, setFlowData, homeSections, setHomeSections }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const allNodesAtOrigin = flowData.nodes.every(
      (n) => n.position?.x === 0 && n.position?.y === 0
    );

    if (!initialized || allNodesAtOrigin) {
      const rawNodes = [
        {
          id: "Home",
          type: "customHome",
          data: {
            sections: homeSections,
            setSections: setHomeSections,
          },
          position: { x: 0, y: 0 },
        },
        { id: "About", data: { label: "About" }, position: { x: 0, y: 0 } },
        { id: "Services", data: { label: "Services" }, position: { x: 0, y: 0 } },
        { id: "Blog", data: { label: "Blog" }, position: { x: 0, y: 0 } },
        { id: "Contact", data: { label: "Contact" }, position: { x: 0, y: 0 } },
        { id: "Service Detail 1", data: { label: "Service Detail 1" }, position: { x: 0, y: 0 } },
        { id: "Service Detail 2", data: { label: "Service Detail 2" }, position: { x: 0, y: 0 } },
        { id: "Blog Post 1", data: { label: "Blog Post 1" }, position: { x: 0, y: 0 } },
        { id: "Blog Post 2", data: { label: "Blog Post 2" }, position: { x: 0, y: 0 } },
        { id: "Author Page", data: { label: "Author Page" }, position: { x: 0, y: 0 } },
        { id: "Location Info", data: { label: "Location Info" }, position: { x: 0, y: 0 } },
        { id: "Support Page", data: { label: "Support Page" }, position: { x: 0, y: 0 } },
      ];

      const rawEdges = [
        { id: "e1", source: "Home", target: "About" },
        { id: "e2", source: "Home", target: "Services" },
        { id: "e3", source: "Home", target: "Blog" },
        { id: "e4", source: "Home", target: "Contact" },
        { id: "e5", source: "Services", target: "Service Detail 1" },
        { id: "e6", source: "Services", target: "Service Detail 2" },
        { id: "e7", source: "Blog", target: "Blog Post 1" },
        { id: "e8", source: "Blog", target: "Blog Post 2" },
        { id: "e9", source: "Blog", target: "Author Page" },
        { id: "e10", source: "Contact", target: "Location Info" },
        { id: "e11", source: "Contact", target: "Support Page" },
      ];

      const layouted = getLayoutedElements(rawNodes, rawEdges);
      setFlowData({ nodes: layouted.nodes, edges: layouted.edges });
      setInitialized(true);
    }
  }, [initialized, homeSections, setFlowData, setHomeSections, flowData.nodes]);

  const onNodesChange = (changes) => {
    setFlowData((prev) => ({
      ...prev,
      nodes: applyNodeChanges(changes, prev.nodes),
    }));
  };

  const handleResetLayout = () => {
    const layouted = getLayoutedElements(flowData.nodes, flowData.edges);
    setFlowData({ nodes: layouted.nodes, edges: layouted.edges });
  };

  return (
    <ReactFlowProvider>
      <div className="h-[600px] w-full border rounded shadow relative">
        <button
          onClick={handleResetLayout}
          className="absolute top-2 right-2 bg-gray-600 text-white text-sm px-3 py-1 rounded z-10"
        >
          Reset Layout
        </button>
        <ReactFlow
          nodes={flowData.nodes}
          edges={flowData.edges}
          onNodesChange={onNodesChange}
          fitView
          onInit={(instance) => setTimeout(() => instance.fitView({ padding: 0.2 }), 100)}
          nodesDraggable={true}
          panOnScroll
          nodeTypes={nodeTypes}
        >
          <Background />
          <MiniMap />
          <FlowControls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowCanvas;
