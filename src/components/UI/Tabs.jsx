import React from "react";

function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <button
        onClick={() => setActiveTab("home")}
        style={{ fontWeight: activeTab === "home" ? "bold" : "normal" }}
      >
        Home
      </button>
      <button
        onClick={() => setActiveTab("about")}
        style={{ fontWeight: activeTab === "about" ? "bold" : "normal" }}
      >
        About
      </button>
      <button
        onClick={() => setActiveTab("contact")}
        style={{ fontWeight: activeTab === "contact" ? "bold" : "normal" }}
      >
        Contact
      </button>
    </div>
  );
}

export default Tabs;
