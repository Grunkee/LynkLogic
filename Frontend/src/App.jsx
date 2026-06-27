import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadTable from "./loadtable";
import LoadShipments from "./loadshipments";
import Sidebar from "./Sidebar";
import Login from "./pages/Login.jsx";
import "./App.css";

function Dashboard() {
  const [currentPage, setCurrentPage] = useState("loadassignments");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header style={{ background: "#0B3C5D", color: "white", padding: "16px 24px", boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "999px", background: "#ffffff", boxShadow: "0 4px 18px rgba(0,0,0,0.12)" }} />
            <div>
              <p style={{ margin: 0, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.8 }}>LynkLogic</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={{ border: "1px solid rgba(255,255,255,0.25)", borderRadius: "999px", background: "rgba(255,255,255,0.08)", color: "white", padding: "10px 16px", cursor: "pointer" }}>
              Today
            </button>
            <button style={{ border: "1px solid rgba(255,255,255,0.25)", borderRadius: "999px", background: "rgba(255,255,255,0.08)", color: "white", padding: "10px 16px", cursor: "pointer" }}>
              Settings
            </button>
          </div>
        </div>
      </header>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main style={{ flex: 1, background: "#f5f5f5" }}>
          {currentPage === "loadassignments" ? <LoadTable /> : <LoadShipments />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/table" element={<LoadTable />} />
        <Route path="/shipments" element={<LoadShipments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
