import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { genderOptions } from "../utils/constants";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: genderOptions[0],
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
  event.preventDefault();

  try {
    register(form);

    alert("Registration Successful");

    navigate("/login");
  } catch (error) {
    alert(error.message);
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
            Patient Registration
          </p>

          <h1 className="mt-2 text-3xl font-black text-ink dark:text-white">
            Create your care profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Create a profile to schedule appointments and access your dashboard.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <InputField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              icon={UserRound}
              required
            />

            <InputField
              label="Age"
              name="age"
              type="number"
              min="12"
              value={form.age}
              onChange={handleChange}
              required
            />

            <InputField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={genderOptions}
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
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              icon={LockKeyhole}
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
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit">
              Register Patient
            </Button>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-bold text-calm hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}