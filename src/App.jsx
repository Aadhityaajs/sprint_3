import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PaymentPage from "./Payments/Payments";
import LandingPage from "./LandingPage/LandingPage";
import LoginPage from "./LoginPage/login";
import SignUpPage from "./SignupPage/signup";
import HostDashboard from "./HostPages/HostDashboard";
import AdminDashboard from "./AdminPages/AdminDashboard";
import ClientDashboard from "./ClientPages/ClientDashboard";
import SearchProperties from "./ClientPages/SearchProperties";
import MyBookings from "./ClientPages/MyBookings";
import ComplaintsDashboard from "./ComplaintsPage/ComplaintsDashboard";
import NotFoundPage from "./ErrorPage/ErrorPage";
import ForgotPassword from "./ForgetPasswordPage/ForgetPassword";
import PropertyDetails from "./ClientPages/PropertyDetails";
import ProfilePage from "./ProfilePage/ProfilePage";
import NotificationsDashboard from "./NotificationsPage/NotificationsDashboard";
import BookingDetails from "./ClientPages/BookingDetails";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/clientDashboard" element={<ClientDashboard />} />
        <Route path="/hostDashboard" element={<HostDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/search" element={<SearchProperties />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/complaints" element={<ComplaintsDashboard />} />
        <Route path="/notifications" element={<NotificationsDashboard />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/property" element={<PropertyDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}