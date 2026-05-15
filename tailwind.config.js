/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brandLight: "#F1F5F9",
        brandDark: "#0B0F17",
        cardLight: "#FFFFFF",
        cardDark: "#131926", 
        textLight: "#0F172A", 
        textDark: "#94A3B8", 
        accent: {
          light: "#4338CA",
          dark: "#818CF8", 
        },
      },
      fontFamily: {
        "nata-sans-bold": ["Nata-Sans-Bold"],
        "nata-sans-medium": ["Nata-Sans-Medium"],
      },
    },
  },
  plugins: [],
};
