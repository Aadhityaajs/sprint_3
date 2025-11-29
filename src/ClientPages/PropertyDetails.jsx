import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import "./PropertyDetails.css";

function daysBetween(d1, d2) {
  const one = new Date(d1);
  const two = new Date(d2);
  return Math.round((two - one) / (1000 * 60 * 60 * 24));
}

function Snackbar({ show, message, type }) {
  if (!show) return null;
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded shadow-lg z-50 ${type === "error" ? "bg-red-600" : "bg-green-600"}`}>
      {message}
    </div>
  );
}

export default function PropertyDetails() {
  const locationHook = useLocation();
  const navigate = useNavigate();

  const state = locationHook.state || {};
  const { property, checkIn, checkOut, guests } = state;

  const [cleaning, setCleaning] = useState(false);
  const [extraKart, setExtraKart] = useState(false);
  const [snack, setSnack] = useState({
    show: false,
    message: "",
    type: "success"
  });

  if (!property) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No Property Selected</h2>
        <button onClick={() => navigate("/search")} className="bg-transparent border-none text-lg cursor-pointer mb-4 text-blue-600">
          ← Back to Search
        </button>
      </div>
    );
  }

  const nights =
    checkIn && checkOut ? Math.max(1, daysBetween(checkIn, checkOut)) : 0;
  const pricePerNight = property.price || 0;
  const totalPrice = nights * pricePerNight + (cleaning ? 2000 : 0);

  const showSnack = (message, type = "success") => {
    setSnack({ show: true, message, type });
    setTimeout(() => setSnack((s) => ({ ...s, show: false })), 2500);
  };

  const handleBooking = async () => {
    // ---------- FRONTEND VALIDATIONS (same as before) ----------
    if (!checkIn || !checkOut) {
      showSnack(
        "Please select check-in and check-out dates in search page.",
        "error"
      );
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    if (checkIn < todayStr) {
      showSnack("Check-in cannot be in the past.", "error");
      return;
    }
    if (checkOut <= checkIn) {
      showSnack("Check-out must be after check-in.", "error");
      return;
    }
    if (daysBetween(checkIn, checkOut) < 1) {
      showSnack("Check-out must be after check-in.", "error");
      return;
    }

    // ------------- BUILD BOOKING OBJECT FOR BACKEND -------------
    const bookingPayload = {
      bookingId: Date.now(),
      propertyId: property.propertyId || property.id,
      userId: 999, // dummy client id (no auth implemented)
      hostId: property.hostUserId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuest: guests || 1,
      bookingStatus: true,
      hasExtraCot: extraKart,
      hasDeepClean: cleaning,
      pricePerNight,
      totalPrice,
      createdAt: new Date().toISOString(),
      isPaymentStatus: true
    };

    try {
      const res = await fetch("http://localhost:8081/api/client/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });

      if (!res.ok) {
        // try to read error message from backend
        let msg = "Failed to save booking.";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch (e) { }
        showSnack(msg, "error");
        return;
      }

      showSnack("Booking saved successfully!", "success");
    } catch (err) {
      console.error("Error saving booking:", err);
      showSnack("Failed to save booking.", "error");
    }
  };

  return (
    <div className="p-8 px-12">
      <button className="bg-transparent border-none text-lg cursor-pointer mb-4 text-blue-600" onClick={() => navigate("/search")}>
        ← Back to Search
      </button>

      <img src={property.image} alt="property" className="w-full h-[420px] object-cover rounded-xl mb-8" />

      <div className="grid grid-cols-[2fr_1fr] gap-10">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-8">
          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-2xl font-bold mb-2.5">{property.name}</h2>
            <p className="text-gray-600">
              {property.address || property.location}
            </p>
            <p className="text-gray-600">
              Stay: {checkIn || "—"} → {checkOut || "—"} &nbsp; | Guests:{" "}
              {guests || "-"}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-2xl font-bold mb-2.5">Description</h2>
            <p>{property.description}</p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-2xl font-bold mb-2.5">Property Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <strong>Rooms:</strong> {property.rooms}
              </div>
              <div>
                <strong>Bathrooms:</strong> {property.bathrooms}
              </div>
              <div>
                <strong>Max Guests:</strong> {property.max_guests}
              </div>
              <div>
                <strong>Price Per Night:</strong> ₹{property.price}
              </div>
              <div>
                <strong>Host User ID:</strong> {property.hostUserId}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-2xl font-bold mb-2.5">Address</h2>
            <p>{property.address}</p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-2xl font-bold mb-2.5">Amenities</h2>
            <div className="flex flex-wrap gap-2.5">
              {(property.amenities || []).map((a, idx) => (
                <span key={idx} className="bg-blue-50 px-3 py-1.5 rounded-full">
                  {a}
                </span>
              ))}
            </div>

            <ul>
              <li>WiFi: {property.hasWifi ? "Yes" : "No"}</li>
              <li>Parking: {property.hasParking ? "Yes" : "No"}</li>
              <li>Pool: {property.hasPool ? "Yes" : "No"}</li>
              <li>AC: {property.hasAC ? "Yes" : "No"}</li>
              <li>Heater: {property.hasHeater ? "Yes" : "No"}</li>
              <li>Pet Friendly: {property.hasPetFriendly ? "Yes" : "No"}</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-5 rounded-lg shadow-md h-fit">
          <div className="bg-gray-100 p-4 rounded-lg mb-5">
            <p>
              <strong>Host Name:</strong> {property.hostName || "Host Name"}
            </p>
            <p>
              <strong>Mobile:</strong>{" "}
              {property.hostMobile || "+91 98765 43210"}
            </p>
          </div>

          <div className="my-4">
            <label>
              <input
                type="checkbox"
                checked={cleaning}
                onChange={(e) => setCleaning(e.target.checked)}
              />{" "}
              Add Cleaning Service (+₹2000)
            </label>
          </div>

          <div className="my-4">
            <label>
              <input
                type="checkbox"
                checked={extraKart}
                onChange={(e) => setExtraKart(e.target.checked)}
              />{" "}
              Add Extra Kart (free)
            </label>
          </div>

          <h2>Total Price:</h2>
          <div className="text-2xl text-blue-600 font-bold">₹{totalPrice}</div>

          <button className="w-full bg-blue-600 border-none p-3.5 text-white text-lg rounded-lg cursor-pointer hover:bg-blue-700" onClick={handleBooking}>
            Book Now
          </button>
        </div>
      </div>

      <Snackbar show={snack.show} message={snack.message} type={snack.type} />
    </div>
  );
}
