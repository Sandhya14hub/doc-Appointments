import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

function readStoredDoctorUser() {
  try {
    const saved = localStorage.getItem("psychcare-user");

    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved);
    return parsed?.role === "doctor" ? parsed : null;
  } catch {
    return null;
  }
}

function clearLegacyAuthState() {
  try {
    const saved = localStorage.getItem("psychcare-user");

    if (!saved) {
      return;
    }

    const parsed = JSON.parse(saved);

    if (parsed?.role && parsed.role !== "doctor") {
      localStorage.removeItem("psychcare-user");
      localStorage.removeItem("token");
    }
  } catch {
    localStorage.removeItem("psychcare-user");
    localStorage.removeItem("token");
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const savedDoctor = readStoredDoctorUser();

    return token && savedDoctor ? savedDoctor : null;
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("psychcare-theme") === "dark"
  );

  useEffect(() => {
    clearLegacyAuthState();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("psychcare-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (user?.role === "doctor") {
      localStorage.setItem("psychcare-user", JSON.stringify(user));
      return;
    }

    localStorage.removeItem("psychcare-user");
  }, [user]);

  const login = async ({ email, password }) => {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    const { token, user: loggedInUser } = response.data || {};

    if (!token || !loggedInUser) {
      throw new Error("Unable to sign in");
    }

    if (loggedInUser.role !== "doctor") {
      throw new Error("Doctor access only");
    }

    localStorage.setItem("token", token);
    setUser(loggedInUser);

    return loggedInUser;
  };

  const registerDoctor = async (form) => {
    const response = await API.post("/auth/register", {
      name: form.name || form.fullName || "",
      email: form.email,
      phone: form.phone,
      specialization: form.specialization,
      password: form.password,
    });

    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("psychcare-user");
    localStorage.removeItem("token");
  };

  const toggleDarkMode = () => {
    setDarkMode((current) => !current);
  };

  const value = useMemo(
    () => ({
      user,
      darkMode,
      login,
      registerDoctor,
      logout,
      toggleDarkMode,
    }),
    [user, darkMode]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
