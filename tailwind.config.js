/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1152d4",
        accent: "#f97316", // Construction orange accent
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b",
        "text-primary-light": "#0f172a",
        "text-primary-dark": "#f8fafc",
        "text-secondary-light": "#475569",
        "text-secondary-dark": "#94a3b8",
        "border-light": "#e2e8f0",
        "border-dark": "#334155",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
