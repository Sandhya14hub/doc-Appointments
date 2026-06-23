const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const express = require("express");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function isDoctor(req, res) {
  if (req.user?.role !== "doctor") {
    res.status(403).json({
      success: false,
      message: "Access denied"
    });

    return false;
  }

  return true;
}

function normalizeStatus(status) {
  if (status === "Approved") {
    return "Accepted";
  }

  return status;
}

function parseSymptoms(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function buildAppointmentPayload(body) {
  return {
    patientName: String(body.patientName || "").trim(),
    patientEmail: String(body.patientEmail || "").trim(),
    patientPhone: String(body.patientPhone || "").trim(),
    patientAge:
      body.patientAge === undefined || body.patientAge === ""
        ? undefined
        : Number(body.patientAge),
    patientGender: body.patientGender ? String(body.patientGender).trim() : "",
    doctorName: String(body.doctorName || "").trim(),
    doctorId: body.doctorId ? String(body.doctorId).trim() : "",
    specialization: String(body.specialization || "").trim(),
    appointmentDate: new Date(body.appointmentDate),
    sessionType: body.sessionType ? String(body.sessionType).trim() : "Video Call",
    reason: String(body.reason || "").trim(),
    anxietyLevel:
      body.anxietyLevel === undefined || body.anxietyLevel === ""
        ? 4
        : Number(body.anxietyLevel),
    symptoms: parseSymptoms(body.symptoms),
    therapyHistory: body.therapyHistory ? String(body.therapyHistory).trim() : "",
    status: "Pending",
  };
}

async function sendAllAppointments(res) {
  const appointments = await Appointment.find().sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    appointments,
  });
}

// =========================
// 1️⃣ BOOK APPOINTMENT
// =========================
router.post("/", async (req, res) => {
  try {
    const payload = buildAppointmentPayload(req.body);

    const requiredFields = [
      "patientName",
      "patientEmail",
      "patientPhone",
      "doctorName",
      "specialization",
      "appointmentDate",
      "reason",
    ];

    const missingField = requiredFields.find((field) => {
      if (field === "appointmentDate") {
        return Number.isNaN(payload.appointmentDate.getTime());
      }

      return !payload[field];
    });

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: "Patient name, email, phone, doctor, specialization, appointment date, and reason are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.patientEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid patient email address",
      });
    }

const appointment = await Appointment.create(payload);

const doctor = await User.findOne({
  role: "doctor",
});

console.log("Doctor found:", doctor?.email);

if (doctor) {
  try {
    console.log("Sending email to:", doctor.email);

    await sendEmail(
      doctor.email,
      "New Appointment Request",
      `
      <h2>New Appointment Request</h2>
      <p><b>Patient:</b> ${payload.patientName}</p>
      <p><b>Email:</b> ${payload.patientEmail}</p>
      <p><b>Phone:</b> ${payload.patientPhone}</p>
      <p><b>Date:</b> ${payload.appointmentDate}</p>
      <p><b>Session:</b> ${payload.sessionType}</p>
      <p><b>Reason:</b> ${payload.reason}</p>
      `
    );

    console.log("Doctor email sent successfully");
  } catch (err) {
    console.log("DOCTOR EMAIL ERROR:");
    console.log(err);
  }
}
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// 2️⃣ GET ALL APPOINTMENTS (DOCTOR ONLY)
// =========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!isDoctor(req, res)) {
      return;
    }

    const { search } = req.query;

    let filter = {};

    if (search && search.trim()) {
      filter.patientName = {
        $regex: search.trim(),
        $options: "i", // case-insensitive
      };
    }

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get("/doctor/all", authMiddleware, async (req, res) => {
  try {
    if (!isDoctor(req, res)) {
      return;
    }

    return sendAllAppointments(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// 3️⃣ GET SINGLE APPOINTMENT
// =========================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (!isDoctor(req, res)) {
      return;
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// 4️⃣ DELETE APPOINTMENT
// =========================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!isDoctor(req, res)) {
      return;
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// 5️⃣ UPDATE STATUS (DOCTOR ONLY)
// =========================
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (!isDoctor(req, res)) {
      return;
    }

    const { status, privateNotes } = req.body;
    const normalizedStatus = normalizeStatus(status);

    const allowedStatuses = [
      "Pending",
      "Accepted",
      "Approved",
      "Rejected",
      "Rescheduled",
      "Completed",
    ];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = normalizedStatus;

    if (typeof privateNotes === "string") {
      appointment.privateNotes = privateNotes.trim();
    }

    await appointment.save();
    await sendEmail(
  appointment.patientEmail,
  "Appointment Status Updated",
  `
    <h2>Appointment Update</h2>

    <p>Your appointment has been <b>${appointment.status}</b>.</p>

    <p><b>Doctor:</b> ${appointment.doctorName}</p>

    <p><b>Date:</b> ${appointment.appointmentDate}</p>

    ${
      appointment.privateNotes
        ? `<p><b>Notes:</b> ${appointment.privateNotes}</p>`
        : ""
    }
  `
);

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
