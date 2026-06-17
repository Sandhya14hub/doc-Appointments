const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },

    patientEmail: {
      type: String,
      required: true,
    },

    patientPhone: {
      type: String,
      required: true,
    },

    patientAge: {
      type: Number,
    },

    patientGender: {
      type: String,
    },

    doctorName: {
      type: String,
      required: true,
    },

    doctorId: {
      type: String,
      default: "",
    },

    specialization: {
      type: String,
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    sessionType: {
      type: String,
      default: "Video Call",
    },

    reason: {
      type: String,
      required: true,
    },

    anxietyLevel: {
      type: Number,
      default: 4,
    },

    symptoms: {
      type: [String],
      default: [],
    },

    therapyHistory: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Approved",
        "Rejected",
        "Rescheduled",
        "Completed",
      ],
      default: "Pending",
    },

    privateNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
