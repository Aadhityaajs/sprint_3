import React, { useEffect, useState } from "react";
// import "./AdminDashboard.css";
import PropertyCard from "./PropertyCard.jsx";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getAllProperties,
  getAllBookings,
  toggleUserBlock,
  deleteProperty as deletePropertyApi,
  closeBooking as closeBookingApi
} from "../Apis/AdminApi";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalProperties: 0,
    bookedProperties: 0,
    availableProperties: 0,
    totalBookings: 0,
    totalComplaints: 0,
  });
  const navigate = useNavigate();
  // Helper function to generate 5-character alphanumeric booking ID (deterministic)
  const generateBookingId = (id) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const numPart = String(id).padStart(2, '0');
    // Use deterministic generation based on ID
    const seed = id * 7 + 13; // Simple deterministic formula
    let randomPart = '';
    for (let i = 0; i < 3; i++) {
      randomPart += chars.charAt((seed * (i + 1)) % chars.length);
    }
    return randomPart + numPart;
  };

  // Helper function to get property name by ID
  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.propertyId === propertyId);
    return property ? property.propertyName : 'Unknown Property';
  };

  // Helper function to get guest name by user ID
  const getGuestName = (userId) => {
    const user = users.find(u => u.userId === userId);
    return user ? user.username : 'Unknown Guest';
  };

  // Helper function to format extras
  const getExtras = (booking) => {
    const extras = [];
    if (booking.hasExtraCot) extras.push('Extra Cot');
    if (booking.hasDeepClean) extras.push('Deep Clean');
    return extras.length > 0 ? extras.join(', ') : 'nil';
  };

  // Helper function to check if booking can be closed
  const canCloseBooking = (checkoutDate) => {
    const checkout = new Date(checkoutDate);
    const now = new Date();
    return checkout < now;
  };

  // Function to close booking
  const closeBooking = async (bookingId) => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) return;

    if (!canCloseBooking(booking.checkoutDate)) {
      alert('Cannot close booking: Checkout date has not passed yet.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to close this booking?');
    if (!confirmed) return;

    try {
      // Close booking in backend (changes status to CLOSED, does not remove from database)
      await closeBookingApi(bookingId);

      // Update local state - change status to CLOSED instead of removing
      setBookings(prev => prev.map(b =>
        b.bookingId === bookingId
          ? { ...b, isBookingStatus: 'CLOSED' }
          : b
      ));

      // Reload data to update property statuses
      loadData();
    } catch (error) {
      console.error('Error closing booking:', error);
      alert('Failed to close booking. Please try again.');
    }
  };

  // Helper function to check if property has active bookings
  const hasActiveBooking = (propertyId, bookingsList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingsList.some(booking =>
      booking.propertyId === propertyId &&
      booking.isBookingStatus === 'BOOKED' &&
      new Date(booking.checkoutDate) >= today
    );
  };

  // Fetch all data from backend
  const loadData = async (signal = null) => {
    try {
      // Fetch all data in parallel for better performance
      const [usersData, propsData, bookingsData] = await Promise.all([
        getAllUsers(signal),
        getAllProperties(signal),
        getAllBookings(signal),
      ]);

      const usersRes = { ok: true };
      const propsRes = { ok: true };
      const bookingsRes = { ok: true };

      // Update state only with successful responses
      if (usersRes.ok && usersData.data) {
        setUsers(usersData.data);
      }
      if (propsRes.ok && propsData.data) {
        setProperties(propsData.data);
      }
      if (bookingsRes.ok && bookingsData.data) {
        setBookings(bookingsData.data);
      }
      // Complaints data removed - handled by ComplaintsPage

      // Calculate user stats
      const activeUsers = usersRes.ok && usersData.data
        ? usersData.data.filter(u => u.userStatus === 'Active').length
        : 0;
      const blockedUsers = usersRes.ok && usersData.data
        ? usersData.data.filter(u => u.userStatus === 'Blocked').length
        : 0;

      // Calculate property stats - check bookings for each property
      let bookedPropsCount = 0;
      let availablePropsCount = 0;
      let totalPropsCount = 0;

      if (propsRes.ok && propsData.data && bookingsRes.ok && bookingsData.data) {
        // Create a Set of booked property IDs for O(n+m) performance instead of O(n*m)
        const bookedPropertyIds = new Set();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        bookingsData.data.forEach(booking => {
          if (booking.isBookingStatus === 'BOOKED' && new Date(booking.checkoutDate) >= today) {
            bookedPropertyIds.add(booking.propertyId);
          }
        });

        propsData.data.forEach(prop => {
          // Only count properties that are not deleted
          if (prop.propertyStatus !== 'DELETED') {
            totalPropsCount++;
            if (bookedPropertyIds.has(prop.propertyId)) {
              bookedPropsCount++;
            } else {
              availablePropsCount++;
            }
          }
        });
      }

      // Update stats with successfully loaded data
      setStats({
        totalUsers: usersRes.ok && usersData.data ? usersData.data.length : 0,
        activeUsers,
        blockedUsers,
        totalProperties: totalPropsCount,
        bookedProperties: bookedPropsCount,
        availableProperties: availablePropsCount,
        totalBookings: bookingsRes.ok && bookingsData.data ? bookingsData.data.length : 0,
        totalComplaints: 0, // Handled by ComplaintsPage
      });
    } catch (e) {
      // Axios uses 'CanceledError' with code 'ERR_CANCELED'
      if (e.code === 'ERR_CANCELED' || e.name === 'CanceledError') {
        console.log('Fetch aborted');
      } else {
        console.error("Failed to fetch data", e);
      }
    }
  };

  const initial = () => {
    const sessionData = sessionStorage.getItem("currentUser");
    if (sessionData) {
      const currentUser = JSON.parse(sessionData);
      if (currentUser.role !== "admin") {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    initial();
    const controller = new AbortController();
    loadData(controller.signal);

    // Cleanup function to abort fetch on unmount
    return () => {
      controller.abort();
    };
  }, []);

  // Reset filters when tab changes
  useEffect(() => {
    setSelectedFilter("ALL");
    setSearchTerm("");
  }, [activeTab]);

  /* ---------- custom cursor logic ---------- */
  // Custom cursor removed as per requirement

  /* ---------- table filtering ---------- */
  const filteredUsers = users.filter((u) => {
    if (selectedFilter !== "ALL" && u.userStatus !== selectedFilter)
      return false;
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    return (
      (u.username ?? '').toLowerCase().includes(t) ||
      (u.userMail ?? '').toLowerCase().includes(t) ||
      (u.userPhone ?? '').includes(t)
    );
  });

  const filteredProperties = properties.filter((p) => {
    // Apply filter
    if (selectedFilter === "parking" && !p.hasParking) return false;
    if (selectedFilter === "food" && !p.hasAc) return false; // Using hasAc as proxy for amenities/comfort level
    if (selectedFilter === "rooms" && p.noOfRooms < 2) return false;

    // Apply search
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();

    // Handle address as either string or object
    let addressStr = '';
    if (typeof p.address === 'string') {
      addressStr = p.address;
    } else if (p.address && typeof p.address === 'object') {
      addressStr = `${p.address.city || ''} ${p.address.state || ''}`;
    }

    return (
      p.propertyName.toLowerCase().includes(t) ||
      addressStr.toLowerCase().includes(t) ||
      (p.propertyDescription && p.propertyDescription.toLowerCase().includes(t))
    );
  });

  const filteredBookings = bookings.filter((b) => {
    // Apply filter
    if (selectedFilter === "paid" && !b.isPaymentStatus) return false;
    if (selectedFilter === "pending" && b.isPaymentStatus) return false;

    // Apply search
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    const bookingId = generateBookingId(b.bookingId).toLowerCase();
    const propertyName = getPropertyName(b.propertyId).toLowerCase();
    const guestName = getGuestName(b.userId).toLowerCase();
    return (
      bookingId.includes(t) ||
      propertyName.includes(t) ||
      guestName.includes(t)
    );
  });

  const filteredComplaints = complaints.filter((c) => {
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    return (
      c.complaintDescription.toLowerCase().includes(t) ||
      c.complaintType.toLowerCase().includes(t)
    );
  });

  const toggleBlock = async (id, currentStatus) => {
    const action = currentStatus === "Active" ? "block" : "unblock";
    const confirmMessage = `Are you sure you want to ${action} this user?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";

    try {
      // Update in backend
      await toggleUserBlock(id, newStatus === "Blocked");

      // Update local state on success
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === id
            ? { ...u, userStatus: newStatus }
            : u
        )
      );

      // Update stats
      setStats(prev => {
        const activeChange = newStatus === "Active" ? 1 : -1;
        const blockedChange = newStatus === "Blocked" ? 1 : -1;
        return {
          ...prev,
          activeUsers: prev.activeUsers + activeChange,
          blockedUsers: prev.blockedUsers + blockedChange,
        };
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem("currentUser");
    navigate('/');
  }

  const handleDeleteProperty = async (propertyId) => {
    // Check if property has any active bookings using helper function
    if (hasActiveBooking(propertyId, bookings)) {
      alert('Cannot delete property: It has active or future bookings.');
      return;
    }

    try {
      // Delete from backend (soft delete - changes status to DELETED)
      await deletePropertyApi(propertyId);

      // Update local state - change status to DELETED instead of removing
      setProperties((prev) =>
        prev.map((p) =>
          p.propertyId === propertyId
            ? { ...p, propertyStatus: 'DELETED' }
            : p
        )
      );

      // Update stats - only decrement totalProperties and availableProperties
      setStats((prev) => ({
        ...prev,
        totalProperties: prev.totalProperties - 1,
        availableProperties: prev.availableProperties - 1,
      }));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert(error.message || 'Failed to delete property. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Premium Header */}
      <div className="flex justify-between items-center px-10 py-5 bg-gradient-to-br from-[#2c1810] via-[#1a1a2e] to-[#0f3460] shadow-lg relative">
        <div className="flex-1 flex items-center">
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10 drop-shadow-md" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 5L5 15V30L20 40L35 30V15L20 5Z" fill="url(#gradient1)" />
              <path d="M20 12L12 17V27L20 32L28 27V17L20 12Z" fill="white" opacity="0.3" />
              <circle cx="20" cy="20" r="5" fill="white" />
              <defs>
                <linearGradient id="gradient1" x1="5" y1="5" x2="35" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-2xl font-bold text-white tracking-wide drop-shadow-sm">Space Finder</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-lg font-semibold text-white drop-shadow-sm">Welcome, Admin!</span>
        </div>
        <div className="flex-1 flex items-center justify-end">
          <button className="bg-gradient-to-br from-[#ef6c4a] to-[#d84315] text-white border-0 px-6 py-2.5 rounded-lg font-semibold text-sm shadow-md cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Title */}
      <div className="px-10 pt-5 pb-2.5">
        <h1 className="text-2xl font-semibold text-gray-900 m-0">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1 m-0">Complete system oversight and management</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4.5 items-start mt-2 px-10">
        <div className="bg-gradient-to-b from-white to-[#fbfdff] p-4 rounded-lg border border-gray-200 relative overflow-hidden min-h-[72px] shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-gradient-to-r from-blue-600 to-blue-500" />
          <div className="text-[11px] tracking-wider text-gray-500 font-bold uppercase">Total Users</div>
          <div className="text-2xl mt-2 font-bold text-gray-900">{stats.totalUsers}</div>
          <div className="mt-3 flex gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Active:</span>
              <span className="text-base font-bold text-gray-700">{stats.activeUsers}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Blocked:</span>
              <span className="text-base font-bold text-gray-700">{stats.blockedUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-[#fbfdff] p-4 rounded-lg border border-gray-200 relative overflow-hidden min-h-[72px] shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-gradient-to-r from-orange-500 to-orange-400" />
          <div className="text-[11px] tracking-wider text-gray-500 font-bold uppercase">Total Properties</div>
          <div className="text-2xl mt-2 font-bold text-gray-900">{stats.totalProperties}</div>
          <div className="mt-3 flex gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Booked:</span>
              <span className="text-base font-bold text-gray-700">{stats.bookedProperties}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Available:</span>
              <span className="text-base font-bold text-gray-700">{stats.availableProperties}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-[#fbfdff] p-4 rounded-lg border border-gray-200 relative overflow-hidden min-h-[72px] shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-gradient-to-r from-teal-600 to-teal-500" />
          <div className="text-[11px] tracking-wider text-gray-500 font-bold uppercase">Total Bookings</div>
          <div className="text-2xl mt-2 font-bold text-gray-900">{stats.totalBookings}</div>
        </div>

        <div className="bg-gradient-to-b from-white to-[#fbfdff] p-4 rounded-lg border border-gray-200 relative overflow-hidden min-h-[72px] shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-gradient-to-r from-purple-600 to-purple-500" />
          <div className="text-[11px] tracking-wider text-gray-500 font-bold uppercase">Total Complaints</div>
          <div className="text-2xl mt-2 font-bold text-gray-900">{stats.totalComplaints}</div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="mt-4.5 mx-10 flex gap-2.5 items-center border-b border-gray-100 pb-3"
        role="tablist"
        aria-label="Dashboard Sections"
      >
        <button
          className={`px-3.5 py-2 rounded-full bg-transparent border border-gray-100 text-gray-800 font-semibold text-[13px] cursor-pointer transition hover:-translate-y-0.5 hover:bg-gray-50 ${activeTab === "users" ? "bg-gradient-to-r from-white/10 to-transparent shadow-sm border-2 border-black font-bold" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          User Management
        </button>
        <button
          className={`px-3.5 py-2 rounded-full bg-transparent border border-gray-100 text-gray-800 font-semibold text-[13px] cursor-pointer transition hover:-translate-y-0.5 hover:bg-gray-50 ${activeTab === "properties" ? "bg-gradient-to-r from-white/10 to-transparent shadow-sm border-2 border-black font-bold" : ""}`}
          onClick={() => setActiveTab("properties")}
        >
          Property Management
        </button>
        <button
          className={`px-3.5 py-2 rounded-full bg-transparent border border-gray-100 text-gray-800 font-semibold text-[13px] cursor-pointer transition hover:-translate-y-0.5 hover:bg-gray-50 ${activeTab === "bookings" ? "bg-gradient-to-r from-white/10 to-transparent shadow-sm border-2 border-black font-bold" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          Booking Management
        </button>
        <button
          className={`px-3.5 py-2 rounded-full bg-transparent border border-gray-100 text-gray-800 font-semibold text-[13px] cursor-pointer transition hover:-translate-y-0.5 hover:bg-gray-50 ${activeTab === "complaints" ? "bg-gradient-to-r from-white/10 to-transparent shadow-sm border-2 border-black font-bold" : ""}`}
          onClick={() => setActiveTab("complaints")}
        >
          Complaint Management
        </button>
      </div>

      {/* Controls */}
      <div className="flex justify-end gap-2.5 mt-2.5 px-10" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 600 }}>Filter</label>
          <select
            className="p-2 rounded-md border border-gray-200 text-[13px] bg-white text-gray-900 relative z-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {activeTab === "users" && (
              <>
                <option value="ALL">All Users</option>
                <option value="Active">Active Only</option>
                <option value="Blocked">Blocked Only</option>
              </>
            )}
            {activeTab === "properties" && (
              <>
                <option value="ALL">All Properties</option>
                <option value="parking">Has Parking</option>
                <option value="food">Has Food</option>
                <option value="rooms">By Rooms</option>
              </>
            )}
            {activeTab === "bookings" && (
              <>
                <option value="ALL">All Bookings</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </>
            )}
            {activeTab === "complaints" && (
              <>
                <option value="ALL">All Complaints</option>
              </>
            )}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 600 }}>Search</label>
          <input
            className="p-2 rounded-md border border-gray-200 text-[13px] bg-white text-gray-900 relative z-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder={
              activeTab === "users" ? "Search users..." :
                activeTab === "properties" ? "Search properties..." :
                  activeTab === "bookings" ? "Search bookings..." :
                    "Search complaints..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 220 }}
          />
        </div>
      </div>

      {/* Users tab */}
      {activeTab === "users" && (
        <>
          <div className="mt-4 mx-10 rounded-lg overflow-hidden border border-gray-200 bg-white" style={{ marginTop: 12 }}>
            <table className="w-full border-collapse text-[13px]" aria-describedby="user-table">
              <thead>
                <tr>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 50 }}>ID</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">Username</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">Email</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">Phone</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 120 }}>Role</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 120 }}>Status</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 160 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.userId}>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{u.userId}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900" style={{ fontWeight: 600 }}>{u.username}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{u.userMail}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{u.userPhone}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">
                        <span className="inline-block px-2 py-1.5 rounded-xl bg-gray-100 font-bold text-xs border border-gray-200">{u.userRole}</span>
                      </td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">
                        <span className="inline-block px-2 py-1.5 rounded-xl bg-gray-100 font-bold text-xs border border-gray-200">{u.userStatus}</span>
                      </td>
                      <td className="p-3 border-b border-gray-100 text-gray-900 flex gap-2 items-center">
                        {u.userRole !== "ADMIN" ? (
                          <button
                            className={`px-2.5 py-1.5 rounded-lg border-0 font-bold text-[13px] cursor-pointer ${u.userStatus === "Active" ? "bg-transparent text-orange-600 border border-orange-200" : "bg-transparent text-teal-600 border border-teal-200"}`}
                            onClick={() => toggleBlock(u.userId, u.userStatus)}
                          >
                            {(u.userStatus || "Active") === "Active" ? "Block" : "Unblock"}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-purple-700 px-3 py-1.5 bg-purple-50 rounded-md border border-purple-200">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="col-span-full text-center py-16 px-5 text-gray-500 text-base">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Properties tab */}
      {activeTab === "properties" && (
        <div style={{ paddingTop: 16 }}>
          <div className="grid grid-cols-3 gap-6 p-2 px-10">
            {filteredProperties.length > 0 ? (
              (() => {
                // Preprocess bookings into a Set for O(1) lookup performance
                const bookedPropertyIds = new Set();
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                bookings.forEach(booking => {
                  if (booking.isBookingStatus === 'BOOKED' && new Date(booking.checkoutDate) >= today) {
                    bookedPropertyIds.add(booking.propertyId);
                  }
                });

                return filteredProperties.map((p) => {
                  // Check if property is deleted
                  const isDeleted = p.propertyStatus === 'DELETED';

                  // Check if property has any active bookings using preprocessed Set
                  const isBooked = !isDeleted && bookedPropertyIds.has(p.propertyId);

                  // Determine property status to display
                  let propertyStatus = p.propertyStatus;
                  if (isDeleted) {
                    propertyStatus = 'DELETED';
                  } else if (isBooked) {
                    propertyStatus = 'BOOKED';
                  } else {
                    propertyStatus = 'AVAILABLE';
                  }

                  return (
                    <PropertyCard
                      key={p.propertyId}
                      property={{ ...p, propertyStatus }}
                      onDelete={handleDeleteProperty}
                      canDelete={!isBooked && !isDeleted}
                      isDeleted={isDeleted}
                    />
                  );
                });
              })()
            ) : (
              <div className="col-span-full text-center py-16 px-5 text-gray-500 text-base">
                <p>No properties found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bookings tab */}
      {activeTab === "bookings" && (
        <div style={{ paddingTop: 16 }}>
          <div className="mt-4 mx-10 rounded-lg overflow-hidden border border-gray-200 bg-white">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 80 }}>Booking ID</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">Property Name</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">Guest Name</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">Check-in Date & Time</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">Check-out Date & Time</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 100 }}>Status</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 100 }}>Payment</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 120 }}>Extras</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 130 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.bookingId}>
                      <td className="p-3 border-b border-gray-100 text-gray-900" style={{ fontWeight: 600 }}>{generateBookingId(b.bookingId)}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{getPropertyName(b.propertyId)}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{getGuestName(b.userId)}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{b.checkinDate} 14:00</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{b.checkoutDate} 11:00</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">
                        <span className="inline-block px-2 py-1.5 rounded-xl bg-gray-100 font-bold text-xs border border-gray-200">{b.isBookingStatus}</span>
                      </td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">
                        <span className="inline-block px-2 py-1.5 rounded-xl bg-gray-100 font-bold text-xs border border-gray-200">
                          {b.isPaymentStatus ? "PAID" : "PENDING"}
                        </span>
                      </td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{getExtras(b)}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900 flex gap-2 items-center">
                        <button
                          className={`px-2.5 py-1.5 rounded-lg border-0 font-bold text-[13px] cursor-pointer ${b.isBookingStatus === 'CLOSED' ? 'bg-gray-300 text-gray-500 border-none cursor-not-allowed opacity-50' :
                            canCloseBooking(b.checkoutDate) ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-none px-3 py-1.5 text-xs hover:from-red-700 hover:to-red-900 hover:-translate-y-px' : 'bg-gray-300 text-gray-500 border-none cursor-not-allowed opacity-50'
                            }`}
                          onClick={() => closeBooking(b.bookingId)}
                          disabled={b.isBookingStatus === 'CLOSED' || !canCloseBooking(b.checkoutDate)}
                        >
                          {b.isBookingStatus === 'CLOSED' ? 'Closed' : 'Close Booking'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="col-span-full text-center py-16 px-5 text-gray-500 text-base">
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complaints tab */}
      {activeTab === "complaints" && (
        <div style={{ paddingTop: 16 }}>
          <div className="mt-4 mx-10 rounded-lg overflow-hidden border border-gray-200 bg-white">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 50 }}>ID</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">User ID</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">Booking ID</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left">Description</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 100 }}>Type</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 120 }}>Status</th>
                  <th className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-3 font-bold text-left" style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((c) => (
                    <tr key={c.complaintId}>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{c.complaintId}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{c.userId}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{c.bookingId}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">{c.complaintDescription}</td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">
                        <span className="inline-block px-2 py-1.5 rounded-xl bg-gray-100 font-bold text-xs border border-gray-200">{c.complaintType}</span>
                      </td>
                      <td className="p-3 border-b border-gray-100 text-gray-900">
                        <span className="inline-block px-2 py-1.5 rounded-xl bg-gray-100 font-bold text-xs border border-gray-200">{c.complaintStatus}</span>
                      </td>
                      <td className="p-3 border-b border-gray-100 text-gray-900 flex gap-2 items-center">
                        <button className="px-2.5 py-1.5 rounded-lg border-0 font-bold text-[13px] cursor-pointer bg-transparent text-orange-600 border border-orange-200">View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="col-span-full text-center py-16 px-5 text-gray-500 text-base">
                      No complaints yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
