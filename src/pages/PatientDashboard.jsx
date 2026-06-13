import {
  Bell,
  CalendarCheck,
  CalendarPlus,
  Clock,
  HeartPulse,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppointmentCard from "../components/AppointmentCard";
import Button from "../components/Button";
import NotificationItem from "../components/NotificationItem";
import SessionForm from "../components/SessionForm";
import Sidebar from "../components/Sidebar";

export default function PatientDashboard() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
  const currentUser = JSON.parse(
    localStorage.getItem("psychcare-user")
  );

  if (!currentUser) return;

  const savedAppointments =
    JSON.parse(
      localStorage.getItem(
        `appointments-${currentUser.email}`
      )
    ) || [];

  setSessions(savedAppointments);
}, []);
  const nextSession = useMemo(() => {
    return (
      sessions.find(
        (session) =>
          session.status === "Accepted" ||
          session.status === "Rescheduled"
      ) || sessions[0]
    );
  }, [sessions]);

 const addSession = (session) => {
  const currentUser = JSON.parse(
    localStorage.getItem("psychcare-user")
  );

  const updatedSessions = [session, ...sessions];

  setSessions(updatedSessions);

  localStorage.setItem(
    `appointments-${currentUser.email}`,
    JSON.stringify(updatedSessions)
  );
};

  const notifications = sessions
    .filter((session) => session.status !== "Pending")
    .slice(0, 5)
    .map((session) => ({
      id: session.id,
      message: `${session.sessionType} appointment is ${session.status}`,
      status: session.status,
      timestamp:
        session.preferredDateTime || new Date().toISOString(),
    }));

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <Sidebar role="patient" />

      <main className="lg:pl-72">
        <div className="app-container py-6 sm:py-8 lg:py-10">

          <section className="grid gap-4 md:grid-cols-3">
            <div className="surface p-5 md:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-calm">
                Patient Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-black text-ink dark:text-white">
                Your Therapy Plan
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
                Book appointments, track status updates and manage your
                therapy sessions from one place.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Upcoming",
                    value: sessions.filter(
                      (s) => s.status === "Accepted"
                    ).length,
                    icon: CalendarCheck,
                  },
                  {
                    label: "Pending",
                    value: sessions.filter(
                      (s) => s.status === "Pending"
                    ).length,
                    icon: Clock,
                  },
                  {
                    label: "Total Sessions",
                    value: sessions.length,
                    icon: HeartPulse,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="mini-surface p-4">
                    <Icon className="h-5 w-5 text-calm" />

                    <p className="mt-3 text-2xl font-black text-ink dark:text-white">
                      {value}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface p-5">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Next Session
              </p>

              <h2 className="mt-3 text-xl font-black text-ink dark:text-white">
                {nextSession?.sessionType || "No session yet"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {nextSession?.reason ||
                  "Book a therapy session to see details here."}
              </p>

              <Link to="/patient/book" className="mt-5 block">
                <Button icon={CalendarPlus} fullWidth>
                  Book New Session
                </Button>
              </Link>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">

  <div className="surface p-6">
    <h2 className="text-2xl font-black text-ink dark:text-white">
      Ready to continue your wellness journey?
    </h2>

    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
      Schedule a new therapy session and stay connected with your psychologist.
    </p>

    <div className="mt-6">
      <Link to="/patient/book">
        <Button icon={CalendarPlus}>
          Book New Session
        </Button>
      </Link>
    </div>

    <div className="mt-8 rounded-xl border border-slate-200 p-5 dark:border-slate-700">
      <h3 className="font-bold text-lg">
        Mental Wellness Tips
      </h3>

      <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
        <li>🧘 Practice mindfulness for 10 minutes daily.</li>
        <li>😴 Maintain a consistent sleep schedule.</li>
        <li>🚶 Take a short walk when feeling stressed.</li>
        <li>📔 Keep a gratitude journal.</li>
        <li>💧 Stay hydrated throughout the day.</li>
      </ul>
    </div>
  </div>

  <div className="grid content-start gap-6">

              <div className="surface p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-lavender">
                      Appointment Status
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-ink dark:text-white">
                      Recent Requests
                    </h2>
                  </div>

                  <Bell className="h-6 w-6 text-lavender" />
                </div>

                <div className="mt-5 grid gap-4">
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <AppointmentCard
                        key={session.id}
                        session={session}
                      />
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">
                      No appointments booked yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="surface p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-ink dark:text-white">
                    Notifications
                  </h2>
                </div>

                <div className="mt-4 grid gap-3">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">
                      No notifications available.
                    </p>
                  )}
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}