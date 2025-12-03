import React, { useEffect, useState, useRef } from "react";
import { Bell, Edit, MapPin, LogOut, Plus, Home, Calendar, Trash2, DollarSign, TrendingUp, AlertCircle, MessageSquare } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

export default function HostDashboard() {
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

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  
  const [flipRevenue, setFlipRevenue] = useState(false);
  const revenueRef = useRef(null);

  const [newBookings, setNewBookings] = useState(0);

  const navigate = useNavigate();

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
        menuButtonRef.current &&
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

      if (!resp?.success) {
        alert(resp.message || "Operation failed/already address exists");
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
      alert(err.message || "Something went wrong");
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

  const todayStr = () => new Date().toISOString().split("T")[0];
  const isValidDate = (s) => {
    const d = new Date(s);
    return !isNaN(d) && /^\d{4}-\d{2}-\d{2}$/.test(s);
  };

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  const upcoming = bookings.filter(b =>
    isValidDate(b.checkInDate) &&
    b.bookingStatus === true &&
    b.checkInDate > today
  );

  const current = bookings.filter(b => {
    if (!isValidDate(b.checkInDate) || !isValidDate(b.checkOutDate)) return false;
    if (b.bookingStatus !== true) return false;

    if (b.checkInDate <= today && b.checkOutDate > today) return true;

    if (b.checkOutDate === today && currentHour < 12) return true;

    return false;
  });

  const completed = bookings.filter(b => {
    if (!isValidDate(b.checkOutDate)) return true;

    if (b.bookingStatus !== true) return true;

    if (b.checkOutDate < today) return true;

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
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SpaceFinders</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Host
              </span>
            </div>

            <div className="flex items-center gap-3 relative">
              <button
                ref={menuButtonRef}
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 text-xl"
              >
                ☰
              </button>

              <button className="p-2 rounded-lg bg-white border hover:bg-gray-100 text-xl"
              onClick={() => navigate("/profile")}>
                👤
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-14 w-44 bg-white rounded-lg shadow-lg border z-50"
                >
                  <button
                    onClick={() => alert("Notifications coming soon")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Bell size={16} /> Notifications
                  </button>

                  <button
                    onClick={() => window.location.href = "/complaint"}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={16} /> Complaint
                  </button>

                  <button
                    onClick={() => {
                      sessionStorage.clear();
                      window.location.href = "/login";
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* WELCOME SECTION */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Host Dashboard
          </h2>
          <p className="text-gray-600">Manage your properties, bookings, and complaints</p>
        </div>

        {/* MESSAGES */}
        {messages.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {messages.success}
          </div>
        )}
        {messages.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {messages.error}
          </div>
        )}

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`₹${revenue.toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
            isFlippable={true}
            flipRevenue={flipRevenue}
            setFlipRevenue={setFlipRevenue}
            revenueRef={revenueRef}
          />
          <StatCard 
            title="Properties" 
            value={properties.length}
            subtitle={`${deletedProperties.length} Deleted`}
            icon={<Home className="w-6 h-6" />}
            color="blue"
          />
          <StatCard 
            title="Total Bookings" 
            value={bookings.length}
            subtitle={`${upcoming.length} Upcoming`}
            icon={<Calendar className="w-6 h-6" />}
            color="purple"
            badge={newBookings > 0 ? newBookings : null}
          />
          <StatCard 
            title="Current Stays" 
            value={current.length}
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* TABS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <TabButton
            active={activeTab === "properties"}
            onClick={() => { setActiveTab('properties'); loadAll(); }}
            icon={<Home className="w-4 h-4" />}
            label={`Properties (${properties.length})`}
          />
          <TabButton
            active={activeTab === "deleted"}
            onClick={() => { setActiveTab('deleted'); loadAll(); }}
            icon={<Trash2 className="w-4 h-4" />}
            label={`Deleted (${deletedProperties.length})`}
          />
          <TabButton
            active={activeTab === "bookings"}
            onClick={() => {
              setActiveTab("bookings");
              setNewBookings(0);
              const confirmed = bookings.filter(b => b.bookingStatus === true).length;
              localStorage.setItem("lastBookingCount", confirmed);
              loadAll();
            }}
            icon={<Calendar className="w-4 h-4" />}
            label={`Bookings (${bookings.length})`}
            badge={newBookings > 0 ? newBookings : null}
          />
        </div>

        {/* CONTENT AREA */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          {/* PROPERTIES */}
          {activeTab === 'properties' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">My Properties</h3>
                <button
                  onClick={openAddPropertyForm}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus size={18} /> Add New Property
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-600">Loading properties...</div>
              ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Properties Yet</h4>
                  <p className="text-gray-600 mb-4">Start earning by adding your first property!</p>
                  <button
                    onClick={openAddPropertyForm}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Your First Property
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DELETED */}
          {activeTab === 'deleted' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Deleted Properties</h3>

              {deletedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deletedProperties.map(p => (
                    <div key={p.propertyId} className="bg-gray-50 rounded-lg shadow overflow-hidden relative opacity-70">
                      <img src={p.imageURL || "/assets/placeholder-property.jpg"} alt={p.propertyName} className="w-full h-48 object-cover grayscale" />
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        DELETED
                      </span>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{p.propertyName}</h3>
                        <p className="text-gray-500 text-sm mb-2">📍 {p.city}, {p.state}</p>
                        <div className="font-semibold text-gray-900">₹{p.pricePerDay} / night</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p>No deleted properties</p>
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Bookings on My Properties</h3>
                <div className="flex gap-2 flex-wrap">
                  <button 
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      bookingTab === 'upcoming' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`} 
                    onClick={() => setBookingTab('upcoming')}
                  >
                    Upcoming ({upcoming.length})
                  </button>
                  <button 
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      bookingTab === 'current' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`} 
                    onClick={() => setBookingTab('current')}
                  >
                    Currently Staying ({current.length})
                  </button>
                  <button 
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      bookingTab === 'completed' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`} 
                    onClick={() => setBookingTab('completed')}
                  >
                    Completed / Cancelled ({completed.length})
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {bookingTab === 'upcoming' && (
                  upcoming.length ? upcoming.map(b => <BookingCard key={b.bookingId} booking={b} onOpen={() => setSelectedBooking(b)} />)
                  : <EmptyState message="No upcoming bookings" />
                )}

                {bookingTab === 'current' && (
                  current.length ? current.map(b => <BookingCard key={b.bookingId} booking={b} onOpen={() => setSelectedBooking(b)} />)
                  : <EmptyState message="No current stays" />
                )}

                {bookingTab === 'completed' && (
                  completed.length ? completed.map(b => <BookingCard key={b.bookingId} booking={b} onOpen={() => setSelectedBooking(b)} />)
                  : <EmptyState message="No completed bookings" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon, color, badge, isFlippable, flipRevenue, setFlipRevenue, revenueRef }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600"
  };

  if (isFlippable) {
    return (
      <div
        ref={revenueRef}
        onClick={() => setFlipRevenue(!flipRevenue)}
        className="w-full h-full cursor-pointer"
      >
        <div
          className={`relative w-full h-full duration-500 transform ${flipRevenue ? "rotate-y-180" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                {icon}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-xl font-semibold text-blue-600">Tap to view</p>
          </div>

          <div
            className="absolute inset-0 bg-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center rotate-y-180"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-3xl font-bold mb-1">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {badge && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

// Empty State Component
function EmptyState({ message }) {
  return (
    <div className="text-center py-12 text-gray-500">
      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p>{message}</p>
    </div>
  );
}