import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Calendar, MapPin, TrendingUp, BookOpen, MessageSquare, Bell } from "lucide-react";
import { today, daysBetween, computeStatus } from "../utils/dateHelpers";
import { CONSTANTS } from "../constants";
import SFlogo from "../SFlogo.png";

const BASE_URL = `${CONSTANTS.API_BASE_URL}/api/client/`;

export default function ClientDashboard() {
  const navigate = useNavigate();

  // const [activeTab, setActiveTab] = useState("users");
  const [totalBookings, setTotalBookings] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [upcomingList, setUpcomingList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userSession = sessionStorage.getItem("currentUser");
    
    if (!userSession) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userSession);
      
      if (userData.role !== "client") {
        sessionStorage.removeItem("currentUser");
        navigate("/login");
        return;
      }

      setUser(userData);
      loadDashboardData(userData);
    } catch (err) {
      console.error("Error parsing user data:", err);
      sessionStorage.removeItem("currentUser");
      navigate("/login");
    }
  }, [navigate]);

  const loadDashboardData = async (userData) => {
    try {
      setLoading(true);

      const [propertiesRes, bookingsRes, usersRes] = await Promise.all([
        axios.get(`${BASE_URL}properties`),
        axios.get(`${BASE_URL}bookings`),
        axios.get(`${BASE_URL}users`),
      ]);

      const properties = propertiesRes.data;
      const bookings = bookingsRes.data;
      const users = usersRes.data;

      const currentBookings = bookings.filter(
        (b) => b.userId === userData.userId
      );

      const enriched = currentBookings
        .map((b) => {
          const property = properties.find(
            (p) => p.propertyId === b.propertyId
          );
          const host = users.find((u) => u.userId === b.hostId);

          const ci = b.checkInDate;
          const co = b.checkOutDate;

          if (!ci || !co) {
            console.warn(`Booking ${b.bookingId} missing dates`);
            return null;
          }

          const nights = Math.max(1, daysBetween(ci, co));
          const pricePerDay = b.pricePerDay || property?.pricePerDay || 0;
          const totalPrice =
            b.totalPrice ||
            nights * pricePerDay + (b.hasDeepClean ? CONSTANTS.CLEANING_FEE : 0);

          const addr =
            b.propertyAddress ||
            property?.address || { city: "", state: "", country: "" };
          const location = `${addr.city || ""}, ${addr.state || ""}, ${
            addr.country || ""
          }`.replace(/^,\s*|,\s*$/g, "");

          return {
            ...b,
            id: b.bookingId,
            checkIn: ci,
            checkOut: co,
            guests: b.numberOfGuest,
            name: b.propertyName || property?.propertyName || "Unknown Property",
            image: b.imageUrl || property?.imageUrl || "/no-image.jpg",
            location,
            pricePerDay,
            nights,
            totalPrice,
            status: computeStatus(ci, co),
            hostName: host?.username || "Host",
            hostMobile: host?.phone || "",
          };
        })
        .filter(Boolean);

      const upcoming = enriched.filter((b) => b.status === "UPCOMING");
      const current = enriched.filter((b) => b.status === "CURRENT");
      const completed = enriched.filter((b) => b.status === "PAST");

      setTotalBookings(enriched.length);
      setUpcomingCount(upcoming.length);
      setCurrentCount(current.length);
      setCompletedCount(completed.length);
      setUpcomingList(upcoming);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">
          Loading dashboard...
        </div>
      </div>
    );
  }

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
                Client
              </span>
            </div>

            <div className="flex gap-3">
              <button
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                onClick={() => navigate("/complaints")}
              >
                Support
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            <span className="text-blue-600">{user?.username || "Guest"}</span>!
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Upcoming"
            value={upcomingCount}
            icon={<Calendar className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Current Stays"
            value={currentCount}
            icon={<MapPin className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Completed"
            value={completedCount}
            icon={<TrendingUp className="w-6 h-6" />}
            color="gray"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <TabButton 
            className = "bg-blue-600 text-white shadow-md"
            onClick={() => navigate("/search")}
            icon={<Search className="w-4 h-4" />}
            label="Search"
          />
          <TabButton 
            className = "bg-blue-600 text-white shadow-md"
            onClick={() => navigate("/bookings")}
            icon={<BookOpen className="w-4 h-4" />}
            label="Bookings"
          />
          <TabButton 
            className = "bg-blue-600 text-white shadow-md"
            onClick={() => navigate("/complaints")}
            icon={<MessageSquare className="w-4 h-4" />}
            label="Complaints"
          />
          <TabButton 
            className = "bg-blue-600 text-white shadow-md"
            onClick={() => navigate("/notifications")}
            icon={<Bell className="w-4 h-4" />}
            label="Notifications"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionCard
            title="Search Properties"
            description="Find your perfect space from thousands of listings"
            icon={<Search className="w-8 h-8" />}
            onClick={() => navigate("/search")}
            gradient="from-blue-500 to-blue-600"
          />
          <ActionCard
            title="My Bookings"
            description="View and manage all your reservations"
            icon={<Calendar className="w-8 h-8" />}
            onClick={() => navigate("/bookings")}
            gradient="from-purple-500 to-purple-600"
          />
          <ActionCard
            title="Support"
            description="Get help with your bookings and properties"
            icon={<MapPin className="w-8 h-8" />}
            onClick={() => navigate("/complaints")}
            gradient="from-green-500 to-green-600"
          />
        </div>

        {/* Upcoming Bookings Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Upcoming Bookings
            </h3>
            {upcomingList.length > 0 && (
              <button
                onClick={() => navigate("/bookings")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
              >
                View All →
              </button>
            )}
          </div>

          {upcomingList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No Upcoming Bookings
              </h4>
              <p className="text-gray-600 mb-4">
                Start planning your next adventure!
              </p>
              <button
                onClick={() => navigate("/search")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Search Properties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingList.slice(0, 4).map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Action Card Component
function ActionCard({ title, description, icon, onClick, gradient }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all p-6"
    >
      <div
        className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${gradient} text-white mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
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

// Booking Card Component
function BookingCard({ booking, navigate }) {
  return (
    <div className="group bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden">
      <div className="flex gap-4 p-4">
        <img
          src={booking.image}
          alt={booking.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {booking.name}
          </h4>
          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {booking.location}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {booking.checkIn}
            </span>
            <span>→</span>
            <span>{booking.checkOut}</span>
          </div>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {booking.nights} nights • {booking.guests} guests
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex justify-between items-center">
        <span className="font-bold text-gray-900">₹{booking.totalPrice}</span>
        <button
          onClick={() => navigate("/booking-details", { state: { booking } })}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}