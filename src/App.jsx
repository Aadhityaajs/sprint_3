import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import PaymentPage from "./Payments/Payments"
import LandingPage from "./LandingPage/LandingPage"
// import MapComponent from "../Map/LeafletMaps"
import LoginPage from "./LoginPage/login"
import SignUpPage from "./SignupPage/signup"
import HostDashboard from "./HostPages/HostDashboard"
import AdminDashboard from "./AdminPages/AdminDashboard"
import ClientDashboard from "./ClientPages/ClientDashboard"
import SearchProperties from "./ClientPages/SearchProperties"
import MyBookings from "./ClientPages/MyBookings"
import ComplaintsDashboard from "./ComplaintsPage/ComplaintsDashboard"
import NotFoundPage from "./ErrorPage/ErrorPage"
import ForgotPassword from "./ForgetPasswordPage/ForgetPassword"
import PropertyDetails from "./ClientPages/PropertyDetails"
import ProfilePage from "./ProfilePage/ProfilePage"
import NotificationsDashboard from "./NotificationsPage/NotificationsDashboard"
import BookingDetails from "./ClientPages/BookingDetails"

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={LandingPage}></Route>
          <Route path="/login" Component={LoginPage}></Route>
          <Route path="/signup" Component={SignUpPage}></Route>
          <Route path="/clientDashboard" Component={ClientDashboard}></Route>
          <Route path="/hostDashboard" Component={HostDashboard}></Route>
          <Route path="/adminDashboard" Component={AdminDashboard}></Route>
          <Route path="/search" Component={SearchProperties}></Route>
          <Route path="/bookings" Component={MyBookings}></Route>
          <Route path="/search" Component={SearchProperties}></Route>
          <Route path="/complaints" Component={ComplaintsDashboard}></Route>
          <Route path="/forgot-password" Component={ForgotPassword}></Route>
          <Route path="/property" Component={PropertyDetails}></Route>
          <Route path="/profile" Component={ProfilePage}></Route>
          <Route path="/booking-details" Component={BookingDetails}></Route>
          <Route path="*" Component={NotFoundPage} />
        </Routes>
      </Router>
      {/* <PaymentPage/> */}

      {/* <MapComponent/> */}
      {/* <NotificationsDashboard /> */}
    </>
  )
};
