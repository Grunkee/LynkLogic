import { useState } from "react";

const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  white: "#FFFFFF",
};

const SHIPMENTS = [
  {
    shipment_id: "S1001",
    driver: "Hanna Res",
    route: "Toronto → Ottawa",
    status: "Current",
    shipment_type: "Dry Van",
    pickup_date: "2026-06-08",
    delivery_date: "2026-06-10",
  },
  {
    shipment_id: "S1002",
    driver: "Bea Rix",
    route: "Hamilton → London",
    status: "Past",
    shipment_type: "Flatbed",
    pickup_date: "2026-05-30",
    delivery_date: "2026-06-01",
  },
  {
    shipment_id: "S1003",
    driver: "Rawa Atika",
    route: "Waterloo → Windsor",
    status: "Future",
    shipment_type: "Reefer",
    pickup_date: "2026-07-02",
    delivery_date: "2026-07-04",
  },
  {
    shipment_id: "S1004",
    driver: "Amias Ruben",
    route: "Barrie → Toronto",
    status: "Current",
    shipment_type: "Dry Van",
    pickup_date: "2026-06-15",
    delivery_date: "2026-06-16",
  },
];

export default function ShipmentTable() {

  const [driverFilter, setDriverFilter] = useState("All Drivers");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const drivers = [
    "All Drivers",
    ...new Set(SHIPMENTS.map((s) => s.driver)),
  ];

  const filteredShipments = SHIPMENTS.filter((shipment) => {

    const matchesDriver =
      driverFilter === "All Drivers" ||
      shipment.driver === driverFilter;

    const matchesStatus =
      statusFilter === "All" ||
      shipment.status === statusFilter;

    const matchesSearch =
      shipment.shipment_id
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesDriver && matchesStatus && matchesSearch;
  });

  return (
    <div style={{ padding: "30px" }}>

      <h1 style={{ color: COLORS.navy }}>Shipments</h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Search Shipment ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={driverFilter}
          onChange={(e) => setDriverFilter(e.target.value)}
        >
          {drivers.map((driver) => (
            <option key={driver}>{driver}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Past</option>
          <option>Current</option>
          <option>Future</option>
        </select>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Shipment ID</th>
            <th>Driver</th>
            <th>Route</th>
            <th>Type</th>
            <th>Status</th>
            <th>Pickup</th>
            <th>Delivery</th>
          </tr>
        </thead>

        <tbody>
          {filteredShipments.map((shipment) => (
            <tr key={shipment.shipment_id}>
              <td>{shipment.shipment_id}</td>
              <td>{shipment.driver}</td>
              <td>{shipment.route}</td>
              <td>{shipment.shipment_type}</td>
              <td>{shipment.status}</td>
              <td>{shipment.pickup_date}</td>
              <td>{shipment.delivery_date}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
