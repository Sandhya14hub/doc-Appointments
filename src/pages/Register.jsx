import { LockKeyhole, Mail, Phone, Stethoscope, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function DoctorRegister() {
  const navigate = useNavigate();
  const { registerDoctor } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await registerDoctor(form);

      alert("Doctor registration successful");

      navigate("/doctor-login", {
        state: {
          email: form.email,
        },
      });
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to register doctor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="app-container flex min-h-screen items-center justify-center pb-10 pt-24">
        <form
          onSubmit={handleSubmit}
          className="surface w-full max-w-3xl p-6 sm:p-8"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-lavender">
            Doctor Registration
          </p>

          <h1 className="mt-2 text-3xl font-black text-ink dark:text-white">
            Create your doctor account
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Register as a doctor to sign in, manage the dashboard, and review incoming appointments.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <InputField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              icon={UserRound}
              required
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              icon={Phone}
              required
            />

            <InputField
              label="Specialization"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              icon={Stethoscope}
              required
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              icon={LockKeyhole}
              required
            />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Doctor"}
            </Button>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already registered?{" "}
              <Link
                to="/doctor-login"
                className="font-bold text-calm hover:underline"
              >
                Doctor Login
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
