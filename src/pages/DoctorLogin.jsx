import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await login({
        email: form.email,
        password: form.password,
      });

      if (result.role !== "doctor") {
        throw new Error("This is not a doctor account");
      }

      navigate("/doctor");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="app-container flex min-h-screen items-center justify-center pb-10 pt-24">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-white/70 bg-white/80 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.06] lg:grid-cols-[0.9fr_1.1fr]">
          
          <div className="hidden bg-[linear-gradient(135deg,#DCEFFB_0%,#F8F6FF_55%,#D8F0EA_100%)] p-8 dark:bg-[linear-gradient(135deg,#202A43_0%,#2B2444_55%,#18332F_100%)] lg:flex lg:flex-col lg:justify-end">
            <img
              src="/assets/images/psychologist-portrait.svg"
              alt="Doctor"
              className="mx-auto max-w-sm rounded-lg"
            />

            <h1 className="mt-8 text-3xl font-black text-ink dark:text-white">
              Doctor Portal
            </h1>

            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              Manage appointments, review patient requests, and track therapy sessions.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 lg:p-10"
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-calm">
              Secure Sign In
            </p>

            <h2 className="mt-2 text-3xl font-black text-ink dark:text-white">
              Doctor Login
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Sign in using your doctor credentials.
            </p>

            <div className="mt-6 grid gap-4">
              <InputField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                icon={Mail}
                required
              />

              <InputField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                icon={LockKeyhole}
                required
              />
            </div>

            <div className="mt-3 flex justify-end">
              <Link
                to="/forgot-password"
                state={{ email: form.email }}
                className="text-sm font-semibold text-calm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              className="mt-7"
            >
              Login as Doctor
            </Button>

            <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              Need a doctor account?{" "}
              <Link
                to="/doctor-register"
                className="font-bold text-calm hover:underline"
              >
                Register here
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
