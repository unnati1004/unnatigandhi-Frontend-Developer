// src/components/Controls.jsx
import React from "react";

export default function Controls({ onSave, onLoad, onExport }) {
  return (
    <div className="flex gap-4 justify-center mb-4">
      <button
        onClick={onSave}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Save
      </button>
      <button
        onClick={onLoad}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Load
      </button>
      <button
        onClick={onExport}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
      >
        Export JSON
      </button>
    </div>
  );
}
