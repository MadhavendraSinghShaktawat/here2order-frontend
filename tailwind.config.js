/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'script': ['Dancing Script', 'cursive'],
      },
      colors: {
        'black': '#010101',
        'flamingo': '#f06236',
        'supernova': '#fcc809',
        'white': '#fdfdfd',
        'capeCod': '#414342',
        'gunsmoke': '#838888',
        'tonysPink': '#e7ac94',
        'hacienda': '#8b7813',
      },
      width: {
        'screen': '100vw',
      },
      height: {
        'screen': '100vh',
      },
    },
  },
  plugins: [],
} 