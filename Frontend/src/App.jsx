import { useState } from "react";
import LoadTable from "./loadtable";
import LoadShipments from "./loadshipments";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Manager from "./pages/Manager.jsx";
import Sidebar from "./Sidebar";
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
		if (page === "messages") return;
		setCurrentPage(page);
		if (page === "shipments") {
			navigate("/shipments");
		} else if (page === "hours") {
			navigate("/hours");
		} else if (page === "customerloads") {
			navigate("/customerloads");
		} else if (page == "reports") {
			navigate("/reports")
		} else if (page == "Compliance") {
			navigate("/Compliance")
		} else {
			navigate("/dashboard");
		}
	};

	const renderMainContent = () => {
		switch (currentPage) {
			case "loadassignments":
				return <LoadTable />;
			case "shipments":
				return <LoadShipments />;
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
			case "customerloads":
				return <CustomerLoads />;
			case "reports":
				return <MakeReport />;
			case "compliance":
				return <Compliance />;
			case "manager":
				return <Manager />;
			default:
				return <LoadTable />;
		}
	};

	const currentRole =
		currentPage === "hours" || currentPage === "reports" || currentPage === "messages" || initialPage === "hours" || initialPage === "reports" ? "driver" :
			initialPage === "customerloads" ? "customer" :
				initialPage === "shipments" ? "manager" : "dispatcher";

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
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/table" element={<Dashboard initialPage="loadassignments" />} />
				<Route path="/shipments" element={<Dashboard initialPage="shipments" />} />
				<Route path="/hours" element={<Dashboard key="hours" initialPage="hours" />} />
				<Route path="/compliance" element={<Dashboard initialPage="compliance" />} />
				<Route path="/manager" element={<Dashboard initialPage="manager" />} />
				<Route path="/customerloads" element={<Dashboard initialPage="customerloads" />} />
				<Route path="/customer" element={<Dashboard initialPage="customer" />} />
				<Route path="/reports" element={<Dashboard key="reports" initialPage="reports" />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;