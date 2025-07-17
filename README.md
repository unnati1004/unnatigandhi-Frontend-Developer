# 📄 Page Hierarchy Editor

A visual editor built using **React Flow** that allows users to create, modify, and export website page hierarchies and their components. Ideal for content planning, UI/UX structuring, or sitemap design.

![Screenshot](./screenshot.png)

## ✨ Features

- 🎯 Drag-and-drop page organization
- 🔗 Automatic parent-child connection rendering
- 🧩 Support for nested sections/components (e.g., Hero, CTA, Footer)
- 💾 Save / Load functionality using local storage
- 📤 Export layout as JSON
- 🗺️ Mini-map for better navigation
- 🧹 Reset layout positioning

## 🛠️ Tech Stack

- React.js
- React Flow
- Tailwind CSS (optional for styling)
- Zustand or useState/useEffect for state management
- Local Storage for save/load persistence

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/page-hierarchy-editor.git
cd page-hierarchy-editor
2. Install Dependencies

npm install

3. Run the App

npm run dev  # if using Vite
# or
npm start    # if using CRA
4. Build for Production

npm run build
📁 Folder Structure (Example)

src/
├── components/
│   ├── Node.jsx
│   ├── Controls.jsx
│   └── Sidebar.jsx
├── data/
│   └── initialNodes.js
├── App.jsx
└── main.jsx
🧩 Example Use Case
Visualize and manage the layout of a marketing website with pages like:

Home Page

Hero, Features, Testimonials, CTA, Footer

Services → Service Detail 1 & 2

Blog → Blog Post 1, Blog Post 2, Author Page

Contact → Location Info, Support Page

📦 Exported JSON
The editor allows exporting the full layout including node positions and connections to JSON, which can be reused for:

Importing into CMS or static site generator

Documentation or client review

Automated UI generation

📜 License
MIT

Built with ❤️ using React Flow

---

Let me know if you want a link to host the screenshot or need this adapted for Vite, Next.js, or if your project has specific features like undo/redo, theming, etc.