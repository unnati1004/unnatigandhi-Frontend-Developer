// src/utils/storage.js

const STORAGE_KEY = "page-editor-data";

/**
 * Save flow data and home sections to localStorage
 * @param {Object} data - { flowData, homeSections }
 */
export const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
};

/**
 * Load saved data from localStorage
 * @returns {Object|null} - saved { flowData, homeSections }
 */
export const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Error loading from localStorage:", err);
    return null;
  }
};
