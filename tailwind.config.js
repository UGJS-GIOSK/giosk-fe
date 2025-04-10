/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kioskBg: '#f0eade', // ← 추출한 배경색
      },
    },
  },
  plugins: [],
};
