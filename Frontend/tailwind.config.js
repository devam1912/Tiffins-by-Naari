/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#8FAE8E",
        lightbg:"#E7E6B6",
        section:"#D9D9A8",
        darksection:"#8FA873"
      }
    },
  },
  plugins: [],
}