const config = require('./config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Map all colors from config.theme
        primary: config.theme.primary,
        'primary-dark': config.theme['primary-dark'],
        secondary: config.theme.secondary,
        neutral: config.theme.neutral,
        accent: config.theme.accent,
        'gray-light': config.theme['gray-light'],
        gray: config.theme.gray,
        'gray-dark': config.theme['gray-dark'],
        // Add gray scale for Tailwind's default gray-{n} classes
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        'text-primary': config.theme['text-primary'],
        'text-secondary': config.theme['text-secondary'],
        'text-light': config.theme['text-light'],
        success: config.theme.success,
        warning: config.theme.warning,
        error: config.theme.error,
        info: config.theme.info,
        'bg-light': config.theme['bg-light'],
        'bg-dark': config.theme['bg-dark'],
        'bg-alt': config.theme['bg-alt'],
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      borderRadius: {
        'standard': 'var(--radius-standard)',
        'large': 'var(--radius-large)',
      },
      spacing: {
        'standard': 'var(--spacing-standard)',
        'large': 'var(--spacing-large)',
        'xlarge': 'var(--spacing-xlarge)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient': "linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)",
      },
      animation: {
        opacity: "opacity 0.25s ease-in-out",
        appearFromRight: "appearFromRight 300ms ease-in-out",
        wiggle: "wiggle 1.5s ease-in-out infinite",
        popup: "popup 0.25s ease-in-out",
        shimmer: "shimmer 3s ease-out infinite alternate",
      },
      keyframes: {
        opacity: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        appearFromRight: {
          "0%": { opacity: 0.3, transform: "translate(15%, 0px);" },
          "100%": { opacity: 1, transform: "translate(0);" },
        },
        wiggle: {
          "0%, 20%, 80%, 100%": {
            transform: "rotate(0deg)",
          },
          "30%, 60%": {
            transform: "rotate(-2deg)",
          },
          "40%, 70%": {
            transform: "rotate(2deg)",
          },
          "45%": {
            transform: "rotate(-4deg)",
          },
          "55%": {
            transform: "rotate(4deg)",
          },
        },
        popup: {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "0 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
