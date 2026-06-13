import { ArrowRight, Brain, Flower2, HandHeart, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import MoodTag from "../components/MoodTag";
import Navbar from "../components/Navbar";
import PsychologistCard from "../components/PsychologistCard";
import TherapyCard from "../components/TherapyCard";
import { psychologist } from "../data/mockPsychologist";

const approachIcons = [Brain, Flower2, ShieldCheck];

export default function AboutPsychologist() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <section className="app-container section-pad">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <MoodTag icon={HandHeart} color="lavender">
                About the psychologist
              </MoodTag>
              <h1 className="mt-5 text-4xl font-black leading-tight text-ink dark:text-white sm:text-5xl">
                Therapy that feels structured, kind, and human.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{psychologist.experience}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/patient/book">
                  <Button iconRight={ArrowRight}>Book Therapy Session</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </div>
            </div>
            <PsychologistCard />
          </div>
        </section>

        <section className="app-container section-pad pt-0">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-calm">Therapy approach</p>
            <h2 className="mt-2 text-3xl font-black text-ink dark:text-white">Methods used in session</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {psychologist.approach.map((item, index) => (
              <TherapyCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={approachIcons[index] || Brain}
                color={["bg-calm/15 text-calm", "bg-sage/20 text-emerald-600", "bg-lavender/20 text-violet-600"][index]}
              />
            ))}
          </div>
        </section>

        <section className="app-container section-pad pt-0">
          <div className="surface p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-lavender">Specialization</p>
                <h2 className="mt-2 text-3xl font-black text-ink dark:text-white">Support areas</h2>
                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                  Patients can understand the scope of care before booking, which helps reduce uncertainty at the first session.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {psychologist.specializations.map((specialization, index) => (
                  <MoodTag key={specialization} color={["blue", "lavender", "sage", "petal"][index % 4]}>
                    {specialization}
                  </MoodTag>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
