/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

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
        secondary: colors.blue,
        accent: colors.pink,
        gray: colors.slate,
        scybergreen: "#00d455"
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
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("e", "&:not(:disabled)");
      addVariant("activated", "&:is(:active,.activated)");
    })
  ]
};
