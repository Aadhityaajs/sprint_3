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
        <div className="w-full">
            {/* ----------------- TOP ROW ----------------- */}
            <div className="flex flex-col gap-6">
                {/* Summary Cards */}
                <SummaryCards summary={summary} />

                {/* Filters + Search + Dates */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-full">

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-52 text-sm"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-200">
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

                    {/* Status Toggles */}
                    <div className="flex gap-2">
                        {["Unread", "Read"].map((k) => (
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

                    {/* Type Filters */}
                    {typeFilters && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Type:</span>
                            {["info", "warning", "alert"].map((k) => (
                                <label
                                    key={k}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all select-none capitalize whitespace-nowrap
                                        ${typeFilters[k]
                                            ? k === 'info' ? "bg-blue-100 text-blue-800"
                                                : k === 'warning' ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={typeFilters[k]}
                                        onChange={() => toggleType(k)}
                                        className="w-3.5 h-3.5 rounded"
                                    />
                                    {k}
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Create Notification Button */}
                    <button
                        onClick={onOpenModal}
                        className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Notification
                    </button>
                </div>
            </div>
        </div>
    );
}