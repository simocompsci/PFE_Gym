/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx}"],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        borderRadius: {
          sm: "var(--radius-sm)",
          md: "var(--radius-md)",
          lg: "var(--radius-lg)",
          xl: "var(--radius-xl)",
        },
        colors: ({ colors }) => ({
          border: "var(--color-border)",
          input: "var(--color-input)",
          ring: "var(--color-ring)",
          background: "var(--color-background)",
          foreground: "var(--color-foreground)",
          primary: {
            DEFAULT: "var(--color-primary)",
            foreground: "var(--color-primary-foreground)",
          },
          secondary: {
            DEFAULT: "var(--color-secondary)",
            foreground: "var(--color-secondary-foreground)",
          },
          destructive: {
            DEFAULT: "var(--color-destructive)",
            foreground: colors.white,
          },
          // Add other colors from your theme
        }),
      },
    },
    plugins: [
      require("tailwindcss-animate"),
      require("@tailwindcss/container-queries"),
    ],
  };