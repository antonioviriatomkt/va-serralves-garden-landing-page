import type { Config } from "tailwindcss";

/**
 * VA Properties — Luxury preset theme tokens.
 * Palette (from okf/brand/visual-identity.md):
 *  - Primary: deep aubergine / plum
 *  - Neutrals: warm travertine / beige
 *  - Accents: muted, earthy (soft brass)
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Straight corners everywhere — every `rounded-*` utility resolves to 0.
    // Change these back to Tailwind's defaults to restore rounded corners.
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    extend: {
      colors: {
        plum: {
          50: "#f6eef2",
          100: "#e9d7e0",
          200: "#cfa9bd",
          300: "#b07f98",
          400: "#8c5771",
          500: "#6e3a50",
          600: "#57293c",
          700: "#451f30",
          800: "#331624",
          900: "#241019",
        },
        travertine: {
          50: "#faf7f1",
          100: "#f3ece0",
          200: "#e7dccb",
          300: "#d8c8ae",
          400: "#c4ae8c",
          500: "#a98b6f",
          600: "#8f7159",
          700: "#715846",
        },
        sand: "#e7dccb",
        cream: "#faf7f1",
        ink: "#2d2a26",
        brass: "#a9855f",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
