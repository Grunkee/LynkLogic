import React, { useState } from 'react';

export const DATA_TEST = [
  { date: "Jul 8, 2026", scheduleType: "6:00 am - 2:30 pm", hoursDriven: "8.5" },
  { date: "Jul 7, 2026", scheduleType: "8:00 am - 5:00 pm", hoursDriven: "9.0" },
  { date: "Jul 6, 2026", scheduleType: "9:00 am - 4:30 pm", hoursDriven: "7.5" },
  { date: "Jul 1, 2026", scheduleType: "7:00 am - 6:00 pm", hoursDriven: "11.0" },
  { date: "Jun 30, 2026", scheduleType: "10:00 am - 2:30 pm", hoursDriven: "4.5" },
  { date: "Jun 29, 2026", scheduleType: "7:30 am - 4:00 pm", hoursDriven: "8.5" },
  { date: "Jun 28, 2026", scheduleType: "9:00 am - 1:00 pm", hoursDriven: "4.0" },
  { date: "Jun 27, 2026", scheduleType: "9:00 am - 1:00 pm", hoursDriven: "4.0" },
  { date: "Jun 26, 2026", scheduleType: "9:00 am - 1:00 pm", hoursDriven: "4.0" },
  { date: "Jun 22, 2026", scheduleType: "9:00 am - 1:00 pm", hoursDriven: "4.0" },
  { date: "Jun 21, 2026", scheduleType: "9:00 am - 1:00 pm", hoursDriven: "4.0" },
  { date: "Jun 19, 2026", scheduleType: "9:00 am - 1:00 pm", hoursDriven: "4.0" },
];

export default function AssignHours({ onAddLog }) {
    const [date, setDate] = useState("");
    const [scheduleType, setScheduleType] = useState("");
    const [hoursDriven, setHoursDriven] = useState("");

    function submitButton() {
        if (!date || !scheduleType || !hoursDriven) {
            alert("Please fill out all fields.");
            return;
        }

        if (onAddLog) {
            onAddLog({
                date: date,
                scheduleType: scheduleType,
                hoursDriven: hoursDriven
            });
        }

        alert("The new hours log was assigned.");
        
        setDate("");
        setScheduleType("");
        setHoursDriven("");
    }

    return (
        <div style={{ fontFamily: "Arial", padding: "10px" }}>
            <h2 style={{ margin: "0 0 16px 0", color: "#0B3C5D" }}>Assign New Hours Log</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                    placeholder="Date (e.g., Jul 9, 2026)"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", outline: "none" }}
                />
                <input
                    placeholder="Schedule Type (e.g., 9:00 am - 5:00 pm)"
                    value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value)}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", outline: "none" }}
                />
                <input
                    placeholder="Hours Driven (e.g., 8.0)"
                    value={hoursDriven}
                    onChange={(e) => setHoursDriven(e.target.value)}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", outline: "none" }}
                />
                <button 
                    onClick={submitButton}
                    style={{ 
                        background: "#D9534F", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "8px", 
                        padding: "12px", 
                        fontWeight: "bold", 
                        cursor: "pointer" 
                    }}
                >
                    Add Hours Log
                </button>
            </div>
        </div>
    );
}
