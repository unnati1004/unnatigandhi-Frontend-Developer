// File: src/App.jsx
import React, { useState } from "react";
import FlowCanvas from "./components/FlowCanvas";
import Controls from "./components/Controls";
import { saveToLocalStorage, loadFromLocalStorage } from "./utils/storage";

export default function App() {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });
  const [homeSections, setHomeSections] = useState([
    "Hero",
    "Features",
    "Testimonials",
    "CTA",
    "Footer",
  ]);

  const handleSave = () => {
    saveToLocalStorage({ flowData, homeSections });
    alert("Saved to localStorage ✅");
  };

  const handleLoad = () => {
    const data = loadFromLocalStorage();
    if (data) {
      setFlowData(data.flowData);
      setHomeSections(data.homeSections);
    } else {
      alert("No saved data found.");
    }
  };

  const handleExport = () => {
    const data = { flowData, homeSections };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page-structure.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <Controls onSave={handleSave} onLoad={handleLoad} onExport={handleExport} />
      <div className="flex gap-4 mt-4">
        <FlowCanvas
          flowData={flowData}
          setFlowData={setFlowData}
          homeSections={homeSections}
          setHomeSections={setHomeSections}
        />
      </div>
    </div>
  );
} 
