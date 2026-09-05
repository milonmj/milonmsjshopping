import type { Config } from "tailwindcss";

// Brand: pink / black / white — Milon M&J Shopping
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#E6317A",
          pinkDark: "#B81F5E",
          pinkLight: "#FDEAF1",
          ink: "#141414",
          paper: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["var(--font-baloo)", "sans-serif"],
        body: ["var(--font-hind)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
