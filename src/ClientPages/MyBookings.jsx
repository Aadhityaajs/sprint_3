// src/ClientPages/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

function Section({ title, list, emptyText, onView }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl mb-4 font-semibold text-gray-900">{title}</h2>
      {list.length === 0 ? (
        <p className="text-gray-500 text-sm">{emptyText}</p>
      ) : (
        <div className="flex flex-col gap-5">
          {list.map((b) => (
            <div
              key={b.id}
              className="flex bg-white p-4 rounded-xl shadow-md gap-4 items-center hover:shadow-lg transition-shadow"
            >
              <img
                src={b.image}
                alt={b.name}
                className="w-36 h-28 rounded-lg object-cover bg-gray-100"
              />
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-xl font-bold text-gray-900 m-0">{b.name}</h3>
                <p className="text-gray-600 m-0 text-sm">{b.location}</p>
                <p className="m-0 text-sm text-gray-700">
                  <span className="font-semibold">Check-in:</span> {b.checkIn} • 
                  <span className="font-semibold ml-2">Check-out:</span> {b.checkOut}
                </p>
                <p className="m-0 text-sm text-gray-700">
                  <span className="font-semibold">Guests:</span> {b.guests} • 
                  <span className="font-semibold ml-2">Nights:</span> {b.nights}
                </p>
                <p className="m-0 text-sm font-semibold text-gray-900">
                  Total Paid: ₹{b.totalPrice}
                </p>
                <p
                  className={`font-bold mt-1 m-0 text-sm ${
                    b.status === "CURRENT"
                      ? "text-green-600"
                      : b.status === "UPCOMING"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {b.status}
                </p>
              </div>
              <button
                onClick={() => onView(b)}
                className="bg-blue-600 text-white border-none px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
            checkIn: ci,
            checkOut: co,
            nights,
            guests: b.numberOfGuest,
            status: computeStatus(ci, co),
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
            pricePerDay,
            totalPrice,
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          className="bg-gray-900 text-white border-none px-4 py-2 rounded-lg cursor-pointer mb-6 hover:bg-gray-800 transition-colors font-medium"
          onClick={() => navigate("/clientDashboard")}
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-4xl mb-3 font-bold text-gray-900">My Bookings</h1>

        <div className="flex gap-6 text-base mb-8 text-gray-700">
          <span className="font-bold">
            Upcoming <span className="text-blue-600">({upcoming.length})</span>
          </span>
          <span className="font-bold">
            Current <span className="text-green-600">({current.length})</span>
          </span>
          <span className="font-bold">
            Past <span className="text-red-600">({past.length})</span>
          </span>
        </div>

        <Section
          title="Upcoming Bookings"
          list={upcoming}
          emptyText="No upcoming bookings."
          onView={onView}
        />
        <Section
          title="Current Bookings"
          list={current}
          emptyText="No current bookings."
          onView={onView}
        />
        <Section
          title="Past Bookings"
          list={past}
          emptyText="No past bookings."
          onView={onView}
        />
      </div>
    </div>
  );
}