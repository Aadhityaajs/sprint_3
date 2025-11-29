// src/Component/BookingDetails.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import "./BookingDetails.css";
//import { today, computeStatus, daysBetween, overlap } from "../utils/dateHelpers";

export default function BookingDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { booking } = state || {};

  if (!booking) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No Booking Found</h2>
        <button onClick={() => navigate("/bookings")} className="back-btn">
          ← Back to My Bookings
        </button>
      </div>
    );
  }

  const addr = booking.address || {};
  const hostAddr = booking.host?.address || {};
  const clientAddr = booking.client?.address || {};

  return (
    <div className="p-5">
      <button className="bg-gray-900 text-white border-none px-3.5 py-2 rounded-md cursor-pointer mb-5 hover:bg-gray-800" onClick={() => navigate("/bookings")}>
        ← Back
      </button>

      <h1 className="text-3xl font-bold">Booking Details</h1>

      <div className="flex gap-8 mt-5">
        <img src={booking.image} alt="" className="w-[380px] h-[260px] object-cover rounded-lg" />

        <div className="flex-1">
          <h2>{booking.name}</h2>
          <p className="location">{booking.location}</p>

          <p>
            <strong>Booking ID:</strong> {booking.id}
          </p>
          <p>
            <strong>Property ID:</strong> {booking.propertyId}
          </p>
          <p>
            <strong>Client User ID:</strong> {booking.userId}
          </p>
          <p>
            <strong>Host User ID:</strong> {booking.hostId}
          </p>

          <h3>Stay Details</h3>
          <p>
            <strong>Address:</strong>{" "}
            {addr.buildingNo}, {addr.street}, {addr.city}, {addr.state},{" "}
            {addr.country} - {addr.pincode}
          </p>
          <p>
            <strong>Check-in:</strong> {booking.checkIn}
          </p>
          <p>
            <strong>Check-out:</strong> {booking.checkOut}
          </p>
          <p>
            <strong>Guests:</strong> {booking.guests}
          </p>
          <p>
            <strong>Nights:</strong> {booking.nights}
          </p>
          <p>
            <strong>Booking Status:</strong>{" "}
            {booking.bookingStatus ? "Active" : "Cancelled"}
          </p>

          <h3>Payment</h3>
          <p>
            <strong>Price Per Day:</strong> ₹{booking.pricePerDay}
          </p>
          <p>
            <strong>Total Paid:</strong> ₹{booking.totalPrice}
          </p>
          <p>
            <strong>Has Extra Cot:</strong>{" "}
            {booking.hasExtraCot ? "Yes" : "No"}
          </p>
          <p>
            <strong>Deep Cleaning:</strong>{" "}
            {booking.hasDeepClean ? "Yes" : "No"}
          </p>
          <p>
            <strong>Booked On:</strong> {booking.bookedAt || "N/A"}
          </p>

          <h3>Property Info</h3>
          <p>
            <strong>Property Status:</strong> {booking.propertyStatus}
          </p>
          <p>
            <strong>Rating:</strong> {booking.propertyRating} (
            {booking.propertyRatingCount} reviews)
          </p>

          <h3>Host Details</h3>
          {booking.host ? (
            <>
              <p>
                <strong>Name:</strong> {booking.host.username}
              </p>
              <p>
                <strong>Email:</strong> {booking.host.email}
              </p>
              <p>
                <strong>Mobile:</strong> {booking.host.phone}
              </p>
              <p>
                <strong>Role:</strong> {booking.host.role}
              </p>
              <p>
                <strong>Status:</strong> {booking.host.status}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {hostAddr.buildingNo}, {hostAddr.street}, {hostAddr.city},{" "}
                {hostAddr.state}, {hostAddr.country} - {hostAddr.pincode}
              </p>
            </>
          ) : (
            <p>Host data not available.</p>
          )}

          <h3>Client Details</h3>
          {booking.client ? (
            <>
              <p>
                <strong>Name:</strong> {booking.client.username}
              </p>
              <p>
                <strong>Email:</strong> {booking.client.email}
              </p>
              <p>
                <strong>Mobile:</strong> {booking.client.phone}
              </p>
              <p>
                <strong>Role:</strong> {booking.client.role}
              </p>
              <p>
                <strong>Status:</strong> {booking.client.status}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {clientAddr.buildingNo}, {clientAddr.street},{" "}
                {clientAddr.city}, {clientAddr.state}, {clientAddr.country} -{" "}
                {clientAddr.pincode}
              </p>
            </>
          ) : (
            <p>Client data not available.</p>
          )}

          <button className="bg-blue-600 text-white px-5 py-3 mt-5 rounded-lg cursor-pointer text-base hover:bg-blue-700">Download PDF</button>
        </div>
      </div>
    </div>
  );
}
