import { CalendarPlus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import AppointmentCard from "../components/AppointmentCard";
import MoodTag from "../components/MoodTag";
import SessionForm from "../components/SessionForm";
import Sidebar from "../components/Sidebar";

export default function BookSession() {
  const [latestSession, setLatestSession] = useState(null);

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <Sidebar role="patient" />
      <main className="lg:pl-72">
        <div className="app-container py-6 sm:py-8 lg:py-10">
          <section className="mb-6 surface p-5 sm:p-7">
            <MoodTag icon={ShieldCheck} color="sage">
              Patient booking
            </MoodTag>
            <h1 className="mt-4 text-3xl font-black text-ink dark:text-white">Request a therapy session</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
              Share enough context for the psychologist to prepare, then track the request as Pending, Accepted,
              Rejected, or Rescheduled.
            </p>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
            <SessionForm onBooked={setLatestSession} />
            <aside className="grid content-start gap-6">
              <div className="surface p-5 sm:p-6">
                <CalendarPlus className="h-7 w-7 text-calm" />
                <h2 className="mt-4 text-xl font-black text-ink dark:text-white">What happens next</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Your summary helps the psychologist prepare with context about symptoms, session type, therapy history, and
                  preferred timing.
                </p>
              </div>
              {latestSession ? (
                <AppointmentCard session={latestSession} />
              ) : (
                <div className="mini-surface p-5">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Your new pending request preview will appear here after submitting the form.
                  </p>
                </div>
              )}
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}
