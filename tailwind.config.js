// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Pastikan ini mencakup semua file yang menggunakan kelas Tailwind
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};