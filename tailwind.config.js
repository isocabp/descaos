/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["SpaceGrotesk_700Bold"],
        body: ["Inter_400Regular"],
        bold: ["Inter_700Bold"],
      },
      colors: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        primary: "#111111",
        accent: "#BDFF00",
        danger: "#FF4D4D",
        muted: "#9CA3AF",
      },
    },
  },
  plugins: [],
};
