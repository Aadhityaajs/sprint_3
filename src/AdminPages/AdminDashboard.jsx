// src/AdminPages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard.jsx";
import { useNavigate } from "react-router-dom";
import { Users, Home, Calendar, MessageSquare, Search, Filter, Bell } from "lucide-react";
import {
  getAllUsers,
  getAllProperties,
  getAllBookings,
  toggleUserBlock,
  deleteProperty as deletePropertyApi,
  closeBooking as closeBookingApi
} from "../Apis/AdminApi";
import SFlogo from "../SFlogo.png";

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

  const logout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  const generateBookingId = (id) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const numPart = String(id).padStart(2, '0');
    const seed = id * 7 + 13;
    let randomPart = '';
    for (let i = 0; i < 3; i++) {
      randomPart += chars.charAt((seed * (i + 1)) % chars.length);
    }
    return randomPart + numPart;
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.propertyId === propertyId);
    return property ? property.propertyName : 'Unknown Property';
  };

  const getGuestName = (userId) => {
    const user = users.find(u => u.userId === userId);
    return user ? user.username : 'Unknown Guest';
  };

  const getExtras = (booking) => {
    const extras = [];
    if (booking.hasExtraCot) extras.push('Extra Cot');
    if (booking.hasDeepClean) extras.push('Deep Clean');
    return extras.length > 0 ? extras.join(', ') : 'nil';
  };

  const canCloseBooking = (checkoutDate) => {
    const checkout = new Date(checkoutDate);
    const now = new Date();
    return checkout < now;
  };

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
      await closeBookingApi(bookingId);
      setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
      setStats(prev => ({
        ...prev,
        totalBookings: prev.totalBookings - 1
      }));
    } catch (error) {
      console.error('Error closing booking:', error);
      alert(error.message || 'Failed to close booking. Please try again.');
    }
  };

  const toggleBlock = async (userId) => {
    try {
      const user = users.find(u => u.userId === userId);
      if (!user) return;

      const newStatus = user.userStatus === "Active" ? "Blocked" : "Active";
      await toggleUserBlock(userId);

      setUsers(prev =>
        prev.map(u =>
          u.userId === userId ? { ...u, userStatus: newStatus } : u
        )
      );

      setStats(prev => ({
        ...prev,
        activeUsers: newStatus === "Active"
          ? prev.activeUsers + 1
          : prev.activeUsers - 1,
        blockedUsers: newStatus === "Blocked"
          ? prev.blockedUsers + 1
          : prev.blockedUsers - 1
      }));
    } catch (error) {
      console.error('Error toggling block:', error);
      alert(error.message || 'Failed to toggle user status. Please try again.');
    }
  };

  const deleteProperty = async (propertyId) => {
    const confirmed = window.confirm('Are you sure you want to delete this property?');
    if (!confirmed) return;

    try {
      await deletePropertyApi(propertyId);
      setProperties(prev =>
        prev.map(p =>
          p.propertyId === propertyId
            ? { ...p, propertyStatus: 'DELETED' }
            : p
        )
      );

      setStats(prev => ({
        ...prev,
        totalProperties: prev.totalProperties - 1,
        availableProperties: prev.availableProperties - 1,
      }));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert(error.message || 'Failed to delete property. Please try again.');
    }
  };

  const loadData = async (signal) => {
    try {
      const [usersRes, propertiesRes, bookingsRes] = await Promise.all([
        getAllUsers(signal),
        getAllProperties(signal),
        getAllBookings(signal)
      ]);

      const usersData = usersRes.success ? usersRes.data : { data: [] };
      const propertiesData = propertiesRes.success ? propertiesRes.data : { data: [] };
      const bookingsData = bookingsRes.success ? bookingsRes.data : { data: [] };

      console.log("Booking Response:", bookingsRes.success && bookingsRes.data);

      setUsers(usersData || []);
      setProperties(propertiesData || []);
      setBookings(bookingsData || []);

      const activeUsers = (usersData || []).filter(u => u.userStatus === "Active").length;
      const blockedUsers = (usersData || []).filter(u => u.userStatus === "Blocked").length;
      const availablePropsCount = (propertiesData || []).filter(p => p.propertyStatus === "AVAILABLE").length;
      const bookedPropsCount = (propertiesData || []).filter(p => p.propertyStatus === "BOOKED").length;
      const totalPropsCount = (propertiesData || []).filter(p => p.propertyStatus !== "DELETED").length;

      setStats({
        totalUsers: usersData ? usersData.length : 0,
        activeUsers,
        blockedUsers,
        totalProperties: totalPropsCount,
        bookedProperties: bookedPropsCount,
        availableProperties: availablePropsCount,
        totalBookings: bookingsRes.status && bookingsData ? bookingsData.length : 0,
        totalComplaints: 0,
      });
    } catch (e) {
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

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setSelectedFilter("ALL");
    setSearchTerm("");
  }, [activeTab]);

  const filteredUsers = users.filter((u) => {
    if (selectedFilter !== "ALL" && u.userStatus !== selectedFilter)
      return false;
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    return (
      (u.username ?? '').toLowerCase().includes(t) ||
      (u.userMail ?? '').toLowerCase().includes(t) ||
      (u.userPhone ?? '').toLowerCase().includes(t)
    );
  });

  const filteredProperties = properties.filter((p) => {
    if (selectedFilter !== "ALL" && p.propertyStatus !== selectedFilter)
      return false;
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    return (p.propertyName ?? '').toLowerCase().includes(t);
  });

  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    const pid = String(b.propertyId ?? '');
    const guestName = getGuestName(b.userId).toLowerCase();
    return pid.includes(t) || guestName.includes(t);
  });

  const filteredComplaints = complaints;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img src={SFlogo} alt="SF" className="w-13 h-13" />
              <h1 className="text-2xl font-bold text-gray-900">SpaceFinders</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Admin
              </span>
            </div>

            <button
              className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle={`${stats.activeUsers} Active • ${stats.blockedUsers} Blocked`}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Properties"
            value={stats.totalProperties}
            subtitle={`${stats.availableProperties} Available • ${stats.bookedProperties} Booked`}
            icon={<Home className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            title="Bookings"
            value={stats.totalBookings}
            icon={<Calendar className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Complaints"
            value={stats.totalComplaints}
            icon={<MessageSquare className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            icon={<Users className="w-4 h-4" />}
            label="Users"
          />
          <TabButton
            active={activeTab === "properties"}
            onClick={() => setActiveTab("properties")}
            icon={<Home className="w-4 h-4" />}
            label="Properties"
          />
          <TabButton
            active={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
            icon={<Calendar className="w-4 h-4" />}
            label="Bookings"
          />
          <TabButton
            onClick={() => navigate("/complaints")}
            icon={<MessageSquare className="w-4 h-4" />}
            label="Complaints"
          />
          <TabButton
            onClick={() => navigate("/notifications")}
            icon={<Bell className="w-4 h-4" />}
            label="Notifications"
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {(activeTab === "users" || activeTab === "properties") && (
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  {activeTab === "users" && (
                    <>
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </>
                  )}
                  {activeTab === "properties" && (
                    <>
                      <option value="AVAILABLE">Available</option>
                      <option value="BOOKED">Booked</option>
                      <option value="DELETED">Deleted</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.userId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{u.userId}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{u.userMail}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{u.userPhone}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.userStatus === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}>
                            {u.userStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleBlock(u.userId)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${u.userStatus === "Active"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                          >
                            {u.userStatus === "Active" ? "Block" : "Unblock"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === "properties" && (
            <div className="p-6">
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((p) => (
                    <PropertyCard
                      key={p.propertyId}
                      property={p}
                      onDelete={deleteProperty}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No properties found
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Check-in</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Check-out</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Extras</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => (
                      <tr key={b.bookingId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {generateBookingId(b.bookingId)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{getPropertyName(b.propertyId)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{getGuestName(b.userId)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{b.checkinDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{b.checkoutDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{getExtras(b)}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => closeBooking(b.bookingId)}
                            disabled={!canCloseBooking(b.checkoutDate)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${canCloseBooking(b.checkoutDate)
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${active
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default AdminDashboard;