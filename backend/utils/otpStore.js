const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const otpStore = new Map();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function saveOtp(email, otp) {
  const key = normalizeEmail(email);

  otpStore.set(key, {
    otp: String(otp),
    attempts: 0,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

function getOtpRecord(email) {
  const key = normalizeEmail(email);
  const record = otpStore.get(key);

  if (!record) {
    return null;
  }

  if (record.expiresAt <= Date.now()) {
    otpStore.delete(key);
    return null;
  }

  return record;
}

function clearOtp(email) {
  otpStore.delete(normalizeEmail(email));
}

function verifyOtp(email, otp) {
  const key = normalizeEmail(email);
  const record = getOtpRecord(key);

  if (!record) {
    return {
      ok: false,
      reason: "expired",
    };
  }

  const incoming = String(otp || "").trim();

  if (record.otp !== incoming) {
    record.attempts += 1;

    if (record.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(key);
      return {
        ok: false,
        reason: "locked",
      };
    }

    return {
      ok: false,
      reason: "invalid",
    };
  }

  otpStore.delete(key);

  return {
    ok: true,
  };
}

module.exports = {
  clearOtp,
  saveOtp,
  verifyOtp,
};
