import {
  Building2,
  CalendarClock,
  Mail,
  MessageCircle,
  MessagesSquare,
  Phone,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import API from "../services/api";
import { genderOptions, sessionTypes, symptomOptions } from "../utils/constants";
import { psychologist } from "../data/mockPsychologist";
import Button from "./Button";
import InputField from "./InputField";

const sessionIcons = {
  "Video Call": Video,
  "In-person": Building2,
  "Chat session": MessagesSquare,
};

function createInitialForm() {
  return {
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientAge: "",
    patientGender: genderOptions[0],
    doctorName: psychologist.name,
    doctorId: "",
    specialization: psychologist.title,
    preferredDateTime: "",
    sessionType: sessionTypes[0],
    reason: "",
    anxietyLevel: 4,
    symptoms: [],
    therapyHistory: "",
  };
}

export default function SessionForm({ compact = false, onBooked }) {
  const [form, setForm] = useState(createInitialForm);
  const [submitted, setSubmitted] = useState(false);

  const sessionHint = useMemo(() => {
    if (form.sessionType === "Video Call") {
      return "A secure link can be shared after the doctor accepts the request.";
    }

    if (form.sessionType === "In-person") {
      return "Clinic arrival details appear after the appointment is reviewed.";
    }

    return "Best for low-pressure check-ins and follow-up questions.";
  }, [form.sessionType]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const toggleSymptom = (symptom) => {
    setForm((current) => ({
      ...current,
      symptoms: current.symptoms.includes(symptom)
        ? current.symptoms.filter((item) => item !== symptom)
        : [...current.symptoms, symptom],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await API.post("/appointments", {
        patientName: form.patientName,
        patientEmail: form.patientEmail,
        patientPhone: form.patientPhone,
        patientAge: form.patientAge,
        patientGender: form.patientGender,
        doctorName: form.doctorName,
        doctorId: form.doctorId,
        specialization: form.specialization,
        appointmentDate: form.preferredDateTime,
        sessionType: form.sessionType,
        reason: form.reason,
        anxietyLevel: form.anxietyLevel,
        symptoms: form.symptoms,
        therapyHistory: form.therapyHistory,
      });

      const bookedAppointment = response.data?.appointment || {
        ...form,
        appointmentDate: form.preferredDateTime,
        status: "Pending",
      };

      setSubmitted(true);

      if (onBooked) {
        onBooked(bookedAppointment);
      }

      alert("Appointment booked successfully!");
      setForm(createInitialForm());
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(
        error?.response?.data?.message ||
          "Failed to book appointment"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="surface p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-calm">
            Book therapy session
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink dark:text-white">
            Share your details and choose a time
          </h2>
        </div>
        <span className="hidden rounded-lg bg-lavender/15 p-3 text-lavender sm:inline-flex">
          <MessageCircle className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <InputField
          label="Patient Name"
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          placeholder="Your name"
          icon={UserRound}
          required
        />

        <InputField
          label="Patient Email"
          name="patientEmail"
          type="email"
          value={form.patientEmail}
          onChange={handleChange}
          placeholder="you@example.com"
          icon={Mail}
          required
        />

        <InputField
          label="Patient Phone Number"
          name="patientPhone"
          type="tel"
          value={form.patientPhone}
          onChange={handleChange}
          placeholder="+91 90000 00000"
          icon={Phone}
          required
        />

        <InputField
          label="Patient Age"
          name="patientAge"
          type="number"
          min="12"
          value={form.patientAge}
          onChange={handleChange}
          placeholder="29"
        />

        <InputField
          label="Patient Gender"
          name="patientGender"
          value={form.patientGender}
          onChange={handleChange}
          options={genderOptions}
        />

        <InputField
          label="Doctor Name / ID"
          name="doctorName"
          value={form.doctorName}
          onChange={handleChange}
          icon={Stethoscope}
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
          label="Appointment Date & Time"
          name="preferredDateTime"
          type="datetime-local"
          value={form.preferredDateTime}
          onChange={handleChange}
          icon={CalendarClock}
          required
        />
      </div>

      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Session Type
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {sessionTypes.map((type) => {
            const Icon = sessionIcons[type];
            const active = form.sessionType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    sessionType: type,
                  }))
                }
                className={`focus-ring flex min-h-20 items-center gap-3 rounded-lg border px-4 text-left transition ${
                  active
                    ? "border-calm bg-calm/12 text-ink dark:border-lavender dark:bg-lavender/15 dark:text-white"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:bg-cloud/60 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0 text-calm" />
                <span className="text-sm font-bold">{type}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {sessionHint}
        </p>
      </div>

      <InputField
        className="mt-5"
        label="Reason for Visit"
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="Share what you would like support with"
        textarea
        required
      />

      {!compact ? (
        <>
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Current symptoms
            </p>
            <div className="flex flex-wrap gap-2">
              {symptomOptions.map((symptom) => {
                const active = form.symptoms.includes(symptom);

                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`focus-ring rounded-lg px-4 py-2 text-sm font-semibold ring-1 transition ${
                      active
                        ? "bg-ink text-white ring-ink dark:bg-white dark:text-night dark:ring-white"
                        : "bg-white/70 text-slate-600 ring-slate-200 hover:bg-cloud dark:bg-white/[0.05] dark:text-slate-300 dark:ring-white/10"
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="anxietyLevel"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Anxiety or stress level
              </label>
              <span className="rounded-lg bg-calm/12 px-3 py-1 text-xs font-bold text-calm">
                {form.anxietyLevel}/10
              </span>
            </div>
            <input
              id="anxietyLevel"
              name="anxietyLevel"
              type="range"
              min="1"
              max="10"
              value={form.anxietyLevel}
              onChange={handleChange}
              className="mt-4 w-full accent-calm"
            />
          </div>

          <InputField
            className="mt-5"
            label="Previous therapy history"
            name="therapyHistory"
            value={form.therapyHistory}
            onChange={handleChange}
            placeholder="Optional notes about prior support"
            textarea
          />
        </>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          fullWidth
          className="sm:w-auto"
        >
          Request session
        </Button>
        {submitted ? (
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Appointment booked successfully.
          </p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A concise summary helps the doctor prepare.
          </p>
        )}
      </div>
    </form>
  );
}
