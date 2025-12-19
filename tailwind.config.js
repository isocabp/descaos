// tailwind.config.js
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
        // Cores "Gen Z Minimalist"
        background: "#F8F9FA", // Off-white limpo
        surface: "#FFFFFF",
        primary: "#111111", // Preto quase absoluto para texto/bordas
        accent: "#BDFF00", // Verde Neon (Acid Green) para foco/check
        danger: "#FF4D4D", // Vermelho vibrante
        muted: "#9CA3AF",
      },
    },
  },
  plugins: [],
};
