import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoadTable from "./loadtable";
import { DATA_TEST } from "./loadhours.jsx"
import LoadShipments from "./loadshipments";
import Sidebar from "./Sidebar";
import DriverSidebar from "./Truckersidebar.jsx";
import Login from "./pages/Login.jsx";
import Hours from "./pages/hours.jsx";
import "./App.css";

function Dashboard({ initialPage = "loadassignments" }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const navigate = useNavigate();
  
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const [weeklyLogs, setWeeklyLogs] = useState(DATA_TEST);
  const handleAddHoursLog = (newLog) => {
    setWeeklyLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page === "shipments") {
      navigate("/shipments");
    } else if (page === "hours") {
      navigate("/hours");
    } else if (page === "loadassignments") {
      navigate("/table");
    } else {
      navigate("/dashboard");
    }
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case "loadassignments":
        return <LoadTable />;
      case "shipments":
        return <LoadShipments onRoleNavigate={handleNavigate}/>;
      case "hours":
        return (
          <Hours
            weeklyLogs={weeklyLogs}
            weeklyHoursLogged="23.0"
            isClockedIn={isClockedIn}
            isAvailable={isAvailable}
            onClockToggle={() => setIsClockedIn(!isClockedIn)}
            onAvailabilityToggle={() => setIsAvailable(!isAvailable)}
            onAddLog={handleAddHoursLog}
          />
        );
      default:
        return <LoadTable />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", "--accent": "#de9a4c" }}>
      <header style={{ background: "#0B3C5D", color: "white", padding: "16px 24px", boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, flex: "1 1 220px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "999px", background: "#ffffff", boxShadow: "0 4px 18px rgba(0,0,0,0.12)", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.8 }}>LynkLogic</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center", flex: "1 1 220px", width: "100%" }}>
            <button style={{ border: "1px solid rgba(255,255,255,0.25)", borderRadius: "999px", background: "rgba(255,255,255,0.08)", color: "white", padding: "10px 16px", cursor: "pointer", flex: "1 1 120px", minWidth: "110px", maxWidth: "140px" }}>
              Today
            </button>
            <button style={{ border: "1px solid rgba(255,255,255,0.25)", borderRadius: "999px", background: "rgba(255,255,255,0.08)", color: "white", padding: "10px 16px", cursor: "pointer", flex: "1 1 120px", minWidth: "110px", maxWidth: "140px" }}>
              Settings
            </button>
          </div>
        </div>
      </header>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {currentPage === "hours" ? ( <DriverSidebar currentPage={currentPage} onNavigate={handleNavigate} />
        ) : (
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />)}
        <main style={{ flex: 1, background: "#f5f5f5" }}>
          {renderMainContent()}
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
        <Route path="/dashboard" element={<Dashboard key="dashboard" />} />
        <Route path="/table" element={<Dashboard key="table" initialPage="loadassignments" />} />
        <Route path="/shipments" element={<Dashboard key="shipments" initialPage="shipments" />} />
        <Route path="/hours" element={<Dashboard key="hours" initialPage="hours" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
