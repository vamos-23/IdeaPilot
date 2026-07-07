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
        
        borderLight: "#D1D5DB", 
        borderDark: "#2563EB", 

        accent: {
          light: "#4338CA",
          dark1: "#4F46E5",
          dark2: "#818CF8",
        },
        accentBg: {
          light: "rgba(67,56,202,0.10)",
          dark: "rgba(129,140,248,0.10)",
        },

        // --- TEXT ---
        textLight: "#0F172A", // Dark Slate
        textDark: "#94A3B8",  // Slate gray
      },
      fontFamily: {
        "nata-sans-bold": ["Nata-Sans-Bold"],
        "nata-sans-medium": ["Nata-Sans-Medium"],
      },
    },
  },
  plugins: [],
};