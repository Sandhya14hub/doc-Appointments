import { CalendarClock, Clock, FileText, MessageCircle, UserRound } from "lucide-react";
import { formatDateTime, getStatusMeta } from "../utils/helpers";
import MoodTag from "./MoodTag";

export default function AppointmentCard({ session, children }) {
  const status = getStatusMeta(session.status);
  const appointmentTime = session.rescheduledDateTime || session.preferredDateTime;

  return (
    <article className="mini-surface p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <MoodTag icon={UserRound} color="blue">
              {session.patientName}
            </MoodTag>
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ring-1 ${status.className}`}
            >
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold text-ink dark:text-white">{session.reason}</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-calm" /> {formatDateTime(appointmentTime)}
            </span>
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-lavender" /> {session.sessionType}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-sage" /> Anxiety level {session.anxietyLevel}/10
            </span>
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-petal" /> {session.therapyHistory}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {session.symptoms.map((symptom, index) => (
              <MoodTag key={symptom} color={["lavender", "blue", "sage", "petal"][index % 4]}>
                {symptom}
              </MoodTag>
            ))}
          </div>
        </div>
      </div>
      {children ? <div className="mt-5 border-t border-slate-100 pt-5 dark:border-white/10">{children}</div> : null}
    </article>
  );
}
