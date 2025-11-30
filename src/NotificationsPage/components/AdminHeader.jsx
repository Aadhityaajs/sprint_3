import React from "react";
import SummaryCards from "./SummaryCards";

export default function AdminHeader({
    summary,
    searchId,
    setSearchId,
    statusFilters,
    toggleStatus,
    typeFilters,
    toggleType,
    userType,
    setUserType,
    dateRange,
    setDateRange,
    onOpenModal,
}) {
    return (
        <div className="admin-header" style={{ width: "100%" }}>

            {/* ----------------- TOP ROW ----------------- */}

            <div
                className="admin-top-row"
                style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap", // allow wrapping on small screens
                    alignItems: "center", // vertically align items
                }}
            >
                {/* Summary Cards */}
                <SummaryCards summary={summary} />

                {/* Filters + Search + Dates */}
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center", // align everything horizontally
                        flexWrap: "wrap",
                    }}
                >
                    {/* User Type
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        style={{
                            padding: "8px 10px",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                        }}
                    >
                        <option value="ALL">All Users</option>
                        <option value="CLIENT">Client</option>
                        <option value="HOST">Host</option>
                    </select> */}

                    {/* Status Toggles */}
                    <div style={{ display: "flex", gap: 8 }}>
                        {["Unread", "Read"].map((k) => (
                            <label
                                key={k}
                                className={`toggle ${statusFilters[k] ? "on" : ""}`}
                                style={{
                                    cursor: "pointer",
                                    padding: "6px 10px",
                                    borderRadius: 6,
                                    background: statusFilters[k] ? "var(--accent-light)" : "#eee",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={statusFilters[k]}
                                    onChange={() => toggleStatus(k)}
                                />
                                {k}
                            </label>
                        ))}
                    </div>

                    {/* Type Filters */}
                    {typeFilters && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ fontWeight: "bold", fontSize: 14 }}>Type:</span>
                            {["info", "warning", "alert"].map((k) => (
                                <label
                                    key={k}
                                    className={`toggle ${typeFilters[k] ? "on" : ""}`}
                                    style={{
                                        cursor: "pointer",
                                        padding: "6px 10px",
                                        borderRadius: 6,
                                        background: typeFilters[k] ? "var(--accent-light)" : "#eee",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={typeFilters[k]}
                                        onChange={() => toggleType(k)}
                                    />
                                    {k}
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{
                            padding: "8px 10px",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            width: 200,
                            backgroundColor: "white"
                        }}
                    />

                    {/* Date Range */}
                    <label>
                        From
                        <input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange((d) => ({ ...d, from: e.target.value }))}
                        />
                    </label>

                    <label>
                        To
                        <input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange((d) => ({ ...d, to: e.target.value }))}
                        />
                    </label>

                    {/* Create Notification Button */}
                    <button
                        className="primary"
                        onClick={onOpenModal}
                        style={{
                            padding: "10px 20px",
                            borderRadius: 8,
                            border: "none",
                            background: "#155dfc",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "14px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            whiteSpace: "nowrap"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                        }}
                    >
                        Create Notification
                    </button>

                </div>
            </div>
        </div>

    );
}
