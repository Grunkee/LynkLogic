export default function DriverSidebar({ currentPage, onNavigate }) {
  const mainItems = [
    { id: "hours", label: "Schedule"},
  ];

  const truckerItems = [
    { id: "messages", label: "Messages" },
    { id: "reports", label: "Make a Report" },
  ];

  const bottomItems = [
    { id: "settings", label: "Settings" },
    { id: "help", label: "Help" },
    { id: "logout", label: "Logout" },
  ];

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
        
        {mainItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              border: "none",
              borderRadius: "999px",
              background: currentPage === item.id ? "#111827" : "transparent",
              color: "#f8fafc",
              cursor: "pointer",
              fontSize: "15px",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span style={{ width: "14px", height: "14px", borderRadius: "999px", background: currentPage === item.id ? "#f8fafc" : "#111827" }} />
            {item.label}
          </button>
        ))}

        {truckerItems.map((item) => (
          <button
            key={item.id}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              border: "none",
              borderRadius: "999px",
              background: "transparent",
              color: "#f8fafc",
              cursor: "default",
              fontSize: "15px",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span style={{ width: "14px", height: "14px", borderRadius: "999px", background: "#111827" }} />
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "20px 16px 24px", borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", gap: "14px" }}>
        {bottomItems.map((item) => (
          <button
            key={item.id}
            type="button"
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
