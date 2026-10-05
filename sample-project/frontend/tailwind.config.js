// Same tokens as the ENSO style guide. Colors are CSS variables (set from the branding settings) mixed with
// <alpha-value>, so opacity modifiers such as `bg-primary/10` work with runtime colors.
const token = (name) => `color-mix(in srgb, var(--color-${name}) calc(<alpha-value> * 100%), transparent)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: token('primary'),
        secondary: token('secondary'),
        neutral: token('neutral'),
        accent: token('accent'),
        bg: token('bg'),
        surface: token('surface'),
        'surface-hover': token('surface-hover'),
        border: token('border'),
        'text-base': token('text'),
        'text-muted': token('text-muted'),
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
