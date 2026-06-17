import { Navigate, Route, Routes } from "react-router-dom";
import AboutPsychologist from "../pages/AboutPsychologist";
import BookSession from "../pages/BookSession";
import LandingPage from "../pages/LandingPage";
import ForgotPassword from "../pages/ForgotPassword";
import Notifications from "../pages/Notifications";
import PsychologistDashboard from "../pages/PsychologistDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import DoctorLogin from "../pages/DoctorLogin";
import DoctorRegister from "../pages/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPsychologist />} />
      <Route path="/login" element={<Navigate to="/doctor-login" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Navigate to="/doctor-register" replace />} />
      <Route path="/doctor-register" element={<DoctorRegister />} />
      <Route path="/book-session" element={<BookSession />} />
      <Route path="/patient/book" element={<Navigate to="/book-session" replace />} />
      <Route path="/patient" element={<Navigate to="/book-session" replace />} />

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
          <ProtectedRoute role="doctor">
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
