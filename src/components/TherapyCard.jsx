import { ArrowRight } from "lucide-react";

export default function TherapyCard({ title, description, icon: Icon, color = "bg-calm/15 text-calm" }) {
  return (
    <article className="mini-surface group flex h-full flex-col p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold text-ink dark:text-white">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-calm">
        Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </article>
  );
}
