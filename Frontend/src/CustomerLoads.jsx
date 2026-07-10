// import react + supabase + past deliveries
import React, { useState, useEffect } from 'react'
import { supabase } from './supabase_client'
import PastDeliveries from './loadhistory'

// brand colors
const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  white: "#FFFFFF",
}

// formats the eta from the database into a readable date and time
function formatETA(eta) {
  if (!eta) return "Not set"
  const date = new Date(eta)
  return date.toLocaleString()
}

// main component that shows active loads with their ETA
function CustomerLoads() {

  // stores the loads from the database
  const [loads, setLoads] = useState([])

  //stores history
  const [showHistory, setShowHistory] = useState(false)

  // runs once when the page loads. grabs loads from supabase
  useEffect(() => {
    async function fetchLoads() {
      const { data } = await supabase
        .from("loads")
        .select("*")
        .neq("status", "Delivered") // only show active loads, not past ones
      if (data) setLoads(data)
    }
    fetchLoads()
  }, [])

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh", padding: "24px" }}>

      {/* page header */}
      <div style={{
        background: COLORS.navy,
        color: COLORS.white,
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>Track My Deliveries</h2>
      </div>

      <button
        onClick={() => setShowHistory(true)}
        style={{
          background: COLORS.red,
          color: COLORS.white,
          padding: "10px 16px",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px"
        }
      }
    >
    Delivery History
    </button>

      {/* table */}
      <table style={{ width: "100%", background: COLORS.white, borderCollapse: "collapse", marginTop: "16px" }}>
        <thead>
          <tr style={{ background: COLORS.navy, color: COLORS.white }}>
            <th style={{ padding: "12px", textAlign: "left" }}>Load ID</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Pickup</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Delivery</th>
            <th style={{ padding: "12px", textAlign: "left" }}>ETA</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
          </tr>
        </thead>

        <tbody>
          {loads.map((load) => (
            <tr key={load.load_id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "12px" }}>LD{load.load_id}</td>
              <td style={{ padding: "12px" }}>{load.pickup_location}</td>
              <td style={{ padding: "12px" }}>{load.delivery_location}</td>
              <td style={{ padding: "12px" }}>{formatETA(load.eta)}</td>
              <td style={{ padding: "12px" }}>{load.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* shows this if no loads are found */}
      {loads.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "24px", color: "#777" }}>
          No active loads found.
        </p>
      )}

      {showHistory && (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)" }}>
        <div style={{ background: "white", width: "700px", margin: "100px auto", padding: "20px", position: "relative" }}>
            <button onClick={() => setShowHistory(false)} style={{ position: "absolute", right: 10, top: 10 }}>✕</button>
            <PastDeliveries />
        </div>
    </div>
    )}

    </div>
  )
}

// export so other files can use it
export default CustomerLoads