/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        formTextLight: "#6b7280",
        formTextDark: "#9ca3af",
        brandLight: "#ffffff",
        brandDark: "#020817",
      }
    },
  },
  plugins: [],
};
