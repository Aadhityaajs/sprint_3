import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { daysBetween, isNotPastDate, isValidDateRange } from "../utils/dateHelpers";
import { CONSTANTS } from "../constants";

export default function PropertyDetails() {
  const locationHook = useLocation();
  const navigate = useNavigate();

  const state = locationHook.state || {};
  const { property, checkIn, checkOut, guests } = state;

  const [cleaning, setCleaning] = useState(false);
  const [extraKart, setExtraKart] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Property Selected</h2>
          <p className="text-gray-600 mb-6">Please select a property from the search page.</p>
          <button
            onClick={() => navigate("/search")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.max(1, daysBetween(checkIn, checkOut)) : 0;
  const pricePerNight = property.price || 0;
  const totalPrice = nights * pricePerNight + (cleaning ? CONSTANTS.CLEANING_FEE : 0);

  const handleBooking = async () => {
    if (isBooking) return;

    // Get user from session
    const userSession = sessionStorage.getItem("currentUser");
    if (!userSession) {
      toast.error("Please login to book a property");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userSession);
    } catch (err) {
      toast.error("Session error. Please login again.");
      sessionStorage.removeItem("currentUser");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    // Validate dates
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates from the search page.");
      return;
    }

    if (!isNotPastDate(checkIn)) {
      toast.error("Check-in date cannot be in the past.");
      return;
    }

    if (!isValidDateRange(checkIn, checkOut)) {
      toast.error("Check-out must be after check-in.");
      return;
    }

    if (daysBetween(checkIn, checkOut) < 1) {
      toast.error("Booking must be for at least 1 night.");
      return;
    }

    // Validate guests
    if (!guests || guests < 1) {
      toast.error("Number of guests must be at least 1.");
      return;
    }

    if (guests > property.max_guests) {
      toast.error(`Maximum ${property.max_guests} guests allowed for this property.`);
      return;
    }

    // Build booking payload
    const bookingPayload = {
      bookingId: Date.now(),
      propertyId: property.propertyId || property.id,
      userId: userData.userId,
      hostId: property.hostUserId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuest: guests,
      bookingStatus: true,
      hasExtraCot: extraKart,
      hasDeepClean: cleaning,
      pricePerDay: pricePerNight,
      totalPrice: totalPrice,
      createdAt: new Date().toISOString(),
      isPaymentStatus: false, // Will be updated after payment
    };

    // Store booking payload in sessionStorage
    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingPayload));
    
    // Navigate to payment page
    toast.info("Redirecting to payment...");
    setTimeout(() => {
      navigate("/payment", { 
        state: { 
          amount: totalPrice,
          propertyName: property.name 
        } 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/search")}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            ← Back to Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-96 object-cover"
              />

              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                <p className="text-lg text-gray-600 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {property.location}
                </p>

                <div className="flex gap-6 text-gray-700 mb-6">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span className="font-medium">{property.rooms} Rooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">Max {property.max_guests} Guests</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description || "No description available."}
                  </p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Details</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Price per night:</span>
                  <span className="font-bold">₹{pricePerNight}</span>
                </div>

                {checkIn && checkOut && (
                  <>
                    <div className="flex justify-between text-gray-700">
                      <span>Check-in:</span>
                      <span className="font-medium">{checkIn}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Check-out:</span>
                      <span className="font-medium">{checkOut}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Nights:</span>
                      <span className="font-medium">{nights}</span>
                    </div>
                  </>
                )}

                {guests && (
                  <div className="flex justify-between text-gray-700">
                    <span>Guests:</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Add-ons</h3>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cleaning}
                    onChange={(e) => setCleaning(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={isBooking}
                  />
                  <span className="text-gray-700">
                    Deep Cleaning (+₹{CONSTANTS.CLEANING_FEE})
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extraKart}
                    onChange={(e) => setExtraKart(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={isBooking}
                  />
                  <span className="text-gray-700">Extra Cot</span>
                </label>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={isBooking || !checkIn || !checkOut}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  isBooking || !checkIn || !checkOut
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isBooking ? "Processing..." : "Proceed to Payment"}
              </button>

              {(!checkIn || !checkOut) && (
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Please select dates from the search page
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}