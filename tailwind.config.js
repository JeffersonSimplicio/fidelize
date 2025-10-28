/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./ui/components/**/*.{js,jsx,ts,tsx}",
    // "./ui/screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F5F5F5",
        surface: "#FFFFFF",
        primary: "#2563EB",
        "primary-dark": "#1E40AF",
        "text-primary": "#111827",
        "text-secondary": "#6B7280",
        border: "#E5E7EB",
        success: "#22C55E",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui"],
      },
      spacing: {
        4.5: "18px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
