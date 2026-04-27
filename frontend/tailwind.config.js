/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0d0f14",
        surface: "#13161e",
        "surface-2": "#1a1e2a",
        "surface-3": "#21263a",
        border: "#1f2535",
        "border-2": "#2a3050",
        gold: "#f5c842",
        "gold-dim": "#f5c84215",
        "gold-muted": "#f5c84250",
        ink: "#e8eaf5",
        "ink-2": "#8b91b0",
        "ink-3": "#555c7a",
        emerald: "#10d9a0",
        rose: "#ff4f72",
        sky: "#38b6ff",
      },
      fontFamily: {
        display: ["'Cabinet Grotesk'", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
