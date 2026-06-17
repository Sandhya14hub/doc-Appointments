import {
  CalendarClock,
  CheckCircle,
  ClipboardCheck,
  FileText,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppointmentCard from "../components/AppointmentCard";
import Button from "../components/Button";
import MoodTag from "../components/MoodTag";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function DoctorControls({ session, onUpdate }) {
  const [rejectReason, setRejectReason] = useState(
    session.privateNotes || ""
  );

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 rounded-lg bg-cloud/55 p-4 dark:bg-white/[0.05] md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Patient details
          </p>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-calm" />
              {session.patientName || session.patient?.name}
            </span>

            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-lavender" />
              {session.patientEmail || session.patient?.email}
            </span>

            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-sage" />
             {session.patientPhone || session.patient?.phone}
            </span>

            {session.patientAge || session.patientGender ? (
              <span className="text-slate-500 dark:text-slate-400">
                {session.patientAge ? `${session.patientAge} years` : "Age not shared"}
                {session.patientGender ? `, ${session.patientGender}` : ""}
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Appointment summary
          </p>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-calm" />
              {session.sessionType}
            </span>

            <p className="leading-6">
             {session.reason}
            </p>

            {session.therapyHistory ? (
              <p className="leading-6">
                <span className="font-semibold text-ink dark:text-white">
                  Therapy history:
                </span>{" "}
                {session.therapyHistory}
              </p>
            ) : null}

            {session.symptoms?.length ? (
              <p className="leading-6">
                <span className="font-semibold text-ink dark:text-white">
                  Symptoms:
                </span>{" "}
                {session.symptoms.join(", ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Reject reason
          </span>

          <input
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="focus-ring w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm text-ink dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
            placeholder="Optional internal note"
          />
        </label>

        <div className="grid grid-cols-3 gap-2 self-end">
          <Button
            variant="success"
            icon={CheckCircle}
            onClick={() =>
              onUpdate(session._id, {
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
              onUpdate(session._id, {
                status: "Rejected",
                privateNotes: rejectReason,
              })
            }
          >
            Reject
          </Button>

          <Button
            variant="outline"
            icon={ClipboardCheck}
            onClick={() =>
              onUpdate(session._id, {
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
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/doctor/all");
      setSessions(res.data.appointments || []);
    } catch (error) {
      console.log(error);
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "Total requests",
        value: sessions.length,
        icon: FileText,
      },
      {
        label: "Pending review",
        value: sessions.filter((session) => session.status === "Pending").length,
        icon: CalendarClock,
      },
      {
        label: "Accepted",
        value: sessions.filter((session) => session.status === "Accepted").length,
        icon: CheckCircle,
      },
    ],
    [sessions]
  );

  const updateSession = async (id, patch) => {
    try {
      await API.put(`/appointments/${id}/status`, patch);
      await fetchAppointments();
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          "Failed to update appointment"
      );
    }
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
                  key={session._id}
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
