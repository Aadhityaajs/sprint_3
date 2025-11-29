// src/Component/SearchProperties.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "./SearchProperties.css";

const BASE_URL = "http://localhost:8081/api/client/";

// ---------------------- DATE HELPERS (IST) ----------------------
const getDateIST = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

const getDateISTForCheckInMin = () => {
  const d = getDateIST();
  return d.toISOString().split("T")[0];
};

const getDateISTForCheckInMax = () => {
  const d = getDateIST();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
};

const getDateISTForCheckOutMin = () => {
  const d = getDateIST();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const getDateISTForCheckOutMax = () => {
  const d = getDateIST();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split("T")[0];
};

// ---------------------- DATE OVERLAP CHECK ----------------------
const overlap = (ci, co, bci, bco) => {
  const start1 = new Date(ci);
  const end1 = new Date(co);
  const start2 = new Date(bci);
  const end2 = new Date(bco);
  // overlap if ranges intersect
  return start1 <= end2 && start2 <= end1;
};

// ---------------------- MAP BACKEND JSON -> UI MODEL ----------------------
function mapFromBackend(p) {
  // if already in UI shape (maybe later backend updated), just return
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
    // IDs
    id: p.propertyId || p.id,
    propertyId: p.propertyId || p.id,
    hostUserId: p.userId || p.hostUserId,

    // Main info
    name: p.propertyName || p.name || "Unknown Property",
    description: p.propertyDescription || p.description || "",
    price: p.pricePerDay || p.price || 0,
    rooms: p.noOfRooms || p.rooms || 1,
    bathrooms: p.noOfBathrom || p.bathrooms || 1,
    max_guests: p.maxNumberOfGuest || p.max_guests || 1,
    image: p.imageURL,
    // Address / location strings for UI
    address: `${addr.buildingNo || ""}, ${addr.street || ""}, ${addr.city || ""
      }`.replace(/^,\s*|,\s*$/g, "").trim() || "Address not available",
    location: `${addr.city || ""}, ${addr.state || ""}, ${addr.country || ""
      }`.replace(/^,\s*|,\s*$/g, "").trim() || "Location not available",

    // Extra
    hasWifi: p.hasWifi || false,
    hasParking: p.hasParking || false,
    hasPool: p.hasPool || false,
    hasAC: p.hasAC || false,
    hasHeater: p.hasHeater || false,
    hasPetFriendly: p.hasPetFriendly || false,
    propertyStatus: p.propertyStatus || "AVAILABLE",
    propertyRating: p.propertyRating || 0,
    propertyRatingCount: p.propertyRatingCount || 0,
    amenities
  };
}

export default function SearchProperties() {
  const navigate = useNavigate();

  // ----------------------- FILTER STATES -----------------------
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

  const amenitiesList = ["WiFi", "Parking", "Pool", "Air Conditioning", "Heater"];

  const [allProperties, setAllProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------- FETCH PROPERTIES FROM BACKEND -----------------------
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${BASE_URL}properties`);
        console.log("Fetched properties data:", response);

        // Handle different response formats:
        // response.data.data = [{...}]  OR response.data = [{...}] OR response.data.properties = [{...}]
        let src = response.data;

        // Check if data is nested under 'data' property
        if (src.data && Array.isArray(src.data)) {
          src = src.data;
        }
        // Check if data is nested under 'properties' property
        else if (src.properties && Array.isArray(src.properties)) {
          src = src.properties;
        }
        // If src is already an array, use it directly
        else if (!Array.isArray(src)) {
          console.warn("Unexpected data format:", src);
          src = [];
        }

        const mapped = (src || []).map(mapFromBackend);
        console.log("Mapped properties:", mapped);
        setAllProperties(mapped);
      } catch (err) {
        console.error("Error loading properties:", err);
        if (err.response) {
          console.error("Response error:", err.response.data);
        }
      }
    };

    fetchProperties();
  }, []);

  // ----------------------- FETCH BOOKINGS FROM BACKEND -----------------------
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}bookings`);
        console.log("Fetched bookings data:", response);

        // Handle different response formats:
        // response.data.data = [{...}] OR response.data = [{...}] OR response.data.bookings = [{...}]
        let src = response.data;

        // Check if data is nested under 'data' property
        if (src.data && Array.isArray(src.data)) {
          src = src.data;
        }
        // Check if data is nested under 'bookings' property
        else if (src.bookings && Array.isArray(src.bookings)) {
          src = src.bookings;
        }
        // If src is already an array, use it directly
        else if (!Array.isArray(src)) {
          console.warn("Unexpected bookings format:", src);
          src = [];
        }

        console.log("Processed bookings:", src);
        setBookings(src);
      } catch (err) {
        console.error("Error loading bookings:", err);
        if (err.response) {
          console.error("Response error:", err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ----------------------- VALIDATION MESSAGES -----------------------
  let errorText = "";

  if (checkIn && !checkOut) errorText = "Please select check-out date.";
  else if (!checkIn && checkOut) errorText = "Please select check-in date.";
  else if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
    errorText = "Check-out must be after check-in.";
  }

  if (!errorText && minPrice > maxPrice)
    errorText = "Min price cannot be greater than max price.";
  if (!errorText && rooms < 1) errorText = "Rooms must be at least 1.";
  if (!errorText && bathrooms < 1) errorText = "Bathrooms must be at least 1.";
  if (!errorText && guests < 1) errorText = "Guests must be at least 1.";

  // ----------------------- RESET FILTERS -----------------------
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

  // ----------------------- FILTER PROPERTIES -----------------------
  const filtered = allProperties.filter((p) => {
    const matchLocation =
      (p.location || "")
        .toLowerCase()
        .includes(locationSearch.toLowerCase()) ||
      (p.name || "").toLowerCase().includes(locationSearch.toLowerCase());

    const matchPrice = (p.price ?? 0) >= minPrice && (p.price ?? 0) <= maxPrice;
    const matchRooms = (p.rooms ?? 0) >= rooms;
    const matchBaths = (p.bathrooms ?? 0) >= bathrooms;
    const matchGuests = (p.max_guests ?? 0) >= guests;

    const matchAmenities = selectedAmenities.every((a) =>
      (p.amenities || []).includes(a)
    );

    return (
      matchLocation &&
      matchPrice &&
      matchRooms &&
      matchBaths &&
      matchGuests &&
      matchAmenities
    );
  });

  // ----------------------- REMOVE ALREADY BOOKED PROPERTIES -----------------------
  const available = filtered.filter((p) => {
    if (!checkIn || !checkOut) return true;

    const hasClash = bookings.some(
      (b) =>
        b.propertyId === (p.propertyId || p.id) &&
        overlap(checkIn, checkOut, b.checkInDate, b.checkOutDate)
    );

    // if clash → hide property (cannot double book)
    return !hasClash;
  });

  // ----------------------- SORT RESULTS -----------------------
  const sorted = [...available].sort((a, b) => {
    if (sortBy === "priceLowHigh") return (a.price ?? 0) - (b.price ?? 0);
    if (sortBy === "priceHighLow") return (b.price ?? 0) - (a.price ?? 0);
    return 0;
  });

  // ----------------------- VIEW DETAILS -----------------------
  const viewDetails = (property) => {
    navigate("/property", {
      state: { property, checkIn, checkOut, guests }
    });
  };

  // ----------------------- LOADING STATE -----------------------
  if (loading) {
    return (
      <div className="max-w-[1250px] mx-auto p-8 font-sans">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>Loading properties...</h2>
        </div>
      </div>
    );
  }

  // ----------------------- UI -----------------------
  return (
    <div className="max-w-[1250px] mx-auto p-8 font-sans">
      <button className="text-blue-600 bg-transparent border-none text-base cursor-pointer mb-5 hover:underline" onClick={() => navigate("/clientDashboard")}>
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Search Properties</h1>

      {/* ------------------ SEARCH BAR ------------------ */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-8 border border-gray-200">
        <div className="grid grid-cols-5 gap-5">
          {/* Where */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="p-2 text-sm border border-gray-200 rounded-lg outline-none bg-white focus:border-blue-600"
            />
          </div>

          {/* Check-in */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Check-in</label>
            <input
              type="date"
              value={checkIn}
              min={getDateISTForCheckInMin()}
              max={getDateISTForCheckInMax()}
              onChange={(e) => setCheckIn(e.target.value)}
              className="p-2 text-sm border border-gray-200 rounded-lg outline-none bg-white focus:border-blue-600"
            />
          </div>

          {/* Check-out */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Check-out</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || getDateISTForCheckOutMin()}
              max={getDateISTForCheckOutMax()}
              onChange={(e) => setCheckOut(e.target.value)}
              className="p-2 text-sm border border-gray-200 rounded-lg outline-none bg-white focus:border-blue-600"
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Guests</label>
            <input
              type="number"
              min={1}
              max={100}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="p-2 text-sm border border-gray-200 rounded-lg outline-none bg-white focus:border-blue-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col justify-end gap-2">
            <button className="bg-gray-100 text-gray-800 p-3 text-sm rounded-lg border-none cursor-pointer font-semibold hover:bg-gray-200" type="button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {errorText && <p className="text-red-600 text-sm mt-2">{errorText}</p>}
      </div>

      {/* ------------------ FILTER PANEL ------------------ */}
      <div className="grid grid-cols-5 gap-5 mb-8">
        {/* Min Price */}
        <div className="block">
          <label className="text-sm font-semibold mb-1.5 block">Min Price (₹)</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Max Price */}
        <div className="block">
          <label className="text-sm font-semibold mb-1.5 block">Max Price (₹)</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Rooms */}
        <div className="block">
          <label className="text-sm font-semibold mb-1.5 block">Rooms</label>
          <input
            type="number"
            value={rooms}
            min={1}
            onChange={(e) => setRooms(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Bathrooms */}
        <div className="block">
          <label className="text-sm font-semibold mb-1.5 block">Bathrooms</label>
          <input
            type="number"
            value={bathrooms}
            min={1}
            onChange={(e) => setBathrooms(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Sort */}
        <div className="block">
          <label className="text-sm font-semibold mb-1.5 block">Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
            <option value="priceLowHigh">Price: Low → High</option>
            <option value="priceHighLow">Price: High → Low</option>
          </select>
        </div>

        {/* Amenities */}
        <div className="col-span-5">
          <label>
            <strong>Amenities</strong>
          </label>

          {amenitiesList.map((a) => (
            <label key={a} className="inline-flex items-center gap-1.5 mr-4 mt-1 text-sm">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a)}
                onChange={() => {
                  if (selectedAmenities.includes(a)) {
                    setSelectedAmenities(
                      selectedAmenities.filter((x) => x !== a)
                    );
                  } else {
                    setSelectedAmenities([...selectedAmenities, a]);
                  }
                }}
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      {/* ------------------ PROPERTY LIST ------------------ */}
      <h2>{sorted.length} Properties Found</h2>

      <div className="grid grid-cols-3 gap-6 mt-5">
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", width: "100%" }}>
            <p>No properties match your search criteria.</p>
            <button className="bg-gray-100 text-gray-800 p-3 text-sm rounded-lg border-none cursor-pointer font-semibold hover:bg-gray-200" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          sorted.map((p) => (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md" key={p.id}>
              <img src={p.image} className="w-full h-[170px] object-cover rounded-lg mb-2.5" alt="" />

              <h2 className="text-xl mb-1.5 font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.location}</p>
              <p className="text-base font-bold text-blue-600 my-2">₹{p.price}/night</p>

              <button className="bg-blue-600 text-white p-2.5 border-none rounded-lg cursor-pointer w-full font-semibold mt-2 hover:bg-blue-700" onClick={() => viewDetails(p)}>
                View Details →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}