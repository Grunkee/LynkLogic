export default function ShipmentDetails({ load, onBack }) {
  if (!load) return null;

  const route = `${load.pickupLocation} → ${load.deliveryLocation}`;

  return (
    <div
      style={{
        marginTop: "24px",
        background: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#0B3C5D",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontSize: "12px",
            }}
          >
            Shipment Details
          </p>
          <h3 style={{ margin: "6px 0 0", fontSize: "24px" }}>{load.id}</h3>
        </div>
        <button
          onClick={onBack}
          style={{
            background: "#D9534F",
            color: "#fff",
            border: "none",
            padding: "10px 14px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Back to list
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <DetailItem label="Driver" value={load.driverName} />
        <DetailItem label="Route" value={route} />
        <DetailItem label="Date" value={load.dateAssigned} />
        <DetailItem label="Status" value={load.status} />
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div style={{ background: "#f7f9fb", padding: "14px", borderRadius: "8px" }}>
      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "6px 0 0", fontSize: "15px", color: "#111827", fontWeight: 600 }}>{value}</p>
    </div>
  );
}
