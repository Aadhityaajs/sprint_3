import React from "react";

export default function BookingCard({ booking, onOpen }) {
  const format = (s) => {
    if (!s) return "-";
    const d = new Date(s);
    if (isNaN(d)) return s;
    return d.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 flex gap-4 items-center">
      <div className="w-32 h-20 rounded overflow-hidden flex-shrink-0">
        <img src={booking.propertyImage || "/assets/placeholder-property.jpg"} alt={booking.propertyName} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-slate-900">{booking.propertyName}</h3>
          <div className={`px-2 py-1 rounded text-sm font-semibold ${booking.bookingStatus ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {booking.bookingStatus ? "BOOKED" : "CANCELLED"}
          </div>
        </div>

        <div className="text-sm text-slate-600 mt-2 flex gap-4 flex-wrap">
          <div><strong>Check-in:</strong> {format(booking.checkInDate)}</div>
          <div><strong>Check-out:</strong> {format(booking.checkOutDate)}</div>
          <div><strong>Guests:</strong> {booking.numberOfGuest ?? "-"}</div>
        </div>
      </div>

      <div>
        <button onClick={onOpen} className="px-3 py-2 rounded-md border bg-white text-sm">View details</button>
      </div>
    </div>
  );
}