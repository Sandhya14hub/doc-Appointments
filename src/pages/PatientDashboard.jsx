import { Navigate } from "react-router-dom";

export default function PatientDashboard() {
  return (
    <Navigate
      to="/book-session"
      replace
    />
  );
}
