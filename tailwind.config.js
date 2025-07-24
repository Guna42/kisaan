/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        olive: {
          800: '#3F4E4F',
          900: '#2C3E50'
        },
        cream: {
          100: '#F5F5F5' // Light theme background
        }
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '100%': { 'background-position': '200% center' },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease-in-out infinite alternate',
        'fade-in': 'fade-in 1s ease-in',
        'bounce-slow': 'bounce-slow 2.5s infinite',
        'spin-slow': 'spin-slow 6s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
      borderWidth: {
        1: '1px',
      },
    }
  },
  plugins: []
 };
