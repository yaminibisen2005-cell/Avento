/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C3A',
          dark: '#0a3629',
          light: '#1b644f',
        },
        accent: {
          DEFAULT: '#C89B3C',
          dark: '#a67d2b',
          light: '#d9b25b',
        },
        ivory: {
          DEFAULT: '#FAF8F3',
          dark: '#f4f1e8',
        },
        lightGreen: '#E8F5EF',
        goldGlow: '#F6E6BF',
        charcoal: '#1F2937',
      },
      fontFamily: {
        sans: ['"Sora"', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Clash Display"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        'premium': '20px',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(15, 76, 58, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'premium-hover': '0 20px 40px -15px rgba(15, 76, 58, 0.15), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'glass': '0 20px 50px rgba(15, 76, 58, 0.09), 0 4px 14px rgba(0, 0, 0, 0.04)',
        'glass-hover': '0 25px 60px rgba(15, 76, 58, 0.15), 0 8px 22px rgba(0, 0, 0, 0.07)',
        'macbook': '0 35px 80px -15px rgba(15, 76, 58, 0.22), 0 20px 40px -10px rgba(0, 0, 0, 0.18)',
      }
    },
  },
  plugins: [],
}
