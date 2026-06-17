import {
  ArrowRight,
  Brain,
  CalendarDays,
  HeartPulse,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Wind,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import MoodTag from "../components/MoodTag";
import Navbar from "../components/Navbar";
import PsychologistCard from "../components/PsychologistCard";
import TherapyCard from "../components/TherapyCard";
import { psychologist } from "../data/mockPsychologist";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const therapyCards = [
  {
    title: "Anxiety support",
    description: "Slow, practical work around worry cycles, panic cues, and uncertainty tolerance.",
    icon: Brain,
    color: "bg-calm/15 text-calm",
  },
  {
    title: "Depression care",
    description: "Gentle activation planning, mood tracking, and self-compassion practices.",
    icon: HeartPulse,
    color: "bg-petal/25 text-rose-500",
  },
  {
    title: "Stress management",
    description: "Boundary setting, nervous-system regulation, and daily decompression routines.",
    icon: Wind,
    color: "bg-sage/20 text-emerald-600",
  },
  {
    title: "Relationships",
    description: "Support for communication patterns, conflict repair, and emotional needs.",
    icon: Users,
    color: "bg-lavender/20 text-violet-600",
  },
  {
    title: "ADHD support",
    description: "Realistic structure for focus, transitions, motivation, and overwhelm.",
    icon: Sparkles,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "PTSD support",
    description: "Trauma-informed pacing focused on safety, grounding, and consent.",
    icon: ShieldCheck,
    color: "bg-sky-100 text-sky-600",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
const { user } = useAuth();
  return (
    <div className="min-h-screen text-ink dark:text-white">
      <Navbar />
      <main>
        <section className="relative flex min-h-[88vh] items-end overflow-hidden pt-20">
          <img
            src="/assets/images/therapy-room.svg"
            alt="Calm therapy room illustration"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/68 to-white/28 dark:from-night dark:via-night/78 dark:to-night/45" />
          <div className="app-container relative pb-10 sm:pb-14 lg:pb-16">
            <div className="max-w-3xl">
              <MoodTag icon={ShieldCheck} color="sage">
                Evidence-based, compassionate therapy
              </MoodTag>
              <h1 className="mt-5 text-4xl font-black leading-tight text-ink dark:text-white sm:text-5xl lg:text-7xl">
                {psychologist.name}
              </h1>
              <p className="mt-4 text-lg font-semibold text-calm sm:text-xl">{psychologist.qualification}</p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-200 sm:text-lg">
                {psychologist.bio}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
  <Button
    icon={CalendarDays}
    iconRight={ArrowRight}
    onClick={() =>
      navigate("/book-session")
    }
  >
    Book Therapy Session
  </Button>

  {user ? (
    <Button
      variant="outline"
      onClick={() =>
        navigate("/doctor")
      }
    >
      Dashboard
    </Button>
  ) : (
    <Link to="/doctor-login">
      <Button variant="outline">
        Doctor Login
      </Button>
    </Link>
  )}
</div>
            </div>
          </div>
        </section>

        <section className="section-pad app-container">
          <PsychologistCard />
        </section>

        <section className="app-container section-pad pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-calm">Specialization areas</p>
              <h2 className="mt-2 text-3xl font-black text-ink dark:text-white">Care for the moments that feel heavy</h2>
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-bold text-calm">
              Explore therapy approach <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {therapyCards.map((card) => (
              <TherapyCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="app-container section-pad pt-0">
          <div className="surface p-5 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-lavender">Achievements</p>
                <h2 className="mt-2 text-3xl font-black text-ink dark:text-white">Certifications and training</h2>
                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                  Review clinical training, therapy certifications, and practice credibility before choosing a session.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {psychologist.achievements.map((item) => (
                  <article key={item.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
                    <img src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-ink dark:text-white">{item.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.issuer}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="app-container section-pad pt-0">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="surface p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sage">Contact</p>
              <h2 className="mt-2 text-3xl font-black text-ink dark:text-white">Reach the clinic</h2>
              <div className="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                <span className="flex items-center gap-3 rounded-lg bg-cloud/70 p-4 dark:bg-white/[0.05]">
                  <Phone className="h-5 w-5 text-calm" /> {psychologist.contact.phone}
                </span>
                <span className="flex items-center gap-3 rounded-lg bg-cloud/70 p-4 dark:bg-white/[0.05]">
                  <Mail className="h-5 w-5 text-lavender" /> {psychologist.contact.email}
                </span>
                <span className="flex items-center gap-3 rounded-lg bg-cloud/70 p-4 dark:bg-white/[0.05]">
                  <Linkedin className="h-5 w-5 text-calm" /> {psychologist.contact.linkedin}
                </span>
                <span className="flex items-center gap-3 rounded-lg bg-cloud/70 p-4 dark:bg-white/[0.05]">
                  <Instagram className="h-5 w-5 text-petal" /> {psychologist.contact.instagram}
                </span>
              </div>
            </div>
            <div className="surface min-h-72 overflow-hidden">
              <div className="flex h-full min-h-72 flex-col justify-end bg-[linear-gradient(135deg,#DCEFFB_0%,#F8F6FF_55%,#D8F0EA_100%)] p-6 dark:bg-[linear-gradient(135deg,#222B44_0%,#2B2544_55%,#17332F_100%)]">
                <MapPin className="mb-4 h-9 w-9 text-calm" />
                <p className="text-lg font-bold text-ink dark:text-white">{psychologist.location}</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">{psychologist.contact.address}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
