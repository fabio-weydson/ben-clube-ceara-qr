/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#4175e7ff",
          700: "#2f5cd7ff",
          800: "#2747b0ff",
          900: "#2a4387ff",
          950: "#1f2c54ff",
        },
      },
    },
  },
  plugins: [],
};
