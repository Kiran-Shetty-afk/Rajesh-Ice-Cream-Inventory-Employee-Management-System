import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#241b22",
        cream: "#fff8e8",
        vanilla: "#fff3cf",
        pistachio: "#b7e4d6",
        strawberry: "#d94677",
        blueberry: "#5472d3",
        cocoa: "#5b3f33",
        cone: "#d99a4e",
        saffron: "#f4b73f"
      },
      boxShadow: {
        soft: "0 14px 38px rgba(91, 63, 51, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
