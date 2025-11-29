import React from "react";

export default function PropertyCard({ property, blocked,onView, onEdit, onDelete }) {
  const showBlockedMessage = () => {
  alert("❗ This property has active bookings.\nYou cannot edit or delete it right now.");
};

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-0 flex flex-col overflow-hidden">
      <div className="relative w-full h-44 bg-gray-100">
        <img src={property.imageURL || "/assets/placeholder-property.jpg"} alt={property.propertyName} className="w-full h-full object-cover" />
        <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">{property.propertyStatus}</span>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{property.propertyName}</h3>
          <p className="text-sm text-slate-500 mt-1">📍 {property.city}, {property.state}</p>
        </div>

        <div className="flex gap-3 text-sm text-slate-600 mt-1">
          <div>🛏️ {property.noOfRooms} Rooms</div>
          <div>🚿 {property.noOfBathrooms} Baths</div>
          <div>👥 {property.maxNoOfGuests} Guests</div>
        </div>

        <div className="flex items-center gap-2 text-sm mt-2">
          {property.hasWifi && <div title="WiFi">📶</div>}
          {property.hasParking && <div title="Parking">🅿️</div>}
          {property.hasPool && <div title="Pool">🏊</div>}
          {property.hasAc && <div title="AC">❄️</div>}
          {property.hasPetFriendly && <div title="Pet Friendly">🐕</div>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="text-[#1976D2] font-semibold">₹{property.pricePerDay} <span className="text-sm text-slate-500">/ night</span></div>
          
          <div className="flex gap-2 mt-3">

  {/* VIEW (always enabled) */}
  <button
    className="btn btn-sm btn-info w-full"
    onClick={onView}
  >
    👁️ View
  </button>

  {/* EDIT */}
  <button
    onClick={blocked ? showBlockedMessage : onEdit}
    className={`btn btn-sm w-full ${
      blocked
        ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-600"
        : "btn-warning"
    }`}
  >
    ✏️ Edit
  </button>

  {/* DELETE */}
  <button
    onClick={blocked ? showBlockedMessage : onDelete}
    className={`btn btn-sm w-full ${
      blocked
        ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-600"
        : "btn-danger"
    }`}
  >
    🗑️ Delete
  </button>
</div>

        </div>
      </div>
    </div>
  );
}