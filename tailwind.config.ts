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
        // STRICT BLACK AND WHITE ONLY - NO COLORS, NO PURPLE
        border: '#000000',
        input: '#000000',
        ring: '#000000',
        background: '#FFFFFF',
        foreground: '#000000',
        primary: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F5F5F5',
          foreground: '#000000',
        },
        muted: {
          DEFAULT: '#FAFAFA',
          foreground: '#737373',
        },
        accent: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        danger: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Courier New"', 'monospace'],
      },
      borderRadius: {
        // BRUTALIST SHARP CORNERS - NO ROUNDED EDGES
        lg: '0',
        md: '0',
        sm: '0',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
