import { Bell, Clock3 } from "lucide-react";
import { formatDateTime, getStatusMeta } from "../utils/helpers";

export default function NotificationItem({ notification }) {
  const status = getStatusMeta(notification.status);

  return (
    <article className="mini-surface flex gap-4 p-4">
      <span className={`mt-1 h-3 w-3 rounded-full ${status.dot}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <p className="font-semibold leading-6 text-ink dark:text-white">{notification.message}</p>
          <span className={`w-fit rounded-lg px-3 py-1 text-xs font-bold ring-1 ${status.className}`}>
            {notification.status}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Clock3 className="h-4 w-4" />
          {formatDateTime(notification.timestamp)}
        </p>
      </div>
      <Bell className="hidden h-5 w-5 text-calm sm:block" aria-hidden="true" />
    </article>
  );
}
