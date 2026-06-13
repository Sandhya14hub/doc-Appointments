import { cn } from "../utils/cn";

export default function InputField({
  label,
  id,
  icon: Icon,
  options,
  textarea = false,
  className,
  hint,
  ...props
}) {
  const fieldId = id || props.name || label?.toLowerCase().replace(/\s+/g, "-");
  const sharedClassName = cn(
    "focus-ring w-full rounded-lg border border-slate-200 bg-white/90 px-4 py-3 text-sm text-ink placeholder:text-slate-400 transition dark:border-white/10 dark:bg-white/[0.06] dark:text-white",
    Icon && "pl-11",
  );

  return (
    <label className={cn("block", className)} htmlFor={fieldId}>
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <span className="relative block">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400"
            aria-hidden="true"
          />
        ) : null}
        {textarea ? (
          <textarea id={fieldId} rows={4} className={cn(sharedClassName, "resize-none")} {...props} />
        ) : options ? (
          <select id={fieldId} className={sharedClassName} {...props}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input id={fieldId} className={sharedClassName} {...props} />
        )}
      </span>
      {hint ? <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{hint}</span> : null}
    </label>
  );
}
