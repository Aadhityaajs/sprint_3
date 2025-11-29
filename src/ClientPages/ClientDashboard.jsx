import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:8081/api/client/";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(d1, d2) {
  const one = new Date(d1);
  const two = new Date(d2);
  const diffMs = two - one;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function computeStatus(ci, co) {
  const t = today();
  if (!ci || !co) return "UNKNOWN";
  if (t < ci) return "UPCOMING";
  if (t > co) return "PAST";
  return "CURRENT";
}

export default function ClientDashboard() {
  const navigate = useNavigate();

  const [totalBookings, setTotalBookings] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [upcomingList, setUpcomingList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication and set user
  useEffect(() => {
    const u = sessionStorage.getItem("currentUser");
    if (u) {
      try {
        const json = JSON.parse(u);
        if (json.role === 'client') {
          setUser(json); // Set the user state here!
        } else {
          sessionStorage.removeItem("currentUser");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        sessionStorage.removeItem("currentUser");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setIsCheckingAuth(false);
  }, [navigate]);

  // Load dashboard data
  useEffect(() => {
    if (!user) return;
    
    async function loadData() {
      try {
        setLoading(true);
        
        const [propertiesRes, bookingsRes, usersRes] = await Promise.all([
          axios.get(`${BASE_URL}properties`),
          axios.get(`${BASE_URL}bookings`),
          axios.get(`${BASE_URL}users`)
        ]);

        const properties = propertiesRes.data;
        const bookings = bookingsRes.data;
        const users = usersRes.data;
        
        const currentBookings = bookings.filter(b => b.userId == user.userId);

        const enriched = currentBookings.map((b) => {
          const property = properties.find(p => p.propertyId === b.propertyId);
          const host = users.find(u => u.userId === b.hostId);

          const ci = b.checkInDate;
          const co = b.checkOutDate;
          const nights = ci && co ? Math.max(1, daysBetween(ci, co)) : b.nights || 0;
          const pricePerDay = b.pricePerDay || (property ? property.pricePerDay : 0);
          const totalPrice = b.totalPrice || nights * pricePerDay + (b.hasDeepClean ? 2000 : 0);

          const addr = b.propertyAddress || (property ? property.address : { city: "", state: "", country: "" });
          const location = `${addr.city || (property && property.address.city) || ""}, ${addr.state || (property && property.address.state) || ""}, ${addr.country || (property && property.address.country) || ""}`.replace(/^,\s*|,\s*$/g, "");

          return {
            ...b,
            id: b.bookingId,
            checkIn: ci,
            checkOut: co,
            guests: b.numberOfGuest,
            name: b.propertyName || (property && property.propertyName),
            image: b.imageUrl || (property && property.imageUrl) || "/no-image.jpg",
            location,
            pricePerDay,
            nights,
            totalPrice,
            status: computeStatus(ci, co),
            hostName: host ? host.username : "Host",
            hostMobile: host ? host.phone : "",
          };
        });

        const upcoming = enriched.filter(b => b.status === "UPCOMING");
        const current = enriched.filter(b => b.status === "CURRENT");
        const completed = enriched.filter(b => b.status === "PAST");

        setTotalBookings(enriched.length);
        setUpcomingCount(upcoming.length);
        setCurrentCount(current.length);
        setCompletedCount(completed.length);
        setUpcomingList(upcoming);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.response) {
          console.error("Response error:", err.response.data);
        } else if (err.request) {
          console.error("Request error:", err.request);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Checking authentication...</div>
      </div>
    );
  }

  if (loading && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-7">
      <div className="max-w-7xl mx-auto px-5 pb-10">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-2xl font-semibold mb-1">
              Welcome back, <span className="text-blue-600">{user?.username || "Guest"}</span>
            </h1>
            <p className="text-gray-500 text-sm">Here's what's happening with your bookings</p>
          </div>

          <div className="flex gap-2.5 items-center">
            <button className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded hover:bg-green-600 transition">
              Notification
            </button>
            <button 
              className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded hover:bg-purple-700 transition"
              onClick={() => navigate("/profile")}
            >
              My Profile
            </button>
            <button 
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* STATS ROW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
          <StatCard title="Total Bookings" value={totalBookings} />
          <StatCard title="Upcoming Bookings" value={upcomingCount} />
          <StatCard title="Current Bookings" value={currentCount} />
          <StatCard title="Completed Bookings" value={completedCount} />
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          {/* LEFT — UPCOMING BOOKINGS */}
          <main className="flex flex-col gap-4">
            <Panel
              title="Upcoming Bookings"
              actionText="View All →"
              onAction={() => navigate("/bookings")}
            >
              {upcomingList.length === 0 ? (
                <div className="text-center py-7 px-4 pb-9 text-gray-600">
                  <div className="text-gray-400 text-xs mb-2">NO BOOKINGS</div>
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Bookings</h3>
                  <p className="text-gray-500 text-sm mb-3">
                    You don't have any upcoming bookings yet.
                  </p>
                  <button
                    className="mt-3 bg-blue-600 text-white px-3.5 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
                    onClick={() => navigate("/search")}
                  >
                    Search Properties
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcomingList.slice(0, 3).map((b) => (
                    <div 
                      key={b.id} 
                      className="flex gap-3 p-2.5 rounded-md border border-gray-200 bg-blue-50/30"
                    >
                      <img
                        src={b.image}
                        alt={b.name}
                        className="w-24 h-20 rounded object-cover"
                      />
                      <div className="text-sm">
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-gray-600">{b.location}</div>
                        <div className="text-xs mt-1">
                          Stay: {b.checkIn} — {b.checkOut}
                        </div>
                        <div className="text-xs">
                          Total Paid: ₹{b.totalPrice}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs">
                          UPCOMING
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </main>

          {/* RIGHT — QUICK ACTIONS */}
          <aside className="flex flex-col gap-4">
            <Panel title="Quick Actions">
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                <ActionItem
                  label="Search Properties"
                  tag="SEARCH"
                  onClick={() => navigate("/search")}
                />
                <ActionItem
                  label="My Bookings"
                  tag="BOOKINGS"
                  onClick={() => navigate("/bookings")}
                />
                <ActionItem
                  label="My Complaints"
                  tag="COMPLAINTS"
                  onClick={() => navigate("/complaints")}
                />
              </ul>
            </Panel>
          </aside>
        </div>

        <footer className="mt-4 text-xs text-gray-400 text-right">
          Dashboard Page
        </footer>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-md p-3 border border-gray-200 shadow-sm">
      <div className="text-gray-500 text-xs uppercase tracking-wider">
        {title}
      </div>
      <div className="text-xl mt-2 font-bold">{value}</div>
    </div>
  );
}

function Panel({ title, children, actionText, onAction }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <div className="font-semibold">{title}</div>
        {actionText && (
          <button 
            className="text-xs text-blue-600 cursor-pointer hover:underline"
            onClick={onAction}
          >
            {actionText}
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ActionItem({ label, tag, onClick }) {
  return (
    <li className="flex justify-between items-center bg-gray-50 p-2.5 px-3 rounded border border-gray-100">
      <div>
        <div className="text-xs uppercase text-gray-600 mb-0.5">{tag}</div>
        <span className="text-sm">{label}</span>
      </div>
      <button 
        className="text-xs text-blue-600 cursor-pointer hover:underline"
        onClick={onClick}
      >
        Go
      </button>
    </li>
  );
}