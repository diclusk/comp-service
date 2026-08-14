/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // di dalam theme.extend
        keyframes: {
          'border-shine': {
            '0%': { backgroundPosition: '0% 50%' },
            '100%': { backgroundPosition: '200% 50%' },
          },
            'star-rotate': {
            '100%': { transform: 'rotate(360deg)' },
          },
        },

        animation: {
          'border-shine': 'border-shine 3s linear infinite',
          'star-rotate': 'star-rotate 4s linear infinite',
        },
      
      colors: {
        navy: {
          50: '#EEF2F9',
          400: '#46618F',
          600: '#223A63',
          700: '#1A2C4D',
          900: '#10192E',
          950: '#000926',
        },
      },
    },
  },
  plugins: [],
};