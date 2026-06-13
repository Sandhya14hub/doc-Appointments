import { Award, BriefcaseBusiness, Mail, MapPin, Phone } from "lucide-react";
import { psychologist } from "../data/mockPsychologist";
import { quickStats } from "../utils/constants";
import MoodTag from "./MoodTag";

export default function PsychologistCard() {
  return (
    <article className="surface overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-gradient-to-br from-cloud to-white p-6 dark:from-white/10 dark:to-white/5">
          <img
            src="/assets/images/psychologist-portrait.svg"
            alt="Illustrated profile portrait of Dr.Parvathi Kashyap"
            className="mx-auto aspect-square w-full max-w-sm rounded-lg object-cover"
          />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <MoodTag icon={Award} color="lavender">
              Licensed clinician
            </MoodTag>
            <MoodTag icon={BriefcaseBusiness} color="sage">
              12+ years experience
            </MoodTag>
          </div>
          <h2 className="mt-5 text-2xl font-bold text-ink dark:text-white sm:text-3xl">{psychologist.name}</h2>
          <p className="mt-2 font-semibold text-calm">{psychologist.qualification}</p>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{psychologist.experience}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div key={stat.label} className="mini-surface p-4">
                <p className="text-2xl font-bold text-ink dark:text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-calm" /> {psychologist.contact.phone}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-lavender" /> {psychologist.contact.email}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sage" /> {psychologist.contact.address}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
