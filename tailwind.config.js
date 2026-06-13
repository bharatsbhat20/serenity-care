/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Calm, trustworthy healthcare palette — teal primary, warm coral accent
        brand: {
          50: '#eefbf8',
          100: '#d4f5ee',
          200: '#aee9dd',
          300: '#79d6c7',
          400: '#43bbac',
          500: '#1f9f93',
          600: '#147f77',
          700: '#136661',
          800: '#13514e',
          900: '#134341',
          950: '#042726',
        },
        accent: {
          50: '#fff3ed',
          100: '#ffe2d4',
          200: '#ffc0a8',
          300: '#ff9670',
          400: '#ff6238',
          500: '#fa3c11',
          600: '#eb2607',
          700: '#c31808',
          800: '#9b170f',
          900: '#7d1710',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d4d9e2',
          300: '#aeb7c8',
          400: '#8290a8',
          500: '#62718d',
          600: '#4d5a74',
          700: '#40495e',
          800: '#383f50',
          900: '#1f242f',
          950: '#13161d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(19, 81, 78, 0.08), 0 4px 16px -4px rgba(19, 81, 78, 0.06)',
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 20px -6px rgba(16, 24, 40, 0.08)',
        glow: '0 0 0 4px rgba(31, 159, 147, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(250, 60, 17, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(250, 60, 17, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(250, 60, 17, 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'pulse-ring': 'pulse-ring 2s infinite',
      },
    },
  },
  plugins: [],
}
