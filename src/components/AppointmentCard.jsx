import { CalendarClock, Mail, Phone, Stethoscope, UserRound } from "lucide-react";
import { formatDateTime, getStatusMeta } from "../utils/helpers";

export default function AppointmentCard({ session, children }) {
  const status = getStatusMeta(session.status || "Pending");
  const patientName = session.patientName || session.patient?.name || "Patient";
  const patientEmail = session.patientEmail || session.patient?.email || "";
  const patientPhone = session.patientPhone || session.patient?.phone || "";

  return (
    <article className="mini-surface p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              <UserRound className="h-4 w-4" />
              {patientName}
            </span>

            <span className="inline-flex items-center gap-2 rounded-lg bg-calm/15 px-3 py-1 text-sm font-semibold text-calm">
              <Stethoscope className="h-4 w-4" />
              {session.doctorName || "Assigned doctor"}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ring-1 ${status.className}`}
            >
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          <h3 className="mt-4 text-lg font-bold text-ink dark:text-white">
            {session.specialization || "Therapy session"}
          </h3>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-calm" />
              {formatDateTime(session.appointmentDate)}
            </span>

            {session.sessionType ? (
              <span className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-lavender" />
                {session.sessionType}
              </span>
            ) : null}

            {session.reason ? (
              <p className="leading-6 text-slate-600 dark:text-slate-300">
                {session.reason}
              </p>
            ) : null}

            {patientEmail ? (
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-lavender" />
                {patientEmail}
              </span>
            ) : null}

            {patientPhone ? (
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-sage" />
                {patientPhone}
              </span>
            ) : null}

            {session.patientAge || session.patientGender ? (
              <span className="text-slate-500 dark:text-slate-400">
                {session.patientAge ? `${session.patientAge} years` : "Age not shared"}
                {session.patientGender ? `, ${session.patientGender}` : ""}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {children ? (
        <div className="mt-5 border-t border-slate-100 pt-5 dark:border-white/10">
          {children}
        </div>
      ) : null}
    </article>
  );
}
