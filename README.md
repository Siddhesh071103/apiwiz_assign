🧩 JSON Tree Visualizer

A React-based web application that visualizes JSON data as an interactive, zoomable tree graph using React Flow.
Users can enter JSON, generate a node-link visualization, zoom in/out, toggle between light and dark themes, and even download the tree as an image.

🚀 Features

📄 JSON Input Panel — Paste or type any valid JSON structure.

🌳 Dynamic Tree Visualization — Displays JSON as a connected node graph using React Flow.

🖼 Download Option — Export the generated tree as a PNG image.

🌗 Light / Dark Theme Toggle — Seamlessly switch between modes.

🔍 Zoom Controls — Zoom in/out and fit view for better exploration.

📱 Responsive Design — Works well on mobile and desktop screens.

🛠️ Tech Stack

React.js (via Vite or CRA)

React Flow — for rendering the interactive tree graph.

dom-to-image — for capturing and downloading the graph as an image.

CSS (Tailwind / Custom) — for layout and responsive styling.

📦 Dependencies

Make sure you have Node.js ≥ 16 installed, then install the following packages:

npm install reactflow
npm install dom-to-image


If you started the app with Vite or Create React App, also ensure React and ReactDOM are present:

npm install react react-dom

📁 Folder Structure
json-tree-visualizer/
│
├── src/
│   ├── components/
│   │   ├── Download/
│   │   │   ├── download.js
│   │   │   └── downbutton.css
│   │
│   ├── utils/
│   │   └── jsonToFlow.js     # Converts JSON into React Flow nodes & edges
│   │
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── ...
│
├── package.json
└── README.md

⚙️ How It Works

Enter or paste a valid JSON object in the left panel.

Click the Generate Tree button.

The right panel displays a React Flow-based JSON tree visualization.

Use the Zoom In / Zoom Out / Fit View buttons for navigation.

Click Download Tree to save the visualization as a PNG image.

🧠 Key Implementation Details

The JSON is parsed and recursively converted into React Flow nodes and edges in jsonToFlow.js.

Each node represents:

Objects → Blue nodes

Arrays → Green nodes

Primitives (string/number/boolean) → Orange nodes

The DownloadButton component uses dom-to-image to export the .flow-canvas div as an image, excluding the download button itself.

The layout and responsiveness are handled in App.css, ensuring the flow graph centers properly even on mobile screens.

🎨 Example Preview
User
├── id: 1
├── name: "John Doe"
└── address
     ├── city: "New York"
     └── country: "USA"

🧭 Future Enhancements

🌐 Support for large JSON files with performance optimization.

💾 Upload JSON file feature.

🧱 Drag & rearrange nodes for custom layouts.

🔎 Node search and highlighting.

💻 Run Locally
# Clone the repository
git clone https://github.com/yourusername/json-tree-visualizer.git

# Navigate into the project folder
cd json-tree-visualizer

# Install dependencies
npm install

# Start the app
npm run dev   # (or npm start if using CRA)


Then open 👉 http://localhost:5173/
 (Vite) or http://localhost:3000/
 (CRA) in your browser.
