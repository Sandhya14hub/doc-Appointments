import {
  CalendarClock,
  CheckCircle,
  ClipboardCheck,
  FileText,
  Mail,
  Phone,
  RefreshCcw,
  UserRound,
  XCircle,
} from "lucide-react";
import { useMemo, useState,useEffect } from "react";
import AppointmentCard from "../components/AppointmentCard";
import Button from "../components/Button";
import MoodTag from "../components/MoodTag";
import Sidebar from "../components/Sidebar";


function DoctorControls({ session, onUpdate }) {
  const [rejectReason, setRejectReason] = useState(
    session.rejectionReason || ""
  );
  const [rescheduleAt, setRescheduleAt] = useState("");

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 rounded-lg bg-cloud/55 p-4 dark:bg-white/[0.05] md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Patient details
          </p>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-calm" />
              {session.age} years, {session.gender}
            </span>

            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-lavender" />
              {session.email}
            </span>

            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-sage" />
              {session.phone}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Mental health summary
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Sleep: {session.sleep}. Therapy history: {session.therapyHistory}.
          </p>
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Private preparation notes
        </span>

        <textarea
          value={session.privateNotes || ""}
          onChange={(e) =>
            onUpdate(session.id, {
              privateNotes: e.target.value,
            })
          }
          rows={3}
          className="focus-ring w-full resize-none rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm text-ink dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
        />
      </label>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Reject reason
          </span>

          <input
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="focus-ring w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm text-ink dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
            placeholder="Optional reason"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            New time
          </span>

          <input
            type="datetime-local"
            value={rescheduleAt}
            onChange={(e) => setRescheduleAt(e.target.value)}
            className="focus-ring w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm text-ink dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
          />
        </label>

        <div className="grid grid-cols-2 gap-2 self-end sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Button
            variant="success"
            icon={CheckCircle}
            onClick={() =>
              onUpdate(session.id, {
                status: "Accepted",
              })
            }
          >
            Accept
          </Button>

          <Button
            variant="danger"
            icon={XCircle}
            onClick={() =>
              onUpdate(session.id, {
                status: "Rejected",
                rejectionReason: rejectReason || "Not available",
              })
            }
          >
            Reject
          </Button>

          <Button
            variant="secondary"
            icon={RefreshCcw}
            onClick={() =>
              onUpdate(session.id, {
                status: "Rescheduled",
                rescheduledDateTime:
                  rescheduleAt || new Date().toISOString(),
              })
            }
          >
            Reschedule
          </Button>

          <Button
            variant="outline"
            icon={ClipboardCheck}
            onClick={() =>
              onUpdate(session.id, {
                status: "Completed",
              })
            }
          >
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PsychologistDashboard() {
  const [sessions, setSessions] = useState(() => {
  const allSessions = [];

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("appointments-")) {
      const data =
        JSON.parse(localStorage.getItem(key)) || [];

      allSessions.push(...data);
    }
  });

  return allSessions;
});
useEffect(() => {
  const allSessions = [];

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("appointments-")) {
      const data =
        JSON.parse(localStorage.getItem(key)) || [];

      allSessions.push(...data);
    }
  });

  setSessions(allSessions);
}, []);
  const stats = useMemo(
    () => [
      {
        label: "Total requests",
        value: sessions.length,
        icon: FileText,
      },
      {
        label: "Pending review",
        value: sessions.filter(
          (session) => session.status === "Pending"
        ).length,
        icon: CalendarClock,
      },
      {
        label: "Accepted",
        value: sessions.filter(
          (session) => session.status === "Accepted"
        ).length,
        icon: CheckCircle,
      },
    ],
    [sessions]
  );

 const updateSession = (id, patch) => {
  setSessions((current) => {
    const updated = current.map((session) => {
      if (session.id !== id) return session;

      const updatedSession = {
        ...session,
        ...patch,
      };

      // Save back to the correct patient's storage
      const storageKey = `appointments-${session.email}`;

      const patientAppointments =
        JSON.parse(localStorage.getItem(storageKey)) || [];

      const updatedPatientAppointments =
        patientAppointments.map((appt) =>
          appt.id === id ? updatedSession : appt
        );

      localStorage.setItem(
        storageKey,
        JSON.stringify(updatedPatientAppointments)
      );

      return updatedSession;
    });

    return updated;
  });
};

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <Sidebar role="doctor" />

      <main className="lg:pl-72">
        <div className="app-container py-6 sm:py-8 lg:py-10">
          <section className="surface p-5 sm:p-7">
            <MoodTag icon={ClipboardCheck} color="lavender">
              Psychologist dashboard
            </MoodTag>

            <div className="mt-4">
              <h1 className="text-3xl font-black text-ink dark:text-white">
                Therapy Request Control Panel
              </h1>

              <p className="mt-3 text-slate-600 dark:text-slate-300">
                Review patient requests and manage appointments.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {stats.map(({ label, value, icon: Icon }) => (
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
            
          </section>

          <section className="mt-6 grid gap-4">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <AppointmentCard
                  key={session.id}
                  session={session}
                >
                  <DoctorControls
                    session={session}
                    onUpdate={updateSession}
                  />
                </AppointmentCard>
              ))
            ) : (
              <div className="surface p-6 text-center">
                <p className="text-slate-500">
                  No appointments received yet.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}