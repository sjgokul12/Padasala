/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        ink: {
          900: '#0b1f33',
          700: '#1e3a52',
          500: '#466279',
          300: '#9ab1c2',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(8, 47, 73, 0.18)',
        glass: '0 8px 32px -8px rgba(8, 47, 73, 0.22)',
        glow: '0 0 0 1px rgba(14,165,233,0.15), 0 18px 40px -18px rgba(2,132,199,0.45)',
      },
      backgroundImage: {
        'grid-sky': 'radial-gradient(circle at 1px 1px, rgba(2,132,199,0.12) 1px, transparent 0)',
        'hero-sky': 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #ffffff 100%)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'plane-bob': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(8px, -10px) rotate(4deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
        'plane-bob': 'plane-bob 5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        fadeUp: 'fadeUp 0.6s ease-out both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
