import { Bell, CalendarDays, Home, LogIn, Menu, Moon, Sun, UserRound, X } from "lucide-react";import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import logo from "../assets/psychcare-logo.png";

const navLinks = [
  { to: "/", label: "Profile", icon: Home },
  { to: "/about", label: "Approach", icon: UserRound },
  { to: "/notifications", label: "Updates", icon: Bell },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleDarkMode, user } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-night/80">
      <nav className="app-container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-4">
  <div className="h-14 w-14 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
    <img
      src={logo}
      alt="PsychCare Logo"
      className="h-full w-full object-cover"
    />
  </div>

  <div>
    <span className="block text-xl font-bold text-ink dark:text-white">
      PsychCare
    </span>

    <span className="text-sm text-slate-500 dark:text-slate-400">
      Mental Wellness & Therapy
    </span>
  </div>
</Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-calm/15 text-ink dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:bg-calm/10 hover:text-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-cloud dark:bg-white/10 dark:text-slate-100 dark:ring-white/10"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/patient/book">
            <Button icon={CalendarDays}>Book session</Button>
          </Link>
          <Link to={user?.role === "doctor" ? "/doctor" : user?.role === "patient" ? "/patient" : "/login"}>
            <Button variant="outline" icon={LogIn}>
              {user ? "Dashboard" : "Login"}
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-lg bg-white text-ink ring-1 ring-slate-200 lg:hidden dark:bg-white/10 dark:text-white dark:ring-white/10"
          aria-label="Open navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="app-container pb-4 lg:hidden">
          <div className="surface p-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-calm/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cloud text-sm font-semibold text-ink dark:bg-white/10 dark:text-white"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                Theme
              </button>
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button fullWidth variant="outline" icon={LogIn}>
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
