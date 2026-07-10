export default function DriverSidebar({ currentPage, onNavigate }) {
  const mainItems = [
    { id: "hours", label: "Schedule"},
  ];

  const truckerItems = [
    { id: "messages", label: "Messages", placeholder: true },
    { id: "reports", label: "Make a Report" },
  ];

  const bottomItems = [
    { id: "settings", label: "Settings" },
    { id: "help", label: "Help" },
    { id: "logout", label: "Logout" },
  ];
const renderSidebarButton = (item, isBottomSection = false) => {
    const isActive = currentPage === item.id;

    const background = isActive ? "#111827" : "transparent";
    const dotBackground = isActive ? "#f8fafc" : "#111827";
    const cursor = item.placeholder ? "default" : "pointer";
    const padding = isBottomSection ? "0px" : "10px 14px";
    const fontSize = isBottomSection ? "14px" : "15px";

    const handleClick = () => {
      if (!item.placeholder && !item.isStatic && onNavigate) {
        onNavigate(item.id);
      }
    };

    return (
      <button
        key={item.id}
        type="button"
        onClick={handleClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          padding: padding,
          border: "none",
          borderRadius: "999px",
          background: background,
          color: "#f8fafc",
          cursor: cursor,
          fontSize: fontSize,
          textAlign: "left",
        }}
      >
        <span style={{ width: "14px", height: "14px", borderRadius: "999px", background: dotBackground }} />
        {item.label}
      </button>
    );
  };

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
        {mainItems.map((item) => renderSidebarButton(item))}
        {truckerItems.map((item) => renderSidebarButton(item))}
      </nav>

      <div style={{ padding: "20px 16px 24px", borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", gap: "14px" }}>
        {bottomItems.map((item) => renderSidebarButton(item, true))}
      </div>
    </aside>
  );
}
