/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF2F9',
          400: '#46618F',
          600: '#223A63',
          700: '#1A2C4D',
          900: '#10192E',
        },
      },
    },
  },
  plugins: [],
};