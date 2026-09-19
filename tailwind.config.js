/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4AF37',
          'gold-hover': '#B5952F',
          dark: '#121212',
          card: '#1E1E1E',
          muted: '#2A2A2A',
          border: '#333333',
        },
      },
    },
  },
  plugins: [],
};
