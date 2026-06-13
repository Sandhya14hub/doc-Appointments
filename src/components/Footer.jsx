import { Mail, MapPin, Phone } from "lucide-react";
import { psychologist } from "../data/mockPsychologist";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 py-8 dark:border-white/10 dark:bg-night/70">
      <div className="app-container grid gap-6 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-semibold text-ink dark:text-white">PsychCare</p>
          <p className="mt-1 max-w-xl">
            Gentle appointment care for therapy sessions, patient updates, and psychologist review.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 md:text-right">
          <span className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-calm" /> {psychologist.contact.phone}
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4 text-lavender" /> {psychologist.contact.email}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sage" /> Bengaluru
          </span>
        </div>
      </div>
    </footer>
  );
}
