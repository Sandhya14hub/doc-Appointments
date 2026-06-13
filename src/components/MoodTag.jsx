import { cn } from "../utils/cn";

const colors = {
  blue: "bg-calm/12 text-sky-800 ring-calm/20 dark:bg-calm/15 dark:text-sky-100",
  lavender: "bg-lavender/15 text-violet-800 ring-lavender/20 dark:text-violet-100",
  sage: "bg-sage/16 text-emerald-800 ring-sage/25 dark:text-emerald-100",
  petal: "bg-petal/20 text-rose-800 ring-petal/25 dark:text-rose-100",
};

export default function MoodTag({ children, icon: Icon, color = "blue", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ring-1",
        colors[color],
        className,
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
