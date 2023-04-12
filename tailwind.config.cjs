/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,svelte,js}"],
  theme: {
    fontFamily: {
      body: ["Inter", "sans-serif"],
      default: "sans-serif",
      mono: "monospace"
    },
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.pink,
        gray: colors.slate
      },
      minWidth: {
        68: "17rem"
      },
      minHeight: {
        72: "18rem"
      },
      gridTemplateColumns: {
        "2-autoFirst": "auto 1fr"
      }
    }
  },
  plugins: []
};
