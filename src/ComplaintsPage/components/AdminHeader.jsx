import React from "react";
import SummaryCards from "./SummaryCards";

export default function AdminHeader({
    summary,
    searchId,
    setSearchId,
    statusFilters,
    toggleStatus,
    userType,
    setUserType,
    dateRange,
    setDateRange,
}) {
    return (
        <div className="w-full">

            {/* ----------------- TOP ROW ----------------- */}

            <div className="flex gap-5 flex-wrap items-center">
                {/* Summary Cards */}
                <SummaryCards summary={summary} />

                {/* Filters + Search + Dates */}
                <div className="flex gap-3 items-center flex-wrap">
                    {/* User Type */}
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="p-2 px-2.5 border border-gray-300 rounded-md"
                    >
                        <option value="ALL">All Users</option>
                        <option value="CLIENT">Client</option>
                        <option value="HOST">Host</option>
                    </select>

                    {/* Status Toggles */}
                    <div className="flex gap-2">
                        {["Active", "Closed", "Deleted"].map((k) => (
                            <label
                                key={k}
                                className={`cursor-pointer p-1.5 px-2.5 rounded-md ${statusFilters[k] ? "bg-blue-100" : "bg-gray-100"}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={statusFilters[k]}
                                    onChange={() => toggleStatus(k)}
                                    className="mr-1.5"
                                />
                                {k}
                            </label>
                        ))}
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search complaints..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="p-2 px-2.5 border border-gray-300 rounded-md w-[200px] bg-white"
                    />

                    {/* Date Range */}
                    <label className="flex items-center gap-1">
                        From
                        <input
                            type="date"
                            className="ml-1 p-1 border border-gray-300 rounded-md"
                            value={dateRange.from}
                            onChange={(e) => setDateRange((d) => ({ ...d, from: e.target.value }))}
                        />
                    </label>

                    <label className="flex items-center gap-1">
                        To
                        <input
                            type="date"
                            className="ml-1 p-1 border border-gray-300 rounded-md"
                            value={dateRange.to}
                            onChange={(e) => setDateRange((d) => ({ ...d, to: e.target.value }))}
                        />
                    </label>

                </div>
            </div>
        </div>

    );
}
