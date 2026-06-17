import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
import API from "../services/api";

const stepLabels = ["Request code", "Verify code", "Set password"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [stage, setStage] = useState("request");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [form, setForm] = useState({
    confirmPassword: "",
    email: location.state?.email || "",
    newPassword: "",
    otp: "",
  });

  const setField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetVerificationState = () => {
    setStage("request");
    setResetToken("");
    setField("otp", "");
    setField("newPassword", "");
    setField("confirmPassword", "");
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();

    const email = form.email.trim();

    if (!email) {
      setMessage({
        type: "error",
        text: "Enter the email linked to your doctor account.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await API.post("/auth/forgot-password/request", {
        email,
      });

      setStage("verify");
      setField("otp", "");
      setField("newPassword", "");
      setField("confirmPassword", "");
      setMessage({
        type: "success",
        text: "OTP sent. Check your inbox and enter the 6-digit code below.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "We could not send the OTP right now. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    const email = form.email.trim();
    const otp = form.otp.trim();

    if (!otp) {
      setMessage({
        type: "error",
        text: "Enter the 6-digit OTP from your email.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await API.post("/auth/forgot-password/verify", {
        email,
        otp,
      });

      setResetToken(response.data.resetToken);
      setStage("reset");
      setMessage({
        type: "success",
        text: "OTP verified. Set your new password now.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "The OTP could not be verified. Please request a fresh code.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!resetToken) {
      setMessage({
        type: "error",
        text: "Verify your OTP before setting a new password.",
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await API.post("/auth/forgot-password/reset", {
        newPassword: form.newPassword,
        resetToken,
      });

      setMessage({
        type: "success",
        text: "Password updated successfully. Redirecting to doctor login...",
      });

      setTimeout(() => {
        navigate("/doctor-login", {
          replace: true,
          state: {
            email: form.email.trim(),
          },
        });
      }, 1200);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "We could not reset the password right now. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex =
    stage === "request" ? 0 : stage === "verify" ? 1 : 2;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="app-container flex min-h-screen items-center justify-center pb-10 pt-24">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-white/70 bg-white/80 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.06] lg:grid-cols-[1fr_1.08fr]">
          <div className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#DCEFFB_0%,#F8F6FF_55%,#D8F0EA_100%)] p-8 dark:bg-[linear-gradient(135deg,#202A43_0%,#2B2444_55%,#18332F_100%)] lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-16 top-4 h-48 w-48 rounded-full bg-white/35 blur-3xl dark:bg-white/10" />
            <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-calm/20 blur-3xl" />

            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-calm shadow-lg shadow-calm/10 ring-1 ring-white/70">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <h1 className="mt-8 max-w-lg text-4xl font-black leading-tight text-ink dark:text-white">
                Recover access without losing your care history.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                We&apos;ll send a one-time code to the email saved in your PsychCare account,
                then let you set a fresh password in a few seconds.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  {
                    icon: Mail,
                    text: "Request the code from the email on file.",
                  },
                  {
                    icon: KeyRound,
                    text: "Verify the code before any password change happens.",
                  },
                  {
                    icon: LockKeyhole,
                    text: "Set a new password and sign back in right away.",
                  },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/10"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-calm/15 text-calm dark:bg-white/10 dark:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-10 rounded-2xl border border-white/70 bg-white/75 p-4 shadow-lg dark:border-white/10 dark:bg-night/60">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-calm">
                Quick note
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                OTPs expire in 10 minutes. If you leave this screen, just request a fresh code.
              </p>
            </div>
          </div>

          <form
            onSubmit={
              stage === "request"
                ? handleRequestOtp
                : stage === "verify"
                ? handleVerifyOtp
                : handleResetPassword
            }
            className="p-6 sm:p-8 lg:p-10"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-calm">
              {stepLabels.map((label, index) => (
                <div
                  key={label}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-[0.65rem] ${
                      index <= currentStepIndex
                        ? "border-calm bg-calm text-white"
                        : "border-slate-200 bg-white/80 text-slate-400 dark:border-white/10 dark:bg-white/5"
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={
                      index <= currentStepIndex
                        ? "text-ink dark:text-white"
                        : "text-slate-400"
                    }
                  >
                    {label}
                  </span>
                  {index < stepLabels.length - 1 ? (
                    <span className="mx-1 h-px w-6 bg-slate-200 dark:bg-white/10" />
                  ) : null}
                </div>
              ))}
            </div>

            <h2 className="mt-4 text-3xl font-black text-ink dark:text-white">
              Reset your doctor password
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {stage === "request" &&
                "Enter the email connected to your doctor profile, and we will send a verification code."}
              {stage === "verify" &&
                "Enter the OTP from your inbox to unlock the password reset step."}
              {stage === "reset" &&
                "Set a new password for the doctor account you just verified."}
            </p>

            {message.text ? (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : message.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                    : "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300"
                }`}
              >
                {message.text}
              </div>
            ) : null}

            <div className="mt-6 grid gap-4">
              <InputField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setField("email", event.target.value)
                }
                icon={Mail}
                disabled={stage !== "request"}
                required
                hint={
                  stage === "request"
                    ? "Use the email tied to your doctor account."
                    : "This email is locked until the reset is finished."
                }
              />

              {stage === "verify" ? (
                <InputField
                  label="OTP"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={form.otp}
                  onChange={(event) =>
                    setField("otp", event.target.value)
                  }
                  icon={KeyRound}
                  required={stage === "verify"}
                  hint="Enter the 6-digit code from the email we sent."
                />
              ) : null}

              {stage === "reset" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <CheckCircle2 className="mr-2 inline-block h-4 w-4 align-[-2px]" />
                  OTP verified for {form.email.trim()}. Set your new password below.
                </div>
              ) : null}

              {stage === "reset" ? (
                <>
                  <InputField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.newPassword}
                    onChange={(event) =>
                      setField("newPassword", event.target.value)
                    }
                    icon={LockKeyhole}
                    required
                  />

                  <InputField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setField(
                        "confirmPassword",
                        event.target.value
                      )
                    }
                    icon={LockKeyhole}
                    required
                  />
                </>
              ) : null}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {stage === "request" ? (
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              ) : null}

              {stage === "verify" ? (
                <>
                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    icon={RefreshCw}
                    onClick={() => {
                      resetVerificationState();
                      setMessage({ type: "", text: "" });
                    }}
                    disabled={loading}
                  >
                    Use another email
                  </Button>
                </>
              ) : null}

              {stage === "reset" ? (
                <>
                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    icon={ArrowLeft}
                    onClick={() => {
                      setStage("verify");
                      setField("newPassword", "");
                      setField("confirmPassword", "");
                      setMessage({ type: "", text: "" });
                    }}
                    disabled={loading}
                  >
                    Back to OTP
                  </Button>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
              <Link
                to="/doctor-login"
                className="font-semibold text-calm hover:underline"
              >
                Back to doctor login
              </Link>

              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-calm" />
                Protected recovery flow
              </span>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
