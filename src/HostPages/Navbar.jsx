import React from "react";

export default function Navbar() {
  const handleLogout = () => {
    // clear session and go to login page (will be implemented by your friend)
    sessionStorage.clear();
    // redirect to login (assume /login)
    window.location.href = "/login";
  };

  // const triggerAddProperty = () => {
  //   window.dispatchEvent(new CustomEvent("openAddProperty"));
  // };

  const openComplaint = () => {
    // your friend will implement complaint page - just open placeholder
    window.location.href = "/complaint";
  };

  return (
    <nav className="host-dashboard-navbar" style={{background:"#fff", borderBottom:"1px solid #E0E0E0", padding:"12px 24px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <h2 style={{margin:0}}>SpaceFinders</h2>
        <div style={{color:"#757575"}}>Host Dashboard</div>
      </div>

      <div style={{display:"flex", gap:12}}>
        <button className="btn btn-secondary">🔔 Notification</button>
        <button className="btn btn-secondary" onClick={openComplaint}>📝 Complaint</button>
        <button className="btn btn-danger" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </nav>
  );
}
