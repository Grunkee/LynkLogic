import { useEffect, useState } from "react";
import AssignLoad from "./loadassign";
import ShipmentDetails from "./ShipmentDetails";

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
    id: "LD1",
    driverName: "John Smith",
    pickupLocation: "1234 Main St, Toronto, ON",
    deliveryLocation: "784 Alex Blvd, Burlington, ON",
    dateAssigned: "2026-07-31",
    status: "In Transit",
  },
  {
    id: "LD2",
    driverName: "Sarah Johnson",
    pickupLocation: "765 Apple St, Hamilton, ON",
    deliveryLocation: "987 Hello Ave, Oakville, ON",
    dateAssigned: "2026-06-30",
    status: "Delivered",
  },
  {
    id: "LD3",
    driverName: "Mike Williams",
    pickupLocation: "555 Oliver St, Windsor, ON",
    deliveryLocation: "1111 Atlas St, Oakville, ON",
    dateAssigned: "2026-07-16",
    status: "Pending",
  },
  {
    id: "LD4",
    driverName: "Robert Brown",
    pickupLocation: "137 King St, Waterloo, ON",
    deliveryLocation: "528 Point St, Toronto, ON",
    dateAssigned: "2026-07-04",
    status: "In Transit",
  },
];

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
};

function getLoadFromHash(loads, hash = window.location.hash) {
  const normalizedHash = hash.replace(/^#\/?/, "");
  if (!normalizedHash.startsWith("shipment/")) return null;

  const [, id] = normalizedHash.split("/");
  return loads.find((load) => load.id === id) || null;
}

export default function LoadTable() {
  const [loads, setLoads] = useState(DUMMY_LOADS);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(() => getLoadFromHash(DUMMY_LOADS));
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const filteredLoads = loads.filter((load) => {
    const matchesStatus = filterStatus === "All" || load.status === filterStatus;
    const matchesSearch =
      load.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    const syncSelectionFromHash = () => {
      setSelectedLoad(getLoadFromHash(loads));
    };

    syncSelectionFromHash();
    window.addEventListener("hashchange", syncSelectionFromHash);

    return () => window.removeEventListener("hashchange", syncSelectionFromHash);
  }, [loads]);

  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }
//
//for notifications 
  function handleStatusChange(loadId, newStatus) {
  const loadToUpdate = loads.find((load) => load.id === loadId);

  if (!loadToUpdate || loadToUpdate.status === newStatus) return;

  setLoads((currentLoads) =>
    currentLoads.map((load) =>
      load.id === loadId ? { ...load, status: newStatus } : load
    )
  );

  const newNotification = {
    id: Date.now(),
    title: "Load Status Updated",
    message: `${loadToUpdate.id} for ${loadToUpdate.driverName} changed from ${loadToUpdate.status} to ${newStatus}.`,
    isRead: false,
    createdAt: new Date().toLocaleString(),
  };

  setNotifications((currentNotifications) => [
    newNotification,
    ...currentNotifications,
  ]);
}

function markNotificationAsRead(notificationId) {
  setNotifications((currentNotifications) =>
    currentNotifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    )
  );
}

  function openLoadDetails(load) {
    setSelectedLoad(load);
    window.location.hash = `#/shipment/${load.id}`;
  }

  function handleBackToList() {
    setSelectedLoad(null);
    window.location.hash = "#/";
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
      <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "24px" }}>
        {selectedLoad ? (
        <ShipmentDetails load={selectedLoad} onBack={handleBackToList} />
      ) : (
        <>
          <div style={{ background: COLORS.navy, color: "white", padding: "16px", display: "flex", justifyContent: "space-between" }}>
            <h2>Load Assignments</h2>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: COLORS.white,
                  color: COLORS.navy,
                  padding: "10px 16px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
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

            <span style={{ 
              color: COLORS.red, 
              fontWeight: "600", 
              fontSize: "14px" 
            }}>
              {sortedLoads.length} Loads Found
            </span>
          </div>

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
                <th key={col.key} onClick={() => handleSort(col.key)} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                    {col.label}
                    <SortArrow colKey={col.key} />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedLoads.map((load) => (
                <tr key={load.id} onClick={() => openLoadDetails(load)} style={{ cursor: "pointer" }}>
                  <td style={cellStyle}>{load.id}</td>
                  <td style={cellStyle}>{load.driverName}</td>
                  <td style={cellStyle}>{load.pickupLocation}</td>
                  <td style={cellStyle}>{load.deliveryLocation}</td>
                  <td style={cellStyle}>{load.dateAssigned}</td>
                  <td style={cellStyle}>
                    <select
                      value={load.status}
                      onChange={(e) => handleStatusChange(load.id, e.target.value)}
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

      {/* modal */}
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