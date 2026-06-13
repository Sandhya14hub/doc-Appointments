import {
  Bell,
  CalendarPlus,
  ClipboardCheck,
  Home,
  LogOut,
  Moon,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navByRole = {
  doctor: [
    { to: "/doctor", label: "Requests", icon: ClipboardCheck },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/", label: "Public page", icon: Home },
  ],
  patient: [
    { to: "/patient", label: "Home", icon: Home },
    { to: "/patient/book", label: "Book", icon: CalendarPlus },
    { to: "/notifications", label: "Updates", icon: Bell },
  ],
};

export default function Sidebar({ role = "patient" }) {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const items = navByRole[role] || navByRole.patient;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-72 border-r border-slate-200/70 bg-white/85 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-night/85 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-calm/15 text-calm">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink dark:text-white">PsychCare</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{role === "doctor" ? "Doctor panel" : "Patient care"}</p>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-cloud/70 p-4 dark:bg-white/[0.06]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Signed in</p>
            <p className="mt-2 font-bold text-ink dark:text-white">{user?.name || "Guest"}</p>
            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{user?.email || "guest profile"}</p>
          </div>

          <nav className="mt-8 grid gap-2">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-ink text-white shadow-glow dark:bg-white dark:text-night"
                      : "text-slate-600 hover:bg-calm/10 hover:text-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto grid gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="focus-ring flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-calm/10 hover:text-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Calming theme
            </button>
            <button
              type="button"
              className="focus-ring flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-rose-400/10 dark:hover:text-rose-200"
            >
              <Settings className="h-4 w-4" />
              Preferences
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="focus-ring flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-rose-400/10 dark:hover:text-rose-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-50 rounded-lg border border-white/80 bg-white/90 px-2 py-2 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-night/90 lg:hidden">
        <div className="grid grid-cols-3 gap-1">
          {items.slice(0, 3).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? "bg-ink text-white dark:bg-white dark:text-night"
                    : "text-slate-500 hover:bg-calm/10 dark:text-slate-300"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
