import React, { useState } from 'react';

export default function MakeReport() {
    const [vehicleId, setVehicleId] = useState("");
    const [reportType, setReportType] = useState("Engine");
    const [description, setDescription] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        
        if (!vehicleId || !description) {
            alert("Please fill out all required fields.");
            return;
        }

        alert(`Report Sent! \nVehicle ID: ${vehicleId}\nType: ${reportType}\nDescription: ${description}`);
        
        setVehicleId("");
        setDescription("");
        setReportType("Engine");
    }

    return (
        <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto", fontFamily: "Arial" }}>
            <h2 style={{ color: "#0B3C5D", marginBottom: "8px" }}>Submit a Report</h2>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>Fill out this form to notify maintenance as soon as possible.</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "bold", color: "#334155" }}>Vehicle ID *</label>
                    <input 
                        type="text"
                        placeholder="e.g., ABC-12345"
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                        style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#000000", outline: "none", boxShadow: "none" }}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "bold", color: "#334155" }}>Type of Report</label>
                    <div style={{ position: "relative", width: "100%" }}>
                        <select 
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 40px 12px 12px",
                                borderRadius: "8px", 
                                border: "1px solid #cbd5e1", 
                                background: "#ffffff",
                                color: "#000000",
                                appearance: "none",
                                WebkitAppearance: "none",
                                MozAppearance: "none",
                                outline: "none",
                                cursor: "pointer"
                            }}
                        >
                            <option value="Accident">Accident</option>
                            <option value="Engine">Engine / Mechanical</option>
                            <option value="Tires">Tires</option>
                            <option value="Body Work">Lights</option>
                            <option value="Brakes">Brakes</option>
                            <option value="Delays">Delays</option>
                            <option value="Other">Other Issues</option>
                        </select>
                        <div style={{
                                position: "absolute",
                                right: "14px",
                                top: "46%",
                                transform: "translateY(-50%)",
                                pointerEvents: "none",
                                color: "#64748b",
                                fontSize: "16px",
                                fontWeight: "bold"
                            }}>
                            v
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "bold", color: "#334155" }}>Issue Description *</label>
                    <textarea 
                        rows="4"
                        placeholder="Provide details about the damage or maintenance needed..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            padding: "12px", 
                            borderRadius: "8px", 
                            border: "1px solid #cbd5e1", 
                            background: "#ffffff",
                            color: "#000000",
                            outline: "none", 
                            resize: "none",
                            boxShadow: "none"
                        }}
                    />
                </div>

                <button 
                    type="submit"
                    style={{ 
                        background: "#D9534F", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "8px", 
                        padding: "14px", 
                        fontWeight: "bold", 
                        cursor: "pointer",
                        marginTop: "8px"
                    }}
                >
                    Submit Damage Report
                </button>
            </form>
        </div>
    );
}
