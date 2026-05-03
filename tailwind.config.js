/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brandLight: "#F1F5F9",
        cardLight: "#FFFFFF",
        brandDark: "#011035",
        cardDark: "#111E43",
        textLight: "#082F32",
        textDark: "#94a3b8",
      },
      fontFamily: {
        "nata-sans-bold": ["Nata-Sans-Bold"],
        "nata-sans-medium": ["Nata-Sans-Medium"],
      },
    },
  },
};
