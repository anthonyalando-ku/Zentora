/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",

        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          foreground: "#ffffff",
        },

        secondary: {
          DEFAULT: "hsl(var(--color-secondary))",
          foreground: "#ffffff",
        },

        destructive: {
          DEFAULT: "hsl(var(--color-destructive))",
          foreground: "#ffffff",
        },

        border: "hsl(var(--color-border))",
      },
      textColor: {
        destructive: "hsl(var(--color-destructive))",
      },
    },
  },
  plugins: [],
};