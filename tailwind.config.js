/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        'primary-dark': '#0056CC',
        'gray-light': '#F5F5F7',
        'gray-text': '#1D1D1F',
        'gray-secondary': '#86868B'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translate3d(0,0,0)'
          },
          '40%, 43%': {
            transform: 'translate3d(0,-10px,0)'
          },
          '70%': {
            transform: 'translate3d(0,-5px,0)'
          },
          '90%': {
            transform: 'translate3d(0,-2px,0)'
          }
        }
      }
    },
  },
  plugins: [],
}