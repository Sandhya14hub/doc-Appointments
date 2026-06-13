import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { doctors } from "../data/doctors";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("psychcare-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("psychcare-theme") === "dark"
  );


  // ADD THIS BLOCK HERE
  
  useEffect(() => {
  

  const users =
    JSON.parse(localStorage.getItem("psychcare-users")) || [];

  

  const doctor = users.find(
    (u) => u.email === "abc@gmail.com"
  );

  if (!doctor) {
    users.push({
      id: "DOC-001",
      name: "Dr.Parvathi Kashyap",
      email: "abc@gmail.com",
      password: "123",
      phone: "9876543210",
      role: "doctor",
    });

    localStorage.setItem(
      "psychcare-users",
      JSON.stringify(users)
    );

    console.log("Doctor account created");
  }

  
}, []);
  // existing useEffects continue here...

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(
      "psychcare-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const register = (form) => {
    const users =
      JSON.parse(localStorage.getItem("psychcare-users")) || [];

    const existingUser = users.find(
      (u) => u.email === form.email
    );

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: `PAT-${Date.now()}`,
      name: form.fullName,
      age: form.age,
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      password: form.password,
      role: "patient",
    };

    users.push(newUser);

    localStorage.setItem(
      "psychcare-users",
      JSON.stringify(users)
    );

    return newUser;
  };

  const login = ({ email, password }) => {
  const users =
    JSON.parse(localStorage.getItem("psychcare-users")) || [];

  const foundUser = users.find(
    (u) =>
      u.email === email &&
      u.password === password
  );

  if (!foundUser) {
    return null;
  }

  setUser(foundUser);

  localStorage.setItem(
    "psychcare-user",
    JSON.stringify(foundUser)
  );

  return foundUser;
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("psychcare-user");
  };

  const toggleDarkMode = () => {
    setDarkMode((current) => !current);
  };

  const value = useMemo(
    () => ({
      user,
      darkMode,
      register,
      login,
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
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}