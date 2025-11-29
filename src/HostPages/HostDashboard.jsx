import React, { useEffect, useState, useRef } from "react";
import { Bell, Edit, MapPin, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getProperties,
  getDeletedProperties,
  getBookings,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
  getRevenue,
} from '../Apis/HostApi';

import PropertyCard from "./PropertyCard";
import PropertyModal from "./PropertyModal";
import PropertyForm from "./PropertyForm";
import BookingCard from "./BookingCard";
import BookingModal from "./BookingModal";


export default function HostDashboard() {
  const navigate = useNavigate();
  const userRaw = sessionStorage.getItem("currentUser");
  let parsed = null;
  try { parsed = userRaw ? JSON.parse(userRaw) : null; } catch { parsed = null; }
  const userId = parsed?.userId ?? 1;

  const [activeTab, setActiveTab] = useState("properties");
  const [menuOpen, setMenuOpen] = useState(false);

  const [properties, setProperties] = useState([]);
  const [deletedProperties, setDeletedProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formInitial, setFormInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState({ success: "", error: "" });

  const [bookingTab, setBookingTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [revenue, setRevenue] = useState(0);

  // MENU CLICK OUTSIDE HANDLING
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  
  //for revenue flip
  const [flipRevenue, setFlipRevenue] = useState(false);
  const revenueRef = useRef(null);


  const [newBookings, setNewBookings] = useState(0);
  //for revenue flip
  useEffect(() => {
  function handleClickOutside(e) {
    if (revenueRef.current && !revenueRef.current.contains(e.target)) {
      setFlipRevenue(false);
    }
  }
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadAll();
    loadTotalRevenue();
    const handler = () => openAddPropertyForm();
    window.addEventListener("openAddProperty", handler);
    return () => window.removeEventListener("openAddProperty", handler);
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const rResp = await getRevenue(userId);
      if (rResp?.success) setRevenue(rResp.data.totalRevenue);

      const pResp = await getProperties(userId);
      if (pResp?.success) setProperties(pResp.data || []);

      const dResp = await getDeletedProperties(userId);
      if (dResp?.success) setDeletedProperties(dResp.data || []);

      

const bResp = await getBookings(userId);

if (bResp?.success) {
  const list = bResp.data || [];

  const lastCount = Number(localStorage.getItem("lastBookingCount") || 0);
  const confirmed = list.filter(b => b.bookingStatus === true).length;

  if (confirmed > lastCount) {
    setNewBookings(confirmed - lastCount);
  }

  setBookings(list);
}

      setMessages({ success: "Loaded data", error: "" });
    } catch (err) {
      setMessages({ success: "", error: err?.message || "Failed to load data" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessages({ success: "", error: "" }), 5000);
    }
  };

  const loadTotalRevenue = async () => {
    try {
      const resp = await getRevenue(userId);
      if (resp?.success) setRevenue(resp.data.totalRevenue || 0);
    } catch (err) { }
  };

  const openAddPropertyForm = () => {
    setIsEditMode(false);
    setFormInitial(null);
    setShowPropertyForm(true);
  };

  const openEditPropertyForm = async (propertyId) => {
    try {
      setLoading(true);
      const resp = await getPropertyById(propertyId);
      if (resp?.success) {
        setFormInitial(resp.data);
        setIsEditMode(true);
        setShowPropertyForm(true);
      }
    } catch (err) {
      setMessages({ success: "", error: "Failed to load property" });
    } finally {
      setLoading(false);
    }
  };

  const submitProperty = async (payload) => {
  try {
    setLoading(true);

    const resp = isEditMode
      ? await updateProperty(payload)
      : await addProperty(payload);

    // Duplicate address OR any other backend validation error
    if (!resp?.success) {
      alert(resp.message || "Operation failed/already address exists");  // <-- Popup here
      setMessages({ success: "", error: resp?.message || "Operation failed" });
      return;
    }

    alert(isEditMode ? "Property updated successfully!" : "Property added successfully!");

    setMessages({
      success: isEditMode ? "Property updated" : "Property added",
      error: ""
    });

    setShowPropertyForm(false);
    await loadAll();
  } catch (err) {
    alert(err.message || "Something went wrong");  // <-- Popup for network error
    setMessages({ success: "", error: err?.message || "Operation failed" });
  } finally {
    setLoading(false);
    setTimeout(() => setMessages({ success: "", error: "" }), 5000);
  }
};


  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      setLoading(true);
      const resp = await deleteProperty(propertyId);

      if (resp?.success) {
        setMessages({ success: "Property deleted (soft)", error: "" });
        await loadAll();
      }
    } catch (err) {
      setMessages({ success: "", error: "Delete failed" });
    } finally {
      setLoading(false);
    }
  };

  const openPropertyDetails = async (propertyId) => {
    try {
      setLoading(true);
      const resp = await getPropertyById(propertyId);
      if (resp?.success) setSelectedProperty(resp.data);
    } catch (err) {
      setMessages({ success: "", error: "Failed to load property details" });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setSelectedProperty(null);

  // Booking helpers
  const todayStr = () => new Date().toISOString().split("T")[0];
  const isValidDate = (s) => {
    const d = new Date(s);
    return !isNaN(d) && /^\d{4}-\d{2}-\d{2}$/.test(s);
  };

  const now = new Date();
const today = now.toISOString().split("T")[0];
const currentHour = now.getHours(); // 0–23

const upcoming = bookings.filter(b =>
  isValidDate(b.checkInDate) &&
  b.bookingStatus === true &&
  b.checkInDate > today
);

const current = bookings.filter(b => {
  if (!isValidDate(b.checkInDate) || !isValidDate(b.checkOutDate)) return false;
  if (b.bookingStatus !== true) return false;

  // Booking fully in the future or a normal current stay
  if (b.checkInDate <= today && b.checkOutDate > today) return true;

  // Checkout is today → current only before 12 PM
  if (b.checkOutDate === today && currentHour < 12) return true;

  return false;
});

const completed = bookings.filter(b => {
  if (!isValidDate(b.checkOutDate)) return true;

  // Cancelled → completed
  if (b.bookingStatus !== true) return true;

  // Completed normally before today
  if (b.checkOutDate < today) return true;

  // Checkout today → completed only after 12 PM
  if (b.checkOutDate === today && currentHour >= 12) return true;

  return false;
});
  const propertyBlocked = (propertyId) => {
  const hasUpcoming = upcoming.some(b => b.propertyId === propertyId);
  const hasCurrent = current.some(b => b.propertyId === propertyId);
  return hasUpcoming || hasCurrent;
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b z-40">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

          {/* LEFT — logo */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1976D2] rounded-lg flex items-center justify-center">
              <MapPin className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">SpaceFinders</div>
              <div className="text-sm text-slate-500">Host Dashboard</div>
            </div>
          </div>

          {/* RIGHT — MENU + PROFILE */}
          <div className="flex items-center gap-3 relative">

            {/* MENU BUTTON */}
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-xl"
            >
              ☰
            </button>

            {/* PROFILE BUTTON */}
            <button
  className="p-2 rounded-lg bg-white border hover:bg-slate-100 text-xl"
  onClick={() => navigate('/profile')}
>
  👤
</button>

            {/* DROPDOWN MENU */}
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-14 w-44 bg-white rounded-lg shadow-lg border z-50"
              >
                <button
                  onClick={() => alert("Notifications coming soon")}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Bell size={16} /> Notifications
                </button>

                <button
                  onClick={() => navigate("/complaints")}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit size={16} /> Complaint
                </button>

                <button
                  onClick={() => {
                    sessionStorage.clear();
                    window.location.href = "/login";
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-2 text-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-28 max-w-6xl mx-auto px-6 lg:px-12 pb-12">

        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Host Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your properties, bookings, and complaints</p>
          </div>
          {/* <div className="text-right">
            <div className="text-sm text-slate-500">Total Revenue</div>
            <div className="text-2xl font-semibold text-[#1976D2]">₹{revenue.toFixed(2)}</div>
          </div> */}
          <div
  ref={revenueRef}
  onClick={() => setFlipRevenue(!flipRevenue)}
  className="w-40 h-24 cursor-pointer"
>
  <div
    className={`
      relative w-full h-full duration-500 transform
      ${flipRevenue ? "rotate-y-180" : ""}
    `}
    style={{ transformStyle: "preserve-3d" }}  // tailwind cannot do this
  >
    {/* FRONT */}
    <div
      className="absolute inset-0 bg-white shadow-md rounded-lg flex flex-col items-center justify-center"
      style={{ backfaceVisibility: "hidden" }}
    >
      <p className="text-sm text-slate-500">Total Revenue</p>
      {/* <p className="text-xl font-semibold text-[#1976D2]">Tap to view</p> */}
    </div>

    {/* BACK */}
    <div
      className="absolute inset-0 bg-[#1976D2] text-white shadow-lg rounded-lg flex flex-col items-center justify-center rotate-y-180"
      style={{ backfaceVisibility: "hidden" }}
    >
      <p className="text-xl font-semibold">₹{revenue.toFixed(2)}</p>
      {/* <p className="text-xs opacity-80 mt-1">Click outside to close</p> */}
    </div>
  </div>
</div>
        </div>

        {/* MESSAGES */}
        <div className="mb-6 space-y-2">
          {messages.success && <div className="p-3 bg-green-50 text-green-700 rounded-md">{messages.success}</div>}
          {messages.error && <div className="p-3 bg-red-50 text-red-700 rounded-md">{messages.error}</div>}
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => { setActiveTab('properties'); loadAll(); }}
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'properties' ? 'bg-[#1976D2] text-white' : 'bg-white border text-slate-700'}`}
          >
            🏡 Properties ({properties.length})
          </button>

          <button
            onClick={() => { setActiveTab('deleted'); loadAll(); }}
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'deleted' ? 'bg-[#1976D2] text-white' : 'bg-white border text-slate-700'}`}
          >
            🗑️ Deleted ({deletedProperties.length})
          </button>

          <button
  onClick={() => {
    setActiveTab("bookings");
    setNewBookings(0); // clear badge
    const confirmed = bookings.filter(b => b.bookingStatus === true).length;
    localStorage.setItem("lastBookingCount", confirmed); // clear only here
    loadAll();
  }}
  className={`relative px-4 py-2 rounded-lg font-semibold ${
    activeTab === "bookings"
      ? "bg-[#1976D2] text-white"
      : "bg-white border text-slate-700"
  }`}
>
  📅 Bookings ({bookings.length})
  {newBookings > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {newBookings}
    </span>
  )}
</button>
        </div>

        {/* PROPERTIES */}
        {activeTab === 'properties' && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">My Properties</h2>
              <button
                onClick={openAddPropertyForm}
                className="flex items-center gap-2 bg-[#1976D2] text-blue px-4 py-2 rounded-lg hover:bg-[#155fa6]"
              >
                <Plus size={16} /> Add New Property
              </button>
            </div>

            {properties.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(p => (
                  <PropertyCard
  key={p.propertyId}
  property={p}
  blocked={propertyBlocked(p.propertyId)}
  onView={() => openPropertyDetails(p.propertyId)}
  onEdit={() => openEditPropertyForm(p.propertyId)}
  onDelete={() => handleDelete(p.propertyId)}
/>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 mt-10">📭 No properties found. Add your first property!</div>
            )}
          </section>
        )}

        {/* DELETED */}
        {activeTab === 'deleted' && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-900">Deleted Properties</h2>

            {deletedProperties.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {deletedProperties.map(p => (
                  <div key={p.propertyId} className="bg-white rounded-lg shadow overflow-hidden relative opacity-60">
                    <img src={p.imageURL || "/assets/placeholder-property.jpg"} alt={p.propertyName} className="w-full h-48 object-cover grayscale" />
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">DELETED</span>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900">{p.propertyName}</h3>
                      <p className="text-slate-500 text-sm">📍 {p.city}, {p.state}</p>
                      <div className="mt-2 font-semibold">₹{p.pricePerDay} / night</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 mt-10">📭 No deleted properties</div>
            )}
          </section>
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Bookings on My Properties</h2>
              <div className="flex gap-2">
                <button className={`px-3 py-1 rounded-md ${bookingTab === 'upcoming' ? 'bg-[#1976D2] text-white' : 'bg-white border'}`} onClick={() => setBookingTab('upcoming')}>
                  Upcoming ({upcoming.length})
                </button>
                <button className={`px-3 py-1 rounded-md ${bookingTab === 'current' ? 'bg-[#1976D2] text-white' : 'bg-white border'}`} onClick={() => setBookingTab('current')}>
                  Currently Staying ({current.length})
                </button>
                <button className={`px-3 py-1 rounded-md ${bookingTab === 'completed' ? 'bg-[#1976D2] text-white' : 'bg-white border'}`} onClick={() => setBookingTab('completed')}>
                  Completed / Cancelled ({completed.length})
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {bookingTab === 'upcoming' && (
                upcoming.length ? upcoming.map(b => <BookingCard key={b.bookingId} booking={b} onOpen={() => setSelectedBooking(b)} />)
                : <div className="text-slate-500">No upcoming bookings</div>
              )}

              {bookingTab === 'current' && (
                current.length ? current.map(b => <BookingCard key={b.bookingId} booking={b} onOpen={() => setSelectedBooking(b)} />)
                : <div className="text-slate-500">No current stays</div>
              )}

              {bookingTab === 'completed' && (
                completed.length ? completed.map(b => <BookingCard key={b.bookingId} booking={b} onOpen={() => setSelectedBooking(b)} />)
                : <div className="text-slate-500">No completed bookings</div>
              )}
            </div>
          </section>
        )}

        {/* MODALS */}
        {selectedProperty && <PropertyModal property={selectedProperty} onClose={closeModal} />}
        {showPropertyForm && (
          <PropertyForm
            initial={formInitial}
            isEdit={isEditMode}
            userId={userId}
            onCancel={() => setShowPropertyForm(false)}
            onSubmit={submitProperty}
          />
        )}
        {selectedBooking && <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

      </main>
    </div>
  );
}
