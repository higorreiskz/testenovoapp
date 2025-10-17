import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#7C3AED",
        secondary: "#22D3EE",
        accent: "#F59E0B",
        dark: {
          50: "#1F1F38",
          100: "#18182F",
          200: "#131326",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(124, 58, 237, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
