import React, { useState, useEffect } from 'react';
export default function Settings() {
    const [saving, setSaving] = useState(false);

    const [firstName, setFirstName] = useState("Samara");
    const [lastName, setLastName] = useState("Cote");
    const [email, setEmail] = useState("cote8782@mylaurier.ca");
    const [phone, setPhone] = useState("(555) 019-2834");
    
    const [role, setRole] = useState("");

    const [lNumber, setlNumber] = useState("S9876543");
    const [licenseExpiry, setLicenseExpiry] = useState("2028-11-30");
    const [licenseClass, setLicenseClass] = useState("A");
    const [birthDate, setBirthDate] = useState("2028-11-30");
    const [homeAdd, setHomeAdd] = useState("123 University Ave.");
    const [department, setDepartment] = useState("Fleet Operations");
    const [managerHomeAdd, setManagerHomeAdd] = useState("456 Park Street");
    const [escalationPhone, setEscalationPhone] = useState("(555) 999-8877");
    const [companyName, setCompanyName] = useState("Acme Logistics");
    const [officeAddress, setOfficeAddress] = useState("789 Commercial Blvd");
    const [companyPhone, setCompanyPhone] = useState("(555) 444-3322");
    const [billingAddress, setBillingAddress] = useState("789 Commercial Blvd, Suite 100");

    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    const inputStyle = {
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        background: "#ffffff",
        color: "#0f172a",
        fontSize: "14px",
        outline: "none"
    };

    function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setStatusMsg({ type: '', text: '' });

        setTimeout(() => {
            setSaving(false);
            setStatusMsg({ type: 'success', text: 'Profile preferences updated locally!' });
        }, 500);
    }

    return (
        <div style={{ padding: "60px 24px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial" }}>
            <h2 style={{ color: "#0B3C5D", marginBottom: "8px" }}>Account Settings</h2>
            <p style={{ color: "#64748b", marginBottom: "32px" }}>Update your personal information and preferences.</p>

            {statusMsg.text && (
                <div style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    background: statusMsg.type === 'error' ? '#fee2e2' : '#dcfce7',
                    color: statusMsg.type === 'error' ? '#991b1b' : '#166534',
                    fontWeight: "bold",
                    fontSize: "14px"
                }}>
                    {statusMsg.text}
                </div>
            )}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
    
                <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "bold", color: "#334155", fontSize: "14px" }}>First Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Samara"
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "bold", color: "#334155", fontSize: "14px" }}>Last Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Cote"
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "bold", color: "#334155", fontSize: "14px" }}>Email Address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "bold", color: "#334155", fontSize: "14px" }}>Phone Number</label>
                    <input 
                        type="text" 
                        placeholder="e.g. (555) 000-0000"
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{
                    background: "#f8fafc", 
                    padding: "24px", 
                    borderRadius: "12px", 
                    border: "1.5px solid #cbd5e1", 
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "18px"
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "bold", color: "#334155", fontSize: "14px" }}>System Role</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            style={{ 
                                padding: "12px", 
                                borderRadius: "8px", 
                                border: "1px solid #cbd5e1", 
                                background: "#ffffff", 
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: role ? "bold" : "normal",
                                color: role ? "#0B3C5D" : "#64748b"
                             }}
                        >
                            <option value=""></option>
                            <option value="driver">Driver</option>
                            <option value="manager">Manager</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                    {role === 'driver' && (
                        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "14px" }}>
                            <h4 style={{ margin: 0, color: "#0B3C5D" }}>Driver Credentials</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>License Number</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. S1234-56789-12345"
                                    value={lNumber} 
                                    onChange={(e) => setlNumber(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>License Expiry Date</label>
                                <input 
                                    type="date" 
                                    value={licenseExpiry} 
                                    onChange={(e) => setLicenseExpiry(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Class</label>
                                <input 
                                    type="text" 
                                    value={licenseClass} 
                                    onChange={(e) => setLicenseClass(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Date of Birth</label>
                                <input 
                                    type="text" 
                                    value={birthDate} 
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Home Address</label>
                                <input 
                                    type="text" 
                                    value={homeAdd} 
                                    onChange={(e) => setHomeAdd(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    )}

                    {role === 'manager' && (
                        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "14px" }}>
                            <h4 style={{ margin: 0, color: "#0B3C5D" }}>Manager Details</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Department</label>
                                <select 
                                    value={department} 
                                    onChange={(e) => setDepartment(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="Fleet Operations">Fleet Operations</option>
                                    <option value="Safety & Compliance">Safety & Compliance</option>
                                    <option value="Logistics & Finance">Logistics & Finance</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Home Address</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 456 Park Street"
                                    value={managerHomeAdd} 
                                    onChange={(e) => setManagerHomeAdd(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Manager Escalation Phone / Direct Line</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. (555) 999-8877"
                                    value={escalationPhone} 
                                    onChange={(e) => setEscalationPhone(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    )}

                    {role === 'customer' && (
                        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "14px" }}>
                            <h4 style={{ margin: 0, color: "#0B3C5D" }}>Company Info</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Company / Business Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Acme Freight Co."
                                    value={companyName} 
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Office Address</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 789 Commercial Blvd"
                                    value={officeAddress} 
                                    onChange={(e) => setOfficeAddress(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={saving}
                    style={{ 
                        background: "#0B3C5D", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "8px", 
                        padding: "14px", 
                        fontWeight: "bold", 
                        fontSize: "14px", 
                        cursor: saving ? "not-allowed" : "pointer",
                        marginTop: "12px",
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? "Saving Changes..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}
