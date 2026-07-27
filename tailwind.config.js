/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← Important!
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- New Enterprise Palette for Dankamf Eduplex ---
        primary: '#1E3A8A',      // A strong, professional blue (like Tailwind's blue-800)
        'primary-dark': '#1E293B', // A very dark blue/slate for hover states or dark elements
        accent: '#3B82F6',        // A brighter, friendly blue for links and highlights (blue-500)
        'accent-light': '#EFF6FF', // A very light blue for backgrounds (blue-50)
        highlight: '#F59E0B',      // Legacy warm amber; retain for existing components
        'accent-yellow': '#F4B400', // Enterprise gold for primary buttons and calls to action
        'accent-yellow-dark': '#D99A00', // Button hover/pressed state
        darkgray: '#374151',       // High-contrast enterprise body text
        text: '#374151',            // Keep the existing semantic text class aligned with darkgray
        'text-light': '#6B7280',  // A lighter gray for secondary text (gray-500)
        background: '#FFFFFF',    // Pure white for main backgrounds
        'background-alt': '#F9FAFB', // An off-white for alternate sections (gray-50)
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
