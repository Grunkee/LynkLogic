import React, { useState, useEffect } from 'react';
import { supabase } from './supabase_client';

export default function MakeReport() {
    const [showForm, setShowForm] = useState(false);
    
    const [vehicleId, setVehicleId] = useState("");
    const [reportType, setReportType] = useState("Engine");
    const [description, setDescription] = useState("");
    const [reportHistory, setReportHistory] = useState([]);

    useEffect(() => {
        async function fetchReportHistory() {
            const { data, error } = await supabase
                .from('damage_reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error details:", error);
            } else if (data) {
                const formattedRows = data.map((serverRecord) => ({
                    id: serverRecord.vehicle_id,
                    date: serverRecord.created_at ? new Date(serverRecord.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    type: serverRecord.type === "Engine" ? "Engine / Mechanical" : serverRecord.type,
                    status: "Submitted"
                }));
                setReportHistory(formattedRows);
            }
        }
        fetchReportHistory();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!vehicleId || !description) {
            return;
        }
        const payload = { 
            vehicle_id: vehicleId, 
            type: reportType, 
            description: description,
            email: "cotesamara@gmail.com" 
        };
        const { data, error } = await supabase.from('damage_reports').insert([payload]).select();
        if (error) {
            console.error("Supabase Error Details:", error);
            return;
        }
        if (data && data.length > 0) {
            console.log("Saved:", data);
            const serverRecord = data[0];
            const newReportRow = {
                id: serverRecord.vehicle_id,
                date: serverRecord.created_at ? new Date(serverRecord.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                type: serverRecord.type === "Engine" ? "Engine / Mechanical" : serverRecord.type,
                status: "Submitted"
            };
            setReportHistory((prev) => [newReportRow, ...prev]);
            const payload2 = { 
                Notif_id: vehicleId, 
                Notif_title: "Damage Report",
                Notif_msg: description 
            };
            setVehicleId("");
            setDescription("");
            setReportType("Engine");
            setShowForm(false);
        }
    }

    if (showForm) {
        return (
            <div style={{ padding: "60px 24px 24px 24px", maxWidth: "500px", margin: "0 auto", fontFamily: "Arial" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ color: "#0B3C5D", margin: 0 }}>Submit a Report</h2>
                    <button 
                        onClick={() => setShowForm(false)}
                        style={{ background: "transparent", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "#64748b", fontWeight: "600" }}
                    >
                        Back to History
                    </button>
                </div>
                <p style={{ color: "#64748b", marginBottom: "24px" }}>Fill out this form to notify maintenance as soon as possible.</p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "bold", color: "#334155" }}>Vehicle ID</label>
                        <input 
                            type="text"
                            placeholder="e.g., ABC-12345"
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#000000", outline: "none" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "bold", color: "#334155" }}>Type of Report</label>
                        <div style={{ position: "relative", width: "100%" }}>
                            <select 
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                style={{ width: "100%", padding: "12px 40px 12px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#000000", appearance: "none", outline: "none", cursor: "pointer" }}
                            >
                                <option value="Accident">Accident</option>
                                <option value="Engine">Engine / Mechanical</option>
                                <option value="Tires">Tires</option>
                                <option value="Lights">Lights</option>
                                <option value="Brakes">Brakes</option>
                                <option value="Delays">Delays</option>
                                <option value="Other">Other Issues</option>
                            </select>
                            <div style={{ position: "absolute", right: "14px", top: "46%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b", fontSize: "16px", fontWeight: "bold" }}>v</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "bold", color: "#334155" }}>Issue Description</label>
                        <textarea 
                            rows="4"
                            placeholder="Provide details about the damage or maintenance needed..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#000000", outline: "none", resize: "none" }}
                        />
                    </div>

                    <button 
                        type="submit"
                        style={{ background: "#D9534F", color: "white", border: "none", borderRadius: "8px", padding: "14px", fontWeight: "bold", fontSize: 14, cursor: "pointer", marginTop: "8px" }}
                    >
                        Submit Report
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: "80px 24px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h2 style={{ color: "#0B3C5D", margin: 0 }}>Report History</h2>
                    <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>View status updates on your submitted logs.</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    style={{ background: "#0B3C5D", color: "white", border: "none", borderRadius: "8px", padding: "12px 20px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
                >
                    + Make a New Report
                </button>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #cbd5e1", overflow: "auto", maxHeight: "400px", overflowY:"auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#0B3C5D", borderBottom: "1px solid #cbd5e1" }}>
                            <th style={{ position: "sticky", top: 0, background: "#0B3C5D", zIndex: 1, padding: "14px 16px", color: "#ffffff", fontWeight: "600" }}>ID</th>
                            <th style={{ position: "sticky", top: 0, background: "#0B3C5D", zIndex: 1, padding: "14px 16px", color: "#ffffff", fontWeight: "600" }}>Report Date</th>
                            <th style={{ position: "sticky", top: 0, background: "#0B3C5D", zIndex: 1, padding: "14px 16px", color: "#ffffff", fontWeight: "600" }}>Type of Report</th>
                            <th style={{ position: "sticky", top: 0, background: "#0B3C5D", zIndex: 1, padding: "14px 16px", color: "#ffffff", fontWeight: "600" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportHistory.map((report, index) => (
                            <tr key={report.id ? `${report.id}-${index}` : index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "14px 16px", color: "#0B3C5D", fontWeight: "bold" }}>{report.id}</td>
                                <td style={{ padding: "14px 16px", color: "#334155" }}>{report.date}</td>
                                <td style={{ padding: "14px 16px", color: "#334155" }}>{report.type}</td>
                                <td style={{ padding: "14px 16px" }}>
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "999px",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        background: report.status === "Resolved" ? "#dcfce7" : report.status === "In Progress" ? "#fef9c3" : "#fee2e2",
                                        color: report.status === "Resolved" ? "#166534" : report.status === "In Progress" ? "#854d0e" : "#991b1b"
                                    }}>
                                        {report.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

