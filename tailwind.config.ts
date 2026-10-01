import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        marshall: {
          black: "#050505",
          void: "#030303",
          card: "#0B0B0B",
          surface: "#121212",
          surfaceHover: "#181818",
          brass: "#C9A45C",
          brassLight: "#E0BE75",
          brassMuted: "#8E723D",
          brassGlow: "rgba(201, 164, 92, 0.35)",
          redLed: "#FF2B2B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      letterSpacing: {
        widest: "0.25em",
        ultra: "0.35em",
      },
      boxShadow: {
        "brass-glow": "0 0 35px -5px rgba(201, 164, 92, 0.3)",
        "brass-glow-lg": "0 0 65px -10px rgba(201, 164, 92, 0.45)",
        "red-glow": "0 0 20px 2px rgba(255, 43, 43, 0.5)",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
