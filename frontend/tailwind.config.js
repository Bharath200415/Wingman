/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
    // include any component CSS shipped by libraries (e.g. shadcn)
    "./node_modules/**/tailwind.css",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ── Your existing palette ──────────────────────────
      colors: {
        base:        "#0d0f14",
        surface:     "#13161e",
        "surface-2": "#1a1e2a",
        "surface-3": "#21263a",
        // use CSS variable so `border-border` maps to the shadcn token
        border:      "hsl(var(--border))",
        "border-2":  "#2a3050",
        gold:        "#f5c842",
        "gold-dim":  "#f5c84215",
        "gold-muted":"#f5c84250",
        ink:         "#e8eaf5",
        "ink-2":     "#8b91b0",
        "ink-3":     "#555c7a",
        emerald:     "#10d9a0",
        rose:        "#ff4f72",
        sky:         "#38b6ff",
 
        // ── ShadCN CSS-variable-backed tokens ─────────────
        // These resolve border-border, bg-background, text-foreground etc.
        background:         "hsl(var(--background))",
        foreground:         "hsl(var(--foreground))",
        card: {
          DEFAULT:          "hsl(var(--card))",
          foreground:       "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:          "hsl(var(--popover))",
          foreground:       "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:          "hsl(var(--primary))",
          foreground:       "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:          "hsl(var(--secondary))",
          foreground:       "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:          "hsl(var(--muted))",
          foreground:       "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:          "hsl(var(--accent))",
          foreground:       "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:          "hsl(var(--destructive))",
          foreground:       "hsl(var(--destructive-foreground))",
        },
        // ShadCN border/input/ring — these fix `border-border`
        "border-shadcn":    "hsl(var(--border))",
        input:              "hsl(var(--input))",
        ring:               "hsl(var(--ring))",
      },
 
      // ── ShadCN border-radius token ─────────────────────
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
 
      // ── Your fonts ─────────────────────────────────────
      fontFamily: {
        display: ["'Cabinet Grotesk'", "sans-serif"],
        mono:    ["'Fira Code'",        "monospace"],
        body:    ["'DM Sans'",          "sans-serif"],
        geist: ["Geist Variable", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
 
      // ── Your animations ────────────────────────────────
      animation: {
        "fade-up":    "fadeUp 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        // ShadCN accordion animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
    },
  },
  plugins: [],
};