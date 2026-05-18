/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: "#0B4F6C",
        turquoise: "#00B4D8",
        sand: "#F4E4C1",
        coral: "#FF6B6B",
        offwhite: "#FAF7F2",
        charcoal: "#1B1B1F",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ['"Inter"', "sans-serif"],
      },
    },
  },
  plugins: [],
}