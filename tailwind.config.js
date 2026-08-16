/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#090B10',
          800: '#0E121B',
          700: '#141926',
          600: '#1A2133',
          500: '#1F273B'
        },
        orange: {
          500: '#FF5E14',
          600: '#E54E07',
          coral: '#FF5A36'
        },
        canvas: '#F5F6FA'
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
