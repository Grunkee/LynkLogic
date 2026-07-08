import React, { useState } from "react";

export default function Schedule({ 
  weeklyLogs = [], 
  weeklyHoursLogged = "23.0", 
  isClockedIn = false,
  isAvailable = true,
  onClockToggle, 
  onAvailabilityToggle 
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = weeklyLogs.filter((log) =>
    log.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.scheduleType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="center" style={{ width: "100%", padding: "24px", boxSizing: "border-box", color: "#111827", textAlign: "left" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "20px", marginBottom: "8px" }}>
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "600" }}>Schedule</h2>
        <input
          type="text"
          placeholder="Search weekly report..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "#ffffff",
            color: "var(--text-h)",
            outline: "none"
          }}
        />
      </div>

      <div style={{
        width: "100%",
        background: "#ffffff",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, textTransform: "uppercase" }}>Hours</p>
          
          <div style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            margin: 0,
            background: "#f8dba4",
            border: `2px solid ${isClockedIn ? "#ec963f" : "#e49037"}`
          }}>
            <span style={{ fontSize: "16px", fontWeight: 800, color: isClockedIn ? "#e49037" : "#e49037" }}>{weeklyHoursLogged}h</span>
            <span style={{ fontSize: "9px", textTransform: "uppercase", fontWeight: 700, color : "#e49037" }}>Week</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isClockedIn ? "#10B981" : "#D9534F" }} />
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>{isClockedIn ? "Active" : "Clocked Out"}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isAvailable ? "#10B981" : "#F59E0B" }} />
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>{isAvailable ? "Available" : "Unavailable"}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onAvailabilityToggle} style={{ background: isAvailable ? "#F59E0B" : "#10B981", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            Set {isAvailable ? "Unavailable" : "Available"}
          </button>
          <button onClick={onClockToggle} style={{ background: isClockedIn ? "#D9534F" : "#111827", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            {isClockedIn ? "Clock Out" : "Clock In"}
          </button>
        </div>
      </div>

      <div style={{ width: "100%", background: "#ffffff", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Weekly Report</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "130px 180px 1fr 100px 90px", padding: "12px 18px", background: "#374151", borderRadius: "6px", color: "#ffffff", fontWeight: "600" }}>
          <div>Date</div>
          <div>Schedule</div>
          <div style={{ textAlign: "right" }}>Hours</div>
        </div>

        <div style={{ 
        maxHeight: "320px",
        overflowY: "auto",
        marginTop: "4px",
        paddingRight: "4px"
      }}>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "4px" }}>
          {filteredLogs.map((log, index) => (
            <div key={index} style={{ display: "grid", gridTemplateColumns: "130px 180px 1fr 100px 90px", padding: "16px 18px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
              <div style={{ fontWeight: 600 }}>{log.date}</div>
              <div style={{ color: "var(--text)" }}>{log.scheduleType}</div>
              <div style={{ textAlign: "right", fontWeight: 700, color: "#d89d49" }}>{log.hoursDriven} hrs</div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
