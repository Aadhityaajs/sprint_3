import React, { useMemo } from "react";
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
    // Validate date range
    const dateError = useMemo(() => {
        if (dateRange.from && dateRange.to) {
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            if (toDate < fromDate) {
                return '"To" date cannot be before "From" date';
            }
        }
        return null;
    }, [dateRange.from, dateRange.to]);

    return (
        <div className="w-full">
            {/* ----------------- TOP ROW ----------------- */}
            <div className="flex flex-col gap-6">
                {/* Summary Cards */}
                <SummaryCards summary={summary} />

                {/* Filters + Search + Dates */}
                <div className={`flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-full min-h-16 flex-wrap ${dateError ? 'pb-8' : ''}`}>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-52 text-sm"
                        />
                    </div>

                    {/* User Type */}
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    >
                        <option value="ALL">All Users</option>
                        <option value="CLIENT">Client</option>
                        <option value="HOST">Host</option>
                    </select>

                    {/* Date Range */}
                    <div className="relative">
                        <div className={`flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border ${dateError ? 'border-red-400' : 'border-gray-200'}`}>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange((d) => ({ ...d, from: e.target.value }))}
                                className="bg-transparent border-none text-xs text-gray-600 focus:ring-0 px-1.5 py-1 outline-none w-28"
                            />
                            <span className="text-gray-400 text-xs">to</span>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange((d) => ({ ...d, to: e.target.value }))}
                                className="bg-transparent border-none text-xs text-gray-600 focus:ring-0 px-1.5 py-1 outline-none w-28"
                            />
                        </div>
                        {dateError && (
                            <div className="absolute top-full left-0 mt-1 text-xs text-red-600 font-medium whitespace-nowrap">
                                {dateError}
                            </div>
                        )}
                    </div>

                    {/* Status Toggles */}
                    <div className="flex gap-2">
                        {["Active", "Closed", "Deleted"].map((k) => (
                            <label
                                key={k}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all select-none whitespace-nowrap
                                    ${statusFilters[k]
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={statusFilters[k]}
                                    onChange={() => toggleStatus(k)}
                                    className="w-3.5 h-3.5 rounded"
                                />
                                {k}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
}
