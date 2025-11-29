// src/Component/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./MyBookings.css";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function computeStatus(ci, co) {
  const t = today();
  if (!ci || !co) return "UNKNOWN";
  if (t < ci) return "UPCOMING";
  if (t > co) return "PAST";
  return "CURRENT";
}

function daysBetween(d1, d2) {
  const one = new Date(d1);
  const two = new Date(d2);
  return Math.round((two - one) / (1000 * 60 * 60 * 24));
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [propRes, bookRes] = await Promise.all([
          fetch("http://localhost:8081/api/client/properties"),
          fetch("http://localhost:8081/api/client/bookings"),
        ]);

        const properties = await propRes.json();
        const rawBookings = await bookRes.json();

        const enriched = rawBookings.map((b) => {
          const property = properties.find(
            (p) => p.propertyId === b.propertyId
          );

          const ci = b.checkInDate;
          const co = b.checkOutDate;

          const nights = daysBetween(ci, co);
          const pricePerDay = property ? property.price : 0;
          const totalPrice = b.totalPrice || nights * pricePerDay;

          return {
            id: b.bookingId,
            propertyId: b.propertyId,
            userId: b.userId,
            hostId: b.hostId,

            // dates
            checkIn: ci,
            checkOut: co,
            nights,
            guests: b.numberOfGuest,

            // status
            status: computeStatus(ci, co),

            // property data
            name: property ? property.name : "Unknown Property",
            image: property ? property.image : "/no-image.jpg",
            location: property ? property.location : "",
            address: property ? property.address : "",
            rooms: property ? property.rooms : "",
            bathrooms: property ? property.bathrooms : "",
            max_guests: property ? property.max_guests : "",
            propertyStatus: property ? property.propertyStatus : "",
            propertyRating: property ? property.propertyRating : "",
            propertyRatingCount: property ? property.propertyRatingCount : "",

            // price
            pricePerDay,
            totalPrice,

            // extras
            hasExtraCot: b.hasExtraCot,
            hasDeepClean: b.hasDeepClean,
            bookingStatus: b.bookingStatus,
          };
        });

        setBookings(enriched);
      } catch (err) {
        console.error("Error loading bookings:", err);
      }
    }

    loadData();
  }, []);

  const onView = (booking) => {
    navigate("/booking-details", { state: { booking } });
  };

  const upcoming = bookings.filter((b) => b.status === "UPCOMING");
  const current = bookings.filter((b) => b.status === "CURRENT");
  const past = bookings.filter((b) => b.status === "PAST");

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <button className="bg-gray-900 text-white border-none px-3.5 py-2 rounded-md cursor-pointer mb-5 hover:bg-gray-800" onClick={() => navigate("/clientDashboard")}>
        ← Back
      </button>

      <h1 className="text-3xl mb-2.5 font-bold">My Bookings</h1>

      <div className="flex gap-5 text-base mb-6">
        <span className="font-bold">Upcoming ({upcoming.length})</span>
        <span className="font-bold">Current ({current.length})</span>
        <span className="font-bold">Past ({past.length})</span>
      </div>

      <Section
        title="Upcoming"
        list={upcoming}
        emptyText="No upcoming bookings."
        onView={onView}
      />
      <Section
        title="Current"
        list={current}
        emptyText="No current bookings."
        onView={onView}
      />
      <Section
        title="Past"
        list={past}
        emptyText="No past bookings."
        onView={onView}
      />
    </div>
  );
}

function Section({ title, list, emptyText, onView }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl mb-4 font-semibold">{title}</h2>

      <div className="flex flex-col gap-5">
        {list.map((b) => (
          <BookingCard key={b.id} booking={b} onView={onView} />
        ))}

        {list.length === 0 && <p className="text-gray-500 text-sm">{emptyText}</p>}
      </div>
    </div>
  );
}

function BookingCard({ booking, onView }) {
  return (
    <div className="flex bg-white p-4 rounded-xl shadow-md gap-4 items-center">
      <img src={booking.image} alt="" className="w-[140px] h-[110px] rounded-lg object-cover bg-gray-100" />

      <div className="flex flex-col gap-1">
        <h3 className="text-xl m-0 font-semibold">{booking.name}</h3>
        <p className="text-gray-600 m-0">{booking.location}</p>

        <p className="m-0">
          <strong>Stay:</strong> {booking.checkIn} → {booking.checkOut}
        </p>

        <p className="m-0">
          <strong>Total Paid:</strong> ₹{booking.totalPrice}
        </p>

        <p className={`font-bold mt-1 ${booking.status === 'CURRENT' ? 'text-green-600' : booking.status === 'UPCOMING' ? 'text-blue-600' : 'text-red-600'}`}>
          {booking.status}
        </p>

        <button className="mt-2 text-blue-600 hover:underline bg-transparent border-none cursor-pointer" onClick={() => onView(booking)}>
          View Details →
        </button>
      </div>
    </div>
  );
}
