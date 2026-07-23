import { useMemo, useState, useEffect } from "react";
import { DUMMY_SHIPMENTS } from "../loadshipments";

function uniq(arr) {
  return Array.from(new Set(arr));
}

function parseRegion(loc) {
  // expect format "City, PROV"
  if (!loc) return "Unknown";
  const parts = loc.split(",");
  return parts.length > 1 ? parts[1].trim() : "Unknown";
}

export default function Manager() {
  const [selectedRoute, setSelectedRoute] = useState("All Routes");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNarrow, setIsNarrow] = useState(typeof window !== 'undefined' ? window.innerWidth < 900 : false);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const routes = useMemo(() => ["All Routes", ...uniq(DUMMY_SHIPMENTS.map((s) => `Route ${s.route_id}`))], []);
  const regions = useMemo(() => ["All Regions", ...uniq(DUMMY_SHIPMENTS.map((s) => parseRegion(s.origin)).concat(DUMMY_SHIPMENTS.map((s) => parseRegion(s.destination))) )], []);

  const filtered = useMemo(() => {
    return DUMMY_SHIPMENTS.filter((s) => {
      if (selectedRoute !== "All Routes" && `Route ${s.route_id}` !== selectedRoute) return false;
      if (selectedRegion !== "All Regions") {
        const r1 = parseRegion(s.origin);
        const r2 = parseRegion(s.destination);
        if (r1 !== selectedRegion && r2 !== selectedRegion) return false;
      }
      if (startDate && s.pickup_date < startDate) return false;
      if (endDate && s.delivery_date > endDate) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!(
          s.shipment_id.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q) ||
          (s.tracking_number || "").toLowerCase().includes(q)
        )) return false;
      }
      return true;
    });
  }, [selectedRoute, selectedRegion, startDate, endDate, searchQuery]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const delivered = filtered.filter((s) => s.status === "Delivered");
    const deliveredCount = delivered.length;
    const onTimePercent = total === 0 ? 0 : Math.round((deliveredCount / total) * 100);

    const transitDays = filtered
      .map((s) => {
        if (!s.pickup_date || !s.delivery_date) return null;
        const p = new Date(s.pickup_date);
        const d = new Date(s.delivery_date);
        const diff = Math.round((d - p) / (1000 * 60 * 60 * 24));
        return diff >= 0 ? diff : null;
      })
      .filter((x) => x !== null);

    const avgTransit = transitDays.length === 0 ? 0 : (transitDays.reduce((a, b) => a + b, 0) / transitDays.length).toFixed(1);

    return {
      total,
      deliveredCount,
      onTimePercent,
      avgTransit,
    };
  }, [filtered]);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 24 }}>
      <div style={{ background: "#0B3C5D", color: "white", padding: 18, borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Manager — Route KPIs</h2>
          <p style={{ margin: 0, color: "#dbeafe" }}>Route performance summary and shipment details</p>
        </div>
        <div style={{ display: "wrap", gap: 10, flexWrap:  "wrap" }}>
          <button style={{ background: "white", color: "#0B3C5D", padding: "8px 12px", borderRadius: 12, border: "none", cursor: "pointer" }}>Refresh</button>
          <button style={{ background: "#D9534F", color: "white", padding: "8px 12px", borderRadius: 12, border: "none", cursor: "pointer" }}>Export</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, marginTop: 16, alignItems: "flex-start" }}>
        {/* left / center: filters + graphs + table */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", padding: 14, borderRadius: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <input placeholder="Search shipments" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: "1 1 300px", padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
            <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)} style={{ padding: 10, borderRadius: 10 }}>
              {routes.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} style={{ padding: 10, borderRadius: 10 }}>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
            </div>
            <button onClick={() => { setSelectedRoute("All Routes"); setSelectedRegion("All Regions"); setStartDate(""); setEndDate(""); }} style={{ background: "#0B3C5D", color: "white", padding: "8px 12px", borderRadius: 10, border: "none" }}>Reset</button>
          </div>

          <div style={{ background: "white", padding: 18, borderRadius: 20, minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            {/* placeholder for graphs */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#334155" }}>Graphs Placeholder</div>
              <div style={{ marginTop: 8 }}>Add charts here (route performance, delays, volume)</div>
            </div>
          </div>

          <div style={{ background: "white", padding: 16, borderRadius: 16 }}>
            <h3 style={{ marginTop: 0 }}>Matching Shipments</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#475569", fontSize: 13 }}>
                  <th>Shipment ID</th>
                  <th>Route</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.shipment_id} style={{ borderBottom: "1px solid #eef2f7" }}>
                    <td style={{ padding: "10px 6px" }}>{s.shipment_id}</td>
                    <td>{`Route ${s.route_id}`}</td>
                    <td>{s.origin}</td>
                    <td>{s.destination}</td>
                    <td>{s.pickup_date}</td>
                    <td>{s.delivery_date}</td>
                    <td>{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* right: KPI column */}
        <aside style={{ width: 320, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "white", padding: 16, borderRadius: 16, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
            <div style={{ color: "#64748b", fontSize: 13 }}>Total Loads</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{kpis.total}</div>
          </div>

          <div style={{ background: "white", padding: 16, borderRadius: 16, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
            <div style={{ color: "#64748b", fontSize: 13 }}>Delivered</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{kpis.deliveredCount}</div>
          </div>

          <div style={{ background: "white", padding: 16, borderRadius: 16, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
            <div style={{ color: "#64748b", fontSize: 13 }}>On-time %</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{kpis.onTimePercent}%</div>
          </div>

          <div style={{ background: "white", padding: 16, borderRadius: 16, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
            <div style={{ color: "#64748b", fontSize: 13 }}>Avg Transit (days)</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{kpis.avgTransit}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
