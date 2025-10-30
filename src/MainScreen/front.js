import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { jsonToFlow } from "../utils/jsonToFlow.js";
import Mode from "../Theme/mode.js";
import DownloadButton from "../Download/download.js";
import "../App.css";


export default function Front() {
  const sample = {
    user: { name: "Siddhesh", age: 22, address: { city: "Mumbai", pin: 400001 } },
    skills: ["React Native", "Node.js"]
  };

  const [jsonText, setJsonText] = useState(JSON.stringify(sample, null, 2));
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [pathMap, setPathMap] = useState({}); 
  const [error, setError] = useState(null);
  const [searchPath, setSearchPath] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);

  const reactFlowWrapper = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);


  const generateTree = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      const { nodes, edges, pathMap: pm } = jsonToFlow(parsed);
      setElements({ nodes, edges });
      setPathMap(pm);
      setError(null);
      setSearchMessage("");
      setHighlightedNodeId(null);
    } catch (e) {
      setError("❌ Invalid JSON format");
      setElements({ nodes: [], edges: [] });
      setPathMap({});
      setHighlightedNodeId(null);
    }
  }, [jsonText]);


  useEffect(() => {
    generateTree();
  }, [generateTree]);

 
  function normalizePath(input) {
    if (!input || typeof input !== "string") return null;
    let s = input.trim();
    if (s.startsWith("$.")) s = s.slice(2);
    if (s === "$") return "$";
    
    const segments = [];
    const parts = s.split(".");
    for (const part of parts) {
      if (part === "") continue;
     
      const regex = /([^[\]]+)|\[(\d+)\]/g;

      let m;
      while ((m = regex.exec(part))) {
        if (m[1]) {
          segments.push(m[1]);
        } else if (m[2]) {
          segments.push(Number(m[2]));
        }
      }
    }
   
    if (segments.length === 0) return "$";
    
    let out = "$";
    segments.forEach((seg) => {
      if (typeof seg === "number") out += `[${seg}]`;
      else out += `.${seg}`;
    });
    return out;
  }

  
  const performSearch = () => {
    setSearchMessage("");
    setHighlightedNodeId(null);
    const normalized = normalizePath(searchPath);
    if (!normalized) {
      setSearchMessage("Enter a valid path");
      return;
    }
    if (pathMap[normalized]) {
      const nodeId = pathMap[normalized];
      setHighlightedNodeId(nodeId);
      setSearchMessage("Match found");
      
      if (rfInstance) {
        const node = elements.nodes.find((n) => n.id === nodeId);
        if (node) {
          const x = node.position.x;
          const y = node.position.y;
          
          try {
            rfInstance.setCenter(x, y, { duration: 800 });
            rfInstance.setZoom(1.2, { duration: 300 });
          } catch (err) {
          
            rfInstance.fitView({ duration: 800 });
          }
        }
      }
    } else {
      setSearchMessage("No match found");
    }
  };

  const getStyledNodes = () => {
    return elements.nodes.map((n) => {
      if (!highlightedNodeId) return n;
      if (n.id === highlightedNodeId) {
        const highlightedStyle = {
          ...n.style,
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          border: "2px solid #ff3d00",
        };
        return { ...n, style: highlightedStyle };
      }
      return n;
    });
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <h2>JSON Input</h2>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="json-textarea"
          placeholder='Paste JSON here (example placeholder provided)'
        />
        <div className="controls-row">
          <button onClick={generateTree} className="btn">
            Generate Tree
          </button>

          <div className="search-container">
            <input
              placeholder='Search by path e.g. $.user.address.city or items[0].name'
              value={searchPath}
              onChange={(e) => setSearchPath(e.target.value)}
              className="search-input"
            />
            <button onClick={performSearch} className="btn search-btn">
              Search
            </button>
          </div>
        </div>

        <div className="status-row">
          {error && <div className="error-text">{error}</div>}
          {!error && searchMessage && <div className="info-text">{searchMessage}</div>}
        </div>

        <div style={{ marginTop: 14, fontSize: 13, color: "#444" }}>
          <strong>Notes:</strong>
          <ul>
            <li>Use paths like <code>$.user.name</code> or <code>items[0].name</code></li>
            <li>Array indices must be numeric inside brackets: <code>[0]</code></li>
            <li>Click Generate Tree after changing JSON</li>
          </ul>
        </div>
      </div>

      <div className="right-panel">
        <div className="flow-canvas" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={getStyledNodes()}
              edges={elements.edges}
              fitView
              nodesDraggable={false}
              nodesConnectable={false}
              onInit={(instance) => setRfInstance(instance)}
              attributionPosition="bottom-left"
              minZoom={0.3}       
              maxZoom={2}         
              defaultViewport={{ zoom: 1 }}
            >
              <Controls showInteractive={true} />
              <Background gap={16} />
            </ReactFlow>
        </div>

        {elements.nodes.length > 0 && <DownloadButton targetRef={reactFlowWrapper} />}
      </div>
        <div className="theme-toggle-container">
            <Mode />
        </div>
    </div>
  );
}
