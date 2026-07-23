import React, { useState } from 'react'

const p = {
  navy: "#0B3C5D",
  red: "#D9534F",
  dark: "#323232",
  white: "#FFFFFF",
  gray: "#E5E7EB",
  lightBg: "#F5F5F5",
  textMuted: "#6B7280",
  badgeBg: "#EF4444"
}

const d = [
  { id: 1, fn: "John", ln: "Smith", u: 2, r: "Dispatcher", l: "10:42 AM" },
  { id: 2, fn: "Sarah", ln: "Jenkins", u: 0, r: "Lead Dispatcher", l: "Yesterday" },
  { id: 3, fn: "Michael", ln: "Brown", u: 1, r: "Fleet Coordinator", l: "Jul 21" },
  { id: 4, fn: "Emily", ln: "Davis", u: 0, r: "Dispatcher", l: "Jul 19" }
]

const initialMsgs = {
  1: [
    { id: 101, s: "John Smith", t: "Hello, please confirm your delivery status for Load #4021.", time: "10:30 AM", d: false },
    { id: 102, s: "Me", t: "Running about 15 minutes late due to traffic on I-95.", time: "10:35 AM", d: true },
    { id: 103, s: "John Smith", t: "Thanks for the update. Keep us posted.", time: "10:42 AM", d: false }
  ],
  2: [
    { id: 201, s: "Sarah Jenkins", t: "Please review the updated route map in your schedule.", time: "Yesterday", d: false },
    { id: 202, s: "Me", t: "Got it, thanks Sarah!", time: "Yesterday", d: true }
  ],
  3: [
    { id: 301, s: "Michael Brown", t: "Did you complete the fuel report for yesterday?", time: "Jul 21", d: false }
  ],
  4: [
    { id: 401, s: "Emily Davis", t: "All set for your next assignment on Monday.", time: "Jul 19", d: false }
  ]
}

export default function Messages() {
  const [s, setS] = useState(1)
  const [q, setQ] = useState("")
  const [mq, setMq] = useState("")
  const [t, setT] = useState("")
  const [m, setM] = useState(initialMsgs)
  const [cl, setCl] = useState(() =>
    d.map(item => item.id === 1 ? { ...item, u: 0 } : item)
  )

  const totU = cl.reduce((acc, x) => acc + (x.u || 0), 0)

  const f = cl.filter(item => {
    const nameMatch = `${item.fn} ${item.ln}`.toLowerCase().includes(q.toLowerCase())
    const msgs = m[item.id] || []
    const msgMatch = msgs.some(msg => msg.t.toLowerCase().includes(q.toLowerCase()))
    return nameMatch || msgMatch
  })

  const selC = cl.find(item => item.id === s) || cl[0]

  const curMsgs = m[s] || []
  const fMsgs = curMsgs.filter(msg => msg.t.toLowerCase().includes(mq.toLowerCase()))

  const send = (e) => {
    e.preventDefault()
    if (!t.trim()) return
    const newM = {
      id: Date.now(),
      s: "Me",
      t: t.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      d: true
    }
    setM(prev => ({
      ...prev,
      [s]: [...(prev[s] || []), newM]
    }))
    setCl(prev => prev.map(item => item.id === s ? { ...item, l: "Just now" } : item))
    setT("")
  }

  const sim = () => {
    if (!selC) return
    const incM = {
      id: Date.now(),
      s: `${selC.fn} ${selC.ln}`,
      t: "New update regarding your current assignment load.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      d: false
    }
    setM(prev => ({
      ...prev,
      [s]: [...(prev[s] || []), incM]
    }))
    setCl(prev => prev.map(item => item.id === s ? { ...item, l: "Just now" } : item))
  }

  return (
    <div style={{ background: p.lightBg, minHeight: "calc(100vh - 72px)", padding: "24px", boxSizing: "border-box" }}>
      <div style={{ background: p.navy, color: p.white, padding: "16px 24px", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Driver Communication</h2>
          {totU > 0 && (
            <span style={{ background: p.badgeBg, color: p.white, padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
              {totU} Unread
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={sim}
            style={{ background: "rgba(255,255,255,0.15)", color: p.white, border: "1px solid rgba(255,255,255,0.3)", padding: "6px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
          >
            Simulate Incoming Message
          </button>
          <span style={{ fontSize: "14px", background: "rgba(255,255,255,0.15)", padding: "6px 12px", borderRadius: "6px" }}>Dispatch Chat</span>
        </div>
      </div>

      <div style={{ display: "flex", background: p.white, height: "calc(100vh - 200px)", minHeight: "500px", borderRadius: "0 0 8px 8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <div style={{ width: "320px", borderRight: `1px solid ${p.gray}`, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px", borderBottom: `1px solid ${p.gray}` }}>
            <input
              type="text"
              placeholder="Search contacts or past messages..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${p.navy}`, borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {f.map(item => {
              const active = item.id === s
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setS(item.id)
                    setCl(prev => prev.map(x => x.id === item.id ? { ...x, u: 0 } : x))
                  }}
                  style={{
                    padding: "14px 16px",
                    borderBottom: `1px solid ${p.gray}`,
                    cursor: "pointer",
                    background: active ? "#EBF5FF" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: p.navy, color: p.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                      {item.fn[0]}{item.ln[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "15px", color: p.dark }}>{item.fn} {item.ln}</div>
                      <div style={{ fontSize: "12px", color: p.textMuted }}>{item.r}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span style={{ fontSize: "11px", color: p.textMuted }}>{item.l}</span>
                    {item.u > 0 && (
                      <span style={{ background: p.badgeBg, color: p.white, borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold" }}>
                        {item.u}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {f.length === 0 && (
              <div style={{ padding: "20px", textAlign: "center", color: p.textMuted, fontSize: "13px" }}>
                No matching conversations found
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {selC ? (
            <>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${p.gray}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: p.navy, color: p.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                    {selC.fn[0]}{selC.ln[0]}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", color: p.dark }}>{selC.fn} {selC.ln}</h3>
                    <span style={{ fontSize: "12px", color: "green" }}>Online</span>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Filter chat history..."
                  value={mq}
                  onChange={(e) => setMq(e.target.value)}
                  style={{ padding: "6px 12px", border: `1px solid ${p.gray}`, borderRadius: "6px", fontSize: "13px", width: "200px" }}
                />
              </div>

              <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", background: "#FAF3EE" }}>
                {fMsgs.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.d ? "flex-end" : "flex-start",
                      maxWidth: "65%"
                    }}
                  >
                    <div
                      style={{
                        background: msg.d ? p.navy : p.white,
                        color: msg.d ? p.white : p.dark,
                        padding: "12px 16px",
                        borderRadius: msg.d ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                        fontSize: "14px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                    >
                      {msg.t}
                    </div>
                    <div style={{ fontSize: "11px", color: p.textMuted, marginTop: "4px", textAlign: msg.d ? "right" : "left" }}>
                      {msg.s} • {msg.time}
                    </div>
                  </div>
                ))}
                {fMsgs.length === 0 && (
                  <div style={{ textAlign: "center", color: p.textMuted, marginTop: "20px", fontSize: "14px" }}>
                    No messages match your search filter.
                  </div>
                )}
              </div>

              <form onSubmit={send} style={{ padding: "16px", borderTop: `1px solid ${p.gray}`, display: "flex", gap: "12px", background: p.white }}>
                <input
                  type="text"
                  placeholder="Type a message to dispatcher..."
                  value={t}
                  onChange={(e) => setT(e.target.value)}
                  style={{ flex: 1, padding: "12px 16px", border: `1px solid ${p.gray}`, borderRadius: "6px", fontSize: "14px", outline: "none" }}
                />
                <button
                  type="submit"
                  style={{ background: p.red, color: p.white, border: "none", borderRadius: "6px", padding: "0 24px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: p.textMuted }}>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
