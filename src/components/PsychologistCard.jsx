import {
  Award,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { psychologist } from "../data/mockPsychologist";
import { quickStats } from "../utils/constants";
import MoodTag from "./MoodTag";
import { galleryImages } from "../data/galleryData";

export default function PsychologistCard() {
  return (
    <article className="surface overflow-hidden">
      {/* Profile Section */}
      <div className="grid gap-0 md:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-gradient-to-br from-cloud to-white p-6 dark:from-white/10 dark:to-white/5">
          <img
            src={psychologist.photo}
            alt={psychologist.name}
            className="mx-auto aspect-square w-full max-w-sm rounded-2xl object-cover shadow-lg"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <MoodTag icon={Award} color="lavender">
              Licensed Clinician
            </MoodTag>

            <MoodTag icon={BriefcaseBusiness} color="sage">
              12+ Years Experience
            </MoodTag>
          </div>

          <h2 className="mt-5 text-2xl font-bold text-ink dark:text-white sm:text-3xl">
            {psychologist.name}
          </h2>

          <p className="mt-2 font-semibold text-calm">
            {psychologist.qualification}
          </p>

          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
            {psychologist.experience}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div key={stat.label} className="mini-surface p-4">
                <p className="text-2xl font-bold text-ink dark:text-white">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-calm" />
              {psychologist.contact.phone}
            </span>

            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-lavender" />
              {psychologist.contact.email}
            </span>
<div className="flex flex-col gap-2">
  <span className="flex items-center gap-2">
    <MapPin className="h-4 w-4 text-sage" />
    {psychologist.contact.address}
  </span>

 <div className="border border-red-500 p-4">
  <p>TEST ADDRESS</p>

  <a
    href="https://maps.app.goo.gl/sigu4JRrjKVuVHaz5"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      background: "red",
      color: "white",
      padding: "10px",
      display: "inline-block",
      marginTop: "10px",
    }}
  >
    TEST MAP LINK
  </a>
</div>
</div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-lg font-bold text-ink dark:text-white">
              Specializations
            </h3>

            <div className="flex flex-wrap gap-2">
              {psychologist.specializations.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-calm/10 px-3 py-2 text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="border-t border-slate-200 p-6 sm:p-8 dark:border-white/10">
        <h3 className="text-3xl font-bold text-ink dark:text-white">
          Moments of Care & Healing
        </h3>

        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Supporting mental wellness through counseling, awareness, and
          compassionate care.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-white/[0.05]"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h4 className="text-lg font-bold text-ink dark:text-white">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}