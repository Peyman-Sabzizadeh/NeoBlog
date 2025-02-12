/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/**/*.{html,js}","./*.{html,js}",],
  darkMode:"class",
  theme: {
    extend: {
      fontFamily: {
        "Vazir": "Vazir",
        "VazirMedium": "Vazir Medium",
        "VazirLight": "Vazir Light",
        "VazirThin": "Vazir Thin",
        "VazirBold": "Vazir Bold"
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          lg: "0.626rem",
          sm: "0.375rem"
        }
      }
    },
  },
  plugins: [
    function({addVariant})
    {
      addVariant('child','& > *');
      addVariant('child-hover','& > *:hover');
    }
  ],
}