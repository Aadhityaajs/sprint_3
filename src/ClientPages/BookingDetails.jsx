import { useLocation, useNavigate } from "react-router-dom";
import { computeStatus } from "../utils/dateHelpers";

export default function BookingDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { booking } = state || {};

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Booking Found</h2>
          <p className="text-gray-600 mb-6">Please select a booking to view details.</p>
          <button
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const addr = booking.address || {};
  const status = booking.status || computeStatus(booking.checkIn, booking.checkOut);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-5">
      <div className="max-w-6xl mx-auto">
        <button
          className="bg-gray-900 text-white border-none px-4 py-2 rounded-lg cursor-pointer mb-5 hover:bg-gray-800 transition-colors font-medium"
          onClick={() => navigate("/bookings")}
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Booking Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Image */}
          <div>
            <img
              src={booking.image}
              alt={booking.name}
              className="w-full h-80 object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Booking Information */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{booking.name}</h2>
            <p className="text-lg text-gray-600 mb-4">{booking.location}</p>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Booking ID:</strong>
                <span>{booking.id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Property ID:</strong>
                <span>{booking.propertyId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Check-in:</strong>
                <span>{booking.checkIn}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Check-out:</strong>
                <span>{booking.checkOut}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Nights:</strong>
                <span>{booking.nights}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Guests:</strong>
                <span>{booking.guests}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Status:</strong>
                <span
                  className={`font-bold ${
                    status === "CURRENT"
                      ? "text-green-600"
                      : status === "UPCOMING"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Payment Details</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Price Per Day:</span>
                  <span className="font-semibold">₹{booking.pricePerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span>Has Extra Cot:</span>
                  <span>{booking.hasExtraCot ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deep Cleaning:</span>
                  <span>{booking.hasDeepClean ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Paid:</span>
                  <span>₹{booking.totalPrice}</span>
                </div>
              </div>
            </div>

            {addr && (addr.buildingNo || addr.street || addr.city) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Property Address</h3>
                <p className="text-gray-700">
                  {addr.buildingNo && `${addr.buildingNo}, `}
                  {addr.street && `${addr.street}, `}
                  {addr.city && `${addr.city}, `}
                  {addr.state && `${addr.state}, `}
                  {addr.country && addr.country}
                  {addr.pincode && ` - ${addr.pincode}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Property Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
            {booking.rooms && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{booking.rooms}</p>
                <p className="text-sm">Rooms</p>
              </div>
            )}
            {booking.bathrooms && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{booking.bathrooms}</p>
                <p className="text-sm">Bathrooms</p>
              </div>
            )}
            {booking.max_guests && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{booking.max_guests}</p>
                <p className="text-sm">Max Guests</p>
              </div>
            )}
            {booking.propertyStatus && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">{booking.propertyStatus}</p>
                <p className="text-sm">Status</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}