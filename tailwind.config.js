/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#000000',
        surface: '#0B0B0C',
        raised: '#141414',
        muted: '#A1A1AA',
        lavender: '#E5A8F5',
        plum: '#8B1FA0',
        mauve: '#8E5BA8',
        live: '#22C55E',
        verified: '#3B82F6',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        hand: ['Caveat', 'cursive'],
        sig: ['"Mrs Saint Delafield"', 'cursive'],
      },
      maxWidth: { page: '77.5rem' },
    },
  },
  plugins: [],
};
