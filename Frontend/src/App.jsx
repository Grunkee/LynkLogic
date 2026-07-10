import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoadTable from "./loadtable";
import { DATA_TEST } from "./loadhours.jsx";
import LoadShipments from "./loadshipments";
import Sidebar from "./Sidebar";
import Login from "./pages/Login.jsx";
import Hours from "./pages/hours.jsx";
import MakeReport from "./makereport.jsx"
import CustomerLoads from "./CustomerLoads";
import Compliance from "./compliance.jsx";
import InvoiceTable from "./invoices.jsx";
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
			case "invoices":
				return <InvoiceTable />;
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
					<div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, flex: "1 1 220px" }}>
						<div style={{ minWidth: 0 }}>
							<img src="/src/assets/logo.png" style={{ height: "40px" }} />
						</div>
					</div>
					<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center", flex: "1 1 220px", width: "100%" }}>
						<button style={{ border: "1px solid rgba(255,255,255,0.25)", borderRadius: "999px", background: "rgba(255,255,255,0.08)", color: "white", padding: "10px 16px", cursor: "pointer", flex: "1 1 120px", minWidth: "110px", maxWidth: "140px" }}>
							Today
						</button>
					</div>
				</div>
			</header>
			<div style={{ display: "flex", flex: 1, minHeight: 0 }}>
				<Sidebar currentPage={currentPage} onNavigate={handleNavigate} role={currentRole} />
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
				<Route path="/customerloads" element={<Dashboard initialPage="customerloads" />} />
				<Route path="/customer" element={<Dashboard initialPage="customer" />} />
				<Route path="/reports" element={<Dashboard key="reports" initialPage="reports" />} />
				<Route path="/invoices" element={<Dashboard key="invoices" initialPage="invoices" />} />
				
				
			</Routes>
		</BrowserRouter>
	);
}

export default App;
