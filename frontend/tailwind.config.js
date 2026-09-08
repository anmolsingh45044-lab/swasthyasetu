/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand palette - light pink / soft rose / white with a
        // reserved deep red strictly for emergency / critical actions.
        cream: '#FFFBFA',
        surface: '#FFF3F5', // soft rose surface, used sparingly (not on every card)
        blush: '#FFE1E6', // light pink accent
        coral: '#FF8FA0',
        rose: {
          50: '#FFF5F6',
          100: '#FFE1E6',
          200: '#FFC2CC',
          300: '#FF9DAD',
          400: '#F76C82',
          500: '#E23B5B', // primary brand rose-red
          600: '#C22849',
          700: '#9E1E3B',
          800: '#7A172E',
          900: '#4A0F1C'
        },
        critical: '#C0152B', // deep red, emergency-only
        ink: '#241A20', // charcoal text
        mist: '#F6F5F4'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        soft: '0 6px 20px -6px rgba(126, 30, 55, 0.12)',
        card: '0 2px 10px -2px rgba(74, 15, 28, 0.08)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
};
