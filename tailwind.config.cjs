/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,svelte,js}"],
  theme: {
    fontFamily: {
      body: ["Inter", "sans-serif"],
      default: "sans-serif",
      mono: "monospace"
    },
    extend: {
      minWidth: {
        72: "18rem"
      },
      gridTemplateColumns: {
        "2-autoFirst": "auto 1fr"
      }
    }
  },
  plugins: []
};
