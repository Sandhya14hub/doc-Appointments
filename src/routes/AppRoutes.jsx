import { Navigate, Route, Routes } from "react-router-dom";
import AboutPsychologist from "../pages/AboutPsychologist";
import BookSession from "../pages/BookSession";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Notifications from "../pages/Notifications";
import PatientDashboard from "../pages/PatientDashboard";
import PsychologistDashboard from "../pages/PsychologistDashboard";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import DoctorLogin from "../pages/DoctorLogin";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPsychologist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
  path="/patient"
  element={
    <ProtectedRoute role="patient">
      <PatientDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/patient/book"
  element={
    <ProtectedRoute role="patient">
      <BookSession />
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor"
  element={
    <ProtectedRoute role="doctor">
      <PsychologistDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>
<Route
  path="/doctor-login"
  element={<DoctorLogin />}
/>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}