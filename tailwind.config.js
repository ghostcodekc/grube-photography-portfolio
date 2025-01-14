/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./views/**/*.{ejs,html,js}"],
  theme: {
    extend: {
      colors: {
        'default-color': '#14532d'
      },
      fontFamily: {
        sans: ["Quicksand", ...fontFamily.sans],
        instrument: ["Instrument Serif", ...fontFamily.serif],
      }
    }
  },
  plugins: [],
}

