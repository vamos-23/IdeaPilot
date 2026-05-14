module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brandLight: "#F1F5F9",
        cardLight: "#FFFFFF",
        brandDark: "#0F1D3A",
        cardDark: "#1A2E52",
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
