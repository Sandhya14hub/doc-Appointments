import { Bell } from "lucide-react";
import NotificationItem from "../components/NotificationItem";
import Sidebar from "../components/Sidebar";

export default function Notifications() {
  const appointments =
    JSON.parse(localStorage.getItem("appointments")) || [];

  const notifications = appointments.map((appointment) => ({
    id: appointment.id,
    message: `${appointment.patientName}'s appointment is ${appointment.status}`,
    status: appointment.status,
    timestamp:
      appointment.preferredDateTime ||
      new Date().toISOString(),
  }));

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <Sidebar role="patient" />

      <main className="lg:pl-72">
        <div className="app-container py-6 sm:py-8 lg:py-10">
          <div className="surface p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-calm" />
              <h1 className="text-2xl font-black text-ink dark:text-white">
                Notifications
              </h1>
            </div>

            <div className="mt-6 grid gap-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
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