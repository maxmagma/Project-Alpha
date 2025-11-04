import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(0 0% 90%)',
        input: 'hsl(0 0% 90%)',
        ring: 'hsl(0 0% 10%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(0 0% 5%)',
        primary: {
          DEFAULT: 'hsl(0 0% 0%)',
          foreground: 'hsl(0 0% 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(0 0% 96%)',
          foreground: 'hsl(0 0% 10%)',
        },
        muted: {
          DEFAULT: 'hsl(0 0% 96%)',
          foreground: 'hsl(0 0% 45%)',
        },
        accent: {
          DEFAULT: 'hsl(0 0% 96%)',
          foreground: 'hsl(0 0% 10%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 0% 0%)',
          foreground: 'hsl(0 0% 100%)',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
