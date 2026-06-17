const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const { randomInt } = require("crypto");
const User = require("../models/user");
const { clearOtp, saveOtp, verifyOtp } = require("../utils/otpStore");
const { sendMail } = require("../utils/smtpMailer");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "").trim();
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      password
    } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name || !email || !phone || !specialization || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone number, specialization, and password are required"
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address"
      });
    }

    const existingUser = await User.findOne({
      email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i")
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      phone,
      specialization,
      password: hashedPassword,
      role: "doctor"
    });

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});


// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i"),
      role: "doctor"
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor email or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        specialization: user.specialization,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

router.post("/forgot-password/request", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address"
      });
    }

    const otp = String(randomInt(0, 1000000)).padStart(6, "0");

    const user = await User.findOne({
      email: new RegExp(`^${escapeRegex(email)}$`, "i"),
      role: "doctor"
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Doctor account not found"
      });
    }

    saveOtp(email, otp);

    try {
      await sendMail({
        subject: "PsychCare password reset OTP",
        text: [
          "PsychCare password reset",
          "",
          `Your one-time verification code is: ${otp}`,
          "This code expires in 10 minutes.",
          "If you did not request this reset, you can ignore this email.",
        ].join("\n"),
        to: email,
      });
    } catch (mailError) {
      clearOtp(email);
      throw mailError;
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to your email"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/forgot-password/verify", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = normalizeEmail(req.body.otp);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const otpResult = verifyOtp(email, otp);

    if (!otpResult.ok) {
      return res.status(400).json({
        success: false,
        message:
          otpResult.reason === "locked"
            ? "Too many invalid attempts. Request a new OTP."
            : "Invalid or expired OTP"
      });
    }

    const resetToken = jwt.sign(
      {
        email,
        purpose: "password-reset"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m"
      }
    );

    res.status(200).json({
      success: true,
      message: "OTP verified",
      resetToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/forgot-password/reset", async (req, res) => {
  try {
    const {
      newPassword,
      resetToken
    } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required"
      });
    }

    const decoded = jwt.verify(
      resetToken,
      process.env.JWT_SECRET
    );

    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset session"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const emailQuery = new RegExp(
      `^${escapeRegex(decoded.email)}$`,
      "i"
    );

    const user = await User.findOne({
      email: emailQuery,
      role: "doctor"
    });

    if (user) {
      user.password = hashedPassword;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    const isJwtError =
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError";

    res.status(isJwtError ? 400 : 500).json({
      success: false,
      message: isJwtError
        ? "Reset session expired or invalid. Request a new OTP."
        : error.message
    });
  }
});

module.exports = router;
