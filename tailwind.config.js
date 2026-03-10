/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2627',
          light: '#F4ECEB',
          dark: '#181C23'
        },
        accent: {
          DEFAULT: '#FFFFFF'
        }
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px'
      }
    },
  },
  plugins: [],
}
