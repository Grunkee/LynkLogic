import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, XCircle, Truck, Search, ChevronUp, ChevronDown, Download } from "lucide-react";
import { supabase } from "./supabase_client";

const today = new Date();

const COLORS = {
	navy: "#0B3C5D",
	red: "#D9534F",
	dark: "#323232",
	white: "#FFFFFF",
	bg: "#f5f5f5",
	border: "#e5e5e5",
	muted: "#757575",
	green: "#059669",
	greenBg: "rgba(5,150,105,0.1)",
	amber: "#D97706",
	amberBg: "rgba(217,119,6,0.1)",
	redBg: "rgba(217,83,79,0.1)",
};

const STATUS_META = {
	valid: { label: "Compliant", color: COLORS.green, bg: COLORS.greenBg, Icon: ShieldCheck },
	expiring: { label: "Expiring Soon", color: COLORS.amber, bg: COLORS.amberBg, Icon: AlertTriangle },
	expired: { label: "Expired", color: COLORS.red, bg: COLORS.redBg, Icon: XCircle },
};

// Data fetching moved below mock data definitions for fallback access

const MOCK_VEHICLES = [
	{
		driver_id: "V100",
		type: "Vehicle",
		name: "Freightliner Cascadia",
		license_number: "VIN-12345",
		email: "Fleet #1",
		items: [
			{ id: 'v1', kind: 'Inspection', label: 'Annual DOT Inspection', expires: '2026-08-15' },
			{ id: 'v2', kind: 'Registration', label: 'State Registration', expires: '2026-07-20' },
		]
	},
	{
		driver_id: "V101",
		type: "Vehicle",
		name: "Volvo VNL",
		license_number: "VIN-67890",
		email: "Fleet #2",
		items: [
			{ id: 'v3', kind: 'Inspection', label: 'Annual DOT Inspection', expires: '2026-06-01' },
		]
	}
];

const MOCK_HISTORY = [
	{ id: 1, entityId: "V100", action: "Updated Annual DOT Inspection expiration", oldDate: "2025-08-15", newDate: "2026-08-15", timestamp: "2026-07-09T14:22:00Z", user: "System" },
];

async function fetchComplianceData() {
	const { data: driverRows, error: driverErr } = await supabase
		.from("drivers")
		.select("driver_id, first_name, last_name, license_number, email, phone, status");
	if (driverErr) throw driverErr;

	const { data: itemRows, error: itemErr } = await supabase
		.from("compliance_items")
		.select("id, driver_id, label, expires, kind");
	if (itemErr) throw itemErr;

	const drivers = driverRows
		.filter(d => d.status !== 'Vehicle')
		.map((d) => ({
			...d,
			name: `${d.first_name} ${d.last_name || ''}`.trim(),
			items: itemRows.filter((i) => i.kind !== 'History' && String(i.driver_id) === String(d.driver_id)),
		}));

	const vehicles = driverRows
		.filter(d => d.status === 'Vehicle')
		.map(v => ({
			...v,
			name: v.first_name,
			type: "Vehicle",
			items: itemRows.filter((i) => i.kind !== 'History' && String(i.driver_id) === String(v.driver_id)),
		}));

	const history = itemRows
		.filter(i => i.kind === 'History')
		.map(h => {
			try {
				const parsed = JSON.parse(h.label);
				return {
					id: h.id,
					entityId: h.driver_id,
					action: parsed.action,
					oldDate: parsed.oldDate,
					newDate: parsed.newDate,
					timestamp: parsed.timestamp,
					user: parsed.user
				};
			} catch {
				return null;
			}
		})
		.filter(Boolean);

	return { drivers, vehicles, history: history.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)) };
}

function daysUntil(dateStr) {
	const d = new Date(dateStr);
	return Math.round((d - today) / (1000 * 60 * 60 * 24));
}

function itemStatus(dateStr) {
	const days = daysUntil(dateStr);
	if (days < 0) return "expired";
	if (days <= 30) return "expiring";
	return "valid";
}

function driverStatus(driver) {
	const statuses = driver.items.map((i) => itemStatus(i.expires));
	if (statuses.includes("expired")) return "expired";
	if (statuses.includes("expiring")) return "expiring";
	return "valid";
}

function fmtDate(dateStr) {
	return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function daysLabel(dateStr) {
	const d = daysUntil(dateStr);
	if (d < 0) return `Expired ${Math.abs(d)}d ago`;
	if (d === 0) return "Expires today";
	return `Expires in ${d}d`;
}

function HistoryModal({ entityId, history, onClose }) {
	const entityHistory = history.filter(h => String(h.entityId) === String(entityId)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
	return (
		<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
			<div style={{ background: COLORS.white, borderRadius: "8px", width: "500px", maxWidth: "90%", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
				<div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<div style={{ fontSize: "16px", fontWeight: 600, color: COLORS.dark }}>Audit Log</div>
					<button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted }}><XCircle size={20} /></button>
				</div>
				<div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
					{entityHistory.length === 0 ? (
						<div style={{ color: COLORS.muted, textAlign: "center", padding: "20px" }}>No history found for this entity.</div>
					) : (
						<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
							{entityHistory.map((h, i) => (
								<div key={i} style={{ fontSize: "13px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "12px" }}>
									<div style={{ fontWeight: 600, color: COLORS.navy }}>{h.action}</div>
									<div style={{ color: COLORS.muted, marginTop: "4px" }}>
										Changed from <b>{h.oldDate}</b> to <b>{h.newDate}</b>
									</div>
									<div style={{ display: "flex", justifyContent: "space-between", color: COLORS.muted, marginTop: "8px", fontSize: "12px" }}>
										<span>By: {h.user}</span>
										<span>{new Date(h.timestamp).toLocaleString()}</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function ComplianceItem({ item, entityId, onUpdate }) {
	const [isEditing, setIsEditing] = useState(false);
	const [newDate, setNewDate] = useState(item.expires ? item.expires.split('T')[0] : '');
	const status = itemStatus(item.expires);
	const meta = STATUS_META[status];

	const handleSave = () => {
		if (onUpdate) onUpdate(entityId, item.id, newDate);
		setIsEditing(false);
	};

	return (
		<div
			style={{
				background: COLORS.white,
				border: `1px solid ${COLORS.border}`,
				borderLeft: `3px solid ${meta.color}`,
				borderRadius: "6px",
				padding: "14px 16px",
				minWidth: "200px",
				flex: "1 1 200px",
				maxWidth: "260px",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
				<span style={{ fontSize: "11px", fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
					{item.kind}
				</span>
				<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
					<button onClick={() => setIsEditing(!isEditing)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: COLORS.navy, padding: 0 }}>Edit</button>
					<div style={{ width: "8px", height: "8px", borderRadius: "50%", background: meta.color }} />
				</div>
			</div>
			<div style={{ fontSize: "14px", fontWeight: 500, color: COLORS.dark, marginBottom: "4px" }}>
				{item.label}
			</div>
			{isEditing ? (
				<div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
					<input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ flex: 1, padding: "4px", fontSize: "12px", border: `1px solid ${COLORS.border}`, borderRadius: "4px", outline: "none" }} />
					<button onClick={handleSave} style={{ background: COLORS.navy, color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>Save</button>
				</div>
			) : (
				<div style={{ fontSize: "12px", color: meta.color, fontWeight: 500 }}>
					{daysLabel(item.expires)} &middot; {fmtDate(item.expires)}
				</div>
			)}
		</div>
	);
}

function StatusDot({ color, count }) {
	if (count === 0) return null;
	return (
		<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
			<div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
			<span style={{ fontSize: "12px", fontWeight: 600, color: COLORS.dark }}>{count}</span>
		</div>
	);
}

function DriverCard({ driver, onUpdate, onViewHistory }) {
	const [open, setOpen] = useState(false);
	const status = driverStatus(driver);
	const meta = STATUS_META[status];

	const itemCounts = {
		valid: driver.items.filter((i) => itemStatus(i.expires) === "valid").length,
		expiring: driver.items.filter((i) => itemStatus(i.expires) === "expiring").length,
		expired: driver.items.filter((i) => itemStatus(i.expires) === "expired").length,
	};

	return (
		<div
			style={{
				background: COLORS.white,
				border: `1px solid ${COLORS.border}`,
				borderRadius: "8px",
				overflow: "hidden",
			}}
		>
			<button
				onClick={() => setOpen(!open)}
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "16px",
					padding: "16px 20px",
					background: "none",
					border: "none",
					cursor: "pointer",
					textAlign: "left",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
					<div
						style={{
							width: "40px",
							height: "40px",
							borderRadius: "50%",
							background: meta.bg,
							border: `1px solid ${meta.color}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<meta.Icon size={18} color={meta.color} />
					</div>
					<div>
						<div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.dark }}>
							{driver.name}
						</div>
						<div style={{ fontSize: "12px", color: COLORS.muted, marginTop: "2px" }}>
							{driver.license_number} &middot; {driver.email}
						</div>
					</div>
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						<StatusDot color={COLORS.green} count={itemCounts.valid} />
						<StatusDot color={COLORS.amber} count={itemCounts.expiring} />
						<StatusDot color={COLORS.red} count={itemCounts.expired} />
					</div>
					{open ? <ChevronUp size={18} color={COLORS.muted} /> : <ChevronDown size={18} color={COLORS.muted} />}
				</div>
			</button>
			{open && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
						padding: "0 20px 20px",
						borderTop: `1px solid ${COLORS.border}`,
						paddingTop: "14px",
					}}
				>
					<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
						{driver.items.map((item, idx) => (
							<ComplianceItem key={idx} item={item} entityId={driver.driver_id} onUpdate={onUpdate} />
						))}
					</div>
					<div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
						<button onClick={() => onViewHistory(driver.driver_id)} style={{ background: "none", border: "none", padding: 0, fontSize: "12px", cursor: "pointer", color: COLORS.muted, textDecoration: "underline" }}>
							View Audit Log
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default function Compliance() {
	const [activeTab, setActiveTab] = useState("drivers");
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState("all");
	const [drivers, setDrivers] = useState([]);
	const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [history, setHistory] = useState(MOCK_HISTORY);
	const [viewingHistoryFor, setViewingHistoryFor] = useState(null);

	useEffect(() => {
		fetchComplianceData()
			.then((data) => {
				setDrivers(data.drivers);
				setVehicles(data.vehicles);
				setHistory(data.history);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	const updateItem = async (entityId, itemId, newDate) => {
		let oldDate = "";
		let label = "";
		if (activeTab === "drivers") {
			const d = drivers.find(d => String(d.driver_id) === String(entityId));
			const i = d?.items.find(i => i.id === itemId);
			if (i) { oldDate = i.expires; label = i.label; }
		} else {
			const v = vehicles.find(v => String(v.driver_id) === String(entityId));
			const i = v?.items.find(i => i.id === itemId);
			if (i) { oldDate = i.expires; label = i.label; }
		}

		const oldDateStr = oldDate ? oldDate.split('T')[0] : null;

		const newHistoryEvent = {
			id: Date.now(),
			entityId,
			action: `Updated ${label} expiration`,
			oldDate: oldDateStr || "None",
			newDate,
			timestamp: new Date().toISOString(),
			user: "Manager"
		};
		setHistory(prev => [newHistoryEvent, ...prev]);

		if (activeTab === "drivers") {
			setDrivers(prev => prev.map(d => {
				if (String(d.driver_id) !== String(entityId)) return d;
				return { ...d, items: d.items.map(i => i.id === itemId ? { ...i, expires: newDate } : i) };
			}));
		} else {
			setVehicles(prev => prev.map(v => {
				if (String(v.driver_id) !== String(entityId)) return v;
				return { ...v, items: v.items.map(i => i.id === itemId ? { ...i, expires: newDate } : i) };
			}));
		}

		// Save to Supabase
		await supabase.from("compliance_items").update({ expires: newDate }).eq("id", itemId);
		
		const historyPayload = JSON.stringify({
			action: `Updated ${label} expiration`,
			oldDate: oldDateStr || "None",
			newDate,
			timestamp: new Date().toISOString(),
			user: "Manager"
		});

		await supabase.from("compliance_items").insert([{
			driver_id: parseInt(entityId, 10),
			kind: "History",
			label: historyPayload,
			expires: "2099-12-31"
		}]);
	};

	const currentList = activeTab === "drivers" ? drivers : vehicles;
	const withStatus = currentList.map((d) => ({ ...d, status: driverStatus(d), type: d.type || "Driver" }));
	const counts = {
		valid: withStatus.filter((d) => d.status === "valid").length,
		expiring: withStatus.filter((d) => d.status === "expiring").length,
		expired: withStatus.filter((d) => d.status === "expired").length,
	};

	const filtered = withStatus.filter((d) => {
		const matchesQuery =
			d.name.toLowerCase().includes(query.toLowerCase()) ||
			d.license_number.toLowerCase().includes(query.toLowerCase()) ||
			d.email.toLowerCase().includes(query.toLowerCase());
		const matchesFilter = filter === "all" || d.status === filter;
		return matchesQuery && matchesFilter;
	});

	const statCards = [
		{ key: "valid", ...STATUS_META.valid, count: counts.valid },
		{ key: "expiring", ...STATUS_META.expiring, count: counts.expiring },
		{ key: "expired", ...STATUS_META.expired, count: counts.expired },
	];

	const filterButtons = [
		{ key: "all", label: "All" },
		{ key: "valid", label: "Compliant" },
		{ key: "expiring", label: "Expiring" },
		{ key: "expired", label: "Expired" },
	];

	const handleExport = () => {
		const headers = ["Name", "Type", "License Number", "Email", "Status"];
		const rows = filtered.map(d => [
			`"${d.name || ''}"`,
			`"${d.type || ''}"`,
			`"${d.license_number || ''}"`,
			`"${d.email || ''}"`,
			`"${d.status || ''}"`
		].join(","));
		
		const csvContent = [headers.join(","), ...rows].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `${activeTab}_compliance_report_${new Date().toISOString().split('T')[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div style={{ background: COLORS.bg, minHeight: "100vh", padding: "24px" }}>
			<div style={{ maxWidth: "960px", margin: "0 auto" }}>
				{/* Header */}
				<div
					style={{
						background: COLORS.navy,
						color: COLORS.white,
						padding: "20px 24px",
						borderRadius: "8px 8px 0 0",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: "12px",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
						<div
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "8px",
								background: "rgba(255,255,255,0.15)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Truck size={22} color={COLORS.white} />
						</div>
						<div>
							<div style={{ fontSize: "20px", fontWeight: 600 }}>Fleet Compliance</div>
							<div style={{ fontSize: "13px", opacity: 0.75, marginTop: "2px" }}>
								Driver certifications, inspections &amp; regulatory status
							</div>
						</div>
					</div>
					<div style={{ fontSize: "12px", opacity: 0.7, textAlign: "right" }}>
						Record Date
						<div style={{ fontSize: "14px", color: COLORS.white, opacity: 1, marginTop: "2px" }}>
							{today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
						</div>
					</div>
				</div>

				{/* Loading / Error states */}
				{loading && (
					<div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "48px 24px", textAlign: "center", color: COLORS.muted, fontSize: "14px" }}>
						Loading compliance records...
					</div>
				)}
				{error && (
					<div style={{ background: COLORS.redBg, border: `1px solid ${COLORS.red}`, borderRadius: "8px", padding: "16px 24px", color: COLORS.red, fontSize: "14px", marginBottom: "16px" }}>
						Failed to load data: {error}
					</div>
				)}

				{/* Stat Cards */}
				{!loading && <>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: "1px",
							background: COLORS.border,
							marginBottom: "24px",
						}}
					>
						{statCards.map((s) => (
							<div
								key={s.key}
								style={{
									background: COLORS.white,
									padding: "20px 24px",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<div>
									<div style={{ fontSize: "12px", fontWeight: 500, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
										{s.label}
									</div>
									<div style={{ fontSize: "32px", fontWeight: 700, color: s.color, marginTop: "4px", lineHeight: 1 }}>
										{s.count}
									</div>
								</div>
								<s.Icon size={28} color={s.color} />
							</div>
						))}
					</div>

					{/* Search and Filter */}
					<div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
						<button
							onClick={() => setActiveTab("drivers")}
							style={{ padding: "8px 16px", borderRadius: "8px", background: activeTab === "drivers" ? COLORS.navy : COLORS.white, color: activeTab === "drivers" ? COLORS.white : COLORS.muted, cursor: "pointer", fontWeight: 600, flex: 1, border: `1px solid ${activeTab === "drivers" ? COLORS.navy : COLORS.border}` }}
						>
							Drivers
						</button>
						<button
							onClick={() => setActiveTab("vehicles")}
							style={{ padding: "8px 16px", borderRadius: "8px", background: activeTab === "vehicles" ? COLORS.navy : COLORS.white, color: activeTab === "vehicles" ? COLORS.white : COLORS.muted, cursor: "pointer", fontWeight: 600, flex: 1, border: `1px solid ${activeTab === "vehicles" ? COLORS.navy : COLORS.border}` }}
						>
							Vehicles
						</button>
					</div>

					<div
						style={{
							background: COLORS.white,
							padding: "12px 16px",
							display: "flex",
							gap: "12px",
							alignItems: "center",
							justifyContent: "space-between",
							borderRadius: "8px",
							marginBottom: "16px",
							border: `1px solid ${COLORS.border}`,
							flexWrap: "wrap",
						}}
					>
						<div style={{ display: "flex", gap: "12px", alignItems: "center", flex: "1 1 300px" }}>
							<div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
								<Search size={16} color={COLORS.muted} />
								<input
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder={`Search ${activeTab}...`}
									style={{
										border: "none",
										outline: "none",
										background: "transparent",
										flex: 1,
										fontSize: "14px",
										color: COLORS.dark,
									}}
								/>
							</div>
							<div style={{ display: "flex", gap: "6px" }}>
								{filterButtons.map((f) => (
									<button
										key={f.key}
										onClick={() => setFilter(f.key)}
										style={{
											padding: "6px 14px",
											fontSize: "12px",
											fontWeight: 500,
											borderRadius: "10px",
											cursor: "pointer",
											border: filter === f.key ? "none" : `1px solid ${COLORS.border}`,
											background: filter === f.key ? COLORS.navy : COLORS.bg,
											color: filter === f.key ? COLORS.white : COLORS.muted,
										}}
									>
										{f.label}
									</button>
								))}
							</div>
						</div>
						<button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: "6px", background: COLORS.green, color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
							<Download size={16} /> Export Report
						</button>
					</div>

					{/* Driver Cards */}
					<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
						{filtered.map((d) => (
							<DriverCard key={d.driver_id} driver={d} onUpdate={updateItem} onViewHistory={setViewingHistoryFor} />
						))}
						{filtered.length === 0 && (
							<div
								style={{
									background: COLORS.white,
									border: `1px solid ${COLORS.border}`,
									borderRadius: "8px",
									padding: "48px 24px",
									textAlign: "center",
									color: COLORS.muted,
									fontSize: "14px",
								}}
							>
								No drivers match this search.
							</div>
						)}
					</div>
				</>}
			</div>
			{viewingHistoryFor && (
				<HistoryModal entityId={viewingHistoryFor} history={history} onClose={() => setViewingHistoryFor(null)} />
			)}
		</div>
	);
}
