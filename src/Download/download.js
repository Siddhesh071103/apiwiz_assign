import React from "react";
import domtoimage from "dom-to-image";
import "./downbutton.css";

const DownloadButton = ({ targetRef }) => {
  const handleDownload = () => {
    if (!targetRef.current) return;

    const node = targetRef.current;

    domtoimage.toPng(node)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "json-tree.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Error capturing image:", error);
      });
  };

  return (
    <div className="download-container">
      <button className="download-btn" onClick={handleDownload}>
        Download Tree
      </button>
    </div>
  );
};

export default DownloadButton;
