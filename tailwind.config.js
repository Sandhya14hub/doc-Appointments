/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#263241",
        mist: "#F6FAFD",
        cloud: "#EAF4FB",
        calm: "#74AEE7",
        lavender: "#A89AEF",
        sage: "#8FCFC0",
        petal: "#F4B8C6",
        night: "#171526",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(81, 113, 151, 0.14)",
        glow: "0 18px 48px rgba(116, 174, 231, 0.24)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
