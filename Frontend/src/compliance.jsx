import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, XCircle, Truck, Search, ChevronUp, ChevronDown } from "lucide-react";
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

async function fetchDrivers() {
	const { data: driverRows, error: driverErr } = await supabase
		.from("drivers")
		.select("driver_id, first_name, last_name, license_number, email, phone, status");
	if (driverErr) throw driverErr;

	const { data: itemRows, error: itemErr } = await supabase
		.from("compliance_items")
		.select("id, driver_id, label, expires, kind");
	if (itemErr) throw itemErr;

	return driverRows.map((d) => ({
		...d,
		name: `${d.first_name} ${d.last_name}`,
		items: (itemRows || []).filter((i) => String(i.driver_id) === String(d.driver_id)),
	}));
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

function ComplianceItem({ item }) {
	const status = itemStatus(item.expires);
	const meta = STATUS_META[status];
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
				<div style={{ width: "8px", height: "8px", borderRadius: "50%", background: meta.color }} />
			</div>
			<div style={{ fontSize: "14px", fontWeight: 500, color: COLORS.dark, marginBottom: "4px" }}>
				{item.label}
			</div>
			<div style={{ fontSize: "12px", color: meta.color, fontWeight: 500 }}>
				{daysLabel(item.expires)} &middot; {fmtDate(item.expires)}
			</div>
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

function DriverCard({ driver }) {
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
						flexWrap: "wrap",
						gap: "10px",
						padding: "0 20px 20px",
						borderTop: `1px solid ${COLORS.border}`,
						paddingTop: "14px",
					}}
				>
					{driver.items.map((item, idx) => (
						<ComplianceItem key={idx} item={item} />
					))}
				</div>
			)}
		</div>
	);
}

export default function Compliance() {
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState("all");
	const [drivers, setDrivers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchDrivers()
			.then(setDrivers)
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	const withStatus = drivers.map((d) => ({ ...d, status: driverStatus(d) }));
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
					<div
						style={{
							background: COLORS.white,
							padding: "12px 16px",
							display: "flex",
							gap: "12px",
							alignItems: "center",
							borderRadius: "8px",
							marginBottom: "16px",
							border: `1px solid ${COLORS.border}`,
							flexWrap: "wrap",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 200px" }}>
							<Search size={16} color={COLORS.muted} />
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search driver or vehicle..."
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

					{/* Driver Cards */}
					<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
						{filtered.map((d) => (
							<DriverCard key={d.driver_id} driver={d} />
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
		</div>
	);
}
