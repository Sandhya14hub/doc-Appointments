export const sessionTypes = ["Video Call", "In-person", "Chat session"];

export const genderOptions = ["Female", "Male", "Non-binary", "Prefer not to say"];

export const symptomOptions = [
  "Stress",
  "Anxiety",
  "Sleep issues",
  "Low mood",
  "Focus difficulty",
  "Relationship strain",
];

export const statusStyles = {
  Pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-200",
    dot: "bg-amber-400",
  },
  Accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200",
    dot: "bg-emerald-400",
  },
  Approved: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200",
    dot: "bg-emerald-400",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-200",
    dot: "bg-rose-400",
  },
  Rescheduled: {
    label: "Rescheduled",
    className: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-200",
    dot: "bg-sky-400",
  },
  Completed: {
    label: "Completed",
    className: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-white/10 dark:text-slate-200",
    dot: "bg-slate-400",
  },
};

export const quickStats = [
  { label: "Years helping clients", value: "12+" },
  { label: "Sessions completed", value: "4.8k" },
  { label: "Care rating", value: "4.9/5" },
];
