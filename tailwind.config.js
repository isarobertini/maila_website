/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Ensure Tailwind scans your files
  theme: {
    extend: {
      colors: {
        lavenderGray: "#c4bed0",
        deepOlive: "#172212",
      },
    },
  },
  plugins: [],
};
