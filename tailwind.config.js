/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#f59e0b',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
