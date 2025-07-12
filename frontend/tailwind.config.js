import forms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'Noto Sans', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1978e5',
          dark: '#0f63c4',
          light: '#b5d3fa',
        },
      },
    },
  },
  plugins: [forms],
}
