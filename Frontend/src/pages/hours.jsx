import React, { useState, useEffect } from "react";
import { supabase } from "../supabase_client";

export default function Schedule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [weeklyHoursLogged, setWeeklyHoursLogged] = useState("0.0");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeShiftId, setActiveShiftId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHoursData();
  }, []);

  async function fetchHoursData() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("driver_hours")
        .select("*")
        .order("clock_in", { ascending: false });

      if (error) throw error;

      if (data) {
        setWeeklyLogs(data);
        const openShift = data.find((row) => row.clock_in && !row.clock_out);
        if (openShift) {
          setIsClockedIn(true);
          setActiveShiftId(openShift.id);
        } else {
          setIsClockedIn(false);
          setActiveShiftId(null);
        }

        calculateWeeklyHours(data);
      }
    } catch (err) {
      console.error("Error fetching driver hours:", err.message);
    } finally {
      setLoading(false);
    }
  }

  function calculateWeeklyHours(records) {
    if (!records || !Array.isArray(records)) return;

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const total = records.reduce((sum, row) => {
      if (!row.clock_in) return sum;

      const shiftDate = new Date(row.clock_in);

      if (shiftDate >= startOfWeek) {
        if (row.total_hours !== null && row.total_hours !== undefined) {
          return sum + parseFloat(row.total_hours);
        } else if (row.clock_in && !row.clock_out) {
          const elapsedHours = (new Date() - new Date(row.clock_in)) / (1000 * 60 * 60);
          return sum + elapsedHours;
        }
      }

      return sum;
    }, 0);

    setWeeklyHoursLogged(total.toFixed(1));
  }

  async function handleClockToggle() {
    try {
      const now = new Date().toISOString();

      if (!isClockedIn) {
        let driverName = "Driver";
        const { data: userData, error: userErr } = await supabase
          .from("users")
          .select("First_Name, Last_name")
          .limit(1)
          .single();

        if (!userErr && userData) {
          const fullName = `${userData.First_Name || ""} ${userData.Last_name || ""}`.trim();
          if (fullName) driverName = fullName;
        }

        const { data, error } = await supabase
          .from("driver_hours")
          .insert([
            { 
              driver_name: driverName, 
              clock_in: now 
            }
          ])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setIsClockedIn(true);
          setActiveShiftId(data[0].id);
          fetchHoursData();
        }
      } else {
        if (!activeShiftId) return;

        const { data: activeShift, error: fetchErr } = await supabase
          .from("driver_hours")
          .select("clock_in")
          .eq("id", activeShiftId)
          .single();

        if (fetchErr) throw fetchErr;

        const startTime = new Date(activeShift.clock_in);
        const endTime = new Date(now);
        const diffInHours = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2);

        const { error: updateErr } = await supabase
          .from("driver_hours")
          .update({
            clock_out: now,
            total_hours: parseFloat(diffInHours),
          })
          .eq("id", activeShiftId);

        if (updateErr) throw updateErr;

        setIsClockedIn(false);
        setActiveShiftId(null);
        fetchHoursData();
      }
    } catch (err) {
      alert(`Clock error: ${err.message}`);
    }
  }

  const filteredLogs = weeklyLogs.filter((log) => {
    if (!log || !log.clock_in) return false;
    const formattedDate = new Date(log.clock_in).toLocaleDateString("en-CA");
    return formattedDate.includes(searchQuery);
  });

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
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#000000",
            outline: "none"
          }}
        />
      </div>

      <div style={{
        width: "100%",
        background: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        marginBottom: "24px"
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
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#e49037" }}>{weeklyHoursLogged}h</span>
            <span style={{ fontSize: "9px", textTransform: "uppercase", fontWeight: 700, color: "#e49037" }}>Week</span>
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
          <button onClick={() => setIsAvailable((prev) => !prev)} style={{ background: isAvailable ? "#F59E0B" : "#2b7cb6", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            Set {isAvailable ? "Unavailable" : "Available"}
          </button>
          <button onClick={handleClockToggle} style={{ background: isClockedIn ? "#D9534F" : "#2d9473", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            {isClockedIn ? "Clock Out" : "Clock In"}
          </button>
        </div>
      </div>

      <div style={{ width: "100%", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "24px", boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Weekly Shift Logs</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "140px 180px 180px 1fr", padding: "12px 18px", background: "#0B3C5D", borderRadius: "6px", color: "#ffffff", fontWeight: "600" }}>
          <div>Date</div>
          <div>Clock In</div>
          <div>Clock Out</div>
          <div style={{ textAlign: "right" }}>Shift Hours</div>
        </div>

        <div style={{ maxHeight: "320px", overflowY: "auto", marginTop: "4px" }}>
          {loading ? (
            <p style={{ padding: "16px", color: "#64748b" }}>Loading logs from Supabase...</p>
          ) : filteredLogs.length === 0 ? (
            <p style={{ padding: "16px", color: "#64748b" }}>No shift history found.</p>
          ) : (
            filteredLogs.map((log) => {
              const clockInDate = new Date(log.clock_in);
              const formattedDate = clockInDate.toLocaleDateString("en-CA");
              const formattedInTime = clockInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              const formattedOutTime = log.clock_out 
                ? new Date(log.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "In Progress...";

              const hoursDisplay = log.total_hours !== null && log.total_hours !== undefined
                ? `${log.total_hours} hrs`
                : "Active";

              return (
                <div key={log.id} style={{ display: "grid", gridTemplateColumns: "140px 180px 180px 1fr", padding: "16px 18px", borderBottom: "1px solid #e2e8f0", alignItems: "center" }}>
                  <div style={{ fontWeight: 600 }}>{formattedDate}</div>
                  <div style={{ color: "#334155" }}>{formattedInTime}</div>
                  <div style={{ color: "#334155" }}>{formattedOutTime}</div>
                  <div style={{ textAlign: "right", fontWeight: 700, color: "#d89d49" }}>
                    {hoursDisplay}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
