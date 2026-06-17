import { CalendarPlus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import AppointmentCard from "../components/AppointmentCard";
import MoodTag from "../components/MoodTag";
import Navbar from "../components/Navbar";
import PsychologistCard from "../components/PsychologistCard";
import SessionForm from "../components/SessionForm";

export default function BookSession() {
  const [latestSession, setLatestSession] = useState(null);

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      <main className="pt-20">
        <section className="app-container section-pad">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
            <div className="grid gap-6">
              <section className="surface p-5 sm:p-7">
                <MoodTag icon={ShieldCheck} color="sage">
                  No login required
                </MoodTag>

                <h1 className="mt-4 text-3xl font-black text-ink dark:text-white sm:text-4xl">
                  Book a session directly
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
                  Patients can book a therapy session by entering their own contact details, the doctor they want to see,
                  and the preferred appointment time. No patient account or JWT is needed.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "Direct booking",
                      value: "Open to all patients",
                    },
                    {
                      label: "Doctor review",
                      value: "Starts as pending",
                    },
                    {
                      label: "Private details",
                      value: "Stored with the appointment",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="mini-surface p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-ink dark:text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <SessionForm onBooked={setLatestSession} />
            </div>

            <aside className="grid content-start gap-6">
              <div className="surface p-5 sm:p-6">
                <CalendarPlus className="h-7 w-7 text-calm" />
                <h2 className="mt-4 text-xl font-black text-ink dark:text-white">
                  What happens next
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Once the form is submitted, the appointment is saved with the patient details and becomes visible in the
                  doctor dashboard for review.
                </p>
              </div>

              <PsychologistCard />

              {latestSession ? (
                <AppointmentCard session={latestSession} />
              ) : (
                <div className="mini-surface p-5">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Your latest booking preview will appear here after submission.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
