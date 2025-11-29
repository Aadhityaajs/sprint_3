import React from "react";

export default function BookingModal({ booking, onClose }) {
  if (!booking) return null;

  const format = (s) => {
    if (!s) return "-";
    const d = new Date(s);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const addr = booking.propertyDetails?.address || {};
  const ci = new Date(booking.checkInDate);
  const co = new Date(booking.checkOutDate);
  const nights = co > ci ? Math.round((co - ci) / (1000 * 60 * 60 * 24)) : 1;
  const price = booking.propertyDetails?.pricePerDay || 0;
  const revenue = booking.bookingStatus ? nights * price : 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-lg overflow-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute right-4 top-4 bg-white border rounded-full w-10 h-10 grid place-items-center">✕</button>

        <div className="h-44 overflow-hidden">
          <img src={booking.propertyImage || "/assets/placeholder-property.jpg"} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-sm text-slate-500">Booking #{booking.bookingId}</div>
              <h2 className="text-2xl font-semibold text-slate-900">{booking.propertyName}</h2>
            </div>

            <div className={`px-3 py-1 rounded font-semibold ${booking.bookingStatus ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {booking.bookingStatus ? "BOOKED" : "CANCELLED"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">🏡 Property Details</h3>
              <p className="text-sm text-slate-700">
                <strong>Address:</strong><br />
                {addr.buildingNo}, {addr.street}<br />
                {addr.city}, {addr.state} - {addr.postalCode}<br />
                {addr.country}
              </p>
              <p className="mt-3"><strong>Price Per Day:</strong> ₹{price}</p>
              <p className="mt-1"><strong>Revenue:</strong> <span className={revenue > 0 ? "text-green-700 font-semibold" : "text-red-600 font-semibold"}>₹{revenue}</span></p>

              <div className="mt-3 text-sm">
                <strong>Extras:</strong>
                <ul className="list-disc pl-5">
                  <li>{booking.hasExtraCot ? "✔ Extra Cot" : "✘ Extra Cot"}</li>
                  <li>{booking.hasDeepClean ? "✔ Deep Cleaning" : "✘ Deep Cleaning"}</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">👤 Guest Details</h3>
              <div className="text-sm text-slate-700 space-y-1">
                <div><strong>Name:</strong> {booking.guestInfo?.name}</div>
                <div><strong>Email:</strong> {booking.guestInfo?.email}</div>
                <div><strong>Phone:</strong> {booking.guestInfo?.phone}</div>
                <div><strong>Guests:</strong> {booking.numberOfGuest}</div>
                <div><strong>Check-In:</strong> {format(booking.checkInDate)}</div>
                <div><strong>Check-Out:</strong> {format(booking.checkOutDate)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}