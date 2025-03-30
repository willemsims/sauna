const config = require('./config');
const { colorPalette } = require('./config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: colorPalette,
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
        shimmer: "shimmer 2s linear infinite",
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
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        saunatourist: {
          "primary": colorPalette.primary,
          "primary-focus": colorPalette["primary-dark"],
          "primary-content": colorPalette["primary-content"],
          "secondary": colorPalette.secondary,
          "secondary-focus": colorPalette["secondary-dark"],
          "secondary-content": colorPalette["secondary-content"],
          "accent": colorPalette.accent,
          "accent-focus": colorPalette["accent-dark"],
          "accent-content": colorPalette["accent-content"],
          "neutral": colorPalette.neutral,
          "neutral-focus": colorPalette["neutral-dark"],
          "neutral-content": colorPalette["neutral-content"],
          "base-100": colorPalette["base-100"],
          "base-200": colorPalette["base-200"],
          "base-300": colorPalette["base-300"],
          "base-content": colorPalette["base-content"],
          "info": colorPalette.info,
          "info-content": colorPalette["info-content"],
          "success": colorPalette.success,
          "success-content": colorPalette["success-content"],
          "warning": colorPalette.warning,
          "warning-content": colorPalette["warning-content"],
          "error": colorPalette.error,
          "error-content": colorPalette["error-content"],
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
