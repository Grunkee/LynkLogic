import { useState } from "react";
import AssignLoad from "./loadassign";

const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  dark: "#323232",
  white: "#FFFFFF",
};

const DUMMY_SHIPMENTS = [
  {
    shipment_id: "S1001",
    created_at: "2026-06-01",
    driver_id: 21,
    route_id: 3,
    shipment_type: "Dry Van",
    weight: "14,200 kg",
    pickup_date: "2026-06-08",
    delivery_date: "2026-06-10",
    origin: "Toronto, ON",
    destination: "Burlington, ON",
    tracking_number: "TRK-89010",
    status: "In Transit",
  },
  {
    shipment_id: "S1002",
    created_at: "2026-05-28",
    driver_id: 14,
    route_id: 2,
    shipment_type: "Flatbed",
    weight: "8,500 kg",
    pickup_date: "2026-06-03",
    delivery_date: "2026-06-05",
    origin: "Hamilton, ON",
    destination: "Oakville, ON",
    tracking_number: "TRK-67123",
    status: "Delivered",
  },
  {
    shipment_id: "S1003",
    created_at: "2026-06-03",
    driver_id: 18,
    route_id: 5,
    shipment_type: "Reefer",
    weight: "5,700 kg",
    pickup_date: "2026-06-11",
    delivery_date: "2026-06-13",
    origin: "Windsor, ON",
    destination: "Oakville, ON",
    tracking_number: "TRK-44321",
    status: "Pending",
  },
  {
    shipment_id: "S1004",
    created_at: "2026-06-05",
    driver_id: 27,
    route_id: 1,
    shipment_type: "Dry Van",
    weight: "9,900 kg",
    pickup_date: "2026-06-09",
    delivery_date: "2026-06-10",
    origin: "Waterloo, ON",
    destination: "Toronto, ON",
    tracking_number: "TRK-22098",
    status: "In Transit",
  },
  {
    shipment_id: "S1005",
    created_at: "2026-06-02",
    driver_id: 33,
    route_id: 3,
    shipment_type: "Dry Van",
    weight: "11,200 kg",
    pickup_date: "2026-06-08",
    delivery_date: "2026-06-10",
    origin: "Mississauga, ON",
    destination: "Burlington, ON",
    tracking_number: "TRK-55555",
    status: "Pending",
  },
  {
    shipment_id: "S1006",
    created_at: "2026-06-04",
    driver_id: 12,
    route_id: 4,
    shipment_type: "Flatbed",
    weight: "7,800 kg",
    pickup_date: "2026-06-03",
    delivery_date: "2026-06-04",
    origin: "Kingston, ON",
    destination: "Ottawa, ON",
    tracking_number: "TRK-11872",
    status: "Delivered",
  },
  {
    shipment_id: "S1007",
    created_at: "2026-06-06",
    driver_id: 29,
    route_id: 2,
    shipment_type: "Reefer",
    weight: "6,400 kg",
    pickup_date: "2026-06-03",
    delivery_date: "2026-06-06",
    origin: "London, ON",
    destination: "Sarnia, ON",
    tracking_number: "TRK-33441",
    status: "Pending",
  },
  {
    shipment_id: "S1008",
    created_at: "2026-06-07",
    driver_id: 19,
    route_id: 4,
    shipment_type: "Dry Van",
    weight: "10,100 kg",
    pickup_date: "2026-06-06",
    delivery_date: "2026-06-08",
    origin: "Barrie, ON",
    destination: "Markham, ON",
    tracking_number: "TRK-99231",
    status: "In Transit",
  },
  {
    shipment_id: "S1009",
    created_at: "2026-06-08",
    driver_id: 22,
    route_id: 6,
    shipment_type: "Dry Van",
    weight: "12,300 kg",
    pickup_date: "2026-06-10",
    delivery_date: "2026-06-12",
    origin: "Sudbury, ON",
    destination: "North Bay, ON",
    tracking_number: "TRK-77102",
    status: "Pending",
  },
  {
    shipment_id: "S1010",
    created_at: "2026-06-09",
    driver_id: 31,
    route_id: 1,
    shipment_type: "Flatbed",
    weight: "8,900 kg",
    pickup_date: "2026-06-09",
    delivery_date: "2026-06-11",
    origin: "Guelph, ON",
    destination: "Brantford, ON",
    tracking_number: "TRK-55187",
    status: "In Transit",
  },
  {
    shipment_id: "S1011",
    created_at: "2026-06-10",
    driver_id: 24,
    route_id: 5,
    shipment_type: "Reefer",
    weight: "6,100 kg",
    pickup_date: "2026-06-11",
    delivery_date: "2026-06-13",
    origin: "Windsor, ON",
    destination: "Toronto, ON",
    tracking_number: "TRK-44322",
    status: "Pending",
  },
  {
    shipment_id: "S1012",
    created_at: "2026-06-11",
    driver_id: 16,
    route_id: 6,
    shipment_type: "Dry Van",
    weight: "11,900 kg",
    pickup_date: "2026-06-10",
    delivery_date: "2026-06-12",
    origin: "Timmins, ON",
    destination: "Sault Ste. Marie, ON",
    tracking_number: "TRK-88233",
    status: "Delivered",
  },
  {
    shipment_id: "S1013",
    created_at: "2026-06-12",
    driver_id: 17,
    route_id: 4,
    shipment_type: "Flatbed",
    weight: "7,200 kg",
    pickup_date: "2026-06-12",
    delivery_date: "2026-06-14",
    origin: "Peterborough, ON",
    destination: "Belleville, ON",
    tracking_number: "TRK-10021",
    status: "Pending",
  },
  {
    shipment_id: "S1014",
    created_at: "2026-06-13",
    driver_id: 26,
    route_id: 2,
    shipment_type: "Dry Van",
    weight: "9,400 kg",
    pickup_date: "2026-06-12",
    delivery_date: "2026-06-14",
    origin: "St. Catharines, ON",
    destination: "Niagara Falls, ON",
    tracking_number: "TRK-77281",
    status: "In Transit",
  },
];

function getStatusStyle(status) {
  if (status === "In Transit") return { backgroundColor: "#0B3C5D", color: "#fff" };
  if (status === "Delivered") return { backgroundColor: "#2e7d32", color: "#fff" };
  if (status === "Pending") return { backgroundColor: "#e65100", color: "#fff" };
  return { backgroundColor: "#757575", color: "#fff" };
}

export default function LoadShipments({ onRoleNavigate }) {
  const [shipments] = useState(DUMMY_SHIPMENTS);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("All Routes");
  const [showModal, setShowModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const routeOptions = ["All Routes", "Route 1", "Route 2", "Route 3", "Route 4", "Route 5", "Route 6"];

  const filteredShipments = shipments.filter((shipment) => {
    const matchesStatus = filterStatus === "All" || shipment.status === filterStatus;
    const matchesSearch =
      shipment.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.shipment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const shipmentRoute = `Route ${shipment.route_id}`;
    const matchesRoute = selectedRoute === "All Routes" || shipmentRoute === selectedRoute;
    return matchesStatus && matchesSearch && matchesRoute;
  });

  const weekStart = new Date();
  const currentDay = weekStart.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  weekStart.setDate(weekStart.getDate() + diffToMonday);

  const earliestPickup = filteredShipments.length
    ? filteredShipments.reduce((min, shipment) => (shipment.pickup_date < min ? shipment.pickup_date : min), filteredShipments[0].pickup_date)
    : null;

  const startOfView = earliestPickup ? new Date(earliestPickup) : new Date(weekStart);

  const calendarDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startOfView);
    date.setDate(startOfView.getDate() + index);
    return date;
  });

  const dayKeys = calendarDays.map((date) => date.toISOString().slice(0, 10));

  const shipmentsByDay = dayKeys.reduce((groups, key) => {
    groups[key] = filteredShipments.filter((shipment) => shipment.pickup_date === key);
    return groups;
  }, {});

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
      <div style={{ background: "#edf2f7", minHeight: "100vh", padding: "24px" }}>      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>
        <div style={{ minWidth: "240px" }}>
          <h2 style={{ margin: 0, color: COLORS.navy, fontSize: "32px" }}>Shipments</h2>
          <p style={{ margin: "10px 0 0", color: "#52606d" }}>Weekly pickup schedule with route filters and status controls.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button style={{ border: "none", borderRadius: "12px", background: "#f1f5f9", color: "#334155", padding: "10px 16px", cursor: "pointer" }}>
            Manager
          </button>
          <button 
            onClick={() => onRoleNavigate && onRoleNavigate("hours")}
            style={{ border: "none", borderRadius: "12px", background: "#f1f5f9", color: "#334155", padding: "10px 16px", cursor: "pointer" }}>
            Truck Driver
          </button>
          <button style={{ border: "none", borderRadius: "12px", background: "#f1f5f9", color: "#334155", padding: "10px 16px", cursor: "pointer" }}>
            Dispatcher
          </button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "24px", padding: "24px", marginBottom: "24px", boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {routeOptions.map((route) => (
              <button
                key={route}
                onClick={() => setSelectedRoute(route)}
                style={{
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 18px",
                  background: selectedRoute === route ? COLORS.navy : "#f8fafc",
                  color: selectedRoute === route ? "white" : "#334155",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {route}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%", justifyContent: "flex-end" }}>
            <input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: "220px", padding: "12px 16px", borderRadius: "16px", border: "1px solid #d1d5db", outline: "none", flex: "1 1 220px" }}
            />
            <button
              onClick={() => setShowModal(true)}
              style={{ background: COLORS.red, color: "white", border: "none", borderRadius: "16px", padding: "12px 18px", cursor: "pointer" }}
            >
              + Assign Load
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "22px" }}>
        {filteredShipments.length === 0 ? (
          <div style={{ background: "white", padding: "28px", borderRadius: "16px", textAlign: "center", color: "#6b7280" }}>
            No shipments match your filters.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(220px, 1fr))", gap: "18px", overflowX: "auto" }}>
            {calendarDays.map((date, index) => {
              const key = dayKeys[index];
              const shipmentsForDay = shipmentsByDay[key] || [];
              return (
                <div key={key} style={{ background: "white", borderRadius: "20px", padding: "18px", minHeight: "520px", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>{dayNames[index]}</p>
                      <h4 style={{ margin: "8px 0 0", color: COLORS.navy }}>{date.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</h4>
                    </div>
                    <span style={{ background: "#e2e8f0", color: "#0f172a", borderRadius: "999px", padding: "6px 12px", fontSize: "12px" }}>
                      {shipmentsForDay.length} load{shipmentsForDay.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div style={{ display: "grid", gap: "14px" }}>
                    {shipmentsForDay.length === 0 ? (
                      <div style={{ color: "#64748b", fontSize: "13px" }}>No pickups scheduled</div>
                    ) : (
                      shipmentsForDay.map((shipment) => (
                        <button
                          key={shipment.shipment_id}
                          type="button"
                          onClick={() => setSelectedShipment(shipment)}
                          style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "16px",
                            padding: "14px",
                            background: "#f8fafc",
                            textAlign: "left",
                            cursor: "pointer",
                            width: "100%",
                            boxSizing: "border-box",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px", marginBottom: "12px" }}>
                            <div>
                              <h5 style={{ margin: 0, color: COLORS.navy, fontSize: "15px" }}>{shipment.shipment_id}</h5>
                              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "12px" }}>{shipment.origin} → {shipment.destination}</p>
                            </div>
                            <span style={{ ...getStatusStyle(shipment.status), borderRadius: "999px", padding: "6px 10px", fontSize: "11px" }}>
                              {shipment.status}
                            </span>
                          </div>
                          <div style={{ display: "grid", gap: "8px", color: "#334155", fontSize: "13px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Route</span>
                              <span>{`Route ${shipment.route_id}`}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Pickup</span>
                              <span>{shipment.pickup_date}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Delivery</span>
                              <span>{shipment.delivery_date}</span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 20 }}>
          <div style={{ background: "white", width: "420px", margin: "100px auto", padding: "22px", position: "relative", borderRadius: "14px" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", right: 16, top: 16, border: "none", background: "transparent", fontSize: "18px", cursor: "pointer" }}>
              ✕
            </button>
            <AssignLoad />
          </div>
        </div>
      )}

      {selectedShipment && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.55)", zIndex: 25, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ background: "white", width: "100%", maxWidth: "520px", borderRadius: "18px", padding: "26px", position: "relative", boxShadow: "0 24px 80px rgba(15, 23, 42, 0.18)" }}>
            <button onClick={() => setSelectedShipment(null)} style={{ position: "absolute", right: 20, top: 20, border: "none", background: "transparent", fontSize: "20px", cursor: "pointer", color: "#475569" }}>
              ✕
            </button>
            <h2 style={{ margin: 0, color: COLORS.navy, fontSize: "22px" }}>{selectedShipment.shipment_id}</h2>
            <p style={{ margin: "10px 0 22px", color: "#64748b" }}>Tracking {selectedShipment.tracking_number}</p>
            <div style={{ display: "grid", gap: "14px", color: "#334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Status</span>
                <span style={{ ...getStatusStyle(selectedShipment.status), padding: "6px 12px", borderRadius: "999px", fontSize: "13px" }}>{selectedShipment.status}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Origin</span>
                <span>{selectedShipment.origin}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Destination</span>
                <span>{selectedShipment.destination}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Pickup Date</span>
                <span>{selectedShipment.pickup_date}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Delivery Date</span>
                <span>{selectedShipment.delivery_date}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Route</span>
                <span>{`Route ${selectedShipment.route_id}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Load Type</span>
                <span>{selectedShipment.shipment_type}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Weight</span>
                <span>{selectedShipment.weight}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>Driver ID</span>
                <span>{selectedShipment.driver_id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
