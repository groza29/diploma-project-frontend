/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        text: '#031716',
        green: '#032F30',
        selected: '#0A7075',
        primary: '#0C969C',
        button: '#6BA3BE',
        'text-secondary': '#274D60',
        'header-background': '#acc3ce',
        background: '#f5f5f5',
        border: '#d9d9d9',
        'green-validation': '#3ba85a',
        red: '#c93636',
      },
    },
  },
  plugins: [],
};
