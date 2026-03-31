/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D0D0D',
        page: '#F4F0E8',
        paper: '#FDFBF7',
        rule: '#D6D0C4',
        smudge: '#8C8478',
        ghost: '#B8B2A6',
        scarlet: {
          DEFAULT: '#C41E3A',
          dim: '#9E1830',
          soft: 'rgba(196, 30, 58, 0.08)',
        },
        newsprint: '#E8E2D6',
        byline: '#5C5650',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '1px',
        DEFAULT: '2px',
        md: '3px',
        lg: '4px',
        full: '9999px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'editorial-sharp': 'cubic-bezier(0.55, 0, 0.1, 1)',
      },
      transitionDuration: {
        350: '350ms',
        500: '500ms',
        700: '700ms',
      },
      letterSpacing: {
        press: '0.12em',
        headline: '-0.02em',
        caption: '0.06em',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4' }],
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['13px', { lineHeight: '1.6' }],
        base: ['15px', { lineHeight: '1.65' }],
        lg: ['17px', { lineHeight: '1.6' }],
        xl: ['20px', { lineHeight: '1.4' }],
        '2xl': ['25px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.15' }],
        '4xl': ['44px', { lineHeight: '1.05' }],
        '5xl': ['60px', { lineHeight: '1.0' }],
      },
    },
  },
  plugins: [],
};
