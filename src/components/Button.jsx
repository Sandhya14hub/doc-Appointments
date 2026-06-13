import { cn } from "../utils/cn";

const variants = {
  primary:
    "bg-ink text-white shadow-glow hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-night dark:hover:bg-cloud",
  secondary:
    "bg-calm/15 text-ink ring-1 ring-calm/20 hover:bg-calm/25 dark:bg-lavender/15 dark:text-white dark:ring-lavender/20",
  outline:
    "bg-white/70 text-ink ring-1 ring-slate-200 hover:bg-white dark:bg-white/5 dark:text-white dark:ring-white/10",
  ghost:
    "bg-transparent text-slate-600 hover:bg-calm/10 hover:text-ink dark:text-slate-200 dark:hover:bg-white/10",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

export default function Button({
  children,
  className,
  icon: Icon,
  iconRight: IconRight,
  variant = "primary",
  fullWidth = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      <span>{children}</span>
      {IconRight ? <IconRight className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
    </button>
  );
}
