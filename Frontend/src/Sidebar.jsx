import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase_client'

export default function Sidebar({ currentPage, onNavigate, role }) {
  const allItems = [
    { id: "loadassignments", label: "Load Assignments", roles: ["dispatcher"] },
    { id: "shipments", label: "Shipments", roles: ["manager"] },
    { id: "customerloads", label: "Track My Deliveries", roles: ["customer"] },

    { id: "hours", label: "Schedule", roles: ["driver"] },
    { id: "messages", label: "Messages", roles: ["driver"], placeholder: true },
    { id: "reports", label: "Make a Report", roles: ["driver"] },
  ];

  const mainItems = allItems.filter(item => item.roles.includes(role))

  const bottomItems = [
    { id: "settings", label: "Settings" },
    { id: "help", label: "Help" },
    { id: "logout", label: "Logout" },
  ];

  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate("/login")
  }

  return (
    <aside
      style={{
        width: "220px",
        minWidth: "220px",
        maxWidth: "220px",
        flexShrink: 0,
        boxSizing: "border-box",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0B3C5D",
        color: "#fff",
      }}
    >
      <div style={{ background: "#d1d5db", color: "#111827", padding: "36px 20px 24px", textAlign: "center" }}>
        <div style={{ width: "72px", height: "72px", margin: "0 auto 18px", borderRadius: "999px", background: "#111827" }} />
        <p style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>FirstName LastName</p>
      </div>

      <nav style={{ flex: 1, padding: "24px 16px", display: "flex", flexDirection: "column", gap: "18px" }}>
        {mainItems.map((item) => {
          const isActive = currentPage === item.id;
          const cursor = item.placeholder ? "default" : "pointer";
          const handleClick = () => {
            if (item.placeholder) {
              return;
            }
            if (onNavigate) {
              onNavigate(item.id);
            }
          };
          return (
            <button
              key={item.id}
              onClick={handleClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                border: "none",
                borderRadius: "999px",
                background: currentPage === item.id ? "#111827" : "transparent",
                color: "#f8fafc",
                cursor: cursor,
                fontSize: "15px",
                textAlign: "left",
              }}
            >
              <span style={{ width: "14px", height: "14px", borderRadius: "999px", background: currentPage === item.id ? "#f8fafc" : "#111827" }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "20px 16px 24px", borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", gap: "14px" }}>
        {bottomItems.map((item) => (
            <button
            key={item.id}
            type="button"
            onClick={item.id === "logout" ? handleLogout : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              border: "none",
              background: "transparent",
              color: "#f8fafc",
              cursor: "pointer",
              fontSize: "14px",
              textAlign: "left",
              padding: 0,
            }}
          >
            <span style={{ width: "14px", height: "14px", borderRadius: "999px", background: "#111827" }} />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
