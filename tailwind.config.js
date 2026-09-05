/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        status: {
          paid: {
            DEFAULT: 'hsl(var(--status-paid))',
            foreground: 'hsl(var(--status-paid-foreground))',
            bg: 'hsl(var(--status-paid-bg))',
            border: 'hsl(var(--status-paid-border))',
          },
          pending: {
            DEFAULT: 'hsl(var(--status-pending))',
            foreground: 'hsl(var(--status-pending-foreground))',
            bg: 'hsl(var(--status-pending-bg))',
            border: 'hsl(var(--status-pending-border))',
          },
          overdue: {
            DEFAULT: 'hsl(var(--status-overdue))',
            foreground: 'hsl(var(--status-overdue-foreground))',
            bg: 'hsl(var(--status-overdue-bg))',
            border: 'hsl(var(--status-overdue-border))',
          },
          draft: {
            DEFAULT: 'hsl(var(--status-draft))',
            foreground: 'hsl(var(--status-draft-foreground))',
            bg: 'hsl(var(--status-draft-bg))',
            border: 'hsl(var(--status-draft-border))',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
