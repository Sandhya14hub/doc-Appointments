import { Bell, CalendarClock, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

export default function Notifications() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/appointments/doctor/all");

      const pendingAppointments =
        (res.data.appointments || []).filter(
          (appointment) => appointment.status === "Pending"
        );

      setNotifications(pendingAppointments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <Sidebar role={user?.role || "doctor"} />

      <main className="lg:pl-72">
        <div className="app-container py-6 sm:py-8 lg:py-10">
          <div className="surface p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-calm" />

              <h1 className="text-2xl font-black text-ink dark:text-white">
                Notifications
              </h1>
            </div>

            <div className="mt-6 grid gap-4">
              {notifications.length > 0 ? (
                notifications.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-lg border border-slate-200 p-4 dark:border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-calm" />

                      <h3 className="font-semibold">
                        New Appointment Request
                      </h3>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <UserRound className="h-4 w-4" />
                        {appointment.patientName}
                      </p>

                      <p>
                        Doctor: {appointment.doctorName}
                      </p>

                      <p>
                        Specialization: {appointment.specialization}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleString()}
                      </p>

                      <p>
                        Reason: {appointment.reason}
                      </p>

                      <p className="font-medium text-orange-500">
                        Status: {appointment.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">
                  No notifications available.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}