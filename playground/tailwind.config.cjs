/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-typography')({ target: 'legacy-not-prose' })],
};
