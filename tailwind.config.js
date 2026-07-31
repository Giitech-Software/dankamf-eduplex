/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← Important!
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Dankamf Enterprise Blue System ---
        navy: '#000080',
        midnight: '#191970',
        royal: '#4169E1',
        cobalt: '#0047AB',
        sapphire: '#0F52BA',
        prussian: '#003153',
        cerulean: '#007BA7',
        azure: '#007FFF',
        'bright-blue': '#0096FF',
        'electric-blue': '#7DF9FF',
        'blue-jeans': '#5D8AA8',
        'steel-blue': '#4682B4',
        'sky-blue': '#87CEEB',
        cornflower: '#6495ED',
        periwinkle: '#CCCCFF',
        'powder-blue': '#B0E0E6',
        'light-blue': '#ADD8E6',
        'baby-blue': '#89CFF0',
        'ice-blue': '#E0FFFF',
        'pastel-blue': '#AEC6CF',
        'arctic-blue': '#D6F0FF',
        turquoise: '#00CED1',
        'teal-blue': '#008080',
        'tropical-blue': '#40E0D0',

        // Semantic tokens used by the UI.
        primary: '#000080',
        'primary-dark': '#191970',
        accent: '#007BA7',
        'accent-light': '#D6F0FF',
        highlight: '#F59E0B',      // Legacy warm amber; retain for existing components
        'accent-yellow': '#007BA7', // Legacy utility retained as the enterprise blue CTA token
        'accent-yellow-dark': '#0047AB', // Blue hover/pressed state
        darkgray: '#374151',
        ink: '#111827',
        text: '#374151',
        'text-light': '#6B7280',
        border: '#D1D5DB',
        surface: '#FFFFFF',
        'surface-muted': '#F8FAFC',
        background: '#FFFFFF',    // Pure white for main backgrounds
        'background-alt': '#F8FAFC',
      },
      gray: {
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        600: '#4b5563',
      },

      // Custom prose (typography) styles
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text'),
            a: {
              color: theme('colors.accent'),
              '&:hover': {
                color: theme('colors.primary'),
              },
              textDecoration: 'underline',
            },
            strong: { color: theme('colors.text') },
            h1: { color: theme('colors.text') },
            h2: { color: theme('colors.text') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
