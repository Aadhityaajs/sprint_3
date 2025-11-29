import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  getDateISTForCheckInMin, 
  getDateISTForCheckInMax,
  getDateISTForCheckOutMin,
  getDateISTForCheckOutMax,
  overlap 
} from "../utils/dateHelpers";
import { CONSTANTS } from "../constants";

const BASE_URL = `${CONSTANTS.API_BASE_URL}/api/client/`;

// Map backend JSON to UI model
function mapFromBackend(p) {
  if (p.name && p.price && p.rooms) return p;

  const addr = p.address || {};
  const amenities = [];
  if (p.hasWifi) amenities.push("WiFi");
  if (p.hasParking) amenities.push("Parking");
  if (p.hasPool) amenities.push("Pool");
  if (p.hasAC) amenities.push("Air Conditioning");
  if (p.hasHeater) amenities.push("Heater");
  if (p.hasPetFriendly) amenities.push("Pet Friendly");

  return {
    id: p.propertyId,
    name: p.propertyName,
    description: p.propertyDescription,
    location: `${addr.city || ""}, ${addr.state || ""}`.trim(),
    rooms: p.noOfRooms,
    bathrooms: p.noOfBathrooms,
    max_guests: p.maxNoOfGuests,
    price: p.pricePerDay,
    image: p.imageURL,
    amenities,
    address: addr,
    hostUserId: p.userId,
    propertyId: p.propertyId,
    propertyStatus: p.propertyStatus,
  };
}

export default function SearchProperties() {
  const navigate = useNavigate();

  const [locationSearch, setLocationSearch] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [rooms, setRooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [sortBy, setSortBy] = useState("priceLowHigh");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const amenitiesList = [
    "WiFi",
    "Parking",
    "Pool",
    "Air Conditioning",
    "Heater",
  ];

  const [allProperties, setAllProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${BASE_URL}properties`);

        let src = response.data;
        if (src.data && Array.isArray(src.data)) {
          src = src.data;
        } else if (src.properties && Array.isArray(src.properties)) {
          src = src.properties;
        } else if (!Array.isArray(src)) {
          console.warn("Unexpected data format:", src);
          src = [];
        }

        const mapped = (src || []).map(mapFromBackend);
        setAllProperties(mapped);
      } catch (err) {
        console.error("Error loading properties:", err);
        toast.error("Failed to load properties. Please try again.");
      }
    };

    fetchProperties();
  }, []);

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}bookings`);

        let src = response.data;
        if (src.data && Array.isArray(src.data)) {
          src = src.data;
        } else if (src.bookings && Array.isArray(src.bookings)) {
          src = src.bookings;
        } else if (!Array.isArray(src)) {
          console.warn("Unexpected bookings format:", src);
          src = [];
        }

        setBookings(src);
      } catch (err) {
        console.error("Error loading bookings:", err);
        toast.error("Failed to load booking data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Validation messages
  let errorText = "";

  if (checkIn && !checkOut) {
    errorText = "Please select check-out date.";
  } else if (!checkIn && checkOut) {
    errorText = "Please select check-in date.";
  } else if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
    errorText = "Check-out must be after check-in.";
  }

  if (!errorText && minPrice > maxPrice) {
    errorText = "Min price cannot be greater than max price.";
  }
  if (!errorText && rooms < 1) errorText = "Rooms must be at least 1.";
  if (!errorText && bathrooms < 1) errorText = "Bathrooms must be at least 1.";
  if (!errorText && guests < 1) errorText = "Guests must be at least 1.";

  // Reset filters
  const clearFilters = () => {
    setLocationSearch("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setMinPrice(100);
    setMaxPrice(100000);
    setRooms(1);
    setBathrooms(1);
    setSortBy("priceLowHigh");
    setSelectedAmenities([]);
  };

  // Filter and sort properties
  const filtered = useMemo(() => {
    return allProperties.filter((p) => {
      const matchLocation =
        (p.location || "").toLowerCase().includes(locationSearch.toLowerCase()) ||
        (p.name || "").toLowerCase().includes(locationSearch.toLowerCase());

      const matchPrice = (p.price ?? 0) >= minPrice && (p.price ?? 0) <= maxPrice;

      const matchRooms = (p.rooms || 0) >= rooms;

      const matchBathrooms = (p.bathrooms || 0) >= bathrooms;

      const matchGuests = (p.max_guests || 0) >= guests;

      const matchAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((a) => (p.amenities || []).includes(a));

      // Check availability based on date overlap
      let matchAvailability = true;
      if (checkIn && checkOut) {
        const propertyBookings = bookings.filter((b) => b.propertyId === p.id);
        matchAvailability = !propertyBookings.some((b) =>
          overlap(checkIn, checkOut, b.checkInDate, b.checkOutDate)
        );
      }

      return (
        matchLocation &&
        matchPrice &&
        matchRooms &&
        matchBathrooms &&
        matchGuests &&
        matchAmenities &&
        matchAvailability
      );
    });
  }, [
    allProperties,
    locationSearch,
    minPrice,
    maxPrice,
    rooms,
    bathrooms,
    guests,
    selectedAmenities,
    checkIn,
    checkOut,
    bookings,
  ]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === "priceLowHigh") return arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "priceHighLow") return arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === "roomsLowHigh") return arr.sort((a, b) => (a.rooms || 0) - (b.rooms || 0));
    if (sortBy === "roomsHighLow") return arr.sort((a, b) => (b.rooms || 0) - (a.rooms || 0));
    return arr;
  }, [filtered, sortBy]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const viewProperty = (property) => {
    navigate("/property", {
      state: { property, checkIn, checkOut, guests },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-xl font-semibold text-gray-700">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Search Properties</h1>
            <button
              onClick={() => navigate("/clientDashboard")}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {/* Location Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City or property name"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={getDateISTForCheckInMin()}
                    max={getDateISTForCheckInMax()}
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={getDateISTForCheckOutMin()}
                    max={getDateISTForCheckOutMax()}
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (₹)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={rooms}
                    onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                  />
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Bathrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(parseInt(e.target.value) || 1)}
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    {amenitiesList.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="roomsLowHigh">Rooms: Low to High</option>
                    <option value="roomsHighLow">Rooms: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {errorText && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errorText}</p>
                </div>
              )}
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {sorted.length} {sorted.length === 1 ? "Property" : "Properties"} Found
              </h2>
            </div>

            {sorted.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sorted.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onView={() => viewProperty(property)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Property Card Component
function PropertyCard({ property, onView }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
          <span className="font-bold text-gray-900">₹{property.price}</span>
          <span className="text-xs text-gray-600">/night</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
          {property.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <svg
            className="w-4 h-4"
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

        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
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
            {property.rooms} Rooms
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
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
            {property.max_guests} Guests
          </span>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <button
          onClick={onView}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}