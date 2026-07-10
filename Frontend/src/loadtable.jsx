import { useEffect, useState } from "react";
import AssignLoad from "./loadassign";
import ShipmentDetails from "./ShipmentDetails";
import { supabase } from "./supabase_client";

// brand colors
const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  dark: "#323232",
  white: "#FFFFFF",
};

function getStatusStyle(status) {
  if (status === "In Transit") return { backgroundColor: "#5B8DB8", color: "#fff" };
  if (status === "Delivered") return { backgroundColor: "#059669", color: "#fff" };
  if (status === "Pending") return { backgroundColor: "#D97706", color: "#fff" };
  return { backgroundColor: "#757575", color: "#fff" };
}

const cellStyle = {
  padding: "12px 16px",
  fontSize: "14px",
  color: "#333",
  verticalAlign: "middle",
  textAlign: "center",
};

// finds a load from the url hash
function getLoadFromHash(loads, hash = window.location.hash) {
  const normalizedHash = hash.replace(/^#\/?/, "");
  if (!normalizedHash.startsWith("shipment/")) return null;
  const [, id] = normalizedHash.split("/");
  return loads.find((load) => String(load.load_id) === id) || null;
}

export default function LoadTable() {
  // start with empty array, supabase will fill it
  const [loads, setLoads] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // grab loads from supabase when page loads
  useEffect(() => {
    async function fetchLoads() {
      const { data, error } = await supabase
        .from("loads")
        .select("*")
      if (error) console.error(error)
      if (data) setLoads(data)
    }
    fetchLoads()
  }, []);

  // sync selected load from url hash
  useEffect(() => {
    const syncSelectionFromHash = () => {
      setSelectedLoad(getLoadFromHash(loads));
    };
    syncSelectionFromHash();
    window.addEventListener("hashchange", syncSelectionFromHash);
    return () => window.removeEventListener("hashchange", syncSelectionFromHash);
  }, [loads]);

  // filter loads by search and status
  const filteredLoads = loads.filter((load) => {
    const matchesStatus = filterStatus === "All" || load.status === filterStatus;
    const matchesSearch =
      String(load.driver_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(load.load_id).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  // update status and create a notification
  function handleStatusChange(loadId, newStatus) {
    const loadToUpdate = loads.find((load) => load.load_id === loadId);
    if (!loadToUpdate || loadToUpdate.status === newStatus) return;

    setLoads((currentLoads) =>
      currentLoads.map((load) =>
        load.load_id === loadId ? { ...load, status: newStatus } : load
      )
    );

    const newNotification = {
      id: Date.now(),
      title: "Load Status Updated",
      message: `LD${loadToUpdate.load_id} changed from ${loadToUpdate.status} to ${newStatus}.`,
      isRead: false,
      createdAt: new Date().toLocaleString(),
    };

    setNotifications((current) => [newNotification, ...current]);
  }

  // mark a notification as read
  function markNotificationAsRead(notificationId) {
    setNotifications((current) =>
      current.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  }

  function openLoadDetails(load) {
    setSelectedLoad(load);
    window.location.hash = `#/shipment/${load.load_id}`;
  }

  function handleBackToList() {
    setSelectedLoad(null);
    window.location.hash = "#/";
  }

  // sort the filtered loads
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
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "24px" }}>
      {selectedLoad ? (
        <ShipmentDetails load={selectedLoad} onBack={handleBackToList} />
      ) : (
        <>
          {/* header */}
          <div style={{ background: COLORS.navy, color: "white", padding: "16px", display: "flex", justifyContent: "space-between" }}>
            <h2>Load Assignments</h2>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: COLORS.white, color: COLORS.navy, padding: "10px 16px", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                Notifications ({unreadCount})
              </button>
              <button
                onClick={() => setShowModal(true)}
                style={{ background: COLORS.red, color: "white", padding: "10px 16px", border: "none", cursor: "pointer" }}
              >
                + Assign New Load
              </button>
            </div>
          </div>

          {/* notifications panel */}
          {showNotifications && (
            <div style={{ background: "white", padding: "16px", marginTop: "10px", border: "1px solid #ddd" }}>
              <h3>Notifications</h3>
              {notifications.length === 0 ? (
                <p>No notifications yet.</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markNotificationAsRead(notification.id)}
                    style={{
                      padding: "10px",
                      marginBottom: "8px",
                      background: notification.isRead ? "#f5f5f5" : "#e8f4ff",
                      borderLeft: notification.isRead ? "4px solid #ccc" : `4px solid ${COLORS.navy}`,
                      cursor: "pointer",
                    }}
                  >
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>Sent: {notification.createdAt}</small>
                    {!notification.isRead && <p style={{ fontWeight: "bold" }}>Unread</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* search and filter bar */}
          <div style={{ background: "white", padding: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
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
            <span style={{ color: COLORS.red, fontWeight: "600", fontSize: "14px" }}>
              {sortedLoads.length} Loads Found
            </span>
          </div>

          {/* loads table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              {/* dark navy header row */}
              <tr style={{ background: COLORS.navy, color: COLORS.white }}>
                {[
                  { label: "Load ID", key: "load_id" },
                  { label: "Driver", key: "driver_id" },
                  { label: "Pickup", key: "pickup_location" },
                  { label: "Delivery", key: "delivery_location" },
                  { label: "Date", key: "date" },
                  { label: "Status", key: "status" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      padding: "12px 16px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {col.label}
                    <SortArrow colKey={col.key} />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedLoads.map((load) => (
                <tr
                  key={load.load_id}
                  onClick={() => openLoadDetails(load)}
                  style={{ cursor: "pointer", background: "white", borderBottom: "1px solid #ddd" }}
                >
                  <td style={cellStyle}>LD{load.load_id}</td>
                  <td style={cellStyle}>{load.driver_id}</td>
                  <td style={cellStyle}>{load.pickup_location}</td>
                  <td style={cellStyle}>{load.delivery_location}</td>
                  <td style={cellStyle}>{load.date}</td>
                  <td style={cellStyle}>
                    <select
                      value={load.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(load.load_id, e.target.value);
                      }}
                      style={{
                        ...getStatusStyle(load.status),
                        padding: "4px 10px",
                        borderRadius: "10px",
                        border: "none",
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* assign load modal */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ background: "white", width: "400px", margin: "100px auto", padding: "20px", position: "relative" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", right: 10, top: 10 }}>
              ✕
            </button>
            <AssignLoad onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}