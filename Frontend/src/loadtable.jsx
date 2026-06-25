import { useState } from "react";
import AssignLoad from "./loadassign";

// brand colors
const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  dark: "#323232",
  white: "#FFFFFF",
};

// dummy data
const DUMMY_LOADS = [
  {
    id: "LD1001",
    driverName: "John Smith",
    pickupLocation: "1234 Main St, Toronto, ON",
    deliveryLocation: "784 Alex Blvd, Burlington, ON",
    dateAssigned: "2026-06-07",
    status: "In Transit",
  },
  {
    id: "LD1003",
    driverName: "Mike Williams",
    pickupLocation: "765 Apple St, Hamilton, ON",
    deliveryLocation: "987 Hello Ave, Oakville, ON",
    dateAssigned: "2026-06-06",
    status: "Delivered",
  },
  {
    id: "LD1002",
    driverName: "Sarah Johnson",
    pickupLocation: "555 Oliver St, Windsor, ON",
    deliveryLocation: "1111 Atlas St, Oakville, ON",
    dateAssigned: "2026-06-10",
    status: "Pending",
  },
  {
    id: "LD1004",
    driverName: "Robert Brown",
    pickupLocation: "137 King St, Waterloo, ON",
    deliveryLocation: "528 Point St, Toronto, ON",
    dateAssigned: "2026-06-05",
    status: "In Transit",
  },
];

function getStatusStyle(status) {
  if (status === "In Transit") return { backgroundColor: "#0B3C5D", color: "#fff" };
  if (status === "Delivered") return { backgroundColor: "#2e7d32", color: "#fff" };
  if (status === "Pending") return { backgroundColor: "#e65100", color: "#fff" };
  return { backgroundColor: "#757575", color: "#fff" };
}

const cellStyle = {
  padding: "12px 16px",
  fontSize: "14px",
  color: "#333",
  verticalAlign: "middle",
};

export default function LoadTable() {
  const [loads] = useState(DUMMY_LOADS);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredLoads = loads.filter((load) => {
    const matchesStatus = filterStatus === "All" || load.status === filterStatus;
    const matchesSearch =
      load.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  const sortedLoads = [...filteredLoads].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valA = String(a[sortConfig.key]).toLowerCase();
    const valB = String(b[sortConfig.key]).toLowerCase();

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  function SortArrow({ colKey }) {
    if (sortConfig.key !== colKey) return <span style={{ opacity: 0.3 }}> ↕</span>;
    return <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>;
  }

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh", padding: "24px" }}>
      
      {/* header */}
      <div style={{ background: COLORS.navy, color: "white", padding: "16px", display: "flex", justifyContent: "space-between" }}>
        <h2>Load Assignments</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: COLORS.red, color: "white", padding: "10px 16px", border: "none", cursor: "pointer" }}
        >
          + Assign New Load
        </button>
      </div>

      {/* filters */}
      <div style={{ background: "white", padding: "12px", display: "flex", gap: "10px" }}>
        <input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Pending">Pending</option>
        </select>

        <span>{sortedLoads.length} loads</span>
      </div>

      {/* table */}
      <table style={{ width: "100%", background: "white" }}>
        <thead>
          <tr>
            {[
              { label: "Load ID", key: "id" },
              { label: "Driver", key: "driverName" },
              { label: "Pickup", key: "pickupLocation" },
              { label: "Delivery", key: "deliveryLocation" },
              { label: "Date", key: "dateAssigned" },
              { label: "Status", key: "status" },
            ].map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)} style={{ cursor: "pointer" }}>
                {col.label}
                <SortArrow colKey={col.key} />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedLoads.map((load) => (
            <tr key={load.id}>
              <td style={cellStyle}>{load.id}</td>
              <td style={cellStyle}>{load.driverName}</td>
              <td style={cellStyle}>{load.pickupLocation}</td>
              <td style={cellStyle}>{load.deliveryLocation}</td>
              <td style={cellStyle}>{load.dateAssigned}</td>
              <td style={cellStyle}>
                <span style={{ ...getStatusStyle(load.status), padding: "4px 10px", borderRadius: "10px" }}>
                  {load.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* modal */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ background: "white", width: "400px", margin: "100px auto", padding: "20px", position: "relative" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", right: 10, top: 10 }}>
              ✕
            </button>

            <AssignLoad />
          </div>
        </div>
      )}
    </div>
  );
}