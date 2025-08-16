/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        formTextLight: "#6b7280",
        formTextDark: "#C7C7C7",
        brandLight: "#ffffff",
        brandDark: "#060C1C",
        formContainer: "#141433",
      },
      fontFamily: {
        "nata-sans-bold": ["Nata-Sans-Bold"],
        "nata-sans-medium" : ["Nata-Sans-Medium"]
      },
    },
  },
  plugins: [],
};
