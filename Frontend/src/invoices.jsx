import { useState } from "react";

const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  white: "#FFFFFF",
};

const DUMMY_INVOICES = [
  {
    invoiceId: "INV1001",
    loadId: "LD1001",
    customerName: "ABC Logistics",
    customerEmail: "billing@abclogistics.com",
    estimatedHours: 8,
    actualHours: 7.5,
    hourlyRate: 85,
    status: "Sent",
    createdAt: "2026-07-10",
  },
  {
    invoiceId: "INV1002",
    loadId: "LD1002",
    customerName: "Northline Foods",
    customerEmail: "finance@northline.com",
    estimatedHours: 6,
    actualHours: 6.5,
    hourlyRate: 85,
    status: "Draft",
    createdAt: "2026-07-11",
  },
  {
    invoiceId: "INV1003",
    loadId: "LD1003",
    customerName: "Maple Freight",
    customerEmail: "accounts@maplefreight.com",
    estimatedHours: 10,
    actualHours: 9,
    hourlyRate: 85,
    status: "Paid",
    createdAt: "2026-07-12",
  },
];

function getStatusStyle(status) {
  if (status === "Draft") return { backgroundColor: "#757575", color: "#fff" };
  if (status === "Sent") return { backgroundColor: "#0B3C5D", color: "#fff" };
  if (status === "Paid") return { backgroundColor: "#2e7d32", color: "#fff" };
  if (status === "Overdue") return { backgroundColor: "#D9534F", color: "#fff" };
  return { backgroundColor: "#757575", color: "#fff" };
}

const cellStyle = {
  padding: "12px 16px",
  fontSize: "14px",
  color: "#333",
  borderBottom: "1px solid #eee",
};

const headerStyle = {
  padding: "12px 16px",
  textAlign: "left",
  color: "#9ca3af",
  borderBottom: "1px solid #eee",
};

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState(DUMMY_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;

    const matchesSearch =
      invoice.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.loadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  function handleStatusChange(invoiceId, newStatus) {
    setInvoices((currentInvoices) =>
      currentInvoices.map((invoice) =>
        invoice.invoiceId === invoiceId
          ? { ...invoice, status: newStatus }
          : invoice
      )
    );
  }

  function handlePrintInvoice(invoice) {
    alert(`Invoice ${invoice.invoiceId} is ready to print.`);
  }

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: COLORS.navy,
          color: COLORS.white,
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Invoices</h2>
      </div>

      <div
        style={{
          background: "white",
          padding: "12px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Search invoice, load, or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="All">All</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>

        <span>{filteredInvoices.length} invoices</span>
      </div>

      <table
        style={{
          width: "100%",
          background: "white",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Invoice ID</th>
            <th style={headerStyle}>Load ID</th>
            <th style={headerStyle}>Customer</th>
            <th style={headerStyle}>Estimated Hours</th>
            <th style={headerStyle}>Actual Hours</th>
            <th style={headerStyle}>Total</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Date Created</th>
            <th style={headerStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredInvoices.map((invoice) => {
            const total = invoice.actualHours * invoice.hourlyRate;

            return (
              <tr key={invoice.invoiceId}>
                <td style={cellStyle}>{invoice.invoiceId}</td>
                <td style={cellStyle}>{invoice.loadId}</td>
                <td style={cellStyle}>
                  {invoice.customerName}
                  <br />
                  <small>{invoice.customerEmail}</small>
                </td>
                <td style={cellStyle}>{invoice.estimatedHours}</td>
                <td style={cellStyle}>{invoice.actualHours}</td>
                <td style={cellStyle}>${total.toFixed(2)}</td>
                <td style={cellStyle}>
                  <select
                    value={invoice.status}
                    onChange={(e) =>
                      handleStatusChange(invoice.invoiceId, e.target.value)
                    }
                    style={{
                      ...getStatusStyle(invoice.status),
                      padding: "4px 10px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </td>
                <td style={cellStyle}>{invoice.createdAt}</td>
                <td style={cellStyle}>
                  <button
                    onClick={() => handlePrintInvoice(invoice)}
                    style={{
                      background: COLORS.red,
                      color: COLORS.white,
                      border: "none",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Print
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
