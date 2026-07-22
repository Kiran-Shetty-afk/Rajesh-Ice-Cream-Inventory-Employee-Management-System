import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        vanilla: "rgb(var(--color-vanilla) / <alpha-value>)",
        pistachio: "rgb(var(--color-pistachio) / <alpha-value>)",
        strawberry: "rgb(var(--color-strawberry) / <alpha-value>)",
        blueberry: "rgb(var(--color-blueberry) / <alpha-value>)",
        cocoa: "rgb(var(--color-cocoa) / <alpha-value>)",
        cone: "rgb(var(--color-cone) / <alpha-value>)",
        saffron: "rgb(var(--color-saffron) / <alpha-value>)"
      },
      boxShadow: {
        soft: "var(--shadow-soft)"
      }
    }
  },
  plugins: []
};

export default config;
