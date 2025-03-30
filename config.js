import themes from "daisyui/src/theming/themes";

// Define the color palette as a separate object for easier export
export const colorPalette = {
  // Primary colors
  primary: "#ad8f68",
  "primary-dark": "#8d7348",
  
  // Secondary colors
  secondary: "#1a1a1a",
  "secondary-dark": "#333333",
  
  // Neutral colors
  neutral: "#f5f1eb",
  "neutral-dark": "#e5e1db",
  
  // Accent colors
  accent: "#6b7280",
  "accent-dark": "#4b5563",
  
  // Base colors
  "base-100": "#ffffff",
  "base-200": "#f9f9f9",
  "base-300": "#f0f0f0",
  "base-content": "#1a1a1a",
  
  // Status colors
  info: "#2196F3",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  
  // Content colors (for text on colored backgrounds)
  "primary-content": "#ffffff",
  "secondary-content": "#ffffff",
  "accent-content": "#ffffff",
  "neutral-content": "#1a1a1a",
  "info-content": "#ffffff",
  "success-content": "#ffffff",
  "warning-content": "#ffffff",
  "error-content": "#ffffff",
  
  // Text colors
  "text-primary": "#333333",
  "text-secondary": "#666666",
  "text-light": "#ffffff",
  
  // Background colors
  "bg-light": "#ffffff",
  "bg-dark": "#1e1e1e",
  "bg-alt": "#f9f9f9",
  
  // Gray scale
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
};

const config = {
  // REQUIRED
  appName: "Sauna Tourist",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription: "Find the best saunas near you in Canada. Browse Finnish, infrared, and steam saunas by location with ratings and reviews. Your ultimate Canadian sauna directory.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "saunatourist.com",
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `Sauna Tourist <noreply@resend.saunatourist.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Marc at Sauna Tourist <marc@resend.saunatourist.com>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "simswillem@gmail.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "saunatourist",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: colorPalette.primary,
  },
  // New centralized theme section for all colors
  theme: colorPalette,
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
  analytics: {
    googleAnalyticsId: 'G-RCST5P3D2D'
  },
};

export default config;
