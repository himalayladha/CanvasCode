/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#1e1e1e',
          surface: '#252526',
          sidebar: '#181818',
          border: '#333333',
          hover: '#2a2d2e',
          active: '#37373d',
          accent: '#007acc',
          accentHover: '#0062a3',
          text: '#cccccc',
          textBright: '#ffffff',
          textMuted: '#858585',
        }
      }
    },
  },
  plugins: [],
}
